import { z } from 'zod';

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters long')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  status: z
    .enum(['todo', 'in-progress', 'done'] as const)
    .default('todo'),
  priority: z
    .enum(['low', 'medium', 'high'] as const)
    .default('medium'),
  deadline: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      {
        message: 'Deadline cannot be in the past',
      }
    ),
});

export type TaskFormData = z.infer<typeof taskSchema>;
