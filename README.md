# Task Management API

A RESTful API for managing tasks built with Express.js, TypeScript, and Zod validation.

## Features

- CRUD operations for tasks
- Query filtering by created date, status, and priority
- Request validation using Zod
- Error handling with proper HTTP status codes
- Request logging with Morgan
- CORS support

## Project Structure

```
src/
├── controllers/        # Request handlers
│   └── task.controller.ts
├── routes/            # Route definitions and validation
│   └── task.routes.ts
├── services/          # Business logic
│   └── task.service.ts
├── types/            # TypeScript types
│   └── task.types.ts
└── server.ts         # Entry point
```

## API Endpoints

### GET /tasks
Returns a list of all tasks with optional filtering.

**Query Parameters:**
- `createdAt` (string): Filter by creation date (YYYY-MM-DD)
- `status` (string): Filter by status (`todo`, `in_progress`, `done`)
- `priority` (string): Filter by priority (`low`, `medium`, `high`)

**Example:**
```bash
GET /tasks?status=todo&priority=high
```

### GET /tasks/:id
Returns a specific task by ID.

### POST /tasks
Creates a new task.

**Request Body:**
```json
{
  "title": "Task title",
  "description": "Task description (optional)",
  "status": "todo",
  "priority": "medium"
}
```

### PUT /tasks/:id
Updates an existing task.

**Request Body:** (all fields optional)
```json
{
  "title": "Updated title",
  "status": "in_progress",
  "priority": "high"
}
```

### DELETE /tasks/:id
Deletes a task.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Run Production Build

```bash
npm start
```

## Technologies

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Zod** - Schema validation
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

