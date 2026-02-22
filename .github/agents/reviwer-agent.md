(Reviewer agent checklist and verification steps for the Real-time Chatroom MVP.)

Goal

- Verify the implementation meets the MVP requirements: single public chatroom, username entry (no auth), real-time messaging via WebSocket, basic Tailwind UI, in-memory storage, works across multiple tabs.

Quick verification steps

1. Start backend

   cd backend
   npm install
   npm run start:dev

2. Start frontend

   cd frontend
   npm install
   npm run dev

3. Manual acceptance tests

- Open http://localhost:3000 in two or more tabs.
- Enter different usernames in each tab (no auth required).
- Verify that when a message is sent from one tab it appears in all tabs in under a second.
- Reload a tab and ensure it receives recent history via the `history` event.

Code review checklist

- Backend:
  - `chat.gateway.ts`: Ensure `handleConnection` emits `history` and `@SubscribeMessage('message')` delegates to `ChatService`.
  - `chat.service.ts`: Validate in-memory storage logic (pruning/limits), correct message shape `{ id, username, text, ts }`, and id generation is deterministic enough for uniqueness in MVP.
  - `main.ts`: Ensure CORS and port configuration allow local dev connections.
  - `tsconfig.json` and `package.json` scripts: dev workflow present (`start:dev`) and build scripts defined.

- Frontend:
  - `pages/index.tsx`: Check `socket.io-client` connection to `http://localhost:4000`, handlers for `history` and `message`, and that messages are appended in order.
  - UI: verify scroll-to-bottom behavior, Enter key sends a message, input cleared after send, and theme toggle toggles `dark` class.
  - Types: message types and state typed with TypeScript.

- Cross-cutting concerns:
  - Message format stability: front and back agree on fields and types.
  - No DB assumptions: ensure data remains in-memory and is bounded (e.g., history slice).
  - XSS: ensure text is rendered safely (React escapes content by default). Note any places where dangerouslySetInnerHTML is used — flag for remediation.
  - Error handling: gateway does not crash on malformed messages and client handles disconnects gracefully.

Suggested security and quality notes (MVP -> production)

- Add rate-limiting on message sends.
- Sanitize and/or validate message length and content server-side.
- Introduce authentication and per-room ACLs if making rooms private.
- Replace in-memory store with a durable store and use pub/sub for horizontal scaling.

Reporting issues

- When filing review issues, reference file paths and line ranges and include reproduction steps (start commands, URLs, screenshots or logs if available).

Acceptance criteria (check to pass)

- Real-time messages appear in all open tabs within a second of send.
- History is delivered on connect.
- Frontend and backend build and run with provided scripts.
- No uncaught runtime exceptions during normal messaging flows.
