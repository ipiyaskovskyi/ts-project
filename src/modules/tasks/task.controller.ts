import TaskService from './task.service';
import { TaskType, TaskFilter } from '../../dto/Task';

class TaskController {
  private service: TaskService;

  constructor(service?: TaskService, initialData?: unknown) {
    this.service = service || new TaskService(initialData);
  }

  load(data: unknown): void {
    this.service.load(data);
  }

  generateId(): number {
    return this.service.generateId();
  }

  getAll(): TaskType[] {
    return this.service.getAll();
  }

  getById(id: number): TaskType | undefined {
    return this.service.getById(id);
  }

  create(task: TaskType): TaskType {
    return this.service.create(task);
  }

  update(task: TaskType): TaskType {
    return this.service.update(task);
  }

  delete(id: number): void {
    this.service.delete(id);
  }

  filter({ status, priority, createdFrom, createdTo }: TaskFilter): TaskType[] {
    return this.service.filter({ status, priority, createdFrom, createdTo });
  }
}

export default TaskController;
