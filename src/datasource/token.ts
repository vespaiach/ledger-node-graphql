import { DataSource } from 'apollo-datasource';
import { PrismaClient, RevokedToken } from '@prisma/client';
import LRU from 'lru-cache';

export class TokenDS extends DataSource {
  dbClient: PrismaClient;
  cache: LRU<string, boolean>;

  constructor(dbClient: PrismaClient) {
    super();
    this.dbClient = dbClient;
    // Revoking list caching
    this.cache = new LRU({ max: 100 });
  }

  public async revoke({ token, exp }: { exp: Date; token: string }): Promise<RevokedToken> {
    const revoked = await this.dbClient.revokedToken.create({
      data: {
        token,
        exp,
      },
    });
    this.cache.set(token, true);

    return revoked;
  }

  public _get({ token }: { token: string }): Promise<RevokedToken | null> {
    return this.dbClient.revokedToken.findFirst({
      where: {
        token,
      },
    });
  }

  public async isRevoke({ token }: { token: string }): Promise<boolean> {
    if (this.cache.has(token)) return this.cache.get(token) as boolean;

    const tokenObj = await this._get({ token });
    this.cache.set(token, tokenObj !== null);

    return this.cache.get(token) as boolean;
  }

  /**
   * Delete records those have exp time in the past.
   */
  public async cleanUp(): Promise<void> {
    this.cache.clear();
    this.dbClient.revokedToken.deleteMany({
      where: {
        exp: {
          lt: new Date(),
        },
      },
    });
  }
}
