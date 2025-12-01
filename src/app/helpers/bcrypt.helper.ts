import bcrypt from 'bcryptjs';
import config from '../../config';

const generateHashPassword = async (password: string) => {
  const salt = await bcrypt.hash(password, Number(config.bcrypt.SALT_ROUNDS));
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
}

export const BcryptHelper = {
  generateHashPassword,
  comparePassword,
}