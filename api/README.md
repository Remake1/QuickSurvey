# QuickSurvey API

Go backend for QuickSurvey using chi, gqlgen, pgx, sqlc, PostgreSQL, JWT, and dataloaden.

## Setup

```bash
cp .env.example .env
go mod download
go generate ./...
go test ./...
go run ./cmd/server
```

The API listens on `http://localhost:3000` by default.

## Database

Apply `internal/infrastructure/postgres/schema.sql` to the local PostgreSQL database before starting the server.

## Endpoints

- `GET /healthz`
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /graphql`
- `GET /playground`

