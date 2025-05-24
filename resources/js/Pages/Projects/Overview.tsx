import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/types";
import { formatDate } from "@/lib/utils";
import {
    Users,
    Calendar,
    CheckCircle,
    Clock,
    AlertCircle,
    Globe,
    Smartphone,
    Megaphone,
    Server,
    Plus,
    Filter,
    Upload,
    ChevronDown,
    ChevronRight,
    MoreVertical,
} from "lucide-react";

interface Task {
    id: number;
    title: string;
    description: string;
    status: "todo" | "in_progress" | "completed";
    priority: "low" | "medium" | "high" | "urgent";
    due_date: string;
    assignee: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
    } | null;
}

interface Project {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    progress: number;
    status: "not_started" | "in_progress" | "on_hold" | "completed";
    budget?: number;
    spent_budget?: number;
    category?: string;
    tags?: string[];
    tasks: Task[];
    members_count: number;
    completed_tasks_count: number;
    total_tasks_count: number;
}

interface Props {
    auth: {
        user: User;
    };
    projects: Project[];
}

const priorityColors = {
    low: "text-green-500",
    medium: "text-yellow-500",
    high: "text-orange-500",
    urgent: "text-red-500",
};

const priorityIcons = {
    low: <AlertCircle className="h-3 w-3" />,
    medium: <AlertCircle className="h-3 w-3" />,
    high: <AlertCircle className="h-3 w-3" />,
    urgent: <AlertCircle className="h-3 w-3" />,
};

const projectIcons: Record<number, JSX.Element> = {
    0: <Globe className="h-5 w-5 text-purple-600" />,
    1: <Smartphone className="h-5 w-5 text-blue-600" />,
    2: <Megaphone className="h-5 w-5 text-green-600" />,
    3: <Server className="h-5 w-5 text-red-600" />,
};

const projectColors: Record<number, string> = {
    0: "bg-purple-100",
    1: "bg-blue-100",
    2: "bg-green-100",
    3: "bg-red-100",
};

const progressColors: Record<number, string> = {
    0: "bg-purple-600",
    1: "bg-blue-600",
    2: "bg-green-600",
    3: "bg-red-600",
};

