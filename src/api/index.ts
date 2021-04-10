import { Router, Request, Response } from "express";
import { getData, getParam, sendDbResult } from "./utils/request_response";
import { create_user, register_application } from "../service/db_aperations";

function routes(): any {
  const app = Router();
  return app;
}

export default routes;

function createUser(app: Router) {
  app.post("/create_user", (req: Request, res: Response) => {
    const data = getData(req, res);
    return sendDbResult(res, create_user(data));
  });
}

function registerApplication(app: Router) {
  app.post("/register_application", async (req: Request, res: Response) => {
    const data = getData(req, res);
    return sendDbResult(res, register_application(data));
  });
}

// function login(app: Router) {
//   app.post("/login", async (req: Request, res: Response) => {
//     const data = req.body;

//     if (!data) {
//       res
//         .json({ error: true, message: "Data for login is mandatory", result: "Error: Data for login is mandatory" })
//         .status(400);
//     }
//   });
// }
