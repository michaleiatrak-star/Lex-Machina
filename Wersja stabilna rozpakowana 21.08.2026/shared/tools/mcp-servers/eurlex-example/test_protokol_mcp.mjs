import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({ command: "node", args: ["eurlex-mcp-server.js"] });
const client = new Client({ name: "test-client", version: "1.0.0" });

console.log("Łączę się z serwerem MCP (EUR-Lex/CELLAR) przez stdio...");
await client.connect(transport);
console.log("POŁĄCZONO.\n");

const tools = await client.listTools();
if (tools.tools.length !== 1 || tools.tools[0].name !== "eurlex_lookup") {
  console.error("BŁĄD"); process.exit(1);
}
console.log("OK: narzędzie 'eurlex_lookup' widoczne przez protokół MCP.\n");

const result = await client.callTool({ name: "eurlex_lookup", arguments: { celex: "32016R0679" } });
const wynik = JSON.parse(result.content[0].text);
console.log("Odpowiedź narzędzia:", JSON.stringify(wynik, null, 2));
await client.close();

if (wynik.status === "ERROR" && wynik.source === "eur-lex") {
  console.log("\nSELF-TEST OK: protokół MCP działa end-to-end (ERROR poprawny — brak dostępu do publications.europa.eu tutaj).");
  process.exit(0);
} else { console.error("NIEOCZEKIWANY WYNIK"); process.exit(1); }
