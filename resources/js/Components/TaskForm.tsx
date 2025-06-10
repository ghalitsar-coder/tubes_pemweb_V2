import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import TaskTypeSelector from "./TaskTypeSelector";
import PrioritySelector from "./PrioritySelector";
import TagInput from "./TagInput";
import FileUploader from "./FileUploader";
import { Checkbox } from "./ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { CalendarDays } from "lucide-react";
import ProjectDateRangePicker from "./ProjectDateRangePicker";
import { DatePickerWithRange } from "./ui/date-picker-with-range";
import { DateRange } from "react-day-picker";
import {
    formatDateToString,
    getFullCloudinaryUrl,
    getPreviewUrl,
    parseDate,
} from "@/lib/utils";
import type { FormDataConvertible } from "@inertiajs/core";
import { set } from "date-fns";
interface User {
    id: number;
    name: string;
    email: string;
}

interface Project {
    id: number;
    name: string;
}

interface TaskAttachment {
    id: number;
    filename: string;
    path: string;
    type: string;
    uploaded_at: string;
    comments?: {
        id: number;
        content: string;
        user: {
            id: number;
            name: string;
            avatar?: string;
        };
        created_at: string;
    }[];
}

interface Task {
    id: number;
    title: string;
    description: string;
    task_type: string;
    project_id: number;
    assigned_to: number | null;
    status: "todo" | "in_progress" | "on_hold" | "completed";
    due_date: string;
    tags?: string | null;
    time_estimate?: number | null;
    start_date?: string | null;
    priority: string;
    created_at?: string;
    updated_at?: string;

    attachments?: TaskAttachment[];
}

interface TaskFormProps {
    projects: Project[];
    users: User[];
    task?: Task;
    isEdit?: boolean;
    selectedProject?: {
        id: number;
        name: string;
    } | null;
}

