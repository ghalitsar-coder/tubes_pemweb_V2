import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TaskForm from "./TaskForm";
import TaskTabs from "./TaskTabs";
import { TaskAttachments } from "@/components/task/TaskAttachments";
import { User, Project } from "@/types";

interface TaskAttachment {
    id: number;
    filename: string;
    path: string;
    type: string;
    uploaded_at: string;
    created_at?: string;
    comments?: TaskComment[];
}

interface TaskComment {
    id: number;
    content: string;
    user: {
        id: number;
        name: string;
        avatar?: string;
    };
    created_at: string;
}

interface Task {
    id: number;
    title: string;
    description: string;
    task_type: string;
    project_id: number;
    assigned_to: number | null;
    status: "todo" | "in_progress" | "on_hold" | "completed";
    due_date: string;
    tags?: string | null;
    time_estimate?: number | null;
    start_date?: string | null;
    priority: string;
    created_at?: string;
    updated_at?: string;
    attachments?: TaskAttachment[];
}

interface EditTaskProps {
    auth: {
        user: User;
    };
    task: Task;
    projects: Project[];
    users: User[];
}

const EditTask: React.FC<EditTaskProps> = ({ auth, task, projects, users }) => {
    const [activeTab, setActiveTab] = useState("editing");

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Edit Task - ${task.title}`} />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Edit Task
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Update task details and manage efficiently
                    </p>
                </div>

                {/* Task Editing Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    {/* Task Tabs - Modified for editing */}
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab("editing")}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === "editing"
                                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"
                                }`}
                            >
                                Edit Task
                            </button>
                            <button
                                onClick={() => setActiveTab("history")}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === "history"
                                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"
                                }`}
                            >
                                History
                            </button>{" "}
                            <button
                                onClick={() => setActiveTab("attachments")}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === "attachments"
                                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"
                                }`}
                            >
                                Attachments ({task.attachments?.length || 0})
                            </button>
                        </nav>
                    </div>

                    {/* Task Form */}
                    <div className="px-6 py-5">
                        {activeTab === "editing" && (
                            <TaskForm
                                projects={projects}
                                users={users}
                                task={task}
                                isEdit={true}
                            />
                        )}
                        {activeTab === "history" && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">
                                    Task History functionality coming soon...
                                </p>
                            </div>
                        )}{" "}
                        {activeTab === "attachments" && (
                            <TaskAttachments
                                attachments={task.attachments || []}
                                taskId={task.id}
                                currentUser={auth.user}
                            />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditTask;
