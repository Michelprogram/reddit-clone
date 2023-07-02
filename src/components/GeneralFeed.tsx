import { db } from "@/lib/db";
import PostFeed from "./PostFeed";
import { INFINITE_SCROLL } from "@/app/cons";

const GeneralFeed = async () => {
  const posts = await db.post.findMany({
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

export default GeneralFeed;
