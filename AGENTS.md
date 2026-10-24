# AGENTS.md

## What this app is
Random joke generator: a single-page Vite + React app that fetches jokes from
JokeAPI v2 (https://v2.jokeapi.dev, CORS-enabled, no API key), with category
filtering, localStorage favorites, and share (Web Share API / clipboard).

## Run & verify
- `docker compose -f docker-compose.base44.yml up -d` — web dev server (Vite, node:22)
  bind-mounted from source, host port 3000 → container 5173.
- Dependencies are installed at container start (`npm install`) from package.json.
- Verify: `curl http://localhost:3000/` should return the Vite-served `index.html`
  (not a prebuilt bundle), then open the preview and load a category.

## Quirks
- No backend and no secrets: the only external dependency is JokeAPI v2, which
  requires no credentials. `.base44/environment.json` records an empty secrets list.
- Favorites are stored in the browser's localStorage under
  `joke-generator-favorites` (plain JSON array of joke objects).
- The "Minecraft" category is NOT from JokeAPI (it has no such category): it is a
  curated, family-friendly local list in `src/lib/jokes.js` (MINECRAFT_JOKES),
  shuffled client-side with stable `minecraft-*` ids so favorites persist.
- Vite 5.4.21 DOES enforce a Host allowlist (backported security patch): the
  preview proxy sends `Host: <port>-<sandbox id>.<BASE44_SANDBOX_HOST_DOMAIN>`,
  so `vite.config.js` adds `allowedHosts: ['.<sandbox host domain>']` only when
  `BASE44_PREVIEW_MODE === '1'`; `BASE44_SANDBOX_HOST_DOMAIN` is passed through
  the compose `environment:`. Without the flag the default strict behavior stays.
  It binds 0.0.0.0 with `strictPort` on 5173.