export default function Overview({ auth, projects }: Props) {
    const getTaskStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="h-3 w-3 text-green-500" />;
            case "in_progress":
                return <Clock className="h-3 w-3 text-blue-500" />;
            default:
                return <Clock className="h-3 w-3 text-gray-400" />;
        }
    };

    const formatDueDate = (dueDate: string) => {
        const due = new Date(dueDate);
        const now = new Date();
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Due today";
        if (diffDays === 1) return "Due tomorrow";
        if (diffDays > 0) return `Due in ${diffDays} days`;
        if (diffDays === -1) return "Due yesterday";
        return `Overdue by ${Math.abs(diffDays)} days`;
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Project Overview" />

            <div className="bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <h1 className="text-xl font-semibold text-gray-900">
                                    Projects
                                </h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Button variant="outline" size="sm">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter
                                </Button>
                                <Link href="/projects/create">
                                    <Button size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        New Project
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto p-6">
                    {/* Projects Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                All Projects ({projects.length})
                            </h2>
                            <p className="text-sm text-gray-500">
                                Showing all active projects in your team
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                                <Upload className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                            <div className="relative">
                                <select className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                                    <option>Sort by: Recently Updated</option>
                                    <option>Sort by: Project Name</option>
                                    <option>Sort by: Due Date</option>
                                    <option>Sort by: Progress</option>
                                </select>
                                <ChevronDown className="h-4 w-4 absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {projects.map((project, index) => (
                            <Card
                                key={project.id}
                                className="overflow-hidden border border-gray-200"
                            >
                                {/* Project Header */}
                                <CardHeader className="pb-3 border-b border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div
                                                className={`h-9 w-9 rounded-full ${
                                                    projectColors[index % 4]
                                                } flex items-center justify-center mr-3`}
                                            >
                                                {projectIcons[index % 4]}
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-semibold text-gray-900">
                                                    {project.name}
                                                </CardTitle>
                                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                                    <span>
                                                        {project.members_count}{" "}
                                                        members
                                                    </span>
                                                    <span className="mx-2">
                                                        •
                                                    </span>
                                                    <span>
                                                        {
                                                            project.completed_tasks_count
                                                        }
                                                        /
                                                        {
                                                            project.total_tasks_count
                                                        }{" "}
                                                        tasks completed
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>

                                {/* Progress Section */}
                                <div className="px-5 py-3 bg-gray-50">
                                    <div className="mb-1 flex justify-between text-sm font-medium text-gray-700">
                                        <span>Progress</span>
                                        <span>{project.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${
                                                progressColors[index % 4]
                                            }`}
                                            style={{
                                                width: `${project.progress}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Tasks Section */}
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                            Tasks
                                        </h4>
                                        <Link
                                            href={`/tasks/create?project_id=${project.id}`}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-xs text-indigo-600 hover:text-indigo-900"
                                            >
                                                <Plus className="h-3 w-3 mr-1" />
                                                Add Task
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* Task List */}
                                    <div className="space-y-3">
                                        {project.tasks
                                            .slice(0, 3)
                                            .map((task) => (
                                                <Link
                                                    key={task.id}
                                                    href={`/tasks/${task.id}`}
                                                    className="block bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-150 hover:-translate-y-0.5"
                                                >
                                                    <div className="flex items-start">
                                                        <div className="flex items-center h-5 mr-2 mt-1">
                                                            <Checkbox
                                                                checked={
                                                                    task.status ===
                                                                    "completed"
                                                                }
                                                                className="h-4 w-4"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {task.title}
                                                            </p>
                                                            <div className="flex flex-wrap items-center mt-1 text-xs text-gray-500 space-x-3">
                                                                <span
                                                                    className={`flex items-center ${
                                                                        priorityColors[
                                                                            task
                                                                                .priority
                                                                        ]
                                                                    }`}
                                                                >
                                                                    {
                                                                        priorityIcons[
                                                                            task
                                                                                .priority
                                                                        ]
                                                                    }
                                                                    <span className="ml-1 capitalize">
                                                                        {
                                                                            task.priority
                                                                        }{" "}
                                                                        Priority
                                                                    </span>
                                                                </span>
                                                                <span className="flex items-center">
                                                                    {getTaskStatusIcon(
                                                                        task.status
                                                                    )}
                                                                    <span className="ml-1">
                                                                        {task.status ===
                                                                        "completed"
                                                                            ? "Completed"
                                                                            : formatDueDate(
                                                                                  task.due_date
                                                                              )}
                                                                    </span>
                                                                </span>
                                                                {task.assignee && (
                                                                    <span className="flex items-center">
                                                                        <Users className="h-3 w-3 text-gray-400 mr-1" />
                                                                        {
                                                                            task
                                                                                .assignee
                                                                                .name
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {task.assignee && (
                                                            <div className="ml-3 flex-shrink-0">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarImage
                                                                        src={
                                                                            task
                                                                                .assignee
                                                                                .avatar ||
                                                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                                                task
                                                                                    .assignee
                                                                                    .name
                                                                            )}&background=e5e7eb&color=374151`
                                                                        }
                                                                        alt={
                                                                            task
                                                                                .assignee
                                                                                .name
                                                                        }
                                                                    />
                                                                    <AvatarFallback>
                                                                        {task.assignee.name
                                                                            .split(
                                                                                " "
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    n
                                                                                ) =>
                                                                                    n[0]
                                                                            )
                                                                            .join(
                                                                                ""
                                                                            )
                                                                            .toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            ))}
                                    </div>

                                    {/* View All Tasks Link */}
                                    {project.total_tasks_count > 3 && (
                                        <div className="mt-3 text-center">
                                            <Link
                                                href={`/projects/${project.id}`}
                                                className="text-xs font-medium text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                                            >
                                                View all{" "}
                                                {project.total_tasks_count}{" "}
                                                tasks
                                                <ChevronRight className="ml-1 h-3 w-3" />
                                            </Link>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State */}
                    {projects.length === 0 && (
                        <div className="text-center py-12">
                            <div className="mx-auto h-24 w-24 text-gray-400">
                                <svg
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                No projects
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by creating a new project.
                            </p>
                            <div className="mt-6">
                                <Link href="/projects/create">
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        New Project
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
