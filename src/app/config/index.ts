import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV as "development" | "production",
  port: process.env.PORT,
  jwt: {
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  bcrypt: {
    SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
  },
  seedAdmin: {
    SEED_ADMIN_EMAIL: process.env.SEED_ADMIN_EMAIL,
    SEED_ADMIN_NAME: process.env.SEED_ADMIN_NAME,
    SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD
  },
  cloudinary: {
    NAME: process.env.NAME,
    API_KEY: process.env.API_KEY,
    API_SECRET: process.env.API_SECRET,
  },
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  subscription: {
    WEEKLY_PRICE: process.env.WEEKLY_PRICE,
    MONTHLY_PRICE: process.env.MONTHLY_PRICE,
    YEARLY_PRICE: process.env.YEARLY_PRICE,
  }
};