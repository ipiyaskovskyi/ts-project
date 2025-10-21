import type { TaskType } from './dto/Task';

const BASE = '/api/tasks';

export async function listTasks(): Promise<TaskType[]> {
  const res = await fetch(BASE);
  const data = await res.json();
  return (Array.isArray(data) ? data : []).map((t: any) => ({ ...t, id: Number(t.id) })) as TaskType[];
}

export async function getTask(id: number): Promise<TaskType> {
  const res = await fetch(`${BASE}/${id}`);
  const data = await res.json();
  return { ...data, id: Number(data.id) } as TaskType;
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
  return { ...data, id: Number(data.id) } as TaskType;
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
  await fetch(`${BASE}/${id}`, {
		method: 'DELETE'
	});
}
