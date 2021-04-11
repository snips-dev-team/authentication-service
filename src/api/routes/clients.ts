import { Router } from "express";
import { getData } from "../utils/request_response";
import CrudService from "../../service/crud";
import encryptFunctions from "../../utils/encrypt";
import config from "../../config";
import jwt from "jsonwebtoken";
import JwtMiddleware from "../middleware/jwt";

const { encrypt } = config;

export default (app: Router): void => {
  const route = Router();

  app.use("/clients", route);

  //Init
  const tableName = "tb_clients";
  const crudService = new CrudService(tableName);

  route.post("/register", async (req, res) => {
    const body = getData(req, res);
    // Verify fields
    const requiredFields = ["name", "email", "password"];
    requiredFields.forEach((requiredField) => {
      if (!body[requiredField]) {
        return res
          .json({
            error: true,
            message: "Name, email and password are mandatory",
          })
          .status(400);
      }
    });
    // Encrypt data
    if (typeof body.email !== "string" || typeof body.password !== "string") {
      return res.json({ error: true, message: "Email and password should be string" });
    }
    const encryptPassword = encryptFunctions.encryptPassword(body.password);
    // Create client
    const user = await crudService.create({ email: body.email, password: encryptPassword, name: body.name });
    const token = jwt.sign({ id: user.id }, encrypt.jwt);
    return res.json({ error: false, token });
  });

  route.post("/get-token", async (req, res) => {
    const body = getData(req, res);
    // Verify fields
    const requiredFields = ["email", "password"];
    requiredFields.forEach((requiredField) => {
      if (!body[requiredField]) {
        return res
          .json({
            error: true,
            message: "Email and password are mandatory",
          })
          .status(400);
      }
    });
    if (typeof body.email !== "string" || typeof body.password !== "string") {
      return res.json({ error: true, message: "Email and password should be string" });
    }
    const encryptPassword = encryptFunctions.encryptPassword(body.password);
    // Get user
    const user = await crudService.get({ email: body.email, password: encryptPassword });
    if (!user) {
      res.json({ error: true, message: "Email and password dont match any user" }).status(400);
    }
    const token = jwt.sign({ id: user.id }, encrypt.jwt);
    return res.json({ error: false, token });
  });

  route.post("/change-password", JwtMiddleware, async (req: any, res) => {
    const body = getData(req, res);
    // Verify fields
    const requiredFields = ["email", "password"];
    requiredFields.forEach((requiredField) => {
      if (!body[requiredField]) {
        res
          .json({
            error: true,
            message: "Name, email and password are mandatory",
          })
          .status(400);
      }
    });
    if (typeof body.email !== "string" || typeof body.password !== "string") {
      return res.json({ error: true, message: "Email and password should be string" });
    }
    const encryptPassword = encryptFunctions.encryptPassword(body.password);
    await crudService.edit({ password: encryptPassword }, req.user.id);
    return res.json({ error: false, message: "Password changed succesfully" });
  });
};
