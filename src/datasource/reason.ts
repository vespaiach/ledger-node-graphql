import { DataSource } from 'apollo-datasource';
import { PrismaClient } from '@prisma/client';

import { ReasonModel } from '@schema/types';
import {
  MutationCreateReasonArgs,
  MutationDeleteReasonArgs,
  MutationUpdateReasonArgs,
} from '@schema/types.generated';

export class ReasonDS extends DataSource {
  dbClient: PrismaClient;

  constructor(dbClient: PrismaClient) {
    super();
    this.dbClient = dbClient;
  }

  public getReasons(): Promise<ReasonModel[]> {
    return this.dbClient.reason.findMany({
      orderBy: [
        {
          text: 'asc',
        },
      ],
      select: {
        id: true,
        text: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Prisma return null if it can't find the record.
   */
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

  public createReason(args: MutationCreateReasonArgs): Promise<ReasonModel> {
    return this.dbClient.reason.create({
      data: {
        text: args.text,
        updatedAt: new Date(),
      },
    });
  }

  public updateReason(args: MutationUpdateReasonArgs): Promise<ReasonModel> {
    return this.dbClient.reason.update({
      data: {
        text: args.text ? args.text : undefined,
        updatedAt: new Date(),
      },
      where: {
        id: args.id,
      },
    });
  }

  public async deleteReason(args: MutationDeleteReasonArgs): Promise<void> {
    await this.dbClient.reason.delete({
      where: {
        id: args.id,
      },
    });
  }
}
