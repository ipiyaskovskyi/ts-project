import { Router } from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { validateId } from "../middleware/validateId.js";
import {
  validateBody,
  validateQuery,
  createTaskSchema,
  updateTaskSchema,
  queryFiltersSchema,
} from "../validators/task.validator.js";

const router = Router();

router.get("/", validateQuery(queryFiltersSchema), getAllTasks);
router.get("/:id", validateId, getTaskById);
router.post("/", validateBody(createTaskSchema), createTask);
router.put("/:id", validateId, validateBody(updateTaskSchema), updateTask);
router.delete("/:id", validateId, deleteTask);

export default router;
