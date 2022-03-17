import { DataSource } from 'apollo-datasource';
import { PrismaClient, Token } from '@prisma/client';

export class TokenDS extends DataSource {
  dbClient: PrismaClient;

  constructor(dbClient: PrismaClient) {
    super();
    this.dbClient = dbClient;
  }

  public async getRecordByKey({ key }: { key: string }): Promise<Token | null> {
    return this.dbClient.token.findFirst({
      where: { key },
    });
  }

  public async getRecordByToken({ token }: { token: string }): Promise<Token | null> {
    return this.dbClient.token.findFirst({
      where: { token },
    });
  }

  public async getLatestActiveRecord({
    email,
    lastSeen,
  }: {
    email: string;
    lastSeen: Date;
  }): Promise<Token | null> {
    console.log(email, lastSeen);
    return this.dbClient.token.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        email,
        token: null,
        createdAt: {
          gt: lastSeen,
        },
      },
    });
  }

  public async create({ email, key }: { key: string; email: string }): Promise<void> {
    await this.dbClient.token.create({
      data: {
        email,
        key,
        createdAt: new Date(),
      },
    });
  }

  public async revoke({ token }: { token: string }): Promise<void> {
    await this.dbClient.token.update({
      where: {
        token,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  public async update(args: { revokedAt?: Date; key: string; token?: string }): Promise<void> {
    await this.dbClient.token.update({
      where: {
        key: args.key,
      },
      data: {
        token: args.token ? args.token : undefined,
        revokedAt: args.revokedAt ? args.revokedAt : undefined,
      },
    });
  }

  public async getRevokeTokens(): Promise<{ token:string}[]> {
    return (await this.dbClient.token.findMany({
      orderBy: { createdAt: 'desc' },
      where: { NOT: [{ token: null }, { revokedAt: null }] },
      select: { token: true },
    })) as { token: string }[];
  }
}
