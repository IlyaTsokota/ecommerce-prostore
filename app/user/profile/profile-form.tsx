"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateUserProfile } from "@/lib/features/user/actions/user.actions";
import { UpdateProfileSchema } from "@/lib/features/user/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const ProfileForm = () => {
    const { data: session, update } = useSession();

    const form = useForm<z.infer<typeof UpdateProfileSchema>>({
        resolver: zodResolver(UpdateProfileSchema),
        defaultValues: {
            name: session?.user?.name ?? "",
            email: session?.user?.email ?? "",
        },
        mode: "onChange",
    });

    const onSubmit = async (data: z.infer<typeof UpdateProfileSchema>) => {
        const response = await updateUserProfile(data);

        if (!response.success) {
            toast.error(response.message);
            return;
        }

        const newSession = {
            ...session,
            user: {
                ...session?.user,
                name: data.name,
                email: data.email,
            },
        };

        await update(newSession);
        toast.success(response.message);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                            {...field}
                            id="email"
                            aria-invalid={fieldState.invalid}
                            placeholder="Enter email"
                            disabled
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="fullName">Name</FieldLabel>
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
            <Button
                type="submit"
                size="lg"
                className="button col-span-2 w-full"
                disabled={form.formState.isSubmitting}
            >
                {form.formState.isSubmitting && <Loader className="h-4 w-4 animate-spin" />} Update
                Profile
            </Button>
        </form>
    );
};

export default ProfileForm;
