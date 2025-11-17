export type Status = 'todo' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export type DateString = string | Date;

export type Task = {
  readonly id: number,
  title: string,
  description?: string,
  status: Status,
  priority: Priority,
  createdAt: DateString,
  updatedAt: DateString,
}

export type CreateTaskInput = {
  title: string,
  description?: string,
  status?: Status,
  priority?: Priority,
}

export type UpdateTaskInput = Partial<CreateTaskInput>

export type TaskFilters = {
  createdAt?: DateString,
  status?: Status,
  priority?: Priority,
}

