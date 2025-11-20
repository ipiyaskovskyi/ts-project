import type { TaskType } from './dto/Task';

const BASE = '/api/tasks';

export async function listTasks(): Promise<TaskType[]> {
  const res = await fetch(BASE);

  return res.json();
}

export async function getTask(id: number): Promise<TaskType> {
  const res = await fetch(`${BASE}/${id}`);

  return res.json();
}

export async function createTask(task: Omit<TaskType, 'id'>): Promise<TaskType> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create task');
  }

  const data = await res.json();
  return { ...data, id: Number(data.id) } as TaskType;
}

export async function updateTask(id: number, patch: Partial<TaskType>): Promise<TaskType> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: {
			'Content-Type': 'application/json'
		},
    body: JSON.stringify(patch),
  });

  return res.json();
}

export async function deleteTask(id: number): Promise<void> {
  await fetch(`${BASE}/${id}`, {
		method: 'DELETE'
	});
}
