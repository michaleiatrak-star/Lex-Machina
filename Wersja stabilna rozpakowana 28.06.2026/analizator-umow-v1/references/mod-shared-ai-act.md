# MODUŁ SHARED-AI-ACT — KLAUZULE AI ACT W UMOWACH NA SYSTEMY AI
## Analizator Umów v1 · Moduł Współdzielony

> **Wczytaj gdy:** umowa dotyczy wdrożenia, dostarczenia lub używania systemu AI;
> SaaS oparty na AI; umowy z dostawcami modeli LLM/ML; automatyczne podejmowanie
> decyzji; rekrutacja AI, scoring AI, nadzór AI, diagnostyka AI.

> ⛔ HARD GATE — AI Act (Rozporządzenie UE 2024/1689) weryfikuj w EUR-Lex:
> eur-lex.europa.eu → szukaj: "2024/1689" lub "Artificial Intelligence Act"
> Harmonogram: Zakazy od 02.02.2025 · GPAI od 02.08.2025 · Systemy WR od 02.08.2026

---

## AI.1 PODSTAWY PRAWNE — AI ACT (ROZPORZĄDZENIE UE 2024/1689)

```
Rozporządzenie Parlamentu Europejskiego i Rady (UE) 2024/1689 z 13.06.2024
"Akt w sprawie sztucznej inteligencji" (AI Act)
Wejście w życie: 01.08.2024 r.
Weryfikuj: eur-lex.europa.eu → "2024/1689"

HARMONOGRAM STOSOWANIA (weryfikuj aktualny stan):
  02.02.2025 → Zakazy praktyk niedopuszczalnych (Art. 5 AI Act)
               Wymóg AI literacy (Art. 4) — od tej daty obowiązuje
  02.08.2025 → Przepisy o modelach GPAI ogólnego przeznaczenia (rozdz. V)
               Kary za naruszenia (rozdz. XII) z wyjątkiem art. 101
  02.08.2026 → Pełne obowiązki dla systemów AI wysokiego ryzyka (Art. 6 ust. 2)
               Systemy z Załącznika III (lista wysokiego ryzyka)
  02.08.2027 → Art. 6 ust. 1 (systemy wbudowane w produkty)

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

## AI.5 PUŁAPKI W UMOWACH NA SYSTEMY AI

| Pułapka | Opis | Rekomendacja |
|---|---|---|
| AI-P1 | Dostawca nie ujawnia klasyfikacji ryzyka systemu | Żądaj deklaracji klasyfikacji z odniesieniem do AI Act |
| AI-P2 | Brak logów i audit trail | Logi min. 6 mies., format XML/JSON, dostęp Wdrażającego |
| AI-P3 | Niedostateczna dokumentacja techniczna | Wymóg zgodności z Załącznikiem IV AI Act |
| AI-P4 | Brak mechanizmu wyłączenia/override | Klauzula "human override and stop" obowiązkowa dla WR |
| AI-P5 | Dostawca nie informuje o incydentach | Termin 48h od wykrycia incydentu (jak RODO art. 33) |
| AI-P6 | Umowa licencyjna AI z wyłączeniem odpowiedzialności za bias | Bias systemowy może = dyskryminacja → odpowiedzialność cywilna |
| AI-P7 | Brak procesu aktualizacji modelu | Po aktualizacji modelu = możliwa zmiana klasyfikacji → powiadamiaj |
| AI-P8 | Dane treningowe z naruszeniem RODO | Połącz z mod-shared-rodo.md → DPA dla danych treningowych |

---

## AI.6 ROUTING DO INNYCH MODUŁÓW

```
System AI + dane osobowe użytkowników:
  → mod-shared-rodo.md (DPA dla przetwarzania przez AI)

System AI + SaaS/cloud:
  → mod-J6-it-konsorcjum.md (SLA, dostępność, escrow kodu)

System AI w zamówieniach publicznych:
  → mod-J7-pzp.md (PZP i systemy AI: wymogi SIWZ/SWZ, KIO)

Umowa z dostawcą LLM/modelu AI (B2B):
  → mod-J6-it-konsorcjum.md (umowy licencyjne, prawa IP do modelu)
  + niniejszy moduł (klauzule AI Act)
```

---

*← Powrót do routingu: `view references/mod-J0-routing.md`*
*Podstawa prawna: Rozporządzenie UE 2024/1689 (AI Act) — eur-lex.europa.eu*
*Harmonogram i daty stosowania AI Act: weryfikuj wyłącznie w tekście Rozporządzenia UE 2024/1689 (art. 113) — eur-lex.europa.eu*
*Powiązane: mod-shared-rodo.md · mod-J6-it-konsorcjum.md · mod-J7-pzp.md*
