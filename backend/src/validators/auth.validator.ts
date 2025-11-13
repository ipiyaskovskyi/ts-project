import { z } from 'zod';

export const registerSchema = z.object({
    firstname: z.string().min(1, 'Firstname is required').trim(),
    lastname: z.string().min(1, 'Lastname is required').trim(),
    email: z.string().email('Invalid email format').trim().toLowerCase(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email format').trim().toLowerCase(),
    password: z.string().min(1, 'Password is required'),
});
