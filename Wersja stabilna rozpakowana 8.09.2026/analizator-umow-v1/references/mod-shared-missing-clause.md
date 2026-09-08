# MODUŁ SHARED-MISSING-CLAUSE — DETEKTOR BRAKUJĄCYCH KLAUZUL
## Analizator Umów v1 · Moduł Współdzielony

> **Wczytaj gdy:** analiza umowy zakończona (Moduł A–D) i wymagana pełna ocena,
> pełny raport F.1, analiza regulaminów SaaS/cloud/B2C/B2B,
> lub pytanie o "co powinno być w umowie" / "czego brakuje".
>
> Silnik wykrywa BRAKUJĄCE klauzule na podstawie katalogu minimalnego
> dla danego typu umowy. Równie ważne jak analiza istniejących postanowień.

---

## MCD.0 TRIGGER I ZASADA

```
WYKRYJ typ umowy z Fazy 0 lub J0-routing:
  → SaaS/cloud → MCD.1
  → Marketplace → MCD.2
  → B2C (e-commerce, regulamin) → MCD.3
  → B2B (usługi, dostawa) → MCD.4
  → IT (development, wdrożenie) → MCD.5
  → Umowa o pracę → MCD.6
  → IoT / hardware / urządzenia → MCD.7
  → M&A / inwestycja → MCD.8

Zasada: BRAK klauzuli z katalogu minimalnego = ALERT z poziomem ryzyka
Format alertu: 🔴 KRYTYCZNE / 🟠 WAŻNE / 🟡 ZALECANE
```

---

## MCD.1 SAAS / CLOUD — KATALOG MINIMALNY

```
KLAUZULE OBOWIĄZKOWE (brak = 🔴 KRYTYCZNE):
  □ SLA — Service Level Agreement (poziom dostępności, czas reakcji)
  □ DPA — Data Processing Agreement / Umowa Powierzenia (RODO art. 28)
  □ Prawo do eksportu danych (Data Act od 12.09.2025 — nowe umowy)
  □ Procedura zakończenia umowy + czas dostępu do danych po zakończeniu
  □ Wyłączenie odpowiedzialności za utratę danych (lub reguła odpowiedzialności)
  □ Backup policy — częstotliwość, retencja, lokalizacja kopii
  □ Prawo do audytu bezpieczeństwa (lub certyfikacja ISO 27001/SOC 2)

KLAUZULE WAŻNE (brak = 🟠 WAŻNE):
  □ DRP — Disaster Recovery Plan (czas przywrócenia, RPO/RTO)
  □ Subprocessing — lista podwykonawców / zgoda na zmianę podwykonawców
  □ Incident notification — czas powiadomienia o naruszeniu bezpieczeństwa
  □ Change management — procedura zmian w systemie z wyprzedzeniem
  □ Escrow code — kod źródłowy w depozycie (gdy SaaS krytyczny)
  □ Prawo do przeniesienia konta / multi-tenant isolation

KLAUZULE ZALECANE (brak = 🟡 ZALECANE):
  □ Roadmap — harmonogram rozwoju produktu
  □ Support tiers — poziomy wsparcia technicznego
  □ Vendor lock-in mitigation — procedura migracji do innego dostawcy
  □ Price change notification — czas wyprzedzenia dla zmian cenowych
  □ Open source disclosure — wykaz komponentów open source

GENERUJ ALERT:
  🔴 ALERT — BRAK KLAUZULI: [nazwa]
  Ryzyko: [opis konkretnego ryzyka np. "brak DPA = naruszenie RODO art. 28"]
  Rekomendacja: [gotowy schemat klauzuli lub odesłanie do FL-library]
```

---

## MCD.2 MARKETPLACE / PLATFORMA — KATALOG MINIMALNY

```
KLAUZULE OBOWIĄZKOWE (brak = 🔴 KRYTYCZNE):
  □ Procedura moderacji treści + uzasadnienie usunięcia (DSA art. 17)
  □ Mechanizm odwołania od decyzji platformy (DSA art. 20)
  □ Ochrona danych sprzedawców / zakaz self-preferencing (DMA)
  □ Procedura rozstrzygania sporów sprzedawca–platforma (P2B art. 11)
  □ Ujawnienie rankingu ofert i roli płatnego plasowania (Omnibus + P2B)
  □ Regulamin zwrotów + reklamacji (ustawa o prawach konsumenta)
  □ Informacja o prawach konsumenta przy zakupie na platformie

KLAUZULE WAŻNE (brak = 🟠 WAŻNE):
  □ Polityka zwrotów towarów cyfrowych / treści cyfrowych
  □ Procedura zgłaszania nielegalnych treści (DSA art. 16)
  □ System weryfikacji opinii kupujących (Omnibus)
  □ Ujawnienie czy sprzedawca jest przedsiębiorcą czy osobą prywatną
  □ Zasady naliczania prowizji + warunki zmiany
  □ Klauzula MFN / parytet cenowy → ZAKAZ (DMA art. 5)

KLAUZULE ZALECANE (brak = 🟡 ZALECANE):
  □ Program dla sprzedawców (onboarding, scoring, sankcje)
  □ Procedura postępowania przy danych wrażliwych
```

