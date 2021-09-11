#!/bin/bash

if [ $NODE_ENV = "development" ]
then
  npx prisma migrate reset --force && \
  npx prisma migrate dev && \
  yarn run seed
fi
