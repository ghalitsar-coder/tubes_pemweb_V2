import React, { useState, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    Users,
    Plus,
    Flag,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Folder,
    FolderOpen,
} from "lucide-react";
import { User } from "@/types";

// Helper functions using native JavaScript Date
const formatDate = (date: Date, formatStr: string): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    switch (formatStr) {
        case "yyyy-MM-dd":
            return `${year}-${month}-${day}`;
        case "d":
            return String(date.getDate());
        case "MMMM d":
            const monthNames = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];
            return `${monthNames[date.getMonth()]} ${date.getDate()}`;
        case "MMMM yyyy":
            const monthNamesLong = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];
            return `${monthNamesLong[date.getMonth()]} ${year}`;
        default:
            return date.toLocaleDateString();
    }
};

const startOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const eachDayOfInterval = ({
    start,
    end,
}: {
    start: Date;
    end: Date;
}): Date[] => {
    const days: Date[] = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
        days.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
};

const getCalendarDays = (date: Date): Date[] => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    // Get the start of calendar week (Sunday before month start)
    const calendarStart = new Date(monthStart);
    calendarStart.setDate(monthStart.getDate() - monthStart.getDay());

    // Get the end of calendar week (Saturday after month end)
    const calendarEnd = new Date(monthEnd);
    calendarEnd.setDate(monthEnd.getDate() + (6 - monthEnd.getDay()));

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
};

const isSameMonth = (date1: Date, date2: Date): boolean => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth()
    );
};

const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
};

interface ProjectCalendarEvent {
    id: number;
    project_id: number;
    project_name: string;
    event_type: "created" | "deadline" | "updated" | "deleted";
    event_date: string;
    status: string;
    priority: string;
    progress: number;
    budget?: number;
    team_count: number;
    description?: string;
    color_class: string;
    icon_class: string;
}

interface Project {
    id: number;
    name: string;
    status: string;
    priority: string;
    progress: number;
    start_date: string;
    end_date?: string;
    created_at: string;
    budget?: number;
    team_count: number;
}

interface Props {
    projects: Project[];
    projectEvents: ProjectCalendarEvent[];
    currentMonth: number;
    currentYear: number;
    view: string;
    monthName: string;
    auth: {
        user: User;
    };
}

