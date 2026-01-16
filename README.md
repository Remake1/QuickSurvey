# QuickSurvey

## Screenshots
![Screenshot 1](docs/images/img.png)
![Screenshot 1](docs/images/img_1.png)
![Screenshot 1](docs/images/img_2.png)
![Screenshot 1](docs/images/img_3.png)
![Screenshot 1](docs/images/img_4.png)
![Screenshot 1](docs/images/img_5.png)

QuickSurvey is being prepared for a Go backend rewrite. The active frontend is a React/Vite app in `client`.

## Project Structure

```text
QuickSurvey/
├── api-hono/     # Legacy Hono backend kept as a migration reference
├── client/       # React frontend and frontend-owned schemas
├── shared/       # Historical shared package kept for migration reference
├── docker-compose.yaml
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) for the frontend only
- [Docker](https://www.docker.com/) for local infrastructure

### Frontend Installation

```bash
cd client
pnpm install
```

### Environment Setup

```bash
cp .env.example .env
cp api-hono/.env.example api-hono/.env
```

### Start Database and Storage

```bash
docker-compose up -d
```

## Development

### Frontend

```bash
cd client
pnpm dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to `http://localhost:3000`.

### Legacy Hono Backend Reference

The old TypeScript backend lives in `api-hono`. It is kept for migration reference while the Go backend is built.

### Build Frontend

```bash
cd client
pnpm build
```
