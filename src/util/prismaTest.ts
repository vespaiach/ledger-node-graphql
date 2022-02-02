#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

prisma.reason
  .findUnique({
    where: {
      id: -1,
    },
    select: {
      id: true,
      text: true,
      updatedAt: true,
    },
  })
  .then((a) => console.log(a))
  .catch((a) => console.log(a));
