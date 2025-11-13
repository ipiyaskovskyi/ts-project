import "reflect-metadata";
import express, { Router, type Request, type Response } from "express";
import cors from "cors";
import { sequelize, Task, User } from "./models/index.js";
import authRouter from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const tasksRouter = Router();

function registerProcessHandlers() {
  const logAndExit = (signal: string) => {
    console.error(`[shutdown] received ${signal}, stopping server...`);
    process.exit(0);
  };

  process.on("uncaughtException", (error) => {
    console.error("[fatal] uncaught exception:", error);
  });

  process.on("unhandledRejection", (reason) => {
    console.error("[fatal] unhandled rejection:", reason);
  });

  process.once("SIGINT", () => logAndExit("SIGINT"));
  process.once("SIGTERM", () => logAndExit("SIGTERM"));
  process.once("exit", (code) => {
    console.error(`[shutdown] process exiting with code ${code}`);
  });
}

async function ensurePostgresEnums() {
  if (sequelize.getDialect() !== "postgres") {
    return;
  }

  const addEnumValue = async (enumName: string, value: string) => {
    const escapedValue = sequelize.escape(value);
    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_enum
          WHERE enumlabel = ${escapedValue}
            AND enumtypid = '${enumName}'::regtype
        ) THEN
          ALTER TYPE "${enumName}" ADD VALUE ${escapedValue};
        END IF;
      END $$;
    `);
  };

  await Promise.all([
    addEnumValue("enum_tasks_status", "draft"),
    addEnumValue("enum_tasks_status", "in_progress"),
    addEnumValue("enum_tasks_status", "editing"),
    addEnumValue("enum_tasks_priority", "urgent"),
  ]);
}

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    await ensurePostgresEnums();
    console.log("Database connected and synced");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

tasksRouter.get("/tasks", async (_req: Request, res: Response) => {
  try {
    const tasks = await Task.findAll({
      include: [
        {
          model: User,
          as: "assignee",
          attributes: ["id", "firstname", "lastname", "email"],
        },
      ],
    });
    res.json(tasks);
    return;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

tasksRouter.get("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const task = await Task.findByPk(id, {
      include: [
        {
          model: User,
          as: "assignee",
          attributes: ["id", "firstname", "lastname", "email"],
        },
      ],
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
    return;
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

const ALLOWED_STATUSES = ["draft", "in_progress", "editing", "done"] as const;
const ALLOWED_PRIORITIES = ["low", "medium", "high", "urgent"] as const;

tasksRouter.post("/tasks", async (req: Request, res: Response) => {
  try {
    const { title, description, status, priority, deadline, assigneeId } =
      req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return res
        .status(400)
        .json({ error: "Title is required and must be a non-empty string" });
    }

    if (deadline) {
      const deadlineDate = new Date(deadline);
      if (isNaN(deadlineDate.getTime())) {
        return res.status(400).json({ error: "Invalid deadline date format" });
      }
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (deadlineDate < now) {
        return res
          .status(400)
          .json({ error: "Deadline cannot be in the past" });
      }
    }

    if (status && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    if (priority && !ALLOWED_PRIORITIES.includes(priority)) {
      return res.status(400).json({ error: "Invalid priority value" });
    }

    if (assigneeId) {
      const user = await User.findByPk(assigneeId);
      if (!user) {
        return res.status(400).json({ error: "Assignee not found" });
      }
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || null,
      status: status || "draft",
      priority: priority || "medium",
      deadline: deadline || null,
      assigneeId: assigneeId || null,
    });

    const taskWithAssignee = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: "assignee",
          attributes: ["id", "firstname", "lastname", "email"],
        },
      ],
    });

    res.status(201).json(taskWithAssignee);
    return;
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

tasksRouter.put("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const { title, description, status, priority, deadline, assigneeId } =
      req.body;

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim() === "") {
        return res
          .status(400)
          .json({ error: "Title must be a non-empty string" });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description?.trim() || null;
    }

    if (status !== undefined) {
      if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
      task.status = status;
    }

    if (priority !== undefined) {
      if (!ALLOWED_PRIORITIES.includes(priority)) {
        return res.status(400).json({ error: "Invalid priority value" });
      }
      task.priority = priority;
    }

    if (deadline !== undefined) {
      if (deadline === null || deadline === "") {
        task.deadline = null;
      } else {
        const deadlineDate = new Date(deadline);
        if (isNaN(deadlineDate.getTime())) {
          return res
            .status(400)
            .json({ error: "Invalid deadline date format" });
        }
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        if (deadlineDate < now) {
          return res
            .status(400)
            .json({ error: "Deadline cannot be in the past" });
        }
        task.deadline = deadlineDate;
      }
    }

    if (assigneeId !== undefined) {
      if (assigneeId === null || assigneeId === "") {
        task.assigneeId = null;
      } else {
        const user = await User.findByPk(assigneeId);
        if (!user) {
          return res.status(400).json({ error: "Assignee not found" });
        }
        task.assigneeId = assigneeId;
      }
    }

    await task.save();

    const taskWithAssignee = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: "assignee",
          attributes: ["id", "firstname", "lastname", "email"],
        },
      ],
    });

    res.json(taskWithAssignee);
    return;
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

tasksRouter.delete("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.destroy();
    res.status(204).send();
    return;
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

app.use("/", tasksRouter);
app.use("/api", tasksRouter);
app.use("/api/auth", authRouter);

async function startServer() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

const isMainModule =
  process.argv[1]?.endsWith("server.ts") ||
  process.argv[1]?.endsWith("server.js");

if (isMainModule) {
  registerProcessHandlers();
  startServer();
}

export { app };
