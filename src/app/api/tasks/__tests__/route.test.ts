import { GET, POST } from '../route';
import { Task, User } from '@/lib/models';
import { sequelize } from '@/lib/db/sequelize';
import { NextRequest } from 'next/server';

beforeAll(async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Database authentication failed:', error);
  }
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await Task.destroy({ where: {} });
  await User.destroy({ where: {} });
});

function createMockRequest(
  method: string,
  url: string,
  body?: Record<string, unknown>
): NextRequest {
  const fullUrl = `http://localhost:3000${url}`;
  const requestInit: {
    method: string;
    body?: string;
    headers?: Record<string, string>;
  } = {
    method,
    ...(body && { body: JSON.stringify(body) }),
    ...(body && { headers: { 'Content-Type': 'application/json' } }),
  };
  const request = new NextRequest(fullUrl, requestInit as any);
  return request;
}

describe('GET /api/tasks', () => {
  it('should return empty array when no tasks exist', async () => {
    const req = createMockRequest('GET', '/api/tasks');
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });

  it('should return all tasks with assignee information', async () => {
    const user = await User.create({
      firstname: 'Test',
      lastname: 'User',
      email: 'test@example.com',
      password: 'testpassword',
    });

    const task1 = await Task.create({
      title: 'Task 1',
      description: 'Description 1',
      status: 'todo',
      priority: 'high',
      assigneeId: user.id,
    });

    const task2 = await Task.create({
      title: 'Task 2',
      description: 'Description 2',
      status: 'in_progress',
      priority: 'medium',
    });

    const req = createMockRequest('GET', '/api/tasks');
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(2);

    const task1Response = data.find((t: { id: number }) => t.id === task1.id);
    expect(task1Response).toBeDefined();
    if (task1Response) {
      expect(task1Response.title).toBe('Task 1');
      expect(task1Response.assignee).toBeDefined();
      if (task1Response.assignee) {
        expect(task1Response.assignee.id).toBe(user.id);
        expect(task1Response.assignee.firstname).toBe('Test');
        expect(task1Response.assignee.lastname).toBe('User');
      }
    }

    const task2Response = data.find((t: { id: number }) => t.id === task2.id);
    expect(task2Response).toBeDefined();
    if (task2Response) {
      expect(task2Response.title).toBe('Task 2');
      expect(task2Response.assignee).toBeNull();
    }
  });
});

describe('POST /api/tasks', () => {
  it('should return 400 when title is missing', async () => {
    const req = createMockRequest('POST', '/api/tasks', {
      description: 'Some description',
      status: 'todo',
      priority: 'high',
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Title is required and must be a non-empty string');
  });

  it('should return 400 when title is empty string', async () => {
    const req = createMockRequest('POST', '/api/tasks', {
      title: '   ',
      description: 'Some description',
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Title is required and must be a non-empty string');
  });

  it('should return 400 when deadline is in the past', async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const req = createMockRequest('POST', '/api/tasks', {
      title: 'Test Task',
      deadline: yesterday.toISOString(),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Deadline cannot be in the past');
  });

  it('should create task successfully (201)', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const req = createMockRequest('POST', '/api/tasks', {
      title: 'New Task',
      description: 'Task description',
      status: 'todo',
      priority: 'high',
      deadline: tomorrow.toISOString(),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.id).toBeDefined();
    expect(data.title).toBe('New Task');
    expect(data.description).toBe('Task description');
    expect(data.status).toBe('todo');
    expect(data.priority).toBe('high');
    expect(data.assignee).toBeNull();
    expect(data.createdAt).toBeDefined();
  });

  it('should use default values when optional fields are not provided', async () => {
    const req = createMockRequest('POST', '/api/tasks', {
      title: 'Minimal Task',
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.title).toBe('Minimal Task');
    expect(data.status).toBe('todo');
    expect(data.priority).toBe('medium');
    expect(data.description).toBeNull();
    expect(data.deadline).toBeNull();
    expect(data.assigneeId).toBeNull();
  });
});
