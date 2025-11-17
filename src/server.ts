import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import taskRoutes from './routes/task.routes.js';
import { AppError } from './lib/errors.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(taskRoutes);


app.use((err: AppError, _: Request, res: Response) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).send(err.message || 'Internal server error');
});

app.use((_: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

