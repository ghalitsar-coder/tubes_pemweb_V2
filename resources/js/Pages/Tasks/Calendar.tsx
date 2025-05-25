import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Clock,
    AlertTriangle,
    CheckCircle,
    Play,
    RefreshCw,
    Calendar,
    ListTodo,
    User,
    Building,
} from 'lucide-react';
// No date-fns import for now, we'll use native Date

interface Task {
    id: number;
    title: string;
    status: string;
    priority: string;
    project: string | null;
    assignee: string | null;
}

interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    type: 'task_created' | 'task_due' | 'task_start' | 'task_updated';
    color: string;
    description: string;
    is_overdue?: boolean;
    is_today?: boolean;
    task: Task;
}

interface Props {
    auth: {
        user: any;
    };
    events: CalendarEvent[];
    currentMonth: number;
    currentYear: number;
    monthName: string;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
}

const eventTypeLabels = {
    task_created: 'Task Created',
    task_due: 'Due Date',
    task_start: 'Start Date',
    task_updated: 'Updated',
};

const eventTypeIcons = {
    task_created: CheckCircle,
    task_due: AlertTriangle,
    task_start: Play,
    task_updated: RefreshCw,
};

// Helper functions to replace date-fns
const formatDate = (date: Date, format: string): string => {
    if (format === 'yyyy-MM-dd') {
        return date.toISOString().split('T')[0];
    }
    if (format === 'd') {
        return date.getDate().toString();
    }
    if (format === 'MMM d, yyyy') {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }
    return date.toISOString();
};

const startOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const eachDayOfInterval = (interval: { start: Date; end: Date }): Date[] => {
    const days: Date[] = [];
    const current = new Date(interval.start);
    while (current <= interval.end) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    return days;
};

const isSameMonth = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() && 
           date1.getMonth() === date2.getMonth();
};

const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
};

const priorityColors: Record<string, string> = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
    urgent: 'bg-purple-100 text-purple-800',
};

const statusColors: Record<string, string> = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    on_hold: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
};

