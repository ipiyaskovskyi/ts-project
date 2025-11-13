import { format, addDays, differenceInDays, startOfDay } from 'date-fns';

export const formatGanttDate = (date: Date): string => {
    return format(date, 'dd');
};

export const generateDateRange = (startDate: Date, days: number): Date[] => {
    return Array.from({ length: days }, (_, i) => addDays(startDate, i));
};

export const calculateTaskPosition = (
    taskStartDate: Date,
    chartStartDate: Date,
    dayWidth: number
): number => {
    const daysDiff = differenceInDays(
        startOfDay(taskStartDate),
        startOfDay(chartStartDate)
    );
    return daysDiff * dayWidth;
};

export const calculateTaskWidth = (
    startDate: Date,
    endDate: Date,
    dayWidth: number
): number => {
    const days =
        differenceInDays(startOfDay(endDate), startOfDay(startDate)) + 1;
    return days * dayWidth;
};

export const isDateRangeOverlapping = (
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
): boolean => {
    return start1 <= end2 && start2 <= end1;
};
