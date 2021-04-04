import knex from "knex";
import { Container } from "typedi";
import dbConfig from "../config/db.js";

function dbLoader(): void {
  console.log("Connecting in database");
  const dbInstance = knex(dbConfig); // Production
  Container.set("knex", dbInstance);
}

export default dbLoader;
