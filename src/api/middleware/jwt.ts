import jwt from "jsonwebtoken";
import config from "../../config";
import { Request, Response, NextFunction } from "express";

const { encrypt } = config;

// Verify authentication
export default (req: any, res: Response, next: NextFunction) => {
  const authorizationField = req.headers["authorization"];

  if (!authorizationField)
    return res.status(401).json({
      error: true,
      message: "No token provided.",
      result: "You need to send a token",
    });
  const token = authorizationField.split("Bearer ")[1];
  try {
    const data = jwt.verify(token, encrypt.jwt);
    req.user = data;
    next();
  } catch {
    return res.status(401).json({ auth: false, message: "Failed to authenticate token." });
  }
};
