# Task Tracker

A modern task management application built with Next.js, TypeScript, Sequelize, and Material UI.

## Features

- 📋 Kanban board for task management
- 👤 User authentication (register/login)
- 🎯 Task filtering and sorting
- 📊 Drag and drop functionality
- 🔒 Type-safe API with Zod validation
- 🧪 Comprehensive test coverage
- 🐳 Docker support
- 📝 Code quality tools (ESLint, Prettier, Husky)

## Tech Stack

- **Frontend**: Next.js 16, React 19, Material UI, TypeScript
- **Backend**: Next.js API Routes, Sequelize ORM
- **Database**: PostgreSQL / SQLite
- **Validation**: Zod
- **Testing**: Jest, React Testing Library
- **Code Quality**: ESLint, Prettier, Husky

## Prerequisites

- Node.js 20+
- npm or yarn
- PostgreSQL (optional, SQLite used by default)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ts-project
```

2. Install dependencies:

```bash
npm install
```

3. Copy environment variables:

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
   - For SQLite (default): No additional configuration needed
   - For PostgreSQL: Set `USE_POSTGRES=true` and configure database credentials

5. Run database migrations:

```bash
npm run migrate
```

6. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Documentation

Interactive API documentation is available at `/api-docs` when the development server is running.

You can also access the OpenAPI JSON specification at `/api/docs`.

### Viewing API Documentation

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000/api-docs`
3. Explore all available endpoints, request/response schemas, and try out the API directly from the Swagger UI

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo last migration
- `npm run migrate:status` - Check migration status

## Docker

### Development with Docker Compose

```bash
docker-compose up
```

This will start:

- PostgreSQL database on port 5432
- Application on port 3000

### Production Build

```bash
docker build -t tasktracker .
docker run -p 3000:3000 tasktracker
```

## Project Structure

```
src/
├── app/              # Next.js app router pages and API routes
│   ├── api/          # API endpoints
│   ├── board/        # Kanban board page
│   └── login/        # Authentication pages
├── components/       # React components
├── lib/              # Core libraries
│   ├── api/          # API client functions
│   ├── db/           # Database configuration and migrations
│   ├── models/       # Sequelize models
│   ├── services/     # Business logic
│   └── validators/   # Zod schemas
├── hooks/            # Custom React hooks
└── types/             # TypeScript type definitions
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks

- `GET /api/tasks` - Get all tasks (with optional filters)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Get task by ID
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

## Testing

Run all tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Code Quality

The project uses:

- **ESLint** for linting
- **Prettier** for code formatting
- **Husky** for git hooks (pre-commit, pre-push)

Before committing, the following checks run automatically:

- Code formatting (Prettier)
- Linting (ESLint)
- Type checking (TypeScript)
- Tests (Jest)

## Environment Variables

See `.env.example` for all available environment variables.

### Security Configuration

- `JWT_SECRET`: Secret key for JWT token signing (required in production)
- `JWT_EXPIRES_IN`: Token expiration time (default: 7d)
- `CORS_ORIGINS`: Comma-separated list of allowed origins for CORS

**Important**: Always set a strong `JWT_SECRET` in production!

### Redis Configuration (Optional)

- `USE_REDIS`: Enable Redis caching (default: false)
- `REDIS_HOST`: Redis server host (default: localhost)
- `REDIS_PORT`: Redis server port (default: 6379)
- `REDIS_PASSWORD`: Redis password (optional)

## Performance Optimizations

### Caching

- **Redis Caching**: Optional Redis integration for caching frequently accessed data
- Task lists and individual tasks are cached with configurable TTL
- Cache invalidation on create/update/delete operations

### Pagination

- All list endpoints support pagination via `page` and `limit` query parameters
- Default: 20 items per page, maximum: 100 items per page
- Response includes pagination metadata (total, totalPages, hasNext, hasPrev)

### Database Optimization

- Indexes on frequently queried columns (status, priority, createdAt, assigneeId)
- Optimized queries with proper joins and select statements
- Connection pooling for efficient database connections

### Image Optimization

- Next.js Image component with automatic format conversion (AVIF, WebP)
- Responsive image sizes for different device types
- Optimized caching with minimum TTL of 60 seconds

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all tests pass
4. Run linting and formatting
5. Submit a pull request

## License

[Add your license here]
