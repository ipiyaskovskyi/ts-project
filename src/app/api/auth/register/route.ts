import { NextRequest } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';
import { registerSchema } from '@/lib/validators/auth.validator';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { ValidationError } from '@/lib/errors';
import { initializeDatabase } from '@/lib/db/init';

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      const errorMessage = firstError?.message || 'Validation failed';
      throw new ValidationError(errorMessage, validation.error.issues);
    }

    const data = validation.data;
    const user = await authService.register(data);
    return successResponse(user, 201);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'User with this email already exists'
    ) {
      return errorResponse(new ValidationError(error.message), 409);
    }
    return errorResponse(error);
  }
}
