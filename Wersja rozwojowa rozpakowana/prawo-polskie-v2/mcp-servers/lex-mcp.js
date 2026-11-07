// lex-mcp.js — jeden punkt wejścia dla wszystkich serwerów MCP Lex Machina (AUDYT-2026-09-27m).
// Budowany esbuildem do dist/lex-mcp.mjs z wbudowanymi zależnościami (SDK MCP, zod), żeby działał
// z katalogu pluginu bez `npm install` — Claude Code nie instaluje zależności pluginów.
// Użycie: node dist/lex-mcp.mjs <serwer>
const SERWERY = {
  isap: () => import("./isap-eli-example/isap-eli-mcp-server.js"),
  saos: () => import("./saos-example/saos-mcp-server.js"),
  krs: () => import("./krs-example/krs-mcp-server.js"),
  nbp: () => import("./nbp-example/nbp-mcp-server.js"),
  eurlex: () => import("./eurlex-example/eurlex-mcp-server.js"),
  eureka: () => import("./eureka-example/eureka-mcp-server.js"),
  sudop: () => import("./sudop-example/sudop-mcp-server.js"),
  ceidg: () => import("./ceidg-example/ceidg-mcp-server.js"),
  cbosa: () => import("./cbosa-example/cbosa-mcp-server.js"),
  sn: () => import("./sn-example/sn-mcp-server.js"),
  sp: () => import("./sp-example/sp-mcp-server.js"),
  tk: () => import("./tk-example/tk-mcp-server.js"),
  kio: () => import("./kio-example/kio-mcp-server.js"),
  etpcz: () => import("./etpcz-example/etpcz-mcp-server.js"),
  uodo: () => import("./uodo-example/uodo-mcp-server.js"),
  wl: () => import("./wl-example/wl-mcp-server.js"),
};
// Od 2026-09-29b (AUDYT-2026-09-29b): argument może być LISTĄ po przecinku („isap,krs,ceidg”) —
// rozszerzenie MCPB i instalator uruchamiają wtedy tylko serwery wybrane przez użytkownika w FAZIE 0E.
const nazwa = process.argv[2] ?? "";
const lista = nazwa === "wszystkie" ? Object.keys(SERWERY) : nazwa.split(",").map((x) => x.trim()).filter(Boolean);
const nieznane = lista.filter((n) => !SERWERY[n]);
if (!lista.length || nieznane.length) {
  console.error(`Użycie: node lex-mcp.mjs <${Object.keys(SERWERY).join("|")}|wszystkie|lista,po,przecinku>` +
    (nieznane.length ? ` — nieznane: ${nieznane.join(", ")}` : ""));
  process.exit(2);
} else if (lista.length > 1 || nazwa === "wszystkie") {
  // Jeden serwer z narzędziami wybranych konektorów (MCPB uruchamia jeden proces). Moduły widzą
  // __LEX_MCP_WSPOLNY: rejestrują narzędzia na nim i nie łączą się same.
  const { McpServer } = await import("@modelcontextprotocol/sdk/server/mcp.js");
  const { StdioServerTransport } = await import("@modelcontextprotocol/sdk/server/stdio.js");
  globalThis.__LEX_MCP_WSPOLNY = new McpServer({ name: "lex-machina", version: "1.1.0" });
  for (const n of lista) {
    if (n === "ceidg" && !process.env.CEIDG_API_KEY) continue; // bez klucza zwraca wyłącznie błędy
    await SERWERY[n]();
  }
  await globalThis.__LEX_MCP_WSPOLNY.connect(new StdioServerTransport());
  console.error(`lex-mcp: ${lista.join(", ")} na jednym połączeniu (stdio)`);
} else {
  await SERWERY[lista[0]]();
}
