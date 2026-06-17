---
name: analizator-umow-v1
version: 1.10
type: executive-umowy
status: production
description: |
  Analizator Umów v1 (v1.10) — analiza, redakcja i negocjacje umów.
  PRIMARY: B2B (G), umowa o pracę (H), zakaz konkurencji (I).
  DOMAIN: J0 routing, J1 najem, J2 nieruchomości/UUDE, J3 dystrybucja,
  J4 finansowanie, J5 wykonawcze, J6 IT/SaaS/agile, J7 PZP/FIDIC,
  J8 konsumenckie B2C, J9 IP/prawa autorskie (art. 41-68 PrAut),
  J10 ubezpieczenia (OWU poza B2C), J20 founders'/spółka/statut/organy,
  J21 RODO/archiwizacja/regulaminy pracy-wynagradzania-ZFŚS, MA transakcje.
  SHARED: NEG, ALT, WYKLADNIA, RYZYKO-KWANT, FM-HARDSHIP, RODO, LIFECYCLE,
  ESG, AI-ACT, CORE-CHECKLIST, TRIAGE, SO, DA + systemowe shared/.
  Przepisy, akty UE i klauzule UOKiK weryfikować wyłącznie w źródłach
  urzędowych przed użyciem.
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

## ROUTING DO MODUŁÓW

### Moduły PRIMARY — wczytaj na podstawie typu umowy

| Typ umowy | Moduł | Ścieżka |
|---|---|---|
| Umowa B2B / kontrakt menedżerski | **G** | `view references/b2b-podwykonawcze.md` |
| Umowa podwykonawcza budowlana | **G + G.3** | `view references/b2b-podwykonawcze.md` |
| Umowa podwykonawcza IT / software | **G + J6** | `view references/b2b-podwykonawcze.md` + `view references/mod-J6-it-konsorcjum.md` |
| Pseudosamozatrudnienie / test pracy | **G.1** | `view references/b2b-podwykonawcze.md` |
| Umowa o pracę / kontrakt pracowniczy | **H** | `view references/umowy-o-prace.md` |
| Zakaz konkurencji (każdy typ) | **I** | `view references/zakaz-konkurencji.md` |

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

### Moduły SYSTEMOWE — z katalogu user/shared (wczytuj przez view)

| Sytuacja | Moduł | Ścieżka |
|---|---|---|
| Brakujące dane w Fazie 0 (⬛ pola) | **INTAKE-GAP** | `view /mnt/skills/user/shared/INTAKE-GAP.md` |
| Przed wygenerowaniem umowy / klauzul | **HYBRID-VALIDATION** | `view /mnt/skills/user/shared/HYBRID-VALIDATION.md` |
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

---

## ZASADY FUNDAMENTALNE

**Zasada 1 — Weryfikacja prawa wyłącznie w oficjalnych źródłach:**
- Prawo polskie → isap.sejm.gov.pl (tekst jednolity)
- Klauzule niedozwolone → rejestr.uokik.gov.pl
- Decyzje UOKiK → uokik.gov.pl
- RODO → eur-lex.europa.eu → GDPR 2016/679
- Dyrektywy UE → eur-lex.europa.eu
- Orzecznictwo → sn.pl, orzeczenia.ms.gov.pl, saos.org.pl
- Deweloperzy → oficjalny rejestr inwestycji deweloperskich (gov.pl — zweryfikuj adres), ekw.ms.gov.pl

**Zasada 2 — Zakaz fikcyjnych sygnatur:**
Każda klauzula z rejestru UOKiK musi mieć numer wpisu z rejestr.uokik.gov.pl.
Jeśli nie znaleziono → wskaż art. 385¹ KC + uzasadnienie analogią.

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

**Na podstawie wartości umowy — skaluj głębokość i format raportu:**

```
<10 000 PLN        → F.2 (skrócony)
10 000–50 000 PLN  → F.1-LITE (pośredni) — wczytaj mod-core-checklist.md
>50 000 PLN        → F.1 (pełny) — wczytaj mod-core-checklist.md
>100 000 PLN       → F.1 + RYZYKO-KWANT + NEG obowiązkowo
na żądanie         → zawsze F.1 niezależnie od kwoty
```

---

*Skill analizator-umow-v1 v1.8 · PRIMARY: b2b-podwykonawcze · umowy-o-prace · zakaz-konkurencji*
*DOMAIN (lazy): J0-routing · J1-najem · J2-nieruchomosci · J3-dystrybucja*
*             J4-finansowanie · J5-umowy-wykonawcze · J6-it-konsorcjum · J7-pzp · J8-b2c*
*             J9-ip-prawa-autorskie · J10-ubezpieczenia · MA-transakcje*
*SHARED lokalne (lazy): neg-strategia · alt-drafts · wykladnia · ryzyko-kwant · fm-hardship*
*             rodo · lifecycle · esg · ai-act · core-checklist*
*SHARED NOWE v1.8 (lazy, z triggerami auto): abusive-clauses · orzecznictwo-umow*
*             fallback-library · economic · missing-clause · legal-design · regulatory-horizon*
*SHARED systemowe (/mnt/skills/user/shared/): INTAKE-GAP · HYBRID-VALIDATION · POST-VALIDATION*
*             MOD-WALIDACJA_v2 · FAKTY_v2 · terminy · raport-sytuacyjny-integracja*
*             DISCLAIMER · SYGNATURY · WERYFIKACJA-SLAD*
*Weryfikacja: isap.sejm.gov.pl · rejestr.uokik.gov.pl · uokik.gov.pl · eur-lex.europa.eu*
*             sn.pl · orzeczenia.ms.gov.pl · curia.europa.eu · saos.org.pl · uodo.gov.pl · nbp.pl*
