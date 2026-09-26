import Fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from './env.js';
import { healthRoutes } from './routes/health.js';
import { webhookRoutes } from './routes/webhooks.js';

const app = Fastify({
  logger:
    env.NODE_ENV === 'production' ? true : { transport: { target: 'pino-pretty' }, level: 'debug' },
});

await app.register(cors, { origin: env.WEB_URL, credentials: true });
await app.register(healthRoutes);
await app.register(webhookRoutes);

try {
  await app.listen({ port: env.API_PORT, host: '0.0.0.0' });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
