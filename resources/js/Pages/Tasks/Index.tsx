import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { User } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Calendar, User as UserIcon } from "lucide-react";
import TasksIndex from "@/components/TaskDashboard";
import { UserWithPermissions } from "@/utils/permissions";

interface Task {
    id: number;
    title: string;
    description: string;
    status: "todo" | "in_progress" | "completed" | "on_hold";
    priority: "low" | "medium" | "high";
    progress: number;
    start_date: string;
    due_date: string;
    is_template: boolean;
    assignees: Array<{
        id: number;
        name: string;
        email: string;
        avatar?: string;
    }>;
    tags: Array<{
        id: number;
        name: string;
        color: string;
    }>;
    project: {
        id: number;
        name: string;
    };
}

interface Props {
    auth: {
        user: UserWithPermissions;
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
    filters?: {
        status?: string;
        search?: string;
    };
}

export default function Index({ auth, tasks, filters }: Props) {
    return <TasksIndex auth={auth} tasks={tasks} filters={filters || {}} />;
}
