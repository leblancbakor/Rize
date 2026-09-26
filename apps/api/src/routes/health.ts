import type { FastifyPluginAsync } from 'fastify';
import { prisma } from '@rize/db';

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get('/health', async () => {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true, service: 'rize-api', time: new Date().toISOString() };
  });
};
