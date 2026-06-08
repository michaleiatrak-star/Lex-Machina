---
name: raport-klienta-v1
compatibility: "prawny-router-v3, raport-sytuacyjny-v2, Anthropic API"
description: |
  Raport dla Klienta v1 — zewnętrzny raport statusu sprawy generowany przez kancelarię
  dla klienta indywidualnego lub biznesowego. Narzędzie ZEWNĘTRZNE — język uproszczony,
  bez żargonu procesowego, dostosowany do odbiorcy.

  DWA PROFILE ODBIORCY:
  [IND] Klient indywidualny — język prosty, predykcja opisowa, bez kwot ryzyka
  [BIZ] Klient biznesowy   — język formalny, predykcja procentowa, ryzyko finansowe,
                             wpływ na działalność, rekomendacje dla zarządu, sekcja NDA

  WYWOŁANIE: NA ŻĄDANIE przez prawnika/kancelarię — NIE automatycznie.
  Frazy wyzwalające: "raport dla klienta" / "wyślij klientowi" / "przygotuj raport klienta"
  / "raport zewnętrzny" / "status dla klienta" / "raport dla zarządu"

  ŹRÓDŁO DANYCH: pobiera dane z raport-sytuacyjny-v2 (wewnętrzny) jeśli był już wygenerowany
  w tej rozmowie; w przeciwnym razie — bezpośrednio przez Anthropic API z historii rozmowy.

  Widget: lekki artefakt React JSX, dwa profile (IND/BIZ), eksport PDF.
---

# Raport dla Klienta v1 — Zewnętrzne Narzędzie Kancelarii

## ARCHITEKTURA

```
raport-klienta-v1/
├── SKILL.md                          ← ten plik — mechanika, tryby, reguły
├── assets/
│   └── widget-raport-klienta.html    ← artefakt React JSX z profilem IND/BIZ + eksport PDF
└── references/
    ├── jezyk-klienta.md              ← słownik: żargon prawny → język klienta
    └── sekcje-biznesowe.md           ← szczegóły sekcji BIZ (ryzyko, NDA, zarząd)
```

---

## KOMUNIKAT STARTOWY

```
WZORZEC:
"Przygotowuję raport dla klienta. Wybierz profil odbiorcy:

[A] Klient indywidualny — język prosty, predykcja opisowa
[B] Klient biznesowy    — raport formalny, ryzyko finansowe, rekomendacje dla zarządu

Możesz też wpisać 'raport klienta indywidualnego' lub 'raport klienta biznesowego'."
```

> ⚠ Jeśli kontekst rozmowy jednoznacznie wskazuje typ klienta — nie pytaj, ustaw profil automatycznie.
> ⚠ ZAKAZ autoładowania widgetu bez wyboru profilu lub jednoznacznego kontekstu.

---

## TRYBY PRACY

### TRYB IND — Klient indywidualny

```
Język:        prosty, bez terminologii prawnej
              → wczytaj references/jezyk-klienta.md → zastosuj słownik
Predykcja:    opisowa — "wysokie szanse / umiarkowane szanse / trudna sytuacja"
              NIE pokazuj procent
Ukryte:       sygnatura akt, kwalifikacja prawna (art. XX), zagrożenie karne (lata)
              koszty procesowe szczegółowe
Pokazane:     co się teraz dzieje, co będzie dalej, co klient powinien zrobić
              termin najbliższego działania, ogólna ocena sytuacji
Ton:          spokojny, rzeczowy, uczciwy — bez koloryzowania
              Trudna sytuacja = napisz wprost że jest trudna i dlaczego
              Nie stosuj "motywujących" sformułowań — klient ma prawo do rzetelnej oceny
```

### TRYB BIZ — Klient biznesowy

```
Język:        formalny, zwięzły, raportowy — styl board memo
Predykcja:    procentowa (np. 70% / 30%)
Pokazane:     wszystkie sekcje IND +
              • Ekspozycja finansowa (szacunek ryzyka kwotowego)
              • Wpływ na działalność (reputacja, operacje, kontrakty, compliance)
              • Harmonogram etapów z datami — styl projektowy (Gantt-like)
              • Rekomendacje dla zarządu / rady nadzorczej
              • Sekcja poufności (klauzula NDA / attorney-client privilege)
Ton:          profesjonalny, rzeczowy, decyzyjny
```

