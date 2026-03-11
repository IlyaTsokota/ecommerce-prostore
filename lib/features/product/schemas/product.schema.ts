import { z } from "zod";
import { CurrencySchema } from "../../base/schemas/base.schema";

const BaseProductSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters"),
    category: z.string().min(3, "Category must be at least 3 characters"),
    brand: z.string().min(3, "Brand must be at least 3 characters"),
    description: z.string().min(3, "Description must be at least 3 characters"),
    stock: z.coerce.number<number>().int().nonnegative(),
    rating: z.coerce.number<number>().nonnegative(),
    numReviews: z.number(),
    images: z.array(z.string()).min(1, "Product must have at least one image"),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: CurrencySchema,
});

export const CreateProductSchema = BaseProductSchema;

export const UpdateProductSchema = BaseProductSchema.extend({
    id: z.uuid().min(1, "Id is required"),
});

export const ResponseProductSchema = BaseProductSchema.extend({
    id: z.uuid(),
    createdAt: z.date(),
});
