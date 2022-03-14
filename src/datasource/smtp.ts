import { DataSource } from 'apollo-datasource';
import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export class GmailSmtp extends DataSource {
  transport: Transporter<SMTPTransport.SentMessageInfo>;
  baseUrl = '';

  constructor(user: string, pass: string, baseUrl: string) {
    super();

    this.transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    });
    this.baseUrl = baseUrl;
  }

  public send(to: string, key: string): Promise<boolean> {
    return new Promise((res, rej) => {
      const message = {
        from: 'nta.toan@gmail.com',
        to,
        subject: 'Ledger Sign In',
        text: `Please use this link to sign in: ${this.baseUrl}?key=${key}`,
      };

      this.transport.sendMail(message, function (err) {
        if (err) {
          console.log(err);
          rej(false);
          return;
        }

        res(true);
      });
    });
  }
}
