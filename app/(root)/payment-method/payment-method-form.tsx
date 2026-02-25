"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { PaymentMethodSchema } from "@/lib/features/checkout/schemas/checkout.schema";
import { updateUserPaymentMethod } from "@/lib/features/user/actions/user.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface PaymentMethodFormProps {
    preferredPaymentMethod: string | null;
}

const PaymentMethodForm: FC<PaymentMethodFormProps> = ({ preferredPaymentMethod }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof PaymentMethodSchema>>({
        resolver: zodResolver(PaymentMethodSchema),
        defaultValues: { type: preferredPaymentMethod ?? DEFAULT_PAYMENT_METHOD },
        mode: "onChange",
    });

    function onSubmit(data: z.infer<typeof PaymentMethodSchema>) {
        startTransition(async () => {
            const response = await updateUserPaymentMethod(data);

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            router.push("/place-order");
        });
    }

    return (
        <div className="max-w-md mx-auto space-y-4">
            <h1 className="h2-bold mt-4">Payment Method</h1>
            <p className="text-sm text-muted-foreground">Please select a payment method</p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-5">
                    <Controller
                        name="type"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <RadioGroup
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    {PAYMENT_METHODS.map((method) => (
                                        <FieldLabel
                                            key={method}
                                            htmlFor={`payment-method-radiogroup-${method}`}
                                            className="font-normal cursor-pointer"
                                        >
                                            <Field orientation="horizontal">
                                                <RadioGroupItem
                                                    value={method}
                                                    id={`payment-method-radiogroup-${method}`}
                                                    aria-invalid={fieldState.invalid}
                                                />

                                                {method}
                                            </Field>
                                        </FieldLabel>
                                    ))}
                                </RadioGroup>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </div>

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

export default PaymentMethodForm;
