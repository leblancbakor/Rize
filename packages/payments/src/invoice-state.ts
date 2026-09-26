import type { InvoiceStatus } from '@rize/db';

/**
 * Invoice state machine. Every status change in the system must go through `assertTransition`
 * so an illegal jump (e.g. EXPIRED -> PAID) throws instead of silently corrupting data.
 *
 *   CREATED  -> AWAITING | EXPIRED
 *   AWAITING -> PAID | EXPIRED
 *   PAID     -> DELIVERED | REFUNDED
 *   DELIVERED-> REFUNDED
 *   EXPIRED, REFUNDED are terminal.
 */
const TRANSITIONS: Record<InvoiceStatus, readonly InvoiceStatus[]> = {
  CREATED: ['AWAITING', 'EXPIRED'],
  AWAITING: ['PAID', 'EXPIRED'],
  PAID: ['DELIVERED', 'REFUNDED'],
  DELIVERED: ['REFUNDED'],
  EXPIRED: [],
  REFUNDED: [],
};

export class InvalidTransitionError extends Error {
  constructor(
    public readonly from: InvoiceStatus,
    public readonly to: InvoiceStatus,
  ) {
    super(`Invalid invoice transition ${from} -> ${to}`);
    this.name = 'InvalidTransitionError';
  }
}

export function canTransition(from: InvoiceStatus, to: InvoiceStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

export function assertTransition(from: InvoiceStatus, to: InvoiceStatus): void {
  if (!canTransition(from, to)) throw new InvalidTransitionError(from, to);
}

export const TERMINAL_STATUSES: readonly InvoiceStatus[] = ['EXPIRED', 'REFUNDED'];
