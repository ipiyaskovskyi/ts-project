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
  title: z.string().min(1, 'Title is required').trim().refine((val) => val.length > 0, {
    message: 'Title cannot be empty',
  }),
  description: z.string().optional().nullable(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  deadline: z.union([
    z.string().refine((val) => {
      if (!val || val.trim() === '') return true;
      const date = new Date(val);
      if (isNaN(date.getTime())) return false;
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return date >= now;
    }, {
      message: 'Deadline must be a valid future date',
    }),
    z.null(),
    z.undefined(),
  ]).optional(),
  assigneeId: z.union([
    z.number().int().positive(),
    z.string().refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0 && Number.isInteger(num);
    }, {
      message: 'AssigneeId must be a positive integer',
    }).transform((val) => Number(val)),
    z.null(),
    z.undefined(),
  ]).optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).trim().refine((val) => val.length > 0, {
    message: 'Title cannot be empty',
  }).optional(),
  description: z.string().optional().nullable(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  deadline: z.union([
    z.string().refine((val) => {
      if (!val || val.trim() === '') return true;
      const date = new Date(val);
      if (isNaN(date.getTime())) return false;
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return date >= now;
    }, {
      message: 'Deadline must be a valid future date',
    }),
    z.null(),
    z.undefined(),
  ]).optional(),
  assigneeId: z.union([
    z.number().int().positive(),
    z.string().refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0 && Number.isInteger(num);
    }, {
      message: 'AssigneeId must be a positive integer',
    }).transform((val) => Number(val)),
    z.null(),
    z.undefined(),
  ]).optional(),
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
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.issues.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          })),
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
