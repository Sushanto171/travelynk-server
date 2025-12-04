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
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  subscription: {
    WEEKLY_PRICE: process.env.WEEKLY_PRICE,
    MONTHLY_PRICE: process.env.MONTHLY_PRICE,
    YEARLY_PRICE: process.env.YEARLY_PRICE,
  },
  nodemailer: {
    APP_PASS: process.env.APP_PASS,
    APP_USER: process.env.APP_USER,
  },
  redis: {
    PASS: process.env.PASS,
    HOST: process.env.HOST,
    REDIS_PORT: process.env.REDIS_PORT,
  },
  FRONTEND_URL: process.env.FRONTEND_URL,
  brevo: {
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL,
    BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME,
  }
};