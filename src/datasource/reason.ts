import { DataSource } from 'apollo-datasource';
import { PrismaClient } from '@prisma/client';
import LRU from 'lru-cache';

import { ReasonModel } from '@schema/types';

export class ReasonDS extends DataSource {
  dbClient: PrismaClient;
  cache: LRU<string, ReasonModel>;

  constructor(dbClient: PrismaClient) {
    super();
    this.dbClient = dbClient;
    this.cache = new LRU({ max: 50 });
  }

  public async _get(text: string): Promise<ReasonModel | undefined> {
    if (this.cache.has(text)) return this.cache.get(text);

    const reason = await this.dbClient.reason.findFirst({ where: { text } });

    if (reason) {
      this.cache.set(reason.text, reason);
      return reason;
    }

    return undefined;
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
        createdAt: true,
      },
    });
  }

  public getReasonsByTransactionId({
    transactionId,
  }: {
    transactionId: number;
  }): Promise<ReasonModel[]> {
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
        createdAt: true,
      },
      where: {
        transactions: {
          some: {
            transactionId,
          },
        },
      },
    });
  }

  public async getReasonById(id: number): Promise<ReasonModel | null> {
    return this.dbClient.reason.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        text: true,
        updatedAt: true,
        createdAt: true,
      },
    });
  }

  public getReasonByText(text: string): Promise<ReasonModel | undefined> {
    return this._get(text);
  }

  public async getOrCreateReasons(texts: string[]): Promise<ReasonModel[]> {
    const result: ReasonModel[] = [];

    for (const text of texts) {
      const cachedReason = await this._get(text);
      if (cachedReason) {
        result.push(cachedReason);
      } else {
        const dt = new Date();
        result.push(
          await this.dbClient.reason.create({
            data: {
              text,
              createdAt: dt,
              updatedAt: dt,
            },
          })
        );
      }
    }

    return result;
  }
}
