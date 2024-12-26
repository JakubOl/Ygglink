export interface Task {
    guid: string;
    title: string;
    startDate: Date;
    endDate?: Date;
    priority: 'low' | 'medium' | 'high';
}