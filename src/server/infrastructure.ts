import pg from 'pg';
import { createClient } from 'redis';
import { config } from './config.js';

export function createPostgresPool() {
  if (!config.DATABASE_URL) return null;

  return new pg.Pool({
    connectionString: config.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000
  });
}

export function createRedisQueueClient() {
  if (!config.REDIS_URL) return null;

  return createClient({
    url: config.REDIS_URL
  });
}
