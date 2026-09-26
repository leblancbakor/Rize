export * from './invoice-state.ts';
export * from './solana.ts';
export * from './stripe.ts';

/** Compute the platform fee for an amount, in the same minor units. */
export function platformFee(amountMinor: number, feeBps: number): number {
  return Math.floor((amountMinor * feeBps) / 10_000);
}
