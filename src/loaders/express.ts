import cors from "cors";
import { json } from "express";
import routes from "../api";
import config from "../config";

function express(app: any): void {
  app.use(cors());
  app.use(json());
  app.use(config.api.prefix, routes());
}

export default express;
