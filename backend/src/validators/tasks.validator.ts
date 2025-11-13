import { z } from 'zod';

export const taskStatusSchema = z.enum([
    'draft',
    'in_progress',
    'editing',
    'done',
]);
export const taskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);
export const taskTypeSchema = z.enum([
    'Task',
    'Subtask',
    'Bug',
    'Story',
    'Epic',
]);

export const createTaskSchema = z.object({
    title: z
        .string({
            required_error: 'Title is required and must be a non-empty string',
        })
        .min(1, 'Title is required and must be a non-empty string')
        .trim()
        .refine((val) => val.length > 0, {
            message: 'Title is required and must be a non-empty string',
        }),
    description: z.string().optional().nullable(),
    type: taskTypeSchema.optional().nullable(),
    status: taskStatusSchema.optional().default('draft'),
    priority: taskPrioritySchema.optional().default('medium'),
    deadline: z
        .union([z.string(), z.date()])
        .optional()
        .nullable()
        .refine(
            (date) => {
                if (!date) return true;
                const deadlineDate =
                    date instanceof Date ? date : new Date(date);
                if (isNaN(deadlineDate.getTime())) return false;
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                return deadlineDate >= now;
            },
            { message: 'Deadline cannot be in the past' }
        )
        .transform((date) => {
            if (!date) return null;
            return date instanceof Date ? date : new Date(date);
        }),
    assigneeId: z.number().int().positive().optional().nullable(),
});

export const updateTaskSchema = z.object({
    title: z
        .string()
        .min(1, 'Title must be a non-empty string')
        .trim()
        .refine((val) => val.length > 0, {
            message: 'Title must be a non-empty string',
        })
        .optional(),
    description: z.string().optional().nullable(),
    type: taskTypeSchema.optional().nullable(),
    status: taskStatusSchema.optional(),
    priority: taskPrioritySchema.optional(),
    deadline: z
        .union([z.string(), z.date()])
        .optional()
        .nullable()
        .refine(
            (date) => {
                if (!date) return true;
                const deadlineDate =
                    date instanceof Date ? date : new Date(date);
                if (isNaN(deadlineDate.getTime())) return false;
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                return deadlineDate >= now;
            },
            { message: 'Deadline cannot be in the past' }
        )
        .transform((date) => {
            if (!date) return null;
            return date instanceof Date ? date : new Date(date);
        }),
    assigneeId: z.number().int().positive().optional().nullable(),
});

export const taskParamsSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
});
