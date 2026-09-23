import { describe, expect, it } from "vitest";
import { validateClientReportBlueprint, validateSituationReportBlueprint } from "./report-blueprint-policy.js";
describe("client report blueprint policy", () => {
    it("accepts an IND blueprint without percentage prediction", () => {
        const result = validateClientReportBlueprint({
            profile: "IND",
            tryb: "standard",
            kancelaria: null,
            klient: "Klient A",
            prawnik: null,
            sprawa: "Sprawa o zapłatę.",
            etap: "I instancja",
            kontekst: "Oczekiwanie na termin rozprawy.",
            ocena: {
                opis: "Pozycja pozostaje stabilna.",
                podstawa: "Dokumenty przekazane przez klienta."
            },
            assessment: {
                level: "neutral"
            },
            potwierdzenie_odbioru: null
        });
        expect(result.result)
            .toBe("PASS");
        expect(result.errors)
            .toEqual([]);
    });
    it("blocks percentage prediction in an IND report", () => {
        const result = validateClientReportBlueprint({
            profile: "IND",
            tryb: "standard",
            ocena: {
                opis: "Opis",
                podstawa: "Podstawa",
                wynik_korzystny_proc: 70
            },
            assessment: {
                level: "good"
            }
        });
        expect(result.result)
            .toBe("BLOCKED");
        expect(result.errors).toContain("CLIENT_REPORT_IND_PERCENTAGE_FORBIDDEN:wynik_korzystny_proc");
    });
    it("accepts a BIZ blueprint and warns when percentages are not complementary", () => {
        const result = validateClientReportBlueprint({
            profile: "BIZ",
            tryb: "standard",
            ocena: {
                wynik_korzystny_proc: 70,
                wariant_alternatywny_proc: 20,
                przedzial_ufnosci: "sredni",
                liczba_czynnikow: 8
            },
            assessment: {
                level: "good"
            },
            luki_kontraktowe: [],
            dzialania_klienta: [],
            rekomendacje_zarzad: []
        });
        expect(result.result)
            .toBe("PASS");
        expect(result.warnings).toContain("CLIENT_REPORT_BIZ_PERCENTAGES_NOT_COMPLEMENTARY_REQUIRE_EXPLANATION");
    });
    it("requires bad assessment and concrete next step in bad-news mode", () => {
        const result = validateClientReportBlueprint({
            profile: "IND",
            tryb: "zle_wiadomosci",
            ocena: {
                opis: "Opis",
                podstawa: "Podstawa"
            },
            assessment: {
                level: "lost"
            },
            zle_wiadomosci: {
                fakt: "Oddalono wniosek.",
                znaczenie: "Konieczna reakcja.",
                co_dalej: {
                    srodek: "",
                    termin: null
                }
            }
        });
        expect(result.result)
            .toBe("BLOCKED");
        expect(result.errors).toContain("CLIENT_REPORT_ASSESSMENT_MODE_MISMATCH");
        expect(result.errors).toContain("CLIENT_REPORT_BAD_NEWS_FIELDS_REQUIRED");
    });
    it("requires responsibility and deadline for every damage-control settlement item", () => {
        const result = validateClientReportBlueprint({
            profile: "IND",
            tryb: "ograniczenie_szkod",
            ocena: {
                opis: "Sprawa zakończona.",
                podstawa: "Prawomocne rozstrzygnięcie."
            },
            assessment: {
                level: "lost"
            },
            ograniczenie_szkod: {
                wynik: "Sprawa zakończona",
                do_rozliczenia: [
                    {
                        pozycja: "Koszty",
                        termin: "7 dni",
                        odpowiedzialny: ""
                    }
                ]
            }
        });
        expect(result.result)
            .toBe("BLOCKED");
        expect(result.errors).toContain("CLIENT_REPORT_DAMAGE_CONTROL_SETTLEMENT_INVALID");
    });
});
describe("situation report blueprint policy", () => {
    function ready() {
        return {
            tryb: "A",
            dziedzina: "cywilne",
            etap: "I instancja",
            s1rola: "powód",
            s1opis: "Klient",
            s2rola: "pozwany",
            s2opis: "Kontrahent",
            zdarzenie: "Spór o zapłatę.",
            p1lbl: "wygranie",
            p1pct: 60,
            confidence: 7,
            sources: [
                {
                    status: "A"
                }
            ],
            risk_map: [
                {
                    level: "P1"
                }
            ],
            chronologia: [
                {
                    data: "2026-09-01"
                }
            ]
        };
    }
    it("marks a complete blueprint GOTOWY", () => {
        const result = validateSituationReportBlueprint(ready());
        expect(result.result)
            .toBe("PASS");
        expect(result.completeness).toBe("GOTOWY");
        expect(result.missingRequired).toEqual([]);
    });
    it("marks one or two missing required fields CZESCIOWY", () => {
        const input = ready();
        input.s2opis = "";
        const result = validateSituationReportBlueprint(input);
        expect(result.completeness).toBe("CZESCIOWY");
        expect(result.missingRequired).toEqual([
            "s2opis"
        ]);
    });
    it("marks three missing fields ROBOCZY", () => {
        const input = ready();
        input.s1opis = "";
        input.s2opis = "";
        input.zdarzenie = "";
        const result = validateSituationReportBlueprint(input);
        expect(result.completeness).toBe("ROBOCZY");
    });
    it("fails closed on unverified legal claims before a report can be ready", () => {
        const result = validateSituationReportBlueprint(ready(), {
            hasUnverifiedLegalClaims: true
        });
        expect(result.result)
            .toBe("BLOCKED");
        expect(result.completeness).toBe("ROBOCZY");
        expect(result.hardGateErrors).toContain("SITUATION_REPORT_UNVERIFIED_LEGAL_CLAIM");
    });
    it("blocks confidence 9-10 without source register", () => {
        const input = ready();
        input.confidence = 9;
        input.sources = [];
        const result = validateSituationReportBlueprint(input);
        expect(result.result)
            .toBe("BLOCKED");
        expect(result.hardGateErrors).toContain("SITUATION_REPORT_HIGH_CONFIDENCE_WITHOUT_SOURCES");
    });
});
