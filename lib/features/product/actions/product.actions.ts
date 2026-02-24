"use server";

import { LATEST_PRODUCTS_LIMIT } from "../../../constants";
import prisma from "../../../../db/prisma";
import { Product } from "@/lib/features/product/types/product.types";
import { convertToPlainObject } from "../../../utils";
import { cache } from "react";

export async function getLatestProducts(): Promise<Product[]> {
    const data = await prisma.product.findMany({
        orderBy: {
            createdAt: "desc",
        },
        take: LATEST_PRODUCTS_LIMIT,
    });

    return convertToPlainObject(data);
}

export const getProductBySlug = cache(async (slug: string): Promise<Product> => {
    console.log("get slug");

    const data = await prisma.product.findUnique({
        where: {
            slug,
        },
    });

    return convertToPlainObject(data);
});
