import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/task.service.js';
import { TaskFilters, CreateTaskInput, UpdateTaskInput } from '../types/task.types.js';
import { AppError } from '../lib/errors.js';

export const getAllTasks = async (req: Request<{}, {}, {}, TaskFilters>, res: Response, next: NextFunction) => {
  try {
    const tasks = taskService.getAll(req.query);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);
    const task = taskService.getById(numericId);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: Request<{}, {}, CreateTaskInput>, res: Response, next: NextFunction) => {
  try {
    const task = taskService.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request<{ id: string }, {}, UpdateTaskInput>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);
    const task = taskService.update(numericId, req.body);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);
    const deleted = taskService.delete(numericId);

    if (!deleted) {
      throw new AppError('Task not found', 404);
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

