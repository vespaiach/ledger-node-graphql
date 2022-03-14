/*
  Warnings:

  - Added the required column `email` to the `token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "token" ADD COLUMN     "email" VARCHAR(128) NOT NULL;
