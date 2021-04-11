import knex from "knex";
import { Container } from "typedi";
import config from "../config";

const { db } = config;

function dbLoader(): void {
  console.log("Connecting in database");
  const dbInstance = knex(db.url); // Production
  Container.set("knex", dbInstance);
}

export default dbLoader;
