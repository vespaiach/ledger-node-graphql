-- DropEnum
DROP TYPE "group_by";

-- CreateTable
CREATE TABLE "daily_spends" (
    "date" TEXT NOT NULL,
    "spending" DECIMAL(15,2) NOT NULL,
    "earning" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "daily_spends_pkey" PRIMARY KEY ("date")
);
