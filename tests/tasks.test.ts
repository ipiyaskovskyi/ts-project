import request from 'supertest';
import { app } from '../src/server.js';
import { sequelize, Task, User } from '../src/models/index.js';
import { unlinkSync } from 'fs';
import { existsSync } from 'fs';

const TEST_DB_PATH = './test.db';

async function cleanupDatabase() {
  try {
    if (existsSync(TEST_DB_PATH)) {
      await sequelize.close();
      unlinkSync(TEST_DB_PATH);
    }
  } catch (error) {
    console.error('Error cleaning up test database:', error);
  }
}

beforeAll(async () => {
  await cleanupDatabase();
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Database authentication failed:', error);
  }
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
  if (existsSync(TEST_DB_PATH)) {
    unlinkSync(TEST_DB_PATH);
  }
});

beforeEach(async () => {
  await Task.destroy({ where: {} });
  await User.destroy({ where: {} });
});

describe('GET /tasks', () => {
  it('should return empty array when no tasks exist', async () => {
    const response = await request(app).get('/tasks');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return all tasks with assignee information', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
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
      status: 'in-progress',
      priority: 'medium',
    });

    const response = await request(app).get('/tasks');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    
    const task1Response = response.body.find((t: any) => t.id === task1.id);
    expect(task1Response).toBeDefined();
    expect(task1Response.title).toBe('Task 1');
    expect(task1Response.assignee).toBeDefined();
    expect(task1Response.assignee.id).toBe(user.id);
    expect(task1Response.assignee.name).toBe('Test User');
    
    const task2Response = response.body.find((t: any) => t.id === task2.id);
    expect(task2Response).toBeDefined();
    expect(task2Response.title).toBe('Task 2');
    expect(task2Response.assignee).toBeNull();
  });
});

describe('GET /tasks/:id', () => {
  it('should return 400 for invalid task ID', async () => {
    const response = await request(app).get('/tasks/invalid');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid task ID');
  });

  it('should return 404 when task does not exist', async () => {
    const response = await request(app).get('/tasks/999');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Task not found');
  });

  it('should return task with assignee details (200)', async () => {
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
    });

    const task = await Task.create({
      title: 'Test Task',
      description: 'Test Description',
      status: 'done',
      priority: 'low',
      deadline: new Date('2025-12-31'),
      assigneeId: user.id,
    });

    const response = await request(app).get(`/tasks/${task.id}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(task.id);
    expect(response.body.title).toBe('Test Task');
    expect(response.body.description).toBe('Test Description');
    expect(response.body.status).toBe('done');
    expect(response.body.priority).toBe('low');
    expect(response.body.assignee).toBeDefined();
    expect(response.body.assignee.id).toBe(user.id);
    expect(response.body.assignee.name).toBe('John Doe');
    expect(response.body.assignee.email).toBe('john@example.com');
  });

  it('should return task without assignee when assigneeId is null', async () => {
    const task = await Task.create({
      title: 'Unassigned Task',
      status: 'todo',
      priority: 'medium',
    });

    const response = await request(app).get(`/tasks/${task.id}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(task.id);
    expect(response.body.assignee).toBeNull();
  });
});

describe('POST /tasks', () => {
  it('should return 400 when title is missing', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        description: 'Some description',
        status: 'todo',
        priority: 'high',
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Title is required and must be a non-empty string');
  });

  it('should return 400 when title is empty string', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        title: '   ',
        description: 'Some description',
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Title is required and must be a non-empty string');
  });

  it('should return 400 when deadline is in the past', async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const response = await request(app)
      .post('/tasks')
      .send({
        title: 'Test Task',
        deadline: yesterday.toISOString(),
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Deadline cannot be in the past');
  });

  it('should return 400 when status is invalid', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        title: 'Test Task',
        status: 'invalid-status',
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid status value');
  });

  it('should return 400 when priority is invalid', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        title: 'Test Task',
        priority: 'invalid-priority',
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid priority value');
  });

  it('should return 400 when assignee does not exist', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        title: 'Test Task',
        assigneeId: 999,
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Assignee not found');
  });

  it('should create task successfully (201)', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const response = await request(app)
      .post('/tasks')
      .send({
        title: 'New Task',
        description: 'Task description',
        status: 'todo',
        priority: 'high',
        deadline: tomorrow.toISOString(),
      });
    
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.title).toBe('New Task');
    expect(response.body.description).toBe('Task description');
    expect(response.body.status).toBe('todo');
    expect(response.body.priority).toBe('high');
    expect(response.body.assignee).toBeNull();
    expect(response.body.createdAt).toBeDefined();
  });

  it('should create task with assignee successfully (201)', async () => {
    const user = await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    const response = await request(app)
      .post('/tasks')
      .send({
        title: 'Assigned Task',
        description: 'Description',
        status: 'in-progress',
        priority: 'medium',
        assigneeId: user.id,
      });
    
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.title).toBe('Assigned Task');
    expect(response.body.assignee).toBeDefined();
    expect(response.body.assignee.id).toBe(user.id);
    expect(response.body.assignee.name).toBe('Jane Doe');
  });

  it('should use default values when optional fields are not provided', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        title: 'Minimal Task',
      });
    
    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Minimal Task');
    expect(response.body.status).toBe('todo');
    expect(response.body.priority).toBe('medium');
    expect(response.body.description).toBeNull();
    expect(response.body.deadline).toBeNull();
    expect(response.body.assigneeId).toBeNull();
  });
});

