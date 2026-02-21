"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { FC, useState } from "react";

interface ProductImagesProps {
    images: string[];
}

const ProductImages: FC<ProductImagesProps> = ({ images }) => {
    const [current, setCurrent] = useState(0);

    return (
        <div className="space-y-4">
            <Image
                src={images[current]}
                alt="product image"
                width={1000}
                height={1000}
                className="min-h-75 object-center object-cover"
            />
            <div className="flex">
                {images.map((image, index) => (
                    <div
                        key={image}
                        onClick={() => setCurrent(index)}
                        className={cn("border mr-2 cursor-pointer hover:border-orange-600", {
                            "border-orange-500": index === current,
                        })}
                    >
                        <Image
                            src={image}
                            alt="image"
                            width={100}
                            height={100}
                            className="object-center object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductImages;