---

## MCD.3 B2C (E-COMMERCE, REGULAMIN) — KATALOG MINIMALNY

```
KLAUZULE OBOWIĄZKOWE (brak = 🔴 KRYTYCZNE):
  □ Prawo do odstąpienia 14 dni (art. 27 u.p.k.)
  □ Informacja przedkontraktowa (art. 12 u.p.k. — 23 elementy)
  □ Dane identyfikacyjne przedsiębiorcy (art. 12 ust. 1 pkt 1 u.p.k.)
  □ Procedura reklamacji + termin rozpatrzenia (14 dni — weryfikuj)
  □ Polityka zwrotów i reklamacji (rękojmia / niezgodność B2C)
  □ Klauzula dotycząca najniższej ceny z 30 dni (Omnibus)
  □ Informacja o ADR — pozasądowe rozstrzyganie sporów

KLAUZULE WAŻNE (brak = 🟠 WAŻNE):
  □ Polityka prywatności / cookies (RODO + ePrivacy)
  □ Warunki dostawy i czas realizacji
  □ Procedura dla treści cyfrowych / usług cyfrowych (dyrektywa 2019/770)
  □ Informacja o zabezpieczeniu płatności (PSD2, PCI-DSS)
  □ Procedura obsługi komentarzy/opinii (Omnibus — tylko zweryfikowane)
```

---

## MCD.4 B2B (USŁUGI / DOSTAWA) — KATALOG MINIMALNY

```
KLAUZULE OBOWIĄZKOWE (brak = 🔴 KRYTYCZNE):
  □ Opis zakresu usługi / specyfikacja (scope of work)
  □ Termin realizacji + skutki opóźnienia
  □ Wynagrodzenie + harmonogram płatności
  □ Procedura odbioru prac / acceptance criteria
  □ Odpowiedzialność za wady + terminy zgłoszenia
  □ Klauzula poufności (NDA)
  □ Prawo właściwe i sąd właściwy

KLAUZULE WAŻNE (brak = 🟠 WAŻNE):
  □ Kara umowna za opóźnienie (ochrona zamawiającego)
  □ Prawo do wypowiedzenia (z zachowaniem okresu)
  □ Procedura zmian zakresu (change order / aneks)
  □ Ubezpieczenie OC (wym. od wykonawcy)
  □ Zakaz cesji bez zgody
  □ RODO / DPA jeśli przekazywane dane osobowe

KLAUZULE ZALECANE (brak = 🟡 ZALECANE):
  □ Procedura eskalacji sporów przed postępowaniem sądowym
  □ Klauzula waloryzacji wynagrodzenia
  □ Zabezpieczenie należytego wykonania (kaucja, gwarancja bankowa)
```

---

## MCD.5 IT / DEVELOPMENT / WDROŻENIE — KATALOG MINIMALNY

```
KLAUZULE OBOWIĄZKOWE (brak = 🔴 KRYTYCZNE):
  □ Specyfikacja funkcjonalna (załącznik) — brak = spór o zakres
  □ Procedura odbioru z kryteriami jakościowymi
  □ Przeniesienie majątkowych praw autorskich (art. 41 PrAut) + pola eksploatacji
  □ Procedura zgłaszania i naprawiania błędów (SLA gwarancyjne)
  □ Własność kodu źródłowego i dokumentacji
  □ DPA jeśli przetwarzane są dane osobowe użytkowników

KLAUZULE WAŻNE (brak = 🟠 WAŻNE):
  □ Escrow kodu źródłowego (gdy krytyczny system)
  □ Procedura zmian wymagań (change request + wycena)
  □ Testy akceptacyjne — kto przeprowadza, kryteria sukcesu
  □ Odpowiedzialność za błędy po odbiorze (rękojmia / gwarancja)
  □ Stack technologiczny — zakaz nieuzgodnionych zmian
  □ Open source policy — jakie licencje dopuszczalne
  □ Procedura przekazania knowledge transfer po zakończeniu

KLAUZULE ZALECANE (brak = 🟡 ZALECANE):
  □ Harmonogram kamieni milowych z płatnościami
  □ Procedura obsługi bezpieczeństwa / penetration testing
  □ Definicja "błędu krytycznego" / "błędu blokującego"
```

---

## MCD.6 UMOWA O PRACĘ — KATALOG MINIMALNY

