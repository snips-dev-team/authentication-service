import config from "./index";

export default {
  client: "pg",
  connection:
    config.environment === "production" ? config.db.url : config.db.url_homolog,
  migrations: {
    directory: "../db/migrations",
    tableName: "tb_migrations",
  },
};
