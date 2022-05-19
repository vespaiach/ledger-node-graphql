import { DataSource } from 'apollo-datasource';
import { PrismaClient } from '@prisma/client';

import { MutationCreateUserArgs, MutationUpdateUserArgs } from '@schema/types.generated';
import { UserModel } from '@schema/types';

export class UserDS extends DataSource {
  dbClient: PrismaClient;

  constructor(dbClient: PrismaClient) {
    super();
    this.dbClient = dbClient;
  }

  public async getUserByUsername({ username }: { username: string }): Promise<UserModel | null> {
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
  }: MutationCreateUserArgs): Promise<UserModel> {
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
  }: MutationUpdateUserArgs & { id: number }): Promise<UserModel> {
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
