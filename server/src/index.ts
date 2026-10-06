import { env } from './config/env.js';
import { connectDb } from './db.js';
import { createApp } from './app.js';

async function main() {
  await connectDb();
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`[api] listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error('[startup] failed:', err?.message ?? err);
  process.exit(1);
});
