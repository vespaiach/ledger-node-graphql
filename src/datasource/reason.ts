import { DataSource } from 'apollo-datasource';

import { PrismaClient } from '@prisma/client';
import { ReasonModel } from 'src/schema/types';

export class ReasonDS extends DataSource {
  private dbClient: PrismaClient;

  constructor({ dbClient }: { dbClient: PrismaClient }) {
    super();
    this.dbClient = dbClient;
  }

  public async getReasons(): Promise<ReasonModel[]> {
    return await this.dbClient.reason.findMany({
      orderBy: [
        {
          updatedAt: 'desc',
        },
      ],
      select: {
        id: true,
        text: true,
        updatedAt: true,
      },
    });
  }
}
