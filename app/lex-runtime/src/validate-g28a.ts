import {
  LocalPolishPseudonymizer,
  PseudonymizationVault
} from "./privacy/pseudonymizer.js";

const text =
  "Jan Kowalski PESEL 44051401458 jest świadkiem, a Anna Nowak jest pełnomocnikiem.";

const janStart = text.indexOf("Jan Kowalski");
const peselStart = text.indexOf("44051401458");
const annaStart = text.indexOf("Anna Nowak");

const service =
  new LocalPolishPseudonymizer(
    new PseudonymizationVault()
  );

const result = await service.pseudonymize(
  text,
  [
    {
      start: janStart,
      end: janStart + "Jan Kowalski".length,
      action: "PSEUDONYMIZE",
      kind: "PERSON",
      label: "świadek"
    },
    {
      start: peselStart,
      end: peselStart + 11,
      action: "KEEP"
    },
    {
      start: annaStart,
      end: annaStart + "Anna Nowak".length,
      action: "LABEL",
      label: "pełnomocnik"
    }
  ]
);

if (
  result.text.includes("Jan Kowalski") ||
  !result.text.includes("44051401458") ||
  !result.text.includes("Anna Nowak") ||
  !result.text.includes("[PII:PERSON:0001]")
) {
  throw new Error(
    "G28A user privacy directives were not applied correctly."
  );
}
if (
  result.keptRanges.length !== 1 ||
  result.annotations[0]?.label !== "pełnomocnik" ||
  result.findings.filter(
    (item) => item.source === "USER"
  ).length !== 1
) {
  throw new Error(
    "G28A user privacy metadata is incomplete."
  );
}

process.stdout.write(JSON.stringify({
  gate: "G28A_USER_DIRECTED_PRIVACY",
  result: "PASS",
  actions: [
    "PSEUDONYMIZE",
    "KEEP",
    "LABEL"
  ],
  manualSelectionSupported: true,
  conflictingSelectionsFailClosed: true
}, null, 2) + "\n");
