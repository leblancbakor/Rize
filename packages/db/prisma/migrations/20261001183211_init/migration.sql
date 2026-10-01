-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');

-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('ROLE', 'MESSAGE', 'WEBHOOK');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('SOLANA_USDC', 'SOLANA_SOL', 'CARD');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('CREATED', 'AWAITING', 'PAID', 'DELIVERED', 'EXPIRED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('SERVER_INSTALLED', 'SERVER_UNINSTALLED', 'PRODUCT_CREATED', 'INVOICE_CREATED', 'INVOICE_AWAITING', 'INVOICE_PAID', 'INVOICE_DELIVERED', 'INVOICE_EXPIRED', 'INVOICE_REFUNDED', 'ABANDON_DM_SENT', 'ABANDON_DM_CONVERTED');

-- CreateTable
CREATE TABLE "Server" (
    "id" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uninstalledAt" TIMESTAMP(3),

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Merchant" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "solanaWallet" TEXT,
    "stripeAccountId" TEXT,
    "stripeOnboarded" BOOLEAN NOT NULL DEFAULT false,
    "acceptSolanaUsdc" BOOLEAN NOT NULL DEFAULT true,
    "acceptSolanaSol" BOOLEAN NOT NULL DEFAULT false,
    "acceptCard" BOOLEAN NOT NULL DEFAULT false,
    "abandonDmEnabled" BOOLEAN NOT NULL DEFAULT true,
    "abandonDiscountBps" INTEGER,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "stock" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "delivery" "DeliveryType" NOT NULL,
    "deliveryPayload" JSONB,
    "panelChannelId" TEXT,
    "panelMessageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "buyerDiscordId" TEXT NOT NULL,
    "buyerLocale" TEXT NOT NULL DEFAULT 'en',
    "method" "PaymentMethod" NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'CREATED',
    "amountMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "feeMinor" INTEGER NOT NULL DEFAULT 0,
    "discountId" TEXT,
    "solanaReference" TEXT,
    "solanaTxSig" TEXT,
    "stripeCheckoutSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "checkoutMessageId" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discount" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "bps" INTEGER NOT NULL,
    "maxUses" INTEGER,
    "uses" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "automatic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "serverId" TEXT,
    "invoiceId" TEXT,
    "type" "EventType" NOT NULL,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Server_discordId_key" ON "Server"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_serverId_key" ON "Merchant"("serverId");

-- CreateIndex
CREATE INDEX "Product_serverId_active_idx" ON "Product"("serverId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_solanaReference_key" ON "Invoice"("solanaReference");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_solanaTxSig_key" ON "Invoice"("solanaTxSig");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_stripeCheckoutSessionId_key" ON "Invoice"("stripeCheckoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_stripePaymentIntentId_key" ON "Invoice"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "Invoice_serverId_status_idx" ON "Invoice"("serverId", "status");

-- CreateIndex
CREATE INDEX "Invoice_buyerDiscordId_idx" ON "Invoice"("buyerDiscordId");

-- CreateIndex
CREATE INDEX "Invoice_status_expiresAt_idx" ON "Invoice"("status", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Discount_serverId_code_key" ON "Discount"("serverId", "code");

-- CreateIndex
CREATE INDEX "Event_type_createdAt_idx" ON "Event"("type", "createdAt");

-- CreateIndex
CREATE INDEX "Event_serverId_createdAt_idx" ON "Event"("serverId", "createdAt");

-- AddForeignKey
ALTER TABLE "Merchant" ADD CONSTRAINT "Merchant_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "Discount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
