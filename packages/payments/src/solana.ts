import { Keypair, PublicKey } from '@solana/web3.js';
import { encodeURL } from '@solana/pay';
import BigNumber from 'bignumber.js';

/** Mainnet USDC mint. Devnet uses a different mint — read from config in the real implementation. */
export const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
export const USDC_DECIMALS = 6;

export interface SolanaInvoiceParams {
  /** Merchant wallet (from Merchant.solanaWallet). */
  recipient: PublicKey;
  /** Amount in minor units of the asset (USDC micro-units, or lamports for SOL). */
  amountMinor: bigint;
  /** Undefined = native SOL. */
  splToken?: PublicKey;
  label: string;
  message: string;
  /** Short memo shown in wallet; keep it human-readable, e.g. "Rize #abc123". */
  memo?: string;
}

export interface SolanaInvoice {
  /** Unique per-invoice reference key. Stored on Invoice.solanaReference; used to find the tx. */
  reference: PublicKey;
  /** solana:<recipient>?amount=...&reference=...  — encode as QR or deep-link. */
  url: URL;
}

/**
 * Build a Solana Pay transfer request for an invoice.
 *
 * Non-custodial: funds go straight to `recipient`. The `reference` key is a throwaway public key
 * included as a read-only account in the transfer instruction, which lets us find the transaction
 * with getSignaturesForAddress(reference) without ever holding keys.
 *
 * Platform fee: the transfer-request flavour of Solana Pay supports a single recipient. To take a
 * fee atomically, ADR-0003 chooses the *transaction request* flavour (wallet POSTs to our API, we
 * return a tx with two transfer instructions: merchant + Rize fee). This helper is the simple
 * transfer-request version used for the first milestone; swap to the transaction-request builder
 * once the API endpoint exists.
 */
export function buildSolanaInvoice(params: SolanaInvoiceParams): SolanaInvoice {
  const reference = Keypair.generate().publicKey;
  const decimals = params.splToken ? USDC_DECIMALS : 9;
  const amount = new BigNumber(params.amountMinor.toString()).shiftedBy(-decimals);

  const url = encodeURL({
    recipient: params.recipient,
    amount,
    reference,
    label: params.label,
    message: params.message,
    ...(params.splToken ? { splToken: params.splToken } : {}),
    ...(params.memo ? { memo: params.memo } : {}),
  });

  return { reference, url };
}
