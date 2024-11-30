import { z } from "zod";

// Define the Zod schema for signup validation
export const signUpSchema = z.object({
  username: z
    .string()
    .nonempty("Username is required")
    .trim()
    .regex(/^\S+$/, "Username cannot contain spaces"), // Optional: No spaces
  email: z
    .string()
    .nonempty("Email is required")
    .email("Please use a valid email address"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters long"), // Customize password rules as needed
});
