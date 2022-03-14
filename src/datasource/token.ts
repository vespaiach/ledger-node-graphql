import { DataSource } from 'apollo-datasource';
import { PrismaClient, Token } from '@prisma/client';

export class TokenDS extends DataSource {
  dbClient: PrismaClient;

  constructor(dbClient: PrismaClient) {
    super();
    this.dbClient = dbClient;
  }

  public async getLatestActiveRecord({
    email,
    lastSeen,
  }: {
    email: string;
    lastSeen: Date;
  }): Promise<Token | null> {
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

  public async update(args: { revoke?: boolean; key: string; token?: string }): Promise<void> {
    await this.dbClient.token.update({
      where: {
        key: args.key,
      },
      data: {
        token: args.token ? args.token : undefined,
        revoke: typeof args.revoke === 'boolean' ? args.revoke : undefined,
        revokedAt: typeof args.revoke === 'boolean' ? new Date() : undefined,
      },
    });
  }

  public async getRevokeTokens(): Promise<string[]> {
    return (
      await this.dbClient.token.findMany({
        where: {
          revoke: true,
          NOT: [{ token: null }],
        },
        select: {
          token: true,
        },
      })
    ).map((t) => t.token) as string[];
  }
}
