import { PrismaClient } from '@prisma/client';
import faker from '@faker-js/faker';
import bcrypt from 'bcryptjs';

import { TransactionDS } from '@datasource/transaction';
import { UserDS } from '@datasource/user';

const prisma = new PrismaClient();

async function main() {
  const payReasons = [
    { text: 'pay for food' },
    { text: 'pay for gifts' },
    { text: 'pay for health/medical' },
    { text: 'pay for home fixing' },
    { text: 'pay for personal' },
    { text: 'pay for transportation' },
    { text: 'pay for travel' },
    { text: 'pay for pets' },
    { text: 'pay for utilities' },
  ];
  const earnReasons = [
    { text: 'income from savings' },
    { text: 'income from paycheck' },
    { text: 'income from interest' },
    { text: 'income from bonus' },
    { text: 'other' },
  ];

  const tranDs = new TransactionDS(prisma);
  const userDs = new UserDS(prisma);

  let user = await userDs.getUserByUsername({ username: 'tester' });
  if (!user) {
    user = await userDs.create({
      username: 'tester',
      password: bcrypt.hashSync('12345', 10),
      email: 'tester@email.com',
    });
  }

  for (let i = 0; i < 80; i++) {
    const date = faker.date.between('2021-01-01T00:00:00.000Z', new Date().toISOString());
    const reasonInd = faker.datatype.number({ min: 0, max: payReasons.length - 1 });

    await tranDs.createTransaction(
      {
        amount: parseInt(faker.random.numeric(5)) * -1,
        date: date.toISOString(),
        note: faker.lorem.sentence(),
        reasons: [payReasons[reasonInd].text],
      },
      user.id
    );
  }

  for (let i = 0; i < 20; i++) {
    const date = faker.date.between('2021-01-01T00:00:00.000Z', new Date().toISOString());
    const reasonInd = faker.datatype.number({ min: 0, max: earnReasons.length - 1 });

    await tranDs.createTransaction(
      {
        amount: parseInt(faker.random.numeric(6)) * 1,
        date: date.toISOString(),
        note: faker.lorem.sentence(),
        reasons: [earnReasons[reasonInd].text],
      },
      user.id
    );
  }

  console.log(`Created 100 transactions for user: tester/12345`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
