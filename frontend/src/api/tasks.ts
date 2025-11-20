import type { CreateTaskInput, Task } from "../types/task";

const BASE_URL = "/api/tasks";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      (errorBody as { error?: string }).error ?? response.statusText;
    throw new Error(message || "Unknown API error");
  }
  return (await response.json()) as T;
}

export async function listTasks(): Promise<Task[]> {
  const response = await fetch(BASE_URL);
  return handleResponse<Task[]>(response);
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return handleResponse<Task>(response);
}
