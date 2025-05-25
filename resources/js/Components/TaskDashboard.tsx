import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { FilterIcon, PlusIcon, LayoutGrid, List } from "lucide-react";
import Pagination from "./PaginationComp";
import TaskStatusFilter from "./TaskStatusFilter";
import TaskCard from "./TaskCard";
import KanbanBoard from "./KanbanBoard";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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

interface TasksIndexProps {
    auth: {
        user: User;
    };
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

const TasksIndex: React.FC<TasksIndexProps> = ({ auth, tasks, filters }) => {
    const [activeFilter, setActiveFilter] = useState(filters?.status || "all");
    const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban");
    console.log(`THIS IS  viewMode:`, viewMode)
    const [localTasks, setLocalTasks] = useState(tasks?.data || []); // Provide default values if tasks.meta is undefined
    const tasksData = localTasks;
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
        in_progress: tasksData.filter((task) => task.status === "in_progress")
            .length,
        on_hold: tasksData.filter((task) => task.status === "on_hold").length,
        completed: tasksData.filter((task) => task.status === "completed")
            .length,
        templates: tasksData.filter((task) => task.is_template).length,
    };

    // Handle optimistic updates for kanban
    const handleTaskUpdate = (taskId: number, newStatus: string) => {
        setLocalTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId
                    ? { ...task, status: newStatus as any }
                    : task
            )
        );
    };
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Tasks" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Tasks Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            All Tasks 
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            View, manage and track all your tasks in one place asdasdsa
                        </p>
                    </div>{" "}
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        {" "}
                        <ToggleGroup
                            type="single"
                            value={viewMode}
                            onValueChange={(value: string | undefined) =>
                                value && setViewMode(value as "list" | "kanban")
                            }
                        >
                            <ToggleGroupItem
                                value="list"
                                aria-label="List view"
                            >
                                <List className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="kanban"
                                aria-label="Kanban view"
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </ToggleGroupItem>
                        </ToggleGroup>
                        <Button variant="outline" size="sm">
                            <FilterIcon className="mr-2 h-4 w-4" />
                            Filter
                        </Button>
                        <Link href="/tasks/create">
                            <Button size="sm">
                                <PlusIcon className="mr-2 h-4 w-4" />
                                New Task
                            </Button>
                        </Link>
                    </div>
                </div>{" "}
                {/* Task Status Filter - only show in list view */}
                {viewMode === "list" && (
                    <TaskStatusFilter
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                        counts={statusCounts}
                    />
                )}
                {/* Content - Toggle between List and Kanban */}
                {viewMode === "list" ? (
                    <>
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
                    </>
                ) : (
                    /* Kanban Board */
                    <div className="mt-6">
                        <KanbanBoard
                            tasks={tasksData}
                            onTaskUpdate={handleTaskUpdate}
                        />
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default TasksIndex;
