# Social app microservice

## Description

This is a microservice for social app. It is built with the next libs:

- #### [Nx](https://nx.dev/)
  - Nx is a set of extensible dev tools for monorepos, which helps you develop like Google, Facebook, and Microsoft.
- #### [NestJS](https://nestjs.com/)
  - NestJS is a framework for building efficient, reliable and scalable server-side applications. It uses modern JavaScript, is built with TypeScript and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).
- #### [Prisma](https://www.prisma.io/)
  - Prisma is a modern database access layer for TypeScript & Node.js. It replaces traditional ORMs and makes database access easy with an auto-generated query builder for TypeScript & Node.js.
- #### [RabbitMQ](https://www.rabbitmq.com/)
  - RabbitMQ is the most widely deployed open source message broker. It supports multiple messaging protocols. It can be used to send and receive messages, and it has been designed to be easy to use.
- #### [MailJet](https://www.mailjet.com/)
  - MailJet is an all-in-one solution to send, track and deliver transactional, notification and marketing emails. It is a cloud-based email service that allows you to send and receive email via a web-based interface or API.

## Installation

```bash
$ yarn install
```

## Running the app

Before running the app, you need to have a running instance of RabbitMQ, PostgreSQL and [Environment Variables](#environment-variables) in `.env` file. You can use the following command to run the required services .

```bash
$ docker compose  -f "docker-compose.yml" up -d --build postgres rabbitmq
```

Migrate database schema is required before running the app.

```bash
# development
$ yarn migrate:dev

# production
$ yarn migrate:deploy
```

After that, you can run the app with the following command, this will generate the prisma schema for using in app.

```bash
$ yarn generate:schemas
```

Finally, you can run the apps with the followings commands:

```bash
# This command will run all the apps in the workspace
$ yarn run start:all

# To run an specific app use this
$ yarn start <app-name>
```

## Environment Variables

The following variables must be set in the environment if the default value needs to be overridden.

For local environment use the `.env`. Consider that any system environment variables will take precedence.

| Variable              | Description                                       | Default Value |
| --------------------- | ------------------------------------------------- | ------------- |
| `APP_PORT`            | Port for the application.                         |               |
| `DATABASE_WRITER_URL` | Writer url for database                           |               |
| `DATABASE_READER_URL` | Reader url for database                           |               |
| `MAIL_SECRET_TOKEN`   | MailJet secret token                              |               |
| `MAIL_API_TOKEN`      | MailJet api token                                 |               |
| `MAIL_DEFAULT_SENDER` | MailJet default email associated with par of keys |               |
| `RABBITMQ_URL`        | RabbitMQ url of container                         |               |

Example:

```env
APP_PORT=3000
DATABASE_READER_URL="postgresql://prisma:docker@localhost:5432/social"
DATABASE_WRITER_URL="postgresql://prisma:docker@localhost:5432/social"
MAIL_SECRET_TOKEN=1234567890
MAIL_API_TOKEN=1234567890
MAIL_DEFAULT_SENDER="test@mail.com"
RABBITMQ_URL="amqp://guest:guest@localhost:5672"
```

## Running in docker

`docker-compose.yml` file is provided to run the app in a docker container, this use the file env `.docker.env` to pass env variables to container is the same variables describe in [Environment Variables](#environment-variables).

To run the apps in a docker container, need build the apps and then run the container with the following commands:

```bash
# Build the apps
$ yarn build

# Run the container
$ docker compose -f "docker-compose.yml" up -d --build
```
