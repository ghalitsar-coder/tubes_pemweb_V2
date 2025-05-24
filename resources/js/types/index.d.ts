export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    avatar?: string;
}

export interface ProjectAttachment {
    id: number;
    filename: string;
    path: string;
    type: string;
    size: number;
    uploaded_at: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: "todo" | "in_progress" | "completed";
    due_date: string;
    priority?: "low" | "medium" | "high";
    assigned_to?: number;
    assignee?: User;
    project_id: number;
    project?: Project;
    created_at: string;
    updated_at: string;
}

export interface Project {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    status: "not_started" | "in_progress" | "on_hold" | "completed";
    budget: number | null;
    spent_budget: number | null;
    progress: number | null;
    category: string | null;
    tags: string[];
    is_template: boolean;
    user_id: number;
    attachments?: ProjectAttachment[] | string;
    created_at: string;
    updated_at: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};
