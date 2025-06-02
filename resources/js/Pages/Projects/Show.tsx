import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Calendar,
    Clock,
    ExternalLink,
    FileText,
    Folder,
    Plus,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
} from "lucide-react";
import {
    Project,
    User,
    ProjectAttachment,
    Task,
    ProjectComment,
} from "@/types";
import {
    canUpdateProject,
    canDeleteProject,
    canAssignTasks,
    canUpdateTasks,
    canCommentProjects,
    UserWithPermissions,
} from "@/utils/permissions";
import { ProjectComments } from "@/components/project/ProjectComments";

interface Props {
    project: Project & {
        tasks: Task[];
        user: User;
        members?: User[];
        attachments?: ProjectAttachment[];
        activity?: Array<{
            id: number;
            user: User;
            action: string;
            target: string;
            created_at: string;
        }>;
    };
    auth: {
        user: UserWithPermissions;
    };
}

export default function Show({ project, auth }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "not_started":
                return "bg-gray-100 text-gray-800";
            case "in_progress":
                return "bg-blue-100 text-blue-800";
            case "on_hold":
                return "bg-yellow-100 text-yellow-800";
            case "completed":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getTaskStatusColor = (status: string) => {
        switch (status) {
            case "todo":
                return "bg-gray-100 text-gray-700";
            case "in_progress":
                return "bg-blue-100 text-blue-700";
            case "completed":
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "bg-red-100 text-red-800";
            case "medium":
                return "bg-yellow-100 text-yellow-800";
            case "low":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const completedTasks =
        project.tasks?.filter((task) => task.status === "completed").length ||
        0;
    const totalTasks = project.tasks?.length || 0;
    const overdueTasks =
        project.tasks?.filter(
            (task) =>
                new Date(task.due_date) < new Date() &&
                task.status !== "completed"
        ).length || 0;

    const daysLeft = Math.ceil(
        (new Date(project.end_date).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
    );
    const totalDays = Math.ceil(
        (new Date(project.end_date).getTime() -
            new Date(project.start_date).getTime()) /
            (1000 * 60 * 60 * 24)
    );
    const timeProgress = Math.max(
        0,
        Math.min(100, ((totalDays - daysLeft) / totalDays) * 100)
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/projects"
                            className="text-indigo-600 hover:text-indigo-900"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                {project.name}
                            </h1>
                            <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                PRJ-{project.id} XXXXXXXXXXXXXX
                            </span>
                        </div>
                    </div>{" "}
                    <div className="flex items-center space-x-3">
                        {canUpdateProject(auth.user) && (
                            <Link
                                href={`/projects/${project.id}/edit`}
                                className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 inline-flex items-center"
                            >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                            </Link>
                        )}
                        {canDeleteProject(auth.user) && (
                            <button className="px-3 py-1.5 text-sm font-medium border border-red-300 text-red-600 rounded-md hover:bg-red-50 inline-flex items-center">
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                            </button>
                        )}
                        {canAssignTasks(auth.user) && (
                            <Link
                                href={`/tasks/create?project_id=${project.id}`}
                                className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 inline-flex items-center"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                New Task
                            </Link>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`${project.name} - Project Details`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Project Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div className="mb-4 md:mb-0">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {project.name}
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {project.description}
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center">
                                <span className="text-sm text-gray-500 mr-2">
                                    Status:
                                </span>
                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                        project.status
                                    )}`}
                                >
                                    {project.status
                                        .replace("_", " ")
                                        .replace(/\b\w/g, (l) =>
                                            l.toUpperCase()
                                        )}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-sm text-gray-500 mr-2">
                                    Due:
                                </span>
                                <span className="text-sm font-medium">
                                    {new Date(
                                        project.end_date
                                    ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Project Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {/* Progress Card */}{" "}
                        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Project Progress
                                </h3>
                                <span className="text-sm font-bold">
                                    {project.progress || 0}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div
                                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${project.progress || 0}%`,
                                    }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500">
                                {completedTasks} of {totalTasks} tasks completed
                            </p>
                        </div>
                        {/* Overdue Tasks Card */}
                        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                            <div className="flex items-start">
                                <div className="p-2 bg-red-100 rounded-full mr-3">
                                    <Clock className="w-4 h-4 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                                        Overdue Tasks
                                    </h3>
                                    <p className="text-2xl font-bold">
                                        {overdueTasks}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Team Members Card */}
                        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500 mb-3">
                                Team Members
                            </h3>
                            <div className="flex -space-x-2">
                                {project.members
                                    ?.slice(0, 4)
                                    .map((member, index) => (
                                        <div
                                            key={member.id}
                                            className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600"
                                            title={member.name}
                                        >
                                            {member.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )) || (
                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600">
                                        {project?.user?.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                )}
                                {project.members &&
                                    project.members.length > 4 && (
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium">
                                            +{project.members.length - 4}
                                        </div>
                                    )}
                            </div>
                        </div>
                        {/* Timeline Card */}
                        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                Timeline
                            </h3>
                            <div className="flex items-center">
                                <div className="text-xs text-gray-500 mr-2">
                                    <Calendar className="w-3 h-3 inline mr-1" />
                                    <span>
                                        {new Date(
                                            project.start_date
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })}{" "}
                                        -{" "}
                                        {new Date(
                                            project.end_date
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    <span>
                                        {daysLeft > 0
                                            ? `${daysLeft} days left`
                                            : "Overdue"}
                                    </span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                <div
                                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${timeProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Project Details Sections */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left Column */}
                        <div className="lg:w-2/3">
                            {/* Tasks Section */}
                            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 mb-6">
                                <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Tasks
                                    </h3>{" "}
                                    <div className="flex items-center space-x-2">
                                        {canAssignTasks(auth.user) && (
                                            <Link
                                                href={`/tasks/create?project_id=${project.id}`}
                                                className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 inline-flex items-center"
                                            >
                                                <Plus className="w-4 h-4 mr-1" />
                                                Add Task
                                            </Link>
                                        )}
                                        <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
                                            <Filter className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {project.tasks?.slice(0, 5).map((task) => (
                                        <div
                                            key={task.id}
                                            className="p-4 hover:bg-gray-50 transition-all duration-200"
                                        >
                                            <div className="flex items-start">
                                                <div className="mr-3 pt-1">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                                                        defaultChecked={
                                                            task.status ===
                                                            "completed"
                                                        }
                                                        onChange={(e) => {
                                                            // Handle task completion toggle
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <Link
                                                            href={`/tasks/${task.id}`}
                                                        >
                                                            <h4
                                                                className={`text-sm font-medium mb-1 ${
                                                                    task.status ===
                                                                    "completed"
                                                                        ? "line-through text-gray-400"
                                                                        : "text-gray-900"
                                                                }`}
                                                            >
                                                                {task.title}
                                                            </h4>
                                                        </Link>
                                                        <span
                                                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(
                                                                task.priority ||
                                                                    "medium"
                                                            )}`}
                                                        >
                                                            {(
                                                                task.priority ||
                                                                "medium"
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                (
                                                                    task.priority ||
                                                                    "medium"
                                                                ).slice(1)}
                                                        </span>
                                                    </div>
                                                    <p
                                                        className={`text-sm mb-2 ${
                                                            task.status ===
                                                            "completed"
                                                                ? "line-through text-gray-400"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        {task.description}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(
                                                                    task.status
                                                                )}`}
                                                            >
                                                                {task.status
                                                                    .replace(
                                                                        "_",
                                                                        " "
                                                                    )
                                                                    .replace(
                                                                        /\b\w/g,
                                                                        (l) =>
                                                                            l.toUpperCase()
                                                                    )}
                                                            </span>
                                                            <span
                                                                className={`text-xs ml-3 ${
                                                                    task.status ===
                                                                    "completed"
                                                                        ? "line-through text-gray-400"
                                                                        : "text-gray-500"
                                                                }`}
                                                            >
                                                                Due{" "}
                                                                {new Date(
                                                                    task.due_date
                                                                ).toLocaleDateString(
                                                                    "en-US",
                                                                    {
                                                                        month: "short",
                                                                        day: "numeric",
                                                                    }
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            {task.assigned_to && (
                                                                <div
                                                                    className="w-6 h-6 rounded-full border border-white bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600"
                                                                    title={
                                                                        task
                                                                            .assignee
                                                                            ?.name
                                                                    }
                                                                >
                                                                    {task.assignee?.name
                                                                        ?.charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )) || (
                                        <div className="p-8 text-center text-gray-500">
                                            <p>
                                                No tasks found for this project.
                                            </p>
                                            <Link
                                                href={`/tasks/create?project_id=${project.id}`}
                                                className="text-indigo-600 hover:text-indigo-900 font-medium"
                                            >
                                                Create your first task
                                            </Link>
                                        </div>
                                    )}

                                    {project.tasks &&
                                        project.tasks.length > 5 && (
                                            <div className="px-4 py-3 bg-gray-50 text-center">
                                                <Link
                                                    href={`/tasks?project=${project.id}`}
                                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                                                >
                                                    View all{" "}
                                                    {project.tasks.length} tasks
                                                    →
                                                </Link>
                                            </div>
                                        )}
                                </div>
                            </div>

                            {/* Project Resources */}
                            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 mb-6">
                                <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Project Resources
                                    </h3>
                                </div>{" "}
                                <div className="p-5">
                                    <div className="space-y-4">
                                        {Array.isArray(project.attachments) &&
                                        project.attachments.length > 0 ? (
                                            project.attachments.map(
                                                (
                                                    attachment: ProjectAttachment,
                                                    index: number
                                                ) => (
                                                    <div
                                                        key={
                                                            attachment.id ||
                                                            index
                                                        }
                                                        className="flex items-center"
                                                    >
                                                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600 mr-4">
                                                            {attachment.type.includes(
                                                                "pdf"
                                                            ) ? (
                                                                <FileText className="w-5 h-5" />
                                                            ) : attachment.type.includes(
                                                                  "image"
                                                              ) ? (
                                                                <img
                                                                    src={
                                                                        attachment.path
                                                                    }
                                                                    alt={
                                                                        attachment.filename
                                                                    }
                                                                    className="w-5 h-5 object-cover"
                                                                />
                                                            ) : (
                                                                <Folder className="w-5 h-5" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {
                                                                    attachment.filename
                                                                }
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                Uploaded{" "}
                                                                {new Date(
                                                                    attachment.uploaded_at
                                                                ).toLocaleDateString(
                                                                    "en-US",
                                                                    {
                                                                        month: "short",
                                                                        day: "numeric",
                                                                    }
                                                                )}
                                                            </p>
                                                        </div>
                                                        <button className="text-gray-400 hover:text-gray-600">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                No resources uploaded yet.
                                            </p>
                                        )}
                                    </div>
                                    <button className="mt-4 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-900 inline-flex items-center">
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add Resource
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="lg:w-1/3">
                            {/* Project Description */}
                            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 mb-6">
                                <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Project Description
                                    </h3>
                                </div>
                                <div className="p-5">
                                    <p className="text-sm text-gray-700 mb-4">
                                        {project.description}
                                    </p>
                                    {project.category && (
                                        <div className="mb-4">
                                            <span className="text-sm text-gray-500">
                                                Category:
                                            </span>
                                            <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                                {project.category}
                                            </span>
                                        </div>
                                    )}
                                    {project.tags &&
                                        project.tags.length > 0 && (
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    Tags:
                                                </span>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {project.tags.map(
                                                        (tag, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs"
                                                            >
                                                                {tag}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>

                            {/* Budget Information */}
                            {project.budget && (
                                <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 mb-6">
                                    <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Budget
                                        </h3>
                                    </div>
                                    <div className="p-5">
                                        {" "}
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm text-gray-500">
                                                Total Budget:
                                            </span>
                                            <span className="font-medium">
                                                $
                                                {(
                                                    project.budget || 0
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm text-gray-500">
                                                Spent:
                                            </span>
                                            <span className="font-medium">
                                                $
                                                {(
                                                    project.spent_budget || 0
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm text-gray-500">
                                                Remaining:
                                            </span>
                                            <span className="font-medium">
                                                $
                                                {(
                                                    (project.budget || 0) -
                                                    (project.spent_budget || 0)
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-600 h-2 rounded-full"
                                                style={{
                                                    width: `${Math.min(
                                                        100,
                                                        ((project.spent_budget ||
                                                            0) /
                                                            (project.budget ||
                                                                1)) *
                                                            100
                                                    )}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {(
                                                ((project.spent_budget || 0) /
                                                    (project.budget || 1)) *
                                                100
                                            ).toFixed(1)}
                                            % of budget used
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Recent Activity */}
                            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                                <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Recent Activity
                                    </h3>
                                </div>
                                <div className="p-5">
                                    <div className="flow-root">
                                        <ul className="-mb-4">
                                            {project.activity
                                                ?.slice(0, 4)
                                                .map((activity) => (
                                                    <li
                                                        key={activity.id}
                                                        className="mb-4 pb-4 border-b border-gray-200"
                                                    >
                                                        <div className="flex items-center">
                                                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600 mr-3">
                                                                {activity.user.name
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-sm text-gray-800 mb-1">
                                                                    <span className="font-medium">
                                                                        {
                                                                            activity
                                                                                .user
                                                                                .name
                                                                        }
                                                                    </span>{" "}
                                                                    {
                                                                        activity.action
                                                                    }{" "}
                                                                    <span className="font-medium">
                                                                        {
                                                                            activity.target
                                                                        }
                                                                    </span>
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {new Date(
                                                                        activity.created_at
                                                                    ).toLocaleDateString(
                                                                        "en-US",
                                                                        {
                                                                            month: "short",
                                                                            day: "numeric",
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                        }
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )) || (
                                                <li className="text-sm text-gray-500 text-center py-4">
                                                    No recent activity
                                                </li>
                                            )}
                                        </ul>
                                    </div>{" "}
                                    <button className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-900">
                                        View all activity →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    {canCommentProjects(auth.user) && (
                        <div className="mt-6">
                            <ProjectComments
                                projectId={project.id}
                                comments={project.comments || []}
                                currentUser={auth.user}
                            />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
