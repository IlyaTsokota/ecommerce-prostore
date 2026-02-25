import { auth } from "@/auth";
import { getMyCart } from "@/lib/features/cart/actions/cart.actions";
import { getUserById } from "@/lib/features/user/actions/user.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import ShippingAddressForm from "./shipping-address-form";
import { ShippingAddress } from "@/lib/features/cart/types/cart.types";
import CheckoutSteps from "@/components/shared/checkout/checkout-steps";

export const metadata: Metadata = {
    title: "Shipping Address",
};

const ShippingAddressPage = async () => {
    const cart = await getMyCart();

    if (!cart || !cart.items.length) {
        redirect("/cart");
    }

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) throw new Error("No user ID");

    const user = await getUserById(userId);

    return (
        <>
            <CheckoutSteps current={1} />
            <ShippingAddressForm address={user.address as ShippingAddress} />
        </>
    );
};

export default ShippingAddressPage;
