import { TaskType } from "./models/Task.model";

export type Status = 'todo' | 'in_progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';
export type TaskKind = 'Task' | 'Subtask' | 'Bug' | 'Story' | 'Epic';
export type Severity = 'minor' | 'major' | 'critical';

export type DateString = string | Date;

export type TaskFilter = {
  status?: Status;
  priority?: Priority;
  createdFrom?: DateString;
  createdTo?: DateString;
}

export type UpdateTaskType = Omit<TaskType, 'id' | 'createdAt'> & { id: number };

export type AnyTaskInfo = TaskType & { type: TaskKind };
