import type { RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { unauthorized } from '../utils/httpError.js';

export const AUTH_COOKIE = 'melty_admin';

interface AdminTokenPayload {
  sub: string;
  role: 'admin';
}

export function issueAdminSession(res: Response, username: string): void {
  const token = jwt.sign({ sub: username, role: 'admin' } satisfies AdminTokenPayload, env.JWT_SECRET, {
    expiresIn: `${env.JWT_EXPIRES_IN_HOURS}h`,
    algorithm: 'HS256',
  });
  res.cookie(AUTH_COOKIE, token, {
    httpOnly: true, // not readable from JavaScript
    secure: env.isProd, // HTTPS-only in production
    sameSite: 'strict', // not sent on cross-site requests (CSRF mitigation)
    maxAge: env.JWT_EXPIRES_IN_HOURS * 60 * 60 * 1000,
    path: '/api',
  });
}

export function clearAdminSession(res: Response): void {
  res.clearCookie(AUTH_COOKIE, { httpOnly: true, secure: env.isProd, sameSite: 'strict', path: '/api' });
}

/** Server-side guard for every admin API route. */
export const requireAdmin: RequestHandler = (req, res, next) => {
  const token: unknown = req.cookies?.[AUTH_COOKIE];
  if (typeof token !== 'string' || !token) {
    throw unauthorized('not_authenticated');
  }
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] }) as AdminTokenPayload;
    if (payload.role !== 'admin') throw new Error('bad role');
    res.locals.admin = { username: payload.sub };
    next();
  } catch {
    clearAdminSession(res);
    throw unauthorized('session_expired');
  }
};
