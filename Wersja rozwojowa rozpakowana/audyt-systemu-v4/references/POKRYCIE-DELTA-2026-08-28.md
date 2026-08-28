# POKRYCIE — DELTA 2026-08-28

## Cel

Ten dokument jest warstwą `baseline + delta` dla raportu audytu pokrycia z 27.08.2026 oraz lokalnych `MAPA-POKRYCIA.md`.
Nie zastępuje szczegółowych map rozdziałowych. Rozstrzyga wyłącznie, czy luka wskazana w raporcie nadal istnieje w aktualnym korpusie.

**Snapshot bazowy raportu:** `main@a0d91a2`, 27.08.2026.  
**Stan delta:** gałąź `codex/legal-map-verification-2026-08-28`, 28.08.2026.  
**Polityka źródeł aktów:** RZĄD 1 — ELI/ISAP; prawo UE — EUR-Lex.

## 1. Rekomendacje raportu — stan wykonania

| Rekomendacja | Stan 28.08.2026 | Dowód |
|---|---|---|
| P0: REACH/CLP → DR-10 | ✅ ZAMKNIĘTE | `prawny-router-v3/references/pokrycie-dziedzinowe.md` kieruje do `dr-10/mod-REACH-CLP-chemikalia.md` |
| P0: akcyza/cło → rzeczywiste moduły DR-06 | ✅ ZAMKNIĘTE | mapa kieruje do `mod-ustawa-akcyzowa-i-clo-UCC.md` + `mod-UCC-clo-taryfa-celna.md` |
| P0: cudzoziemcy → DR-05 kanoniczny + DR-02 perspektywa prywatna | ✅ ZAMKNIĘTE | mapa dziedzinowa rozdziela oba tory jawnie |
| P0: test spójności map | ✅ ZAMKNIĘTE | `audyt-systemu-v4/scripts/check_coverage_coherence.py` sprawdza 16 map, routing, ghost modules i stale `brak modułu` |
| P1: utworzyć MAPA-POKRYCIA dla DR-01,08,10,11,12,13,14,15,16 | ✅ ZAMKNIĘTE | wszystkie 9 plików istnieje w wersji rozwojowej |
| P1: oddzielić istnienie modułu od pokrycia | ✅ ZAMKNIĘTE STRUKTURALNIE | nowe mapy używają `DO AUDYTU`/B zamiast utożsamiać `OK` z kompletnością |
| P1: F-108 Etap 3 | ✅ ZAMKNIĘTE | wszystkie 52 pozycje mają dedykowane moduły; A=52/B=0/C=0/D=0 nominalnie |
| P1: F-108 Etap 2 | 🟡 W TOKU | audyt treściowy nadal wymaga jawnej kwalifikacji 52 aktów; nie wolno utożsamiać obecności z pełnym komentarzem |
| P2: baseline + delta | ✅ WDROŻONE | niniejszy plik; stare raporty pozostają baseline historycznym |

## 2. Luki dziedzinowe z raportu — aktualny stan

### DR-02 — cywilne / gospodarcze / egzekucja

- **KSH:** luka zerowa większości tytułów została zamknięta modułem `mod-KSH-uzupelnienie-pokrycia-2026.md` (poziom B). Dedykowane moduły pogłębiają organy sp. z o.o. oraz spółkę jawną/komandytową. Tytuł V nie jest już zerem treściowym — ma mapę wejścia i obowiązkowy fresh gate do aktualnego KSH. Nie jest to pełny komentarz art. 585–595².
- **KPC:** 15 krytycznych pozycji z raportu ma co najmniej pokrycie operacyjne; większość dawnych luk zerowych podniesiono do B/B+ w `mod-KPC-uzupelnienie-pokrycia-2026.md`.
- **Prawo upadłościowe — art. 316–334:** zamknięta luka zerowa przez `mod-PrUpad-likwidacja-miedzynarodowe-szczegolne.md`, RZĄD 1, Dz.U. 2026 poz. 913 t.j.
- **F-86 / art. 426–491^38:** merytorycznie domknięte B+ przez `mod-PrUpad-postepowania-odrebne-426-491-38.md`, RZĄD 1, Dz.U. 2026 poz. 913 t.j.
- **Prawo restrukturyzacyjne — dawne Działy I/II/VIII i zakresy wspólne:** luka zerowa zamknięta przez `mod-PrUp-PrRestr-uzupelnienie-pokrycia-2026.md`, RZĄD 1, Dz.U. 2026 poz. 533 t.j.
- **PrRestr Dział V / pomoc publiczna:** zweryfikowany ponownie w RZĄD 1 w PR #21; historyczne odesłanie do rozporządzenia 659/1999 zostało rozdzielone od aktualnego reżimu 2015/1589.

**Stan DR-02:** brak wskazanych w raporcie luk *zerowych* o priorytecie krytycznym. Pozostają luki głębokości (🟡 B/B+) i pełny audyt rozdziałowy KC/KRO/KSH.

### DR-03 — karne / wykroczenia / wykonawcze

