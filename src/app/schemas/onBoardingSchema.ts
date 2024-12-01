import { z } from "zod";

export const onBoardingSchema = z.object({
  fullName: z.string(),
  avatar: z.string(),
  bio: z.string(),
});
