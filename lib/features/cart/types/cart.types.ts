import z from "zod";
import { CreateCartSchema, CartItemSchema, ShippingAddressSchema } from "../schemas/cart.schemas";

export type Cart = z.infer<typeof CreateCartSchema> & { id: string };

export type CartItem = z.infer<typeof CartItemSchema>;

export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;
