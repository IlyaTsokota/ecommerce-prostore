import { z } from "zod";
import { CurrencySchema } from "../base/base.schema";

export const BaseProductSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters"),
    category: z.string().min(3, "Category must be at least 3 characters"),
    brand: z.string().min(3, "Brand must be at least 3 characters"),
    description: z.string().min(3, "Description must be at least 3 characters"),
    stock: z.coerce.number().int().nonnegative(),
    rating: z.number(),
    numReviews: z.number(),
    images: z.array(z.string()).min(1, "Product must have at least one image"),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: CurrencySchema,
});

export const CreateProductSchema = BaseProductSchema;

export const UpdateProductSchema = BaseProductSchema.partial()
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
    });

export const ResponseProductSchema = BaseProductSchema.extend({
    id: z.uuid(),
    createdAt: z.date(),
});
