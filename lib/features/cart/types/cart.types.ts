import z from "zod";
import { CreateCartSchema, CartItemSchema } from "../schemas/cart.schemas";

export type Cart = z.infer<typeof CreateCartSchema> & { id: string };

export type CartItem = z.infer<typeof CartItemSchema>;
