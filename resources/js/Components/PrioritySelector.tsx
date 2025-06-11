import React from "react";
import { AlertCircle, AlertTriangle, ArrowDown } from "lucide-react";

interface PrioritySelectorProps {
    value: string;
    onChange: (value: string) => void;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({
    value,
    onChange,
}) => {
    const priorities = [
        {
            id: "high",
            label: "High",
            icon: AlertCircle,
            color: "red",
        },
        {
            id: "medium",
            label: "Medium",
            icon: AlertTriangle,
            color: "yellow",
        },
        {
            id: "low",
            label: "Low",
            icon: ArrowDown,
            color: "green",
        },
    ];

    return (
        <div className="grid grid-cols-3 gap-2 mt-1">
            {priorities.map((priority) => {
                const Icon = priority.icon;
                const isSelected = value === priority.id;

                return (
                    <label
                        key={priority.id}
                        className={`border rounded-md p-3 text-center cursor-pointer transition-colors ${
                            isSelected
                                ? `bg-${priority.color}-50 border-${priority.color}-400 dark:bg-${priority.color}-900/20 dark:border-${priority.color}-600`
                                : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
                        }`}
                    >
                        <input
                            type="radio"
                            name="priority"
                            value={priority.id}
                            checked={isSelected}
                            onChange={(e) => onChange(e.target.value)}
                            className="sr-only"
                        />
                        <Icon
                            className={`h-5 w-5 mx-auto mb-1 ${
                                isSelected
                                    ? `text-${priority.color}-600 dark:text-${priority.color}-400`
                                    : "text-gray-400"
                            }`}
                        />
                        <p className="text-sm font-medium">{priority.label}</p>
                    </label>
                );
            })}
        </div>
    );
};

export default PrioritySelector;
