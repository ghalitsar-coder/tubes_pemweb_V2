"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartCompProps {
    data?: {
        month: string;
        completed: number;
        remaining: number;
    }[];
}

const defaultData = [
    { month: "Project A", completed: 8, remaining: 2 },
    { month: "Project B", completed: 5, remaining: 6 },
    { month: "Project C", completed: 12, remaining: 1 },
    { month: "Project D", completed: 3, remaining: 7 },
    { month: "Project E", completed: 9, remaining: 6 },
];

const chartConfig = {
    completed: {
        label: "Completed Tasks",
        color: "hsl(var(--chart-1))",
    },
    remaining: {
        label: "Remaining Tasks",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function ChartComp({ data = defaultData }: ChartCompProps) {
    // Calculate overall task completion statistics
    const totalCompleted = data.reduce((sum, project) => sum + project.completed, 0);
    const totalRemaining = data.reduce((sum, project) => sum + project.remaining, 0);
    const totalTasks = totalCompleted + totalRemaining;
    const overallProgress = totalTasks > 0 
        ? Math.round((totalCompleted / totalTasks) * 100)
        : 0;

    return (
        <Card>            <CardHeader>
                <CardTitle>Project Task Progress</CardTitle>
                <CardDescription>
                    Task completion status across all projects
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar
                            dataKey="completed"
                            fill="var(--color-completed)"
                            radius={4}
                        />
                        <Bar
                            dataKey="remaining"
                            fill="var(--color-remaining)"
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Overall task completion: {overallProgress}% <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    {totalCompleted} completed of {totalTasks} total tasks across {data.length} projects
                </div>
            </CardFooter>
        </Card>
    );
}
