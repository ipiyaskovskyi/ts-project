export type Status = 'todo' | 'in_progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';
export type DateString = string | Date;
export type TaskKind = 'Task' | 'Subtask' | 'Bug' | 'Story' | 'Epic';

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

export class Task {
  id: number;
  title: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  createdAt?: DateString;
  deadline?: DateString;

  constructor(props: TaskType) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.priority = props.priority;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.deadline = props.deadline;
  }

  getTaskInfo() {
    return {
      type: 'Task' as TaskKind,
      id: this.id,
      title: this.title,
      description: this.description,
      priority: this.priority,
      status: this.status,
      createdAt: this.createdAt,
      deadline: this.deadline,
    };
  }
}