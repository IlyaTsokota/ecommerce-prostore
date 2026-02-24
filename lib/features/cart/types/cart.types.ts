import z from "zod";
import { CreateCartSchema, CartItemSchema } from "../schemas/cart.schemas";

export type Cart = z.infer<typeof CreateCartSchema>;

export type CartItem = z.infer<typeof CartItemSchema>;
