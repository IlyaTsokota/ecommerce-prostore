"use client";

import { Cart } from "@/lib/features/cart/types/cart.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useTransition } from "react";

interface CartTableProps {
    cart: Cart | null;
}

const CartTable: FC<CartTableProps> = ({ cart }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    return (
        <>
            <h1 className="py-4 h2-bold">Shopping Cart</h1>
            {!cart || !cart.items.length ? (
                <div>
                    Cart is empty. <Link href="/">Go Shopping</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-4 md:gap-5">
                    <div className="overflow-x-auto md:col-span-3">Table</div>
                </div>
            )}
        </>
    );
};

export default CartTable;
