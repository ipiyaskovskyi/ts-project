import { TaskType, TaskKind } from "./Task.model";
import { Task } from "./Task.model";

export type EpicType = TaskType & {
  childrenIds?: number[],
  color?: string,
}

export class Epic extends Task {
  childrenIds?: number[];
  color?: string;

  constructor(props: EpicType) {
    super(props);
    this.childrenIds = props.childrenIds;
    this.color = props.color;
  }

  getTaskInfo() {
    return {
      ...super.getTaskInfo(),
      type: 'Epic' as TaskKind,
      childrenIds: this.childrenIds,
      color: this.color,
    };
  }
}