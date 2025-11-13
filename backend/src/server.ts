import "reflect-metadata";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "./models/index.js";
import tasksRouter from "./routes/tasks.js";
import authRouter from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

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

async function addTypeColumnIfNotExists() {
  const dialect = sequelize.getDialect();
  const tableName = "tasks";
  const columnName = "type";

  try {
    if (dialect === "postgres") {
      const [results] = await sequelize.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = '${tableName}' AND column_name = '${columnName}'
      `);
      if (Array.isArray(results) && results.length === 0) {
        await sequelize.query(
          `ALTER TABLE "${tableName}" ADD COLUMN "${columnName}" VARCHAR(255)`
        );
        console.log(`Added column ${columnName} to ${tableName}`);
      }
    } else if (dialect === "sqlite") {
      const [results] = (await sequelize.query(
        `PRAGMA table_info(${tableName})`
      )) as unknown[];
      const hasColumn = Array.isArray(results) && results.some(
        (row: unknown) =>
          typeof row === "object" &&
          row !== null &&
          "name" in row &&
          row.name === columnName
      );
      if (!hasColumn) {
        await sequelize.query(
          `ALTER TABLE ${tableName} ADD COLUMN ${columnName} VARCHAR(255)`
        );
        console.log(`Added column ${columnName} to ${tableName}`);
      }
    }
  } catch (error) {
    console.error(`Error adding column ${columnName}:`, error);
  }
}

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false, alter: false });
    await addTypeColumnIfNotExists();
    await ensurePostgresEnums();
    console.log("Database connected and synced");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

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
