import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters."),

    email: z.string().trim().email("Enter a valid email address."),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters.")
      .regex(/[A-Z]/, "At least one uppercase letter is required.")
      .regex(/[a-z]/, "At least one lowercase letter is required."),

    confirmPassword: z.string(),

    image: z.union([
      z.string().url("Enter a valid image URL."),
      z.literal(""),
    ]),

    role: z.enum(["customer", "vendor"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;