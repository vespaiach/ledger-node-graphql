import { Prisma, PrismaClient, Transaction } from '@prisma/client';
import faker from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  await prisma.reason.createMany({
    data: [
      { text: 'pay for food' },
      { text: 'pay for gifts' },
      { text: 'pay for health/medical' },
      { text: 'pay for home fixing' },
      { text: 'pay for personal' },
      { text: 'pay for transportation' },
      { text: 'pay for travel' },
      { text: 'pay for pets' },
      { text: 'pay for utilities' },
      { text: 'income from savings' },
      { text: 'income from paycheck' },
      { text: 'income from interest' },
      { text: 'income from bonus' },
      { text: 'other' },
    ],
  });

  const payReasonIds = await prisma.reason.findMany({
    where: {
      text: {
        startsWith: 'pay for',
      },
    },
    select: {
      id: true,
    },
  });

  const incomeReasonIds = await prisma.reason.findMany({
    where: {
      text: {
        startsWith: 'income from',
      },
    },
    select: {
      id: true,
    },
  });

  await Promise.all([
    createTransactions(payReasonIds, -1, 1000),
    createTransactions(incomeReasonIds, 1, 800),
  ]);
}

async function createTransactions(reasons: { id: number }[], factor: number, loop: number) {
  const fromDate = new Date();
  const toDate = new Date(fromDate);
  toDate.setMonth(-24);
  const transactions: Omit<Transaction, 'id'>[] = [];

  for (let i = 0; i < loop; i++) {
    const date = faker.date.between(fromDate.toISOString(), toDate.toISOString());
    const reasonInd = faker.datatype.number({ min: 0, max: reasons.length - 1 });

    transactions.push({
      amount: new Prisma.Decimal(factor * parseFloat(faker.finance.amount(1, 1000, 2))),
      date,
      note: faker.lorem.sentence(),
      reasonId: reasons[reasonInd].id,
      updatedAt: date,
    });
  }

  await prisma.transaction.createMany({ data: transactions });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
