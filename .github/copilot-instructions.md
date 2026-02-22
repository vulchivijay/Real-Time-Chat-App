(This file documents how Copilot-style agents should reason about and modify the Real-time Chatroom MVP.)

Purpose

- Provide clear, actionable guidance for editing, extending, and maintaining the chat MVP.

Architecture Overview

- Frontend: Next.js (TypeScript, pages/) using `socket.io-client` to talk to the backend. UI is in `frontend/pages/index.tsx`.
- Styling: Tailwind CSS (light/dark via `class="dark"` on `<html>`). Config in `frontend/tailwind.config.js` and global styles in `frontend/styles/globals.css`.
- Backend: NestJS WebSocket gateway using Socket.IO (server entry `backend/src/main.ts`, gateway `backend/src/chat.gateway.ts`, service `backend/src/chat.service.ts`).
- Data: In-memory message store (no DB) held in `ChatService`. Messages are simple objects: `{ id, username, text, ts }`.
- Ports: Frontend runs on port 3000, backend on 4000 (CORS enabled for development).

WebSocket contract (events)

- Client -> Server:
  - `message` with payload `{ username: string, text: string }` — client submits a new chat message.
- Server -> Client:
  - `history` with payload `ChatMessage[]` — sent once on connect (recent messages up to configured limit).
  - `message` with payload `ChatMessage` — broadcasted to all clients when a new message is accepted.

Coding & Architecture Guidelines

- Keep the WebSocket event contract stable: change event names only with coordinated frontend and backend updates.
- Keep business logic out of the gateway: `ChatGateway` should delegate to `ChatService` for storage and validation.
- Type everything: prefer explicit TypeScript interfaces for messages and payloads.
- Avoid adding persistent storage in this MVP; if adding persistence, keep it behind a service interface and make it swappable.
- Keep the message size and history limits modest (currently an in-memory slice). Add pruning or limits before increasing retention.
- Security: the frontend relies on React to escape text by default; avoid injecting raw HTML. Validate and rate-limit messages if adding public deployment.

Developer workflows

- Run backend:

  cd backend
  npm install
  npm run start:dev

- Run frontend:

  cd frontend
  npm install
  npm run dev

- Manual verification: open http://localhost:3000 in multiple tabs, enter a username, and verify messages appear in all tabs (history on connect + live broadcast).

When making changes

- If you change message shape or event names: update both `frontend/pages/index.tsx` and `backend/src/chat.gateway.ts`, and add migration notes to the README.
- If you add dependencies, prefer minimal, well-maintained packages. For simple utilities (like id generation) prefer in-repo lightweight implementations to avoid bloat for MVP.
- Keep UI changes accessible: avoid relying on complex frameworks; Tailwind utilities are preferred.

Testing & Verification

- Smoke test: start both dev servers and verify cross-tab messaging and history delivery.
- Linting/build: ensure `tsc` builds pass for both `backend` and `frontend` after changes.

Notes for future improvements

- Add user presence (joins/leave) with events like `presence`.
- Replace in-memory store with a persistent DB or Redis pub/sub for multiple backend instances.
- Add message persistence, search, pagination, and moderation tools.
