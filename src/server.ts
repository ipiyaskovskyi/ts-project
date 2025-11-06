import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { sequelize, Task, User } from './models/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log('Database connected and synced');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

app.get('/tasks', async (_req: Request, res: Response) => {
  try {
    const tasks = await Task.findAll({
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await Task.findByPk(id, {
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/tasks', async (req: Request, res: Response) => {
  try {
    const { title, description, status, priority, deadline, assigneeId } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    }

    if (deadline) {
      const deadlineDate = new Date(deadline);
      if (isNaN(deadlineDate.getTime())) {
        return res.status(400).json({ error: 'Invalid deadline date format' });
      }
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (deadlineDate < now) {
        return res.status(400).json({ error: 'Deadline cannot be in the past' });
      }
    }

    if (status && !['todo', 'in-progress', 'done'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority value' });
    }

    if (assigneeId) {
      const user = await User.findByPk(assigneeId);
      if (!user) {
        return res.status(400).json({ error: 'Assignee not found' });
      }
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || null,
      status: status || 'todo',
      priority: priority || 'medium',
      deadline: deadline || null,
      assigneeId: assigneeId || null,
    });

    const taskWithAssignee = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.status(201).json(taskWithAssignee);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { title, description, status, priority, deadline, assigneeId } = req.body;

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title must be a non-empty string' });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description?.trim() || null;
    }

    if (status !== undefined) {
      if (!['todo', 'in-progress', 'done'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }
      task.status = status;
    }

    if (priority !== undefined) {
      if (!['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority value' });
      }
      task.priority = priority;
    }

    if (deadline !== undefined) {
      if (deadline === null || deadline === '') {
        task.deadline = null;
      } else {
        const deadlineDate = new Date(deadline);
        if (isNaN(deadlineDate.getTime())) {
          return res.status(400).json({ error: 'Invalid deadline date format' });
        }
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        if (deadlineDate < now) {
          return res.status(400).json({ error: 'Deadline cannot be in the past' });
        }
        task.deadline = deadlineDate;
      }
    }

    if (assigneeId !== undefined) {
      if (assigneeId === null || assigneeId === '') {
        task.assigneeId = null;
      } else {
        const user = await User.findByPk(assigneeId);
        if (!user) {
          return res.status(400).json({ error: 'Assignee not found' });
        }
        task.assigneeId = assigneeId;
      }
    }

    await task.save();

    const taskWithAssignee = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.json(taskWithAssignee);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function startServer() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

const isMainModule = process.argv[1]?.endsWith('server.ts') || 
  process.argv[1]?.endsWith('server.js');

if (isMainModule) {
  startServer();
}

export { app };

