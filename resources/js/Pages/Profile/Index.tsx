import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    User,
    Camera,
    Settings,
    Lock,
    Bell,
    Globe,
    Palette,
    FolderKanban,
    CheckSquare,
    Clock,
    Mail,
    MapPin,
    Calendar,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface UserStats {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    assignedTasks: number;
    completedTasks: number;
    pendingTasks: number;
}

interface Project {
    id: number;
    name: string;
    status: string;
    progress: number;
    updated_at: string;
}

interface Task {
    id: number;
    title: string;
    status: string;
    priority: string;
    due_date: string;
    project_name: string;
}

interface Props extends PageProps {
    user: any;
    userStats: UserStats;
    recentProjects: Project[];
    recentTasks: Task[];
    mustVerifyEmail: boolean;
}

export default function ProfileIndex({
    auth,
    user,
    userStats,
    recentProjects,
    recentTasks,
    mustVerifyEmail,
}: Props) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Form for basic profile info
    const {
        data: profileData,
        setData: setProfileData,
        patch: updateProfile,
        processing: profileProcessing,
    } = useForm({
        name: user.name || "",
        email: user.email || "",
    });

    // Form for password update
    const {
        data: passwordData,
        setData: setPasswordData,
        patch: updatePassword,
        processing: passwordProcessing,
        reset: resetPassword,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    // Form for settings
    const {
        data: settingsData,
        setData: setSettingsData,
        patch: updateSettings,
        processing: settingsProcessing,
    } = useForm({
        email_notifications: user.settings?.email_notifications ?? true,
        task_notifications: user.settings?.task_notifications ?? true,
        project_notifications: user.settings?.project_notifications ?? true,
        timezone: user.settings?.timezone ?? "UTC",
        language: user.settings?.language ?? "en",
        theme: user.settings?.theme ?? "system",
    });

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleAvatarUpload = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append("avatar", selectedFile);

            router.post(route("profile.avatar.update"), formData, {
                onSuccess: () => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                },
                onError: (errors) => {
                    console.error("Avatar upload failed:", errors);
                },
            });
        }
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile(route("profile.update"));
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updatePassword(route("profile.password.update"), {
            onSuccess: () => resetPassword(),
        });
    };

    const handleSettingsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings(route("profile.settings.update"));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "in_progress":
                return "bg-blue-100 text-blue-800";
            case "todo":
                return "bg-yellow-100 text-yellow-800";
            case "on_hold":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
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

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Profile Dashboard" />

            <div className="space-y-6">
                {/* Profile Header */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage
                                        src={
                                            previewUrl ||
                                            user.avatar ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                user.name
                                            )}`
                                        }
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="text-2xl">
                                        {user.name?.charAt(0)?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <label
                                    htmlFor="avatar-upload"
                                    className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90"
                                >
                                    <Camera className="h-4 w-4" />
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {user.name}
                                </h1>
                                <p className="text-gray-600">{user.email}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                    <Badge variant="secondary">
                                        {user.role}
                                    </Badge>
                                    {mustVerifyEmail &&
                                        !user.email_verified_at && (
                                            <Badge variant="destructive">
                                                Email Not Verified
                                            </Badge>
                                        )}
                                </div>
                            </div>
                            {selectedFile && (
                                <Button onClick={handleAvatarUpload}>
                                    Upload Avatar
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <FolderKanban className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {userStats.totalProjects}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Total Projects
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Clock className="h-8 w-8 text-blue-500" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {userStats.activeProjects}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Active Projects
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <CheckSquare className="h-8 w-8 text-green-500" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {userStats.completedProjects}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Completed Projects
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <CheckSquare className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {userStats.assignedTasks}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Assigned Tasks
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <CheckSquare className="h-8 w-8 text-green-500" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {userStats.completedTasks}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Completed Tasks
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Clock className="h-8 w-8 text-yellow-500" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {userStats.pendingTasks}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Pending Tasks
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Projects */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <FolderKanban className="h-5 w-5" />
                                        <span>Recent Projects</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentProjects.map((project) => (
                                            <div
                                                key={project.id}
                                                className="flex items-center justify-between p-3 border rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <h4 className="font-medium">
                                                        {project.name}
                                                    </h4>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <Badge
                                                            className={getStatusColor(
                                                                project.status
                                                            )}
                                                        >
                                                            {project.status}
                                                        </Badge>
                                                        <span className="text-sm text-gray-500">
                                                            Updated{" "}
                                                            {new Date(
                                                                project.updated_at
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="w-24">
                                                    <Progress
                                                        value={project.progress}
                                                        className="h-2"
                                                    />
                                                    <p className="text-xs text-center mt-1">
                                                        {project.progress}%
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Tasks */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <CheckSquare className="h-5 w-5" />
                                        <span>Recent Tasks</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentTasks.map((task) => (
                                            <div
                                                key={task.id}
                                                className="p-3 border rounded-lg"
                                            >
                                                <h4 className="font-medium">
                                                    {task.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {task.project_name}
                                                </p>
                                                <div className="flex items-center space-x-2 mt-2">
                                                    <Badge
                                                        className={getStatusColor(
                                                            task.status
                                                        )}
                                                    >
                                                        {task.status}
                                                    </Badge>
                                                    <Badge
                                                        className={getPriorityColor(
                                                            task.priority
                                                        )}
                                                    >
                                                        {task.priority}
                                                    </Badge>
                                                    <span className="text-xs text-gray-500">
                                                        Due:{" "}
                                                        {new Date(
                                                            task.due_date
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Profile Tab */}
                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <User className="h-5 w-5" />
                                    <span>Profile Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleProfileSubmit}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Full Name
                                            </Label>
                                            <Input
                                                id="name"
                                                value={profileData.name}
                                                onChange={(e) =>
                                                    setProfileData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">
                                                Email Address
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) =>
                                                    setProfileData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={profileProcessing}
                                    >
                                        {profileProcessing
                                            ? "Updating..."
                                            : "Update Profile"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Lock className="h-5 w-5" />
                                    <span>Change Password</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handlePasswordSubmit}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="current_password">
                                            Current Password
                                        </Label>
                                        <Input
                                            id="current_password"
                                            type="password"
                                            value={
                                                passwordData.current_password
                                            }
                                            onChange={(e) =>
                                                setPasswordData(
                                                    "current_password",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="password">
                                                New Password
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={passwordData.password}
                                                onChange={(e) =>
                                                    setPasswordData(
                                                        "password",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation">
                                                Confirm Password
                                            </Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={
                                                    passwordData.password_confirmation
                                                }
                                                onChange={(e) =>
                                                    setPasswordData(
                                                        "password_confirmation",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={passwordProcessing}
                                    >
                                        {passwordProcessing
                                            ? "Updating..."
                                            : "Update Password"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Settings className="h-5 w-5" />
                                    <span>Preferences & Settings</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleSettingsSubmit}
                                    className="space-y-6"
                                >
                                    {/* Notification Settings */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium flex items-center space-x-2">
                                            <Bell className="h-5 w-5" />
                                            <span>Notifications</span>
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label htmlFor="email_notifications">
                                                        Email Notifications
                                                    </Label>
                                                    <p className="text-sm text-gray-600">
                                                        Receive notifications
                                                        via email
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="email_notifications"
                                                    checked={
                                                        settingsData.email_notifications
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        setSettingsData(
                                                            "email_notifications",
                                                            checked
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label htmlFor="task_notifications">
                                                        Task Notifications
                                                    </Label>
                                                    <p className="text-sm text-gray-600">
                                                        Get notified about task
                                                        updates
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="task_notifications"
                                                    checked={
                                                        settingsData.task_notifications
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        setSettingsData(
                                                            "task_notifications",
                                                            checked
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label htmlFor="project_notifications">
                                                        Project Notifications
                                                    </Label>
                                                    <p className="text-sm text-gray-600">
                                                        Get notified about
                                                        project updates
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="project_notifications"
                                                    checked={
                                                        settingsData.project_notifications
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        setSettingsData(
                                                            "project_notifications",
                                                            checked
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preferences */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium flex items-center space-x-2">
                                            <Globe className="h-5 w-5" />
                                            <span>Preferences</span>
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="timezone">
                                                    Timezone
                                                </Label>
                                                <Input
                                                    id="timezone"
                                                    value={
                                                        settingsData.timezone
                                                    }
                                                    onChange={(e) =>
                                                        setSettingsData(
                                                            "timezone",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="language">
                                                    Language
                                                </Label>
                                                <Input
                                                    id="language"
                                                    value={
                                                        settingsData.language
                                                    }
                                                    onChange={(e) =>
                                                        setSettingsData(
                                                            "language",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="theme">
                                                    Theme
                                                </Label>
                                                <select
                                                    id="theme"
                                                    value={settingsData.theme}
                                                    onChange={(e) =>
                                                        setSettingsData(
                                                            "theme",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                >
                                                    <option value="light">
                                                        Light
                                                    </option>
                                                    <option value="dark">
                                                        Dark
                                                    </option>
                                                    <option value="system">
                                                        System
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={settingsProcessing}
                                    >
                                        {settingsProcessing
                                            ? "Updating..."
                                            : "Update Settings"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Activity Tab */}
                    <TabsContent value="activity">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Calendar className="h-5 w-5" />
                                    <span>Recent Activity</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <p className="text-gray-600">
                                        Activity tracking will be implemented in
                                        future updates.
                                    </p>

                                    {/* Recent activity would go here */}
                                    <div className="border-l-4 border-blue-500 pl-4 py-2">
                                        <p className="font-medium">
                                            Profile viewed
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Today at{" "}
                                            {new Date().toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AuthenticatedLayout>
    );
}
