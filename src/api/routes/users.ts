import { Router } from "express";
import { getData } from "../utils/request_response";
import CrudService from "../../service/crud";
import EmailService from "../../service/email";
import encryptFunctions from "../../utils/encrypt";
import config from "../../config";
import JwtMiddleware from "../middleware/jwt";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";

const { encrypt } = config;

export default (app: Router): void => {
  const route = Router();

  app.use("/users", route);

  //Init
  const EmailServiceInstance = new EmailService();
  const tableName = "tb_user_authentication";
  const crudService = new CrudService(tableName);

  route.post("/register", JwtMiddleware, async (req: any, res) => {
    const body = getData(req, res);
    // Verify fields
    const requiredFields = ["token_content", "email", "password"];
    requiredFields.forEach((requiredField) => {
      if (!body[requiredField]) {
        res
          .json({
            error: true,
            message: "Token_content, email and password are mandatory",
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
    const user = await crudService.create({
      email: body.email,
      password: encryptPassword,
      token_content: body.token_content,
      code: Math.floor(Math.random() * 999999),
      is_verified: false,
      client_id: req.user.id,
      last_login: dayjs().format("YYYY-MM-DDThh:mm:ssZ"),
    });
    if (typeof user === "object" && typeof user[0] === "number") {
      await EmailServiceInstance.addEmailToQueue("verifyAccount", user[0]);
    } else {
      console.log(user);
      console.log(typeof user.id, typeof user.email);
    }
    return res.json({ error: false, message: "Registered user successfully" });
  });

  route.post("/verify-user", JwtMiddleware, async (req: any, res) => {
    const body = getData(req, res);
    // Verify fields
    const requiredFields = ["code", "email"];
    requiredFields.forEach((requiredField) => {
      if (!body[requiredField]) {
        res
          .json({
            error: true,
            message: "Code and email are mandatory",
          })
          .status(400);
      }
    });
    if (typeof body.code !== "string" || typeof body.email !== "string") {
      return res.json({ error: true, message: "Email and password should be string" });
    }
    // Get user
    const user = await crudService.get({ email: body.email, client_id: req.user.id });
    if (!user) {
      return res.json({ error: true, message: "Email do not match any user of this client" });
    }
    if (user.is_verified) {
      return res.json({ error: true, message: "User is already verified" });
    }
    if (body.code === user.code && typeof user.id === "number") {
      await crudService.edit({ is_verified: true }, user.id);
      return res.json({ error: false, message: "User verified successfully" });
    }
    return res.json({ error: false, message: "Code dont match with user code" });
  });

  route.post("/send-email-verification-code", JwtMiddleware, async (req: any, res) => {
    const body = getData(req, res);
    // Verify fields
    const requiredFields = ["email"];
    requiredFields.forEach((requiredField) => {
      if (!body[requiredField]) {
        res
          .json({
            error: true,
            message: "Email are mandatory",
          })
          .status(400);
      }
    });
    if (typeof body.email !== "string") {
      return res.json({ error: true, message: "Email and password should be string" });
    }
    // Get user
    const user = await crudService.get({ email: body.email, client_id: req.user.id });
    if (!user) {
      return res.json({ error: true, message: "Email do not match any user of this client" });
    }
    if (user.is_verified) {
      return res.json({ error: true, message: "User is already verified" });
    }
    if (typeof user.id === "number") {
      await crudService.edit({ code: Math.floor(Math.random() * 999999) }, user.id);
      if (typeof user.id === "number" && typeof user.email === "string") {
        await EmailServiceInstance.addEmailToQueue(user.email, "verifyAccount", user.id);
      }
      return res.json({ error: false, message: "Code sent successfully" });
    }
    return res.json({ error: true, message: "Error unknown" });
  });

  route.post("/change-password-email", JwtMiddleware, async (req: any, res) => {
    const body = getData(req, res);
    // Verify fields
    const requiredFields = ["email"];
    requiredFields.forEach((requiredField) => {
      if (!body[requiredField]) {
        res
          .json({
            error: true,
            message: "Email are mandatory",
          })
          .status(400);
      }
    });
    if (typeof body.email !== "string") {
      return res.json({ error: true, message: "Email and password should be string" });
    }
    // Get user
    const user = await crudService.get({ email: body.email, client_id: req.user.id });
    if (!user) {
      return res.json({ error: true, message: "Email do not match any user of this client" });
    }
    if (!user.is_verified) {
      return res.json({ error: true, message: "User is not verified" });
    }
    if (typeof user.id === "number") {
      // SEND EMAIL
      await crudService.edit({ code: Math.floor(Math.random() * 999999) }, user.id);
      if (typeof user.id === "number" && typeof user.email === "string") {
        await EmailServiceInstance.addEmailToQueue(user.email, "forgotPassword", user.id);
      }
      return res.json({ error: false, message: "Email sent successfully" });
    }
    return res.json({ error: true, message: "Error unknown" });
  });

  route.post("/change-password", JwtMiddleware, async (req: any, res) => {
    const body = getData(req, res);
    // Verify fields
    const requiredFields = ["email", "code", "password"];
    requiredFields.forEach((requiredField) => {
      if (!body[requiredField]) {
        res
          .json({
            error: true,
            message: "Email, code and password are mandatory",
          })
          .status(400);
      }
    });
    if (typeof body.email !== "string" || typeof body.code !== "string" || typeof body.password !== "string") {
      return res.json({ error: true, message: "Email, password and code should be string" });
    }
    // Get user
    const user = await crudService.get({ email: body.email, client_id: req.user.id });
    if (!user) {
      return res.json({ error: true, message: "Email do not match any user of this client" });
    }
    if (!user.is_verified) {
      return res.json({ error: true, message: "User is not verified" });
    }
    if (body.code === user.code && typeof user.id === "number") {
      // SEND EMAIL
      await crudService.edit({ password: encryptFunctions.encryptPassword(body.password) }, user.id);
      return res.json({ error: false, message: "Password changed successfully" });
    }
    return res.json({ error: true, message: "Error unknown" });
  });

  route.post("/login", JwtMiddleware, async (req: any, res) => {
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
    const user = await crudService.get({ email: body.email, password: encryptPassword });
    if (!user) return res.json({ error: true, message: "Email and password dont match any user of this client" });
    if (!user.is_verified) return res.json({ error: true, message: "User is not verified" });
    if (typeof user.token_content === "object") return jwt.sign(user.token_content || {}, encrypt.jwt);
    return res.json({ error: false, message: "Password changed succesfully" });
  });
};
