import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZodError } from 'zod';
import { attachCurrentUser } from './auth.js';
import { config } from './config.js';
import { apiRouter } from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const clientDistDir = path.join(rootDir, 'dist/client');
const legacyPublicDir = path.join(rootDir, 'public');

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  );
  app.use(
    cors({
      origin: config.NODE_ENV === 'production' ? config.APP_ORIGIN : true,
      credentials: true
    })
  );
  app.use(morgan(config.NODE_ENV === 'test' ? 'tiny' : 'combined'));
  app.use(cookieParser());
  app.use(express.json({ limit: '4mb' }));

  app.use('/legacy', express.static(legacyPublicDir));
  app.use('/api', attachCurrentUser, apiRouter);

  app.use(express.static(clientDistDir));
  app.get('*splat', (_req, res) => {
    res.sendFile(path.join(clientDistDir, 'index.html'));
  });

  app.use(errorHandler);

  return app;
}

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed.',
      issues: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message
      }))
    });
    return;
  }

  res.status(500).json({
    error: err instanceof Error ? err.message : 'Unexpected server error.'
  });
};
