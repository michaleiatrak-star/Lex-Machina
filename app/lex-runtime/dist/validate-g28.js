import { LocalPolishPseudonymizer, PseudonymizationVault } from "./privacy/pseudonymizer.js";
const original = "Anna Nowak, PESEL 44051401458, e-mail anna.nowak@example.pl, tel. +48 600-700-800.";
const ner = {
    async recognize(text) {
        const value = "Anna Nowak";
        const start = text.indexOf(value);
        return [{
                start,
                end: start + value.length,
                kind: "PERSON",
                value,
                confidence: 0.99
            }];
    }
};
const vault = new PseudonymizationVault();
const pseudonymizer = new LocalPolishPseudonymizer(vault, ner);
const result = await pseudonymizer.pseudonymize(original);
if (result.text.includes("Anna Nowak") ||
    result.text.includes("44051401458") ||
    result.text.includes("anna.nowak@example.pl")) {
    throw new Error("G28 left protected PII in pseudonymized text.");
}
if (pseudonymizer.deanonymize(result.text) !== original) {
    throw new Error("G28 local deanonymization did not restore the original text.");
}
const serializedVault = JSON.stringify(vault);
if (serializedVault.includes("Anna Nowak") ||
    serializedVault.includes("44051401458")) {
    throw new Error("G28 vault serialized secret re-identification values.");
}
process.stdout.write(JSON.stringify({
    gate: "G28_LOCAL_PSEUDONYMIZATION_AND_DEANONYMIZATION",
    result: "PASS",
    findings: result.findings.length,
    vaultEntries: vault.size,
    reversibleLocally: true,
    reidentificationMapPubliclySerializable: false
}, null, 2) + "\n");
