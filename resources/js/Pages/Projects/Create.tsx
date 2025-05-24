import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ProjectForm from "@/components/ProjectForm";
import { User } from "@/types";

interface Props {
    users: User[];
    auth: {
        user: User;
    };
}

export default function Create({ users, auth }: Props) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Project" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <ProjectForm
                        users={users}
                        initialData={{
                            user_id: auth.user.id.toString(),
                        }}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
