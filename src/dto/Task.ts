export type Status = 'todo' | 'in_progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export type DateString = string | Date;

export type TaskFilter = {
  status?: Status;
  priority?: Priority;
  createdFrom?: DateString;
  createdTo?: DateString;
}

export type Task = {
  readonly id: number,
  title: string,
  createdAt?: DateString,
  status?: Status,
  description?: string,
  priority?: Priority,
  deadline?: DateString,
}
