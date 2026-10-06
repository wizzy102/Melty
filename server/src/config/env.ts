import 'dotenv/config';
import { z } from 'zod';

/**
 * All secrets and environment-specific settings are read here, validated once
 * at startup. Nothing secret is hardcoded anywhere else in the codebase.
 */
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),

  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  MONGODB_DB: z.string().min(1).default('melty'),

  // Admin auth — the password is stored ONLY as a bcrypt hash.
  // Generate one with: npm run hash-password -- "your-password"
  ADMIN_USERNAME: z.string().min(3),
  ADMIN_PASSWORD_HASH: z.string().startsWith('$2', 'ADMIN_PASSWORD_HASH must be a bcrypt hash'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN_HOURS: z.coerce.number().positive().default(12),

  // Comma-separated list of allowed browser origins (the client app).
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),

  // Which proxies may set X-Forwarded-For (used for the client IP in rate limits).
  // Number of proxy hops in front of the app, or an Express keyword such as "loopback".
  // Trusting it from anyone would let attackers fake a new IP per request and
  // dodge the login lockout. Default: the local dev proxy only.
  TRUST_PROXY: z.string().default('loopback'),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('\n[config] Invalid environment configuration:');
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  }
  console.error('\nCopy server/.env.example to server/.env and fill in the values.\n');
  process.exit(1);
}

export const env = {
  ...parsed.data,
  isProd: parsed.data.NODE_ENV === 'production',
  clientOrigins: parsed.data.CLIENT_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean),
  trustProxy: /^\d+$/.test(parsed.data.TRUST_PROXY) ? Number(parsed.data.TRUST_PROXY) : parsed.data.TRUST_PROXY,
};
