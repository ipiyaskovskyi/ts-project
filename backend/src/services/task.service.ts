import { Task, User } from "../models/index.js";
import { AppError } from "../lib/errors.js";
import type {
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
} from "../types/task.types.ts";
import { Op } from "sequelize";

class TaskService {
  async getAll(filters?: TaskFilters) {
    const where: Record<string, unknown> = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.priority) {
      where.priority = filters.priority;
    }

    if (filters?.createdAt) {
      const date = new Date(filters.createdAt);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.createdAt = {
        [Op.gte]: startOfDay,
        [Op.lte]: endOfDay,
      };
    }

    const tasks = await Task.findAll({
      where,
      include: [
        {
          model: User,
          as: "assignee",
          attributes: ["id", "firstname", "lastname", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return tasks;
  }

  async getById(id: number) {
    const task = await Task.findByPk(id, {
      include: [
        {
          model: User,
          as: "assignee",
          attributes: ["id", "firstname", "lastname", "email"],
        },
      ],
    });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    return task;
  }

  async create(input: CreateTaskInput) {
    const task = await Task.create({
      title: input.title,
      description: input.description || null,
      status: input.status || "todo",
      priority: input.priority || "medium",
      deadline: input.deadline ? new Date(input.deadline) : null,
      assigneeId: input.assigneeId || null,
    });

    await task.reload({
      include: [
        {
          model: User,
          as: "assignee",
          attributes: ["id", "firstname", "lastname", "email"],
        },
      ],
    });

    return task;
  }

  async update(id: number, input: UpdateTaskInput) {
    const task = await Task.findByPk(id);
    if (!task) {
      throw new AppError("Task not found", 404);
    }

    if ("title" in input && input.title !== undefined && input.title !== null) {
      const trimmedTitle = String(input.title).trim();
      if (trimmedTitle.length > 0) {
        task.title = trimmedTitle;
      }
    }

    if ("description" in input) {
      task.description = input.description || null;
    }

    if ("status" in input && input.status !== undefined) {
      task.status = input.status;
    }

    if ("priority" in input && input.priority !== undefined) {
      task.priority = input.priority;
    }

    if ("deadline" in input) {
      if (
        input.deadline === null ||
        input.deadline === "" ||
        input.deadline === undefined
      ) {
        task.deadline = null;
      } else if (typeof input.deadline === "string") {
        const date = new Date(input.deadline);
        task.deadline = isNaN(date.getTime()) ? null : date;
      }
    }

    if ("assigneeId" in input) {
      task.assigneeId =
        input.assigneeId === null || input.assigneeId === undefined
          ? null
          : input.assigneeId;
    }

    await task.save();

    await task.reload({
      include: [
        {
          model: User,
          as: "assignee",
          attributes: ["id", "firstname", "lastname", "email"],
        },
      ],
    });

    return task;
  }

  async delete(id: number) {
    const task = await Task.findByPk(id);
    if (!task) {
      throw new AppError("Task not found", 404);
    }

    await task.destroy();
  }
}

export const taskService = new TaskService();
