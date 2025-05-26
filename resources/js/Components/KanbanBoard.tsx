import React, { useState } from "react";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    DragOverEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { router } from "@inertiajs/react";
import TaskCard from "./TaskCard";
import { Card } from "@/components/ui/card";
import KanbanColumn from "./KanbanColumn";
import { UserWithPermissions } from "@/utils/permissions";

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

interface KanbanBoardProps {
    tasks: Task[];
    user: UserWithPermissions;
    onTaskUpdate?: (taskId: number, newStatus: string) => void;
}

const COLUMN_CONFIG = [
    {
        id: "todo",
        title: "To Do",
        status: "todo" as const,
        bgColor: "bg-gray-50",
        headerColor: "bg-gray-100",
        count: 0,
    },
    {
        id: "in_progress",
        title: "In Progress",
        status: "in_progress" as const,
        bgColor: "bg-blue-50",
        headerColor: "bg-blue-100",
        count: 0,
    },
    {
        id: "on_hold",
        title: "On Hold",
        status: "on_hold" as const,
        bgColor: "bg-yellow-50",
        headerColor: "bg-yellow-100",
        count: 0,
    },
    {
        id: "completed",
        title: "Completed",
        status: "completed" as const,
        bgColor: "bg-green-50",
        headerColor: "bg-green-100",
        count: 0,
    },
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({
    tasks,
    user,
    onTaskUpdate,
}) => {
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [isUpdating, setIsUpdating] = useState<number | null>(null);
    const [overId, setOverId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Group tasks by status
    const tasksByStatus = tasks.reduce((acc, task) => {
        if (!acc[task.status]) {
            acc[task.status] = [];
        }
        acc[task.status].push(task);
        return acc;
    }, {} as Record<string, Task[]>);

    // Update column counts
    const columnsWithCounts = COLUMN_CONFIG.map((column) => ({
        ...column,
        count: tasksByStatus[column.status]?.length || 0,
    }));
    const handleDragStart = (event: DragStartEvent) => {
        const task = tasks.find((t) => t.id.toString() === event.active.id);
        setActiveTask(task || null);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { over } = event;
        setOverId(over ? over.id.toString() : null);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);
        setOverId(null);

        if (!over) return;

        const taskId = parseInt(active.id.toString());
        const task = tasks.find((t) => t.id === taskId);

        if (!task) return;

        // Determine if we're dropping on a column or a task
        let newStatus = over.id.toString();

        // If dropping on a task, get the task's column status
        const droppedOnTask = tasks.find(
            (t) => t.id.toString() === over.id.toString()
        );
        if (droppedOnTask) {
            newStatus = droppedOnTask.status;
        }

        // Check if this is a valid status column
        const isValidStatus = COLUMN_CONFIG.some(
            (col) => col.status === newStatus
        );
        if (!isValidStatus) return;

        // Handle same column reordering - for now, we'll just update status
        // In the future, we can add position/order field to handle reordering
        if (task.status === newStatus) {
            // Same column - could implement reordering here
            return;
        }

        // Optimistic update (update UI immediately)
        if (onTaskUpdate) {
            onTaskUpdate(taskId, newStatus);
        }

        // Update backend
        setIsUpdating(taskId);
        try {
            router.patch(
                `/tasks/${taskId}/status`,
                {
                    status: newStatus,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true, // Use replace instead of push to prevent navigation
                    onSuccess: () => {
                        // Task status updated successfully
                        console.log(
                            `Task ${taskId} status updated to ${newStatus}`
                        );
                    },
                    onError: (errors) => {
                        console.error("Failed to update task status:", errors);
                        // Revert optimistic update on error
                        if (onTaskUpdate) {
                            onTaskUpdate(taskId, task.status);
                        }
                    },
                    onFinish: () => {
                        setIsUpdating(null);
                    },
                }
            );
        } catch (error) {
            console.error("Error updating task status:", error);
            // Revert optimistic update on error
            if (onTaskUpdate) {
                onTaskUpdate(taskId, task.status);
            }
            setIsUpdating(null);
        }
    };
    return (
        <div className="h-full">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
                    {columnsWithCounts.map((column) => (
                        <KanbanColumn
                            key={column.id}
                            column={column}
                            tasks={tasksByStatus[column.status] || []}
                            isUpdating={isUpdating}
                            isDragOver={overId === column.status}
                        />
                    ))}
                </div>{" "}
                <DragOverlay>
                    {activeTask ? (
                        <Card className="rotate-5 shadow-lg opacity-90">
                            <TaskCard task={activeTask} user={user} />
                        </Card>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default KanbanBoard;
