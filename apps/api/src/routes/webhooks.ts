import type { FastifyPluginAsync } from 'fastify';
import { env } from '../env.js';

/**
 * Inbound webhooks. Both are stubs that verify auth and 200 — the handlers land in M1/M2.
 *
 *  POST /webhooks/helius  — Helius "enhanced transaction" webhook. We subscribe to the merchant
 *                           wallets; each tx is matched to an Invoice via the reference key.
 *  POST /webhooks/stripe  — checkout.session.completed → mark invoice PAID.
 */
export const webhookRoutes: FastifyPluginAsync = async (app) => {
  app.post('/webhooks/helius', async (req, reply) => {
    if (env.HELIUS_WEBHOOK_SECRET && req.headers.authorization !== env.HELIUS_WEBHOOK_SECRET) {
      return reply.code(401).send({ error: 'unauthorized' });
    }
    req.log.info({ n: Array.isArray(req.body) ? req.body.length : 1 }, 'helius webhook received');
    return reply.code(200).send({ received: true });
  });

  app.post('/webhooks/stripe', { config: { rawBody: true } }, async (req, reply) => {
    // TODO(M2): stripe().webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET)
    req.log.info('stripe webhook received');
    return reply.code(200).send({ received: true });
  });
};
