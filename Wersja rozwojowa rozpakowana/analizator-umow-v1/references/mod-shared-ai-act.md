# MODUŁ SHARED-AI-ACT — KLAUZULE AI ACT W UMOWACH NA SYSTEMY AI
## Analizator Umów v1 · Moduł Współdzielony

> **Wczytaj gdy:** umowa dotyczy wdrożenia, dostarczenia lub używania systemu AI;
> SaaS oparty na AI; umowy z dostawcami modeli LLM/ML; automatyczne podejmowanie
> decyzji; rekrutacja AI, scoring AI, nadzór AI, diagnostyka AI.
>
> **NIE ten moduł, tylko `JUR:umowy-j21-rodo-archiwizacja-regulaminy` J21.7a gdy:**
> klient pyta o wewnętrzną politykę/regulamin korzystania z AI dla WŁASNYCH
> pracowników (relacja pracodawca-pracownicy), nie o klauzule w umowie z
> dostawcą systemu AI (relacja dostawca-wdrażający, którą reguluje ten moduł).

> ⛔ HARD GATE — AI Act (Rozporządzenie UE 2024/1689) weryfikuj w EUR-Lex:
> eur-lex.europa.eu → szukaj: "2024/1689" lub "Artificial Intelligence Act"
> Harmonogram (art. 113 po zmianie rozporządzeniem (UE) 2026/1744): zakazy od 02.02.2025 · GPAI od 02.08.2025 ·
> pozostałe przepisy (m.in. art. 50) od 02.08.2026 · systemy WR z zał. III od 02.12.2027 · z zał. I od 02.08.2028
> ✅ [VER: https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:02024R1689-20260727, 2026-11-27]

---

## AI.1 PODSTAWY PRAWNE — AI ACT (ROZPORZĄDZENIE UE 2024/1689)

```
Rozporządzenie Parlamentu Europejskiego i Rady (UE) 2024/1689 z 13.06.2024
"Akt w sprawie sztucznej inteligencji" (AI Act)
Wejście w życie: 01.08.2024 r.
Weryfikuj: eur-lex.europa.eu → "2024/1689"

HARMONOGRAM STOSOWANIA — art. 113 w brzmieniu tekstu skonsolidowanego
02024R1689-20260727 (zmiana: rozporządzenie (UE) 2026/1744 z 8.07.2026, Dz.U. UE L 1744
z 24.7.2026) ✅ [VER: https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:02024R1689-20260727, 2026-11-27]:
  02.02.2025 → rozdz. I i II (m.in. art. 4 AI literacy, art. 5 zakazy); wyjątek: art. 5
               ust. 1 akapit pierwszy lit. ba) i bb) oraz ust. 1a i 1b — od 02.12.2026
  02.08.2025 → rozdz. III sekcja 4, rozdz. V (GPAI), VII, XII (kary, bez art. 101), art. 78
  27.07.2026 → art. 102–110
  02.08.2026 → ogólna data stosowania (pozostałe przepisy, m.in. art. 50)
  02.12.2027 → rozdz. III sekcje 1–3 (wymogi i obowiązki, m.in. art. 16, art. 26)
               dla systemów wysokiego ryzyka z art. 6 ust. 2 i ZAŁĄCZNIKA III
  02.08.2028 → rozdz. III sekcje 1–3 dla systemów z art. 6 ust. 1 i ZAŁĄCZNIKA I
  ⛔ Daty 02.08.2026 (zał. III) i 02.08.2027 (zał. I) z pierwotnego tekstu są NIEAKTUALNE.
  Systemy wprowadzone przed datą stosowania rozdz. III: art. 111 ust. 2 (tylko przy istotnych
  zmianach projektu; systemy dla organów publicznych — zgodność do 02.08.2030).

KARY:
  Zakazy (Art. 5): do 35 mln EUR lub 7% globalnego obrotu
  Systemy wysokiego ryzyka: do 15 mln EUR lub 3% obrotu
  Błędne informacje: do 7,5 mln EUR lub 1% obrotu

ROLE PODMIOTÓW (Art. 3 AI Act):
  → Dostawca (provider): opracowuje system AI i wprowadza do obrotu
  → Wdrażający (deployer): używa systemu AI w ramach swojej działalności
  → Importer: wprowadza system z kraju trzeciego na rynek UE
  → Dystrybutor: dalej udostępnia system
```

