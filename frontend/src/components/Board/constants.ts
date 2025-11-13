import type { TaskType, Status, Priority } from '../../types';

export const TASK_TYPES: TaskType[] = [
    'Task',
    'Subtask',
    'Bug',
    'Story',
    'Epic',
];

export const STATUSES: Status[] = ['draft', 'in_progress', 'editing', 'done'];

export const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'urgent'];

export const STATUS_LABELS: Record<Status, string> = {
    draft: 'Draft',
    in_progress: 'In Progress',
    editing: 'Editing',
    done: 'Done',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
};
