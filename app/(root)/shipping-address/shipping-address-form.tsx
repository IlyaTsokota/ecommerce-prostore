"use client";

import { ShippingAddressSchema } from "@/lib/features/cart/schemas/cart.schemas";
import { ShippingAddress } from "@/lib/features/cart/types/cart.types";
import { useRouter } from "next/navigation";
import { FC, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { updateUserAddress } from "@/lib/features/user/actions/user.actions";
import { toast } from "sonner";

interface ShippingAddressFormProps {
    address?: ShippingAddress;
}

const shippingAddressDefaultValues = {
    city: "",
    country: "",
    fullName: "",
    postalCode: "",
    streetAddress: "",
};

const ShippingAddressForm: FC<ShippingAddressFormProps> = ({ address }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<ShippingAddress>({
        resolver: zodResolver(ShippingAddressSchema),
        defaultValues: address ?? shippingAddressDefaultValues,
        mode: "onChange",
    });

    function onSubmit(data: ShippingAddress) {
        startTransition(async () => {
            const response = await updateUserAddress(data);

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            router.push("/payment-method");
            toast.success(response.message);
        });
    }

    return (
        <div className="max-w-md mx-auto space-y-4">
            <h1 className="h2-bold mt-4">Shipping Address</h1>
            <p className="text-sm text-muted-foreground">Please enter an address to ship</p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Controller
                    name="fullName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                            <Input
                                {...field}
                                id="fullName"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter full name"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="streetAddress"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="streetAddress">Address</FieldLabel>
                            <Input
                                {...field}
                                id="streetAddress"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter address"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="city"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="city">City</FieldLabel>
                            <Input
                                {...field}
                                id="city"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter city"
                                autoComplete="off"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="postalCode"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="postalCode">Postal Code</FieldLabel>
                            <Input
                                {...field}
                                id="postalCode"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter postal code"
                                autoComplete="off"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="country"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="country">Country</FieldLabel>
                            <Input
                                {...field}
                                id="country"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter country"
                                autoComplete="off"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <div className="flex gap-2">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? (
                            <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                            <ArrowRight className="h-4 w-4" />
                        )}{" "}
                        Continue
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ShippingAddressForm;
