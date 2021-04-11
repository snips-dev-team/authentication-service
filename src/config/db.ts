import config from "../config";

const { db } = config;

export default {
  client: "pg",
  connection: db.url,
  migrations: {
    directory: "../db/migrations",
    tableName: "tb_migrations",
  },
};
