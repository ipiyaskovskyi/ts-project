import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { sequelize } from './models/index.js';
import tasksRouter from './routes/tasks.js';
import authRouter from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('combined'));
}

function registerProcessHandlers() {
  const logAndExit = (signal: string) => {
    console.error(`[shutdown] received ${signal}, stopping server...`);
    process.exit(0);
  };

  // Prevent process from exiting on uncaught exception
  process.on('uncaughtException', (error) => {
    console.error('[fatal] uncaught exception:', error);
    // Log the error but don't exit - keep server running
    // In production, you might want to restart gracefully
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('[fatal] unhandled rejection at:', promise);
    console.error('[fatal] reason:', reason);
    // Don't exit, just log - let Express error handler deal with it
  });

  process.once('SIGINT', () => logAndExit('SIGINT'));
  process.once('SIGTERM', () => logAndExit('SIGTERM'));
  process.once('exit', (code) => {
    console.error(`[shutdown] process exiting with code ${code}`);
  });
}

async function ensurePostgresEnums() {
  if (sequelize.getDialect() !== 'postgres') {
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
    addEnumValue('enum_tasks_status', 'todo'),
    addEnumValue('enum_tasks_status', 'in_progress'),
    addEnumValue('enum_tasks_status', 'review'),
    addEnumValue('enum_tasks_priority', 'urgent'),
  ]);
}

async function addTypeColumnIfNotExists() {
  const dialect = sequelize.getDialect();
  const tableName = 'tasks';
  const columnName = 'type';

  try {
    if (dialect === 'postgres') {
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
    } else if (dialect === 'sqlite') {
      const [results] = (await sequelize.query(
        `PRAGMA table_info(${tableName})`
      )) as unknown[];
      const hasColumn =
        Array.isArray(results) &&
        results.some(
          (row: unknown) =>
            typeof row === 'object' &&
            row !== null &&
            'name' in row &&
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
    console.log('Attempting to connect to database...');
    await sequelize.authenticate();
    console.log('Database connection established');
    await sequelize.sync({ force: false, alter: false });
    console.log('Database models synced');
    await addTypeColumnIfNotExists();
    await ensurePostgresEnums();
    console.log('Database connected and synced');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    console.error('Database error details:', error instanceof Error ? error.stack : error);
    throw error; // Re-throw to be handled by startServer
  }
}

// Log all incoming requests for debugging
app.use((req, _res, next) => {
  console.log(`[server] ${req.method} ${req.path}`);
  next();
});

app.use('/', tasksRouter);
app.use('/api', tasksRouter);
app.use('/api/auth', authRouter);

// 404 handler
app.use((_req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware (must be last)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  
  // If response was already sent, delegate to default error handler
  if (res.headersSent) {
    return _next(err);
  }
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message || 'Internal server error'
  });
});

async function startServer() {
  try {
    await initializeDatabase();
    
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Handle server errors
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

      switch (error.code) {
        case 'EACCES':
          console.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

const isMainModule =
  process.argv[1]?.endsWith('server.ts') ||
  process.argv[1]?.endsWith('server.js');

if (isMainModule) {
  registerProcessHandlers();
  startServer().catch((error) => {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  });
}

export { app };
