/**
 * Thin fetch wrapper. Errors carry the server's stable `code`
 * (e.g. "phone_invalid"), which the UI translates per language.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    public details?: unknown,
  ) {
    super(code);
  }

  /** Field-level validation codes keyed by path, e.g. { "customer.phone": "phone_invalid" } */
  get fieldErrors(): Record<string, string> {
    if (this.code !== 'validation_failed' || !Array.isArray(this.details)) return {};
    const out: Record<string, string> = {};
    for (const d of this.details as { path: string; code: string }[]) out[d.path] ??= d.code;
    return out;
  }
}

const BASE = '/api';

export async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, headers, ...rest } = init;
  let res: Response;
  try {
    res = await fetch(BASE + path, {
      credentials: 'include',
      ...rest,
      headers: { ...(json !== undefined ? { 'Content-Type': 'application/json' } : {}), ...headers },
      body: json !== undefined ? JSON.stringify(json) : rest.body,
    });
  } catch {
    throw new ApiError(0, 'network_error');
  }

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, body?.error?.code ?? 'server_error', body?.error?.details);
  }
  return body as T;
}
