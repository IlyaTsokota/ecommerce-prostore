import { cn } from "@/lib/utils";
import { FC, Fragment } from "react";

interface CurrentStepsProps {
    current: number;
}

const STEPS = ["User Login", "Shipping Address", "Payment Method", "Place Order"];
const lastStepIndex = STEPS.length - 1;

const CheckoutSteps: FC<CurrentStepsProps> = ({ current = 0 }) => {
    return (
        <div className="flex-between flex-col md:flex-row space-x-2 mb-10">
            {STEPS.map((step, index) => (
                <Fragment key={step}>
                    <div
                        className={cn("p-2 w-56 rounded-full text-center text-sm", {
                            "bg-secondary": index === current,
                        })}
                    >
                        {step}
                    </div>
                    {step !== STEPS[lastStepIndex] && (
                        <hr className="w-16 border-t border-gray-300 mx-2" />
                    )}
                </Fragment>
            ))}
        </div>
    );
};

export default CheckoutSteps;