const TaskForm: React.FC<TaskFormProps> = ({
    projects,
    users,
    task,
    isEdit = false,
    selectedProject,
}) => {
    console.log(`THIS IS  task:`, task);
    // console.log(`THIS IS  users:`, users);
    const [hasDependencies, setHasDependencies] = useState(false);
    // Initialize selectedTags from existing task tags
    const [selectedTags, setSelectedTags] = useState<string[]>(() => {
        if (task?.tags) {
            const tagsArray = task.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);
            console.log(
                "Initial tags from task:",
                task.tags,
                "parsed as:",
                tagsArray
            );
            return tagsArray;
        }
        console.log("No initial tags found");
        return [];
    }); // Initialize date range state
    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        // Helper function to parse date safely from either YYYY-MM-DD or ISO format

        const startDate = task?.start_date ? parseDate(task.start_date) : null;
        const endDate = task?.due_date ? parseDate(task.due_date) : null;

        if (startDate && endDate) {
            return { from: startDate, to: endDate };
        } else if (startDate) {
            return { from: startDate, to: undefined };
        } else if (endDate) {
            return { from: undefined, to: endDate };
        }
        return undefined;
    });
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: task?.title || "",
        description: task?.description || "",
        project_id:
            task?.project_id.toString() || selectedProject?.id.toString() || "",
        task_type: task?.task_type || "feature",
        priority: task?.priority || "medium",
        assigned_to: task?.assigned_to?.toString() || "",
        due_date: task?.due_date || "",
        start_date: task?.start_date || "",
        time_estimate: task?.time_estimate?.toString() || "",
        tags: task?.tags || "",
        status: task?.status || "todo",
        dependencies: [] as number[], // Inisialisasi dengan array kosong
        existing_attachments:
            task?.attachments?.map((att: TaskAttachment) => att.id) || [], // Ambil hanya ID
        attachments: [] as File[], // File baru
    });
    console.log(`THIS IS  data:`, data);
    // console.log(`THIS IS  data:`, data);    // Sync selectedTags with form data when task changes

    // Helper function to format date to YYYY-MM-DD without timezone issues

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare data for submission with current state values
        const submissionData = {
            ...data,
            tags: selectedTags.join(","),
            start_date: dateRange?.from
                ? formatDateToString(dateRange.from)
                : "",
            due_date: dateRange?.to ? formatDateToString(dateRange.to) : "",
        };

        // Update form data with all prepared values at once
        // Debug: Log submission data
        setData(submissionData);
        // Submit the form after a brief delay to ensure setData completes
        if (isEdit && task) {
            console.log(`Updating data:`, data);

            put(route("tasks.update", task.id), {
                onSuccess: () => console.log("Task updated successfully"),
                onError: (errors) => console.log("Update errors:", errors),
            });
        } else {
            post(route("tasks.store"), {
                onSuccess: () => {
                    console.log("Task created successfully");
                    reset();
                    setSelectedTags([]);
                    setHasDependencies(false);
                },
                onError: (errors) => {
                    console.log("Create errors:", errors);
                },
            });
        }
    };
    const handleTagsChange = (tags: string[]) => {
        setSelectedTags(tags);
        const tagsString = tags.join(",");
        setData("tags", tagsString);
    };

    const handleFileUpload = (files: File[]) => {
        console.log(`THIS IS  files:`, files);
        console.log(
            "Files type check:",
            files.map((f) => ({
                name: f.name,
                instanceofFile: f instanceof File,
            }))
        );
        setData("attachments", [...data.attachments, ...files]);
        console.log("New files added:", files);
    };
    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Main Task Details */}
                <div className="lg:col-span-2">
                    {" "}
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
                        {isEdit ? "Edit Task" : "Create New Task"}
                    </h2>
                    {/* Title */}
                    <div className="mb-6">
                        <Label htmlFor="title">Task Title *</Label>
                        <Input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            placeholder="Enter task title"
                            className="mt-1"
                            required
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.title}
                            </p>
                        )}
                    </div>
                    {/* Description */}
                    <div className="mb-6">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            placeholder="Provide detailed task description"
                            rows={4}
                            className="mt-1"
                            required
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description}
                            </p>
                        )}
                    </div>
                    {/* Task Dependencies */}
                    <div className="mb-6">
                        <Label>Dependencies</Label>
                        <div className="mt-2 space-y-2">
                            <div className="flex items-center space-x-2">
                                {" "}
                                <Checkbox
                                    id="has-dependencies"
                                    checked={hasDependencies}
                                    onCheckedChange={(checked: boolean) =>
                                        setHasDependencies(!!checked)
                                    }
                                />
                                <Label
                                    htmlFor="has-dependencies"
                                    className="text-sm font-normal"
                                >
                                    This task depends on other tasks
                                </Label>
                            </div>{" "}
                            {hasDependencies && (
                                <div className="mt-2">
                                    <Select
                                        value=""
                                        onValueChange={(value) => {
                                            // Handle dependency selection
                                            console.log(
                                                "Selected dependency:",
                                                value
                                            );
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select dependent tasks" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <div className="px-2 py-1.5 text-sm text-gray-500">
                                                No tasks available for
                                                dependencies
                                            </div>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Hold Ctrl/Cmd to select multiple tasks
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>{" "}
                    {/* Attachments */}
                    <div>
                        <Label>Attachments</Label>
                        <FileUploader onFilesChange={handleFileUpload} />

                        {/* Preview existing attachments when editing */}
                        {isEdit &&
                            task?.attachments &&
                            task.attachments.length > 0 && (
                                <div className="mt-4">
                                    <Label className="text-sm font-medium">
                                        Existing Attachments
                                    </Label>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        {task.attachments.map((attachment) => (
                                            <div
                                                key={attachment.id}
                                                className="border rounded-lg p-3"
                                            >
                                                {attachment.type.startsWith(
                                                    "image/"
                                                ) ? (
                                                    <div className="space-y-2">
                                                        <img
                                                            src={getPreviewUrl(
                                                                attachment.path.slice(
                                                                    attachment.path.indexOf(
                                                                        "/"
                                                                    )
                                                                )
                                                            )}
                                                            alt={
                                                                attachment.filename
                                                            }
                                                            className="w-full h-32 object-cover rounded"
                                                        />
                                                        <p className="text-sm text-gray-600 truncate">
                                                            {
                                                                attachment.filename
                                                            }
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                                            📄
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium truncate">
                                                                {
                                                                    attachment.filename
                                                                }
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {
                                                                    attachment.type
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                    </div>
                </div>

                {/* Task Metadata */}
                <div className="space-y-6">
                    {/* Project Selection */}
                    <div>
                        <Label htmlFor="project">Project *</Label>
                        {selectedProject ? (
                            <div className="mt-1">
                                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                                    {selectedProject.name}
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    Project automatically selected from project
                                    detail page
                                </p>
                            </div>
                        ) : (
                            <Select
                                value={data.project_id}
                                onValueChange={(value) =>
                                    setData("project_id", value)
                                }
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select a project" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects && projects.length > 0 ? (
                                        projects.map((project) => (
                                            <SelectItem
                                                key={project.id}
                                                value={project.id.toString()}
                                            >
                                                {project.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className="px-2 py-1.5 text-sm text-gray-500">
                                            No projects available
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                        {errors.project_id && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.project_id}
                            </p>
                        )}
                    </div>
                    {/* Task Type */}
                    <div>
                        <Label>Task Type</Label>{" "}
                        <TaskTypeSelector
                            value={data.task_type}
                            onChange={(value: string) =>
                                setData("task_type", value)
                            }
                        />
                    </div>
                    {/* Priority */}
                    <div>
                        <Label>Priority</Label>{" "}
                        <PrioritySelector
                            value={data.priority}
                            onChange={(value: string) =>
                                setData("priority", value)
                            }
                        />
                    </div>{" "}
                    {/* Assignee */}
                    <div>
                        <Label htmlFor="assignee">Assignee</Label>
                        <Select
                            value={data.assigned_to}
                            onValueChange={(value) =>
                                setData("assigned_to", value)
                            }
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Unassigned" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* <SelectItem value="">Unassigned</SelectItem> */}
                                {users && users.length > 0 ? (
                                    users.map((user) => (
                                        <SelectItem
                                            key={user.id}
                                            value={user.id.toString()}
                                        >
                                            {user.name} ({user.email})
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="px-2 py-1.5 text-sm text-gray-500">
                                        No users available
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                        {errors.assigned_to && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.assigned_to}
                            </p>
                        )}
                    </div>{" "}
                    <div>
                        {" "}
                        <Label
                            htmlFor="task-dates"
                            className="flex items-center gap-2"
                        >
                            <CalendarDays className="h-4 w-4" />
                            Task Dates
                        </Label>
                        <div className="mt-1">
                            {" "}
                            <DatePickerWithRange
                                date={dateRange}
                                onDateChange={(
                                    range: DateRange | undefined
                                ) => {
                                    console.log("DateRange changed:", range);
                                    setDateRange(range);

                                    // Update form data
                                    if (range?.from) {
                                        // Use local date formatting to avoid timezone issues
                                        const year = range.from.getFullYear();
                                        const month = String(
                                            range.from.getMonth() + 1
                                        ).padStart(2, "0");
                                        const day = String(
                                            range.from.getDate()
                                        ).padStart(2, "0");
                                        const startDate = `${year}-${month}-${day}`;
                                        console.log(
                                            "Setting start_date:",
                                            startDate
                                        );
                                        setData("start_date", startDate);
                                    } else {
                                        console.log("Clearing start_date");
                                        setData("start_date", "");
                                    }

                                    if (range?.to) {
                                        // Use local date formatting to avoid timezone issues
                                        const year = range.to.getFullYear();
                                        const month = String(
                                            range.to.getMonth() + 1
                                        ).padStart(2, "0");
                                        const day = String(
                                            range.to.getDate()
                                        ).padStart(2, "0");
                                        const endDate = `${year}-${month}-${day}`;
                                        console.log(
                                            "Setting due_date:",
                                            endDate
                                        );
                                        setData("due_date", endDate);
                                    } else {
                                        console.log("Clearing due_date");
                                        setData("due_date", "");
                                    }
                                }}
                            />
                        </div>
                        {(errors.start_date || errors.due_date) && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.start_date || errors.due_date}
                            </p>
                        )}
                    </div>
                    {/* Time Estimate */}
                    <div>
                        <Label htmlFor="time-estimate">
                            Time Estimate (hours)
                        </Label>
                        <Input
                            id="time-estimate"
                            type="number"
                            value={data.time_estimate}
                            onChange={(e) =>
                                setData("time_estimate", e.target.value)
                            }
                            placeholder="e.g. 3.5"
                            className="mt-1"
                        />
                    </div>
                    {/* Tags */}
                    <div>
                        <Label>Tags</Label>
                        <TagInput
                            tags={selectedTags}
                            onChange={handleTagsChange}
                            placeholder="Add tags separated by commas"
                        />
                    </div>
                    {/* Status */}
                    <div>
                        <Label htmlFor="status">Status</Label>{" "}
                        <Select
                            value={data.status}
                            onValueChange={(value) =>
                                setData(
                                    "status",
                                    value as
                                        | "todo"
                                        | "in_progress"
                                        | "completed"
                                )
                            }
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue />
                            </SelectTrigger>{" "}
                            <SelectContent>
                                <SelectItem value="todo">To Do</SelectItem>
                                <SelectItem value="in_progress">
                                    In Progress
                                </SelectItem>
                                <SelectItem value="completed">
                                    Completed
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Form Actions */}
                    <div className="pt-4">
                        <div className="flex justify-end space-x-3">
                            {" "}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    if (isEdit) {
                                        window.history.back();
                                    } else {
                                        reset();
                                    }
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? isEdit
                                        ? "Saving..."
                                        : "Creating..."
                                    : isEdit
                                    ? "Save Changes"
                                    : "Create Task"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default TaskForm;
