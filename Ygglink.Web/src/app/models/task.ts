import { Subtask } from "./subtask";

export interface Task {
    id: string;
    title: string;
    start: Date;
    end?: Date;
    priority: 'low' | 'medium' | 'high';
    subtasks?: Subtask[];
}