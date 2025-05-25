import React, { useState, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    Users,
    Plus,
    Bell,
    Flag,
    CheckCircle,
    XCircle,
    MoreVertical,
} from "lucide-react";
// import {
//     format,
//     startOfMonth,
//     endOfMonth,
//     eachDayOfInterval,
//     isSameMonth,
//     isToday,
//     isSameDay
// } from "date-fns";

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

const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};
import { User } from "@/types";
import { Switch } from "@/components/ui/switch";

interface CalendarEvent {
    id: number;
    title: string;
    description?: string;
    date: string;
    start_time?: string;
    end_time?: string;
    formatted_time: string;
    type: string;
    status: string;
    color_class: string;
    icon_class: string;
    is_all_day: boolean;
    location?: string;
    priority: string;
    project?: {
        id: number;
        name: string;
    };
    task?: {
        id: number;
        title: string;
    };
}

interface UpcomingEvent {
    id: number;
    title: string;
    description?: string;
    formatted_date: string;
    formatted_time: string;
    type: string;
    color_class: string;
    icon_class: string;
    days_until: number;
    is_today: boolean;
    location?: string;
}

interface Project {
    id: number;
    name: string;
}

interface Props {
    events: CalendarEvent[];
    upcomingEvents: UpcomingEvent[];
    projects: Project[];
    currentMonth: number;
    currentYear: number;
    view: string;
    monthName: string;
    auth: {
        user: User;
    };
}

