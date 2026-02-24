"use client";

import { Button } from "@/components/ui/button";
import { addItemToCart } from "@/lib/features/cart/actions/cart.actions";
import { CartItem } from "@/lib/features/cart/types/cart.types";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { toast } from "sonner";

interface AddToCartProps {
    item: CartItem;
}

const AddToCart: FC<AddToCartProps> = ({ item }) => {
    const router = useRouter();

    const handleAddToCart = async () => {
        const response = await addItemToCart(item);

        if (!response.success) {
            toast.error(response.message);

            return;
        }

        toast.success(`${item.name} added to cart`, {
            action: (
                <Button
                    className="bg-primary text-white hover:bg-gray-800"
                    onClick={() => router.push("/cart")}
                >
                    Go To Cart
                </Button>
            ),
        });
    };

    return (
        <Button className="w-full" type="button" onClick={handleAddToCart}>
            <Plus /> Add To Cart
        </Button>
    );
};

export default AddToCart;
