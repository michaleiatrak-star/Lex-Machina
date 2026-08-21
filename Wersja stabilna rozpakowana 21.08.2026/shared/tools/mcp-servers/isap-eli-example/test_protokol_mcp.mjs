import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: ["isap-eli-mcp-server.js"],
});

const client = new Client({ name: "test-client", version: "1.0.0" });

console.log("Łączę się z serwerem MCP przez stdio (prawdziwy handshake protokołu)...");
await client.connect(transport);
console.log("POŁĄCZONO — handshake MCP zakończony sukcesem.\n");

const tools = await client.listTools();
console.log("tools/list zwróciło:", JSON.stringify(tools.tools.map(t => ({name: t.name, title: t.title})), null, 2));

if (tools.tools.length !== 1 || tools.tools[0].name !== "isap_lookup") {
  console.error("\nBŁĄD: oczekiwano dokładnie 1 narzędzia 'isap_lookup'");
  process.exit(1);
}
console.log("\nOK: narzędzie 'isap_lookup' poprawnie zarejestrowane i widoczne przez protokół MCP.\n");

console.log("Wywołuję isap_lookup({query: 'Kodeks cywilny'}) — oczekuję ERROR,");
console.log("bo to środowisko nie ma dostępu sieciowego do api.sejm.gov.pl (poza listą dozwolonych domen).\n");

const result = await client.callTool({ name: "isap_lookup", arguments: { query: "Kodeks cywilny" } });
const wynik = JSON.parse(result.content[0].text);
console.log("Odpowiedź narzędzia (przez pełny protokół MCP tools/call):");
console.log(JSON.stringify(wynik, null, 2));

await client.close();

if (wynik.status === "ERROR" && wynik.source === "sejm-eli") {
  console.log("\nSELF-TEST OK: pełny cykl protokołu MCP (connect → listTools → callTool → close)");
  console.log("zadziałał poprawnie end-to-end. Narzędzie poprawnie zgłosiło ERROR przy braku");
  console.log("dostępu sieciowego do api.sejm.gov.pl, zamiast się wywalić — dokładnie zgodnie");
  console.log("z projektową zasadą 'MCP niedostępne = ERROR, nie crash'.");
  process.exit(0);
} else {
  console.error("\nSELF-TEST NIEOCZEKIWANY WYNIK (sprawdź ręcznie powyżej).");
  process.exit(1);
}
