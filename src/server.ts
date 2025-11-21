import 'reflect-metadata';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { sequelize } from './models/index';
import './config/database';
import taskRoutes from './routes/task.routes.js';
import { AppError } from './lib/errors.js';

const app = express();
const PORT = 3001;

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

app.use('/tasks', taskRoutes);

app.use((err: Error | AppError, _req: Request, res: Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
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

