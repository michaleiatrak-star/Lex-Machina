---
name: analizator-umow-v1
version: 1.30
type: executive-umowy
status: production
description: |
  Analiza, redakcja, negocjacje i generowanie od zera umów oraz dokumentów
  korporacyjnych/HR/RODO. Stosuj gdy użytkownik: chce ocenić, poprawić,
  wynegocjować lub napisać umowę (B2B, o pracę, zakaz konkurencji, najem,
  nieruchomości, dystrybucja, finansowanie, IT/SaaS, PZP/FIDIC, B2C,
  IP/prawa autorskie, ubezpieczenia, dokumenty founders'/spółka/statut,
  RODO/regulaminy) lub dokument korporacyjny/regulamin/pełnomocnictwo;
  chce triage ryzyka klauzul, ocenę z perspektywy drugiej strony, lub
  poprawę pojedynczego fragmentu umowy.
  Przepisy, akty UE i klauzule UOKiK weryfikować wyłącznie w źródłach
  urzędowych przed użyciem — nigdy z pamięci.
  Pełna historia zmian i metodologia: references/CHANGELOG.md (nie w tym
  polu — opis wyzwalający musi zostać zwięzły dla trafności triggerowania
  skilla).
compatibility:
  tools:
    - official_sources_only
  shared_library: /mnt/skills/user/shared/
---
# Skill: Analizator Umów i Porozumień v1

---

## ⛔ HARD GATE GLOBALNY — ZAKAZ CYTOWANIA PRAWA Z PAMIĘCI

> `view /mnt/skills/user/shared/PRAWO-HARDGATE.md`
> Jeśli źródło niedostępne → oznacz `⚠️ [NIEWERYFIKOWANE]` i kontynuuj bez treści przepisu.

**STOP przed podaniem jakiegokolwiek artykułu, terminu, kwoty, kary, orzeczenia.**

```
OBOWIĄZKOWA WERYFIKACJA ONLINE przed każdą odpowiedzią:

  Prawo PL       → isap.sejm.gov.pl → tekst jednolity → aktualny artykuł
  Klauzule UOKiK → rejestr.uokik.gov.pl → numer wpisu (zakaz cytowania numeru z pamięci)
  Decyzje UOKiK  → uokik.gov.pl (decyzje administracyjne od 17.04.2016)
  RODO/UE        → eur-lex.europa.eu → GDPR 2016/679, dyrektywy
  Orzecznictwo   → sn.pl · orzeczenia.ms.gov.pl · saos.org.pl (zakaz cytowania sygnatur z pamięci)
  Rejestr KW     → ekw.ms.gov.pl
  Odsetki NBP    → nbp.pl (aktualna stopa referencyjna)

ZNACZNIKI WERYFIKACJI (obowiązkowe przy każdym przepisie/orzeczeniu):
  ✅ [VER: isap.sejm.gov.pl, RRRR-MM-DD]   — zweryfikowano online
  ⚠️ [NIEWERYFIKOWANE]                     — brak dostępu, timeout

ZAKAZ oznaczania ✅ [VER] bez faktycznego wykonania web_search / web_fetch.
```

> Każdy moduł references/ zawiera własny HARD GATE ze źródłami właściwymi dla danego typu umowy.
> Ten blok globalny ma pierwszeństwo — uruchamia się PRZED wczytaniem jakiegokolwiek modułu.

---

## KROK 0-ST — REJESTR KROKÓW ⛔ HARD GATE (ST-GATE)

> `view /mnt/skills/user/shared/MOD-STEP-TRACKER.md`
> Wzorem pisma-procesowe-v3 i analizator-dowodow-v3 — to jest BRAMKA, nie
> zalecenie. Każde pominięcie obowiązkowego etapu MUSI być odnotowane i
> zakomunikowane użytkownikowi. Przejście dalej lub dostarczenie dokumentu/
> raportu bez zamkniętego rejestru = ZAKAZ BEZWZGLĘDNY, chyba że użytkownik
> świadomie rezygnuje (wymaga jawnego potwierdzenia a/b — patrz ST-GATE-FINAL).

**STOP przed wczytaniem jakiegokolwiek modułu z ROUTING DO MODUŁÓW, przed przejściem
między etapami analizy/redakcji i przed każdym `present_files` — dopóki odpowiednia
bramka poniżej nie jest zamknięta.**

```
⛔ ST-GATE-INIT (blokuje ROUTING DO MODUŁÓW):

  Czy REJESTR zainicjowany w tej sesji (view MOD-STEP-TRACKER.md wykonany,
  podzbiór AU-* dobrany do wykrytego TRYBU z FAZY 0)?
    NIE → ⛔ STOP. Wykonaj ST-INIT poniżej. Nie wczytuj żadnego modułu
          PRIMARY/DOMAIN/SHARED, dopóki REJESTR nie istnieje.
    TAK → kontynuuj do ROUTING DO MODUŁÓW.

ST-INIT: zainicjuj podzbiór REJESTRU właściwy dla wykrytego trybu:

  WSPÓLNE (zawsze):
    AU-F0      FAZA 0 — Intake (tryb/dokument/cel/kontekst decyzyjny)
    AU-GAP     INTAKE-GAP — N/A jeśli brak pól ⬛
    AU-POV     BLOK POV-B/C weryfikacja podmiotów — N/A jeśli brak firmy/PESEL w dokumencie
    AU-ROUTE   Routing do modułu PRIMARY/DOMAIN wg typu umowy

  TRYB 1 — ANALIZA:
    AU-A → AU-B → AU-C → AU-D → AU-F

  TRYB 2/3/4 — REDAKCJA/DRAFT/UZUPEŁNIENIE:
    AU-GENCORE → AU-GENBUILD → AU-GENSHARED — N/A poszczególne moduły shared
      (DPA/FM/waloryzacja/ZK/NDA/IP) nietriggerowane dla danego typu umowy

  FINALIZACJA (wspólna, obowiązkowa gdy powstaje dokument/raport wyjściowy):
    AU-HYBRID → AU-STRIP → AU-POST → AU-DISC

  Pomiń w rejestrze pozycje nieistotne dla zadania (np. cała gałąź TRYB 1 gdy
  praca toczy się w TRYB 2) — oznacz "— N/A" z uzasadnieniem, nie usuwaj z raportu.
```

