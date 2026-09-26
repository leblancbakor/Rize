import Stripe from 'stripe';

let client: Stripe | undefined;

export function stripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    client = new Stripe(key); // pins the API version bundled with the installed SDK
  }
  return client;
}

export interface CardCheckoutParams {
  invoiceId: string;
  /** Merchant's Stripe Connect account (Merchant.stripeAccountId). */
  connectedAccountId: string;
  amountMinor: number;
  currency: string;
  productName: string;
  feeMinor: number;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Create a Stripe Checkout session on the merchant's connected account.
 * Funds settle to the merchant; Rize takes `feeMinor` as application_fee_amount.
 * Stripe is the regulated party — Rize never holds card funds (ADR-0002).
 */
export async function createCardCheckout(p: CardCheckoutParams) {
  return stripe().checkout.sessions.create(
    {
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: p.currency.toLowerCase(),
            unit_amount: p.amountMinor,
            product_data: { name: p.productName },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: { application_fee_amount: p.feeMinor },
      metadata: { invoiceId: p.invoiceId },
      success_url: p.successUrl,
      cancel_url: p.cancelUrl,
    },
    { stripeAccount: p.connectedAccountId },
  );
}
