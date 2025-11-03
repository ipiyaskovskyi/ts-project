import { TaskType, TaskKind } from "./Task.model";
import { Task } from "./Task.model";

export type Severity = 'minor' | 'major' | 'critical';

export type BugType = TaskType & {
  severity: Severity,
  environment: string,
  stepsToReproduce: string,
}

export class Bug extends Task {
  severity: Severity;
  environment: string;
  stepsToReproduce: string;

  constructor(props: BugType) {
    super(props);
    this.severity = props.severity;
    this.environment = props.environment;
    this.stepsToReproduce = props.stepsToReproduce;
  }

  getTaskInfo() {
    return {
      ...super.getTaskInfo(),
      type: 'Bug' as TaskKind,
      severity: this.severity,
      environment: this.environment,
      stepsToReproduce: this.stepsToReproduce,
    };
  }
}
