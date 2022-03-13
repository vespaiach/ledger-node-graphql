import { DataSource } from 'apollo-datasource';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { DailyBalanceModel } from '@schema/types';

type DailySpendCreate = {
  date: string;
  spending: Decimal;
  earning: Decimal;
};

export class DailySpendDS extends DataSource {
  dbClient: PrismaClient;

  constructor(dbClient: PrismaClient) {
    super();
    this.dbClient = dbClient;
  }

  public async read(): Promise<DailyBalanceModel[]> {
    return await this.dbClient.dailySpend.findMany({});
  }

  public async update(): Promise<void> {
    const spendings = await this.dbClient.transaction.groupBy({
      where: {
        amount: {
          lte: 0,
        },
      },
      by: ['date'],
      _sum: {
        amount: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const earnings = await this.dbClient.transaction.groupBy({
      where: {
        amount: {
          gte: 0,
        },
      },
      by: ['date'],
      _sum: {
        amount: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const minDate = spendings[0].date > earnings[0].date ? earnings[0].date : spendings[0].date;
    const maxDate =
      spendings[spendings.length - 1].date > earnings[earnings.length - 1].date
        ? earnings[spendings.length - 1].date
        : spendings[spendings.length - 1].date;

    const trans: DailySpendCreate[] = [];

    let eInd = 0;
    let sInd = 0;

    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      const t: Record<string, unknown> = { date: d.toISOString() };

      while (spendings[sInd].date < d && sInd < spendings.length - 1) sInd++;

      if (spendings[sInd].date.getTime() === d.getTime()) {
        t.spending = spendings[sInd]._sum.amount ?? new Decimal(0);
      }

      while (earnings[eInd].date < d && eInd < earnings.length - 1) eInd++;

      if (earnings[eInd].date.getTime() === d.getTime()) {
        t.earning = earnings[eInd]._sum.amount ?? new Decimal(0);
      }

      if (t.spending !== undefined || t.earning !== undefined) {
        t.spending = t.spending || 0;
        t.earning = t.earning || 0;
        trans.push(t as DailySpendCreate);
      }
    }

    await this.dbClient.$transaction([
      this.dbClient.dailySpend.deleteMany(),
      this.dbClient.dailySpend.createMany({
        data: trans,
      }),
    ]);
  }
}