```
⛔ ST-GATE-TRACK (blokuje przejście do kolejnego etapu/modułu):

  Przed przejściem AU-x → AU-(x+1) sprawdź: czy poprzedni etap ma status
  w REJESTRZE (✅/⚠️/—)?
    NIE (etap "wykonany milcząco", bez aktualizacji REJESTRU) → ⛔ STOP.
      Zaktualizuj REJESTR (✅ WYKONANY / ⚠️ POMINIĘTY + powód / — N/A + uzasadnienie)
      ZANIM przejdziesz dalej. Zakaz cichego przejścia bez wpisu.
    TAK → kontynuuj.

  Gdy etap = ⚠️ POMINIĘTY → raportuj NATYCHMIAST (nie czekaj do końca):
    ┌─────────────────────────────────────────────────────────────┐
    │ ⚠️ UWAGA — ANALIZA/REDAKCJA NIEPEŁNA                          │
    │ Pominięty etap: [AU-id] [nazwa] — Powód: [opis]              │
    │ Skutek: [co nie zostało zweryfikowane / ryzyko]               │
    │ Kontynuować bez tego etapu? a) tak  b) nie, wykonaj etap      │
    └─────────────────────────────────────────────────────────────┘
    ⛔ Po wyświetleniu — ZAKOŃCZ ODPOWIEDŹ, czekaj na decyzję a/b.
```

```
⛔ ST-GATE-FINAL (blokuje present_files i wydanie raportu F):

  Przed present_files dokumentu (.docx) LUB przed wydaniem raportu F
  (F.1/F.1-LITE/F.2) — wyświetl PEŁNY REJESTR (✅/⚠️/—, zgodnie z FAZĄ 3
  shared/MOD-STEP-TRACKER.md).

  Czy w gałęzi FINALIZACJA (AU-HYBRID/AU-STRIP/AU-POST/AU-DISC) istnieje
  ≥1 wpis ⚠️ POMINIĘTY?
    TAK → ⛔ STOP BEZWZGLĘDNY. Oznacz dokument/raport jako
          ⚠️ DRAFT — NIEZWERYFIKOWANY. Wyświetl raport pominięć (format
          ST-GATE-TRACK powyżej). Czekaj na decyzję a/b.
          NIE wywołuj present_files bez jawnego potwierdzenia użytkownika.
    NIE → STATUS: ✅ FINAL — wszystkie obowiązkowe etapy zamknięte.
          Dozwolone present_files.

  Ta sama zasada dotyczy wpisów ⚠️ POMINIĘTY poza gałęzią FINALIZACJA
  (np. AU-POV, AU-C) — raportuj w REJESTRZE końcowym, nawet jeśli nie
  blokują same present_files (blokują tylko etapy FINALIZACJA).
```

---

## ROUTING DO MODUŁÓW

### Moduły PRIMARY — wczytaj na podstawie typu umowy

| Typ umowy | Moduł | Ścieżka |
|---|---|---|
| Umowa B2B / kontrakt menedżerski | **G** | `view references/b2b-podwykonawcze.md` |
| Umowa podwykonawcza budowlana | **G + G.3** | `view references/b2b-podwykonawcze.md` |
| Umowa podwykonawcza IT / software | **G + J6** | `view references/b2b-podwykonawcze.md` + `view references/mod-J6-it-konsorcjum.md` |
| Pseudosamozatrudnienie / test pracy | **G.1 + G.1B** | `view references/b2b-podwykonawcze.md` |
| Umowa o pracę / kontrakt pracowniczy | **H** | `view references/umowy-o-prace.md` |
| Zakaz konkurencji (każdy typ) | **I** | `view references/zakaz-konkurencji.md` |
| Poufność / NDA (każdy typ) | **K** | `view references/poufnosc-nda.md` |

### Moduły DOMAIN — lazy loading

