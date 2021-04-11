import { Transporter } from "nodemailer";
import Container from "typedi";
import CrudService from "./crud";
import config from "../config";
import EmailTemplates from "../utils/emailTemplates";

const { email } = config;

export default class EmailService {
  queueCrudService: CrudService;
  logCrudService: CrudService;
  userAuthenticationCrudService: CrudService;
  clientCrudService: CrudService;
  transporter: Transporter;

  constructor() {
    this.queueCrudService = new CrudService("tb_email_queue");
    this.logCrudService = new CrudService("tb_email_log");
    this.userAuthenticationCrudService = new CrudService("tb_user_authentication");
    this.clientCrudService = new CrudService("tb_clients");
    this.transporter = Container.get("email_transporter");
  }

  async addEmailToQueue(template: string, user_id: number) {
    await this.queueCrudService.create({ template, user_authentication_id: user_id });
    await this.sendEmailsInQueue().catch((error: any) => {
      console.log(error);
    }); // temporary should go to cronjob
  }

  async sendEmailsInQueue() {
    console.log("tamo aqui pai");
    const emailsToSend = await this.queueCrudService.list().catch((error: any) => {
      console.log(error);
    });
    console.log(emailsToSend);
    emailsToSend.forEach(async (emailToSend) => {
      const user = await this.userAuthenticationCrudService.get({ id: emailToSend.user_authentication_id });
      if (!user) return;
      const client = await this.clientCrudService.get({ id: user.client_id });
      console.log(client);
      if (!client) return;
      let template;
      if (typeof client.name === "string") {
        template = EmailTemplates(client.name, user);
      }
      if (
        typeof client.name === "string" &&
        typeof emailToSend.template === "string" &&
        typeof user.email === "string" &&
        template
      ) {
        await this.transporter
          .sendMail({
            from: `"${client.name}" <${email.from}>`,
            to: user.email,
            subject: template[emailToSend.template].subject,
            text: template[emailToSend.template].text,
            html: template[emailToSend.template].html,
          })
          .then(async () => {
            if (typeof emailToSend.id === "number") {
              await this.queueCrudService.remove(emailToSend.id);
              await this.logCrudService.create({ email: user.email, template: emailToSend.template });
            }
          })
          .catch(() => {
            console.log(`Error sending email ${emailToSend.to} ${emailToSend.template}`);
          });
      }
    });
  }
}
