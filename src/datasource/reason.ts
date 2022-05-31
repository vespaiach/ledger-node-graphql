import { DataSource } from 'apollo-datasource';
import { PrismaClient, Reason, TransactionsReasons } from '@prisma/client';
import LRU from 'lru-cache';

export class ReasonDS extends DataSource {
  dbClient: PrismaClient;
  cacheByText: LRU<string, Reason>;
  cacheById: LRU<number, Reason>;

  constructor(dbClient: PrismaClient) {
    super();
    this.dbClient = dbClient;
    this.cacheByText = new LRU({ max: 50 });
    this.cacheById = new LRU({ max: 50 });
  }

  public async _get(text: string): Promise<Reason | undefined> {
    if (this.cacheByText.has(text)) return this.cacheByText.get(text);

    const reason = await this.dbClient.reason.findFirst({ where: { text } });

    if (reason) {
      this.cacheByText.set(reason.text, reason);
      return reason;
    }

    return undefined;
  }

  public getReasons(): Promise<Reason[]> {
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

  /**
   * Find the reason why to use findUnique query from here:
   * https://www.prisma.io/docs/guides/performance-and-optimization/query-optimization-performance 
   */
  public async getReasonsByTransactionId({
    transactionId,
  }: {
    transactionId: number;
  }): Promise<Reason[]> {
    return (
      await this.dbClient.transaction
        .findUnique({
          where: {
            id: transactionId,
          },
        })
        .reasons({ select: { reason: true } })
    ).map((r) => r.reason);
  }

  public async getReasonById(id: number): Promise<Reason | null> {
    if (!this.cacheById.has(id)) {
      const reason = await this.dbClient.reason.findFirst({
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
      if (reason) {
        this.cacheById.set(reason.id, reason);
      }
    }

    return this.cacheById.get(id) || null;
  }

  public getReasonByText(text: string): Promise<Reason | undefined> {
    return this._get(text);
  }

  public async getOrCreateReasons(texts: string[]): Promise<Reason[]> {
    const result: Reason[] = [];

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
