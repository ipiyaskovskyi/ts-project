import { Severity } from "../Task";
import { TaskType } from "./Task.model";

export type BugType = TaskType & {
  severity: Severity,
  environment: string,
  stepsToReproduce: string,
}
