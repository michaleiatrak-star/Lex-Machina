import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({ command: "node", args: ["krs-mcp-server.js"] });
const client = new Client({ name: "test-client", version: "1.0.0" });

console.log("Łączę się z serwerem MCP (KRS) przez stdio...");
await client.connect(transport);
console.log("POŁĄCZONO — handshake MCP zakończony sukcesem.\n");

const tools = await client.listTools();
console.log("tools/list zwróciło:", JSON.stringify(tools.tools.map(t => ({name: t.name})), null, 2));
if (tools.tools.length !== 1 || tools.tools[0].name !== "krs_lookup") {
  console.error("BŁĄD: oczekiwano 'krs_lookup'"); process.exit(1);
}
console.log("OK: narzędzie 'krs_lookup' widoczne przez protokół MCP.\n");

const result = await client.callTool({ name: "krs_lookup", arguments: { numerKrs: "0000123456" } });
const wynik = JSON.parse(result.content[0].text);
console.log("Odpowiedź narzędzia:", JSON.stringify(wynik, null, 2));
await client.close();

if (wynik.status === "ERROR" && wynik.source === "krs") {
  console.log("\nSELF-TEST OK: protokół MCP działa end-to-end, ERROR poprawnie zgłoszony (brak dostępu do api-krs.ms.gov.pl w tym środowisku).");
  process.exit(0);
} else {
  console.error("SELF-TEST NIEOCZEKIWANY WYNIK."); process.exit(1);
}
