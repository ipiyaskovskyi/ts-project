import type { TaskType } from '../types/Task';

const BASE = '/api/tasks';

export async function listTasks(): Promise<TaskType[]> {
  const res = await fetch(BASE);
  const data = await res.json();
  return (Array.isArray(data)
    ? data
    : []) as TaskType[];
}

export async function getTask(id: number): Promise<TaskType> {
  const res = await fetch(`${BASE}/${id}`);
  const data = await res.json();
  return data as TaskType;
}

export async function createTask(task: Omit<TaskType, 'id'>): Promise<TaskType> {
  const toSend = {
		...task,
		createdAt: new Date().toISOString()
	};
  const res = await fetch(BASE, {
    method: 'POST',
    headers: {
			'Content-Type': 'application/json'
		},
    body: JSON.stringify(toSend),
  });
  const data = await res.json();
  return data as TaskType;
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
  console.log('DELETE request to:', url);
  
  const res = await fetch(url, {
		method: 'DELETE'
	});
  
  console.log('DELETE response status:', res.status);
  
  if (!res.ok) {
    throw new Error(`Failed to delete task: ${res.status} ${res.statusText}`);
  }
}
