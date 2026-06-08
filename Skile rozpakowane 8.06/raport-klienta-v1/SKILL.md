---
name: raport-klienta-v1
version: 1.1
type: ux-raport
status: production
compatibility: "prawny-router-v3, raport-sytuacyjny-v2, show_widget"
description: |
  Raport dla Klienta v1 — zewnętrzny raport statusu sprawy generowany przez
  kancelarię dla klienta indywidualnego lub biznesowego. Narzędzie ZEWNĘTRZNE
  — język uproszczony, bez żargonu procesowego, dostosowany do odbiorcy.
  WYWOŁANIE: NA ŻĄDANIE przez prawnika/kancelarię — NIE automatycznie.
  Frazy: "raport dla klienta" / "wyślij klientowi" / "przygotuj raport klienta"
  / "raport zewnętrzny" / "status dla klienta" / "raport dla zarządu".
  PROFIL [IND]: język prosty, predykcja opisowa, bez kwot ryzyka.
  PROFIL [BIZ]: język formalny, predykcja procentowa, ryzyko finansowe,
  wpływ na działalność, harmonogram projektowy, rekomendacje zarządu, NDA.
  RENDERING: show_widget z HTML vanilla JS — NIE present_files, NIE JSX.
---

# Raport dla Klienta v1.1 — Zewnętrzne Narzędzie Kancelarii

> ⛔ HARD GATE — ZAKAZ CYTOWANIA PRAWA I ORZECZEŃ Z PAMIĘCI
> Raport może zawierać terminy, przepisy lub sygnatury — przed ich podaniem:
> `view /mnt/skills/user/shared/PRAWO-HARDGATE.md`

---

## ARCHITEKTURA

```
raport-klienta-v1/
├── SKILL.md                          ← ten plik — jedyne źródło prawdy
├── assets/
│   └── widget-raport-klienta.html    ← dokumentacja struktury (nie używaj bezpośrednio)
└── references/
    ├── jezyk-klienta.md              ← słownik: żargon prawny → język klienta
    └── sekcje-biznesowe.md           ← szczegóły sekcji BIZ
```

---

## REGUŁA RENDEROWANIA — JEDYNA POPRAWNA METODA

Raport dla klienta **ZAWSZE** renderuj przez `show_widget` z HTML (vanilla JS).

```
NIE WOLNO:
  ✗ używać present_files z plikiem .jsx (nie renderuje się w claude.ai)
  ✗ używać cp, str_replace, bash do generowania tego widgetu
  ✗ używać window.__INJECTED__ (mechanizm React/bundler, nie działa w show_widget)

WOLNO TYLKO:
  ✓ show_widget z widget_code zawierającym HTML + vanilla JS + CSS variables
  ✓ dane sprawy jako literały JS wbudowane bezpośrednio w HTML
```

---

## KOMUNIKAT STARTOWY

```
WZORZEC (jeśli profil nieznany z kontekstu):
"Przygotowuję raport dla klienta. Wybierz profil odbiorcy:

[A] Klient indywidualny — język prosty, predykcja opisowa
[B] Klient biznesowy    — raport formalny, ryzyko finansowe, rekomendacje dla zarządu"
```

> Jeśli kontekst rozmowy jednoznacznie wskazuje typ klienta — ustaw profil automatycznie, nie pytaj.
> Zakaz autoładowania widgetu bez ustalonego profilu.

---

## PROFIL [IND] — Klient indywidualny

```
Język:        prosty, bez terminologii prawnej
              → wczytaj references/jezyk-klienta.md → zastosuj słownik
Predykcja:    opisowa — "wysokie szanse / umiarkowane szanse / trudna sytuacja"
              NIE pokazuj procent
Ukryte:       sygnatura akt, kwalifikacja prawna (art. XX), zagrożenie karne (lata),
              koszty procesowe szczegółowe, słabości pozycji procesowej,
              analiza dowodów A/B/C/D, notatki wewnętrzne, taktyka pełnomocnika
Pokazane:     co się teraz dzieje, co będzie dalej, co klient powinien zrobić,
              termin najbliższego działania, ogólna ocena sytuacji
Ton:          spokojny, rzeczowy, uczciwy — bez koloryzowania
Predykcja IND:
  "Ocena sytuacji: Dobra / Przeciętna / Niekorzystna"
  Opis rzetelny — bez eufemizmów i koloryzowania:
  • Przeciętna:   "Sytuacja jest niepewna. [Co przemawia za, co przeciw — wprost]."
  • Niekorzystna: "Sytuacja jest trudna. [Konkretny powód]. Możliwe scenariusze: [lista]."
  NIE PISAĆ: "będziemy walczyć", "damy radę", "proszę się nie martwić", "jest nadzieja"
  PISAĆ:     "na podstawie dostępnych dowodów oceniamy, że..." — i podać ocenę wprost
Sekcja "Co dalej":
  Lista max 3 kroków, każdy w 1 zdaniu prostym językiem
  Przykład: "1. Proszę zebrać rachunki z tego okresu — potrzebujemy ich do końca miesiąca."
```

---

## PROFIL [BIZ] — Klient biznesowy

