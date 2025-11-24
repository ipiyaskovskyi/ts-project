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
        const firstError = error.errors[0];
        let errorMessage = firstError?.message || 'Validation failed';
        
        if (errorMessage === 'Required') {
          errorMessage = 'Title is required and must be a non-empty string';
        } else if (errorMessage.includes('Invalid enum value')) {
          if (firstError?.path?.includes('status')) {
            errorMessage = 'Invalid status value';
          } else if (firstError?.path?.includes('priority')) {
            errorMessage = 'Invalid priority value';
          }
        } else if (errorMessage.includes('Deadline cannot be in the past')) {
          errorMessage = 'Deadline cannot be in the past';
        } else if (firstError?.path?.includes('title')) {
          const isUpdate = req.method === 'PUT' || req.method === 'PATCH';
          const titleInBody = 'title' in req.body;
          if (isUpdate && titleInBody) {
            errorMessage = 'Title must be a non-empty string';
          } else {
            errorMessage = 'Title is required and must be a non-empty string';
          }
        }
        
        res.status(400).json({
          error: errorMessage,
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

