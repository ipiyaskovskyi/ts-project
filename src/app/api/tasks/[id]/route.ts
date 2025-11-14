import { NextRequest, NextResponse } from 'next/server';
import { TasksService } from '@/lib/services/tasks.service';
import {
  taskParamsSchema,
  updateTaskSchema,
} from '@/lib/validators/tasks.validator';
import { User } from '@/lib/models';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { ValidationError, NotFoundError } from '@/lib/errors';
import { initializeDatabase } from '@/lib/db/init';

const tasksService = new TasksService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();

    const { id } = await params;
    const paramsValidation = taskParamsSchema.safeParse({ id });

    if (!paramsValidation.success) {
      throw new ValidationError('Invalid task ID');
    }

    const task = await tasksService.getTaskById(paramsValidation.data.id);

    if (!task) {
      throw new NotFoundError('Task');
    }

    return successResponse(task);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();

    const { id } = await params;
    const paramsValidation = taskParamsSchema.safeParse({ id });

    if (!paramsValidation.success) {
      throw new ValidationError('Invalid task ID');
    }

    const body = await request.json();
    const validation = updateTaskSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      let errorMessage = firstError?.message || 'Validation failed';

      if (errorMessage.includes('Invalid enum value')) {
        if (firstError?.path?.includes('status')) {
          errorMessage = 'Invalid status value';
        } else if (firstError?.path?.includes('priority')) {
          errorMessage = 'Invalid priority value';
        }
      }

      throw new ValidationError(errorMessage, validation.error.issues);
    }

    const data = validation.data;

    if (data.assigneeId !== undefined && data.assigneeId !== null) {
      const user = await User.findByPk(data.assigneeId);
      if (!user) {
        throw new NotFoundError('Assignee');
      }
    }

    const task = await tasksService.updateTask(paramsValidation.data.id, data);

    if (!task) {
      throw new NotFoundError('Task');
    }

    return successResponse(task);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();

    const { id } = await params;
    const paramsValidation = taskParamsSchema.safeParse({ id });

    if (!paramsValidation.success) {
      throw new ValidationError('Invalid task ID');
    }

    const deleted = await tasksService.deleteTask(paramsValidation.data.id);

    if (!deleted) {
      throw new NotFoundError('Task');
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
