import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import KanbanTaskCard from "./KanbanTaskCard";
import { ScrollArea } from "./ui/scroll-area";

interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

interface Tag {
    id: number;
    name: string;
    color: string;
}

interface Task {
    id: number;
    title: string;
    description: string;
    status: "todo" | "in_progress" | "on_hold" | "completed";
    priority: "low" | "medium" | "high";
    progress: number;
    start_date: string;
    due_date: string;
    is_template: boolean;
    assignees: User[];
    tags: Tag[];
    project?: {
        id: number;
        name: string;
    };
}

interface Column {
    id: string;
    title: string;
    status: "todo" | "in_progress" | "on_hold" | "completed";
    bgColor: string;
    headerColor: string;
    count: number;
}

interface KanbanColumnProps {
    column: Column;
    tasks: Task[];
    isUpdating: number | null;
    isDragOver?: boolean;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
    column,
    tasks,
    isUpdating,
    isDragOver = false,
}) => {
    const { setNodeRef, isOver } = useDroppable({
        id: column.status,
    });

    const taskIds = tasks.map((task) => task.id.toString());
    return (
        <ScrollArea className="h-screen w-full">
            <Card
                ref={setNodeRef}
                className={cn(
                    "flex flex-col h-fit min-h-[600px] transition-colors duration-200",
                    column.bgColor,
                    (isOver || isDragOver) && "ring-2 ring-blue-400 bg-blue-50"
                )}
            >
                <CardHeader className={cn("pb-3", column.headerColor)}>
                    <CardTitle className="flex items-center justify-between text-sm font-medium">
                        <span className="text-gray-700">{column.title}</span>
                        <Badge variant="secondary" className="ml-2">
                            {column.count}
                        </Badge>
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 p-3 space-y-3">
                    <SortableContext
                        items={taskIds}
                        strategy={verticalListSortingStrategy}
                    >
                        {tasks.map((task) => (
                            <KanbanTaskCard
                                key={task.id}
                                task={task}
                                isUpdating={isUpdating === task.id}
                            />
                        ))}
                    </SortableContext>{" "}
                    {tasks.length === 0 && (
                        <div
                            className={cn(
                                "flex items-center justify-center h-32 text-gray-400 text-sm transition-colors duration-200",
                                (isOver || isDragOver) &&
                                    "text-blue-500 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg"
                            )}
                        >
                            <div className="text-center">
                                <div className="text-2xl mb-2">
                                    {isOver || isDragOver ? "📋" : "📝"}
                                </div>
                                <p>
                                    {isOver || isDragOver
                                        ? "Drop task here"
                                        : "No tasks yet"}
                                </p>
                                <p className="text-xs">Drag tasks here</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </ScrollArea>
    );
};

export default KanbanColumn;
