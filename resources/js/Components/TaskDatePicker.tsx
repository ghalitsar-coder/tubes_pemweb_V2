import React, { useState, useEffect } from "react";
import { DatePicker as DatePickerUI } from "@/components/ui/date-picker";

interface TaskDatePickerProps {
    value: string;
    onChange: (date: string) => void;
    placeholder?: string;
}

const TaskDatePicker: React.FC<TaskDatePickerProps> = ({
    value,
    onChange,
    placeholder,
}) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        value ? new Date(value) : undefined
    );

    useEffect(() => {
        if (selectedDate) {
            // Format date as YYYY-MM-DD for Laravel
            const formattedDate = selectedDate.toISOString().split("T")[0];
            onChange(formattedDate);
        }
    }, [selectedDate, onChange]);

    return (
        <DatePickerUI
            date={selectedDate}
            onDateChange={setSelectedDate}
            className="w-full"
        />
    );
};

export default TaskDatePicker;
