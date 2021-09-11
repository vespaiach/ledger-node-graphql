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

### Create a new app on Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/vespaiach/ledger)

### Manually deploy

Using heroku cli

```
heroku git:remote -a <app_name>
git push heroku main
```