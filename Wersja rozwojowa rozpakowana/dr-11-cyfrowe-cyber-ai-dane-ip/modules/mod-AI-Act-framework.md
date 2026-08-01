# Moduł [AB] — Prawo AI / AI Act

> **Plik:** `/mnt/skills/user/prawny-router-v3/references/modules/mod-AB-prawo-ai.md`
> **Wersja:** 1.1 (2026-07-27)
> **Status:** AKTUALIZOWANY — polska ustawa o AI podpisana przez prezydenta 24.07.2026
> **Weryfikacja:** web_search 2026-07-27 (rp.pl, prawo.pl, gazetaprawna.pl, cyberdefence24.pl, tmt.expert, skarbiec.biz)

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
  ⚡ POPRAWKA PILNA 2026-07-27 (FAZA 3E/ZASADA 14) — moduł był
  NIEAKTUALNY o CAŁY etap procesu legislacyjnego. Poprzednia wersja
  (VER 2026-05-25/06-05) opisywała ustawę jako "projekt przed
  uchwaleniem przez Sejm". W rzeczywistości od tego czasu:
    09.04.2026 — projekt wpłynął do Sejmu (po zatwierdzeniu przez
                 rząd 30.03.2026)
    11.06.2026 — Sejm UCHWALIŁ ustawę (421 za, 3 przeciw, 18 wstrzym.)
    25.06.2026 — Senat zgłosił 25 poprawek
    03.07.2026 — Sejm przyjął 24 z 25 poprawek Senatu, prace
                 parlamentarne ZAKOŃCZONE
    24.07.2026 — PREZYDENT PODPISAŁ ustawę (2 dni przed tym audytem!)
    sierpień 2026 — planowane wejście w życie (dokładna data zależy
                 od publikacji w Dzienniku Ustaw — SPRAWDŹ
                 isap.sejm.gov.pl dla konkretnej daty przed użyciem)

  - Ustawa o systemach sztucznej inteligencji (podpisana 24.07.2026)
    → Powołuje: Komisja Rozwoju i Bezpieczeństwa Sztucznej Inteligencji
      (KRiBSI) — niezależny krajowy organ nadzoru rynku AI, obsługa
      organizacyjno-kancelaryjna przez Ministerstwo Cyfryzacji
    → Struktura KRiBSI: Przewodniczący (kadencja 5 lat, powoływany
      przez Sejm za zgodą Senatu) + 2 zastępców + 4 członków
      delegowanych przez UOKiK, UKE, KNF, KRRiT
    → Wprowadza PIASKOWNICE REGULACYJNE dla przedsiębiorców i urzędów
    → Nowa ŚCIEŻKA SKARGOWA dla obywateli — prawo złożenia wniosku o
      interwencję do KRiBSI, jeśli system AI narusza przepisy
    → Penalizuje stosowanie zakazanych praktyk AI (art. 5 AI Act) —
      system kar administracyjnych
    → UWAGA: AI Act i tak obowiązuje bezpośrednio NIEZALEŻNIE od stanu
      ustawy krajowej — ustawa krajowa dotyczy NADZORU i EGZEKWOWANIA,
      nie samych materialnych obowiązków z Rozporządzenia UE

    Potwierdzone: rp.pl [21.07.2026], prawo.pl, gazetaprawna.pl,
    cyberdefence24.pl, tmt.expert [sprzed 2 dni], skarbiec.biz
    [sprzed 2 dni] — 6 źródeł zgodnych co do przebiegu procesu i treści.

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

