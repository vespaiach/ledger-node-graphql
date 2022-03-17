import { Algorithm } from 'jsonwebtoken';

export type ConfigurationValues = {
  app_port: number;
  database_url: string;
  authorized_emails: string[] | null;
  signin_email_template: {
    from: string;
    subject: string;
    template: string;
  };
  smtp_credentials: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  ssl_certificates: {
    key?: string;
    cert?: string;
  };
  environment: string;
  frontend_base_url: string;
  signin_key_available_time: number; // in minutes
  signin_token_available_time: number; // in minutes
  signin_jwt_secret: string;
  signin_jwt_algorithm: Algorithm;
};

class Config {
  private configs: ConfigurationValues;

  private throwIf(shouldThrow: boolean, message: string) {
    if (shouldThrow) throw new Error(message);
  }

  constructor() {
    const {
      LEDGER_BACKEND_APP_PORT = '3333',
      LEDGER_DATABASE_URL,
      LEDGER_FRONTEND_BASE_URL,
      LEDGER_SSL_KEY,
      LEDGER_SSL_CERT,
      LEDGER_AUTHORIZED_EMAILS,
      LEDGER_SMTP_USER,
      LEDGER_SMTP_PASS,
      LEDGER_SIGNIN_EMAIL_FROM,
      LEDGER_SIGNIN_EMAIL_SUBJECT = 'Ledger Sign In',
      LEDGER_SIGNIN_EMAIL_TEMPLATE,
      LEDGER_SIGNIN_KEY_AVAILABLE_TIME = '2',
      LEDGER_SIGNIN_TOKEN_AVAILABLE_TIME = '1440',
      LEDGER_SIGNIN_JWT_SECRET,
      LEDGER_SIGNIN_JWT_ALGORITHM = 'HS256',
      NODE_ENV = 'development',
    } = process.env;

    this.throwIf(!LEDGER_DATABASE_URL, 'database url is required');
    this.throwIf(!LEDGER_FRONTEND_BASE_URL, 'frontend base url is required');
    this.throwIf(!LEDGER_SIGNIN_EMAIL_FROM, "sign-in email's sender is required");
    this.throwIf(!LEDGER_SIGNIN_EMAIL_SUBJECT, 'sign-in email subject is required');
    this.throwIf(!LEDGER_SIGNIN_EMAIL_TEMPLATE, 'sign-in email template is required');
    this.throwIf(!LEDGER_SMTP_USER, 'smtp user is required');
    this.throwIf(!LEDGER_SMTP_PASS, 'smtp pass is required');
    this.throwIf(!LEDGER_SIGNIN_JWT_SECRET?.length, 'jwt secret is required');

    this.configs = {
      app_port: Number(LEDGER_BACKEND_APP_PORT),
      frontend_base_url: LEDGER_FRONTEND_BASE_URL as string,
      database_url: LEDGER_DATABASE_URL as string,
      authorized_emails: LEDGER_AUTHORIZED_EMAILS?.split(',') ?? null,
      signin_email_template: {
        from: LEDGER_SIGNIN_EMAIL_FROM as string,
        subject: LEDGER_SIGNIN_EMAIL_SUBJECT as string,
        template: LEDGER_SIGNIN_EMAIL_TEMPLATE as string,
      },
      signin_key_available_time: Number(LEDGER_SIGNIN_KEY_AVAILABLE_TIME),
      signin_token_available_time: Number(LEDGER_SIGNIN_TOKEN_AVAILABLE_TIME),
      signin_jwt_secret: LEDGER_SIGNIN_JWT_SECRET as string,
      signin_jwt_algorithm: LEDGER_SIGNIN_JWT_ALGORITHM as Algorithm,
      smtp_credentials: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: LEDGER_SMTP_USER as string,
          pass: LEDGER_SMTP_PASS as string,
        },
      },
      ssl_certificates: {
        key: LEDGER_SSL_KEY,
        cert: LEDGER_SSL_CERT,
      },
      environment: NODE_ENV,
    };
  }

  public get<T extends keyof ConfigurationValues>(key: T, defaultValue?: ConfigurationValues[T]) {
    const value = this.configs[key];
    return value === undefined || value === null ? defaultValue || value : value;
  }
}

export default new Config();
