import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({ command: "node", args: ["ceidg-mcp-server.js"] });
const client = new Client({ name: "test-client", version: "1.0.0" });

console.log("Łączę się z serwerem MCP (CEIDG) przez stdio (BEZ klucza API — celowo)...");
await client.connect(transport);
console.log("POŁĄCZONO.\n");

const tools = await client.listTools();
if (tools.tools.length !== 1 || tools.tools[0].name !== "ceidg_szukaj_firmy") {
  console.error("BŁĄD"); process.exit(1);
}
console.log("OK: narzędzie 'ceidg_szukaj_firmy' widoczne przez protokół MCP.\n");

const result = await client.callTool({ name: "ceidg_szukaj_firmy", arguments: { nip: "1234567890" } });
const wynik = JSON.parse(result.content[0].text);
console.log("Odpowiedź narzędzia (bez CEIDG_API_KEY):", JSON.stringify(wynik, null, 2));
await client.close();

if (wynik.status === "ERROR" && wynik.detail.includes("CEIDG_API_KEY")) {
  console.log("\nSELF-TEST OK: brak klucza API poprawnie zgłoszony jako czytelny ERROR (nie awaria/wyjątek nieobsłużony).");
  process.exit(0);
} else { console.error("NIEOCZEKIWANY WYNIK"); process.exit(1); }
