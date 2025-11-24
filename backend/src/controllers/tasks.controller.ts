import type { Request, Response } from 'express';
import { TasksService } from '../services/tasks.service.js';
import { AppError } from '../utils/AppError.js';

const tasksService = new TasksService();

export class TasksController {
  async getAllTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await tasksService.getAllTasks(req.validatedQuery!);
      res.json(tasks);
      return;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }

  async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.validatedTaskId!;
      const task = await tasksService.getTaskById(id);

      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.json(task);
      return;
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.createTask(req.body);
      res.status(201).json(task);
      return;
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const id = req.validatedTaskId!;
      const task = await tasksService.updateTask(id, req.body);

      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.json(task);
      return;
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const id = req.validatedTaskId!;
      const deleted = await tasksService.deleteTask(id);

      if (!deleted) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(204).send();
      return;
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }
}
