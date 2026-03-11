"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, updateProduct } from "@/lib/features/product/actions/product.actions";
import {
    CreateProductSchema,
    UpdateProductSchema,
} from "@/lib/features/product/schemas/product.schema";
import {
    CreateProductInput,
    Product,
    UpdateProductInput,
} from "@/lib/features/product/types/product.types";
import { UploadButton } from "@/lib/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Controller, Resolver, useForm, useWatch } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";

const defaultFieldValues: CreateProductInput = {
    name: "",
    slug: "",
    category: "",
    images: [],
    brand: "",
    description: "",
    price: "0",
    stock: 0,
    rating: 0,
    numReviews: 0,
    isFeatured: false,
    banner: null,
};

interface ProductFormProps {
    type: "Create" | "Update";
    product?: Product;
}

const isCreateForm = (
    data: CreateProductInput | UpdateProductInput,
    type: ProductFormProps["type"],
): data is CreateProductInput => {
    return type === "Create";
};

const isUpdateForm = (
    data: CreateProductInput | UpdateProductInput,
    type: ProductFormProps["type"],
): data is UpdateProductInput => {
    return type === "Update";
};

const ProductForm: FC<ProductFormProps> = ({ type, product }) => {
    const router = useRouter();
    const [uploadImage, setUploadImage] = useState(false);
    const resolver = (type === "Update"
        ? zodResolver(UpdateProductSchema)
        : zodResolver(CreateProductSchema)) as unknown as Resolver<
        CreateProductInput | UpdateProductInput
    >;
    const form = useForm<CreateProductInput | UpdateProductInput>({
        resolver,
        defaultValues: product && type === "Update" ? product : defaultFieldValues,
        mode: "onChange",
    });
    const images = useWatch({ control: form.control, name: "images" });
    const banner = useWatch({ control: form.control, name: "banner" });
    const isFeatured = useWatch({ control: form.control, name: "isFeatured" });

    async function onSubmit(data: CreateProductInput | UpdateProductInput) {
        if (isCreateForm(data, type)) {
            const res = await createProduct(data);

            if (!res.success) {
                toast.error(res.message);
                return;
            }

            toast.success(res.message);
            router.push("/admin/products");
        } else if (isUpdateForm(data, type)) {
            const res = await updateProduct(data);

            if (!res.success) {
                toast.error(res.message);
                return;
            }

            toast.success(res.message);
            router.push("/admin/products");
        }
    }

    return (
        <form className="space-y-8" method="POST" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex-col flex gap-5 md:flex-row">
                <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="w-full">
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            <Input
                                {...field}
                                id="name"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter product name"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="slug"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="slug">Slug</FieldLabel>
                            <FieldContent>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        id="slug"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter slug"
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="mt-2"
                                        onClick={() => {
                                            form.setValue(
                                                "slug",
                                                slugify(form.getValues("name"), { lower: true }),
                                                { shouldValidate: true },
                                            );
                                        }}
                                    >
                                        Generate
                                    </Button>
                                </div>
                            </FieldContent>

                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </div>
            <div className="flex-col flex gap-5 md:flex-row">
                <Controller
                    name="category"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="category">Category</FieldLabel>
                            <Input
                                {...field}
                                id="category"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter category"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="brand"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="brand">Brand</FieldLabel>
                            <Input
                                {...field}
                                id="brand"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter brand"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </div>
            <div className="flex-col flex gap-5 md:flex-row">
                <Controller
                    name="price"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="price">Price</FieldLabel>
                            <Input
                                {...field}
                                id="price"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter price"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="stock"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="stock">Stock</FieldLabel>
                            <Input
                                {...field}
                                id="stock"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter stock"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </div>
            <div className="upload-field">
                Featured Product
                <Card className="mt-2">
                    <CardContent className="space-y-2">
                        <Controller
                            name="isFeatured"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <div className="flex">
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            id={field.name}
                                        />
                                        <FieldLabel htmlFor={field.name} className="pl-2">
                                            Is Featured?
                                        </FieldLabel>
                                    </div>

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        {isFeatured && banner && (
                            <Image
                                src={banner}
                                alt="banner image"
                                className="w-full object-cover rounded-sm"
                                width={1920}
                                height={680}
                            />
                        )}

                        {isFeatured && !banner && (
                            <UploadButton
                                endpoint="imageUploader"
                                onUploadBegin={() => setUploadImage(true)}
                                onClientUploadComplete={(res) => {
                                    form.setValue("banner", res[0].ufsUrl, {
                                        shouldValidate: true,
                                    });
                                    setUploadImage(false);
                                }}
                                onUploadError={(error: Error) => {
                                    toast.error(error.message);
                                }}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="upload-field flex-col flex gap-5 md:flex-row">
                <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="description">Description</FieldLabel>
                            <Textarea
                                {...field}
                                id="description"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter product description"
                                className="resize-none"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </div>
            <div className="upload-filed flex flex-col md:flex-row gap-5">
                <Controller
                    name="images"
                    control={form.control}
                    render={({ fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="description">Images</FieldLabel>
                            <Card>
                                <CardContent className="space-y-2 mt-2 min-h-48">
                                    <div className="flex-start space-x-2">
                                        {images.map((image, index) => (
                                            <div key={image} className="relative">
                                                <Image
                                                    src={image}
                                                    alt="product image"
                                                    className="w-20 h-20 object-cover object-center rounded-sm"
                                                    width={100}
                                                    height={100}
                                                />
                                                <div className="absolute top-0 right-0">
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="z-10"
                                                        onClick={() => {
                                                            images.splice(index, 1);

                                                            form.setValue("images", images, {
                                                                shouldValidate: true,
                                                            });
                                                        }}
                                                    >
                                                        X
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        <div>
                                            <UploadButton
                                                endpoint="imageUploader"
                                                onUploadBegin={() => setUploadImage(true)}
                                                onClientUploadComplete={(res) => {
                                                    form.setValue(
                                                        "images",
                                                        [...images, res[0].ufsUrl],
                                                        {
                                                            shouldValidate: true,
                                                        },
                                                    );
                                                    setUploadImage(false);
                                                }}
                                                onUploadError={(error: Error) => {
                                                    toast.error(error.message);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </div>
            <div>
                <Button
                    type="submit"
                    size="lg"
                    disabled={form.formState.isSubmitting || uploadImage}
                    className="button col-span-2 w-full"
                >
                    {form.formState.isSubmitting && <Loader className="w-4 h-4 animate-spin" />}{" "}
                    {type} product
                </Button>
            </div>
        </form>
    );
};

export default ProductForm;
