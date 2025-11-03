import { TaskType, Status, Priority, DateString, TaskKind } from "./models/Task.model";
import { Severity } from "./models/Bug.model";

export { TaskKind, Status, Priority, DateString };

export type TaskFilter = {
  status?: Status;
  priority?: Priority;
  createdFrom?: DateString;
  createdTo?: DateString;
}

export type UpdateTaskType = Omit<TaskType, 'id' | 'createdAt'> & { id: number };

export type AnyTaskInfo = TaskType & { type: TaskKind };
