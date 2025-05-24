import React from 'react';
import { cn } from '@/lib/utils';

interface TaskStatusFilterProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  counts: {
    all: number;
    todo: number;
    'in-progress': number;
    'on-hold': number;
    completed: number;
    templates: number;
  };
}

const TaskStatusFilter: React.FC<TaskStatusFilterProps> = ({ 
  activeFilter, 
  setActiveFilter, 
  counts 
}) => {
  const filters = [
    { id: 'all', label: 'All', count: counts.all, class: 'bg-indigo-100 text-indigo-800' },
    { id: 'todo', label: 'Not Started', count: counts.todo, class: 'bg-gray-100 text-gray-800' },
    { id: 'in-progress', label: 'In Progress', count: counts['in-progress'], class: 'bg-blue-100 text-blue-800' },
    { id: 'on-hold', label: 'On Hold', count: counts['on-hold'], class: 'bg-yellow-100 text-yellow-800' },
    { id: 'completed', label: 'Completed', count: counts.completed, class: 'bg-green-100 text-green-800' },
    { id: 'templates', label: 'Templates', count: counts.templates, class: 'bg-purple-100 text-purple-800' },
  ];

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
            activeFilter === filter.id ? filter.class : "bg-gray-100 text-gray-800 hover:bg-gray-200",
          )}
        >
          {filter.label} ({filter.count})
        </button>
      ))}
    </div>
  );
};

export default TaskStatusFilter;