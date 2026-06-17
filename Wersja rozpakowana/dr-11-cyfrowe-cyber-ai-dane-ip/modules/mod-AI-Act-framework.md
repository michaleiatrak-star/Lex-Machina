# Moduł [AB] — Prawo AI / AI Act

> **Plik:** `/mnt/skills/user/prawny-router-v3/references/modules/mod-AB-prawo-ai.md`
> **Wersja:** 1.0 (2026-05-25)
> **Status:** NOWY — naprawa BLOKER-4
> **Weryfikacja:** web_search 2026-05-25 (prawo.pl, parp.gov.pl, mycompanypolska.pl, infor.pl)

---

**Zakres:** Rozporządzenie UE 2024/1689 (AI Act), polska ustawa o systemach AI (projekt
zatwierdzony przez rząd 01.04.2026 r.), odpowiedzialność za systemy AI, zgodność,
nadzór, kary administracyjne, systemy zakazane, systemy wysokiego ryzyka, GPAI.

---

## KLUCZOWE AKTY PRAWNE

```
PRAWO UE (bezpośrednio stosowane w Polsce — bez transpozycji):
  - Rozporządzenie PE i Rady (UE) 2024/1689 z 13.06.2024 r. — AI Act
    → weryfikuj: eur-lex.europa.eu
    → weszło w życie: 01.08.2024 r.

ETAPY STOSOWANIA AI Act (zweryfikowano 2026-05-25):
  02.02.2025  → Przepisy o systemach zakazanych (art. 5) + AI Literacy (art. 4)
  02.08.2025  → Organy krajowe + kary za naruszenia zakazów + modele GPAI (art. 51–55)
  02.08.2026  → Systemy wysokiego ryzyka (aneks III) — pełne obowiązki
  02.08.2027  → Niektóre systemy wbudowane (aneks I)

PRAWO POLSKIE:
  - Projekt ustawy o systemach sztucznej inteligencji
    (zatwierdzony przez Rząd RP 01.04.2026 r., MC)
    → Powołuje: Komisja Rozwoju i Bezpieczeństwa Sztucznej Inteligencji (KRiBSI)
    → Na etapie: projekt przed uchwaleniem przez Sejm (stan na 2026-05-25)
    → UWAGA: AI Act obowiązuje bezpośrednio NIEZALEŻNIE od stanu ustawy krajowej

POWIĄZANE:
  - RODO (rozporządzenie 2016/679) — dane osobowe w systemach AI
  - Dyrektywa 2013/36/UE (CRD IV) — AI w finansach
  - Dyrektywa o odpowiedzialności za AI (projekt) — w toku na poziomie UE
```

---

## KLASYFIKACJA SYSTEMÓW AI (art. 5 i Aneks III AI Act)

### Systemy ZAKAZANE (art. 5 — od 02.02.2025)

```
□ Biometryczna identyfikacja w czasie rzeczywistym w przestrzeni publicznej
  (wyjątek: zwalczanie poważnej przestępczości — art. 5 ust. 1 lit. h)
□ Kategoryzacja biometryczna wg cech chronionych (rasa, religia, orientacja seksualna)
□ Systemy social scoring przez władze publiczne
□ Manipulacja podświadoma lub exploitacja wrażliwości (wiek, niepełnosprawność)
□ Przewidywanie przestępczości na podstawie profilowania (nie dowodów)
□ Nieuprawnione scraping twarzy z internetu lub CCTV
□ Rozpoznawanie emocji w miejscu pracy i edukacji (wyjątki: medycyna, bezpieczeństwo)
```

### Systemy WYSOKIEGO RYZYKA (Aneks III — od 02.08.2026)

```
Kategorie (8 grup):
  1. Infrastruktura krytyczna (energia, woda, transport)
  2. Edukacja i szkolenia zawodowe (ocena uczniów, dostęp)
  3. Zatrudnienie i zarządzanie pracownikami (rekrutacja, awanse)
  4. Usługi publiczne (zasiłki, ocena zdolności kredytowej)
  5. Egzekwowanie prawa (ocena ryzyka recydywy, detekcja emocji)
  6. Zarządzanie migracją i azyl
  7. Wymiar sprawiedliwości i procesy demokratyczne
  8. Urządzenia medyczne

Obowiązki dostawców systemów wysokiego ryzyka:
  □ System zarządzania ryzykiem (art. 9)
  □ Zarządzanie danymi i danymi szkoleniowymi (art. 10)
  □ Dokumentacja techniczna (art. 11)
  □ Prowadzenie dzienników zdarzeń (art. 12)
  □ Przejrzystość i dostarczanie informacji użytkownikom (art. 13)
  □ Nadzór ludzki (art. 14)
  □ Dokładność, solidność i cyberbezpieczeństwo (art. 15)
  □ Ocena zgodności + oznakowanie CE (art. 43–48)
```

### Modele AI ogólnego przeznaczenia GPAI (art. 51–55 — od 02.08.2025)

```
Obowiązki dostawców GPAI:
  □ Dokumentacja techniczna
  □ Streszczenie danych treningowych (prawa autorskie)
  □ Polityka zgodności z prawem autorskim
  □ Dodatkowe dla modeli z ryzykiem systemowym (FLOP > 10^25):
    - Ocena ryzyka
    - Raportowanie incydentów
    - Środki cyberbezpieczeństwa
```

---

## KARY (art. 99 AI Act)

