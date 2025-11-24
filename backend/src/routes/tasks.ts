import { Router } from 'express';
import { TasksController } from '../controllers/tasks.controller.js';
import {
  validateBody,
  validateQuery,
  validateTaskId,
} from '../middleware/validation.js';
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
} from '../validators/tasks.validator.js';

const tasksRouter = Router();
const tasksController = new TasksController();

tasksRouter.get(
  '/tasks',
  validateQuery(taskQuerySchema),
  (req, res) => {
    tasksController.getAllTasks(req, res);
  }
);

tasksRouter.get('/tasks/:id', validateTaskId, (req, res) => {
  tasksController.getTaskById(req, res);
});

tasksRouter.post(
  '/tasks',
  validateBody(createTaskSchema),
  (req, res) => {
    tasksController.createTask(req, res);
  }
);

tasksRouter.put(
  '/tasks/:id',
  validateTaskId,
  validateBody(updateTaskSchema),
  (req, res) => {
    tasksController.updateTask(req, res);
  }
);

tasksRouter.delete('/tasks/:id', validateTaskId, (req, res) => {
  tasksController.deleteTask(req, res);
});

export default tasksRouter;