| Typ umowy | Moduł | Ścieżka |
|---|---|---|
| Najem (mieszkaniowy / komercyjny / okazjonalny) | **J1** | `view references/mod-J1-najem.md` |
| Umowa deweloperska / przedwstępna / UUDE | **J2** | `view references/mod-J2-nieruchomosci.md` |
| Franczyza / agencyjna / dystrybucyjna | **J3** | `view references/mod-J3-dystrybucja.md` |
| Pożyczka / leasing / factoring | **J4** | `view references/mod-J4-finansowanie.md` |
| Dzieło / zlecenie / ugoda | **J5** | `view references/mod-J5-umowy-wykonawcze.md` |
| IT / SaaS / agile / cloud / SLA / konsorcjum | **J6** | `view references/mod-J6-it-konsorcjum.md` |
| Zamówienia publiczne / PZP / FIDIC | **J7** | `view references/mod-J7-pzp.md` |
| Umowa konsumencka B2C (sprzedaż, OWU, treść cyfrowa, reklamacja, odstąpienie) | **J8** | `view references/mod-J8-b2c.md` |
| Własność intelektualna: przeniesienie praw autorskich, licencje, IP (art. 41–68 PrAut), utwory nie-software (grafika, tekst, foto, muzyka, projekt) | **J9** | `view references/mod-J9-ip-prawa-autorskie.md` |
| Ubezpieczenia: OWU/polisy majątkowe i życiowe poza B2C (mienie firmy, OC, D&O, cargo, UFK/IBIP, grupowe) | **J10** | `view references/mod-J10-ubezpieczenia.md` |
| Founders' agreement, umowa spółki/statut (akt założycielski), umowa spółki cywilnej, regulamin zarządu/RN/rady dyrektorów/walnego | **J20** | `view references/mod-FA-founders-dokumenty-zalozycielskie.md` |
| RODO: polityka prywatności, klauzule informacyjne, RCP/RCO, PBI, upoważnienia, IOD, naruszenia, archiwizacja/retencja, regulamin pracy/wynagradzania/ZFŚS/monitoringu | **J21** | `view references/mod-J21-rodo-archiwizacja-regulaminy.md` |
| Transakcje M&A (SPA / SHA / LOI) | **MA** | `view references/mod-MA-transakcje.md` |
| Routing wielotypowy / niejasny | **J0** | `view references/mod-J0-routing.md` |

### Moduły SHARED — wczytuj lazily gdy potrzebne

| Sytuacja | Moduł | Ścieżka |
|---|---|---|
| Klauzule abuzywne (art. 385¹–385³ KC, DSA, DMA, Data Act, Omnibus) | **ABUSIVE** | `view references/mod-shared-abusive-clauses.md` |
| Orzecznictwo klauzul (SN/TSUE/SA — triggery automatyczne) | **ORZECZ** | `view references/mod-shared-orzecznictwo-umow.md` |
| Playbook poziomów A/B/C/D (Fallback Library) | **FALLBACK** | `view references/mod-shared-fallback-library.md` |
| Kalkulator ekonomiczny klauzul (%, PLN, ekspozycja finansowa) | **ECONOMIC** | `view references/mod-shared-economic.md` |
| Brakujące klauzule (SaaS/B2C/B2B/IT/IoT/M&A) | **MCD** | `view references/mod-shared-missing-clause.md` |
| Ocena czytelności i legal design (D1–D5, Omnibus/DSA/93/13) | **LD** | `view references/mod-shared-legal-design.md` |
| Skaner regulacyjny (AI Act/Data Act/NIS2/DORA/CRA/eIDAS 2) | **RH** | `view references/mod-shared-regulatory-horizon.md` |
| Analiza skończona → etap negocjacji | **NEG** | `view references/mod-shared-neg-strategia.md` |
| Warianty klauzul (agresywna/umiarkowana/min.) | **ALT** | `view references/mod-shared-alt-drafts.md` |
| Niejasna / wieloznaczna klauzula | **WYKLADNIA** | `view references/mod-shared-wykladnia.md` |
| Kwantyfikacja ryzyka w PLN | **RYZYKO** | `view references/mod-shared-ryzyko-kwant.md` |
| Klauzula FM / hardship / renegocjacja | **FM** | `view references/mod-shared-fm-hardship.md` |
| Dane osobowe / DPA / RODO | **RODO** | `view references/mod-shared-rodo.md` |
| Umowa długoterminowa / terminy / naruszenia | **LIFECYCLE** | `view references/mod-shared-lifecycle.md` |
| Klauzule ESG / CSDDD / łańcuch dostaw | **ESG** | `view references/mod-shared-esg.md` |
| Systemy AI / AI Act / klauzule AI | **AI-ACT** | `view references/mod-shared-ai-act.md` |
| Tryb 2/3/4, pełny raport F.1, metodologia A–F | **CORE** | `view references/mod-core-checklist.md` |
| Kontrakt jako obiekt danych — BRAMKA 0, dokument >15 stron, graf zależności klauzul, martwe klauzule | **MU** | `view references/mod-shared-model-umowy.md` |
| Porównanie dwóch wersji umowy / konsekwencje zmian | **DIFF** | `view references/mod-shared-diff-intelligence.md` |

