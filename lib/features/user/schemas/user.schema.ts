import z from "zod";

export const UpdateProfileSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.email().min(1, "Email is required"),
});

export const UpdateUserSchema = UpdateProfileSchema.extend({
    id: z.string().min(1, "Id is required"),
    role: z.string().min(1, "Role is required"),
});
