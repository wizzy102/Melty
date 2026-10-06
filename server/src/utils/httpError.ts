/**
 * An error that is safe to show to the client. `code` is a stable,
 * machine-readable key the frontend translates into English/Arabic.
 */
export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message?: string,
    public details?: unknown,
  ) {
    super(message ?? code);
  }
}

export const badRequest = (code: string, details?: unknown) =>
  new HttpError(400, code, undefined, details);
export const unauthorized = (code = 'unauthorized') => new HttpError(401, code);
export const notFound = (code = 'not_found') => new HttpError(404, code);
export const conflict = (code: string, details?: unknown) =>
  new HttpError(409, code, undefined, details);
