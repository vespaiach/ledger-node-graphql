# Description

This repository is a Graphql Server to provide back-end APIs for Ledger Web App.

# DB Schema

There are three tables: user, transaction and reason.

![Database schema](https://raw.githubusercontent.com/vespaiach/ledger-node-graphql/main/db.jpg)

# Development 

Copy `.env.template` to `.env` and update `LEDGER_DATABASE_URL` variable to PostgresQL server database.


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

# Deployment

Before deploying, set/update environment settings: 
 
| Variables                          | Value                                        | Required | Default       |
| ---------------------------------- | -------------------------------------------- | -------- | ------------- |
| NODE_ENV                           | `production`, `development`                  | no       | `development` |
| LEDGER_BACKEND_APP_PORT            | any port number                              | no       | 3333          |
| LEDGER_DATABASE_URL                | url of PostgresQL database server            | yes      |               |
| LEDGER_SSL_KEY                     | path of ssl key file                         | no       |               |
| LEDGER_SSL_CERT                    | path of ssl cert file                        | no       |               |
| LEDGER_SIGNIN_JWT_ALGORITHM        | `HS*`, `RS*`                                 | yes      | `HS256`       |
| LEDGER_SIGNIN_JWT_SECRET           | any secret string                            | yes      |               |
| LEDGER_SIGNIN_TOKEN_AVAILABLE_TIME | available time in minutes of a sign-in token | yes      | 4320          |

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