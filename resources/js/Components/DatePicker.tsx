import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    placeholder?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onChange,
    placeholder,
}) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(
        value ? new Date(value) : null
    );

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        if (date) {
            // Format date as YYYY-MM-DD for Laravel
            const formattedDate = date.toISOString().split("T")[0];
            onChange(formattedDate);
        } else {
            onChange("");
        }
    };

    return (
        <div className="relative mt-1">
            <ReactDatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                placeholderText={placeholder}
                dateFormat="MMM dd, yyyy"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                wrapperClassName="w-full"
                customInput={
                    <div className="relative">
                        <Input
                            value={
                                selectedDate
                                    ? selectedDate.toLocaleDateString()
                                    : ""
                            }
                            placeholder={placeholder}
                            readOnly
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                }
            />
        </div>
    );
};

export default DatePicker;
