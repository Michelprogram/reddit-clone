import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { PostVoteValidator } from "@/lib/validators/vote";
import { CachedPost } from "@/types/redis";
import { Post, Vote, VoteType } from "@prisma/client";
import { z } from "zod";

const CACHE_AFTER_UPVOTES = 1;

const cacheRedis = async (post: any, voteType: VoteType) => {
  const votesAmt = post.votes.reduce((acc: number, vote: Vote) => {
    if (vote.type === "UP") return acc + 1;
    if (vote.type === "DOWN") return acc - 1;
    return acc;
  }, 0);

  if (votesAmt >= CACHE_AFTER_UPVOTES) {
    const cachePayload: CachedPost = {
      id: post.id,
      title: post.title,
      author: post.author.username ?? "",
      content: JSON.stringify(post.content),
      currentVote: voteType,
      createdAt: post.createdAt,
    };

    await redis.hset(`post:${post.id}`, cachePayload);
  }
};

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { postId, voteType } = PostVoteValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const existingVote = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        postId: postId,
      },
    });

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });

    if (!post) {
      return new Response("Post not found", {
        status: 404,
      });
    }

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId: postId,
              userId: session.user.id,
            },
          },
        });

        cacheRedis(post, voteType);
      }
      return new Response("Done", {
        status: 200,
      });
    }

    await db.vote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        postId: postId,
      },
    });

    cacheRedis(post, voteType);
    return new Response("Done", {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not post to subreddit at this time. Please try later",
      { status: 500 }
    );
  }
}
