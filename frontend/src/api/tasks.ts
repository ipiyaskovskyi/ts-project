import type { Task, Status, Priority } from "../types";

const API_BASE_URL = "/api/tasks";

type ApiTask = {
  id: number;
  title: string;
  description?: string | null;
  type?: string | null;
  status: Status;
  priority?: Priority | null;
  deadline?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type ApiTaskResponse = ApiTask & {
  assignee?: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  } | null;
};

const mapApiTask = (task: ApiTaskResponse): Task => ({
  id: task.id,
  title: task.title,
  description: task.description ?? undefined,
  type: (task.type as "Task" | "Subtask" | "Bug" | "Story" | "Epic") || "Task",
  status: task.status,
  priority: task.priority ?? "medium",
  createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
  deadline: task.deadline ? new Date(task.deadline) : undefined,
});

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "Request failed";
    try {
      const errorBody = await response.json();
      if (errorBody?.error) {
        message = errorBody.error;
      }
    } catch (error) {}
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(API_BASE_URL);
  const data = await handleResponse<ApiTaskResponse[]>(response);
  return data.map(mapApiTask);
}

export async function fetchTaskById(id: number): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  const data = await handleResponse<ApiTaskResponse>(response);
  return mapApiTask(data);
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  type?: string;
  status: Status;
  priority: Priority;
  deadline?: string;
}

const buildTaskBody = (payload: Partial<CreateTaskPayload>) => {
  const body: Record<string, unknown> = {};

  if (payload.title !== undefined) {
    body.title = payload.title;
  }

  if (payload.description !== undefined) {
    body.description = payload.description || null;
  }

  if (payload.type !== undefined) {
    body.type = payload.type || null;
  }

  if (payload.status !== undefined) {
    body.status = payload.status;
  }

  if (payload.priority !== undefined) {
    body.priority = payload.priority;
  }

  if (payload.deadline !== undefined) {
    if (!payload.deadline) {
      body.deadline = null;
    } else {
      body.deadline = new Date(payload.deadline).toISOString();
    }
  }

  return body;
};

export async function createTask(
  payload: CreateTaskPayload
): Promise<Task> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildTaskBody(payload)),
  });

  const data = await handleResponse<ApiTaskResponse>(response);
  return mapApiTask(data);
}

export async function updateTask(
  id: number,
  payload: Partial<CreateTaskPayload>
): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildTaskBody(payload)),
  });

  const data = await handleResponse<ApiTaskResponse>(response);
  return mapApiTask(data);
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    let message = "Failed to delete task";
    try {
      const errorBody = await response.json();
      if (errorBody?.error) {
        message = errorBody.error;
      }
    } catch (error) {}
    throw new Error(message);
  }
}
