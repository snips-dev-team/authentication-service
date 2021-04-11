import dotenv from "dotenv";

dotenv.config();

export default {
  application: {
    port: process.env.PORT!,
  },
  api: {
    prefix: process.env.API_PREFIX!,
  },
  db: {
    url: process.env.DB_URL!,
    url_homolog: process.env.DB_URL_HOMOLOG!,
  },
  encrypt: {
    // Encrypt email from client email
    fields: process.env.ENCRYPT_SECRET!,
    // Encrypt jwt tokens
    jwt: process.env.ENCRYPT_JWT_SECRET!,
  },
  email: {
    from: process.env.EMAIL_FROM,
    password: process.env.EMAIL_PASSWORD,
  },
};
