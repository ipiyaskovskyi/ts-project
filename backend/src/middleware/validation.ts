import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { taskParamsSchema } from '../validators/tasks.validator.js';

declare global {
  namespace Express {
    interface Request {
      validatedTaskId?: number;
      validatedQuery?: unknown;
    }
  }
}

export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
            code: issue.code,
          })),
        });
        return;
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.validatedQuery = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.issues,
        });
        return;
      }
      next(error);
    }
  };
};

export const validateTaskId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const paramsValidation = taskParamsSchema.safeParse(req.params);

  if (!paramsValidation.success) {
    res.status(400).json({
      error: 'Invalid task ID',
    });
    return;
  }

  req.validatedTaskId = paramsValidation.data.id;
  req.params.id = String(paramsValidation.data.id);
  next();
};

