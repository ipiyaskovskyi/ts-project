export type Status = 'todo' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';
export type ISODateString = string;

export interface TaskAssignee {
  id: number;
  name: string;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: Status;
  priority: Priority;
  deadline?: ISODateString | null;
  assignee?: TaskAssignee | null;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'assignee'> & {
  deadline?: ISODateString | null;
};


