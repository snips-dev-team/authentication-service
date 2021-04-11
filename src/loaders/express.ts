import cors from "cors";
import { json, Express } from "express";
import routes from "../api";
import config from "../config";

function express(app: Express): void {
  console.log("Configurating express");
  app.use(cors());
  app.use(json());
  app.use(config.api.prefix, routes());
}

export default express;
