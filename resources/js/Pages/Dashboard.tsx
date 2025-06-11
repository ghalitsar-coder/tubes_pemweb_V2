import { PageProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JWTTestComponent } from "@/components/JWTTestComponent";
import {
    FolderKanban,
    CheckSquare,
    Users,
    Clock,
    TrendingUp,
    Calendar,
    AlertCircle,
    Plus,
    FileText,
    MessageSquare,
    Settings,
    UserPlus,
    Mail,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ChartComp } from "@/components/ui/ChartComp";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    canCreateProject,
    canManageUsers,
    UserWithPermissions,
} from "@/utils/permissions";

interface DashboardProps extends PageProps {
    stats: {
        activeProjects: number;
        tasksDueSoon: number;
        completedTasks: number;
        teamMembers: number;
    };
    projectProgress: {
        name: string;
        progress: number;
        completed_tasks: number;
        remaining_tasks: number;
        total_tasks: number;
        month: string;
    }[];
    recentTasks: {
        id: number;
        title: string;
        project: string;
        dueDate: string;
        status: string;
    }[];
    upcomingDeadlines: {
        id: number;
        title: string;
        project: string;
        dueDate: string;
        priority: string;
    }[];
    teamMembers: {
        id: number;
        name: string;
        role: string;
        email: string;
        avatar: string;
        status: "online" | "offline" | "away";
    }[];
    auth: {
        user: UserWithPermissions;
    };
}

export default function Dashboard({
    auth,
    stats,
    projectProgress,
    recentTasks,
    upcomingDeadlines,
    teamMembers,
}: DashboardProps) {
    // Transform project progress data for the chart - ubah ke completed vs remaining tasks
    const chartData = projectProgress.map((project) => ({
        month: project.name,
        completed: project.completed_tasks,
        remaining: project.remaining_tasks,
    }));

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Dashboard Overview
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Welcome back! Here's what's happening with your
                        projects.
                    </p>
                </div>
                {canCreateProject(auth.user) && (
                    <Button asChild>
                        <Link href={route("projects.create")}>
                            <FolderKanban className="mr-2 h-4 w-4" />
                            New Project
                        </Link>
                    </Button>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2"
                >
                    <Plus className="h-6 w-6" />
                    <span>New Task</span>
                </Button>
                <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2"
                >
                    <FileText className="h-6 w-6" />
                    <span>New Document</span>
                </Button>
                <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2"
                >
                    <MessageSquare className="h-6 w-6" />
                    <span>New Message</span>
                </Button>
                <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2"
                >
                    <Settings className="h-6 w-6" />
                    <span>Settings</span>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-primary rounded-md p-3">
                                <FolderKanban className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dt className="text-sm font-medium text-muted-foreground truncate">
                                    Active Projects
                                </dt>
                                <dd className="flex items-baseline">
                                    <div className="text-2xl font-semibold text-foreground">
                                        {stats.activeProjects}
                                    </div>
                                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                        <TrendingUp className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                                        <span className="sr-only">
                                            Increased by
                                        </span>
                                        12%
                                    </div>
                                </dd>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                                <Clock className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dt className="text-sm font-medium text-muted-foreground truncate">
                                    Tasks Due Soon
                                </dt>
                                <dd className="flex items-baseline">
                                    <div className="text-2xl font-semibold text-foreground">
                                        {stats.tasksDueSoon}
                                    </div>
                                    <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                                        <TrendingUp className="self-center flex-shrink-0 h-5 w-5 text-red-500 rotate-180" />
                                        <span className="sr-only">
                                            Increased by
                                        </span>
                                        8%
                                    </div>
                                </dd>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                <CheckSquare className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dt className="text-sm font-medium text-muted-foreground truncate">
                                    Tasks Completed
                                </dt>
                                <dd className="flex items-baseline">
                                    <div className="text-2xl font-semibold text-foreground">
                                        {stats.completedTasks}
                                    </div>
                                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                        <TrendingUp className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                                        <span className="sr-only">
                                            Increased by
                                        </span>
                                        33%
                                    </div>
                                </dd>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dt className="text-sm font-medium text-muted-foreground truncate">
                                    Team Members
                                </dt>
                                <dd className="flex items-baseline">
                                    <div className="text-2xl font-semibold text-foreground">
                                        {stats.teamMembers}
                                    </div>
                                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                        <TrendingUp className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                                        <span className="sr-only">
                                            Increased by
                                        </span>
                                        25%
                                    </div>
                                </dd>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Project Progress Chart */}
                <Card className="lg:col-span-2">
                    <ChartComp data={chartData} />
                </Card>

                {/* Recent Tasks */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-center justify-between"
                                >
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {task.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {task.project}
                                        </p>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {task.dueDate}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Team Members Table */}
            <Card className="mb-8">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Team Members</CardTitle>
                    {canManageUsers(auth.user) && (
                        <Button variant="outline" size="sm">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Member
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teamMembers?.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={member.avatar}
                                                alt={member.name}
                                                className="h-8 w-8 rounded-full"
                                            />
                                            <span>{member.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{member.role}</TableCell>
                                    <TableCell>{member.email}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`h-2 w-2 rounded-full ${
                                                    member.status === "online"
                                                        ? "bg-green-500"
                                                        : member.status ===
                                                          "away"
                                                        ? "bg-yellow-500"
                                                        : "bg-gray-500"
                                                }`}
                                            />
                                            <span className="capitalize">
                                                {member.status}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">
                                            <Mail className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {upcomingDeadlines?.map((deadline) => (
                            <div
                                key={deadline.id}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            {deadline.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {deadline.project}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <AlertCircle
                                            className={`h-4 w-4 mr-2 ${
                                                deadline.priority === "high"
                                                    ? "text-red-500"
                                                    : deadline.priority ===
                                                      "medium"
                                                    ? "text-yellow-500"
                                                    : "text-green-500"
                                            }`}
                                        />
                                        <span className="text-sm text-muted-foreground">
                                            {deadline.priority}
                                        </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {deadline.dueDate}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Project Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projectProgress.map((project) => (
                    <Card key={project.name}>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {project.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Progress
                                    </span>
                                    <span className="font-medium">
                                        {project.progress}%
                                    </span>
                                </div>
                                <Progress
                                    value={project.progress}
                                    className="h-2"
                                />
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Status
                                    </span>
                                    <span
                                        className={`font-medium ${
                                            project.progress === 100
                                                ? "text-green-500"
                                                : project.progress >= 75
                                                ? "text-blue-500"
                                                : project.progress >= 50
                                                ? "text-yellow-500"
                                                : "text-red-500"
                                        }`}
                                    >
                                        {project.progress === 100
                                            ? "Completed"
                                            : project.progress >= 75
                                            ? "On Track"
                                            : project.progress >= 50
                                            ? "In Progress"
                                            : "At Risk"}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* JWT Test Component for Development */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">
                    JWT Integration Test
                </h2>
                <JWTTestComponent />
            </div>
        </AuthenticatedLayout>
    );
}
