import React from "react";
import { Link } from "@inertiajs/react";
import { Edit, Trash2, MoreHorizontal, Copy } from "lucide-react";
import {
    canUpdateTasks,
    canDeleteTasks,
    UserWithPermissions,
} from "@/utils/permissions";

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
}

interface TaskCardProps {
    task: Task;
    user: UserWithPermissions;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, user }) => {
    // Helper function to determine status badge styling
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case "todo":
                return "bg-gray-100 text-gray-800";
            case "in_progress":
                return "bg-blue-100 text-blue-800";
            case "on_hold":
                return "bg-yellow-100 text-yellow-800";
            case "completed":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    }; // Helper function for progress bar styling
    const getProgressBarColor = (status: string, isTemplate: boolean) => {
        if (isTemplate) return "bg-purple-600";
        switch (status) {
            case "todo":
                return "bg-gray-400";
            case "in_progress":
                return "bg-blue-600";
            case "on_hold":
                return "bg-yellow-600";
            case "completed":
                return "bg-green-600";
            default:
                return "bg-gray-400";
        }
    };

    // Format dates for display
    const formatDateRange = (startDate: string, dueDate: string) => {
        const start = new Date(startDate);
        const end = new Date(dueDate);

        return `${start.getDate()} ${start.toLocaleString("default", {
            month: "short",
        })} - ${end.getDate()} ${end.toLocaleString("default", {
            month: "short",
        })}`;
    };

    return (
        <div
            className={`task-card bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg ${
                task.is_template
                    ? "border-2 border-purple-200 dark:border-purple-900"
                    : ""
            }`}
        >
            <div className="p-5">
                <div className="flex items-center justify-between">
                    <Link href={`/tasks/${task.id}`}>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                            {task.title} {task.is_template && "(Template)"}
                        </h3>
                    </Link>
                    <div className="flex-shrink-0">
                        <span
                            className={`status-badge inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                task.is_template
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                    : getStatusBadgeClass(task.status)
                            }`}
                        >
                            {task.is_template
                                ? "Template"
                                : task.status.replace("-", " ")}
                        </span>
                    </div>
                </div>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {task.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex -space-x-1">
                        {task.assignees.map((user) => (
                            <img
                                key={user.id}
                                className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800"
                                src={
                                    user.avatar ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        user.name
                                    )}&background=random`
                                }
                                alt={user.name}
                                title={user.name}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDateRange(task.start_date, task.due_date)}
                    </span>
                </div>

                <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{task.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                            className={`progress-bar ${getProgressBarColor(
                                task.status,
                                task.is_template
                            )} h-1.5 rounded-full`}
                            style={{ width: `${task.progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                    {task.tags.map((tag) => (
                        <span
                            key={tag.id}
                            className={`tag inline-flex items-center px-2 py-0.5 rounded text-xs font-medium`}
                            style={{
                                backgroundColor: `${tag.color}25`, // 25% opacity version of the color
                                color: tag.color,
                            }}
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>
            </div>{" "}
            <div className="bg-gray-50 dark:bg-gray-900 px-5 py-3 flex justify-end">
                <div className="flex space-x-3">
                    {task.is_template && (
                        <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                            <Copy className="h-4 w-4" />
                        </button>
                    )}
                    {canUpdateTasks(user) && (
                        <Link
                            href={route("tasks.edit", task.id)}
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                            <Edit className="h-4 w-4" />
                        </Link>
                    )}
                    {canDeleteTasks(user) && !task.is_template && (
                        <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                    <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <MoreHorizontal className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
