# Task Management System

A React + TypeScript application built with Vite for creating and managing tasks.

## Features

- **CreateTaskForm Component**: A comprehensive form for creating new tasks
- **Form Validation**: Built with react-hook-form and zod for robust validation
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Clean and responsive design with CSS styling

## Form Features

- **Required Fields**: Title, Status, Priority
- **Optional Fields**: Description, Deadline
- **Validation Rules**:
  - Title: 3-100 characters, required
  - Description: Max 500 characters, optional
  - Status: todo, in-progress, done
  - Priority: low, medium, high
  - Deadline: Cannot be in the past
- **Error Handling**: Real-time validation with error messages
- **Submit Button**: Disabled until all required fields are valid

## Tech Stack

- React 18
- TypeScript
- Vite
- react-hook-form
- zod
- axios
- CSS3

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Start the JSON server (for API):
```bash
npm run api
```

## API Integration

The form integrates with a JSON server API running on `http://localhost:3001/api/tasks`. Make sure to start the JSON server before testing the form submission.

## Project Structure

```
src/
├── components/
│   ├── CreateTaskForm.tsx
│   └── CreateTaskForm.css
├── types/
│   └── Task.ts
├── schemas/
│   └── taskSchema.ts
├── api/
│   └── taskApi.ts
├── App.tsx
└── main.tsx
```