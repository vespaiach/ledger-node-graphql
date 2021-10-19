-- CreateEnum
CREATE TYPE "GroupBy" AS ENUM ('Month', 'Reason');

-- CreateTable
CREATE TABLE "FilterInput" (
    "id" SERIAL NOT NULL,
    "amountFrom" DECIMAL(15,2),
    "amountTo" DECIMAL(15,2),
    "dateFrom" TIMESTAMP(3),
    "dateTo" TIMESTAMP(3),
    "reasonId" INTEGER,
    "groupBy" "GroupBy" DEFAULT E'Month',
    "active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FilterInput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilterResult" (
    "id" SERIAL NOT NULL,
    "filterInputId" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "groupBy" JSONB,
    "transactionId" INTEGER NOT NULL,

    CONSTRAINT "FilterResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FilterResult" ADD CONSTRAINT "FilterResult_filterInputId_fkey" FOREIGN KEY ("filterInputId") REFERENCES "FilterInput"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilterResult" ADD CONSTRAINT "FilterResult_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
