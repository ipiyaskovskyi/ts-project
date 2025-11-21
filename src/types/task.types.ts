import type { Status, Priority } from '../dto/Task';

export type DateString = string | Date;

export type CreateTaskInput = {
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  deadline?: DateString;
  assigneeId?: number | null;
};

export type UpdateTaskInput = Partial<CreateTaskInput>;

export type TaskFilters = {
  createdAt?: DateString;
  status?: Status;
  priority?: Priority;
};

