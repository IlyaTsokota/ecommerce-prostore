import { PAYMENT_METHODS } from "@/lib/constants";
import z from "zod";
import { CurrencySchema } from "../../base/schemas/base.schema";
import { ShippingAddressSchema } from "../../cart/schemas/cart.schemas";

export const PaymentMethodSchema = z
    .object({
        type: z.string().min(1, "Payment method is required"),
    })
    .refine((data) => PAYMENT_METHODS.includes(data.type), {
        path: ["type"],
        error: "Invalid payment method",
    });

export const CreateOrderSchema = z.object({
    userId: z.string().min(1, "User is required"),
    itemsPrice: CurrencySchema,
    totalPrice: CurrencySchema,
    shippingPrice: CurrencySchema,
    taxPrice: CurrencySchema,
    paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
        error: "Invalid payment method",
    }),
    shippingAddress: ShippingAddressSchema,
});

export const CreateOrderItemSchema = z.object({
    productId: z.string(),
    slug: z.string(),
    image: z.string(),
    name: z.string(),
    price: CurrencySchema,
    qty: z.number(),
});

export const PaymentResultSchema = z.object({
    id: z.string(),
    status: z.string(),
    email_address: z.string(),
    pricePaid: z.string(),
});