---

## AI.2 KLASYFIKACJA SYSTEMU AI — KLUCZOWA PRZED ANALIZĄ UMOWY

```
ZANIM PRZEJDZIESZ DO ANALIZY KLAUZUL: ustal klasyfikację systemu AI.

KROK 1 — CZY SYSTEM AI JEST ZAKAZANY? (Art. 5 AI Act — od 02.02.2025):
  □ Techniki podprogowe poza świadomością człowieka → ZAKAZ
  □ Exploatacja słabości grup (wiek, niepełnosprawność) → ZAKAZ
  □ Social scoring przez władze publiczne → ZAKAZ
  □ Real-time biometric surveillance w przestrzeni publicznej → ZAKAZ (z wyjątkami)
  □ Ocena ryzyka popełnienia przestępstwa (predictive policing) → ZAKAZ
  → Umowa na system zakazany → nieważna (art. 58 KC + naruszenie prawa UE)

KROK 2 — CZY SYSTEM AI JEST WYSOKIEGO RYZYKA? (Art. 6 + Załącznik III):
  Weryfikuj aktualna lista na: eur-lex.europa.eu → AI Act Annex III
  Przykłady systemów wysokiego ryzyka:
  □ Rekrutacja i selekcja pracowników (CV screening, interview AI, scoring)
  □ Ocena zdolności kredytowej (credit scoring AI)
  □ Decyzje dotyczące dostępu do edukacji
  □ Zarządzanie krytyczną infrastrukturą (energetyka, woda, transport)
  □ Systemy biometryczne (identyfikacja, kategoryzacja osób)
  □ Systemy ochrony porządku publicznego
  □ Systemy migracji i azylu
  □ Systemy wymiaru sprawiedliwości
  → Systemy WR: SZCZEGÓŁOWE OBOWIĄZKI (poniżej)

KROK 3 — MODELE OGÓLNEGO PRZEZNACZENIA (GPAI)? (Rozdz. V — od 02.08.2025):
  → Duże modele LLM (GPT, Gemini, Claude etc.) = GPAI
  → Jeśli umowa dotyczy GPAI: dodatkowe obowiązki transparentności
  
KROK 4 — SYSTEM O OGRANICZONYM RYZYKU (transparentność):
  → Chatboty, deepfakes, treści generowane przez AI
  → Obowiązek poinformowania użytkownika że ma do czynienia z AI
```

---

## AI.3 OBOWIĄZKI KONTRAKTOWE — SYSTEMY WYSOKIEGO RYZYKA

```
Przy systemach AI wysokiego ryzyka (Art. 9–15 AI Act):
PODZIAŁ OBOWIĄZKÓW wdrażający vs dostawca:

DOSTAWCA systemu AI wysokiego ryzyka musi (weryfikuj Art. 9–15 AI Act):
  □ System zarządzania ryzykiem przez cały cykl życia systemu
  □ Dokumentacja techniczna i dane treningowe
  □ Rejestracja w bazie danych UE (Art. 71 AI Act)
  □ Deklaracja zgodności UE + oznakowanie CE
  □ Logi systemowe i traceability
  □ Nadzór ludzki (human oversight) — mechanizmy umożliwiające interwencję
  □ Przejrzystość i informacja dla wdrażającego

WDRAŻAJĄCY systemu AI wysokiego ryzyka musi:
  □ Zapewnić nadzór ludzki przy stosowaniu systemu
  □ Monitorować działanie systemu na bieżąco
  □ Zgłaszać incydenty poważne dostawcy i właściwemu organowi
  □ Poinformować osoby poddane decyzji AI (jeśli dotyczy) — prawo do wyjaśnienia
  □ Ocena wpływu na prawa podstawowe (FRIA) dla organów publicznych i niektórych prywatnych
```

