"use client";

import { SalesDataType } from "@/lib/features/order/actions/order.actions";
import { FC } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

interface ChartsProps {
    data: {
        salesData: SalesDataType[];
    };
}

const Charts: FC<ChartsProps> = ({ data: { salesData } }) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={salesData}>
                <XAxis
                    dataKey="month"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                />
                <Bar
                    dataKey="totalSales"
                    fill="currentColor"
                    radius={[25, 25, 0, 0]}
                    className="fill-primary"
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default Charts;
