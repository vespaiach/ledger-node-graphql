# Description

This repository is a Graphql Server to provide back-end APIs for [Ledger Web App](https://ledger.dedyn.io/)

# Playground

Test the server from this link https://backend-ledger.dedyn.io/graphql

# How to run it locally

Copy `.env.template` to `.env` and update those variables:

| Variables                          | Value                                                   | Required | Default                                                                                                                |
| ---------------------------------- | ------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| NODE_ENV                           | `production`, `development`                             | no       | `development`                                                                                                          |
| LEDGER_BACKEND_APP_PORT            | any port number                                         | no       | 3333                                                                                                                   |
| LEDGER_DATABASE_URL                | url of PostgresQL database server                       | yes      |                                                                                                                        |
| LEDGER_FRONTEND_BASE_URL           | url of Ledger Web App                                   | yes      | http://localhost:3000/                                                                                                 |
| LEDGER_SSL_KEY                     | path of ssl key file                                    | no       |                                                                                                                        |
| LEDGER_SSL_CERT                    | path of ssl cert file                                   | no       |                                                                                                                        |
| LEDGER_SMTP_USER                   | SMTP account                                            | yes      |                                                                                                                        |
| LEDGER_SMTP_PASS                   | SMTP password                                           | yes      |                                                                                                                        |
| LEDGER_SIGNIN_EMAIL_FROM           | Email address that sign-in token will be sent from      | yes      |                                                                                                                        |
| LEDGER_SIGNIN_EMAIL_SUBJECT        | Email's subject                                         | yes      | 'Ledger Sign In'                                                                                                       |
| LEDGER_SIGNIN_EMAIL_TEMPLATE       | Email's template                                        | yes      | `<h3>Ledger</h3><p>Please use the sign-in key <stong>{{key}}</strong> to sign in, or click on this link {{link}}.</p>` |
| LEDGER_SIGNIN_JWT_ALGORITHM        | `HS*`, `RS*`                                            | yes      | `HS256`                                                                                                                |
| LEDGER_SIGNIN_JWT_SECRET           | any secret string                                       | yes      |                                                                                                                        |
| LEDGER_SIGNIN_KEY_AVAILABLE_TIME   | available time in minutes after a sign-in key is issued | yes      | 2                                                                                                                      |
| LEDGER_SIGNIN_TOKEN_AVAILABLE_TIME | available time in minutes of a sign-in token            | yes      | 4320                                                                                                                   |

1. Install packages

```
npm install
```

2. Migrate database schema

```
npm run migrate
```

3. Seed database

```
npm run seed
```

4. Start server

```
npm run dev
```

## NPM Commands

| Command         | Note                                     |
| --------------- | ---------------------------------------- |
| npm run dev     | run server locally for development       |
| npm run build   | build project and output to build folder |
| npm run start   | run server after building                |
| npm run gentype | use graphql-codegen to generate typing   |
| npm run seed    | seed database with dummy data            |
| npm run migrate | apply all database schemas               |

# Tech Stack

- Nodejs (>= 12.x.x) / Typescript
- Apollo Server / Expressjs / GraphQL
- Prismajs / PostgresQL

# Contributes

Pull requests are welcome.
