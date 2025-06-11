import React from "react";
import { Button } from "@/components/ui/button";

interface TaskTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const TaskTabs: React.FC<TaskTabsProps> = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: "creation", label: "Task Creation" },
        { id: "bulk-import", label: "Bulk Import" },
        { id: "templates", label: "Task Templates" },
    ];

    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === tab.id
                                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default TaskTabs;