```
KLAUZULE OBOWIĄZKOWE (brak = 🔴 KRYTYCZNE):
  □ Rodzaj umowy i czas trwania (art. 29 §1 KP — weryfikuj)
  □ Strony umowy + data zawarcia
  □ Rodzaj pracy / stanowisko
  □ Miejsce wykonywania pracy
  □ Wynagrodzenie (składniki + terminy wypłaty)
  □ Wymiar czasu pracy
  
KLAUZULE WAŻNE (brak = 🟠 WAŻNE):
  □ Zakaz konkurencji (jeśli stosowany) — art. 101¹ KP
  □ Klauzula poufności (tajemnica pracodawcy)
  □ Procedura pracy zdalnej (jeśli dopuszczana) — art. 67⁵ KP
  □ Benefity + warunki zmiany
  □ Warunki rozwiązania + okresy wypowiedzenia
```

---

## MCD.7 IOT / HARDWARE / URZĄDZENIA — KATALOG MINIMALNY

```
KLAUZULE OBOWIĄZKOWE (brak = 🔴 KRYTYCZNE):
  □ Własność danych generowanych przez urządzenie (Data Act art. 4)
  □ Prawo dostępu użytkownika do własnych danych
  □ Prawo do przeniesienia danych do innego dostawcy (Data Act art. 23–25)
  □ Czas wsparcia technicznego / aktualizacji bezpieczeństwa
  □ Procedura po zakończeniu wsparcia (EOL — end of life)
  □ CRA (Cyber Resilience Act) compliance — weryfikuj Dz.Urz. UE 2024/2847

KLAUZULE WAŻNE (brak = 🟠 WAŻNE):
  □ Procedura zgłaszania podatności (CVD — coordinated vulnerability disclosure)
  □ Zakaz vendor lock-in dla danych (brak opłat zaporowych za transfer)
  □ Interoperacyjność (Data Act + CRA wymogi)
  □ Informacja o firmwarem i aktualizacjach (NIS2 / CRA)
```

---

## MCD.8 M&A — KATALOG MINIMALNY

```
KLAUZULE OBOWIĄZKOWE (brak = 🔴 KRYTYCZNE):
  □ Representations & Warranties (oświadczenia i gwarancje sprzedającego)
  □ Indemnification (odszkodowanie za naruszenie R&W)
  □ Material Adverse Change (MAC) clause
  □ Closing conditions — warunki zawarcia transakcji
  □ Escrow / retencja ceny zabezpieczające R&W
  □ Non-compete post-closing (zakaz konkurencji po sprzedaży)

KLAUZULE WAŻNE (brak = 🟠 WAŻNE):
  □ Earn-out (wynagrodzenie zależne od wyników)
  □ Tag-along / drag-along (SHA)
  □ Anti-dilution (ochrona przed rozwodnieniem)
  □ Information rights (prawa informacyjne inwestora)
  □ RODO compliance — due diligence danych
```

---

## MCD.9 FORMAT ALERTU W RAPORCIE

```
Generuj po przeskanowaniu umowy pod kątem MCD:

━━━ BRAKUJĄCE KLAUZULE — ALERT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ TYP UMOWY: [SaaS / B2C / B2B / IT / ...] · Standard: MCD.[nr]   │
├────────────────────────────────────┬──────────────┬──────────────┤
│ Brakująca klauzula                 │ Ryzyko       │ Priorytet    │
├────────────────────────────────────┼──────────────┼──────────────┤
│ DPA / Umowa powierzenia (RODO)     │ Naruszenie   │ 🔴 KRYTYCZNE │
│                                    │ art. 28 RODO │              │
├────────────────────────────────────┼──────────────┼──────────────┤
│ Backup policy                      │ Utrata danych│ 🟠 WAŻNE     │
├────────────────────────────────────┼──────────────┼──────────────┤
│ Procedura change management        │ Spory        │ 🟡 ZALECANE  │
└────────────────────────────────────┴──────────────┴──────────────┘
│ REKOMENDACJA: dodaj [X] klauzul przed podpisaniem                │
│ → Skontaktuj się z: [pisma-procesowe-v3 / analizator-umow]      │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## MCD.10 ŹRÓDŁA ONLINE

```
isap.sejm.gov.pl → KC, ustawa o prawach konsumenta, KP (weryfikuj art.)
eur-lex.europa.eu → dyrektywy: 2019/770, 2019/2161, 93/13
                     rozporządzenia: RODO 2016/679, Data Act 2023/2854,
                     DSA 2022/2065, CRA 2024/2847
uodo.gov.pl → wytyczne dot. DPA / art. 28 RODO
web_search: "DPA wzór umowy powierzenia UODO art 28 RODO 2025"
web_search: "SaaS klauzule minimalne umowa kontraktowa 2024 2025"
web_search: "DSA wymogi regulamin platformy art 17 2024 2025"
```

---

*mod-shared-missing-clause.md · Analizator Umów v1 · Detektor brakujących klauzul*
*Uruchamiany przy pełnej analizie F.1 i na żądanie*
