import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: ["saos-mcp-server.js"],
});

const client = new Client({ name: "test-client", version: "1.0.0" });

console.log("Łączę się z serwerem MCP (SAOS) przez stdio...");
await client.connect(transport);
console.log("POŁĄCZONO — handshake MCP zakończony sukcesem.\n");

const tools = await client.listTools();
console.log("tools/list zwróciło:", JSON.stringify(tools.tools.map(t => ({name: t.name, title: t.title})), null, 2));

if (tools.tools.length !== 1 || tools.tools[0].name !== "saos_search") {
  console.error("\nBŁĄD: oczekiwano dokładnie 1 narzędzia 'saos_search'");
  process.exit(1);
}
console.log("\nOK: narzędzie 'saos_search' poprawnie zarejestrowane i widoczne przez protokół MCP.\n");

console.log("Wywołuję saos_search({fraza: 'zniesienie współwłasności'}) — oczekuję ERROR,");
console.log("bo to środowisko nie ma dostępu sieciowego do saos.org.pl.\n");

const result = await client.callTool({
  name: "saos_search",
  arguments: { fraza: "zniesienie współwłasności", courtType: "COMMON" },
});
const wynik = JSON.parse(result.content[0].text);
console.log("Odpowiedź narzędzia (przez pełny protokół MCP tools/call):");
console.log(JSON.stringify(wynik, null, 2));

await client.close();

if (wynik.status === "ERROR" && wynik.source === "saos") {
  console.log("\nSELF-TEST OK: pełny cykl protokołu MCP (connect → listTools → callTool → close)");
  console.log("zadziałał poprawnie end-to-end dla serwera SAOS. Narzędzie poprawnie zgłosiło");
  console.log("ERROR przy braku dostępu sieciowego, zamiast się wywalić.");
  process.exit(0);
} else {
  console.error("\nSELF-TEST NIEOCZEKIWANY WYNIK (sprawdź ręcznie powyżej).");
  process.exit(1);
}
