import { Subtask } from "./subtask";

export interface TaskItem {
    guid: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    subtasks?: Subtask[];
}