import * as bcrypt from 'bcrypt';

export async function encryptPassword(password: string) {
  const SALT = bcrypt.genSaltSync();

  return bcrypt.hash(password, SALT);
}

export async function compareHash(
  hashedString: string,
  receivedString: string,
) {
  return await bcrypt.compare(receivedString, hashedString);
}
