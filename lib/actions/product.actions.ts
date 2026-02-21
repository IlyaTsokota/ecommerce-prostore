"use server";

import { LATEST_PRODUCTS_LIMIT } from "../constants";
import prisma from "../../db/prisma";
import { Product } from "@/features/product/product.types";
import { convertToPlainObject } from "../utils";

export async function getLatestProducts(): Promise<Product[]> {
    const data = await prisma.product.findMany({
        orderBy: {
            createdAt: "desc",
        },
        take: LATEST_PRODUCTS_LIMIT,
    });

    return convertToPlainObject(data);
}