export default function TasksCalendar({
    auth,
    events,
    currentMonth,
    currentYear,
    monthName,
    totalTasks,
    completedTasks,
    overdueTasks,
}: Props) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);    const currentDate = new Date(currentYear, currentMonth - 1, 1);
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentYear, currentMonth - 1 + (direction === 'next' ? 1 : -1), 1);
        router.visit(`/tasks/calendar?year=${newDate.getFullYear()}&month=${newDate.getMonth() + 1}`);
    };

    const getEventsForDate = (date: Date) => {
        const dateStr = formatDate(date, 'yyyy-MM-dd');
        return events.filter(event => event.date === dateStr);
    };

    const selectedDateEvents = selectedDate ? events.filter(event => event.date === selectedDate) : [];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Tasks Calendar" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Tasks Calendar
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">
                                    View all your tasks and their important dates in calendar format
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Link
                                    href="/tasks"
                                    className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                >
                                    <ListTodo className="h-4 w-4 mr-2" />
                                    View Tasks List
                                </Link>
                                <Link
                                    href="/tasks/create"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Create Task
                                </Link>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <ListTodo className="h-8 w-8 text-blue-600" />
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Total Tasks
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                {totalTasks}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Completed Tasks
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                {completedTasks}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <AlertTriangle className="h-8 w-8 text-red-600" />
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Overdue Tasks
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                {overdueTasks}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Calendar */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2">
                                            <CalendarDays className="h-5 w-5" />
                                            {monthName}
                                        </CardTitle>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigateMonth('prev')}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigateMonth('next')}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {/* Weekday headers */}
                                    <div className="grid grid-cols-7 gap-1 mb-2">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                            <div
                                                key={day}
                                                className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
                                            >
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Calendar grid */}
                                    <div className="grid grid-cols-7 gap-1">
                                        {days.map((day) => {
                                            const dayEvents = getEventsForDate(day);
                                            const dateStr = formatDate(day, 'yyyy-MM-dd');
                                            const isSelectedDate = selectedDate === dateStr;
                                            const isTodayDate = isToday(day);

                                            return (
                                                <div
                                                    key={day.toString()}
                                                    className={`min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors ${
                                                        isSelectedDate
                                                            ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20'
                                                            : isTodayDate
                                                            ? 'bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20'
                                                            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                    }`}
                                                    onClick={() => setSelectedDate(dateStr)}
                                                >
                                                    <div className={`text-sm font-medium mb-1 ${
                                                        isTodayDate ? 'text-yellow-600 dark:text-yellow-400' :
                                                        isSameMonth(day, currentDate) ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'
                                                    }`}>
                                                        {formatDate(day, 'd')}
                                                    </div>
                                                    <div className="space-y-1">
                                                        {dayEvents.slice(0, 3).map((event) => (
                                                            <div
                                                                key={event.id}
                                                                className="text-xs p-1 rounded truncate"
                                                                style={{ backgroundColor: event.color + '20', color: event.color }}
                                                                title={event.description}
                                                            >
                                                                {event.title}
                                                            </div>
                                                        ))}
                                                        {dayEvents.length > 3 && (
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                +{dayEvents.length - 3} more
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Event Details Sidebar */}
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        {selectedDate ? `Events for ${formatDate(new Date(selectedDate), 'MMM d, yyyy')}` : 'Select a Date'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {selectedDateEvents.length > 0 ? (
                                        <div className="space-y-4">
                                            {selectedDateEvents.map((event) => {
                                                const IconComponent = eventTypeIcons[event.type];
                                                return (
                                                    <div
                                                        key={event.id}
                                                        className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <IconComponent 
                                                                className="h-5 w-5 mt-0.5 flex-shrink-0"
                                                                style={{ color: event.color }}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {eventTypeLabels[event.type]}
                                                                    </Badge>
                                                                    {event.is_overdue && (
                                                                        <Badge variant="destructive" className="text-xs">
                                                                            Overdue
                                                                        </Badge>
                                                                    )}
                                                                    {event.is_today && (
                                                                        <Badge variant="default" className="text-xs bg-yellow-500">
                                                                            Today
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                                                                    {event.task.title}
                                                                </p>
                                                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                                                    <div className="flex items-center gap-2">
                                                                        <Badge className={statusColors[event.task.status] || statusColors.todo}>
                                                                            {event.task.status.replace('_', ' ').toUpperCase()}
                                                                        </Badge>
                                                                        <Badge className={priorityColors[event.task.priority] || priorityColors.medium}>
                                                                            {event.task.priority.toUpperCase()}
                                                                        </Badge>
                                                                    </div>
                                                                    {event.task.project && (
                                                                        <div className="flex items-center gap-2">
                                                                            <Building className="h-4 w-4" />
                                                                            <span>{event.task.project}</span>
                                                                        </div>
                                                                    )}
                                                                    {event.task.assignee && (
                                                                        <div className="flex items-center gap-2">
                                                                            <User className="h-4 w-4" />
                                                                            <span>{event.task.assignee}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="mt-3">
                                                                    <Link
                                                                        href={`/tasks/${event.task.id}`}
                                                                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                                                    >
                                                                        View Task →
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : selectedDate ? (
                                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                                            No events on this date
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                                            Click on a date to view events
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Legend */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle className="text-sm">Event Types</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {Object.entries(eventTypeLabels).map(([type, label]) => {
                                            const IconComponent = eventTypeIcons[type as keyof typeof eventTypeIcons];
                                            const color = type === 'task_created' ? '#10b981' :
                                                         type === 'task_due' ? '#6366f1' :
                                                         type === 'task_start' ? '#8b5cf6' : '#06b6d4';
                                            return (
                                                <div key={type} className="flex items-center gap-2 text-sm">
                                                    <IconComponent 
                                                        className="h-4 w-4"
                                                        style={{ color }}
                                                    />
                                                    <span className="text-gray-600 dark:text-gray-400">{label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
