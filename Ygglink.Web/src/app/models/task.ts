import { Subtask } from "./subtask";

export interface TaskItem {
    guid: string;
    title: string;
    description: string;
    date: string;
    isRecurring: boolean;
    subtasks?: Subtask[];
}