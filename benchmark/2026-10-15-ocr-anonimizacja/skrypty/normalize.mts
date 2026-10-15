// Linie OCR -> jak DocumentService.review: restoreOcrSpacing (slownik SGJP) -> normalizeOcrPage
// (czyszczenie bez modelu, w tym kwoty) -> tekst strony.
// Uzycie: LEX_RUNTIME_SRC=... LEX_NER_PYTHON=... npx tsx normalize.mts paddle.json out/prefix   (pisze prefix_p{n}.txt)
import { readFileSync, writeFileSync } from "node:fs";
const SRC = process.env.LEX_RUNTIME_SRC!;
const { normalizeOcrPage } = await import(`${SRC}/ocr-correction.ts`);
const { restoreOcrSpacing } = await import(`${SRC}/ocr-spacing.ts`);
const { LocalPersonMorphology } = await import(`${SRC}/privacy/person-morphology.ts`);
const morph = new LocalPersonMorphology();
const known = (words: string[]) => morph.knownWords(words);
const [, , input, prefix] = process.argv;
let fixes = 0;
for (const p of JSON.parse(readFileSync(input!, "utf8"))) {
  const spaced = await restoreOcrSpacing({ page: p.page, source: "OCR", text: p.text, lines: p.lines }, known);
  const page = normalizeOcrPage(spaced);
  fixes += (page.corrections ?? []).length;
  for (const c of page.corrections ?? []) console.log(`s.${p.page}: ${c.from} -> ${c.to}`);
  writeFileSync(`${prefix}_p${p.page}.txt`, page.text);
}
console.log(`poprawek: ${fixes}`);
process.exit(0);