---

## AI.4 KLAUZULE UMOWNE — UMOWY DOSTAWCA/WDRAŻAJĄCY

### AI.4.1 Klauzula klasyfikacji i odpowiedzialności za klasyfikację

```
PUŁAPKA AI-1: Brak wskazania kto jest odpowiedzialny za klasyfikację ryzyka systemu.
  → Wdrażający myśli że klasyfikacja = obowiązek dostawcy
  → Dostawca dostarcza "low risk" ale wdrożenie = "high risk"
  Przykład: Dostawca sprzedaje "AI do selekcji CV" oznaczony jako "low risk tool".
  Klient wdraża go do rekrutacji = SYSTEM WYSOKIEGO RYZYKA z mocy AI Act.

KLAUZULA KLASYFIKACJI:
"§X. KLASYFIKACJA SYSTEMU AI I ODPOWIEDZIALNOŚĆ ZA ZGODNOŚĆ
1. Dostawca oświadcza, że System AI będący przedmiotem niniejszej Umowy
   jest klasyfikowany jako: [wskaż: zakazany / wysokiego ryzyka / ograniczonego
   ryzyka / minimalnego ryzyka] zgodnie z Rozporządzeniem EU 2024/1689 (AI Act)
   w rozumieniu planowanego przez Wdrażającego sposobu użycia opisanego w §[Y].

2. Dostawca zobowiązuje się do:
   a) poinformowania Wdrażającego o każdej zmianie klasyfikacji ryzyka Systemu AI;
   b) aktualizacji dokumentacji technicznej i środków zgodności wymaganych przez
      AI Act dla klasyfikacji wskazanej w ust. 1;
   c) niezwłocznego powiadamiania o nowych wytycznych regulatorów dotyczących
      klasyfikacji systemów zbliżonych do Systemu AI.

3. Wdrażający potwierdza, że zapoznał się z planowanym sposobem użycia Systemu AI
   i ponosi odpowiedzialność za:
   a) zapewnienie nadzoru ludzkiego przy decyzjach wspieranych przez System AI;
   b) prawidłowe wdrożenie instrukcji i środków nadzoru określonych przez Dostawcę;
   c) monitorowanie działania Systemu AI i zgłaszanie incydentów Dostawcy.

4. Zmiana sposobu użycia Systemu AI przez Wdrażającego może zmienić jego
   klasyfikację ryzyka i uruchomić nowe obowiązki. Wdrażający zobowiązuje się
   do informowania Dostawcy o każdej istotnej zmianie sposobu użycia."
```

### AI.4.2 Klauzula dokumentacji technicznej i logów

```
WYMÓG AI ACT (Art. 11 + 12 dla systemów WR):
  → Dokumentacja techniczna: opis systemu, danych, metodologii, walidacji
  → Automatyczne logi (event logs): muszą być przechowywane minimum 6 miesięcy
    po zakończeniu używania systemu (dłużej gdy wymaga inne prawo)

KLAUZULA:
"§X. DOKUMENTACJA TECHNICZNA I LOGI SYSTEMOWE
1. Dostawca dostarcza Wdrażającemu, nie później niż w dniu uruchomienia Systemu:
   a) dokumentację techniczną zgodną z Załącznikiem IV AI Act obejmującą:
      opis ogólny systemu, cel zamierzony, dane treningowe, architekturę,
      wyniki testów i walidacji, procedury zarządzania ryzykiem;
   b) instrukcję obsługi dla Wdrażającego (Art. 13 AI Act) zawierającą:
      przeznaczenie i możliwości systemu, ograniczenia i znane odchylenia,
      procedury nadzoru ludzkiego, zakres logu systemowego.

2. Logi automatyczne systemu są archiwizowane przez Dostawcę przez [minimum
   6 miesięcy / czas wymagany przez prawo] i udostępniane Wdrażającemu na żądanie.

3. Dostawca informuje Wdrażającego niezwłocznie o aktualizacjach systemu
   zmieniających jego właściwości lub wpływających na bezpieczeństwo."
```

