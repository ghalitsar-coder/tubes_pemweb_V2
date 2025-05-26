import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { UserWithPermissions } from '@/utils/permissions';

interface Props {
    user: UserWithPermissions;
    permissions: string[];
    roles: string[];
    can_create_project: boolean;
    can_assign_tasks: boolean;
}

export default function UserData({ user, permissions, roles, can_create_project, can_assign_tasks }: Props) {
    return (
        <AuthenticatedLayout
            user={user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Debug User Data</h2>}
        >
            <Head title="Debug User Data" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">User Debug Information</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <strong>User:</strong>
                                    <pre className="bg-gray-100 p-2 rounded text-sm">
                                        {JSON.stringify(user, null, 2)}
                                    </pre>
                                </div>
                                
                                <div>
                                    <strong>Permissions:</strong>
                                    <pre className="bg-gray-100 p-2 rounded text-sm">
                                        {JSON.stringify(permissions, null, 2)}
                                    </pre>
                                </div>
                                
                                <div>
                                    <strong>Roles:</strong>
                                    <pre className="bg-gray-100 p-2 rounded text-sm">
                                        {JSON.stringify(roles, null, 2)}
                                    </pre>
                                </div>
                                
                                <div>
                                    <strong>Can Create Project:</strong> {can_create_project ? 'YES' : 'NO'}
                                </div>
                                
                                <div>
                                    <strong>Can Assign Tasks:</strong> {can_assign_tasks ? 'YES' : 'NO'}
                                </div>
                                  <div>
                                    <strong>Auth User from Inertia:</strong>
                                    <pre className="bg-gray-100 p-2 rounded text-sm">
                                        {JSON.stringify((window as any)?.Laravel?.auth?.user || 'Not available', null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
