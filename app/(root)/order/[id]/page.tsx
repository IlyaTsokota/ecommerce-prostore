import { getOrderById } from "@/lib/features/order/actions/order.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { FC } from "react";
import OrderDetailsTable from "./order-details-table";
import { auth } from "@/auth";
import { Role } from "@/lib/generated/prisma/enums";

export const metadata: Metadata = {
    title: "Order Details",
};

interface OrderDetailsPageProps {
    params: Promise<{ id: string }>;
}

const OrderDetailsPage: FC<OrderDetailsPageProps> = async ({ params }) => {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
        notFound();
    }

    const session = await auth();

    return (
        <OrderDetailsTable
            order={order}
            paypalClientId={process.env.paypalClientId || "sb"}
            isAdmin={session?.user?.role === Role.ADMIN}
        />
    );
};

export default OrderDetailsPage;
