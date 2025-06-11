import React from "react";
import { Head } from "@inertiajs/react";
import EditTask from "@/components/EditTask";
import { User, Project } from "@/types";
import { canUpdateTasks, UserWithPermissions } from "@/utils/permissions";

interface Props {
    task: {
        id: number;
        title: string;
        description: string;
        status: "todo" | "in_progress" | "completed" | "on_hold";
        due_date: string;
        project_id: number;
        assigned_to: number | null;
        task_type: string;
        priority: string;
        attachments: {
            id: number;
            filename: string;
            path: string;
            type: string;
            uploaded_at: string;
            comments: {
                id: number;
                content: string;
                user: {
                    id: number;
                    name: string;
                    avatar?: string;
                };
                created_at: string;
            }[];
        }[];
    };
    projects: Project[];
    users: User[];
    auth: {
        user: UserWithPermissions;
    };
}

export default function Edit({ auth, task, users, projects }: Props) {
    // Check if user has permission to edit tasks
    if (!canUpdateTasks(auth.user)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                    <div className="text-center">
                        <h2 className="text-lg font-medium text-gray-900 mb-2">
                            Access Denied
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            You don't have permission to edit tasks.
                        </p>
                        <a
                            href="/tasks"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Back to Tasks
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <EditTask auth={auth} task={task} users={users} projects={projects} />
    );
}
