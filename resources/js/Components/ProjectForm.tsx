import React, { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import TagInput from "./TagInput";
import FileUploader from "./FileUploader";
import ProjectDateRangePicker from "./ProjectDateRangePicker";
import { Badge } from "@/components/ui/badge";
import {
    CalendarDays,
    DollarSign,
    Target,
    Tag,
    Users,
    FileText,
    Paperclip,
    Settings,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "./ui/date-picker-with-range";

interface User {
    id: number;
    name: string;
    email: string;
}

interface ProjectFormProps {
    users: User[];
    initialData?: any;
    project?: any;
    isEdit?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
    users,
    initialData = null,
    project = null,
    isEdit = false,
}) => {
    console.log(`THIS IS  users:`, users);
    // Determine if we're editing - prefer isEdit prop, fallback to project existence
    const editMode = isEdit ?? project !== null;

    // Use project data if in edit mode, otherwise use initialData
    const formData = editMode ? project : initialData;

    const [selectedTags, setSelectedTags] = useState<string[]>(() => {
        if (editMode && project?.tags) {
            return Array.isArray(project.tags)
                ? project.tags
                : project.tags.split(",").filter((tag: string) => tag.trim());
        }
        if (initialData?.tags) {
            return Array.isArray(initialData.tags)
                ? initialData.tags
                : initialData.tags
                      .split(",")
                      .filter((tag: string) => tag.trim());
        }
        return [];
    });

    const [progress, setProgress] = useState<number[]>([
        formData?.progress || 0,
    ]);

    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        console.log("Initializing date range with task:", project);
        console.log("start_date:", project?.start_date);
        console.log("end_date:", project?.end_date);

        // Helper function to parse date safely from either YYYY-MM-DD or ISO format
        const parseDate = (dateString: string): Date | null => {
            if (!dateString) return null;

            // Check if it's ISO format (contains 'T')
            if (dateString.includes("T")) {
                // ISO format: "2025-06-02T00:00:00.000000Z"
                const date = new Date(dateString);
                // Create a new date in local timezone to avoid timezone shifts
                return new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                );
            } else {
                // YYYY-MM-DD format: "2025-05-24"
                const [year, month, day] = dateString.split("-").map(Number);
                if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
                return new Date(year, month - 1, day); // month is 0-indexed
            }
        };

        const startDate = project?.start_date
            ? parseDate(project.start_date)
            : null;
        const endDate = project?.end_date ? parseDate(project.end_date) : null;

        console.log("Parsed startDate:", startDate);
        console.log("Parsed endDate:", endDate);

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
        name: formData?.name || "",
        description: formData?.description || "",
        user_id: formData?.user_id?.toString() || "",
        start_date: formData?.start_date || "",
        end_date: formData?.end_date || "",
        progress: formData?.progress || 0,
        status: formData?.status || "not_started",
        budget: formData?.budget?.toString() || "",
        spent_budget: formData?.spent_budget?.toString() || "",
        category: formData?.category || "",
        tags: selectedTags,
        is_template: formData?.is_template || false,
        attachments: [] as File[],
    });
    console.log(`THIS IS  errors:`, errors)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Update the form data with current values
        const updatedData = {
            ...data,
            progress: progress[0],
            tags: selectedTags,
            start_date: dateRange?.from
                ? `${dateRange.from.getFullYear()}-${String(
                      dateRange.from.getMonth() + 1
                  ).padStart(2, "0")}-${String(
                      dateRange.from.getDate()
                  ).padStart(2, "0")}`
                : data.start_date,
            end_date: dateRange?.to
                ? `${dateRange.to.getFullYear()}-${String(
                      dateRange.to.getMonth() + 1
                  ).padStart(2, "0")}-${String(dateRange.to.getDate()).padStart(
                      2,
                      "0"
                  )}`
                : data.end_date,
        };

        // Set all the updated data before submitting
        Object.keys(updatedData).forEach((key) => {
            setData(key as any, updatedData[key as keyof typeof updatedData]);
        });

        if (editMode && project?.id) {
            put(route("projects.update", project.id), {
                onSuccess: () => {
                    // Success handled by redirect
                },
            });
        } else {
            post(route("projects.store"), {
                onSuccess: () => {
                    reset();
                    setSelectedTags([]);
                    setProgress([0]);
                    setDateRange(undefined);
                },
            });
        }
    };

    const handleTagsChange = (tags: string[]) => {
        setSelectedTags(tags);
        setData("tags", tags);
    };

    const handleFileUpload = (files: File[]) => {
        setData("attachments", files);
    };

    const handleProgressChange = (value: number[]) => {
        setProgress(value);
        setData("progress", value[0]);
    };

    const statusOptions = [
        { value: "not_started", label: "Not Started", color: "bg-gray-500" },
        { value: "in_progress", label: "In Progress", color: "bg-blue-500" },
        { value: "on_hold", label: "On Hold", color: "bg-yellow-500" },
        { value: "completed", label: "Completed", color: "bg-green-500" },
    ];

    const getStatusColor = (status: string) => {
        return (
            statusOptions.find((option) => option.value === status)?.color ||
            "bg-gray-500"
        );
    };
    console.log("HELO");

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Main Project Details */}
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <Target className="h-5 w-5 text-blue-600" />{" "}
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {editMode ? "Edit Project" : "Create New Project"}
                        </h2>
                    </div>
                    {/* Project Name */}
                    <div className="mb-6">
                        <Label
                            htmlFor="name"
                            className="flex items-center gap-2"
                        >
                            <FileText className="h-4 w-4" />
                            Project Name *
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Enter project name"
                            className="mt-1"
                            required
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name}
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
                            placeholder="Provide detailed project description"
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
                    {/* Budget Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <Label
                                htmlFor="budget"
                                className="flex items-center gap-2"
                            >
                                <DollarSign className="h-4 w-4" />
                                Total Budget
                            </Label>
                            <Input
                                id="budget"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.budget}
                                onChange={(e) =>
                                    setData("budget", e.target.value)
                                }
                                placeholder="0.00"
                                className="mt-1"
                            />
                            {errors.budget && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.budget}
                                </p>
                            )}
                        </div>{" "}
                        {editMode && (
                            <div>
                                <Label htmlFor="spent_budget">
                                    Spent Budget
                                </Label>
                                <Input
                                    id="spent_budget"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.spent_budget}
                                    onChange={(e) =>
                                        setData("spent_budget", e.target.value)
                                    }
                                    placeholder="0.00"
                                    className="mt-1"
                                />
                                {errors.spent_budget && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.spent_budget}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>{" "}
                    {/* Progress Slider */}
                    {editMode && (
                        <div className="mb-6">
                            <Label className="flex items-center gap-2 mb-3">
                                <Target className="h-4 w-4" />
                                Progress: {progress[0]}%
                            </Label>
                            <div className="px-3">
                                <Slider
                                    value={progress}
                                    onValueChange={handleProgressChange}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-sm text-gray-500 mt-1">
                                    <span>0%</span>
                                    <span>50%</span>
                                    <span>100%</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Category */}
                    <div className="mb-6">
                        <Label
                            htmlFor="category"
                            className="flex items-center gap-2"
                        >
                            <Tag className="h-4 w-4" />
                            Category
                        </Label>
                        <Input
                            id="category"
                            type="text"
                            value={data.category}
                            onChange={(e) =>
                                setData("category", e.target.value)
                            }
                            placeholder="e.g. Web Development, Marketing, Design"
                            className="mt-1"
                        />
                        {errors.category && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.category}
                            </p>
                        )}
                    </div>
                    {/* Tags */}
                    <div className="mb-6">
                        <Label className="flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            Tags
                        </Label>
                        <TagInput
                            tags={selectedTags}
                            onChange={handleTagsChange}
                            placeholder="Add tags separated by commas"
                        />
                    </div>
                    {/* Attachments */}
                    <div>
                        <Label className="flex items-center gap-2">
                            <Paperclip className="h-4 w-4" />
                            Attachments
                        </Label>
                        <FileUploader onFilesChange={handleFileUpload} />
                    </div>
                </div>

                {/* Project Metadata */}
                <div className="space-y-6">
                    {/* Project Manager */}
                    <div>
                        <Label
                            htmlFor="user_id"
                            className="flex items-center gap-2"
                        >
                            <Users className="h-4 w-4" />
                            Project Manager *
                        </Label>
                        <Select
                            value={data.user_id}
                            onValueChange={(value) => setData("user_id", value)}
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select a manager" />
                            </SelectTrigger>
                            <SelectContent>
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
                        {errors.user_id && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.user_id}
                            </p>
                        )}
                    </div>
                    {/* Status */}
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={data.status}
                            onValueChange={(value) => setData("status", value)}
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-2 h-2 rounded-full ${option.color}`}
                                            />
                                            {option.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.status && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.status}
                            </p>
                        )}
                    </div>{" "}
                    {/* Project Date Range */}
                    <div>
                        <Label
                            htmlFor="project-dates"
                            className="flex items-center gap-2"
                        >
                            <CalendarDays className="h-4 w-4" />
                            Project Dates *
                        </Label>
                        <div className="mt-1">
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
                                            "Setting end_date:",
                                            endDate
                                        );
                                        setData("end_date", endDate);
                                    } else {
                                        console.log("Clearing end_date");
                                        setData("end_date", "");
                                    }
                                }}
                            />
                        </div>
                        {(errors.start_date || errors.end_date) && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.start_date || errors.end_date}
                            </p>
                        )}
                    </div>
                    {/* Template Option */}
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Options
                        </Label>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_template"
                                    checked={data.is_template}
                                    onCheckedChange={(checked: boolean) =>
                                        setData("is_template", !!checked)
                                    }
                                />
                                <Label
                                    htmlFor="is_template"
                                    className="text-sm font-normal"
                                >
                                    Save as template
                                </Label>
                            </div>
                            <p className="text-xs text-gray-500">
                                Templates can be reused to create new projects
                            </p>
                        </div>
                    </div>{" "}
                    {/* Current Status Badge */}
                    {editMode && (
                        <div>
                            <Label>Current Status</Label>
                            <div className="mt-2">
                                <Badge
                                    variant="secondary"
                                    className={`${getStatusColor(
                                        data.status
                                    )} text-white`}
                                >
                                    {
                                        statusOptions.find(
                                            (opt) => opt.value === data.status
                                        )?.label
                                    }
                                </Badge>
                            </div>
                        </div>
                    )}
                    {/* Form Actions */}
                    <div className="pt-4">
                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>{" "}
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? editMode
                                        ? "Updating..."
                                        : "Creating..."
                                    : editMode
                                    ? "Update Project"
                                    : "Create Project"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ProjectForm;
