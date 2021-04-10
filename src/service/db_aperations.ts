import { Container } from "typedi";
import { Knex } from "knex";

const tb_auth = "tb_user_authentication";
const tb_application = "tb_application";
const tb_email_log = "tb_email_log";
const knex: Knex = Container.get("knex");

async function create_user(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  return await knex(tb_auth).insert(data);
}

async function register_application(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  return await knex(tb_application).insert(data);
}

async function login(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const user = knex("tb_user_authentication").select().where({ email: data.email }).first();
  if (user && data && PasswordUtilities.verify(data.password, user.password)) {
    const token = jwt.sign({ id: user.id }, session.secret);
    return token;
  } else {
    return false;
  }
}

export { create_user, register_application };
