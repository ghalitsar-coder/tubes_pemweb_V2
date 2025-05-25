import React from "react";
import { Head } from "@inertiajs/react";
import EditTask from "@/components/EditTask";
import { User, Project } from "@/types";

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
        user: User;
    };
}

export default function Edit({ auth, task, users, projects }: Props) {
    return (
        <EditTask auth={auth} task={task} users={users} projects={projects} />
    );
}
