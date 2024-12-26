export interface Task {
    guid: string;
    title: string;
    startDate: string;
    endDate?: string | null;
    priority: 'low' | 'medium' | 'high';
}