# QuickSurvey API

REST API for the QuickSurvey application, built with NestJS and Prisma.

## Project Setup

```bash
$ pnpm install
```

## Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with your database credentials (DATABASE_URL).

## Database & Prisma Workflow

This project uses [Prisma](https://www.prisma.io/) as the ORM.

### Apply Schema to Database

To synchronize your Prisma schema with your database (useful for prototyping without migrations):

```bash
$ pnpm prisma db push
```

### Run Migrations

To apply existing migrations or create new ones (recommended for production/team workflows):

```bash
$ pnpm prisma migrate dev
```

### Prisma Studio

To view and edit your data in the browser:

```bash
$ pnpm prisma studio
```

### Generate Client

If you make changes to `schema.prisma`, regenerate the client:

```bash
$ pnpm prisma generate
```

## Compile and Run

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run Tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
