import { CurrencySchema } from "@/lib/features/base/schemas/base.schema";
import z from "zod";

export const CartItemSchema = z.object({
    productId: z.string().min(1, "Product Id is required"),
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    qty: z.number().int().nonnegative("Quantity must be a positive number"),
    image: z.string().min(1, "Image is required"),
    price: CurrencySchema,
});

export const CreateCartSchema = z.object({
    items: z.array(CartItemSchema),
    itemsPrice: CurrencySchema,
    totalPrice: CurrencySchema,
    shippingPrice: CurrencySchema,
    taxPrice: CurrencySchema,
    sessionCartId: z.string().min(1, "Session cart id is required"),
    userId: z.string().optional(),
});

export const ShippingAddressSchema = z.object({
    fullName: z.string().min(3, "Name must be at least 3 characters"),
    streetAddress: z.string().min(3, "Address must be at least 3 characters"),
    city: z.string().min(3, "City must be at least 3 characters"),
    postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
    country: z.string().min(3, "Country must be at least 3 characters"),
    lat: z.number().optional(),
    lng: z.number().optional(),
});
