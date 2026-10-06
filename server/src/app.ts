import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { publicRouter } from './routes/public.js';
import { adminAuthRouter } from './routes/admin/auth.js';
import { adminOrdersRouter } from './routes/admin/orders.js';
import { adminProductsRouter } from './routes/admin/products.js';
import { requireAdmin } from './middleware/auth.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', env.trustProxy);
  app.use(helmet());
  app.use(cors({ origin: env.clientOrigins, credentials: true }));
  app.use(express.json({ limit: '50kb' }));
  app.use(cookieParser());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  // ---- Public customer ordering API
  app.use('/api', publicRouter);

  // ---- Admin API (login is public; everything else requires a valid session)
  app.use('/api/admin/auth', adminAuthRouter);
  app.use('/api/admin/orders', requireAdmin, adminOrdersRouter);
  app.use('/api/admin/products', requireAdmin, adminProductsRouter);

  app.use('/api', notFoundHandler);
  app.use(errorHandler);

  return app;
}
