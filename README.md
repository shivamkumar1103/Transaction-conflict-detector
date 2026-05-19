# Transaction Conflict Detector

A small tool to detect and visualize transaction scheduling conflicts and precedences.

## Features

- Analyze transaction schedules for conflicts and precedences
- Interactive frontend visualization and timeline view
- Quiz mode to practice conflict resolution

## Tech Stack

- Backend: Node.js, Express
- Frontend: React + Vite

## Prerequisites

- Node.js 18+ and npm

## Install

- Clone the repo and install dependencies for both backend and frontend:

```bash
cd "Transaction conflict detector"
cd backend
npm install

cd ../frontend
npm install
```

## Running locally (development)

Open two terminals.

Terminal 1 — start backend:

```bash
cd "Transaction conflict detector"/backend
npm run start
```

By default the backend listens on port `5000` (override with `PORT`).

Terminal 2 — start frontend dev server:

```bash
cd "Transaction conflict detector"/frontend
npm run dev
```

The frontend uses Vite and will typically be available at `http://localhost:5173`.

## Build for production

Build the frontend:

```bash
cd frontend
npm run build
```

Serve the production build with any static server, and run the backend as above.

## Project structure

- backend/
  - `server.js` — Express server entrypoint
  - `routes/` — API routes
  - `controllers/` — route handlers and logic
- frontend/
  - `src/` — React source files
  - `src/components/` — UI components (ConflictList, PrecedenceGraph, QuizMode, etc.)
  - `vite.config.js` — Vite configuration

## API

Backend exposes API endpoints under `/api/schedules` (see [backend/server.js](backend/server.js)).

## Contributing

Feel free to open issues or PRs. For development, run the backend and frontend concurrently in separate terminals.

## License

This project is unlicensed. Add a `LICENSE` file if you want to apply an open-source license.
