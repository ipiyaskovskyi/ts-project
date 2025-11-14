async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = 'Request failed';
    try {
      const errorBody = await response.json();
      if (errorBody?.error) {
        message = errorBody.error;
      }
    } catch {
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export interface UserResponse {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export async function login(payload: LoginPayload): Promise<UserResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<UserResponse>(response);
}

export async function register(
  payload: RegisterPayload
): Promise<UserResponse> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<UserResponse>(response);
}
