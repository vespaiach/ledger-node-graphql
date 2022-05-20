import { Algorithm } from 'jsonwebtoken';

export type ConfigurationValues = {
  app_port: number;
  database_url: string;
  ssl_certificates: {
    key?: string;
    cert?: string;
  };
  environment: string;
  signin_token_available_time: number; // in minutes
  signin_jwt_secret: string;
  signin_jwt_algorithm: Algorithm;
};

export class Config {
  private configs: ConfigurationValues;

  private throwIf(shouldThrow: boolean, message: string) {
    if (shouldThrow) throw new Error(message);
  }

  constructor() {
    const {
      // Heroku expose the $PORT env var, and we have to bind to this port instead.
      // So when deploying to heroku, don't set this env variable.
      LEDGER_BACKEND_APP_PORT = process.env.PORT || '3333',
      LEDGER_DATABASE_URL,
      LEDGER_SSL_KEY,
      LEDGER_SSL_CERT,
      LEDGER_SIGNIN_TOKEN_AVAILABLE_TIME = '1440',
      LEDGER_SIGNIN_JWT_SECRET,
      LEDGER_SIGNIN_JWT_ALGORITHM = 'HS256',
      NODE_ENV = 'development',
    } = process.env;

    this.throwIf(!LEDGER_DATABASE_URL, 'database url is required');
    this.throwIf(!LEDGER_SIGNIN_JWT_SECRET?.length, 'jwt secret is required');

    this.configs = {
      app_port: Number(LEDGER_BACKEND_APP_PORT),
      database_url: LEDGER_DATABASE_URL as string,
      signin_token_available_time: Number(LEDGER_SIGNIN_TOKEN_AVAILABLE_TIME),
      signin_jwt_secret: LEDGER_SIGNIN_JWT_SECRET as string,
      signin_jwt_algorithm: LEDGER_SIGNIN_JWT_ALGORITHM as Algorithm,
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
