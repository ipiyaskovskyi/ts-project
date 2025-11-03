import { TaskType, TaskKind } from "./Task.model";
import { Task } from "./Task.model";

export type SubtaskType = TaskType & {
  parentId: number,
  labels: string[],
  assignee?: string,
}

export class Subtask extends Task {
  parentId: number;
  labels?: string[];
  assignee?: string;

  constructor(props: SubtaskType) {
    super(props);
    this.parentId = props.parentId;
    this.labels = props.labels;
    this.assignee = props.assignee;
  }

  getTaskInfo() {
    return {
      ...super.getTaskInfo(),
      type: 'Subtask' as TaskKind,
      parentId: this.parentId,
      labels: this.labels,
      assignee: this.assignee,
    };
  }
}