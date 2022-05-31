import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { Config } from 'src/config';

export function hashPassword(pw: string): string {
  return bcrypt.hashSync(pw, 10);
}

export function comparePassword(plainPassword: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hash);
}

export function issueToken({ user, appConfig }: { user: User; appConfig: Config }): string {
  const expiresIn =
    Math.round(Date.now() / 1000) + appConfig.get('signin_token_available_time') * 60;

  const token = jwt.sign(
    { email: user.email, exp: expiresIn, aud: String(user.id) },
    appConfig.get('signin_jwt_secret'),
    {
      algorithm: appConfig.get('signin_jwt_algorithm'),
    }
  );

  return token;
}
