import bcrypt from 'bcryptjs';

export function hashPassword(pw: string): string {
  return bcrypt.hashSync(pw, 10);
}

export function comparePassword(plainPassword: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hash);
}
