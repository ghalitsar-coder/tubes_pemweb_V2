import React from "react";
import CreateTask from "@/components/CreateTask";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Project {
    id: number;
    name: string;
    start_date?: string;
    end_date?: string;
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
    created_at: string;
}

interface CreateTaskPageProps {
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

export default function Create({
    auth,
    users,
    projects,
    recentTasks,
    selectedProject,
}: CreateTaskPageProps) {
    return (
        <CreateTask
            auth={auth}
            users={users}
            projects={projects}
            recentTasks={recentTasks}
            selectedProject={selectedProject}
        />
    );
}
