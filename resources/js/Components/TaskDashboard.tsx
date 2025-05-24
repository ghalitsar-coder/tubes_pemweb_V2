import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { FilterIcon, PlusIcon } from "lucide-react";
import Pagination from "./PaginationComp";
import TaskStatusFilter from "./TaskStatusFilter";
import TaskCard from "./TaskCard";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

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
    status: "todo" | "in-progress" | "on-hold" | "completed";
    priority: "low" | "medium" | "high";
    progress: number;
    start_date: string;
    due_date: string;
    is_template: boolean;
    assignees: User[];
    tags: Tag[];
}

interface TasksIndexProps {
    tasks: {
        data: Task[];
        meta: {
            current_page: number;
            from: number;
            to: number;
            total: number;
            last_page: number;
        };
    };
    filters: {
        status?: string;
        search?: string;
    };
}

const TasksIndex: React.FC<TasksIndexProps> = ({ tasks, filters }) => {
    const [activeFilter, setActiveFilter] = useState(filters?.status || "all");

    // Provide default values if tasks.meta is undefined
    const tasksData = tasks?.data || [];
    const tasksMeta = tasks?.meta || {
        current_page: 1,
        from: 0,
        to: 0,
        total: 0,
        last_page: 1,
    };

    const statusCounts = {
        all: tasksMeta.total,
        todo: tasksData.filter((task) => task.status === "todo").length,
        "in-progress": tasksData.filter((task) => task.status === "in-progress")
            .length,
        "on-hold": tasksData.filter((task) => task.status === "on-hold").length,
        completed: tasksData.filter((task) => task.status === "completed")
            .length,
        templates: tasksData.filter((task) => task.is_template).length,
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tasks" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Tasks Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            All Tasks
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            View, manage and track all your tasks in one place
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <Button variant="outline" size="sm">
                            <FilterIcon className="mr-2 h-4 w-4" />
                            Filter
                        </Button>
                        <Button size="sm">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            New Task
                        </Button>
                    </div>
                </div>
                {/* Task Status Filter */}
                <TaskStatusFilter
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    counts={statusCounts}
                />{" "}
                {/* Tasks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasksData.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
                {/* Pagination */}
                <Pagination
                    links={tasksMeta}
                    from={tasksMeta.from}
                    to={tasksMeta.to}
                    total={tasksMeta.total}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default TasksIndex;
