---
name: raport-klienta-v1
version: 1.2
type: ux-raport
status: production
compatibility: "prawny-router-v3, raport-sytuacyjny-v2, show_widget"
description: |
  Raport dla Klienta v1 — zewnętrzny raport statusu sprawy generowany przez
  kancelarię dla klienta indywidualnego lub biznesowego. Język uproszczony,
  bez żargonu procesowego. WYWOŁANIE: NA ŻĄDANIE — NIE automatycznie.
  Frazy: "raport dla klienta" / "wyślij klientowi" / "status dla klienta"
  / "raport zewnętrzny" / "raport dla zarządu".
  PROFIL [IND]: język prosty, predykcja opisowa, bez kwot ryzyka.
  PROFIL [BIZ]: język formalny, predykcja procentowa, ryzyko finansowe,
  wpływ na działalność, rekomendacje zarządu, NDA.
  TRYBY: standard | zle_wiadomosci | brak_nowosci | ograniczenie_szkod.
  RENDERING: show_widget HTML vanilla JS — NIE present_files, NIE JSX.
---

# Raport dla Klienta v1.2 — Zewnętrzne Narzędzie Kancelarii

> ⛔ HARD GATE — ZAKAZ CYTOWANIA PRAWA I ORZECZEŃ Z PAMIĘCI
> Raport może zawierać terminy, przepisy lub sygnatury — przed ich podaniem:
> `view /mnt/skills/user/shared/PRAWO-HARDGATE.md`

---

## ARCHITEKTURA

```
raport-klienta-v1/
├── SKILL.md                          ← ten plik — jedyne źródło prawdy
└── references/
    ├── jezyk-klienta.md              ← słownik: żargon prawny → język klienta
    │                                    + szablony złych wiadomości i ograniczenia szkód
    ├── sekcje-biznesowe.md           ← szczegóły sekcji BIZ
    └── BLUEPRINT-SCHEMA.md           ← schemat danych przekazywanych do show_widget
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

## KROK 1A — ROZPOZNANIE TRYBU SYTUACJI (przed wyborem profilu)

Zanim ustalisz profil odbiorcy, rozpoznaj sytuację z kontekstu rozmowy:

```
STANDARD — domyślny.
  Sprawa w toku, ocena szans i status na bieżąco.

ZLE_WIADOMOSCI — gdy:
  Raport komunikuje wynik, który już zaszedł i jest niekorzystny
  (przegrana rozprawa, odmowa organu, oddalony wniosek, odrzucona apelacja),
  ALE sprawa NIE jest jeszcze jednoznacznie zakończona — istnieją dalsze
  środki prawne lub kolejne etapy.
  → wczytaj references/jezyk-klienta.md, sekcja "ZŁE WIADOMOŚCI"

OGRANICZENIE_SZKOD — gdy:
  Sprawa jest zakończona w sposób niekorzystny i OSTATECZNY: wyczerpano
  środki odwoławcze, upłynęły terminy, dalsze działanie nie jest prawnie
  możliwe lub nie jest racjonalne. Cel raportu: zamknięcie tematu i
  zarządzanie skutkami — NIE ocena szans (już nieaktualna).
  → wczytaj references/jezyk-klienta.md, sekcja "OGRANICZENIE SZKÓD"
  ⚠ Jeśli istnieje jakakolwiek realna dalsza opcja prawna — to NIE jest
    ten tryb. Wróć do ZLE_WIADOMOSCI lub STANDARD.

BRAK_NOWOSCI — gdy:
  Raport okresowy (np. miesięczny), ale od poprzedniego raportu nie
  zaszły istotne zmiany.
  → patrz sekcja "BRAK NOWOŚCI" niżej w tym pliku

