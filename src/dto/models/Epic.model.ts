import { TaskType } from "./Task.model";

export type EpicType = TaskType & {
  childrenIds?: number[],
  color?: string,
}