### AI.4.3 Klauzula nadzoru ludzkiego i AI literacy

```
WYMÓG AI ACT (Art. 4 — od 02.02.2025 + Art. 14 dla systemów WR):
  → AI literacy: pracownicy używający AI muszą mieć wiedzę do świadomego korzystania
  → Human oversight: systemy WR muszą mieć mechanizmy nadzoru i stop

KLAUZULA:
"§X. NADZÓR LUDZKI I KOMPETENCJE AI
1. Wdrażający zapewnia, że decyzje podejmowane z użyciem Systemu AI
   w obszarach [rekrutacja/scoring/diagnostyka/inne — wskaż] podlegają
   weryfikacji przez przeszkolonego pracownika przed wywołaniem skutków prawnych
   lub istotnych faktycznych dla osób fizycznych.

2. Wdrażający zobowiązuje się do przeprowadzenia szkolenia z zakresu AI literacy
   dla pracowników korzystających z Systemu AI, zgodnie z Art. 4 AI Act,
   nie później niż [30] dni od uruchomienia Systemu.

3. Wdrażający implementuje procedurę umożliwiającą:
   a) ludzką weryfikację decyzji generowanych przez System AI;
   b) override (nadpisanie) wyników Systemu przez uprawnionego pracownika;
   c) wyłączenie Systemu w razie wykrycia awarii lub niebezpiecznego działania.

4. Dostawca dostarcza narzędzia techniczne umożliwiające pełne zatrzymanie
   i restart Systemu AI przez Wdrażającego bez degradacji danych."
```

### AI.4.4 Klauzula obowiązku informacyjnego wobec osób fizycznych

```
WYMÓG AI ACT (Art. 13 + 86 AI Act — systemy WR decyzje dot. osób):
  → Osoby poddane decyzji AI-assisted mają prawo do wyjaśnienia
  → Dotyczy: rekrutacja, scoring kredytowy, edukacja, świadczenia socjalne

KLAUZULA:
"§X. INFORMACJA DLA OSÓB PODDANYCH DECYZJI AI
1. Jeśli System AI wspiera decyzje dotyczące osób fizycznych (rekrutacja,
   ocena zdolności kredytowej, decyzje o świadczeniach), Wdrażający zobowiązuje się:
   a) poinformować osoby, że ich wniosek/kandydatura jest oceniana z użyciem AI;
   b) zapewnić możliwość uzyskania wyjaśnienia co do logiki i znaczenia decyzji
      (Art. 86 AI Act — prawo do wyjaśnienia decyzji AI);
   c) zapewnić możliwość zakwestionowania decyzji i ludzkiej weryfikacji.

2. Dostawca dostarcza mechanizm eksplanacyjny (explainability) umożliwiający
   wygenerowanie wyjaśnienia decyzji na żądanie Wdrażającego lub osoby zainteresowanej.
   Wyjaśnienie zawiera co najmniej: główne czynniki wpływające na ocenę,
   zakres możliwych wyników, informację o nadzorze ludzkim."
```

---

### AI.4.5 Umowa od strony dostawcy — przejście roli, klasyfikacja, instrukcja obsługi (dodane 2026-11-27)

> Atrybucja (Apache 2.0): zakres zagadnień na podstawie commercial-legal-pl v0.8
> (baza-wiedzy/17-ai-act-rola-dostawcy), opracowanie własne, brzmienia z tekstu
> skonsolidowanego 02024R1689-20260727.

