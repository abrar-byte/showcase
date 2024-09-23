/*
  Warnings:

  - You are about to drop the column `invoice` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `payment_at` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `payment_id` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order" DROP COLUMN "invoice",
DROP COLUMN "payment_at",
DROP COLUMN "payment_id",
ADD COLUMN     "car_name" TEXT,
ADD COLUMN     "cust_address" TEXT,
ADD COLUMN     "cust_city" TEXT,
ADD COLUMN     "cust_name" TEXT,
ADD COLUMN     "cust_phone" TEXT,
ADD COLUMN     "paid_at" TIMESTAMP(3),
ADD COLUMN     "s_customer_id" TEXT,
ADD COLUMN     "s_hosted_invoice_url" TEXT,
ADD COLUMN     "s_invoice_id" TEXT,
ADD COLUMN     "s_payment_intent_id" TEXT,
ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'CHECKOUT';
