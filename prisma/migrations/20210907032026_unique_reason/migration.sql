/*
  Warnings:

  - A unique constraint covering the columns `[text]` on the table `Reason` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reason.text_unique" ON "Reason"("text");