---

## SEKWENCJA WYWOŁANIA

> ⚠️ REGUŁA RENDEROWANIA v2 — nadpisuje wszystkie wcześniejsze instrukcje cp/present_files/JSX.
> Pliki `.jsx` udostępnione przez `present_files` NIE renderują się w claude.ai — użytkownik widzi
> tylko link do pobrania. Jedyna metoda renderowania widgetu inline: `show_widget` z HTML vanilla JS.

```
KROK 1 — Ustal profil (IND/BIZ) — z kontekstu lub pytając
KROK 2 — Wczytaj references/jezyk-klienta.md (zawsze)
KROK 3 — Jeśli BIZ → wczytaj references/sekcje-biznesowe.md
KROK 4 — Przeanalizuj rozmowę → wyciągnij dane (schemat poniżej)
KROK 5 — Wywołaj visualize:read_me z modules=["interactive","mockup"] (jeśli nie załadowano)
KROK 6 — Wywołaj show_widget z widget_code zawierającym kompletny HTML widgetu:
          • dane sprawy jako literały JS wbudowane bezpośrednio w HTML
          • vanilla JS + CSS variables (var(--color-*)) — BEZ React, BEZ importów
          • profil IND: sekcje Sytuacja | Co dalej | Terminy | Kontakt
          • profil BIZ: sekcje Sytuacja | Ekspozycja finansowa | Harmonogram | Rekomendacje zarząd | Poufność
          • przycisk "Eksportuj PDF" wywołujący window.print()
          • NIE używaj cp, str_replace ani present_files dla tego widgetu
KROK 7 — Po wygenerowaniu: zaproponuj "Czy chcesz eksportować do PDF?"

SCHEMAT DANYCH (wbuduj jako literały JS bezpośrednio w HTML):
  kancelaria, klient, prawnik, sprawa (1-2 zdania),
  etap, ocena (IND: opisowa / BIZ: procentowa),
  terminy, kwoty (tylko BIZ), kontekst (2-3 zdania)
  Pola null → null. Nie wymyślaj danych.
```

---

## REGUŁY TREŚCI

### Czego NIGDY nie pokazywać klientowi (żaden profil)

```
✗ Wewnętrzna ocena słabości pozycji procesowej (to jest dla prawnika)
✗ Pełna analiza dowodów z oceną A/B/C/D
✗ Alternatywne scenariusze obrony rozważane przez kancelarię
✗ Notatki wewnętrzne i komentarze robocze
✗ Szczegółowe błędy pełnomocnika strony przeciwnej (taktyka)
✗ Cytaty z akt / protokołów bez anonimizacji świadków
```

### Różnice IND vs BIZ w sekcji predykcji

```
IND:
  "Ocena sytuacji: Dobra / Przeciętna / Niekorzystna"
  Opis rzetelny — bez eufemizmów i koloryzowania:
  • Dobra:        "Sytuacja jest dobra. [Konkretny powód — co przemawia za]."
  • Przeciętna:   "Sytuacja jest niepewna. [Co przemawia za, co przeciw — wprost]."
  • Niekorzystna: "Sytuacja jest trudna. [Konkretny powód]. Możliwe scenariusze: [lista]."
  NIE PISAĆ: "będziemy walczyć", "damy radę", "proszę się nie martwić", "jest nadzieja"
  PISAĆ:     "na podstawie dostępnych dowodów oceniamy, że..." — i podać ocenę wprost

BIZ:
  "Prawdopodobieństwo wyniku korzystnego: XX%"
  "Wariant alternatywny: YY%"
  "Przedział ufności: [niski/średni/wysoki] na podstawie [N] czynników"
```

### Sekcja "Co dalej" — różnice

```
IND:
  Lista max 3 kroków, każdy w 1 zdaniu prostym językiem
  Przykład: "1. Proszę zebrać rachunki z tego okresu — potrzebujemy ich do końca miesiąca."

BIZ:
  Tabela: Etap | Termin | Odpowiedzialny | Status
  Format projektowy, daty konkretne
  Sekcja "Działania wymagane po stronie Klienta" — osobna, wyróżniona
```

