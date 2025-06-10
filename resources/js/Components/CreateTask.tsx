import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TaskForm from "./TaskForm";
import TaskTabs from "./TaskTabs";
import RecentTasksList from "./RecentTasksList";

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

interface CreateTaskProps {
    auth: {
        user: User;
    };
    projects: Project[];
    users: User[];
    recentTasks?: Task[];
    selectedProject?: {
        id: number;
        name: string;
    } | null;
}

const CreateTask: React.FC<CreateTaskProps> = ({
    auth,
    projects,
    users,
    recentTasks = [],
    selectedProject,
}) => {
    const [activeTab, setActiveTab] = useState("creation");

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Task" />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Task Management
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Create and manage tasks efficiently
                    </p>
                </div>

                {/* Task Creation Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    {/* Task Tabs */}
                    <TaskTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                    {/* Task Form */}{" "}
                    <div className="px-6 py-5">
                        {activeTab === "creation" && (
                            <TaskForm
                                projects={projects}
                                users={users}
                                selectedProject={selectedProject}
                            />
                        )}
                        {activeTab === "bulk-import" && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">
                                    Bulk Import functionality coming soon...
                                </p>
                            </div>
                        )}
                        {activeTab === "templates" && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">
                                    Task Templates functionality coming soon...
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Tasks */}
                {recentTasks.length > 0 && (
                    <RecentTasksList tasks={recentTasks} />
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default CreateTask;
