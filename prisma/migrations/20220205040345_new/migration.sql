-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_reason_id_fkey";

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_reason_id_fkey" FOREIGN KEY ("reason_id") REFERENCES "reasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
