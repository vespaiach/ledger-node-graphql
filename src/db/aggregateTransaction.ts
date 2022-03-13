import { PrismaClient } from '@prisma/client';

import { DailySpend } from '../datasource/dailySpend';

const prisma = new PrismaClient();

async function main() {
  await new DailySpend(prisma).update();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