---

## POWIĄZANIE Z raport-sytuacyjny-v2

```
PRZEPŁYW DANYCH:
raport-sytuacyjny-v2 (wewnętrzny) ──→ raport-klienta-v1 (zewnętrzny)
      ↑                                        ↓
  dane pełne                          dane przefiltrowane
  język prawniczy                     język klienta
  predykcja %                         IND: opisowa / BIZ: %
  słabości pozycji                    [ukryte]
  notatki wewnętrzne                  [ukryte]

WYWOŁANIE Z raport-sytuacyjny-v2:
  Przycisk "Generuj raport dla klienta" w widgecie wewnętrznym
  → sendPrompt("raport dla klienta") → router → ten skill

WYWOŁANIE Z routera bezpośrednio:
  Fraza "raport dla klienta" / "status dla klienta" → router → ten skill
  Router sprawdza czy raport-sytuacyjny-v2 był już w sesji
```

---

## SELF-CHECK

```
□ Czy ustaliłem profil IND lub BIZ przed generowaniem?
□ Czy wczytałem references/jezyk-klienta.md?
□ Czy dla BIZ wczytałem references/sekcje-biznesowe.md?
□ Czy predykcja jest opisowa (IND) lub procentowa (BIZ)?
□ Czy ukryłem pola wewnętrzne (słabości, A/B/C/D dowodów, notatki)?
□ Czy sekcja BIZ zawiera: ryzyko finansowe, wpływ na działalność,
  harmonogram, rekomendacje zarząd, klauzulę NDA?
□ Czy zaproponowałem eksport PDF po wygenerowaniu widgetu?
□ Czy raport można wysłać klientowi bez redakcji — czy jest "czysty"?
```

---

*Raport dla Klienta v1 — narzędzie zewnętrzne kancelarii*
*Profile: IND (klient indywidualny) · BIZ (klient biznesowy)*
*Źródło danych: raport-sytuacyjny-v2 lub Anthropic API*
*Wywołanie: NA ŻĄDANIE przez prawnika — nie automatycznie*
*Integracja: prawny-router-v3 · raport-sytuacyjny-v2*

---

## ARCHITEKTURA RENDEROWANIA — ZASADA NADRZĘDNA

> ⚠️ KOREKTA KRYTYCZNA — nadpisuje sekcje "Architektura Zoptymalizowana" i "Korekta Integracyjna" poniżej.

### Dlaczego NIE używamy present_files z plikiem .jsx

Pliki `.jsx` udostępnione przez `present_files` NIE renderują się wizualnie w claude.ai —
użytkownik widzi wyłącznie link do pobrania. Mechanizm `window.__INJECTED__` działa tylko
w środowiskach React z bundlerem — NIE w show_widget.

### Jedyna poprawna metoda: show_widget z HTML

Raport dla klienta ZAWSZE renderuj przez `show_widget` z kodem HTML (vanilla JS).
NIE używaj: `cp`, `str_replace`, `present_files`, `.jsx`, `window.__INJECTED__`.

Plik `assets/RaportKlienta.jsx` jest wyłącznie dokumentacją struktury sekcji — nie kopiuj go.


---

# MIN8 QUALITY UPGRADE

Ten skill działa z dodatkowym kontraktem jakościowym `upgrade-min8/MIN8-UPGRADE.md` oraz checklistą `upgrade-min8/QUALITY-CHECKLIST.md`.

## Obowiązkowe reguły wykonawcze
- stosuj twarde bramki źródłowe dla przepisów i orzecznictwa,
- odróżniaj fakty, interpretacje, hipotezy i ryzyka,
- nie przyjmuj twierdzeń użytkownika jako udowodnionych bez dowodu,
- wskazuj poziom pewności 0–10,
- eskaluj do właściwego skilla, gdy sprawa wykracza poza zakres modułu,
- nie duplikuj funkcji `shared`; referuj do nich jako zależności.

## Status modernizacji
Docelowy poziom jakościowy: minimum 8.0/10 przy użyciu wspólnego kontraktu `SKILL-CONTRACT-MIN8`.
