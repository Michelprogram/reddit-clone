import { z } from "zod";

export const SubredditSchema = z.object({
  name: z.string().min(3).max(21),
});

export const SubredditSubcriptionSchema = z.object({
    subredditId: z.string(),
})

export type CreateSubredditPayload = z.infer<typeof SubredditSchema>;
export type SubcribeSubredditPayload = z.infer<typeof SubredditSubcriptionSchema>;