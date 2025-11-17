export type Status = 'todo' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export type TaskType = {
  readonly id: number,
  title: string,
  createdAt?: string,
  status?: Status,
  description?: string,
  priority?: Priority,
  deadline?: string,
}