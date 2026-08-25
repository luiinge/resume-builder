# Resume Builder

A self-hosted CV / resume generator. It has two parts:

- **Profiles**: personal data plus skills, languages, education, work experience and project sections.
- **Templates**: layout (columns, section visibility and order, visible personal-data fields) and appearance, fully controlled through a CSS field. Three predefined templates (Classic, Modern, Minimal) ship out of the box; you can also create and edit your own.

CVs are rendered as HTML and exported to PDF (via headless Chromium/Playwright). Fixed document literals (section titles, "Present", date formatting, skill-level labels) can be generated in English or Spanish, selectable at preview/export time, independently of your entered content. The application's own admin interface is in English.

## Quick start (Docker)

This is the recommended way to run the app locally. It packages the backend, the built frontend and a SQLite database file into a single container.

### Requirements

- Docker
- Docker Compose (bundled with modern Docker Desktop / Docker Engine as `docker compose`)

### Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd resume-builder

# 2. Copy the example environment file (defaults work out of the box)
cp .env.example .env

# 3. Build and start the container
docker compose up -d --build

# 4. Open the app
# http://localhost:3000
```

On first start, the container automatically:

- Applies database migrations.
- Seeds the three predefined templates (Classic, Modern, Minimal) — these are re-synced on every startup, so they always match the shipped version.
- Seeds a single example profile — created once so you have something to try the app with; edit or delete it freely afterwards, it will not reappear.

Data is persisted in a named Docker volume (`app-data`, mounted at `/data` inside the container), so it survives container restarts and rebuilds.

### Common operations

```bash
# View logs
docker compose logs -f

# Stop the app (keeps data)
docker compose down

# Rebuild after pulling new changes
docker compose up -d --build

# Remove everything, including the database volume (irreversible)
docker compose down -v
```

### Configuration

Copy `.env.example` to `.env` and adjust if needed:

| Variable   | Default | Description                          |
| ---------- | ------- | ------------------------------------- |
| `APP_PORT` | `3000`  | Host port the app is exposed on.      |

## Local development (without Docker)

Use this setup if you want to modify the code with hot reload.

### Requirements

- Node.js >= 20
- npm

### Setup

```bash
# 1. Install dependencies for all workspaces
npm install

# 2. Build the shared package (types/constants used by both backend and frontend)
npm run build:shared

# 3. Configure the backend environment (not tracked in git)
cat > apps/backend/.env <<'EOF'
DATABASE_URL="file:./dev.db"
PORT=3000
EOF

# 4. Apply database migrations
npm run prisma:migrate

# 5. Seed predefined templates and the example profile
npm run prisma:seed

# 6. Install the Chromium browser used for PDF export
cd apps/backend && npx playwright install --with-deps chromium && cd ../..
```

### Running

Run the backend and frontend dev servers in two separate terminals:

```bash
# Terminal 1 — NestJS API on http://localhost:3000 (watch mode)
npm run dev:backend

# Terminal 2 — Vite dev server on http://localhost:5173 (proxies /api to :3000)
npm run dev:frontend
```

Open **http://localhost:5173** during development.

### Other useful commands

```bash
# Lint backend + frontend
npm run lint

# Backend unit tests
npm run test --workspace apps/backend

# Backend end-to-end tests
npm run test:e2e --workspace apps/backend

# Build everything (shared -> backend -> frontend) as Docker's build stage does
npm run build

# Open Prisma Studio to inspect the SQLite database
npx prisma studio --schema apps/backend/prisma/schema.prisma
```

## Project structure

```
apps/
  backend/   NestJS API, Prisma/SQLite, HTML->PDF rendering
  frontend/  React + TypeScript admin UI (Vite)
packages/
  shared/    Types and constants shared by backend and frontend
```
