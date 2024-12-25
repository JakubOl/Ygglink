import { Task } from "./task";

export interface CalendarDay {
    date: Date;
    tasks: Task[];
    dayNumber: number;
    isCurrentMonth: boolean;
}