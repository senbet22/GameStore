# Game Store

**Live demo:** [gamestore-senbet.netlify.app](https://gamestore-senbet.netlify.app)

A full-stack web app to manage a game catalog. You can add and delete games, pick a genre, and see everything in a clean list.

**Backend:** ASP.NET Core (.NET 10) — minimal API with Entity Framework Core and SQLite  
**Frontend:** React + TypeScript + Vite

---

## What it does

- View all games in the catalog
- Add a new game (name, genre, price, release date, studio)
- Delete a game with a confirmation prompt
- Form validation with error messages from the API

---

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org) (v18 or higher)

---

## Running locally

### 1. Start the backend

```bash
cd Gamestore.API
dotnet run
```

The API will be available at `http://localhost:5129`.  
The database is created and seeded with genres automatically on first run.

### 2. Start the frontend

Open a second terminal:

```bash
cd GameStore.React
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/games` | Get all games |
| GET | `/games/{id}` | Get a game by ID |
| POST | `/games` | Add a new game |
| PUT | `/games/{id}` | Update a game |
| DELETE | `/games/{id}` | Delete a game |
| GET | `/genres` | Get all genres |

---

## Deployment

- **Frontend** hosted on [Netlify](https://netlify.com)
- **Backend** hosted on [Railway](https://railway.app)
- Environment-based API URL switching via Vite `.env` files
- CORS origins configured via `ALLOWED_ORIGINS` environment variable on Railway

---

## Project Structure

```
GameStore/
├── Gamestore.API/          # .NET backend
│   ├── Endpoints/          # Route handlers
│   ├── Models/             # Database models
│   ├── Dtos/               # Request/response shapes
│   └── Data/               # DbContext and migrations
└── GameStore.React/        # React frontend
    └── src/
        ├── components/     # AddGameForm, ConfirmModal
        ├── types.ts        # Shared TypeScript types
        └── constants.ts    # API base URL
```