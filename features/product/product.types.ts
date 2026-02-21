import z from "zod";
import { CreateProductSchema, ResponseProductSchema, UpdateProductSchema } from "./product.schema";

export type Product = z.infer<typeof ResponseProductSchema>;

export type CreateProductInput = z.infer<typeof CreateProductSchema>;

export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
