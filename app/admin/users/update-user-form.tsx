"use client";

import { UpdateUserSchema } from "@/lib/features/user/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FC, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Role } from "@/lib/generated/prisma/enums";

interface UpdateUserForm {
    user: z.infer<typeof UpdateUserSchema>;
}

const UpdateUserForm: FC<UpdateUserForm> = ({ user }) => {
    const router = useRouter();
    const form = useForm<UpdateUserForm["user"]>({
        mode: "onChange",
        resolver: zodResolver(UpdateUserSchema),
        defaultValues: user,
    });
    const [isPending, startTransition] = useTransition();

    function onSubmit(data: UpdateUserForm["user"]) {
        startTransition(async () => {
            // const response = await updateUserAddress(data);
            // if (!response.success) {
            //     toast.error(response.message);
            //     return;
            // }
            // router.push("/admin/users");
        });
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="Enter user email"
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
                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="Enter user name"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <Controller
                name="role"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                        <Select>
                            <SelectTrigger className="w-45">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                                    <SelectItem value={Role.USER}>User</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
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
                    Save
                </Button>
            </div>
        </form>
    );
};

export default UpdateUserForm;
