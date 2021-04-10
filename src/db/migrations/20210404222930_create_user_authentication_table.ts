import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tb_user_authentication", (table: Knex.TableBuilder) => {
    table.increments("id").primary();
    table.integer("application_id").references("id").inTable("tb_application");
    table.json("token_content");
    table.string("email", 150).notNullable().unique();
    table.string("password", 255).notNullable();
    table.string("phone_number", 30).notNullable();
    table.string("code", 6).notNullable();
    table.boolean("is_verified").notNullable().defaultTo(false);
    table.timestamp("last_login").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
    table.unique(["application_id", "email"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("tb_user_authentication");
}
