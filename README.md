# Task manager (Next.js 15 + tRPC)

Demo app: in-memory task CRUD, **tRPC** API, **Next.js 15** (App Router) UI with **SSR** on the list and **infinite scroll** to load more items on the client.

## Requirements

- Node.js 20+ (recommended)
- npm

## How to run

```bash
cd task-manager
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- **List** (`/`): first page of tasks rendered on the server; scrolling loads more blocks.
- **New task** (`/task/new`): form with title validation on the client and on the server.
- **Edit** (`/task/[id]/editar`): same task loaded on the server from in-memory storage.

Production build:

```bash
npm run build
npm start
```

## Key decisions

1. **tRPC + `superjson`**: end-to-end typing and `Date` support in serialization.
2. **`appRouter.createCaller` on the server**: the home page reuses the same logic as the `task.list` endpoint, with no extra HTTP, satisfying the requested SSR.
3. **Storage in `src/server/db/tasks.ts`**: a Node process in-memory array; restarting the server clears data (intended for this challenge).
4. **Infinite scroll**: `task.list` accepts `limit` and `cursor` (id of the last item from the previous page); the client uses `useInfiniteQuery` and `IntersectionObserver`.
5. **Errors**: Zod validation on mutations; `TRPCError` with clear messages when updating or deleting a non-existent task.

## Public repository delivery

Do not include credentials, tokens, or real personal data. This project does not use secret environment variables.
