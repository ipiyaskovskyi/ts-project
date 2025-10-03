export type Status = 'todo' | 'in_progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export type TaskId = string | number;
export type DateString = string | Date;

export type Task = {
  readonly id: TaskId,
  title: string,
  createdAt?: DateString,
  status?: Status,
  description?: string,
  priority?: Priority,
  deadline?: DateString,
}