describe('PUT /tasks/:id', () => {
  it('should return 400 for invalid task ID', async () => {
    const response = await request(app)
      .put('/tasks/invalid')
      .send({ title: 'Updated Title' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid task ID');
  });

  it('should return 404 when task does not exist', async () => {
    const response = await request(app)
      .put('/tasks/999')
      .send({ title: 'Updated Title' });
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Task not found');
  });

  it('should return 400 when updating title to empty string', async () => {
    const task = await Task.create({
      title: 'Original Title',
      status: 'todo',
      priority: 'medium',
    });

    const response = await request(app)
      .put(`/tasks/${task.id}`)
      .send({ title: '   ' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Title must be a non-empty string');
  });

  it('should return 400 when updating with invalid status', async () => {
    const task = await Task.create({
      title: 'Test Task',
      status: 'todo',
      priority: 'medium',
    });

    const response = await request(app)
      .put(`/tasks/${task.id}`)
      .send({ status: 'invalid' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid status value');
  });

  it('should return 400 when updating with invalid priority', async () => {
    const task = await Task.create({
      title: 'Test Task',
      status: 'todo',
      priority: 'medium',
    });

    const response = await request(app)
      .put(`/tasks/${task.id}`)
      .send({ priority: 'invalid' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid priority value');
  });

  it('should return 400 when updating deadline to past date', async () => {
    const task = await Task.create({
      title: 'Test Task',
      status: 'todo',
      priority: 'medium',
    });

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const response = await request(app)
      .put(`/tasks/${task.id}`)
      .send({ deadline: yesterday.toISOString() });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Deadline cannot be in the past');
  });

  it('should return 400 when updating with non-existent assignee', async () => {
    const task = await Task.create({
      title: 'Test Task',
      status: 'todo',
      priority: 'medium',
    });

    const response = await request(app)
      .put(`/tasks/${task.id}`)
      .send({ assigneeId: 999 });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Assignee not found');
  });

  it('should update task successfully (200)', async () => {
    const task = await Task.create({
      title: 'Original Title',
      description: 'Original Description',
      status: 'todo',
      priority: 'low',
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const response = await request(app)
      .put(`/tasks/${task.id}`)
      .send({
        title: 'Updated Title',
        description: 'Updated Description',
        status: 'in-progress',
        priority: 'high',
        deadline: tomorrow.toISOString(),
      });
    
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(task.id);
    expect(response.body.title).toBe('Updated Title');
    expect(response.body.description).toBe('Updated Description');
    expect(response.body.status).toBe('in-progress');
    expect(response.body.priority).toBe('high');
    expect(response.body.deadline).toBeDefined();
  });

  it('should update task with assignee successfully (200)', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
    });

    const task = await Task.create({
      title: 'Unassigned Task',
      status: 'todo',
      priority: 'medium',
    });

    const response = await request(app)
      .put(`/tasks/${task.id}`)
      .send({
        assigneeId: user.id,
      });
    
    expect(response.status).toBe(200);
    expect(response.body.assignee).toBeDefined();
    expect(response.body.assignee.id).toBe(user.id);
  });

  it('should remove assignee when assigneeId is set to null (200)', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
    });

    const task = await Task.create({
      title: 'Assigned Task',
      status: 'todo',
      priority: 'medium',
      assigneeId: user.id,
    });

    const response = await request(app)
      .put(`/tasks/${task.id}`)
      .send({
        assigneeId: null,
      });
    
    expect(response.status).toBe(200);
    expect(response.body.assignee).toBeNull();
  });

  it('should remove deadline when deadline is set to null (200)', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const task = await Task.create({
      title: 'Task with Deadline',
      status: 'todo',
      priority: 'medium',
      deadline: tomorrow,
    });

    const response = await request(app)
      .put(`/tasks/${task.id}`)
      .send({
        deadline: null,
      });
    
    expect(response.status).toBe(200);
    expect(response.body.deadline).toBeNull();
  });

  it('should update only provided fields (200)', async () => {
    const task = await Task.create({
      title: 'Original Title',
      description: 'Original Description',
      status: 'todo',
      priority: 'low',
    });

    const response = await request(app)
      .put(`/tasks/${task.id}`)
      .send({
        status: 'done',
      });
    
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Original Title');
    expect(response.body.description).toBe('Original Description');
    expect(response.body.status).toBe('done');
    expect(response.body.priority).toBe('low');
  });
});

describe('DELETE /tasks/:id', () => {
  it('should return 400 for invalid task ID', async () => {
    const response = await request(app).delete('/tasks/invalid');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid task ID');
  });

  it('should return 404 when task does not exist', async () => {
    const response = await request(app).delete('/tasks/999');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Task not found');
  });

  it('should delete task successfully (204)', async () => {
    const task = await Task.create({
      title: 'Task to Delete',
      status: 'todo',
      priority: 'medium',
    });

    const response = await request(app).delete(`/tasks/${task.id}`);
    expect(response.status).toBe(204);
    expect(response.body).toEqual({});

    const deletedTask = await Task.findByPk(task.id);
    expect(deletedTask).toBeNull();
  });

  it('should delete task with assignee successfully (204)', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
    });

    const task = await Task.create({
      title: 'Assigned Task to Delete',
      status: 'todo',
      priority: 'medium',
      assigneeId: user.id,
    });

    const response = await request(app).delete(`/tasks/${task.id}`);
    expect(response.status).toBe(204);

    const deletedTask = await Task.findByPk(task.id);
    expect(deletedTask).toBeNull();

    const userStillExists = await User.findByPk(user.id);
    expect(userStillExists).toBeDefined();
  });
});

