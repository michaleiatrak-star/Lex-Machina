import { LocalLegalDocumentRenderer } from "./legal-document-renderer.js";
const renderer = new LocalLegalDocumentRenderer({ timeoutMs: 10000 });
const ast = {
    schemaVersion: "1",
    documentType: "letter",
    locale: "pl-PL",
    styleProfile: "lex-classic-clean-v1",
    blocks: [{
            type: "paragraph",
            content: [
                { type: "text", text: "Klient: " },
                { type: "pii_ref", alias: "[LMPII:D01:PERSON:0001]" }
            ]
        }]
};
const first = await renderer.render("docx", ast);
const second = await renderer.render("docx", ast);
let final;
try {
    const deterministic = first.data.equals(second.data);
    const tokenized = await renderer.validate("docx", first.data);
    final = await renderer.deanonymize("docx", first.data, new Map([["[LMPII:D01:PERSON:0001]", "Jan Kowalski"]]));
    const checked = await renderer.validate("docx", final.data);
    const pass = deterministic &&
        tokenized.aliases === 1 &&
        checked.aliases === 0 &&
        checked.text.includes("Jan Kowalski") &&
        !checked.text.includes("LMPII");
    process.stdout.write(JSON.stringify({
        gate: "G31D_DETERMINISTIC_DOCX",
        result: pass ? "PASS" : "BLOCKED",
        deterministic,
        tokenizedAliases: tokenized.aliases,
        finalAliases: checked.aliases,
        localDeanonymization: checked.text.includes("Jan Kowalski")
    }, null, 2) + "\n");
    if (!pass)
        process.exitCode = 1;
}
finally {
    first.data.fill(0);
    second.data.fill(0);
    final?.data.fill(0);
}