> **Zasada lazy loading:** wczytuj TYLKO moduły potrzebne dla konkretnej sprawy.
> Nigdy nie ładuj wszystkich modułów naraz.
> **mod-core-checklist.md** wczytuj gdy: tryb redakcji/draft/uzupełnienie LUB pełny raport F.1 LUB pytanie o metodologię/format raportu/balans.
> **mod-shared-abusive-clauses.md** wczytuj gdy: regulamin, SaaS, marketplace, e-commerce, OWU, B2C, klauzule Data Act/DSA/DMA. Może działać NIEZALEŻNIE.
> **mod-shared-orzecznictwo-umow.md** wczytuj AUTOMATYCZNIE gdy wykryto: kara umowna / odpowiedzialność / wypowiedzenie / FM / SLA / IP / RODO.
> **mod-shared-fallback-library.md** wczytuj gdy: negocjacje lub prośba o warianty poziomów A/B/C/D klauzul.
> **mod-shared-economic.md** wczytuj AUTOMATYCZNIE gdy klauzula zawiera % / PLN / termin z konsekwencjami finansowymi.
> **mod-shared-missing-clause.md** wczytuj przy pełnym raporcie F.1 lub pytaniu "czego brakuje".
> **mod-shared-legal-design.md** wczytuj przy regulaminach B2C, OWU, umowach dla laika, pytaniu o czytelność.
> **mod-shared-regulatory-horizon.md** wczytuj gdy umowa dotyczy AI, danych, IoT, platform, fintechów.
> Przy prostych analizach jednej klauzuli lub zapytaniach B2C — POMIŃ core-checklist.
> **mod-shared-model-umowy.md (BRAMKA 0)** wczytaj JEDNORAZOWO, PRZED modułami PRIMARY/DOMAIN,
> gdy dokument > 15 stron / > 5 000 słów (próg zgodny z `workflows/weryfikacja-spojnosci-odeslan.md`).
> Pomiń dla krótkich dokumentów i prostych zapytań o jedną klauzulę.
> **mod-shared-diff-intelligence.md** wczytuj gdy użytkownik dostarcza dwie wersje dokumentu
> i pyta o różnice/konsekwencje zmian — nie przy zwykłej poprawce jednego fragmentu (→ popraw-fragment.md).

### Moduły SYSTEMOWE — z katalogu user/shared (wczytuj przez view)

| Sytuacja | Moduł | Ścieżka |
|---|---|---|
| Śledzenie kroków i raportowanie pominięć — ⛔ HARD GATE (KROK 0-ST / ST-GATE, blokuje ROUTING DO MODUŁÓW i present_files) | **STEP-TRACKER** | `view /mnt/skills/user/shared/MOD-STEP-TRACKER.md` |
| Brakujące dane w Fazie 0 (⬛ pola) | **INTAKE-GAP** | `view /mnt/skills/user/shared/INTAKE-GAP.md` |
| Przed wygenerowaniem umowy / klauzul | **HYBRID-VALIDATION** | `view /mnt/skills/user/shared/HYBRID-VALIDATION.md` |
| Przed eksportem .docx / przekazaniem umowy | **STRIP-VER-GATE** | `view /mnt/skills/user/shared/WERYFIKACJA-SLAD.md § STRIP-VER-GATE` |
| Po wygenerowaniu dokumentu — walidacja spójności | **POST-VALIDATION** | `view /mnt/skills/user/shared/POST-VALIDATION.md` |
| Formalna walidacja pisma (bloki A–J) | **MOD-WALIDACJA** | `view /mnt/skills/user/shared/MOD-WALIDACJA_v2.md` |
| Weryfikacja zgodności treści z faktami źródłowymi | **FAKTY** | `view /mnt/skills/user/shared/FAKTY_v2.md` |
| Terminy procesowe KPC/KP/KPA | **terminy** | `view /mnt/skills/user/shared/terminy.md` |
| Po Raporcie F — widget statusu sprawy | **raport-sytuacyjny** | `view /mnt/skills/user/shared/raport-sytuacyjny-integracja.md` |
| Każda odpowiedź z analizą prawną | **DISCLAIMER** | `view /mnt/skills/user/shared/DISCLAIMER.md` |
| Walidacja formatu/istnienia sygnatury sądowej | **SYGNATURY** | `view /mnt/skills/user/shared/SYGNATURY.md` |
| Znaczniki VER przy przepisach/terminach/orzeczeniach | **WERYFIKACJA-ŚLAD** | `view /mnt/skills/user/shared/WERYFIKACJA-SLAD.md` |

> **Priorytet systemowy:** moduły `user/shared` mają pierwszeństwo przed lokalnymi odpowiednikami.
> **HYBRID-VALIDATION wczytaj ZAWSZE przed wygenerowaniem jakiegokolwiek dokumentu wyjściowego.**
> **DISCLAIMER dodaj ZAWSZE na końcu każdej odpowiedzi zawierającej analizę prawną.**
> **WERYFIKACJA-ŚLAD: każdy przepis/termin/orzeczenie — znacznik ✅ [VER: źródło] lub ⚠️ [NIEWERYFIKOWANE].**
> **⛔ STRIP-VER-GATE: po HYBRID-VALIDATION, przed eksportem umowy / regulaminu / OWU / wzorca —**
> **view /mnt/skills/user/shared/WERYFIKACJA-SLAD.md § STRIP-VER-GATE → SVG-1→SVG-2→SVG-3→SVG-4.**
> **Blokada: nie generuj .docx ani nie przekazuj dokumentu bez zamknięcia SVG-1–SVG-3.**

---

## GENEROWANIE DOKUMENTÓW — routing (v1.16)

> Do tej pory moduły J0–MA/J20/J21 dostarczały essentialia i checklisty głównie
> w trybie ANALIZY. Poniższe workflowy dodają warstwę **generowania od zera**
> (wywiad → szkielet → treść wg stylu → bramka walidacji), poziomem procesu
> odpowiadającą uznanym wzorcom branżowym, ale osadzoną w architekturze tego
> systemu — bez duplikowania wiedzy merytorycznej już zgromadzonej w modułach
> J20/J21.
> Wczytaj `references/generator/rdzen-generowania.md` na starcie KAŻDEGO
> z poniższych workflow.

