import { Request, Response, NextFunction } from "express";

export const validateId = (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  res.locals.validatedId = numericId;
  next();
};

