import knex from "knex";
import { Container } from "typedi";
import config from "../config";
import nodemailer from "nodemailer";

const { email } = config;

function dbLoader(): void {
  console.log("Creating email transporter");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email.from,
      pass: email.password,
    },
  });
  Container.set("email_transporter", transporter);
}

export default dbLoader;
