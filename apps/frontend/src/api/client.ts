const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** JSON.stringify que conserva los campos puestos a `undefined` (p. ej. al
 * vaciar un input opcional) como `null` explícito, en vez de omitirlos del
 * cuerpo de la petición. Si no se hiciera así, el backend no podría
 * distinguir "el usuario quiere borrar este campo" de "esta petición no
 * incluye este campo" y nunca se llegaría a borrar. */
function stringifyBody(body: unknown): string {
  return JSON.stringify(body, (_key, value: unknown) => (value === undefined ? null : value));
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    const message = Array.isArray(body.message) ? body.message.join(', ') : (body.message ?? res.statusText);
    throw new ApiError(res.status, message);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: body ? stringifyBody(body) : undefined }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body: body ? stringifyBody(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

async function fetchBlob(path: string, body: unknown): Promise<Blob> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, errBody.message ?? res.statusText);
  }
  return res.blob();
}

export async function downloadFile(path: string, body: unknown, filename: string): Promise<void> {
  const blob = await fetchBlob(path, body);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** Descarga el fichero y devuelve una object URL para mostrarlo en línea
 * (p. ej. en un <iframe>), en vez de forzar la descarga. Quien la use debe
 * revocarla con URL.revokeObjectURL cuando ya no la necesite. */
export async function fetchObjectUrl(path: string, body: unknown): Promise<string> {
  const blob = await fetchBlob(path, body);
  return URL.createObjectURL(blob);
}
