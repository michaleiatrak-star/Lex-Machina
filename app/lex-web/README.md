# Lex Machina Local Web UI

Browser UI for the local Lex runtime.

## Start

Terminal 1:

```bash
cd app/lex-runtime
npm install
npm start
```

Terminal 2:

```bash
cd app/lex-web
npm install
npm run dev
```

Open:

`http://127.0.0.1:5173`

The browser receives no provider credentials and no Lex `SKILL.md` prompt bodies.
Provider model discovery is performed by the local runtime at `127.0.0.1:4317`.

Optional development override:

```bash
VITE_LEX_API_BASE=http://127.0.0.1:4317 npm run dev
```

Do not place API keys in `VITE_*` variables. Vite variables are browser-visible.
