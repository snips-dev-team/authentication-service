import { Container } from "typedi";
import type { Knex } from "knex";

export default class CrudService {
  knex: Knex;
  tableName: string;

  constructor(tableName: string) {
    this.knex = Container.get("knex");
    this.tableName = tableName;
  }

  async get(filterParams: Record<string, unknown>): Promise<Record<string, unknown>> {
    return await this.knex(this.tableName).where(filterParams).select().first();
  }
  async list(filterParams?: Record<string, unknown>): Promise<Record<string, unknown>[]> {
    return await this.knex(this.tableName)
      .select("*")
      .where(filterParams || {});
  }
  async create(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    return await this.knex(this.tableName).insert(data).returning("id");
  }
  async remove(id: number): Promise<Record<string, unknown>> {
    return await this.knex(this.tableName).where({ id }).select().delete();
  }
  async count(): Promise<Record<string, unknown>> {
    return await this.knex(this.tableName).count();
  }
  async edit(data: Record<string, unknown>, id: number): Promise<Record<string, unknown>> {
    return await this.knex(this.tableName).where({ id }).select().update(data);
  }
}
