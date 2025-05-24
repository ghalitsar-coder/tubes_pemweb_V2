import React from "react";
import { Star, Bug, Zap } from "lucide-react";

interface TaskTypeSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

const TaskTypeSelector: React.FC<TaskTypeSelectorProps> = ({
    value,
    onChange,
}) => {
    const taskTypes = [
        {
            id: "feature",
            label: "Feature",
            icon: Star,
            color: "blue",
        },
        {
            id: "bug",
            label: "Bug",
            icon: Bug,
            color: "red",
        },
        {
            id: "improvement",
            label: "Improvement",
            icon: Zap,
            color: "purple",
        },
    ];

    return (
        <div className="grid grid-cols-3 gap-2 mt-1">
            {taskTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = value === type.id;

                return (
                    <label
                        key={type.id}
                        className={`border rounded-md p-3 text-center cursor-pointer transition-colors ${
                            isSelected
                                ? `bg-${type.color}-50 border-${type.color}-400 dark:bg-${type.color}-900/20 dark:border-${type.color}-600`
                                : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
                        }`}
                    >
                        <input
                            type="radio"
                            name="task-type"
                            value={type.id}
                            checked={isSelected}
                            onChange={(e) => onChange(e.target.value)}
                            className="sr-only"
                        />
                        <Icon
                            className={`h-5 w-5 mx-auto mb-1 ${
                                isSelected
                                    ? `text-${type.color}-600 dark:text-${type.color}-400`
                                    : "text-gray-400"
                            }`}
                        />
                        <p className="text-sm font-medium">{type.label}</p>
                    </label>
                );
            })}
        </div>
    );
};

export default TaskTypeSelector;
