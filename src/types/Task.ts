export type Status = 'todo' | 'in-progress' | 'done';
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

export type TaskType = {
  readonly id: number,
  title: string,
  createdAt?: DateString,
  status?: Status,
  storyPoints?: number,
  description?: string,
  priority?: Priority,
  deadline?: DateString,
}

export type AnyTaskInfo = TaskType & { type: TaskKind };

export type SubtaskType = TaskType & {
  parentId: number,
  labels: string[],
  assignee?: string,
}

export type BugType = TaskType & {
  severity: Severity,
  environment: string,
  stepsToReproduce: string,
}

export type StoryType = TaskType & {
  storyPoints: number,
  epicLink?: string,
}

export type EpicType = TaskType & {
  childrenIds?: number[],
  color?: string,
}