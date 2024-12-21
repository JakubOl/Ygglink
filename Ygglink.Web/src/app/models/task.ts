import { Subtask } from "./subtask";

export interface TaskItem {
    id: number;
    title: string;
    description: string;
    date: string; // ISO string
    isRecurring: boolean;
    subtasks?: Subtask[];
}