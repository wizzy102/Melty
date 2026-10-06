import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { timingSafeEqual } from 'node:crypto';
import { env } from '../../config/env.js';
import { clearAdminSession, issueAdminSession, requireAdmin } from '../../middleware/auth.js';
import { unauthorized } from '../../utils/httpError.js';

export const adminAuthRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: { code: 'too_many_attempts' } },
});

const LoginInput = z.object({
  username: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(200),
});

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

adminAuthRouter.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = LoginInput.parse(req.body);

  // Always run bcrypt so response time doesn't reveal whether the username matched.
  const passwordOk = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);
  const usernameOk = safeEqual(username.toLowerCase(), env.ADMIN_USERNAME.toLowerCase());
  if (!passwordOk || !usernameOk) throw unauthorized('invalid_credentials');

  issueAdminSession(res, env.ADMIN_USERNAME);
  res.json({ admin: { username: env.ADMIN_USERNAME } });
});

adminAuthRouter.post('/logout', (_req, res) => {
  clearAdminSession(res);
  res.json({ ok: true });
});

adminAuthRouter.get('/me', requireAdmin, (_req, res) => {
  res.json({ admin: res.locals.admin });
});
