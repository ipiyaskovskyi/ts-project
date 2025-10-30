import { DateString, Status, Priority } from "../Task";

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