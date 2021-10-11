# Description

This repository is a Graphql Server to provide back-end APIs for Ledger website

# Development requirements :

-   Node.js >= 12.0.0
-   PostgreSQL
-   TypeScript
-   Apollo Server
-   Graphql

# Run development:

Copy `.env.template` to `.env` and update `DATABASE_URL` variable.


1. Install packages
```
yarn install
```

2. Migrate database schema
```
npx prisma migrate dev
```

3. Seed database
```
yarn run seed
```

4. Run dev
```
yarn run dev
```

# Heroku deployment

## Run locally

  1. Create `.env` file, and input below variables:
```
    LEDGER_DATABASE_URL=<your Postgres database url>
    NODE_ENV=[development|production]
    PORT=[your application port (default: 3000)]
```
  2. Run `yarn install`
  3. Run `yarn dev`

## Create a new app on Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/vespaiach/ledger-graphql)


## Manually deploy

Using heroku cli

```
heroku git:remote -a <your_heroku_app_name>
git push heroku main
heroku run npx prisma migrate deploy -a <your_heroku_app_name>
```


## Other commands

### Seeding
  `yarn seed -a <your_heroku_app_name>`

  On Heroku platform:
  `heroku run yarn seed -a <your_heroku_app_name>`

### Generating Typescript code
  `yarn gen`

### Building project
  `yarn build`

