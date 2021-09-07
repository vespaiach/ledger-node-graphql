import { DataSource } from 'apollo-datasource';

import { PrismaClient } from '@prisma/client';
import { ReasonModel } from 'src/schema/types';

export class ReasonDS extends DataSource {
  private dbClient: PrismaClient;

  constructor({ dbClient }: { dbClient: PrismaClient }) {
    super();
    this.dbClient = dbClient;
  }

  public getReasons(): Promise<ReasonModel[]> {
    return this.dbClient.reason.findMany({
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

  public getReasonById(id: number): Promise<ReasonModel | null> {
    return this.dbClient.reason.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        text: true,
        updatedAt: true,
      },
    });
  }

  public getReasonByText(text: string): Promise<ReasonModel | null> {
    return this.dbClient.reason.findUnique({
      where: {
        text,
      },
      select: {
        id: true,
        text: true,
        updatedAt: true,
      },
    });
  }

  public addReason(text: string): Promise<ReasonModel> {
    return this.dbClient.reason.create({
      select: {
        id: true,
        text: true,
        updatedAt: true,
      },
      data: {
        text,
        updatedAt: new Date(),
      },
    });
  }
}
