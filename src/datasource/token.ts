import { DataSource } from 'apollo-datasource';
import { PrismaClient, RevokedToken } from '@prisma/client';

export class TokenDS extends DataSource {
  dbClient: PrismaClient;

  constructor(dbClient: PrismaClient) {
    super();
    this.dbClient = dbClient;
  }

  public async revoke({ token, exp }: { exp: Date; token: string }): Promise<RevokedToken> {
    return this.dbClient.revokedToken.create({
      data: {
        token,
        exp,
      },
    });
  }

  public async isRevoke({ token }: { token: string }): Promise<boolean> {
    const tokenObj = await this.dbClient.revokedToken.findFirst({
      where: {
        token,
      },
    });

    return tokenObj === null;
  }

  /**
   * Delete records those have exp time in the past.
   */
  public async cleanUp(): Promise<void> {
    this.dbClient.revokedToken.deleteMany({
      where: {
        exp: {
          lt: new Date(),
        },
      },
    });
  }
}
