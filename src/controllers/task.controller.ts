import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/task.service.js';
import type {
  TaskFilters,
  CreateTaskInput,
  UpdateTaskInput,
} from '../types/task.types.js';

export const getAllTasks = async (
  req: Request<
    Record<string, never>,
    Record<string, never>,
    Record<string, never>,
    TaskFilters
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const filters = (res.locals.validatedQuery as TaskFilters) || req.query;
    const tasks = await taskService.getAll(filters);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await taskService.getById(numericId);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  req: Request<Record<string, never>, Record<string, never>, CreateTaskInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const task = await taskService.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: Request<{ id: string }, Record<string, never>, UpdateTaskInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await taskService.update(numericId, req.body);
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    await taskService.delete(numericId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

