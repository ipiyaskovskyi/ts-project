import { Request, Response, NextFunction } from 'express';

/**
 * Middleware для валідації числового ID з параметрів маршруту
 * Перевіряє, чи ID є валідним числом, і додає його до res.locals
 */
export const validateId = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  // Зберігаємо валідний числовий ID для використання в контролері
  res.locals.validatedId = numericId;
  next();
};
