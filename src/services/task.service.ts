import { Task, User } from '../models/index.js';
import { AppError } from '../lib/errors.js';
import type {
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
} from '../types/task.types.js';
import { Op } from 'sequelize';

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
          as: 'assignee',
          attributes: ['id', 'firstname', 'lastname', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return tasks;
  }

  async getById(id: number) {
    const task = await Task.findByPk(id, {
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'firstname', 'lastname', 'email'],
        },
      ],
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    return task;
  }

  async create(input: CreateTaskInput) {
    try {
      const task = await Task.create({
        title: input.title,
        description: input.description || null,
        status: input.status || 'todo',
        priority: input.priority || 'medium',
        deadline: input.deadline ? new Date(input.deadline) : null,
        assigneeId: input.assigneeId || null,
      });

      await task.reload({
        include: [
          {
            model: User,
            as: 'assignee',
            attributes: ['id', 'firstname', 'lastname', 'email'],
          },
        ],
      });

      return task;
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
        throw new AppError('Assignee not found', 400);
      }
      throw error;
    }
  }

  async update(id: number, input: UpdateTaskInput) {
    const task = await Task.findByPk(id);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    if (input.title !== undefined) {
      task.title = input.title;
    }

    if (input.description !== undefined) {
      task.description = input.description ?? null;
    }

    if (input.status !== undefined) {
      task.status = input.status;
    }

    if (input.priority !== undefined) {
      task.priority = input.priority;
    }

    if (input.deadline !== undefined) {
      task.deadline = input.deadline ? new Date(input.deadline) : null;
    }

    if (input.assigneeId !== undefined) {
      task.assigneeId = input.assigneeId ?? null;
    }

    try {
      await task.save();

      await task.reload({
        include: [
          {
            model: User,
            as: 'assignee',
            attributes: ['id', 'firstname', 'lastname', 'email'],
          },
        ],
      });

      return task;
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
        throw new AppError('Assignee not found', 400);
      }
      throw error;
    }
  }

  async delete(id: number) {
    const task = await Task.findByPk(id);
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    await task.destroy();
  }
}

export const taskService = new TaskService();