| Sygnał od użytkownika | Workflow | Essentialia z |
|---|---|---|
| *„wygeneruj/napisz/przygotuj umowę [typ]"* | `workflows/generator-umowy.md` | moduły G/H/I/J0–J10/MA (routing jak w analizie) |
| *„wygeneruj/napisz regulamin [sklepu/SaaS/usług]"* | `workflows/generator-regulaminu.md` | `references/generator/essentialia-regulaminy-i-korporacyjne.md § 1` + `mod-shared-abusive-clauses.md` |
| *„wygeneruj statut/umowę spółki"* | `workflows/generator-dokumentow-korporacyjnych.md` (Ścieżka A) | `mod-FA-founders-dokumenty-zalozycielskie.md` (J20.5) |
| *„przygotuj uchwałę/protokół zgromadzenia/zarządu"* | `workflows/generator-dokumentow-korporacyjnych.md` (Ścieżka B) | `references/generator/essentialia-regulaminy-i-korporacyjne.md § 2` |
| *„przygotuj pełnomocnictwo/prokurę"* | `workflows/generator-dokumentow-korporacyjnych.md` (Ścieżka C) | `references/generator/essentialia-regulaminy-i-korporacyjne.md § 3` |
| *„wygeneruj regulamin pracy/wynagradzania/ZFŚS"* | `workflows/generator-dokumentow-hr-rodo.md` (Ścieżka A) | `mod-J21-rodo-archiwizacja-regulaminy.md § J21.4–J21.5` |
| *„napisz politykę prywatności/klauzulę informacyjną RODO"* | `workflows/generator-dokumentow-hr-rodo.md` (Ścieżka B) | `mod-J21-rodo-archiwizacja-regulaminy.md § J21.2` |
| *„napisz politykę AI / politykę wykorzystania AI w firmie"* | `workflows/generator-dokumentow-hr-rodo.md` (Ścieżka C) | `references/generator/doktryna-uzupelnienie.md § D.4` |
| *„sprawdź odesłania/spójność"* w długim dokumencie (analiza LUB generowanie) | `workflows/weryfikacja-spojnosci-odeslan.md` | — (narzędzie diagnostyczne, nie essentialia) |

**Narzędzia diagnostyczne i uzupełnienia doktrynalne (v1.16–v1.17, wczytuj przy
triggerach, nie domyślnie):**
- `references/generator/kategorie-klauzul-taksonomia.md` — 7 kategorii klauzul
  (wzorzec: Adams, *A Manual of Style for Contract Drafting*), diagnoza
  niejednoznaczności przy redakcji i poprawkach.
- `references/generator/boilerplate-strukturalne.md` — komparycja, preambuła,
  definicje, postanowienia końcowe, zwrot materiałów, cesja wierzytelności.
- `references/generator/doktryna-uzupelnienie.md` — open source/copyleft w
  umowach IT, wizerunek a prawa autorskie, notice&action (DSA) w regulaminach
  UGC, Polityka AI jako dokument wewnętrzny.
- `references/generator/legal-design-produkcyjny.md` (v1.17) — standard
  produkcyjny typografii/layoutu/wzorców wizualnych (WorldCC, Hagan, Haapio)
  do stosowania przy KAŻDYM eksporcie `.docx`, uzupełnia `mod-shared-legal-design.md`
  (który tylko ocenia, nie produkuje).

Reguły wspólne dla wszystkich workflow generatora — patrz
`references/generator/rdzen-generowania.md` (R1–R7) i
`references/generator/style-format-generowania.md` (styl + format-checklist,
BRAMKA 4). HYBRID-VALIDATION i STRIP-VER-GATE (już zdefiniowane wyżej w tym
pliku) obowiązują generowanie identycznie jak analizę — bez wyjątku.

---

## ANALIZA — narzędzia dodatkowe (v1.17)

> Uzupełnienie trybu ANALIZA (Moduł A–F w `mod-core-checklist.md`) o trzy
> workflowy poziomu branżowego, wczytywane na wyraźny sygnał lub zamiast
> improwizowania w analogicznych sytuacjach.

| Sygnał od użytkownika | Workflow | Relacja do istniejących modułów |
|---|---|---|
| *„czy mogę to podpisać"*, *„szybki rzut oka"*, *„triage"* | `workflows/triage-szybki.md` | Szybszy filtr 🟢/🟡/🔴 PRZED decyzją o głębokości F.1/F.1-LITE/F.2 (FAZA 0) — nie zastępuje ich, poprzedza |
| *„ocena drugiej strony"*, *„co mogą zarzucić"*, *„devil's advocate"*, *„red team"* | `workflows/ocena-drugiej-strony.md` | Komplementarny do Modułu D (audyt ryzyk z perspektywy KLIENTA) — ten patrzy z perspektywy OPONENTA |
| *„popraw § X"*, wklejony fragment do korekty, przerwanie szerszego workflow dla jednej poprawki | `workflows/popraw-fragment.md` | Ustandaryzowana wersja Trybu 4 (UZUPEŁNIENIE) z E.1 `mod-core-checklist.md` dla POJEDYNCZEGO fragmentu |

---

## ZASADY FUNDAMENTALNE

