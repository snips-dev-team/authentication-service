import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tb_email_log", (table: Knex.TableBuilder) => {
    table.increments("id").primary();
    table.integer("email");
    table.string("template", 20);
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("tb_email_log");
}
