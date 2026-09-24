import type { PseudonymizationVault } from "./pseudonymizer.js";

export type TokenGender = "m" | "f" | "unknown";

/** What a model may know about a placeholder: its kind and, for a person, grammatical gender. */
export type PlaceholderGrammar = {
  token: string;
  kind: "PERSON" | "ADDRESS";
  gender?: TokenGender;
};

const PLACEHOLDER =
  /\[(?:LMPII:D\d{2}|PII):(PERSON|ADDRESS):\d{4}(?:\|[A-Z]{2,4})?\]/g;

/** Base form of a placeholder: the case suffix removed. */
export function placeholderBase(token: string): string {
  return token.replace(/\|[A-Z]{2,4}\]$/, "]");
}

export function genderOf(
  vault: Pick<PseudonymizationVault, "entity">,
  token: string
): TokenGender {
  const entity = vault.entity(token);
  if (!entity || entity.status === "gender_ambiguous") return "unknown";
  return entity.gender === "f" ? "f" : entity.gender === "m1" ? "m" : "unknown";
}

/** Person and address placeholders in the text, with gender from the vault. */
export function placeholderGrammar(
  text: string,
  vault: Pick<PseudonymizationVault, "entity">
): PlaceholderGrammar[] {
  const seen = new Map<string, PlaceholderGrammar>();
  for (const match of text.matchAll(PLACEHOLDER)) {
    const token = placeholderBase(match[0]);
    if (seen.has(token)) continue;
    const kind = match[1] as "PERSON" | "ADDRESS";
    seen.set(token, kind === "PERSON" ? { token, kind, gender: genderOf(vault, token) } : { token, kind });
  }
  return [...seen.values()];
}

const GENDER_LINE: Record<TokenGender, string> = {
  f: "osoba, rodzaj żeński - uzgadniaj formy żeńskie (np. „wniosła”, „pozwana”, „była zatrudniona”)",
  m: "osoba, rodzaj męski - uzgadniaj formy męskie (np. „wniósł”, „pozwany”, „był zatrudniony”)",
  unknown:
    "osoba, rodzaj nieustalony - nie zgaduj; pisz formami neutralnymi (np. „strona wniosła”, „osoba ta”)"
};

/**
 * The key sent to the model with pseudonymized text: which placeholder is a
 * person (and of which gender) and which an address. Gender only lets the
 * model agree verbs and adjectives; the name and the address stay local.
 */
export function placeholderKeyPrompt(entries: PlaceholderGrammar[]): string | null {
  if (!entries.length) return null;
  const lines = entries
    .slice(0, 200)
    .map((entry) =>
      `- ${entry.token}: ${entry.kind === "PERSON" ? GENDER_LINE[entry.gender ?? "unknown"] : "adres"}`
    );
  return [
    "# KLUCZ SYMBOLI ZASTĘPCZYCH (HARD GATE)",
    "Każdy symbol oznacza jedną prawdziwą osobę lub jeden adres; dane zostają na komputerze użytkownika i wracają do tekstu lokalnie.",
    ...lines,
    "Zasady obowiązkowe:",
    "1. Każdy symbol osoby i adresu MUSI mieć przypadek wpisany w nawias: |NOM, |GEN, |DAT, |ACC, |INS, |LOC albo |VOC, zgodnie z funkcją w zdaniu, np. „pozew przeciwko [PII:PERSON:0001|DAT]”, „od [PII:PERSON:0001|GEN]”, „zamieszkały przy [PII:ADDRESS:0001|LOC]”. Symbol bez przypadku jest błędem.",
    "2. Czasowniki, przymiotniki i imiesłowy uzgadniaj z rodzajem podanym w kluczu.",
    "3. Nigdy nie wpisuj, nie odmieniaj ani nie odgaduj imion, nazwisk i adresów; nie zmieniaj numerów symboli."
  ].join("\n");
}
