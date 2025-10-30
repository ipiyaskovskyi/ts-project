import { TaskType } from "./Task.model";

export type StoryType = TaskType & {
  storyPoints: number,
  epicLink?: string,
}