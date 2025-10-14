import tasks from '../tasks.json';
import { DEFAULT_DESCRIPTION, DEFAULT_PRIORITY, DEFAULT_STATUS } from './constants';
import { Task, Priority, Status, DateString, TaskFilter } from './dto/Task';
import { z } from 'zod';

const validateTasksJSON = (data: unknown): Task[] => {
    const schema = z.object({
        id: z.string().or(z.number()),
        title: z.string(),
        priority: z.preprocess(
            (value) => value === '' ? undefined : value,
            z.enum(['low', 'medium', 'high']).default(DEFAULT_PRIORITY)
        ),
        status: z.preprocess(
            (value) => value === '' ? undefined : value,
            z.enum(['todo', 'in_progress', 'done']).default(DEFAULT_STATUS)
        ),
        createdAt: z.string().or(z.date()),
        description: z.string().optional(),
        deadline: z.string().or(z.date()).optional(),
    });
    const tasksSchema = z.array(schema);

    return tasksSchema.parse(data);
}

const tasksTyped: Task[] = validateTasksJSON(tasks);

const getTasksById = (id: number): Task | undefined => {
    return tasksTyped.find((task) => task.id === id);
}

const createTask = (task: Task): void => {
    const { id, title, priority, status, createdAt, description, deadline } = task;

    if (tasksTyped.some((t) => t.id === id)) {
        throw new Error(`Task with id ${id} already exists`);
    }

    const newTask: Task = {
        id,
        title,
        priority: priority || DEFAULT_PRIORITY,
        createdAt: createdAt || new Date().toISOString(),
        status: status || DEFAULT_STATUS,
        description: description || DEFAULT_DESCRIPTION,
        deadline: deadline || new Date().toISOString()
    };

    tasksTyped.push(newTask);
}

const updateTask = (task: Task): void =>{
    const index = tasksTyped.findIndex((t: Task) => t.id === task.id);

    if (index === -1) {
        throw new Error('Task not found');
    }

    tasksTyped[index] = { ...tasksTyped[index], ...task };
}

const deleteTask = (id: number): void => {
    const index = tasksTyped.findIndex((t: Task) => t.id === id);
    if (index === -1) {
        throw new Error('Task not found');
    }
    tasksTyped.splice(index, 1);
}

const toTime = (date?: DateString) => {
  if (!date) return undefined;

  const timestamp = new Date(date).getTime();
  return Number.isNaN(timestamp) ? undefined : timestamp;
};

const filterTasks = ({ status, priority, createdFrom, createdTo }: TaskFilter): Task[] => {
  const fromDate = toTime(createdFrom);
  const toDate = toTime(createdTo);

  return tasksTyped.filter((t) => {
    if (status && t.status !== status) return false;
    if (priority && t.priority !== priority) return false;

    const createdAtTimestamp = toTime(t.createdAt);

    if (createdAtTimestamp === undefined) return false;

    if (fromDate !== undefined && createdAtTimestamp < fromDate) return false;
    if (toDate !== undefined && createdAtTimestamp > toDate) return false;
    return true;
  });
};

getTasksById(2)
createTask({
    id: tasksTyped.length + 1,
    title: 'New Task',
    priority: 'high',
    status: 'in_progress',
    description: 'This is a new task',
    deadline: new Date('2024-12-31')
  });
updateTask({id: 2, title: 'Updated Task', priority: 'low' });
deleteTask(1);

console.log(tasksTyped);

console.log(filterTasks({ status: 'todo' }));
console.log(filterTasks({ priority: 'high' }));
console.log(filterTasks({
  createdFrom: '2025-09-01T00:00:00.000Z',
  createdTo: '2025-09-30T23:59:59.999Z',
}));
console.log(filterTasks({
  status: 'in_progress',
  priority: 'high',
  createdFrom: '2025-10-01T00:00:00.000Z',
  createdTo: '2025-10-31T23:59:59.999Z',
}));