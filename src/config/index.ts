import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT,
  environment: process.env.ENVIRONMENT,
  api: {
    prefix: process.env.API_PREFIX,
  },
  db: {
    url: process.env.DB_URL,
    url_homolog: process.env.DB_URL_HOMOLOG,
  },
  session: {
    secret: process.env.JWT_SECRET,
  },
  users: {
    password_secret: process.env.PASSWORD_SECRET,
  },
};