```
1. KTO JEST DOSTAWCĄ — art. 25 ust. 1 AI Act ✅ [VER: https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:02024R1689-20260727, 2026-11-27]
   Dystrybutor, importer, podmiot stosujący lub inna strona trzecia staje się dostawcą
   systemu AI wysokiego ryzyka (z obowiązkami z art. 16), gdy:
   a) umieszcza swoją nazwę lub znak towarowy w systemie już wprowadzonym do obrotu
      (white-label) — „bez uszczerbku dla ustaleń umownych” o innym podziale obowiązków;
   b) dokonuje istotnej zmiany systemu, który pozostaje systemem wysokiego ryzyka;
   c) zmienia przeznaczenie systemu (także AI ogólnego przeznaczenia) tak, że staje się
      on systemem wysokiego ryzyka.
   Skutek (art. 25 ust. 2): pierwotny dostawca przestaje być dostawcą tego systemu, ale
   ma obowiązek współpracy (dokumentacja do oceny zgodności, znane ograniczenia i tryby
   awaryjne, ukierunkowany dostęp techniczny) — chyba że wyraźnie określił, że jego
   systemu nie można zmienić w system wysokiego ryzyka.
   Umowa z poddostawcą komponentu (art. 25 ust. 4): informacje, zdolności, dostęp
   techniczny i pomoc wskazuje się W DRODZE PISEMNEJ UMOWY.

   KLAUZULE / CHECKLIST:
   □ Rebranding (white-label): kto przyjmuje rolę dostawcy i obowiązki z art. 16; umowny
     podział obowiązków nie zmienia kwalifikacji wobec organów.
   □ Definicja „istotnej zmiany” i zakaz zmian przeznaczenia bez zgody dostawcy.
   □ Oświadczenie pierwotnego dostawcy z art. 25 ust. 2 akapit ostatni (system nie może
     zostać zmieniony w system WR) — gdy jest, nie ma obowiązku współpracy; sprawdź.
   □ Pisemna umowa z dostawcą komponentu/modelu (art. 25 ust. 4).

2. KLASYFIKACJA — art. 6 ust. 3 AI Act ✅ [VER: https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:02024R1689-20260727, 2026-11-27]
   System z zał. III nie jest systemem wysokiego ryzyka, gdy nie stwarza znaczącego
   ryzyka (zadanie wąsko proceduralne, poprawa wyniku pracy człowieka, wykrywanie
   wzorców bez zastępowania oceny człowieka, zadania przygotowawcze) — ALE system
   z zał. III „zawsze” jest systemem wysokiego ryzyka, gdy dokonuje PROFILOWANIA osób
   fizycznych. Dostawca, który uznaje system za niebędący WR, dokumentuje ocenę przed
   wprowadzeniem do obrotu (art. 6 ust. 4) i podlega rejestracji (art. 49 ust. 2).
   □ Umowa: kto dokonał oceny z art. 6 ust. 3–4, przekazanie dokumentacji oceny,
     zapewnienie, że system nie profiluje (albo przyjęcie kwalifikacji WR).

3. INSTRUKCJA OBSŁUGI — art. 13 ust. 3 AI Act ✅ [VER: https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:02024R1689-20260727, 2026-11-27]
   Minimum treści: tożsamość i kontakt dostawcy; przeznaczenie, poziom dokładności,
   solidności i cyberbezpieczeństwa (art. 15) i okoliczności wpływające na nie; ryzyka
   (art. 9 ust. 2); w stosownych przypadkach wyjaśnialność wyników, działanie wobec
   grup osób, dane wejściowe/treningowe; zmiany zaplanowane z góry; środki nadzoru
   człowieka (art. 14); zasoby, cykl życia, konserwacja i aktualizacje; mechanizmy
   rejestrów zdarzeń (art. 12).
   □ Instrukcja jako załącznik do umowy; obowiązek aktualizacji; brak instrukcji =
     przeszkoda w wykonaniu obowiązków podmiotu stosującego (art. 26 ust. 1).

⏳ Stosowanie: obowiązki z rozdz. III sekcje 1–3 (m.in. art. 13, 16, 26) dla systemów
   z zał. III od 02.12.2027, z zał. I od 02.08.2028 (art. 113). Umowy zawierane dziś na
   okres obejmujący te daty — klauzule wpisuj już teraz.
```

