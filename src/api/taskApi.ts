import type { TaskType } from '../types/Task';
import type { TaskFormData } from '../schemas/taskSchema';

const BASE = '/api/tasks';

export async function listTasks(): Promise<TaskType[]> {
  const res = await fetch(BASE);
  return res.json();
}

export async function getTask(id: number): Promise<TaskType> {
  const res = await fetch(`${BASE}/${id}`);
  return res.json();
}

export async function createTask(task: TaskFormData): Promise<TaskType> {
  const toSend = {
		...task,
		createdAt: new Date()
	};
  const res = await fetch(BASE, {
    method: 'POST',
    headers: {
			'Content-Type': 'application/json'
		},
    body: JSON.stringify(toSend),
  });
  return res.json();
}

export async function updateTask(id: number, patch: Partial<TaskType>): Promise<TaskType> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: {
			'Content-Type': 'application/json'
		},
    body: JSON.stringify(patch),
  });

  return res.json();
}

export async function deleteTask(id: number): Promise<void> {
  const url = `${BASE}/${id}`;
  
  const res = await fetch(url, {
		method: 'DELETE'
	});
  
  if (!res.ok) {
    throw new Error(`Failed to delete task: ${res.status} ${res.statusText}`);
  }
}
