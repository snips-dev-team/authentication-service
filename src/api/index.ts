import { Router } from "express";
import clientRoute from "./routes/clients";
import userRoute from "./routes/users";

function routes(): any {
  const app = Router();
  clientRoute(app);
  userRoute(app);
  return app;
}

export default routes;

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