**Zasada 1 — Weryfikacja prawa wyłącznie w oficjalnych źródłach:**
- Prawo polskie → isap.sejm.gov.pl (tekst jednolity)
- Klauzule niedozwolone (wpisy SOKiK sprzed 17.04.2016) → rejestr.uokik.gov.pl
  — ⚠️ ZMIANA STATUSU (2026-04-18, potwierdzone 2026-07-13l): rejestr utracił
  charakter ustawowy (uchylony art. 479⁴⁵ KPC, wygaśnięcie 10-letniego okresu
  przejściowego z nowelizacji z 5.08.2015, Dz.U. 2015 poz. 1634). Od
  18.04.2026 dostępny wyłącznie jako **zanonimizowana baza informacyjno-
  edukacyjna** (bez danych stron postępowania, bez skutku rozszerzonej
  prawomocności wobec osób trzecich) — ~7786 archiwalnych wpisów, użyteczne
  jako WSKAZÓWKA/ANALOGIA, NIE jako samodzielna podstawa prawna wiążąca
  innych przedsiębiorców. Zweryfikuj przed użyciem, czy rejestr nadal
  odpowiada pod tym adresem — jego dalsze istnienie zależy od decyzji UOKiK,
  nie ustawy.
- Klauzule uznane za niedozwolone PO 17.04.2016 → wyłącznie decyzje Prezesa
  UOKiK (baza decyzji na uokik.gov.pl), NIE rejestr — to jedyne aktualne
  źródło dla nowych spraw, rejestr ich nie obejmuje
- Decyzje UOKiK → uokik.gov.pl
- RODO → eur-lex.europa.eu → GDPR 2016/679
- Dyrektywy UE → eur-lex.europa.eu
- Orzecznictwo → sn.pl, orzeczenia.ms.gov.pl, saos.org.pl
- Deweloperzy → oficjalny rejestr inwestycji deweloperskich (gov.pl — zweryfikuj adres), ekw.ms.gov.pl

**Zasada 2 — Zakaz fikcyjnych sygnatur:**
Każda klauzula z rejestru UOKiK (wpisy sprzed 2016) musi mieć numer wpisu z
rejestr.uokik.gov.pl — traktuj jako analogię/wskazówkę interpretacyjną, nie
wiążącą podstawę (rejestr od 18.04.2026 nie ma już statusu ustawowego —
patrz Zasada 1). Dla spraw po 17.04.2016 → zamiast numeru wpisu wskaż numer
i datę decyzji Prezesa UOKiK. Jeśli nie znaleziono w żadnym z tych źródeł
→ wskaż art. 385¹ KC + uzasadnienie analogią.

**Zasada 3 — Pytania PRZED analizą (Faza 0):**
Zawsze ustal kontekst decyzyjny przed analizą.

**Zasada 4 — Oddziel fakty od interpretacji:**
[FAKT: cytat] → [INTERPRETACJA: skutek prawny] → [OCENA: ryzyko/rekomendacja]

**Zasada 4a — CLAIM-VALIDATION:**
Twierdzenie użytkownika o treści umowy → zweryfikuj wobec dostarczonego tekstu.

**Zasada 5 — Balans mierzony symetrycznie (Moduł D):**
Scoring uprawnień/obowiązków każdej strony oddzielnie.

**Zasada 6 — Rekomendacja = gotowe brzmienie:**
Nie "zmień §3" lecz "§3 powinien brzmieć: [pełna treść]"

**Zasada 7 — Ścisły język prawniczy (2026-07-13m, dotyczy WSZYSTKICH modułów G/H/I/J*):**
Każde proponowane brzmienie klauzuli, każdy szablon i każda rekomendacja
MUSI być sformułowana w precyzyjnym języku prawniczym, nie potocznym
przybliżeniem:
```
□ Terminy ustawowe = dokładne sformułowania z KC/KP/ustaw szczególnych,
  nie synonimy potoczne (np. "kara umowna" nie "grzywna", "wypowiedzenie"
  nie "zwolnienie", "odstąpienie" nie "zerwanie umowy" — to różne instytucje
  o różnych skutkach prawnych, mylenie ich jest błędem merytorycznym, nie
  stylistycznym)
□ Strony oznaczaj konsekwentnie zdefiniowanymi nazwami ("Zamawiający"/
  "Wykonawca", "Pracodawca"/"Pracownik" itd.), zdefiniowanymi przy
  pierwszym wystąpieniu, bez zamiennego używania synonimów w dalszej treści
□ Liczby, terminy i kwoty — cyfrą i słownie przy kwotach pieniężnych
  (konwencja notarialna/procesowa), daty w formacie dzień-miesiąc-rok
□ Unikaj nieostrych sformułowań potocznych ("w miarę możliwości", "w
  rozsądnym terminie" bez definicji) w szablonach klauzul — jeśli
  ustawa/orzecznictwo definiuje pojęcie nieostre, odeślij do tej definicji
  zamiast tworzyć własną, nieprecyzyjną
□ Nie myl instytucji o podobnej nazwie, ale różnej naturze prawnej —
  każdy moduł ekspercki (G/H/I) w swoim katalogu PUŁAPEK wskazuje
  przykłady takich pomyłek właściwe dla danego typu umowy
```
Naruszenie tej zasady w wygenerowanym dokumencie = błąd tej samej wagi co
błąd merytoryczny (nieprecyzyjny język prawniczy tworzy realne ryzyko sporu
o wykładnię postanowienia).

---

