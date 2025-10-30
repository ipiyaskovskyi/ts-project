import { TaskType } from "./Task.model";

export type SubtaskType = TaskType & {
  parentId: number,
  labels: string[],
  assignee?: string,
}