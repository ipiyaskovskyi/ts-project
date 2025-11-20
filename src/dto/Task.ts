export type Status = 'todo' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export type DateString = string | Date;

export type TaskType = {
  readonly id: number;
  title: string;
  createdAt?: DateString;
  status?: Status;
  storyPoints?: number;
  description?: string;
  priority?: Priority;
  deadline?: DateString;
}