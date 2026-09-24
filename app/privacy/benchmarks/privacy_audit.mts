/**
 * Anonymization / deanonymization audit on privacy-audit-set.json.
 *
 * Every document goes through the real LocalPolishPseudonymizer with the
 * SGJP gazetteer recognizer, the identifier detectors and the Morfeusz2
 * morphology worker (Stanza is not used here: its models are not available
 * in this environment, so the numbers are a lower bound for recall).
 *
 * Measured:
 * - leaks: a gold mention with any letter or digit left in clear text,
 * - false positives: replaced spans outside every gold mention,
 * - one token per person / per address across all of its case forms,
 * - restore: the value put back for each of the 7 cases vs the gold form,
 *   and whether a wrong form was flagged for review or silent.
 *
 * Run: npx tsx privacy_audit.mts <set.json> <python> [out.json]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { LocalGazetteerRecognizer } from "../../lex-runtime/src/privacy/gazetteer-ner.js";
import { LocalPersonMorphology } from "../../lex-runtime/src/privacy/person-morphology.js";
import {
  LocalPolishPseudonymizer,
  PseudonymizationVault
} from "../../lex-runtime/src/privacy/pseudonymizer.js";
import { restoreWithReport } from "../../lex-runtime/src/privacy/restoration-report.js";

type Mention = { start: number; end: number; kind: string; key: string | null; text: string };
type Doc = {
  text: string;
  mentions: Mention[];
  person: { forms: Record<string, string[]>; gender: string; invented: boolean };
  address: { forms: Record<string, string> };
};

const CASES = ["NOM", "GEN", "DAT", "ACC", "INS", "LOC", "VOC"] as const;
const [setPath, python, outPath] = process.argv.slice(2);
if (!setPath || !python) throw new Error("usage: privacy_audit.mts <set.json> <python> [out.json]");
const data = JSON.parse(readFileSync(setPath, "utf8")) as { documents: Doc[] };

const recognizer = new LocalGazetteerRecognizer({ python });
const morphology = new LocalPersonMorphology({ python });

type Counter = Record<string, { total: number; leaked: number; wrongKind: number }>;
const mentionStats: Counter = {};
let falsePositives = 0;
const falsePositiveSamples: string[] = [];
let decoyHits = 0;
let personSplit = 0;
const splitSamples: string[] = [];
let addressSplit = 0;
let invalidTokens = 0;
const restore = {
  PERSON: Object.fromEntries(CASES.map((c) => [c, { right: 0, wrong: 0, flagged: 0, silentWrong: 0 }])),
  ADDRESS: Object.fromEntries(CASES.map((c) => [c, { right: 0, wrong: 0, flagged: 0, silentWrong: 0 }]))
} as Record<"PERSON" | "ADDRESS", Record<string, { right: number; wrong: number; flagged: number; silentWrong: number }>>;
const restoreSamples: string[] = [];
const leakSamples: string[] = [];
let answersExact = 0;

function bump(kind: string) {
  return (mentionStats[kind] ??= { total: 0, leaked: 0, wrongKind: 0 });
}

async function audit(doc: Doc, index: number): Promise<void> {
  const vault = new PseudonymizationVault();
  const result = await new LocalPolishPseudonymizer(vault, recognizer, morphology).pseudonymize(doc.text);
  const findings = result.findings;
  const gold = doc.mentions.filter((m) => m.kind !== "DECOY");

  for (const mention of gold) {
    const stats = bump(
      mention.key === "SURNAME"
        ? "PERSON (surname alone)"
        : mention.key === "OTHER"
          ? "PERSON (second person)"
          : mention.key === "NOM_UPPER"
            ? "PERSON (upper case)"
            : mention.kind
    );
    stats.total += 1;
    const covered = new Array(mention.end - mention.start).fill(false);
    for (const finding of findings) {
      for (let at = Math.max(finding.start, mention.start); at < Math.min(finding.end, mention.end); at += 1) {
        covered[at - mention.start] = true;
      }
    }
    const leaked = [...mention.text].some((char, offset) => /[\p{L}\p{N}]/u.test(char) && !covered[offset]);
    if (leaked) {
      stats.leaked += 1;
      if (leakSamples.length < 40) leakSamples.push(`${mention.kind}:${mention.text}`);
    }
    const best = findings.find((f) => f.start < mention.end && mention.start < f.end);
    if (best && best.kind !== mention.kind) stats.wrongKind += 1;
  }

  for (const finding of findings) {
    const overlapsGold = gold.some((m) => finding.start < m.end && m.start < finding.end);
    if (!overlapsGold) {
      falsePositives += 1;
      if (falsePositiveSamples.length < 40) falsePositiveSamples.push(`${finding.kind}:${doc.text.slice(finding.start, finding.end)}`);
      if (doc.mentions.some((m) => m.kind === "DECOY" && finding.start < m.end && m.start < finding.end)) decoyHits += 1;
    }
  }

  const tokenOf = (mention: Mention) =>
    findings.find((f) => f.start <= mention.start && mention.end <= f.end && f.kind === mention.kind)?.token;
  const personTokens = new Set(
    gold.filter((m) => m.kind === "PERSON" && m.key !== "SURNAME" && m.key !== "OTHER").map(tokenOf)
  );
  const addressTokens = new Set(gold.filter((m) => m.kind === "ADDRESS").map(tokenOf));
  if (personTokens.size !== 1 || personTokens.has(undefined)) {
    personSplit += 1;
    if (splitSamples.length < 30) {
      splitSamples.push(
        gold.filter((m) => m.kind === "PERSON" && m.key !== "SURNAME" && m.key !== "OTHER").map((m) => `${m.text}=>${tokenOf(m) ?? "-"}`).join(" | ")
      );
    }
  }
  if (addressTokens.size !== 1 || addressTokens.has(undefined)) addressSplit += 1;

  // A model answer that uses the tokens in every case.
  const personToken = [...personTokens].find(Boolean);
  const addressToken = [...addressTokens].find(Boolean);
  for (const [kind, token] of [["PERSON", personToken], ["ADDRESS", addressToken]] as const) {
    if (!token || !vault.hasToken(token)) {
      invalidTokens += 1;
      continue;
    }
    const entity = vault.entity(token);
    for (const personCase of CASES) {
      const restored = vault.restore(token, personCase);
      const expected = kind === "PERSON" ? doc.person.forms[personCase]! : [doc.address.forms[personCase]!];
      const ok = expected.includes(restored.text);
      const flagged =
        restored.status !== "ok" || restored.confidence < 0.8 || Boolean(entity && entity.status !== "ok");
      const cell = restore[kind][personCase]!;
      if (ok) cell.right += 1;
      else {
        cell.wrong += 1;
        if (flagged) cell.flagged += 1;
        else {
          cell.silentWrong += 1;
          if (restoreSamples.length < 40) restoreSamples.push(`${kind} ${personCase}: got "${restored.text}", gold ${JSON.stringify(expected)}`);
        }
      }
    }
  }
  if (personToken && addressToken) {
    const answer =
      `Wzywam ${personToken.slice(0, -1)}|ACC] do zapłaty. Pismo doręczono ${personToken.slice(0, -1)}|DAT] ` +
      `zamieszkałemu przy ${addressToken.slice(0, -1)}|LOC]. Adres: ${addressToken}.`;
    const restored = restoreWithReport(answer, vault).text;
    const expectedAnswers = doc.person.forms.ACC!.flatMap((acc) =>
      doc.person.forms.DAT!.map((dat) =>
        `Wzywam ${acc} do zapłaty. Pismo doręczono ${dat} zamieszkałemu przy ${doc.address.forms.LOC}. Adres: ${doc.address.forms.NOM}.`
      )
    );
    if (expectedAnswers.includes(restored)) answersExact += 1;
  }
  if ((index + 1) % 50 === 0) process.stderr.write(`audited ${index + 1}\n`);
}

const started = Date.now();
const queue = data.documents.map((doc, index) => ({ doc, index }));
await Promise.all(
  Array.from({ length: 6 }, async () => {
    for (let item = queue.shift(); item; item = queue.shift()) await audit(item.doc, item.index);
  })
);

const pct = (a: number, b: number) => (b ? Math.round((a / b) * 10000) / 100 : 0);
const summarize = (kind: "PERSON" | "ADDRESS") => {
  const cells = Object.values(restore[kind]);
  const right = cells.reduce((s, c) => s + c.right, 0);
  const total = cells.reduce((s, c) => s + c.right + c.wrong, 0);
  return {
    formAccuracy: pct(right, total),
    byCase: Object.fromEntries(Object.entries(restore[kind]).map(([c, v]) => [c, pct(v.right, v.right + v.wrong)])),
    wrong: cells.reduce((s, c) => s + c.wrong, 0),
    wrongFlaggedForReview: cells.reduce((s, c) => s + c.flagged, 0),
    wrongNotFlagged: cells.reduce((s, c) => s + c.silentWrong, 0)
  };
};
const report = {
  documents: data.documents.length,
  seconds: Math.round((Date.now() - started) / 1000),
  recognizers: "SGJP gazetteer + identifier detectors + Morfeusz2 morphology (no Stanza, no local LLM)",
  anonymization: {
    mentions: Object.fromEntries(
      Object.entries(mentionStats).map(([kind, s]) => [
        kind,
        { mentions: s.total, leaked: s.leaked, recall: pct(s.total - s.leaked, s.total), wrongKind: s.wrongKind }
      ])
    ),
    falsePositives,
    falsePositivesOnDecoys: decoyHits,
    falsePositiveSamples,
    leakSamples
  },
  identity: {
    documentsWherePersonSplitIntoSeveralTokens: personSplit,
    documentsWhereAddressSplitIntoSeveralTokens: addressSplit,
    splitSamples
  },
  deanonymization: {
    person: summarize("PERSON"),
    address: summarize("ADDRESS"),
    modelAnswersRestoredExactly: pct(answersExact, data.documents.length),
    missingTokens: invalidTokens,
    silentWrongSamples: restoreSamples
  }
};
const json = JSON.stringify(report, null, 1);
if (outPath) writeFileSync(outPath, json + "\n", "utf8");
console.log(json);