export default function ProjectsCalendar({
    auth,
    projects,
    projectEvents,
    currentMonth,
    currentYear,
    view,
    monthName,
}: Props) {
    const currentDate = new Date(currentYear, currentMonth - 1);
    const calendarDays = getCalendarDays(currentDate);

    // Group events by date
    const eventsByDate = useMemo(() => {
        return projectEvents.reduce((acc, event) => {
            const date = event.event_date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(event);
            return acc;
        }, {} as Record<string, ProjectCalendarEvent[]>);
    }, [projectEvents]);

    const navigateToMonth = (direction: "prev" | "next") => {
        let newMonth = currentMonth;
        let newYear = currentYear;

        if (direction === "prev") {
            newMonth = currentMonth === 1 ? 12 : currentMonth - 1;
            newYear = currentMonth === 1 ? currentYear - 1 : currentYear;
        } else {
            newMonth = currentMonth === 12 ? 1 : currentMonth + 1;
            newYear = currentMonth === 12 ? currentYear + 1 : currentYear;
        }

        router.get("/projects/calendar", {
            month: newMonth,
            year: newYear,
            view,
        });
    };

    const goToToday = () => {
        const today = new Date();
        router.get("/projects/calendar", {
            month: today.getMonth() + 1,
            year: today.getFullYear(),
            view,
        });
    };

    const getEventIcon = (eventType: string, iconClass: string) => {
        const iconMap: Record<string, React.ReactNode> = {
            created: <Plus className="h-3 w-3" />,
            deadline: <Clock className="h-3 w-3" />,
            updated: <Flag className="h-3 w-3" />,
            deleted: <XCircle className="h-3 w-3" />,
            "fas fa-folder": <Folder className="h-3 w-3" />,
            "fas fa-folder-open": <FolderOpen className="h-3 w-3" />,
            "fas fa-clock": <Clock className="h-3 w-3" />,
            "fas fa-flag": <Flag className="h-3 w-3" />,
        };
        return (
            iconMap[eventType] ||
            iconMap[iconClass] || <CalendarIcon className="h-3 w-3" />
        );
    };

    const getStatusBadgeColor = (status: string) => {
        const colorMap: Record<string, string> = {
            active: "bg-green-100 text-green-800",
            completed: "bg-blue-100 text-blue-800",
            on_hold: "bg-yellow-100 text-yellow-800",
            cancelled: "bg-red-100 text-red-800",
            planning: "bg-purple-100 text-purple-800",
        };
        return colorMap[status] || "bg-gray-100 text-gray-800";
    };

    const getPriorityColor = (priority: string) => {
        const colorMap: Record<string, string> = {
            high: "text-red-600",
            medium: "text-yellow-600",
            low: "text-green-600",
        };
        return colorMap[priority] || "text-gray-600";
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Projects Calendar" />

            {/* Header */}
            <header className="bg-white shadow-sm z-10">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center">
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Projects Calendar
                        </h2>
                        <div className="ml-6 flex items-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigateToMonth("prev")}
                                className="p-2"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <h3 className="text-lg font-medium mx-4 min-w-[140px] text-center">
                                {monthName}
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigateToMonth("next")}
                                className="p-2"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-4"
                                onClick={goToToday}
                            >
                                Today
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Select
                            value={view}
                            onValueChange={(value) =>
                                router.get("/projects/calendar", {
                                    month: currentMonth,
                                    year: currentYear,
                                    view: value,
                                })
                            }
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="month">
                                    <CalendarIcon className="h-4 w-4 mr-2 inline" />
                                    Month View
                                </SelectItem>
                                <SelectItem value="timeline">
                                    <CalendarIcon className="h-4 w-4 mr-2 inline" />
                                    Timeline View
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            size="sm"
                            onClick={() => router.get("/projects")}
                        >
                            <Folder className="mr-2 h-4 w-4" />
                            All Projects
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    {/* Legend */}
                    <div className="bg-white rounded-lg shadow mb-6 p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">
                            Legend
                        </h3>
                        <div className="flex flex-wrap gap-4 text-xs">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-2"></div>
                                <span>Project Created</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-red-100 border border-red-300 rounded mr-2"></div>
                                <span>Project Deadline</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded mr-2"></div>
                                <span>Project Updated</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                                <span>Project Deleted</span>
                            </div>
                        </div>
                    </div>

                    {/* Calendar View */}
                    <div className="bg-white rounded-lg shadow">
                        {/* Calendar Header */}
                        <div className="grid grid-cols-7 gap-px bg-gray-200 border-b border-gray-200">
                            {[
                                "Sunday",
                                "Monday",
                                "Tuesday",
                                "Wednesday",
                                "Thursday",
                                "Friday",
                                "Saturday",
                            ].map((day) => (
                                <div
                                    key={day}
                                    className="bg-white py-3 text-center text-sm font-medium text-gray-700"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Body */}
                        <div className="grid grid-cols-7 gap-px bg-gray-200">
                            {calendarDays.map((date) => {
                                const dateStr = formatDate(date, "yyyy-MM-dd");
                                const dayEvents = eventsByDate[dateStr] || [];
                                const isCurrentMonth = isSameMonth(
                                    date,
                                    currentDate
                                );
                                const isTodayDate = isToday(date);

                                return (
                                    <div
                                        key={dateStr}
                                        className={`calendar-day bg-white h-32 p-1 overflow-hidden relative ${
                                            !isCurrentMonth ? "opacity-50" : ""
                                        } ${
                                            isTodayDate
                                                ? "today border-2 border-blue-600"
                                                : ""
                                        } ${
                                            dayEvents.length > 0
                                                ? "has-events"
                                                : ""
                                        }`}
                                    >
                                        <div className="text-right text-sm font-medium">
                                            {formatDate(date, "d")}
                                        </div>
                                        <div className="absolute inset-0 pt-6 overflow-y-auto">
                                            {dayEvents
                                                .slice(0, 3)
                                                .map((event) => (
                                                    <div
                                                        key={`${event.id}-${event.event_type}`}
                                                        className={`mb-1 ${event.color_class} cursor-pointer hover:opacity-80 transition-opacity`}
                                                        style={{
                                                            padding: "1px 3px",
                                                            borderRadius: "3px",
                                                            fontSize: "0.65rem",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                        onClick={() =>
                                                            router.get(
                                                                `/projects/${event.project_id}`
                                                            )
                                                        }
                                                        title={`${event.project_name} - ${event.event_type}`}
                                                    >
                                                        {getEventIcon(
                                                            event.event_type,
                                                            event.icon_class
                                                        )}
                                                        <span className="ml-1 truncate text-xs">
                                                            {event.project_name}
                                                        </span>
                                                    </div>
                                                ))}
                                            {dayEvents.length > 3 && (
                                                <div className="text-xs text-gray-500 p-1">
                                                    +{dayEvents.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Projects Summary */}
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Active Projects */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Active Projects
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Currently running projects
                                </p>
                            </div>
                            <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                                {projects
                                    .filter((p) => p.status === "active")
                                    .map((project) => (
                                        <div
                                            key={project.id}
                                            className="p-4 hover:bg-gray-50 cursor-pointer transition duration-150"
                                            onClick={() =>
                                                router.get(
                                                    `/projects/${project.id}`
                                                )
                                            }
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {project.name}
                                                    </p>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <Badge
                                                            className={getStatusBadgeColor(
                                                                project.status
                                                            )}
                                                        >
                                                            {project.status}
                                                        </Badge>
                                                        <span
                                                            className={`text-xs ${getPriorityColor(
                                                                project.priority
                                                            )}`}
                                                        >
                                                            {project.priority}{" "}
                                                            priority
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 text-xs text-gray-500">
                                                        Progress:{" "}
                                                        {project.progress}%
                                                    </div>
                                                </div>
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <Users className="h-3 w-3 mr-1" />
                                                    {project.team_count}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Upcoming Deadlines */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Upcoming Deadlines
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Projects ending soon
                                </p>
                            </div>
                            <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                                {projects
                                    .filter(
                                        (p) =>
                                            p.end_date &&
                                            new Date(p.end_date) > new Date()
                                    )
                                    .sort(
                                        (a, b) =>
                                            new Date(a.end_date!).getTime() -
                                            new Date(b.end_date!).getTime()
                                    )
                                    .slice(0, 5)
                                    .map((project) => (
                                        <div
                                            key={project.id}
                                            className="p-4 hover:bg-gray-50 cursor-pointer transition duration-150"
                                            onClick={() =>
                                                router.get(
                                                    `/projects/${project.id}`
                                                )
                                            }
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {project.name}
                                                    </p>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <Clock className="h-3 w-3 text-red-500" />
                                                        <span className="text-xs text-red-600">
                                                            Due:{" "}
                                                            {formatDate(
                                                                new Date(
                                                                    project.end_date!
                                                                ),
                                                                "MMMM d"
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Recent Activity
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Latest project events
                                </p>
                            </div>
                            <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                                {projectEvents
                                    .sort(
                                        (a, b) =>
                                            new Date(b.event_date).getTime() -
                                            new Date(a.event_date).getTime()
                                    )
                                    .slice(0, 10)
                                    .map((event, index) => (
                                        <div
                                            key={`${event.id}-${event.event_type}-${index}`}
                                            className="p-4 hover:bg-gray-50 cursor-pointer transition duration-150"
                                            onClick={() =>
                                                router.get(
                                                    `/projects/${event.project_id}`
                                                )
                                            }
                                        >
                                            <div className="flex items-start">
                                                <div
                                                    className={`flex-shrink-0 rounded-md p-2 ${event.color_class
                                                        .replace("text-", "bg-")
                                                        .replace(
                                                            "-800",
                                                            "-100"
                                                        )}`}
                                                >
                                                    {getEventIcon(
                                                        event.event_type,
                                                        event.icon_class
                                                    )}
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {event.project_name}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500 capitalize">
                                                        {event.event_type.replace(
                                                            "_",
                                                            " "
                                                        )}{" "}
                                                        -{" "}
                                                        {formatDate(
                                                            new Date(
                                                                event.event_date
                                                            ),
                                                            "MMMM d"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
