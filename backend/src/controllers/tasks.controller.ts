import type { Request, Response } from 'express';
import { TasksService } from '../services/tasks.service.js';
import {
    createTaskSchema,
    updateTaskSchema,
    taskParamsSchema,
} from '../validators/tasks.validator.js';
import { User } from '../models/index.js';

const tasksService = new TasksService();

export class TasksController {
    async getAllTasks(_req: Request, res: Response): Promise<void> {
        try {
            const tasks = await tasksService.getAllTasks();
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
            const paramsValidation = taskParamsSchema.safeParse(req.params);
            if (!paramsValidation.success) {
                res.status(400).json({
                    error: 'Invalid task ID',
                });
                return;
            }

            const { id } = paramsValidation.data;
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
            const validation = createTaskSchema.safeParse(req.body);
            if (!validation.success) {
                const firstError = validation.error.errors[0];
                let errorMessage = firstError?.message || 'Validation failed';
                if (errorMessage === 'Required') {
                    errorMessage =
                        'Title is required and must be a non-empty string';
                } else if (errorMessage.includes('Invalid enum value')) {
                    if (firstError?.path?.includes('status')) {
                        errorMessage = 'Invalid status value';
                    } else if (firstError?.path?.includes('priority')) {
                        errorMessage = 'Invalid priority value';
                    }
                }
                res.status(400).json({
                    error: errorMessage,
                });
                return;
            }

            const data = validation.data;

            if (data.assigneeId) {
                const user = await User.findByPk(data.assigneeId);
                if (!user) {
                    res.status(400).json({ error: 'Assignee not found' });
                    return;
                }
            }

            const task = await tasksService.createTask(data);
            res.status(201).json(task);
            return;
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
    }

    async updateTask(req: Request, res: Response): Promise<void> {
        try {
            const paramsValidation = taskParamsSchema.safeParse(req.params);
            if (!paramsValidation.success) {
                res.status(400).json({
                    error: 'Invalid task ID',
                });
                return;
            }

            const { id } = paramsValidation.data;

            const validation = updateTaskSchema.safeParse(req.body);
            if (!validation.success) {
                const firstError = validation.error.errors[0];
                let errorMessage = firstError?.message || 'Validation failed';
                if (errorMessage.includes('Invalid enum value')) {
                    if (firstError?.path?.includes('status')) {
                        errorMessage = 'Invalid status value';
                    } else if (firstError?.path?.includes('priority')) {
                        errorMessage = 'Invalid priority value';
                    }
                }
                res.status(400).json({
                    error: errorMessage,
                });
                return;
            }

            const data = validation.data;

            if (data.assigneeId !== undefined && data.assigneeId !== null) {
                const user = await User.findByPk(data.assigneeId);
                if (!user) {
                    res.status(400).json({ error: 'Assignee not found' });
                    return;
                }
            }

            const task = await tasksService.updateTask(id, data);

            if (!task) {
                res.status(404).json({ error: 'Task not found' });
                return;
            }

            res.json(task);
            return;
        } catch (error) {
            console.error('Error updating task:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
    }

    async deleteTask(req: Request, res: Response): Promise<void> {
        try {
            const paramsValidation = taskParamsSchema.safeParse(req.params);
            if (!paramsValidation.success) {
                res.status(400).json({
                    error: 'Invalid task ID',
                });
                return;
            }

            const { id } = paramsValidation.data;
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