⚡⚡ POTWIERDZONE 2026-07-30 (na żądanie użytkownika) — USTAWA KRAJOWA
JUŻ PODPISANA: Ustawa z 3.07.2026 o systemach sztucznej inteligencji
(druk sejmowy 2443) — Sejm przyjął 24 z 25 poprawek Senatu (3.07.2026),
Prezydent Karol Nawrocki PODPISAŁ **24.07.2026** (razem z 4 innymi
ustawami tego dnia, w tym nowelizacją o ochronie zwierząt — "ustawa
łańcuchowa"). KRiBSI JUŻ NIE JEST projektem — to REALNY, powołany
organ:
  → Struktura: Przewodniczący (kadencja 5 lat) + 2 zastępców,
    działa jako POJEDYNCZY PUNKT KONTAKTOWY (art. 70 ust. 2 AI Act)
  → Kompetencje: kontrole, postępowania, rozpatrywanie SKARG,
    nakładanie kar, NAKAZ WYCOFANIA niezgodnego systemu z rynku/użytku
  → Kary NIE SĄ automatyczne — organ OCENIA: charakter/wagę/czas
    trwania naruszenia, liczbę dotkniętych osób, poziom szkody,
    wielkość przedsiębiorcy, współpracę, umyślność, działania
    naprawcze — dopiero na tej podstawie ustala wysokość w granicach
    unijnego maksimum
  → PIASKOWNICE REGULACYJNE: MŚP mogą BEZPŁATNIE testować technologie
    AI w kontrolowanym środowisku regulacyjnym
  → Postępowanie w sprawie kary: JEDNOINSTANCYJNE — odwołanie
    BEZPOŚREDNIO do Sądu Okręgowego w Warszawie (Sąd Ochrony
    Konkurencji i Konsumentów, SOKiK) — NIE zwykła droga administracyjna
  → Środki z kar: PRZYCHÓD BUDŻETU PAŃSTWA, egzekwowane wg przepisów
    o postępowaniu egzekucyjnym w administracji
  → Ustawa NOWELIZUJE PRZY OKAZJI: KPC, postępowanie egzekucyjne w
    administracji, ustawę o radiofonii i telewizji, ustawę o
    ograniczeniu działalności gospodarczej osób pełniących funkcje
    publiczne, ustawę o ABW/AW, ustawę o kosztach sądowych, ustawę o
    nadzorze nad rynkiem finansowym, ustawę o ochronie danych
    osobowych, ustawę o KSC (cyberbezpieczeństwo)
  → ⚡ Od **2 SIERPNIA 2026 R.** (za 3 dni od tej weryfikacji!)
    zaczynają obowiązywać przepisy o PRZEJRZYSTOŚCI systemów AI —
    użytkownik MUSI zostać poinformowany, że kontaktuje się z
    MASZYNĄ, nie człowiekiem
  Potwierdzone w 5+ zgodnych źródłach (forsal.pl, skarbiec.biz,
  orka.sejm.gov.pl — Rząd 1, pełny tekst ustawy) — WSZYSTKIE zgodne.

KRiBSI (Polska): postępowania + kary + kontrole — organ JUŻ POWOŁANY
  ustawą (patrz wyżej) — sprawdź na dzień użycia, czy Komisja
  ZOSTAŁA już faktycznie OBSADZONA (powołanie przewodniczącego/
  zastępców to ODRĘBNY, kolejny krok od samego wejścia ustawy w życie)
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
Stan na 2026-07-27: obowiązują art. 5 (zakazy) + art. 4 (AI literacy) + art. 51-55 (GPAI). Polska ustawa o AI PODPISANA (24.07.2026), wejście w życie w sierpniu 2026 (sprawdź dokładną datę).
```

---

## ⚡ AKTUALIZACJA STATUS PRAWA POLSKIEGO (VER: 2026-07-27)

```
AI Act (Rozp. UE 2024/1689):
  → W życie: 01.08.2024
  → Etapy stosowania (OBOWIĄZUJĄCE na 2026-07-27):
    ✅ 02.02.2025: Zakazy (art. 5) + AI Literacy (art. 4) — OBOWIĄZUJĄ
    ✅ 02.08.2025: GPAI (art. 51–55) + organy krajowe — OBOWIĄZUJĄ
    ⏳ 02.08.2026: Systemy wysokiego ryzyka (Aneks III) — ZA OK. TYDZIEŃ,
       jeszcze nie weszło w życie na dzień audytu (26.07.2026), ale BARDZO
       BLISKO — sprawdź ponownie przy każdym użyciu w lipcu/sierpniu 2026
    ⏳ 02.08.2027: Systemy wbudowane (Aneks I) — JESZCZE NIE

Polska ustawa o systemach AI:
  ⚡ PODPISANA PRZEZ PREZYDENTA 24.07.2026 r. — prace parlamentarne
  ZAKOŃCZONE (Sejm 11.06.2026, Senat 25.06.2026, Sejm ponownie 03.07.2026).
  → Wejście w życie: sierpień 2026 (dokładna data zależy od publikacji w
    Dzienniku Ustaw — SPRAWDŹ isap.sejm.gov.pl przed cytowaniem konkretnej
    daty, ten moduł NIE podaje dokładnej daty wejścia w życie celowo, bo
    nie było jej jeszcze w źródłach na 27.07.2026)
  → Powołuje: KRiBSI (przewodniczący 5-letnia kadencja + 2 zastępców +
    4 członków z UOKiK/UKE/KNF/KRRiT), piaskownice regulacyjne, ścieżka
    skargowa obywateli
  → UWAGA: AI Act obowiązuje BEZPOŚREDNIO niezależnie od stanu ustawy
    krajowej — ustawa krajowa dotyczy nadzoru/egzekwowania

web_search: "ustawa o systemach sztucznej inteligencji Dziennik Ustaw data wejścia w życie"
web_search: "AI Act systemy wysokiego ryzyka 2 sierpnia 2026"
```