Jeśli niejasne z kontekstu — zapytaj prawnika jednym pytaniem:
  "Czy ten raport dotyczy: [A] bieżącego statusu, [B] niekorzystnego
  wyniku z dalszymi krokami, [C] ostatecznego zakończenia sprawy
  (brak dalszych działań), [D] okresu bez istotnych zmian?"
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
Potwierdzenie odbioru (gdy krok ma wymaga_potwierdzenia=true lub termin zawity):
  Wyróżniona osobna ramka, NIE łączona z resztą "Co dalej":
  "WAŻNE — potrzebujemy potwierdzenia
   [Konkretna czynność] do [data]. Jeśli tego nie zrobimy, [konsekwencja —
   wprost, np. 'utracimy prawo do złożenia odwołania'].
   Proszę odpisać na ten e-mail/SMS z potwierdzeniem, że wiadomość dotarła."
  Zasada: konsekwencja musi być podana wprost, bez eufemizmów — to jest
  jedyne miejsce w raporcie IND, gdzie dopuszczalne jest wskazanie
  poważnego skutku braku działania, ponieważ celem jest zapobieżenie mu.
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
    → Jeśli analiza umów była w tej sesji: dołącz wynik z mod-shared-economic.md
      (tabela: klauzula | dni | PLN | % wartości umowy)
  • Wpływ na działalność — reputacja, operacje, kontrakty, compliance
    → Jeśli Data Act/NIS2/AI Act dotyczy: dołącz sygnał z mod-shared-regulatory-horizon.md
  • Harmonogram etapów — tabela: Etap | Termin | Odpowiedzialny | Status
    (format projektowy / Gantt-like, daty konkretne)
  • Luki kontraktowe (jeśli analiza umów) — TOP 3 z mod-shared-missing-clause.md
    Format: Brakująca klauzula | Ryzyko | Priorytet 🔴/🟠/🟡
  • Działania wymagane po stronie Klienta — wyróżniona osobna sekcja
  • Rekomendacje dla zarządu / rady nadzorczej
  • Sekcja poufności — klauzula NDA / attorney-client privilege
Ton:          profesjonalny, rzeczowy, decyzyjny
```

---

## ZMIANY OD OSTATNIEGO RAPORTU (delta) — oba profile

```
Jeśli to nie pierwszy raport dla tej sprawy (sprawdź historię rozmowy /
raport-sytuacyjny-v2 / informację od prawnika):

  delta.ma_poprzedni_raport = true
  delta.co_sie_zmienilo = lista 1–4 punktów, każdy 1 zdanie, np.:
    "Sąd wyznaczył termin rozprawy na [data] (wcześniej: brak terminu)."
    "Otrzymaliśmy odpowiedź strony przeciwnej — [1 zdanie streszczenia]."
    "Zakończył się etap [nazwa] — przechodzimy do [nazwa następnego]."

  Renderuj jako osobną, wyróżnioną sekcję na samym początku raportu, PRZED
  ogólnym statusem: "Co się zmieniło od ostatniego raportu ([data]):"

Jeśli to pierwszy raport dla tej sprawy:
  delta.ma_poprzedni_raport = false → nie renderuj tej sekcji.

Jeśli to kolejny raport, ale nic istotnego się nie zmieniło:
  delta.bez_zmian = true → patrz sekcja "BRAK NOWOŚCI" niżej —
  całość raportu przyjmuje skróconą formę.
```

---

## TRYB: BRAK NOWOŚCI (tryb = brak_nowosci)

Stosuj gdy raport jest okresowy, ale od ostatniego raportu nie zaszły istotne
zmiany. Pełny szablon (timeline, sekcje BIZ, predykcja) byłby tu pustą formą —
zamiast tego renderuj skróconą wersję:

```
STRUKTURA SKRÓCONA:
  1. Nagłówek: "Status sprawy — [data raportu]"
  2. Jedno zdanie: "Od ostatniego raportu ([data poprzedniego]) nie zaszły
     istotne zmiany w sprawie."
  3. Przypomnienie aktualnego etapu (1 zdanie, bez powtarzania całej historii)
  4. Jeśli istnieje najbliższy oczekiwany termin/zdarzenie — podaj je:
     "Najbliższe oczekiwane zdarzenie: [co] — przewidywany termin: [data
     lub 'nieznany, zależy od harmonogramu sądu']."
  5. IND: "Skontaktujemy się, gdy coś się zmieni." (NIE proś o żadne działanie)
     BIZ: jeśli faktycznie brak action items → wyraźnie napisz "Brak działań
     wymaganych po stronie Klienta w tym okresie."

NIE renderuj: pełnego timeline, sekcji ekspozycji finansowej, harmonogramu
etapów w formie tabeli (jeśli niezmieniony względem poprzedniego raportu),
rekomendacji dla zarządu (jeśli nie ma nowej decyzji do podjęcia).

