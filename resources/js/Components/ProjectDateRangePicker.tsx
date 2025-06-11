import React, { useState, useEffect } from "react";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { DateRange } from "react-day-picker";

interface ProjectDateRangePickerProps {
    startDate: string;
    endDate: string;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
}

const ProjectDateRangePicker: React.FC<ProjectDateRangePickerProps> = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
}) => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
        if (startDate || endDate) {
            return {
                from: startDate ? new Date(startDate) : undefined,
                to: endDate ? new Date(endDate) : undefined,
            };
        }
        return undefined;
    });

    useEffect(() => {
        if (dateRange?.from) {
            // Format date as YYYY-MM-DD for Laravel
            const formattedStartDate = dateRange.from
                .toISOString()
                .split("T")[0];
            onStartDateChange(formattedStartDate);
        }

        if (dateRange?.to) {
            // Format date as YYYY-MM-DD for Laravel
            const formattedEndDate = dateRange.to.toISOString().split("T")[0];
            onEndDateChange(formattedEndDate);
        }
    }, [dateRange, onStartDateChange, onEndDateChange]);

    return (
        <DatePickerWithRange
            date={dateRange}
            onDateChange={setDateRange}
            className="w-full"
        />
    );
};

export default ProjectDateRangePicker;
