-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "payment_status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID';