- **KKW:** dawny zakres zerowy poza F-75 został objęty `mod-KKW-uzupelnienie-pokrycia-2026.md`; F-75 pozostaje domknięte modułami dedykowanymi.
- **KPK:** art. 575 §1 skorygowany; art. 156 §1–6, 437 §1–2 i 498 ponownie zweryfikowane w ELI 28.08.2026.
- **Narkotyki:** mapa zaktualizowana do Dz.U. 2026 poz. 1004, obowiązywanie od 27.08.2026.

**Stan DR-03:** raportowy opis `dużej luki KKW` jest historyczny; pozostaje audyt głębokości KW/KPW, nie luka strukturalna KKW.

### DR-04 — praca / ZUS / świadczenia

- **SUS:** dawne luki organizacja ZUS / składki / konta / kontrola / art. 98 mają moduł `mod-SUS-uzupelnienie-pokrycia-2026.md`.
- **FUS:** pozostałe działy mają `mod-FUS-uzupelnienie-pokrycia-2026.md`.
- **Ustawa zasiłkowa:** dedykowany moduł B+, Dz.U. 2026 poz. 854 t.j., RZĄD 1.

**Stan DR-04:** wskazane w raporcie luki zerowe SUS/FUS są zamknięte operacyjnie; pozostaje pogłębianie artykuł-po-artykule.

### DR-05 — administracyjne / PPSA

- Dawne czerwone zakresy PPSA mają `mod-PPSA-uzupelnienie-pokrycia-2026.md` oraz moduły dedykowane terminom/kasacji/prawu pomocy i posiedzeniom/orzeczeniom.

**Stan DR-05:** brak raportowej luki strukturalnej PPSA; pozostaje audyt jakości i głębokości.

### DR-06 — podatki

- **Ordynacja podatkowa:** dawne luki zerowe mają `mod-OP-uzupelnienie-pokrycia-2026.md`; kontrola podatkowa Dział VI była już wcześniej domknięta.
- **Akcyza/cło:** routing naprawiony; akcyza ma benchmark 27/27, UCC/CN ma moduły dedykowane.

**Stan DR-06:** raportowy problem `brak modułu akcyza/cło` jest zamknięty; OP wymaga dalszego pogłębiania, nie zerowego routingu.

### DR-07 — PZP

- Dawne luki formalności wyboru / instrumenty szczególne / organy / ADR mają warstwę `mod-PZP-uzupelnienie-pokrycia-2026.md`.
- Art. 218–226 i 531–568a zostały ponownie zweryfikowane w RZĄD 1 w PR #21; skorygowano opis art. 535 i datę wejścia zmiany.

**Stan DR-07:** krytyczna luka Działu II nie występuje już jako zero treści; pozostaje różna głębokość poszczególnych segmentów.

### DR-09 — budownictwo

- Dawne braki: prowadzenie robót, dziennik budowy, książka obiektu, katastrofy, organy i odpowiedzialność zawodowa mają warstwę `mod-PrBud-uzupelnienie-pokrycia-2026.md`.

**Stan DR-09:** raportowe czerwone zera PrBud zostały zamknięte do poziomu operacyjnego; nie jest to certyfikat komentarza pełnego.

### DR-01, DR-08, DR-10–DR-16

Każda z tych rodzin ma już `MAPA-POKRYCIA.md`. Status `🟡 DO AUDYTU` oznacza świadome rozdzielenie rejestracji od kompletności. Sam fakt utworzenia map nie podnosi aktów do pełnego pokrycia.

## 3. Metryki prawne zweryfikowane 28.08.2026

- KC — Dz.U. 2026 poz. 795 t.j.
- KPC — Dz.U. 2026 poz. 468 t.j.
- KPK — Dz.U. 2026 poz. 490 t.j.
- Prawo upadłościowe — Dz.U. 2026 poz. 913 t.j.
- Prawo restrukturyzacyjne — Dz.U. 2026 poz. 533 t.j.
- Prawo przedsiębiorców — Dz.U. 2025 poz. 1480 t.j.
- Prawo wekslowe — Dz.U. 2022 poz. 282 t.j.
- Prawo czekowe — Dz.U. 2016 poz. 462 t.j.
- PZP — Dz.U. 2026 poz. 793 t.j.

Aktualny tekst jednolity nie znosi fresh gate: przed cytowaniem konkretnej jednostki należy pobrać aktualny tekst ujednolicony i sprawdzić późniejsze nowelizacje.

## 4. Reguła synchronizacji

1. `MAPA-AKTOW.md` = akt → moduł i metryka.
2. `MAPA-POKRYCIA.md` = szczegółowy baseline pokrycia.
3. `POKRYCIE-DELTA-YYYY-MM-DD.md` = zmiany po baseline i rozstrzygnięcia starych luk.
4. `prawny-router-v3/references/pokrycie-dziedzinowe.md` = routing dziedzinowy, nie certyfikat kompletności.
5. `F-108-lista-MS-egzamin-2026.md` = niezależny benchmark 52 aktów; A=obecność nie oznacza pełnego pokrycia.

Jeżeli baseline i delta są sprzeczne co do tego, czy luka istnieje, nowsza delta ma pierwszeństwo **wyłącznie w zakresie statusu luki**; przy treści prawa zawsze pierwszeństwo ma świeży RZĄD 1.