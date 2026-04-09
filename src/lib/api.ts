const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type RequestOptions = RequestInit & {
  body?: BodyInit | null;
};

async function request<T>(path: string, options?: RequestOptions): Promise<T> {
  const isFormData =
    typeof FormData !== 'undefined' && options?.body instanceof FormData;

  const headers = new Headers(options?.headers || {});

  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body:
        body instanceof FormData
          ? body
          : body
            ? JSON.stringify(body)
            : null,
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body:
        body instanceof FormData
          ? body
          : body
            ? JSON.stringify(body)
            : null,
    }),

  delete: <T>(path: string) =>
    request<T>(path, {
      method: 'DELETE',
    }),
};

