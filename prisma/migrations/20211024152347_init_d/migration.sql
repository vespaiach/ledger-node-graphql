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

-- CreateTable
CREATE TABLE "filter_inputs" (
    "id" SERIAL NOT NULL,
    "amount_from" DECIMAL(15,2),
    "amount_to" DECIMAL(15,2),
    "date_from" TIMESTAMP(3),
    "date_to" TIMESTAMP(3),
    "reason_id" INTEGER,
    "group_by" "group_by" DEFAULT E'Month',
    "active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "filter_inputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filter_results" (
    "id" SERIAL NOT NULL,
    "filter_input_id" INTEGER NOT NULL,
    "group_by" JSONB,
    "transaction_id" INTEGER NOT NULL,

    CONSTRAINT "filter_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reasons_text_key" ON "reasons"("text");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_reason_id_fkey" FOREIGN KEY ("reason_id") REFERENCES "reasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filter_results" ADD CONSTRAINT "filter_results_filter_input_id_fkey" FOREIGN KEY ("filter_input_id") REFERENCES "filter_inputs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filter_results" ADD CONSTRAINT "filter_results_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
