/*
  Warnings:

  - The primary key for the `daily_spends` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `date` on the `daily_spends` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(27)`.

*/
-- AlterTable
ALTER TABLE "daily_spends" DROP CONSTRAINT "daily_spends_pkey",
ALTER COLUMN "date" SET DATA TYPE VARCHAR(27),
ADD CONSTRAINT "daily_spends_pkey" PRIMARY KEY ("date");

-- CreateTable
CREATE TABLE "token" (
    "key" VARCHAR(36) NOT NULL,
    "token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoke" BOOLEAN NOT NULL DEFAULT false,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "token_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "token_token_key" ON "token"("token");
