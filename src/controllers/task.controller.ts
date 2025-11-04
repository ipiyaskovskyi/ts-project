import { Request, Response } from 'express';
import { taskService } from '../services/task.service.js';
import { Status, Priority } from '../types/task.types.js';

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const filters = {
      createdAt: req.query.createdAt as string | undefined,
      status: req.query.status as Status | undefined,
      priority: req.query.priority as Priority | undefined,
    };

    const tasks = taskService.getAll(filters);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);
    const task = taskService.getById(numericId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = taskService.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);
    const task = taskService.update(numericId, req.body);
    res.json(task);
  } catch (error) {
    if (error instanceof Error && error.message === 'Task not found') {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numericId = Number(id);
    const deleted = taskService.delete(numericId);

    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

