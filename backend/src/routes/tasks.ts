import { Router } from "express";
import { TasksController } from "../controllers/tasks.controller.js";

const tasksRouter = Router();
const tasksController = new TasksController();

tasksRouter.get("/tasks", (req, res) => {
  tasksController.getAllTasks(req, res);
});

tasksRouter.get("/tasks/:id", (req, res) => {
  tasksController.getTaskById(req, res);
});

tasksRouter.post("/tasks", (req, res) => {
  tasksController.createTask(req, res);
});

tasksRouter.put("/tasks/:id", (req, res) => {
  tasksController.updateTask(req, res);
});

tasksRouter.delete("/tasks/:id", (req, res) => {
  tasksController.deleteTask(req, res);
});

export default tasksRouter;
