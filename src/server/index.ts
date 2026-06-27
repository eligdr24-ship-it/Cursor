import { createApp } from './app.js';
import { config } from './config.js';
import { createPostgresPool, createRedisQueueClient } from './infrastructure.js';

const app = createApp();
const postgresPool = createPostgresPool();
const redisClient = createRedisQueueClient();

if (redisClient) {
  redisClient.connect().catch((error) => {
    console.error('Redis connection failed', error);
  });
}

app.listen(config.PORT, () => {
  console.log(`Control Tower AI API listening on :${config.PORT}`);
  console.log(postgresPool ? 'PostgreSQL configured' : 'PostgreSQL not configured; using in-memory store');
  console.log(redisClient ? 'Redis queue configured' : 'Redis not configured; workers disabled locally');
});