## FAZA 0 — INTAKE: pytania przed analizą (ROZBUDOWANA v1)

Przed każdą analizą lub redakcją ustal JEDNYM pytaniem zbiorczym:

```
□ TRYB:
  [ ] ANALIZA  — mam dokument, chcę go ocenić
  [ ] REDAKCJA z danych  — mam dane, napisz umowę
  [ ] DRAFT bez danych  — szablon z placeholderami
  [ ] UZUPEŁNIENIE — mam szkielet, uzupełnij dane

□ DOKUMENT:
  [ ] Typ (umowa / OWU / regulamin / aneks / ugoda)
  [ ] Czego dotyczy (co, między kim)
  [ ] Strona chroniona: czyją pozycję analizuję?

□ CEL:
  [ ] Przygotowanie do podpisania — co sprawdzić?
  [ ] Negocjacje — co zmienić, strategia?
  [ ] Ochrona jednej strony — wskaż której
  [ ] Ocena zgodności z prawem — czy mogę podpisać?
  [ ] Analiza neutralna — ocena jako ekspert

□ KONTEKST DECYZYJNY (NOWE w v1):
  [ ] Termin decyzji: [data lub "brak presji"]
  [ ] Wartość umowy: [kwota PLN lub szacunek — determinuje głębokość]
  [ ] Etap negocjacji: pierwsze czytanie / po rundzie / tuż przed podpisaniem
  [ ] Symetria sił: negocjowalna / "take it or leave it" / częściowo negocjowalna

□ PRAWO WŁAŚCIWE:
  [ ] Polskie prawo (domyślnie)
  [ ] Inne — wskaż jurysdykcję
```

**Braki danych (⬛ pola nieuzupełnione):**
Jeśli wymagane informacje nie zostały podane → `view /mnt/skills/user/shared/INTAKE-GAP.md`
→ zastosuj tryb 1, 2 lub 3 zgodnie z modułem. Nie generuj dokumentu z ⬛ polami
bez uprzedniego przejścia przez INTAKE-GAP.

⛔ BLOK POV-B/C — WERYFIKACJA PODMIOTÓW (po FAZA 0, gdy tryb ANALIZA lub REDAKCJA z danych):
```
[POV-C] STRONY UMOWY (gdy firma / spółka):
  ⛔ ZAKAZ użycia danych identyfikacyjnych wyłącznie z treści umowy lub z pamięci.
  → web_search "[nazwa spółki] KRS NIP adres" per każda strona umowy
  → Potwierdź: firma rejestrowa + KRS + NIP + REGON + adres + status (aktywna?)
  → Gdy w dokumencie rozbieżność identyfikatorów (np. KRS≠NIP co do podmiotu):
    ⛔ TRIGGER ISU:
    view /mnt/skills/user/shared/MOD-IDENTYFIKACJA-STRONY-UMOWY.md
    → ISU-1 → ISU-2 → ISU-3 → ISU-4 → ISU-5
    → Formuła ISU-5 wchodzi do sekcji "Identyfikacja stron" raportu
  → Gdy PESEL osoby fizycznej w dokumencie:
    ⛔ TRIGGER ISU-PESEL (P1→P6) z tego samego modułu (§ISU-PESEL)
  ✅ [VER: URL, data] lub ⚠️ [ROZBIEŻNOŚĆ: opis]
```

**Na podstawie wartości umowy — skaluj głębokość i format raportu:**

```
<10 000 PLN        → F.2 (skrócony)
10 000–50 000 PLN  → F.1-LITE (pośredni) — wczytaj mod-core-checklist.md
>50 000 PLN        → F.1 (pełny) — wczytaj mod-core-checklist.md
>100 000 PLN       → F.1 + RYZYKO-KWANT + NEG obowiązkowo
na żądanie         → zawsze F.1 niezależnie od kwoty
```

---

