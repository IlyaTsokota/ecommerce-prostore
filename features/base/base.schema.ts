import { formatNumberWithDecimal } from "@/lib/utils";
import z from "zod";

export const CurrencySchema = z
    .string()
    .refine(
        (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
        "Price must have exactly two decimal places",
    );
