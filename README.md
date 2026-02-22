# Real-time Chatroom MVP

This repository contains a minimal real-time chatroom MVP:

- Backend: NestJS WebSocket gateway (port 4000)
- Frontend: Next.js + Tailwind CSS (port 3000)

Quick start

1. Backend

```bash
cd backend
npm install
npm run start:dev
```

2. Frontend (in a separate terminal)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 in multiple tabs and join with a username.

Notes

- In-memory message storage (no DB).
- Single public room; messages broadcast to all connected clients.
- Tailwind is configured; toggling theme is available in the UI.

# Real-Time-Chat-App

Simple Next.js + NestJS WebSocket
