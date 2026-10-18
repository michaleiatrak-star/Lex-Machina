// Uruchamiać z app/lex-runtime aplikacji (npx tsx). Dane fikcyjne (jak w testach aplikacji).
// Czy registryKeys (NIP/KRS -> zapytanie do białej listy/KRS) przeżywa typowe błędy OCR?
const { registryKeys, whiteListForms } = await import("./src/privacy/registry-enrichment.ts");
const cases = [
  "KRS: 0000019193 NIP 526-104-08-28", "NIP 526-104-08-28", "NIP: 5261040828", "NIP 526 104 08 28", "NIP 526–104–08–28",
  "NIP 526-104-08- 28", "NIP 526-1O4-08-28", "NIP 526-104-O8-28", "NlP 526-104-08-28", "NIP526-104-08-28", "NIP 526-104-08-289",
  "KRS:0000019193NIP 526-104-08-28", "KRS 0000 019193", "KRS 0000019193", "KRS: 000001919Z", "KRS 0000O19193", "KRS:0000019193", "REGON 123456785"
];
for (const c of cases) console.log(JSON.stringify(c).padEnd(40), JSON.stringify(registryKeys(c)));
const wl = { status: "FOUND", result: { tytul_lub_nazwa: "TRANSKOM SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ", krs: "0000019193", adres: "UL. KOLOROWA 15, 40-001 KATOWICE", osoby: [], rachunki: ["61109010140000071219812874"] } };
console.log(whiteListForms(wl).map((f: any) => `${f.kind}${f.organization ? "/org" : ""}: ${f.text}`).join("\n"));
