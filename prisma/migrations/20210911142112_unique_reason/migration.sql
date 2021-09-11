-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_reasonId_fkey";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_reasonId_fkey" FOREIGN KEY ("reasonId") REFERENCES "Reason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Reason.text_unique" RENAME TO "Reason_text_key";
