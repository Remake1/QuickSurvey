# QuickSurvey

A monorepo built with **Hono**, **Vite**, **React**, and **Turborepo**.

## 📁 Project Structure

```
QuickSurvey/
├── api/          # Hono backend API (TypeScript)
├── client/       # React frontend (Vite + TypeScript)
├── shared/       # Shared types and utilities
├── docker-compose.yaml
├── turbo.json
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/) (v10.20.0)
- [Docker](https://www.docker.com/) (for database)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd QuickSurvey

# Install dependencies
pnpm install
```

### Environment Setup

```bash
# Copy environment files
cp .env.example .env
cp api/.env.example api/.env

# Edit api/.env with your database credentials
```

### Start Infrastructure

```bash
# Start PostgreSQL and MinIO
docker-compose up -d
```

### Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Or push schema without migrations (development)
pnpm db:push
```

---

## 🛠️ Development Commands

### Run Development Servers

```bash
# Run all packages (API + Client)
pnpm dev

# Run only API (localhost:3000)
pnpm dev:api

# Run only Client (localhost:5173)
pnpm dev:client
```

### Build

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build:api      # Uses esbuild → api/dist/index.js
pnpm build:client   # Uses Vite → client/dist/
```

### Run Production

```bash
# Start API (after building)
pnpm --filter api start

# Or directly with node
node api/dist/index.js
```

### Type Checking & Linting

```bash
# Type-check all packages
pnpm type-check

# Lint all packages
pnpm lint

# Run tests
pnpm test
```

---

## 🗄️ Database Commands

All database commands run in the `api` package context:

```bash
# Generate Prisma client after schema changes
pnpm db:generate

# Create and apply migrations (interactive)
pnpm db:migrate

# Create migration with specific name
pnpm db:migrate -- --name <migration-name>

# Push schema to database (no migration file)
pnpm db:push

# Open Prisma Studio (database GUI)
pnpm db:studio
```

---

## 📦 Package Management

### Install Dependencies

```bash
# Add dependency to root
pnpm add <package> -w

# Add dependency to specific package
pnpm add <package> --filter api
pnpm add <package> --filter client
pnpm add <package> --filter @quicksurvey/shared

# Add dev dependency
pnpm add -D <package> --filter api
```

### Run Commands in Specific Package

```bash
# Run any script in a specific package
pnpm --filter api <script>
pnpm --filter client <script>

# Examples
pnpm --filter api dev
pnpm --filter client build
```

---

## 🐳 Docker Commands

```bash
# Start all services (PostgreSQL, MinIO)
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Reset database (destroys data)
docker-compose down -v
docker-compose up -d
```

---

## 🏗️ Turborepo

This project uses [Turborepo](https://turborepo.com/) for build orchestration:

```bash
# Run turbo commands directly
turbo build
turbo dev
turbo type-check

# Run with filters
turbo build --filter=api
turbo dev --filter=client

# View dependency graph
turbo build --graph
```

---

## 📝 Tech Stack

| Package | Technology |
|---------|------------|
| **api** | Hono, Prisma, PostgreSQL |
| **client** | React 19, Vite, TypeScript |
| **shared** | TypeScript types & utilities |
| **infra** | Docker, PostgreSQL, MinIO |
| **tooling** | Turborepo, pnpm, ESLint |

---

## 📄 License

MIT