## AI.5 PUŁAPKI W UMOWACH NA SYSTEMY AI

| Pułapka | Opis | Rekomendacja |
|---|---|---|
| AI-P1 | Dostawca nie ujawnia klasyfikacji ryzyka systemu | Żądaj deklaracji klasyfikacji z odniesieniem do AI Act |
| AI-P2 | Brak logów i audit trail | Logi min. 6 mies., format XML/JSON, dostęp Wdrażającego |
| AI-P3 | Niedostateczna dokumentacja techniczna | Wymóg zgodności z Załącznikiem IV AI Act |
| AI-P4 | Brak mechanizmu wyłączenia/override | Klauzula "human override and stop" obowiązkowa dla WR |
| AI-P5 | Dostawca nie informuje o incydentach | Zgłoszenie poważnego incydentu organom nadzoru rynku: **natychmiast**, nie później niż **15 dni** od dowiedzenia się (art. 73 ust. 2); **2 dni** — powszechne naruszenie albo incydent z art. 3 pkt 49 lit. b (ust. 3); **10 dni** — gdy nastąpiła **śmierć** osoby (ust. 4); dopuszczalne zgłoszenie wstępne niepełne, potem kompletne (ust. 5). ⛔ nie „48 h jak RODO art. 33" — RODO daje 72 h po stwierdzeniu naruszenia. ✅ [VER] RZĄD 1 2026-09-17u — Cellar, polska wersja (CELEX 32024R1689) | <!-- T28-OK: cytat opisowy — dokumentacja korekty -->
| AI-P6 | Umowa licencyjna AI z wyłączeniem odpowiedzialności za bias | Bias systemowy może = dyskryminacja → odpowiedzialność cywilna |
| AI-P7 | Brak procesu aktualizacji modelu | Po aktualizacji modelu = możliwa zmiana klasyfikacji → powiadamiaj |
| AI-P8 | Dane treningowe z naruszeniem RODO | Połącz z JUR:umowy-shared-rodo → DPA dla danych treningowych |

---

## AI.6 ROUTING DO INNYCH MODUŁÓW

```
System AI + dane osobowe użytkowników:
  → JUR:umowy-shared-rodo (DPA dla przetwarzania przez AI)

System AI + SaaS/cloud:
  → mod-J6-it-konsorcjum.md (SLA, dostępność, escrow kodu)

System AI w zamówieniach publicznych:
  → JUR:umowy-j7-pzp (PZP i systemy AI: wymogi SIWZ/SWZ, KIO)

Umowa z dostawcą LLM/modelu AI (B2B):
  → mod-J6-it-konsorcjum.md (umowy licencyjne, prawa IP do modelu)
  + niniejszy moduł (klauzule AI Act)

Wewnętrzna polityka korzystania z AI dla pracowników organizacji (odrębna
od klauzul kontraktowych powyżej — dotyczy relacji pracodawca-pracownicy,
nie dostawca-wdrażający):
  → JUR:umowy-j21-rodo-archiwizacja-regulaminy, sekcja J21.7a (dodana 2026-07-30)
```

---

*← Powrót do routingu: `view JUR:umowy-j0-routing`*
*Podstawa prawna: Rozporządzenie UE 2024/1689 (AI Act) — eur-lex.europa.eu*
*Harmonogram i daty stosowania AI Act: weryfikuj wyłącznie w tekście Rozporządzenia UE 2024/1689 (art. 113) — eur-lex.europa.eu*
*Powiązane: JUR:umowy-shared-rodo · mod-J6-it-konsorcjum.md · JUR:umowy-j7-pzp*
