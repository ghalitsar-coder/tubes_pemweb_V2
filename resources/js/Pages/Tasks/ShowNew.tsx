import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    ArrowLeft,
    Calendar,
    Users,
    Edit,
    Check,
    Copy,
    Flag,
    Reply,
    Plus,
    MoreVertical,
    Printer,
    AlertCircle,
    Clock,
    FileText,
    MessageSquare,
    Activity,
    Paperclip,
    Trash2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { User, TaskComment } from "@/types";
import {
    canUpdateTasks,
    canDeleteTasks,
    canCommentTasks,
    UserWithPermissions,
} from "@/utils/permissions";
import TaskComments from "@/components/task/TaskComments";

interface Props {
    task: {
        id: number;
        title: string;
        description: string;
        status: string;
        priority?: string;
        due_date: string;
        created_at: string;
        project: {
            id: number;
            name: string;
        };
        assignee: {
            id: number;
            name: string;
            avatar?: string;
        } | null;
        reporter?: {
            id: number;
            name: string;
            avatar?: string;
        };
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
        comments: TaskComment[];
    };
    auth: {
        user: UserWithPermissions;
    };
}

export default function ShowNew({ auth, task }: Props) {
    const [activeTab, setActiveTab] = useState("details");
    const [taskStatus, setTaskStatus] = useState(task.status);
    const getStatusBadge = (status: string) => {
        const statusConfig = {
            todo: { variant: "secondary", label: "To Do" },
            in_progress: { variant: "default", label: "In Progress" },
            on_hold: { variant: "warning", label: "On Hold" },
            completed: { variant: "success", label: "Completed" },
        };

        const config =
            statusConfig[status as keyof typeof statusConfig] ||
            statusConfig.todo;
        return <Badge variant={config.variant as any}>{config.label}</Badge>;
    };

    const getPriorityBadge = (priority: string) => {
        const priorityConfig = {
            low: { variant: "outline", label: "Low", icon: null },
            medium: { variant: "secondary", label: "Medium", icon: null },
            high: { variant: "destructive", label: "High", icon: AlertCircle },
        };

        const config =
            priorityConfig[priority as keyof typeof priorityConfig] ||
            priorityConfig.medium;
        const IconComponent = config.icon;

        return (
            <Badge
                variant={config.variant as any}
                className="flex items-center gap-1"
            >
                {IconComponent && <IconComponent className="h-3 w-3" />}
                {config.label}
            </Badge>
        );
    };
    const handleStatusUpdate = (newStatus: string) => {
        setTaskStatus(newStatus);
        router.patch(
            `/tasks/${task.id}/status`,
            { status: newStatus },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    console.log(`Task status updated to ${newStatus}`);
                },
                onError: (errors) => {
                    console.error("Failed to update task status:", errors);
                    // Revert status on error
                    setTaskStatus(task.status);
                },
            }
        );
    };

    const copyTaskId = () => {
        navigator.clipboard.writeText(`#TASK-${task.id}`);
    };

    const calculateProgress = () => {
        // This would be calculated based on subtasks in a real implementation
        // For now, we'll use a simple status-based calculation
        switch (taskStatus) {
            case "completed":
                return 100;
            case "in_progress":
                return 60;
            case "todo":
                return 0;
            default:
                return 0;
        }
    };

    const getDaysLeft = () => {
        const dueDate = new Date(task.due_date);
        const today = new Date();
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Button variant="ghost" asChild className="mr-2">
                            <Link href="/tasks">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Task Detail
                        </h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm">
                            <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title={task.title} />

            <div className="py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Task Header */}
                    <Card className="mb-6">
                        <CardHeader className="border-b">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline">Task</Badge>
                                        <span className="text-sm font-medium text-muted-foreground">
                                            #TASK-{task.id}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={copyTaskId}
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <h1 className="text-2xl font-semibold text-gray-900">
                                        {task.title}
                                    </h1>
                                </div>{" "}
                                <div className="flex space-x-2">
                                    {canUpdateTasks(auth.user) && (
                                        <Button variant="outline" asChild>
                                            <Link
                                                href={`/tasks/${task.id}/edit`}
                                            >
                                                <Edit className="h-4 w-4 mr-1" />
                                                Edit
                                            </Link>
                                        </Button>
                                    )}{" "}
                                    {canUpdateTasks(auth.user) &&
                                        taskStatus !== "completed" && (
                                            <Button
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        "completed"
                                                    )
                                                }
                                            >
                                                <Check className="h-4 w-4 mr-1" />
                                                Complete Task
                                            </Button>
                                        )}
                                </div>
                            </div>
                        </CardHeader>

                        {/* Task Meta */}
                        <div className="px-6 py-4 bg-muted/50 border-b">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <div>
                                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Status
                                    </h3>
                                    <div className="mt-1 flex items-center gap-3">
                                        {getStatusBadge(taskStatus)}
                                        <span className="text-sm text-muted-foreground">
                                            Updated{" "}
                                            {formatDate(task.created_at)}
                                        </span>
                                    </div>
                                </div>
                                {task.priority && (
                                    <div>
                                        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            Priority
                                        </h3>
                                        <div className="mt-1">
                                            {getPriorityBadge(task.priority)}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Due Date
                                    </h3>
                                    <div className="mt-1 flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">
                                            {formatDate(task.due_date)}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            ({getDaysLeft()} days left)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                                {/* Main Content */}
                                <div className="lg:col-span-2">
                                    {/* Tabs */}
                                    <div className="border-b border-gray-200 mb-6">
                                        <nav className="flex -mb-px space-x-8">
                                            <button
                                                onClick={() =>
                                                    setActiveTab("details")
                                                }
                                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                                    activeTab === "details"
                                                        ? "border-primary text-primary"
                                                        : "border-transparent text-muted-foreground hover:text-gray-700 hover:border-gray-300"
                                                }`}
                                            >
                                                <FileText className="h-4 w-4 inline mr-1" />
                                                Details
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setActiveTab("activity")
                                                }
                                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                                    activeTab === "activity"
                                                        ? "border-primary text-primary"
                                                        : "border-transparent text-muted-foreground hover:text-gray-700 hover:border-gray-300"
                                                }`}
                                            >
                                                <Activity className="h-4 w-4 inline mr-1" />
                                                Activity
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setActiveTab("files")
                                                }
                                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                                    activeTab === "files"
                                                        ? "border-primary text-primary"
                                                        : "border-transparent text-muted-foreground hover:text-gray-700 hover:border-gray-300"
                                                }`}
                                            >
                                                <Paperclip className="h-4 w-4 inline mr-1" />
                                                Files (
                                                {task.attachments?.length || 0})
                                            </button>
                                        </nav>
                                    </div>

                                    {/* Tab Content */}
                                    {activeTab === "details" && (
                                        <div className="space-y-6">
                                            {/* Description */}
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                    Description
                                                </h3>
                                                <div className="prose prose-sm max-w-none text-muted-foreground">
                                                    <p>{task.description}</p>
                                                </div>
                                            </div>{" "}
                                            {/* Comments */}
                                            <TaskComments
                                                taskId={task.id}
                                                comments={task.comments}
                                                currentUser={auth.user}
                                            />
                                        </div>
                                    )}

                                    {activeTab === "activity" && (
                                        <div className="space-y-4">
                                            <div className="text-center py-8 text-muted-foreground">
                                                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                <p>
                                                    Activity tracking coming
                                                    soon
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "files" && (
                                        <div className="space-y-4">
                                            {task.attachments?.length > 0 ? (
                                                task.attachments.map(
                                                    (attachment) => (
                                                        <Card
                                                            key={attachment.id}
                                                        >
                                                            <CardContent className="flex items-center justify-between p-4">
                                                                <div className="flex items-center space-x-3">
                                                                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                                                                    <div>
                                                                        <p className="font-medium">
                                                                            {
                                                                                attachment.filename
                                                                            }
                                                                        </p>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {formatDate(
                                                                                attachment.uploaded_at
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                >
                                                                    Download
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    )
                                                )
                                            ) : (
                                                <div className="text-center py-8 text-muted-foreground">
                                                    <Paperclip className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                    <p>No files attached</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* Task Status */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">
                                                Task Status
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Status
                                                </label>{" "}
                                                <Select
                                                    value={taskStatus}
                                                    onValueChange={
                                                        canUpdateTasks(
                                                            auth.user
                                                        )
                                                            ? handleStatusUpdate
                                                            : undefined
                                                    }
                                                    disabled={
                                                        !canUpdateTasks(
                                                            auth.user
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>{" "}
                                                    <SelectContent>
                                                        <SelectItem value="todo">
                                                            To Do
                                                        </SelectItem>
                                                        <SelectItem value="in_progress">
                                                            In Progress
                                                        </SelectItem>
                                                        <SelectItem value="on_hold">
                                                            On Hold
                                                        </SelectItem>
                                                        <SelectItem value="completed">
                                                            Completed
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>{" "}
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Progress
                                                </label>
                                                <Progress
                                                    value={calculateProgress()}
                                                    className="w-full"
                                                />
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {calculateProgress()}%
                                                    completed
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Task Details */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">
                                                Details
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-5">
                                            {/* Project */}
                                            <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                    Project
                                                </label>
                                                <Link
                                                    href={`/projects/${task.project.id}`}
                                                >
                                                    <Badge variant="secondary">
                                                        {task.project.name}
                                                    </Badge>
                                                </Link>
                                            </div>
                                            {/* Assignee */}
                                            {task.assignee && (
                                                <div>
                                                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                        Assignee
                                                    </label>{" "}
                                                    <div className="flex items-center space-x-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage
                                                                src={
                                                                    task
                                                                        .assignee
                                                                        .avatar ||
                                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                                        task
                                                                            .assignee
                                                                            .name
                                                                    )}&background=0ea5e9&color=fff`
                                                                }
                                                                alt={
                                                                    task
                                                                        .assignee
                                                                        .name
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {task.assignee.name.charAt(
                                                                    0
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm">
                                                            {task.assignee.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Reporter */}
                                            {task.reporter && (
                                                <div>
                                                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                        Reporter
                                                    </label>{" "}
                                                    <div className="flex items-center space-x-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage
                                                                src={
                                                                    task
                                                                        .reporter
                                                                        .avatar ||
                                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                                        task
                                                                            .reporter
                                                                            .name
                                                                    )}&background=0ea5e9&color=fff`
                                                                }
                                                                alt={
                                                                    task
                                                                        .reporter
                                                                        .name
                                                                }
                                                            />
                                                            <AvatarFallback>
                                                                {task.reporter.name.charAt(
                                                                    0
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm">
                                                            {task.reporter.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            lorem
                                            {/* Created Date */}
                                            <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                    Created
                                                </label>
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    {formatDate(
                                                        task.created_at
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
