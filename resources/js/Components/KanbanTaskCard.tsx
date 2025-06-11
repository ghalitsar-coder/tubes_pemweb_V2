import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Clock, User, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";

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

interface KanbanTaskCardProps {
    task: Task;
    isUpdating?: boolean;
}

const priorityConfig = {
    low: { color: "bg-green-100 text-green-800", icon: "🟢" },
    medium: { color: "bg-yellow-100 text-yellow-800", icon: "🟡" },
    high: { color: "bg-red-100 text-red-800", icon: "🔴" },
};

const KanbanTaskCard: React.FC<KanbanTaskCardProps> = ({
    task,
    isUpdating,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id.toString(),
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const isOverdue =
        new Date(task.due_date) < new Date() && task.status !== "completed";

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md",
                isDragging && "opacity-50 rotate-5 shadow-xl",
                isUpdating && "opacity-70 pointer-events-none",
                isOverdue && "border-red-300 bg-red-50"
            )}
        >
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <Link
                        href={route("tasks.show", task.id)}
                        className="flex-1 hover:text-blue-600 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="font-medium text-sm line-clamp-2 leading-tight">
                            {task.title}
                        </h3>
                    </Link>
                    {isUpdating && (
                        <div className="ml-2 animate-spin">
                            <Clock className="h-3 w-3 text-blue-500" />
                        </div>
                    )}
                </div>

                {/* Priority Badge */}
                <div className="flex items-center justify-between mt-2">
                    <Badge
                        variant="secondary"
                        className={cn(
                            "text-xs",
                            priorityConfig[task.priority].color
                        )}
                    >
                        {priorityConfig[task.priority].icon}{" "}
                        {task.priority.toUpperCase()}
                    </Badge>
                    {isOverdue && (
                        <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Overdue
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {/* Description */}
                {task.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                        {task.description}
                    </p>
                )}

                {/* Progress Bar */}
                {task.progress > 0 && (
                    <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${task.progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Tags */}
                {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {task.tags.slice(0, 3).map((tag) => (
                            <Badge
                                key={tag.id}
                                variant="outline"
                                className="text-xs px-1.5 py-0.5"
                                style={{
                                    backgroundColor: tag.color + "20",
                                    borderColor: tag.color,
                                    color: tag.color,
                                }}
                            >
                                {tag.name}
                            </Badge>
                        ))}
                        {task.tags.length > 3 && (
                            <Badge
                                variant="outline"
                                className="text-xs px-1.5 py-0.5"
                            >
                                +{task.tags.length - 3}
                            </Badge>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                    {/* Due Date */}
                    {task.due_date && (
                        <div className="flex items-center">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            <span
                                className={
                                    isOverdue ? "text-red-600 font-medium" : ""
                                }
                            >
                                {formatDate(task.due_date)}
                            </span>
                        </div>
                    )}

                    {/* Assignees */}
                    {task.assignees && task.assignees.length > 0 && (
                        <div className="flex items-center">
                            {task.assignees
                                .slice(0, 2)
                                .map((assignee, index) => (
                                    <Avatar
                                        key={assignee.id}
                                        className="h-5 w-5 -ml-1 first:ml-0 border border-white"
                                    >
                                        <AvatarImage src={assignee.avatar} />
                                        <AvatarFallback className="text-xs">
                                            {assignee.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                ))}
                            {task.assignees.length > 2 && (
                                <div className="h-5 w-5 -ml-1 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                                    +{task.assignees.length - 2}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Project */}
                {task.project && (
                    <div className="mt-2 text-xs text-gray-500">
                        <span className="font-medium">{task.project.name}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default KanbanTaskCard;