Cel: raport okresowy ma potwierdzić, że sprawa jest pod kontrolą i nic nie
wymaga uwagi klienta — bez generowania sztucznej treści wypełniającej sekcje,
które i tak są bez zmian.
```

---

## TRYB: ZŁE WIADOMOŚCI (tryb = zle_wiadomosci)

Stosuj gdy raport komunikuje niekorzystne zdarzenie, które już zaszło, ale
sprawa nie jest jeszcze zakończona (istnieją dalsze środki/etapy).

```
→ wczytaj references/jezyk-klienta.md, sekcja "ZŁE WIADOMOŚCI — ZDARZENIE
  W TRAKCIE SPRAWY" — zawiera pełną strukturę komunikatu (FAKT → ZNACZENIE
  → PRZYCZYNA → CO DALEJ) i szablony dla IND/BIZ

STRUKTURA WIDGETU w tym trybie:
  1. Sekcja "Co się wydarzyło" — FAKT + ZNACZENIE, na samym początku,
     widoczna bez przewijania
  2. assessment.level = "bad" (nie "lost" — sprawa nie jest zakończona)
  3. Sekcja "Co dalej" — zawsze z konkretną ścieżką (środek prawny + termin)
  4. BIZ: jeśli ekspozycja finansowa się zmieniła w wyniku tego zdarzenia —
     zaktualizuj risk_table, zaznacz zmianę względem poprzedniego raportu

NIE renderuj jako jedną z wielu sekcji w standardowym layoucie — to zdarzenie
jest GŁÓWNYM tematem raportu, resztę (timeline, harmonogram) podaj zwięźle.
```

---

## TRYB: OGRANICZENIE SZKÓD (tryb = ograniczenie_szkod)

Stosuj WYŁĄCZNIE gdy sprawa jest zakończona ostatecznie — brak dalszych
środków prawnych, dalsze działanie nieracjonalne. Cel raportu: zamknięcie
tematu i zarządzanie skutkami, NIE ocena szans.

```
→ wczytaj references/jezyk-klienta.md, sekcja "OGRANICZENIE SZKÓD — SYTUACJA
  JEDNOZNACZNA, BRAK DALSZYCH ŚRODKÓW PRAWNYCH" — zawiera pełną strukturę
  (WYNIK → ZAMKNIĘTE → DO ROZLICZENIA → NATYCHMIASTOWE → RYZYKA REZYDUALNE)
  i szablony dla IND/BIZ

STRUKTURA WIDGETU w tym trybie — KRÓTSZA niż standard:
  1. assessment.level = "lost"
  2. Sekcja "Wynik" — 1-2 zdania, na samym początku
  3. Sekcja "Co jest zamknięte" — wyraźne odcięcie niepewności
  4. Sekcja "Do rozliczenia" — tabela/lista z terminami i odpowiedzialnymi
     (NIGDY bez tych dwóch elementów — inaczej tworzy nową niepewność)
  5. Sekcja "Działania natychmiastowe"
  6. Sekcja "Ryzyka rezydualne" — jeśli istnieją; jeśli brak, napisz
     wprost "Brak dalszych ryzyk związanych z tym postępowaniem."
  7. BIZ: jedno zdanie rekomendacji końcowej — "Zamknięcie w rejestrze
     ryzyk prawnych spółki" lub równoważne

NIE renderuj w tym trybie:
  - tabeli predykcji procentowej (nieaktualna — sprawa zakończona)
  - sekcji "Co dalej" w formie wieloetapowej — zastępuje ją "Działania
    natychmiastowe" (krótka, zamknięta lista)
  - harmonogramu przyszłych etapów postępowania (postępowanie zakończone;
    harmonogram może dotyczyć tylko "do rozliczenia")

PRZED RENDEROWANIEM — bramka kontrolna:
  Czy istnieje JAKAKOLWIEK realna dalsza opcja prawna (apelacja, kasacja,
  skarga, inny środek)? Jeśli TAK → to nie jest ten tryb, wróć do
  zle_wiadomosci lub standard. Tryb ograniczenie_szkod wymaga jednoznaczności.
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
KROK 0 — Rozpoznaj tryb sytuacji (patrz KROK 1A wyżej):
          standard | zle_wiadomosci | brak_nowosci | ograniczenie_szkod
KROK 1 — Ustal profil (IND/BIZ) — z kontekstu lub pytając
KROK 2 — Wczytaj references/jezyk-klienta.md (zawsze)
          Jeśli tryb = zle_wiadomosci → zwróć uwagę na sekcję "ZŁE WIADOMOŚCI"
          Jeśli tryb = ograniczenie_szkod → zwróć uwagę na sekcję
          "OGRANICZENIE SZKÓD"
