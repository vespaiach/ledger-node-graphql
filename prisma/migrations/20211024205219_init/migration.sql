-- CreateEnum
CREATE TYPE "group_by" AS ENUM ('Month', 'Reason');

-- CreateTable
CREATE TABLE "reasons" (
    "id" SERIAL NOT NULL,
    "text" VARCHAR(255) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "month" TIMESTAMP(3),
    "description" VARCHAR(511),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason_id" INTEGER NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reasons_text_key" ON "reasons"("text");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_reason_id_fkey" FOREIGN KEY ("reason_id") REFERENCES "reasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
