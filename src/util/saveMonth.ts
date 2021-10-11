import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRaw`
    update public."Transaction" 
    set month=to_timestamp(concat(to_char(date, 'yyyymm'), '01 000000'), 'yyyymmdd hh24miss')
  `;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
