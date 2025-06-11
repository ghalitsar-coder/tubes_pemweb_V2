import React, { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onChange, placeholder }) => {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        } else if (
            e.key === "Backspace" &&
            inputValue === "" &&
            tags.length > 0
        ) {
            removeTag(tags.length - 1);
        }
    };

    const addTag = () => {
        const newTag = inputValue.trim();
        if (newTag && !tags.includes(newTag)) {
            onChange([...tags, newTag]);
            setInputValue("");
        }
    };

    const removeTag = (index: number) => {
        const newTags = tags.filter((_, i) => i !== index);
        onChange(newTags);
    };

    const handleInputBlur = () => {
        if (inputValue.trim()) {
            addTag();
        }
    };

    // Predefined tags for suggestions
    const suggestedTags = [
        "Frontend",
        "Backend",
        "Design",
        "UI/UX",
        "Testing",
        "Documentation",
        "Bug Fix",
        "Feature",
        "Enhancement",
        "Critical",
        "Urgent",
    ];

    return (
        <div className="mt-1">
            <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 dark:border-gray-600 dark:focus-within:border-indigo-400">
                {tags.map((tag, index) => (
                    <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 px-2 py-1 text-xs"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
                <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleInputBlur}
                    placeholder={tags.length === 0 ? placeholder : ""}
                    className="flex-1 min-w-[120px] border-none shadow-none focus:ring-0 focus:border-transparent p-0"
                />
            </div>            {/* Suggested Tags */}
            {suggestedTags.filter(tag => !tags.includes(tag)).length > 0 && (
                <div className="mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Suggested tags:
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {suggestedTags
                            .filter(tag => !tags.includes(tag))
                            .map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => onChange([...tags, tag])}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    {tag}
                                </button>
                            ))}
                    </div>
                </div>
            )}

            {/* Current Tags Display */}
            {tags.length > 0 && (
                <div className="mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Press Enter or comma to add tags, Backspace to remove
                    </p>
                </div>
            )}
        </div>
    );
};

export default TagInput;
