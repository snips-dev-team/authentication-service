import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    "tb_application",
    (table: Knex.TableBuilder) => {
      table.increments("id").primary();
      table.string("name", 30).notNullable().unique();
      table.string("token", 30).notNullable().unique();
      table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
      table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("tb_application");
}
