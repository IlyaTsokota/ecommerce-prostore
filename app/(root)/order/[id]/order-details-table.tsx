"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Order } from "@/lib/features/order/types/order.types";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FC, useTransition } from "react";
import {
    INSTANCE_LOADING_STATE,
    OnApproveDataOneTimePayments,
    PayPalOneTimePaymentButton,
    PayPalProvider,
    usePayPal,
} from "@paypal/react-paypal-js/sdk-v6";
import {
    approvePayPalOrder,
    createPayPalOrder,
    deliverOrder,
    updateOrderToPaidCOD,
} from "@/lib/features/order/actions/order.actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface OrderDetailsTableProps {
    order: Order;
    paypalClientId: string;
    isAdmin: boolean;
}

const PrintLoadingState = () => {
    const { loadingStatus } = usePayPal();

    const isPending = loadingStatus === INSTANCE_LOADING_STATE.PENDING;
    const isRejected = loadingStatus === INSTANCE_LOADING_STATE.REJECTED;

    return isPending ? "Loading PayPal..." : isRejected ? "Error Loading PayPal" : "";
};

const OrderDetailsTable: FC<OrderDetailsTableProps> = ({ order, paypalClientId, isAdmin }) => {
    const {
        id,
        shippingAddress,
        orderItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentMethod,
        isPaid,
        paidAt,
        isDelivered,
        deliveredAt,
    } = order;

    const MarkAsPaidButton = () => {
        const [isPending, startTransition] = useTransition();

        return (
            <Button
                type="button"
                disabled={isPending}
                onClick={() =>
                    startTransition(async () => {
                        const res = await updateOrderToPaidCOD(order.id);

                        toast[res.success ? "success" : "error"](res.message);
                    })
                }
                className="cursor-pointer"
            >
                {isPending ? <Loader className="w-4 h-4 animate-spin" /> : "Mark As Paid"}
            </Button>
        );
    };

    const MarkAsDeliveredButton = () => {
        const [isPending, startTransition] = useTransition();

        return (
            <Button
                type="button"
                disabled={isPending}
                onClick={() =>
                    startTransition(async () => {
                        const res = await deliverOrder(order.id);

                        toast[res.success ? "success" : "error"](res.message);
                    })
                }
                className="cursor-pointer"
            >
                {isPending ? <Loader className="w-4 h-4 animate-spin" /> : "Mark As Delivered"}
            </Button>
        );
    };

    return (
        <>
            <h1 className="py-4 text-2xl"> Order {formatId(order.id)}</h1>
            <div className="grid md:grid-cols-3 md:gap-5">
                <div className="overflow-x-auto md:col-span-2 space-y-4">
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Payment Method</h2>
                            <p>{paymentMethod}</p>
                            {isPaid ? (
                                <Badge variant="secondary">
                                    Paid at {formatDateTime(paidAt!).dateTime}
                                </Badge>
                            ) : (
                                <Badge variant="destructive">Not paid</Badge>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Shipping Address</h2>
                            <p>{shippingAddress.fullName}</p>
                            <p>
                                {shippingAddress.streetAddress}, {shippingAddress.city},{" "}
                                {shippingAddress.postalCode}, {shippingAddress.country}{" "}
                            </p>
                            {isDelivered ? (
                                <Badge variant="secondary">
                                    Delivered at {formatDateTime(deliveredAt!).dateTime}
                                </Badge>
                            ) : (
                                <Badge variant="destructive">Not delivered</Badge>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 gap-4">
                            <h2 className="text-xl pb-4">Order Items</h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderItems.map((item) => (
                                        <TableRow key={item.slug}>
                                            <TableCell>
                                                <Link
                                                    href={`/product/${item.slug}`}
                                                    className="flex items-center"
                                                >
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={50}
                                                        height={50}
                                                    ></Image>
                                                    <span className="px-2">{item.name}</span>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <span className="px-2">{item.qty}</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                ${item.price}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardContent className="p-4 space-y-4 gap-4">
                            <h2 className="text-xl pb-4">Order Summary</h2>
                            <div className="flex justify-between">
                                <div>Items</div>
                                <div>{formatCurrency(itemsPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Tax</div>
                                <div>{formatCurrency(taxPrice)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div>Shipping</div>
                                <div>{formatCurrency(shippingPrice)}</div>
                            </div>
                            <hr />
                            <div className="flex justify-between">
                                <div>Total</div>
                                <div>{formatCurrency(totalPrice)}</div>
                            </div>

                            {!isPaid && paymentMethod === "PayPal" && (
                                <div>
                                    <PayPalProvider clientId={paypalClientId}>
                                        <PrintLoadingState />
                                        <PayPalOneTimePaymentButton
                                            presentationMode="auto"
                                            createOrder={async () => {
                                                const result = await createPayPalOrder(order.id);

                                                if (!result.success) {
                                                    toast.error(result.message);
                                                }

                                                return { orderId: result.data };
                                            }}
                                            onApprove={async (
                                                data: OnApproveDataOneTimePayments,
                                            ) => {
                                                const res = await approvePayPalOrder(id, data);

                                                toast[res.success ? "success" : "error"](
                                                    res.message,
                                                );
                                            }}
                                        />
                                    </PayPalProvider>
                                </div>
                            )}

                            {isAdmin && !isPaid && paymentMethod === "CashOnDelivery" && (
                                <MarkAsPaidButton />
                            )}

                            {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default OrderDetailsTable;
