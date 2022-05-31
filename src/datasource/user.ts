import { DataSource } from 'apollo-datasource';
import { PrismaClient, User } from '@prisma/client';

import { MutationCreateUserArgs, MutationUpdateUserArgs } from '@schema/types.generated';

export class UserDS extends DataSource {
  dbClient: PrismaClient;

  constructor(dbClient: PrismaClient) {
    super();
    this.dbClient = dbClient;
  }

  public async getUserByUsername({ username }: { username: string }): Promise<User | null> {
    return this.dbClient.user.findFirst({
      where: { username },
    });
  }

  public async create({
    username,
    email,
    password,
    firstName,
    lastName,
  }: MutationCreateUserArgs): Promise<User> {
    const dt = new Date();

    return this.dbClient.user.create({
      data: {
        email,
        username,
        password,
        lastName,
        firstName,
        updatedAt: dt,
        createdAt: dt,
      },
    });
  }

  public async update({
    id,
    username,
    email,
    password,
    firstName,
    lastName,
    isActive,
  }: MutationUpdateUserArgs & { id: number }): Promise<User> {
    return this.dbClient.user.update({
      where: {
        id,
      },
      data: {
        username: username || undefined,
        email: email || undefined,
        password: password || undefined,
        firstName,
        lastName,
        isActive: isActive === null ? undefined : isActive,
        updatedAt: new Date(),
      },
    });
  }
}
