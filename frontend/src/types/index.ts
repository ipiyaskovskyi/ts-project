export interface Subtask {
  id: string;
  label: string;
  title: string;
  completed: boolean;
}

export interface GanttTask {
  id: string;
  label: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  color: string;
}

export type KanbanStatus = "draft" | "in_progress" | "editing" | "done";
export type Priority = "low" | "medium" | "high" | "urgent";
export type TaskType = "Task" | "Subtask" | "Bug" | "Story" | "Epic";

export interface KanbanTask {
  id: number;
  title: string;
  description?: string;
  type: TaskType;
  subtasks?: Subtask[];
  comments?: number;
  files?: number;
  stars?: number;
  progress?: number;
  supervisor?: string;
  status: KanbanStatus;
  priority: Priority;
  createdAt: Date;
  deadline?: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  surname: string;
  description: string;
  avatar?: string;
}

export interface TimeSlot {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
}

export interface EfficiencyItem {
  id: string;
  label: string;
  percentage: number;
  color: string;
}

export interface CompletedTaskData {
  id: string;
  author: string;
  count: number;
}
