import { TaskType, TaskKind } from "./Task.model";
import { Task } from "./Task.model";

export type StoryType = TaskType & {
  storyPoints: number,
  epicLink?: string,
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
      type: 'Story' as TaskKind,
      storyPoints: this.storyPoints,
      epicLink: this.epicLink,
    };
  }
}