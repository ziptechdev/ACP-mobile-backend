import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, '../../.env'),
});

// app
export const env = process.env.NODE_ENV as string;
export const appEnv = process.env.APP_ENV as string;
export const port = process.env.PORT as string;

// Database
// Docker has problems with this format so it is commented out
//export const dbUri = `postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}
//@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}` as string;
export const testDbUri = process.env.TEST_DB_URL as string;

export const dbUri = process.env.DB_URL as string;

// Cors
export const corsWhitelist = (process.env.CORS_WHITELIST as string)?.split(' ');

// Mail
export const mailConfig = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
};

export const fromEmailAddress = process.env.MAIL_FROM_ADDRESS;
