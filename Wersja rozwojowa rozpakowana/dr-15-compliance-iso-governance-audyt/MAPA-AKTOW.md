# DR-15 — Lokalna Mapa Aktów Prawnych

## Compliance, ISO, Governance, Audyt

| Akt prawny / norma | Źródło | Moduł | Status |
|---|---|---|---|
| PZP — zamówienia obronne i bezpieczeństwa | Dz.U. 2026 poz. 793 t.j. (POPRAWKA 2026-07-02aaaa — BYŁO błędnie 2024.1320; PIĄTY przypadek dokładnie tego samego błędu w systemie tej sesji — wcześniej naprawiony w dr-07 tego samego dnia, obwieszczenie 27.05.2026) | mod-PZP-zamowienia-obronne-bezpieczenstwa | ✅ ZAMKNIĘTE 2026-08-13 (F-62): weryfikacja treści modułu wykazała, że NIE zawiera on ŻADNEGO twardo zakodowanego numeru Dz.U. (styl "moduł klasy wzorcowej" — wprost instruuje: "nie cytuj literalnego brzmienia bez aktualnego sprawdzenia źródła") — ryzyko było niższe niż standardowa flaga zakładała, numer w tej mapie jest jedynym miejscem referencji i jest już poprawny |
| Ustawa AML — nadzór finansowy (instytucje obowiązane) | Dz.U. 2025 poz. 644 t.j. — VER 2026-07-02aaaa: potwierdzone krzyżowo z dr-06 (ten sam dzień) | mod-AML-nadzor-finansowy-instytucje | ✅ OK |
| Ustawa — nauczyciele i uczelnie (compliance pracodawcy) | Karta Nauczyciela: Dz.U. 2026 poz. 515 t.j. ✅ POTWIERDZONE 2026-08-14 (F-63) jako JEDYNY poprawny numer — 6+ zgodnych źródeł (samorzad.pap.pl, glos.pl, portaloswiatowy.pl); DR-04 cytował przestarzały numer 2024.986, teraz naprawiony tam też (sync) + Prawo o szkolnictwie wyższym: Dz.U. 2024 poz. 1571 t.j. — VER 2026-07-02aaaa: potwierdzone krzyżowo z dr-09 (ten sam dzień) | mod-ustawa-nauczyciele-uczelnie | ✅ OK (F-63 zamknięta) |
| Ustawa o ochronie sygnalistów | Dz.U. 2024 poz. 928 ze zm. — VER 2026-07-02aaaa: potwierdzone krzyżowo z dr-05 (ten sam dzień) | mod-ustawa-sygnalisci | ✅ OK |
| ISO 37001:2016 — Anti-bribery management | Norma ISO | mod-ISO-37001-antykorupcja | ✅ OK |
| ISO 27001:2022 — Information security management | Norma ISO | mod-ISO-27001-bezpieczenstwo-informacji | ✅ OK |
| ISO 42001:2023 — AI management system | Norma ISO | mod-ISO-42001-AI-management | ✅ OK |
| DORA — compliance sektor finansowy | Rozp. UE 2022/2554 | mod-DORA-compliance-sektor-finansowy | ✅ OK |
| ISO 37301:2021 — Compliance management systems | Norma ISO | mod-ISO-37301-compliance-management | ✅ OK |
| Ustawa antykorupcyjna 1997 (ograniczenia działalności gospodarczej osób pełniących funkcje publiczne) | Dz.U. 2025 poz. 499 t.j. — zweryfikowane 2026-07-16 (isap.sejm.gov.pl, gofin.pl, trybunal.gov.pl); WERYFIKUJ ponownie przed użyciem (częste nowelizacje) | mod-ustawa-antykorupcyjna-1997-ograniczenia | ✅ OK (moduł istniał od 2026-07-16, zarejestrowany w SKILL.md i tu dopiero 2026-07-26 — naprawiono CRIT z audytu pełnego systemu, test T1/T2) |

> Aktualizacja: 2026-07-02aaaa (TRYB DZU krok 13/16 wg WARN-26, ZAMKNIĘTY:
> wszystkie akty krajowe zweryfikowane [5 z 5 efektywnych, ISO/DORA to
> normy/rozporządzenia UE bez potrzeby weryfikacji Dz.U.]. 2 błędy CRIT
> naprawione [PZP — piąty przypadek systemowy tej sesji; Karta Nauczyciela
> — błędny numer i rocznik]. Potwierdzone krzyżowo z sesjami tego samego
> dnia: AML (dr-06), szkolnictwo wyższe (dr-09), sygnaliści (dr-05)