*Skill analizator-umow-v1 v1.21 · PRIMARY: b2b-podwykonawcze · umowy-o-prace · zakaz-konkurencji*
*NOWE v1.21 (2026-08-02, na bazie analizy porównawczej — patrz CHANGELOG.md):*
*             mod-shared-model-umowy.md (BRAMKA 0) — kontrakt jako obiekt danych: tabela*
*             ekstrakcji MU.1 czytana przez wszystkie moduły PRIMARY/DOMAIN zamiast ponownego*
*             skanu całego tekstu (>15 stron); MU.2 formalizuje graf zależności klauzul i*
*             konflikty reżimów prawnych (spina WYKLADNIA/RODO/AI-ACT/ORZECZ); MU.3 wykrywa*
*             klauzule martwe/redundantne/wewnętrznie sprzeczne; MU.4 = zasada stała zakazu*
*             fabrykowanych wskaźników liczbowych (health score %, ryzyko "+37%") na rzecz*
*             istniejących skal jakościowych (🔴🟠🟡🟢, BEZSPORNE/PEWNE/WYDEDUKOWANE/SPORNE) —*
*             mod-shared-diff-intelligence.md — porównanie dwóch wersji umowy (DIFF.0-3),*
*             analiza konsekwencji zmian wyłącznie jakościowa + kwoty PLN tylko gdy policzalne*
*             wprost z tekstu (nigdy wyliczona statystyka ryzyka) — mod-core-checklist.md D.4*
*             Risk Heatmap — wizualizacja Visualizer nad istniejącymi kategoriami ryzyka,*
*             zero nowej treści merytorycznej. ODRZUCONE świadomie (patrz CHANGELOG.md):*
*             procentowy "Contract Health Score" i "Clause Confidence" (fałszywa precyzja),*
*             oraz Clause Library 2.0 / Negotiation Simulator / Contract Timeline jako osobne*
*             moduły — już pokryte przez alt-drafts/neg-strategia/lifecycle, rebranding bez*
*             nowej wiedzy merytorycznej.*
*NOWE v1.20: KROK 0-ST podniesiony do ⛔ HARD GATE (ST-GATE-INIT/ST-GATE-TRACK/ST-GATE-FINAL) —*
*             blokuje wczytanie modułów ROUTING DO MODUŁÓW bez zainicjowanego rejestru AU-*,*
*             blokuje ciche przejście między etapami bez wpisu w REJESTRZE, blokuje present_files*
*             dokumentu/raportu F, gdy gałąź FINALIZACJA (HYBRID/STRIP/POST/DISC) ma pominięcia*
*             bez potwierdzenia użytkownika (a/b)*
*NOWE v1.19: KROK 0-ST STEP-TRACKER (shared/MOD-STEP-TRACKER.md, rejestr AU-*) —*
*             każde pominięcie obowiązkowego etapu (FAZA 0/POV/Moduł A-F/GENCORE-BUILD-SHARED/*
*             HYBRID-VALIDATION/STRIP-VER-GATE/POST-VALIDATION/DISCLAIMER) raportowane, ST-FINAL*
*             blokujący przed present_files gdy pominięto etap z gałęzi finalizacji*
*DOMAIN (lazy): J0-routing · J1-najem · J2-nieruchomosci · J3-dystrybucja*
*             J4-finansowanie · J5-umowy-wykonawcze · J6-it-konsorcjum · J7-pzp · J8-b2c*
*             J9-ip-prawa-autorskie · J10-ubezpieczenia · J20-founders · J21-rodo-regulaminy · MA-transakcje*
*SHARED lokalne (lazy): neg-strategia · alt-drafts · wykladnia · ryzyko-kwant · fm-hardship*
*             rodo · lifecycle · esg · ai-act · core-checklist*
*SHARED NOWE v1.8 (lazy, z triggerami auto): abusive-clauses · orzecznictwo-umow*
*             fallback-library · economic · missing-clause · legal-design · regulatory-horizon*
*SHARED NOWE v1.21 (lazy): model-umowy (BRAMKA 0) · diff-intelligence*
*GENERATOR v1.15 (references/generator/ + workflows/generator-*.md):*
*             rdzen-generowania · style-format-generowania · essentialia-regulaminy-i-korporacyjne*
*             generator-umowy · generator-regulaminu · generator-dokumentow-korporacyjnych*
*             generator-dokumentow-hr-rodo (Ścieżki A/B/C — regulamin pracy, RODO, Polityka AI)*
*GENERATOR v1.16 (uzupełnienie luk wobec wzorca branżowego):*
*             kategorie-klauzul-taksonomia (Adams MSCD) · boilerplate-strukturalne*
*             doktryna-uzupelnienie (open source/copyleft, wizerunek, notice&action, Polityka AI)*
*             workflows/weryfikacja-spojnosci-odeslan (dwuetapowa, analiza + generowanie)*
*NOWE v1.17 (zastępują generyczne odpowiedniki wskazówkami z literatury profesjonalnej):*
*             references/generator/legal-design-produkcyjny (WorldCC/Hagan/Haapio — standard*
*             produkcji, zastępuje "goły" scoring D1-D5 przy generowaniu)*
*             workflows/triage-szybki (🟢/🟡/🔴 — zastępuje ogólną E.3 checklistę)*
*             workflows/ocena-drugiej-strony (6 kategorii ataków devil's advocate — było nieobecne)*
*             workflows/popraw-fragment (ustandaryzowany format ZMIANA — zastępuje generyczny Tryb 4)*
*NOWE v1.18 (zweryfikowane w literaturze eksperckiej online przed wdrożeniem):*
*             mod-shared-ryzyko-kwant: PERT (O+4M+P)/6 + decision-tree probability-weighted*
*             expected value (Marc Victor, Marjorie Corman Aaron) — zastępuje "Likely × 2"*
*             mod-shared-fm-hardship: zakotwiczone w ICC Force Majeure/Hardship Clause 2020*
*             + UNIDROIT Principles art. 7.1.7 / 6.2.1-6.2.3 (Opcje A/B/C rozwiązania)*
*             mod-shared-neg-strategia: ZOPA z BATNA + principled negotiation 4 zasady*
*             (Fisher/Ury/Patton, Getting to Yes, Harvard Negotiation Project) — NEG.1B nowe*
*SHARED systemowe (/mnt/skills/user/shared/): INTAKE-GAP · HYBRID-VALIDATION · POST-VALIDATION*
*             MOD-WALIDACJA_v2 · FAKTY_v2 · terminy · raport-sytuacyjny-integracja*
*             DISCLAIMER · SYGNATURY · WERYFIKACJA-SLAD*
*Weryfikacja: isap.sejm.gov.pl · rejestr.uokik.gov.pl · uokik.gov.pl · eur-lex.europa.eu*
*             sn.pl · orzeczenia.ms.gov.pl · curia.europa.eu · saos.org.pl · uodo.gov.pl · nbp.pl*
