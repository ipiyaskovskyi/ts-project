import { NextRequest } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';
import { loginSchema } from '@/lib/validators/auth.validator';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { ValidationError, UnauthorizedError } from '@/lib/errors';
import { initializeDatabase } from '@/lib/db/init';

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      const errorMessage = firstError?.message || 'Validation failed';
      throw new ValidationError(errorMessage, validation.error.issues);
    }

    const data = validation.data;
    const user = await authService.login(data);
    return successResponse(user);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'Invalid email or password'
    ) {
      return errorResponse(new UnauthorizedError(error.message));
    }
    return errorResponse(error);
  }
}