```
Systemy zakazane (art. 5):         do 35 mln EUR lub 7% globalnego obrotu
Systemy wysokiego ryzyka (narusz.): do 15 mln EUR lub 3% globalnego obrotu
Podanie nieprawdziwych informacji:  do 7,5 mln EUR lub 1,5% globalnego obrotu
Podmioty MŚP:                       kary obliczane proporcjonalnie (niższy próg)

KRiBSI (Polska): postępowania + kary + kontrole — po wejściu w życie ustawy krajowej
UWAGA: kary za naruszenia art. 5 (zakazy) mogą być nakładane od 02.08.2025 r.
       nawet bez powołanego KRiBSI przez Komisję Europejską / inne organy
```

---

## AI W WYMIARZE SPRAWIEDLIWOŚCI

```
Art. 5 ust. 1 lit. f AI Act: zakaz systemów oceny ryzyka recydywy opartych WYŁĄCZNIE
na profilowaniu (bez indywidualnej oceny przez człowieka).

Systemy wsparcia decyzji sądowych → kategoria wysokiego ryzyka (Aneks III pkt 8):
  □ Wymóg nadzoru ludzkiego (sędzia musi zachować kontrolę nad decyzją)
  □ Zakaz zastąpienia sędziego przez AI
  □ Transparentność: strony muszą wiedzieć o użyciu AI

Praktyczne pytania prawne 2025–2026:
  - Czy dowód z AI (transkrypcja AI, analiza AI) jest dopuszczalny? → Brak expressis verbis
    regulacji KPK/KPC; stosuj: zasada swobodnej oceny dowodów (art. 233 KPC, art. 7 KPK)
    + wymóg transparentności AI Act
  - Odpowiedzialność cywilna za błąd AI → KC art. 415 (wina) lub art. 435 (ryzyko) +
    dyrektywa o odpowiedzialności za AI (projekt UE)
  - RODO + AI w postępowaniu sądowym → art. 22 RODO: zakaz wyłącznie zautomatyzowanego
    podejmowania decyzji wywołujących skutki prawne
```

---

## AI LITERACY (art. 4 — od 02.02.2025)

```
Obowiązek pracodawców (dostawcy i podmioty stosujące AI):
  → Zapewnienie odpowiedniego poziomu kompetencji AI wśród personelu
  → Dotyczy osób zajmujących się działaniem i wykorzystaniem systemów AI
  → Brak precyzyjnego progu — proporcjonalne do ryzyka i złożoności systemu
```

---

## PYTANIA KWALIFIKACYJNE (routing)

Pytanie od użytkownika → moduł AB gdy zawiera:
- "AI Act" / "sztuczna inteligencja prawo" / "system AI zgodność" / "GPAI"
- "zakaz AI" / "wysokie ryzyko AI" / "certyfikacja AI" / "oznakowanie CE AI"
- "kara za AI" / "KRiBSI" / "komisja AI Polska"
- "odpowiedzialność za błąd AI" / "dowód z AI w sądzie" / "AI w rekrutacji prawo"
- "AI literacy" / "kompetencje AI obowiązek" / "dokumentacja AI"

---

## ŁĄCZ Z

| Sytuacja | Skill / Moduł |
|---|---|
| RODO + AI (dane osobowe w systemach AI) | `mod-P-rodo.md` |
| Prawa autorskie do treści AI | `mod-O-wlasnosc-intelektualna.md` |
| AI w umowach (klauzule zgodności) | `analizator-umow-v1` |
| Pismo / skarga do KRiBSI | `pisma-procesowe-v3` |
| AI w postępowaniu sądowym (dowód) | `analizator-dowodow-v3` |
| AI w miejscu pracy (art. 5 zakazy) | `mod-A-prawo-pracy.md` |
| AI w administracji publicznej | `mod-G-administracyjne.md` |

---

## WERYFIKACJA

Przepisy AI Act: eur-lex.europa.eu (rozporządzenie 2024/1689)
Status ustawy polskiej: legislacja.gov.pl (projekt MC, 2026)
Wytyczne KE: digital-strategy.ec.europa.eu
Aktualizuj przy każdym pytaniu — etapy stosowania AI Act są kroczące.

```
⚠️ UWAGA SYSTEMOWA: AI Act jest prawem dynamicznym (kolejne etapy stosowania
w 2025, 2026, 2027). ZAWSZE weryfikuj aktualny etap stosowania przed analizą.
Stan na 2026-05-25: obowiązują art. 5 (zakazy) + art. 4 (AI literacy) + art. 51-55 (GPAI).
```

---

## ⚡ AKTUALIZACJA STATUS PRAWA POLSKIEGO (VER: 2026-06-05)

```
AI Act (Rozp. UE 2024/1689):
  → W życie: 01.08.2024
  → Etapy stosowania (OBOWIĄZUJĄCE na 2026-06-05):
    ✅ 02.02.2025: Zakazy (art. 5) + AI Literacy (art. 4) — OBOWIĄZUJĄ
    ✅ 02.08.2025: GPAI (art. 51–55) + organy krajowe — OBOWIĄZUJĄ
    ⏳ 02.08.2026: Systemy wysokiego ryzyka (Aneks III) — JESZCZE NIE
    ⏳ 02.08.2027: Systemy wbudowane (Aneks I) — JESZCZE NIE

Polska ustawa o systemach AI:
  → Projekt zatwierdzony przez Rząd RP 01.04.2026 r. (Ministerstwo Cyfryzacji)
  → Status: projekt PRZED uchwaleniem przez Sejm (stan na 2026-06-05)
  → Powołuje: Komisja Rozwoju i Bezpieczeństwa Sztucznej Inteligencji (KRiBSI)
  → UWAGA: AI Act obowiązuje BEZPOŚREDNIO niezależnie od stanu ustawy krajowej

web_search: "polska ustawa AI sztuczna inteligencja projekt Sejm 2026 KRiBSI status"
web_search: "AI Act etapy stosowania 2026 2027 aktualizacja"
```
