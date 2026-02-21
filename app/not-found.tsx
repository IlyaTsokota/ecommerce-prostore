"use client";

import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NotFoundPage = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <Image
                src="/images/logo.svg"
                alt={`${APP_NAME} logo`}
                height={48}
                width={48}
                priority
            />
            <div className="p-6 w-2/3 md:w-1/3 rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold mb-4">Not Found</h1>
                <p className="text-destructive">Could not find requested page</p>
                <Button className="mt-4 ml-2" variant="outline" onClick={() => router.push("/")}>
                    Back To Home
                </Button>
            </div>
        </div>
    );
};

export default NotFoundPage;
