import { z } from 'zod';
import { DateString, TaskFilter, UpdateTaskType } from '../../dto/Task';
import { DEFAULT_DESCRIPTION, DEFAULT_PRIORITY, DEFAULT_STATUS } from '../../constants';
import { TaskType } from '../../dto/models/Task.model';

class TaskService {
  private tasks: TaskType[] = [];

  constructor(initialData?: unknown) {
    if (initialData) {
      this.load(initialData);
    }
  }

  private validateTasksJSON(data: unknown): TaskType[] {
    const schema = z.object({
      id: z.number(),
      title: z.string().min(1, 'Title cannot be empty'),
      priority: z
        .preprocess((value) => (value === '' ? undefined : value), z.enum(['low', 'medium', 'high']).default(DEFAULT_PRIORITY))
        .optional(),
      status: z
        .preprocess((value) => (value === '' ? undefined : value), z.enum(['todo', 'in_progress', 'done']).default(DEFAULT_STATUS))
        .optional(),
      storyPoints: z
        .preprocess((value) => (value === '' ? undefined : value), z.number().default(0))
        .optional(),
      createdAt: z.string().or(z.date()).optional(),
      description: z.string().optional(),
      deadline: z.string().or(z.date()).optional(),
    });
    const tasksSchema = z.array(schema);

    return tasksSchema.parse(data);
  }
  
  private toTime(date?: DateString): number | undefined {
    if (date === undefined) return undefined;
    const timestamp = new Date(date).getTime();

    return Number.isNaN(timestamp) ? undefined : timestamp;
  }

  private validateAndNormalize(task: TaskType): TaskType { 
    const { id, title, description, createdAt } = task;
    if (title.trim().length === 0) {
      throw new Error('title cannot be empty');
    }

    if (description?.trim().length === 0) {
      throw new Error('description cannot be empty string');
    }

    const storyPoints = Number.isFinite(task?.storyPoints || 0)
        ? Math.max(0, task?.storyPoints || 0)
        : 0;

    const createdTs = this.toTime(createdAt);
    if (createdTs === undefined) {
      throw new Error('createdAt must be a valid date');
    }
    const deadlineTs = this.toTime(task.deadline);

    if (task.deadline !== undefined && deadlineTs === undefined) {
      throw new Error('deadline must be a valid date');
    }

    if (deadlineTs !== undefined && deadlineTs < createdTs) {
      throw new Error('deadline cannot be before createdAt');
    }

    return {
      id,
      title,
      priority: task.priority || DEFAULT_PRIORITY,
      createdAt,
      storyPoints,
      status: task.status || DEFAULT_STATUS,
      description: description || DEFAULT_DESCRIPTION,
      deadline: task.deadline ? new Date(task.deadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    };
  }

  private initializeTask(task: TaskType): TaskType {
    const createdAt = task.createdAt || new Date().toISOString();
    const taskWithCreatedAt: TaskType = {
      ...task,
      createdAt
    };

    return this.validateAndNormalize(taskWithCreatedAt);
  }

  generateId(): number {
    return this.tasks.length + 1;
  }

  load(data: unknown): void {
    this.tasks = this.validateTasksJSON(data);
  }

  getAll(): TaskType[] {
    return [...this.tasks];
  }

  getById(id: number): TaskType | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  create(task: TaskType): TaskType {
    if (this.tasks.some((t) => t.id === task.id)) {
      throw new Error(`Task with id ${task.id} already exists`);
    }

    const newTask = this.initializeTask(task);
    this.tasks.push(newTask);
    return newTask;
  }

  update(task: UpdateTaskType): TaskType {
    const index = this.tasks.findIndex((t) => t.id === task.id);

    if (index === -1) {
      throw new Error('Task not found');
    }

    const existingTask = this.tasks[index];
    const updated: TaskType = { 
      ...existingTask, 
      ...task,
    };
    const normalized = this.validateAndNormalize(updated);
    this.tasks[index] = normalized;
    return normalized;
  }

  delete(id: number): void {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    this.tasks.splice(index, 1);
  }

  filter({
    status,
    priority,
    createdFrom,
    createdTo,
  }: TaskFilter): TaskType[] {
    const fromDate = createdFrom ? this.toTime(createdFrom) : undefined;
    const toDate = createdTo ? this.toTime(createdTo) : undefined;

    return this.tasks.filter((t) => {
    if (status && t.status !== status) return false;
    if (priority && t.priority !== priority) return false;

    const createdAtTimestamp = t.createdAt ? this.toTime(t.createdAt) : undefined;

    if (createdAtTimestamp === undefined) return false;

    if (fromDate !== undefined && createdAtTimestamp < fromDate) return false;
    if (toDate !== undefined && createdAtTimestamp > toDate) return false;
    
    return true;
  });
  }
}

export default TaskService;