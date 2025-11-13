import { Task, User } from "../models/index.js";
import type { Status, Priority } from "../dto/Task.js";

export interface CreateTaskData {
  title: string;
  description?: string | null;
  type?: string | null;
  status?: Status;
  priority?: Priority;
  deadline?: Date | null;
  assigneeId?: number | null;
}

export interface UpdateTaskData {
  title?: string;
  description?: string | null;
  type?: string | null;
  status?: Status;
  priority?: Priority;
  deadline?: Date | null;
  assigneeId?: number | null;
}

export class TasksService {
  async getAllTasks() {
    return await Task.findAll({
      include: [
        {
          model: User,
          as: "assignee",
          attributes: ["id", "firstname", "lastname", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async getTaskById(id: number) {
    return await Task.findByPk(id, {
      include: [
        {
          model: User,
          as: "assignee",
          attributes: ["id", "firstname", "lastname", "email"],
        },
      ],
    });
  }

  async createTask(data: CreateTaskData) {
    const task = await Task.create({
      title: data.title,
      description: data.description || null,
      type: data.type || null,
      status: data.status || "draft",
      priority: data.priority || "medium",
      deadline: data.deadline || null,
      assigneeId: data.assigneeId || null,
    });

    return await this.getTaskById(task.id);
  }

  async updateTask(id: number, data: UpdateTaskData) {
    const task = await Task.findByPk(id);
    if (!task) {
      return null;
    }

    if (data.title !== undefined) {
      task.title = data.title;
    }
    if (data.description !== undefined) {
      task.description = data.description;
    }
    if (data.type !== undefined) {
      task.type = data.type;
    }
    if (data.status !== undefined) {
      task.status = data.status;
    }
    if (data.priority !== undefined) {
      task.priority = data.priority;
    }
    if (data.deadline !== undefined) {
      task.deadline = data.deadline;
    }
    if (data.assigneeId !== undefined) {
      task.assigneeId = data.assigneeId;
    }

    await task.save();
    return await this.getTaskById(task.id);
  }

  async deleteTask(id: number) {
    const task = await Task.findByPk(id);
    if (!task) {
      return false;
    }
    await task.destroy();
    return true;
  }
}
