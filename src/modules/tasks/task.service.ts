import { z } from 'zod';
import { TaskType, DateString, TaskFilter } from '../../dto/Task';
import { DEFAULT_DESCRIPTION, DEFAULT_PRIORITY, DEFAULT_STATUS } from '../../constants';

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

  private normalize(task: TaskType): TaskType { 
    const { id, title, description } = task;
    if (title.trim().length === 0) {
      throw new Error('title cannot be empty');
    }

    if (typeof description === 'string' && description.trim().length === 0) {
      throw new Error('description cannot be empty string');
    }

    const coerceToDateString = (d?: DateString) => {
      if (d === '' as any) return undefined;
      return d;
    };

    const storyPoints =
      typeof task.storyPoints === 'number' && Number.isFinite(task.storyPoints)
        ? Math.max(0, task.storyPoints)
        : 0;

    const createdAt = coerceToDateString(task.createdAt) ?? new Date().toISOString();
    const deadline = coerceToDateString(task.deadline) ?? undefined;

    const createdTs = this.toTime(createdAt);
    if (createdTs === undefined) {
      throw new Error('createdAt must be a valid date');
    }
    const deadlineTs = this.toTime(deadline);

    if (deadline !== undefined && deadlineTs === undefined) {
      throw new Error('deadline must be a valid date');
    }
    if (deadlineTs !== undefined && deadlineTs < createdTs) {
      throw new Error('deadline cannot be before createdAt');
    }

    return {
      id,
      title,
      priority: task.priority || DEFAULT_PRIORITY,
      createdAt: new Date(),
      storyPoints,
      status: task.status || DEFAULT_STATUS,
      description: description || DEFAULT_DESCRIPTION,
      deadline: deadline ? new Date(deadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    };
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
    const newTask = this.normalize(task);
    this.tasks.push(newTask);
    return newTask;
  }

  update(task: TaskType): TaskType {
    const index = this.tasks.findIndex((t) => t.id === task.id);

    if (index === -1) {
      throw new Error('Task not found');
    }

    const updated: TaskType = { ...this.tasks[index], ...task };
    const normalized = this.normalize(updated);
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