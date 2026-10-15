// Domyslny lancuch anonimizatora Lex (bez lokalnego AI): identyfikatory + Stanza + gazeter + morfologia.
// Uzycie: LEX_RUNTIME_SRC=<lex-machina-aplikacja>/app/lex-runtime/src STANZA_RESOURCES_DIR=... LEX_NER_PYTHON=... npx tsx lex_anon.mts out.json p1.txt p2.txt p3.txt
import { readFileSync, writeFileSync } from "node:fs";
const SRC = process.env.LEX_RUNTIME_SRC!;
const { LocalPolishPseudonymizer, PseudonymizationVault } = await import(`${SRC}/privacy/pseudonymizer.ts`);
const { LocalStanzaNamedEntityRecognizer } = await import(`${SRC}/privacy/stanza-ner.ts`);
const { LocalGazetteerRecognizer, CompositeRecognizer } = await import(`${SRC}/privacy/gazetteer-ner.ts`);
const { LocalPersonMorphology } = await import(`${SRC}/privacy/person-morphology.ts`);
const [, , outName, ...files] = process.argv;
const stanza = new LocalStanzaNamedEntityRecognizer();
const gaz = new LocalGazetteerRecognizer();
const ner = new CompositeRecognizer([stanza, gaz]);
const morph = new LocalPersonMorphology();
// Jak DocumentService.finalize: jeden sejf na dokument; przy kilku stronach pierwszy
// przebieg zbiera osoby i firmy ze wszystkich stron, drugi maskuje.
// LEX_SINGLE_PASS=1: jak podgląd (preview) - jeden przebieg.
const out: any[] = [];
const t = Date.now();
const vault = new PseudonymizationVault();
const texts = files.map((f) => readFileSync(f, "utf8"));
const service = new LocalPolishPseudonymizer(vault, ner, morph);
if (texts.length > 1 && process.env.LEX_SINGLE_PASS !== "1") for (const text of texts) await service.pseudonymize(text);
for (const [i, text] of texts.entries()) {
  const r = await service.pseudonymize(text);
  out.push({ file: files[i], text: r.text, findings: r.findings.map((x: any) => ({ ...x, value: text.slice(x.start, x.end) })) });
}
writeFileSync(outName, JSON.stringify({ ms: Date.now() - t, pages: out }, null, 1));
stanza.close(); gaz.close();
process.exit(0);