export default function CalendarIndex({
    auth,
    events,
    upcomingEvents,
    projects,
    currentMonth,
    currentYear,
    view,
    monthName,
}: Props) {
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        event_date: "",
        start_time: "",
        end_time: "",
        event_type: "meeting",
        color_theme: "",
        is_all_day: false,
        location: "",
        notes: "",
        priority: "medium",
        project_id: "",
        reminder_minutes: 30,
    });
    const currentDate = new Date(currentYear, currentMonth - 1);
    const calendarDays = getCalendarDays(currentDate); // Group events by date
    const eventsByDate = useMemo(() => {
        return events.reduce((acc, event) => {
            // Pastikan format tanggal konsisten (yyyy-MM-dd)
            const date = event.date; // Event date should be in yyyy-MM-dd format
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(event);
            return acc;
        }, {} as Record<string, CalendarEvent[]>);
    }, [events]);

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

        router.get("/calendar", { month: newMonth, year: newYear, view });
    };

    const goToToday = () => {
        const today = new Date();
        router.get("/calendar", {
            month: today.getMonth() + 1,
            year: today.getFullYear(),
            view,
        });
    };

    const handleAddEvent = (date?: Date) => {
        if (date) {
            setSelectedDate(date);
            setFormData((prev) => ({
                ...prev,
                event_date: formatDate(date, "yyyy-MM-dd"),
            }));
        }
        setIsAddEventOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post("/calendar", formData, {
            onSuccess: () => {
                setIsAddEventOpen(false);
                setFormData({
                    title: "",
                    description: "",
                    event_date: "",
                    start_time: "",
                    end_time: "",
                    event_type: "meeting",
                    color_theme: "",
                    is_all_day: false,
                    location: "",
                    notes: "",
                    priority: "medium",
                    project_id: "",
                    reminder_minutes: 30,
                });
            },
            onError: (errors) => {
                console.error("Failed to add event:", errors);
            },
        });
    };

    const getEventIcon = (iconClass: string) => {
        const iconMap: Record<string, React.ReactNode> = {
            "fas fa-users": <Users className="h-3 w-3" />,
            "fas fa-tasks": <CheckCircle className="h-3 w-3" />,
            "fas fa-check": <CheckCircle className="h-3 w-3" />,
            "fas fa-exclamation": <XCircle className="h-3 w-3" />,
            "fas fa-birthday-cake": <Flag className="h-3 w-3" />,
            "fas fa-bell": <Bell className="h-3 w-3" />,
            "fas fa-flag": <Flag className="h-3 w-3" />,
        };
        return iconMap[iconClass] || <CalendarIcon className="h-3 w-3" />;
    }; // Filter today's events from upcomingEvents
    const todayEvents = upcomingEvents.filter((event) => event.is_today);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Calendar" />

            {/* Header */}
            <header className="bg-white shadow-sm z-10">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center">
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Calendar
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
                                router.get("/calendar", {
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
                                <SelectItem value="week">
                                    <CalendarIcon className="h-4 w-4 mr-2 inline" />
                                    Week View
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
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
                                        className={`calendar-day bg-white h-32 p-1 overflow-hidden relative cursor-pointer hover:bg-gray-50 transition duration-150 ${
                                            !isCurrentMonth ? "opacity-50" : ""
                                        } ${
                                            isTodayDate
                                                ? "today border-2 border-indigo-600"
                                                : ""
                                        } ${
                                            dayEvents.length > 0
                                                ? "has-events"
                                                : ""
                                        }`}
                                        onClick={() => handleAddEvent(date)}
                                    >
                                        <div className="text-right text-sm">
                                            {formatDate(date, "d")}
                                        </div>
                                        <div className="absolute inset-0 pt-6 overflow-y-auto">
                                            {dayEvents
                                                .slice(0, 3)
                                                .map((event) => (
                                                    <div
                                                        key={event.id}
                                                        className={`fc-event-main mb-1 ${event.color_class} cursor-pointer hover:opacity-80 transition-opacity`}
                                                        style={{
                                                            padding: "2px 4px",
                                                            borderRadius: "4px",
                                                            fontSize: "0.75rem",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.get(
                                                                `/calendar/${event.id}`
                                                            );
                                                        }}
                                                    >
                                                        {getEventIcon(
                                                            event.icon_class
                                                        )}
                                                        <span className="ml-1 truncate text-xs">
                                                            {event.title}
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

                    {/* Upcoming Events Section */}
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Today's Events */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Today's Events
                                </h3>
                                <p className="mt-1 text-sm text-indigo-600">
                                    {formatDate(new Date(), "MMMM d")}
                                </p>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {todayEvents.length > 0 ? (
                                    todayEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className="p-4 hover:bg-gray-50 cursor-pointer event-card transition duration-150"
                                            onClick={() =>
                                                router.get(
                                                    `/calendar/${event.id}`
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
                                                        event.icon_class
                                                    )}
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {event.title}
                                                    </p>
                                                    {event.description && (
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {event.description}
                                                        </p>
                                                    )}
                                                    <div className="mt-2 flex items-center text-sm text-gray-500">
                                                        <Clock className="h-4 w-4 mr-1" />
                                                        <span>
                                                            {event.formatted_time ||
                                                                "All day"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500">
                                        <p className="text-sm">
                                            No events today
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Upcoming Events */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Upcoming Events
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Next 7 days
                                </p>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {upcomingEvents.filter(
                                    (event) => !event.is_today
                                ).length > 0 ? (
                                    upcomingEvents
                                        .filter((event) => !event.is_today)
                                        .map((event) => (
                                            <div
                                                key={event.id}
                                                className="p-4 hover:bg-gray-50 cursor-pointer event-card transition duration-150"
                                                onClick={() =>
                                                    router.get(
                                                        `/calendar/${event.id}`
                                                    )
                                                }
                                            >
                                                <div className="flex items-start">
                                                    <div
                                                        className={`flex-shrink-0 rounded-md p-2 ${event.color_class
                                                            .replace(
                                                                "text-",
                                                                "bg-"
                                                            )
                                                            .replace(
                                                                "-800",
                                                                "-100"
                                                            )}`}
                                                    >
                                                        {getEventIcon(
                                                            event.icon_class
                                                        )}
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {event.title}
                                                        </p>
                                                        {event.description && (
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                {
                                                                    event.description
                                                                }
                                                            </p>
                                                        )}
                                                        <div className="mt-2 flex items-center text-sm text-gray-500">
                                                            <Clock className="h-4 w-4 mr-1" />
                                                            <span>
                                                                {
                                                                    event.formatted_date
                                                                }
                                                            </span>
                                                            {event.formatted_time && (
                                                                <span className="ml-1">
                                                                    at{" "}
                                                                    {
                                                                        event.formatted_time
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500">
                                        <p className="text-sm">
                                            No upcoming events
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Add Event Form */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Add New Event
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Schedule meetings and reminders
                                </p>
                            </div>
                            <div className="p-5">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="event-title"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Event Title
                                        </label>
                                        <Input
                                            type="text"
                                            id="event-title"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={formData.title}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    title: e.target.value,
                                                }))
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="event-date"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Date
                                        </label>
                                        <Input
                                            type="date"
                                            id="event-date"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={formData.event_date}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    event_date: e.target.value,
                                                }))
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label
                                                htmlFor="start-time"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Start Time
                                            </label>
                                            <Input
                                                type="time"
                                                id="start-time"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                value={formData.start_time}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        start_time:
                                                            e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="end-time"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                End Time
                                            </label>
                                            <Input
                                                type="time"
                                                id="end-time"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                value={formData.end_time}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        end_time:
                                                            e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="event-description"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Description
                                        </label>
                                        <Textarea
                                            id="event-description"
                                            rows={3}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            value={formData.description}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Event Type
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                {
                                                    value: "meeting",
                                                    label: "Meeting",
                                                    color: "bg-blue-100 text-blue-800",
                                                },
                                                {
                                                    value: "task_deadline",
                                                    label: "Task",
                                                    color: "bg-purple-100 text-purple-800",
                                                },
                                                {
                                                    value: "important_deadline",
                                                    label: "Deadline",
                                                    color: "bg-red-100 text-red-800",
                                                },
                                                {
                                                    value: "reminder",
                                                    label: "Reminder",
                                                    color: "bg-green-100 text-green-800",
                                                },
                                            ].map((type) => (
                                                <label
                                                    key={type.value}
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                                                        formData.event_type ===
                                                        type.value
                                                            ? type.color
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="event-type"
                                                        value={type.value}
                                                        checked={
                                                            formData.event_type ===
                                                            type.value
                                                        }
                                                        onChange={(e) =>
                                                            setFormData(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    event_type:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            )
                                                        }
                                                        className="sr-only"
                                                    />
                                                    {type.label}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Add Event
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
