import {
    TaskId,
    Priority,
    Status,
    DateString,
    Severity,
    AnyTaskInfo,
    SubtaskType,
    TaskType,
    BugType,
    StoryType,
    EpicType
} from '../../dto/Task';

export class Task {
  id: TaskId;
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

  getTaskInfo(): AnyTaskInfo {
    return {
      type: 'Task' as const,
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

export class Subtask extends Task {
  parentId: TaskId;
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
      type: 'Subtask' as const,
      parentId: this.parentId,
      labels: this.labels,
      assignee: this.assignee,
    };
  }
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
      type: 'Bug' as const,
      severity: this.severity,
      environment: this.environment,
      stepsToReproduce: this.stepsToReproduce,
    };
  }
}

export class Story extends Task {
  storyPoints: number;
  epicLink?: string;

  constructor(props: StoryType) {
    super(props);
    if (props.storyPoints < 0) {
      throw new Error('StoryPoints cannot be negative');
    }
    this.storyPoints = props.storyPoints;
    this.epicLink = props.epicLink;
  }

  getTaskInfo() {
    return {
      ...super.getTaskInfo(),
      type: 'Story' as const,
      storyPoints: this.storyPoints,
      epicLink: this.epicLink,
    };
  }
}

export class Epic extends Task {
  childrenIds?: TaskId[];
  color?: string;

  constructor(props: EpicType) {
    super(props);
    this.childrenIds = props.childrenIds;
    this.color = props.color;
  }

  getTaskInfo() {
    return {
      ...super.getTaskInfo(),
      type: 'Epic' as const,
      childrenIds: this.childrenIds,
      color: this.color,
    };
  }
}
