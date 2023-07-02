import { db } from "@/lib/db";
import PostFeed from "./PostFeed";
import { INFINITE_SCROLL } from "@/app/cons";
import { getAuthSession } from "@/lib/auth";

const CustomFeed = async () => {
  const session = await getAuthSession();

  const followedSubreddits = await db.subscription.findMany({
    where: {
      userId: session?.user?.id,
    },
    include: {
      subreddit: true,
    },
  });

  const posts = await db.post.findMany({
    where: {
      subreddit: {
        name: {
          in: followedSubreddits.map(({ subreddit }) => subreddit.id),
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
      votes: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLL,
  });

  return <PostFeed initialPosts={posts} />;
};

export default CustomFeed;
