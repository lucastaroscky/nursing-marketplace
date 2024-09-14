import * as bcrypt from 'bcrypt';

export async function encryptPassword(password: string) {
  const SALT = bcrypt.genSaltSync();

  return bcrypt.hash(password, SALT);
}

export async function comparePasswords(
  hashedPassword: string,
  password: string,
) {
  return bcrypt.compare(password, hashedPassword);
}
