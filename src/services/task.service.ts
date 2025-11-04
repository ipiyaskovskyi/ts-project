import { Task, CreateTaskInput, UpdateTaskInput, TaskFilters } from '../types/task.types.js';

class TaskService {
  private tasks: Task[] = [];
  private nextId = 1;

  private generateId(): number {
    return this.nextId++;
  }

  getAll(filters?: TaskFilters): Task[] {
    if (!filters || Object.keys(filters).length === 0) {
      return this.tasks;
    }

    return this.tasks.filter(task => {
      if (filters.status && task.status !== filters.status) {
        return false;
      }

      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }

      if (filters.createdAt) {
        const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
        const filterDate = new Date(filters.createdAt).toISOString().split('T')[0];
        if (taskDate !== filterDate) {
          return false;
        }
      }

      return true;
    });
  }

  getById(id: number): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  create(input: CreateTaskInput): Task {
    const now = new Date();
    const task: Task = {
      id: this.generateId(),
      title: input.title,
      description: input.description,
      status: input.status || 'todo',
      priority: input.priority || 'medium',
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.push(task);
    return task;
  }

  update(id: number, input: UpdateTaskInput): Task {
    const taskIndex = this.tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    const task = this.tasks[taskIndex];
    const updatedTask: Task = {
      ...task,
      ...input,
      updatedAt: new Date(),
    };

    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  delete(id: number): boolean {
    const taskIndex = this.tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
      return false;
    }

    this.tasks.splice(taskIndex, 1);
    return true;
  }
}

export const taskService = new TaskService();

