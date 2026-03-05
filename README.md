# Hexagonal Architecture Template

A full-stack TypeScript template using **Hexagonal (Ports & Adapters) Architecture** with functional programming via `fp-ts`.

## Stack

| Layer | Tech |
|---|---|
| Backend | Node.js, Express 5, TypeScript, fp-ts, Zod, Prisma |
| Frontend | React 19, Vite, TypeScript |
| Database | MongoDB (via Prisma) |
| Tooling | Docker, Husky, Commitlint, Prettier, Nodemon |

---

## Project Structure

```
├── backend/
│   ├── prisma/schema.prisma          # DB schema
│   └── src/
│       ├── app.ts                    # Express app setup
│       ├── server.ts                 # Entry point
│       ├── adapter/
│       │   ├── in/                   # HTTP routes (primary adapters)
│       │   └── out/prisma/           # DB implementations (secondary adapters)
│       ├── domain/
│       │   ├── model/                # Zod schemas & domain types
│       │   └── service/              # Pure domain logic
│       ├── port/out/                 # Repository interfaces
│       └── use-case/                 # Application use-cases
└── frontend/
    └── src/
        ├── App.tsx
        └── components/               # React components
```

### How the layers connect

```
HTTP Request
    → adapter/in/          (routes — calls use-case)
    → use-case/            (orchestration — calls port)
    → port/out/            (interface — implemented by adapter/out)
    → adapter/out/prisma/  (DB query via Prisma)
```

Domain logic in `domain/service/` stays pure — no DB, no HTTP.

---

## Getting Started

### 1. Clone and reset git history

```bash
git clone <repo-url> my-project
cd my-project
rm -rf .git
git init && git add . && git commit -m "init: project from template"
```

### 2. Rename the project

Edit `backend/.env` — set `APP_NAME` to your project name:

```
APP_NAME=my-project
DATABASE_URL=mongodb://localhost:27017/my-project?replicaSet=rs0
NODE_ENV=development
PORT=3000
```

Edit `frontend/.env` to match:

```
VITE_APP_NAME=my-project
```

`APP_NAME` controls: `package.json` name, Docker project/container names, and MongoDB database name.

### 3. Initialize the backend

```bash
cd backend
chmod +x setup.sh && ./setup.sh
```

This script:
- Syncs `package.json` name from `APP_NAME`
- Installs dependencies
- Starts Docker containers (MongoDB + backend)
- Waits for MongoDB and initiates the replica set
- Generates the Prisma client

### 4. Start the backend dev server

```bash
cd backend
npm run dev
```

### 5. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Backend runs on `http://localhost:3000`, frontend on `http://localhost:5173`.

---

## Adding Your Own Domain

1. **Define your model** — add a Zod schema in `backend/src/domain/model/`
2. **Define the port** — add a repository interface in `backend/src/port/out/`
3. **Implement the adapter** — add a Prisma implementation in `backend/src/adapter/out/prisma/`
4. **Write the use-case** — add an application service in `backend/src/use-case/`
5. **Add a route** — add an Express router in `backend/src/adapter/in/` and mount it in `app.ts`
6. **Update the schema** — add your model to `backend/prisma/schema.prisma` and run `npx prisma generate`

The included `Item` model (`GET /api/items`) is a minimal working example of this pattern — replace it with your domain.
