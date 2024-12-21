import { TaskItem } from "./task";

export interface CalendarDay {
    date: Date;
    tasks: TaskItem[];
    dayNumber: number;
    isCurrentMonth: boolean;
}