```
Język:        formalny, zwięzły, raportowy — styl board memo
              → wczytaj references/jezyk-klienta.md
              → wczytaj references/sekcje-biznesowe.md
Predykcja:    procentowa (np. 70% / 30%) + przedział ufności
              "Prawdopodobieństwo wyniku korzystnego: XX%"
              "Wariant alternatywny: YY%"
              "Przedział ufności: [niski/średni/wysoki] na podstawie [N] czynników"
Sekcje BIZ (dodatkowe względem IND):
  • Ekspozycja finansowa — szacunek ryzyka kwotowego
  • Wpływ na działalność — reputacja, operacje, kontrakty, compliance
  • Harmonogram etapów — tabela: Etap | Termin | Odpowiedzialny | Status
    (format projektowy / Gantt-like, daty konkretne)
  • Działania wymagane po stronie Klienta — wyróżniona osobna sekcja
  • Rekomendacje dla zarządu / rady nadzorczej
  • Sekcja poufności — klauzula NDA / attorney-client privilege
Ton:          profesjonalny, rzeczowy, decyzyjny
```

---

## CZEGO NIGDY NIE POKAZYWAĆ KLIENTOWI (żaden profil)

```
✗ Wewnętrzna ocena słabości pozycji procesowej
✗ Pełna analiza dowodów z oceną A/B/C/D
✗ Alternatywne scenariusze obrony rozważane przez kancelarię
✗ Notatki wewnętrzne i komentarze robocze
✗ Szczegółowe błędy pełnomocnika strony przeciwnej (taktyka)
✗ Cytaty z akt / protokołów bez anonimizacji świadków
```

---

## SEKWENCJA WYWOŁANIA

```
KROK 1 — Ustal profil (IND/BIZ) — z kontekstu lub pytając
KROK 2 — Wczytaj references/jezyk-klienta.md (zawsze)
KROK 3 — Jeśli BIZ → wczytaj references/sekcje-biznesowe.md
KROK 4 — Przeanalizuj rozmowę → wyciągnij dane (schemat poniżej)
          Jeśli raport-sytuacyjny-v2 był w tej sesji → pobierz dane z blueprintu RSv2
          W przeciwnym razie → wyciągnij bezpośrednio z historii rozmowy
KROK 5 — Wywołaj visualize:read_me z modules=["interactive","mockup"]
          (tylko jeśli nie załadowano w tej sesji)
KROK 6 — Wywołaj show_widget z kompletnym HTML widgetu:
          PROFIL IND: sekcje Sytuacja | Co dalej | Terminy | Kontakt
          PROFIL BIZ: sekcje Sytuacja | Ekspozycja finansowa | Harmonogram |
                      Rekomendacje zarząd | Poufność
          + przycisk "Eksportuj PDF" → window.print()
KROK 7 — Po wygenerowaniu: zaproponuj "Czy chcesz eksportować do PDF?"
```

---

## SCHEMAT DANYCH WIDGETU

```
Pola wspólne IND/BIZ:
  kancelaria, klient, prawnik, sprawa (1–2 zdania),
  etap, ocena (IND: opisowa / BIZ: procentowa),
  terminy, kontekst (2–3 zdania)

Pola wyłącznie BIZ:
  kwoty (ekspozycja finansowa), harmonogram (tabela etapów),
  wplyw_na_dzialalnosc, rekomendacje_zarzad, klauzula_nda

Pola null → null. Nie wymyślaj danych.
```

---

## PRZEPŁYW DANYCH Z raport-sytuacyjny-v2

```
raport-sytuacyjny-v2 (wewnętrzny) ──→ raport-klienta-v1 (zewnętrzny)
      ↑                                        ↓
  dane pełne                          dane przefiltrowane
  język prawniczy                     język klienta (references/jezyk-klienta.md)
  predykcja %                         IND: opisowa / BIZ: %
  słabości pozycji                    [ukryte]
  notatki wewnętrzne                  [ukryte]
  dowody A/B/C/D                      [ukryte]

WYWOŁANIE Z widgetu RSv2:
  Przycisk "Generuj raport dla klienta" → sendPrompt("raport dla klienta")
  → router → ten skill

WYWOŁANIE BEZPOŚREDNIE:
  Router wykrywa frazę → sprawdza czy RSv2 był w sesji → ten skill
```

---

## SELF-CHECK

```
□ Czy ustaliłem profil IND lub BIZ przed generowaniem?
□ Czy wczytałem references/jezyk-klienta.md?
□ Czy dla BIZ wczytałem references/sekcje-biznesowe.md?
□ Czy predykcja jest opisowa (IND) lub procentowa (BIZ)?
□ Czy ukryłem pola wewnętrzne (słabości, A/B/C/D dowodów, notatki, taktyka)?
□ Czy sekcja BIZ zawiera: ekspozycję finansową, wpływ na działalność,
  harmonogram, rekomendacje zarządu, klauzulę NDA?
□ Czy zaproponowałem eksport PDF po wygenerowaniu widgetu?
□ Czy raport można wysłać klientowi bez redakcji — czy jest "czysty"?
□ Czy zastosowałem show_widget (NIE present_files)?
```

---

## INTEGRACJA Z KANCELARYJNYM JĄDREM SHARED

Gdy wynik ma służyć ocenie ryzyka lub decyzji terminowej:

```
view /mnt/skills/user/shared/RISK-ASSESSMENT.md
view /mnt/skills/user/shared/TERM-CALC.md
view /mnt/skills/user/shared/QUALITY-CHECK.md
```

Nie dubluj logiki shared w lokalnych plikach.
