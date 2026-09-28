# AGENTS.md

## App overview
- Vite 7 + React 19 SPA ("joke-generator"). No backend; the browser calls JokeAPI (https://v2.jokeapi.dev) directly — free and keyless, so no credentials or secrets are required.
- Features: random joke (single or setup/punchline with reveal), category filter (Programming, Misc, Pun, Spooky, Christmas), favorites persisted to `localStorage` (key `joke-generator:favorites`), share via Web Share API with clipboard fallback.

## Running
- `docker compose -f docker-compose.base44.yml up -d` serves the Vite dev server (hot reload) on host port 3000 → container port 5173.
- The repo is bind-mounted at `/app`; `node_modules` lives in the named volume `web_node_modules` and is installed at container startup from `package.json`.
- Vite config sets `host: true`, `allowedHosts: true`, and a polling watcher so bind-mount edits hot-reload.

## Verify
- `curl -s http://localhost:3000/` returns the `index.html` shell.
- In the preview: "New joke" fetches a fresh joke; the heart button saves to favorites; category chips refetch filtered jokes.
- No database, no migrations, no seeds.