KROK 3 — Jeśli BIZ → wczytaj references/sekcje-biznesowe.md
KROK 4 — Przeanalizuj rozmowę → wyciągnij dane (BLUEPRINT-SCHEMA.md)
          Jeśli raport-sytuacyjny-v2 był w tej sesji → pobierz dane z blueprintu RSv2
          W przeciwnym razie → wyciągnij bezpośrednio z historii rozmowy
          Sprawdź, czy istnieje poprzedni raport dla tej sprawy → wypełnij
          pole delta (patrz "ZMIANY OD OSTATNIEGO RAPORTU")
KROK 5 — Wywołaj visualize:read_me z modules=["interactive","mockup"]
          (tylko jeśli nie załadowano w tej sesji)
KROK 6 — Wywołaj show_widget z kompletnym HTML widgetu — struktura zależna
          od trybu:
          STANDARD, IND:  Delta (jeśli jest) | Sytuacja | Co dalej |
                          Potwierdzenie odbioru (jeśli wymagane) | Terminy | Kontakt
          STANDARD, BIZ:  Delta (jeśli jest) | Sytuacja | Ekspozycja finansowa |
                          Harmonogram | Rekomendacje zarząd | Poufność
          ZLE_WIADOMOSCI: Co się wydarzyło (FAKT+ZNACZENIE) | Co dalej |
                          (BIZ: zaktualizowana ekspozycja finansowa) | Poufność
          BRAK_NOWOSCI:   forma skrócona — patrz sekcja "TRYB: BRAK NOWOŚCI"
          OGRANICZENIE_SZKOD: Wynik | Co jest zamknięte | Do rozliczenia |
                          Działania natychmiastowe | Ryzyka rezydualne |
                          (BIZ: rekomendacja końcowa + poufność)
          + przycisk "Eksportuj PDF" → window.print()
KROK 7 — Po wygenerowaniu: zaproponuj "Czy chcesz eksportować do PDF?"
```

---

## SCHEMAT DANYCH WIDGETU

Pełny schemat: `references/BLUEPRINT-SCHEMA.md`.

```
Pola wspólne IND/BIZ:
  profile, tryb, kancelaria, klient, prawnik, sprawa (1–2 zdania),
  etap, ocena (IND: opisowa / BIZ: procentowa),
  terminy, kontekst (2–3 zdania), delta (zmiany od ostatniego raportu)

Pola wyłącznie BIZ:
  kwoty (ekspozycja finansowa), harmonogram (tabela etapów),
  wplyw_na_dzialalnosc, rekomendacje_zarzad, klauzula_nda

Pola wyłącznie IND:
  potwierdzenie_odbioru (gdy wymagane)

Pola trybów specjalnych:
  zle_wiadomosci (tryb = zle_wiadomosci)
  ograniczenie_szkod (tryb = ograniczenie_szkod)

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
□ Czy rozpoznałem tryb sytuacji (standard / zle_wiadomosci / brak_nowosci /
  ograniczenie_szkod) PRZED wyborem profilu?
□ Czy ustaliłem profil IND lub BIZ przed generowaniem?
□ Czy wczytałem references/jezyk-klienta.md?
□ Czy dla BIZ wczytałem references/sekcje-biznesowe.md?
□ Czy sprawdziłem, czy istnieje poprzedni raport — i wypełniłem pole delta?
□ Czy predykcja jest opisowa (IND) lub procentowa (BIZ) — z wyjątkiem
  trybu ograniczenie_szkod, gdzie predykcja jest nieaktualna i nie jest
  renderowana?
□ Czy ukryłem pola wewnętrzne (słabości, A/B/C/D dowodów, notatki, taktyka)?
□ Czy sekcja BIZ zawiera: ekspozycję finansową, wpływ na działalność,
  harmonogram, rekomendacje zarządu, klauzulę NDA? (nie dotyczy trybu
  ograniczenie_szkod — tam harmonogram zastępuje "do rozliczenia")
□ TRYB zle_wiadomosci: czy FAKT jest na początku raportu, a sekcja
  "co dalej" zawiera konkretną ścieżkę (środek prawny + termin)?
□ TRYB ograniczenie_szkod: czy potwierdziłem brak realnych dalszych opcji
  prawnych PRZED użyciem tego trybu? Czy lista "do rozliczenia" ma
  terminy i osoby odpowiedzialne?
□ TRYB brak_nowosci: czy raport jest skrócony — bez pustych sekcji
  wypełnionych na siłę?
□ IND z terminem zawitym lub krokiem wymaga_potwierdzenia: czy dodałem
  wyróżnioną sekcję "potwierdzenie odbioru" z konsekwencją podaną wprost?
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
