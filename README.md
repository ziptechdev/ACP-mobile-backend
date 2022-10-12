# ACP mobile-backend

### This is a repo for the backend application of the ACP project

## 1. Local setup

In order to configure and run the project on your local machine execute the following steps:
1. Install node and yarn on your local machine
2. Install postgres on your local machine and run it
3. Create the dev database and test database locally (ex. `CREATE DATABASE acp-dev;`)
4. Run `cp .env.example .env` to populate your env variables
5. Update the `.env` file according to your local data(ex. db name created in step 3)
6. Run `rm -rf node_modules` to clean the dependencies
7. Run `yarn` to install the dependencies
8. Run `yarn dev` to run the server locally in watch mode(make sure NODE_ENV=development)
9. Run `yarn test` to run the tests

If you want to build and run the project without watch mode run:

1. `yarn build` 
2. `yarn start`

instead of the 8. step.

## 2. Docker setup

In order to configure and run the project using docker environment execute the following steps:
1. Install and run Docker on your machine
2. Run `cp .env.example .env` to populate your env variables
3. Update the `.env` file accordingly (The important thing is to put "db" as DATABASE_HOST)
4. Run `rm -rf node_modules` to clean the dependencies
5. Run `bash bin/start.dev.sh` to run the docker network(database and server)
6. Optionally Run `bash bin/seed.dev.sh` to seed the database

Run `bash bin/stop.dev.sh` to destroy the docker network