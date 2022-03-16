import { DataSource } from 'apollo-datasource';
import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ConfigurationValues } from 'src/config';

export class GmailSmtp extends DataSource {
  private transport: Transporter<SMTPTransport.SentMessageInfo>;
  private emailConfig: ConfigurationValues['signin_email_template'];
  private frontendBaseUrl: string;

  constructor(
    smtpConfig: ConfigurationValues['smtp_credentials'],
    emailConfig: ConfigurationValues['signin_email_template'],
    frontendBaseUrl: string
  ) {
    super();

    this.transport = nodemailer.createTransport(smtpConfig);
    this.emailConfig = emailConfig;
    this.frontendBaseUrl = frontendBaseUrl;
  }

  public send(to: string, key: string): Promise<boolean> {
    return new Promise((res, rej) => {
      const message = {
        from: this.emailConfig.from,
        to,
        subject: this.emailConfig.subject,
        html: this.emailConfig.template
          .replace('{{link}}', `${this.frontendBaseUrl}?token=${key}`)
          .replace('{{key}}', key),
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
