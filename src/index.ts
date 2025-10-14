import tasks from '../tasks.json';
import TaskController from './modules/tasks/task.controller';
import type { Task as TaskType } from './dto/Task';
import {
  Task,
  Subtask,
  Bug,
  Story,
  Epic,
} from './modules/tasks/task.types';

const provider = new TaskController();

provider.load(tasks);

const created = provider.create({
  id: provider.generateId(),
  title: 'Implement login',
  priority: 'high',
  status: 'in_progress',
  storyPoints: 5,
  description: 'Add OAuth login flow',
  deadline: new Date('2025-12-31'),
});
console.log('Created:', created);

const taskById = provider.getById(2);
console.log('GetById:', taskById);

const updated = provider.update({
  id: 2,
  title: 'Implement login (OAuth2 + SSO)',
  storyPoints: -10,
  priority: 'medium',
});
console.log('Updated:', updated);

const filtered = provider.filter({ status: 'in_progress', priority: 'high' });
console.log('Filtered:', filtered);

provider.delete(2);
console.log('Deleted:', 'task with id 2');

const task = new Task({
  id: provider.generateId(),
  title: 'Base task',
  priority: 'low',
  status: 'todo',
});
console.log('New task:', task);

const sub = new Subtask({
  id: provider.generateId(),
  title: 'Subtask of base',
  parentId: 1,
  status: 'in_progress',
  labels: ['subtask'],
  assignee: 'John Doe',
});
console.log('Subtask:', sub);

const bug = new Bug({
  id: provider.generateId(),
  title: 'Fix crash on startup',
  severity: 'critical',
  priority: 'high',
  status: 'in_progress',
  environment: 'Windows 10',
  stepsToReproduce: 'Open app',
});
console.log('Bug:', bug);

const story = new Story({
  id: provider.generateId(),
  title: 'User can manage profile',
  storyPoints: 8,
  priority: 'medium',
  status: 'todo',
  epicLink: 'Epic 1',
});
console.log('Story:', story);

const epic = new Epic({
  id: provider.generateId(),
  title: 'Authentication & Authorization',
  childrenIds: [3, 4],
  status: 'in_progress',
  color: 'red',
});
console.log('Epic:', epic);


console.log('Task info (base):', task.getTaskInfo());
console.log('Task info (sub):', sub.getTaskInfo());
console.log('Task info (bug):', bug.getTaskInfo());
console.log('Task info (story):', story.getTaskInfo());
console.log('Task info (epic):', epic.getTaskInfo());

