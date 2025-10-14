import TaskService from './task.service';
import { TaskType, TaskId, Priority, Status, DateString } from '../../dto/Task';

class TaskController {
  private service: TaskService;

  constructor(service?: TaskService, initialData?: unknown) {
    this.service = service || new TaskService(initialData);
  }

  load(data: unknown): void {
    this.service.load(data);
  }

  generateId(): TaskId {
    return this.service.generateId();
  }

  getAll(): TaskType[] {
    return this.service.getAll();
  }

  getById(id: TaskId): TaskType | undefined {
    return this.service.getById(id);
  }

  create(task: TaskType): TaskType {
    return this.service.create(task);
  }

  update(task: TaskType): TaskType {
    return this.service.update(task);
  }

  delete(id: TaskId): void {
    this.service.delete(id);
  }

  filter(params: {
    status?: Status;
    priority?: Priority;
    createdFrom?: DateString;
    createdTo?: DateString;
  }): TaskType[] {
    return this.service.filter(params);
  }
}

export default TaskController;
