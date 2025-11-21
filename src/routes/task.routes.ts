import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller.js';

const router = Router();

const taskStatusEnum = z.enum(['todo', 'in-progress', 'done']);
const taskPriorityEnum = z.enum(['low', 'medium', 'high']);

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
}).strict().refine(
  (data) => !('id' in data) && !('createdAt' in data),
  {
    message: 'Fields id and createdAt cannot be updated',
  }
);

const queryFiltersSchema = z.object({
  createdAt: z.string().optional().refine(
    (val) => {
      if (!val) return true;

      const date = new Date(val);

      return !isNaN(date.getTime());
    },
    {
      message: 'createdAt must be a valid date',
    }
  ),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
});

const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.issues,
        });
      }
      next(error);
    }
  };
};

const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.issues,
        });
      }
      next(error);
    }
  };
};

router.get('/', validateQuery(queryFiltersSchema), getAllTasks);
router.get('/:id', getTaskById);
router.post('/', validateBody(createTaskSchema), createTask);
router.put('/:id', validateBody(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
