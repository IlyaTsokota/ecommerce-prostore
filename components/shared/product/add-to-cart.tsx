"use client";

import { Button } from "@/components/ui/button";
import { addItemToCart, removeItemFormCart } from "@/lib/features/cart/actions/cart.actions";
import { Cart, CartItem } from "@/lib/features/cart/types/cart.types";
import { Loader, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useTransition } from "react";
import { toast } from "sonner";

interface AddToCartProps {
    item: CartItem;
    cart: Cart | null;
}

const AddToCart: FC<AddToCartProps> = ({ item, cart }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const existItem = cart?.items.find((cartItem) => cartItem.productId === item.productId);

    const handleAddToCart = async () => {
        startTransition(async () => {
            const response = await addItemToCart(item);

            if (!response.success) {
                toast.error(response.message);

                return;
            }

            toast.success(response.message, {
                action: (
                    <Button
                        className="bg-primary text-white hover:bg-gray-800"
                        onClick={() => router.push("/cart")}
                    >
                        Go To Cart
                    </Button>
                ),
            });
        });
    };

    const handleRemoveFromCart = async () => {
        startTransition(async () => {
            const response = await removeItemFormCart(item.productId);

            toast[response.success ? "success" : "error"](response.message);
        });
    };

    return existItem ? (
        <div className="flex items-center">
            <Button type="button" variant="outline" onClick={handleRemoveFromCart}>
                {isPending ? (
                    <Loader className="h-4 w-4 animate-spin" />
                ) : (
                    <Minus className="h-4 w-4" />
                )}
            </Button>
            <span className="px-2">{existItem.qty}</span>
            <Button type="button" variant="outline" onClick={handleAddToCart}>
                {isPending ? (
                    <Loader className="h-4 w-4 animate-spin" />
                ) : (
                    <Plus className="h-4 w-4" />
                )}
            </Button>
        </div>
    ) : (
        <Button className="w-full" type="button" onClick={handleAddToCart}>
            {isPending ? <Loader className="animate-spin" /> : <Plus />} Add To Cart
        </Button>
    );
};

export default AddToCart;
