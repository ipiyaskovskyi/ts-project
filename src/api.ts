import type { TaskId, TaskType } from './dto/Task';

const BASE = '/api/tasks';

export type TaskCreatePayload = Omit<TaskType, 'id'>;
export type TaskUpdatePayload = Partial<Omit<TaskType, 'id'>>;

export async function listTasks(): Promise<TaskType[]> {
  const res = await fetch(BASE);

  const data: TaskType[] = await res.json();
  return data;
}

export async function getTask(id: TaskId): Promise<TaskType> {
  const res = await fetch(`${BASE}/${id}`);

  const data: TaskType = await res.json();
  return data;
}

export async function createTask(task: TaskCreatePayload): Promise<TaskType> {
  const toSend = {
    ...task,
    createdAt: new Date().toISOString(),
  };
  const res = await fetch(BASE, {
    method: 'POST',
    headers: {
			'Content-Type': 'application/json'
		},
    body: JSON.stringify(toSend),
  });
  const data: TaskType = await res.json();
  return data;
}

export async function updateTask(id: TaskId, patch: TaskUpdatePayload): Promise<TaskType> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patch),
  });

  const data: TaskType = await res.json();
  return data;
}

export async function deleteTask(id: TaskId): Promise<void> {
  await fetch(`${BASE}/${id}`, {
		method: 'DELETE'
	});
}
