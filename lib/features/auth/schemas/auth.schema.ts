import { PasswordSchema } from "@/lib/features/base/schemas/base.schema";
import * as z from "zod";

const BaseAuthSchema = z.object({
    email: z.email("Invalid email").min(1, "Email is required"),
    password: PasswordSchema,
});

export const SignInFormSchema = BaseAuthSchema;

export const SignUpFormSchema = BaseAuthSchema.extend({
    name: z.string().min(3, "Name must be at least than 3 characters"),
    confirmPassword: PasswordSchema,
}).refine((data) => data.password === data.confirmPassword, {
    error: "Password don't match",
    path: ["confirmPassword"],
});
