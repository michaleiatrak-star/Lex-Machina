// Anonimizator Lex jak lex_anon.mts, z RegistryEnrichment (biała lista VAT / KRS) zasilanym nagranymi
// odpowiedziami rejestrów (REGISTRY_FIXTURES, klucz "<narzędzie>:<numer>"); REGISTRY=off - bez rejestrów.
// Wypisuje też, które numery rejestr dostał (registryKeys) dla każdej strony.
import { readFileSync, writeFileSync } from "node:fs";
const SRC = process.env.LEX_RUNTIME_SRC!;
const { LocalPolishPseudonymizer, PseudonymizationVault } = await import(`${SRC}/privacy/pseudonymizer.ts`);
const { LocalStanzaNamedEntityRecognizer } = await import(`${SRC}/privacy/stanza-ner.ts`);
const { LocalGazetteerRecognizer, CompositeRecognizer } = await import(`${SRC}/privacy/gazetteer-ner.ts`);
const { LocalPersonMorphology } = await import(`${SRC}/privacy/person-morphology.ts`);
const { RegistryEnrichment, registryKeys } = await import(`${SRC}/privacy/registry-enrichment.ts`);
const [, , outName, ...files] = process.argv;
const fixtures = JSON.parse(readFileSync(process.env.REGISTRY_FIXTURES!, "utf8"));
const calls: string[] = [];
const registry = process.env.REGISTRY === "off" ? undefined : new RegistryEnrichment(async (request: any) => {
  const key = `${request.tool}:${String(Object.values(request.arguments)[0])}`;
  calls.push(key);
  return key in fixtures ? { ok: true, result: fixtures[key] } : { ok: false, result: {} };
});
const stanza = new LocalStanzaNamedEntityRecognizer({ requestTimeoutMs: 20 * 60 * 1000 });
const gaz = new LocalGazetteerRecognizer();
const ner = new CompositeRecognizer([stanza, gaz]);
const morph = new LocalPersonMorphology();
const vault = new PseudonymizationVault();
const texts = files.map((f) => readFileSync(f, "utf8"));
for (const [i, text] of texts.entries()) console.log(`s.${i + 1} klucze rejestru:`, JSON.stringify(registryKeys(text)));
const service = new LocalPolishPseudonymizer(vault, ner, morph, registry);
const out: any[] = []; const t = Date.now();
if (texts.length > 1) for (const text of texts) await service.pseudonymize(text);
for (const [i, text] of texts.entries()) {
  const r = await service.pseudonymize(text);
  out.push({ file: files[i], text: r.text, findings: r.findings.map((x: any) => ({ kind: x.kind, uncertain: x.uncertain, value: text.slice(x.start, x.end) })) });
}
console.log("wywołania rejestrów:", JSON.stringify([...new Set(calls)]), "zdarzenia:", JSON.stringify(registry?.events ?? []));
writeFileSync(outName, JSON.stringify({ ms: Date.now() - t, pages: out }, null, 1));
stanza.close(); gaz.close();
process.exit(0);
