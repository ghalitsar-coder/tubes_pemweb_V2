import React from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreVertical, Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Project {
    id: number;
    name: string;
}

interface Task {
    id: number;
    title: string;
    description: string;
    status: "todo" | "in-progress" | "on-hold" | "completed";
    priority: "low" | "medium" | "high";
    progress: number;
    start_date: string;
    due_date: string;
    time_estimate: number;
    assignees: User[];
    tags: Array<{
        id: number;
        name: string;
        color: string;
    }>;
    project: Project;
}

interface RecentTasksListProps {
    tasks: Task[];
}

const RecentTasksList: React.FC<RecentTasksListProps> = ({ tasks }) => {
    const getPriorityBorderClass = (priority: string) => {
        switch (priority) {
            case "high":
                return "border-l-red-500";
            case "medium":
                return "border-l-yellow-500";
            case "low":
                return "border-l-green-500";
            default:
                return "border-l-gray-300";
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Recently Created Tasks
            </h2>
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {tasks.map((task) => (
                        <li
                            key={task.id}
                            className={`border-l-4 ${getPriorityBorderClass(
                                task.priority
                            )}`}
                        >
                            <div className="group px-4 py-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-center min-w-0 flex-1">
                                    <Checkbox className="mr-3" />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center">
                                            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                                                {task.title}
                                            </p>
                                            <p className="ml-2 flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                                                #
                                                {task.id
                                                    .toString()
                                                    .padStart(4, "0")}
                                            </p>
                                        </div>
                                        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                <User className="mr-1.5 h-3 w-3 text-gray-400 flex-shrink-0" />
                                                {task.assignees.length > 0
                                                    ? task.assignees[0].name
                                                    : "Unassigned"}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                <Calendar className="mr-1.5 h-3 w-3 text-gray-400 flex-shrink-0" />
                                                Due {formatDate(task.due_date)}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                <Clock className="mr-1.5 h-3 w-3 text-gray-400 flex-shrink-0" />
                                                {task.time_estimate} hours
                                                estimated
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1">
                                        {task.tags.slice(0, 2).map((tag) => (
                                            <Badge
                                                key={tag.id}
                                                variant="secondary"
                                                className="text-xs"
                                                style={{
                                                    backgroundColor: `${tag.color}20`,
                                                    color: tag.color,
                                                    borderColor: `${tag.color}40`,
                                                }}
                                            >
                                                {tag.name}
                                            </Badge>
                                        ))}
                                        {task.tags.length > 2 && (
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                +{task.tags.length - 2}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RecentTasksList;
