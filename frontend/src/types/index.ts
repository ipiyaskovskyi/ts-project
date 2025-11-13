export type Status = 'todo' | 'in_progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskType = 'Task' | 'Subtask' | 'Bug' | 'Story' | 'Epic';

export interface Task {
    id: number;
    title: string;
    description?: string;
    type: TaskType;
    status: Status;
    priority: Priority;
    createdAt: Date;
    deadline?: Date;
}
