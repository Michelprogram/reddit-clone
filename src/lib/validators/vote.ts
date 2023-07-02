import { z } from "zod";

export const PostVoteValidator = z.object({
  postId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
});

export const PostCommentValidator = z.object({
  commentId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
});

export type PostVoteValidatorRequest = z.infer<typeof PostVoteValidator>;
export type PostCommentValidatorRequest = z.infer<typeof PostCommentValidator>;
