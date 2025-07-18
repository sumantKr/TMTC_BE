import dotenv from "dotenv";
import { cleanEnv, port, str } from "envalid";

dotenv.config();
const env = cleanEnv(process.env, {
  API_VERSION: str(),
  PORT: port(),
  DB_PATH: str(),
  JWT_SECRET: str(),
  NODE_ENV: str(),
  CORS_ORIGIN: str(),
});

export const {
  API_VERSION,
  DB_PATH,
  JWT_SECRET,
  PORT,
  isDevelopment,
  isProduction,
  CORS_ORIGIN,
} = env;
