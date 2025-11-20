import { z } from "zod";

const statusValues = ["todo", "in-progress", "done"] as const;
const priorityValues = ["low", "medium", "high"] as const;

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  status: z.enum(statusValues).default("todo"),
  priority: z.enum(priorityValues).default("medium"),
  deadline: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (date) => {
        if (!date) {
          return true;
        }
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return !Number.isNaN(selectedDate.getTime()) && selectedDate >= today;
      },
      {
        message: "Deadline cannot be in the past",
      },
    ),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
