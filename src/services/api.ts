const API_URL = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem('token');
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || 'Erro na requisição');
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get: (path: string) => request(path),
  post: (path: string, data?: unknown) =>
    request(path, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  put: (path: string, data?: unknown) =>
    request(path, { method: 'PUT', body: data ? JSON.stringify(data) : undefined }),
  del: (path: string) => request(path, { method: 'DELETE' }),
};