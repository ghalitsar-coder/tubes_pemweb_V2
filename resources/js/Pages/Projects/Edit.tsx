import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ProjectForm from "@/components/ProjectForm";
import { User } from "@/types";

interface Props {
    project: {
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
        attachments?: string;
    };
    users: User[];
    auth: {
        user: User;
    };
}

export default function Edit({ project, users, auth }: Props) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Edit ${project.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {" "}
                    <ProjectForm
                        users={users}
                        project={project}
                        isEdit={true}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
