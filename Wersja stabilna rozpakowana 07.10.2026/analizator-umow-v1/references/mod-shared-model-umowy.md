# MODUŁ SHARED-MODEL-UMOWY — KONTRAKT JAKO OBIEKT DANYCH
## Analizator Umów v1 · Moduł Współdzielony (BRAMKA 0)

> **Wczytaj gdy:** dokument > 15 stron lub > 5 000 słów (ten sam próg co
> `workflows/weryfikacja-spojnosci-odeslan.md`), LUB tryb ANALIZA z pełnym
> raportem F.1, LUB użytkownik prosi o porównanie dwóch wersji umowy
> (→ razem z `mod-shared-diff-intelligence.md`).
>
> **Rola w architekturze:** to jest BRAMKA 0 — krok wykonywany JEDNORAZOWO,
> PRZED uruchomieniem modułów PRIMARY (G/H/I/K) i DOMAIN (J0–MA). Adresuje
> ten sam problem *attention dilution*, który system już rozpoznaje w
> `weryfikacja-spojnosci-odeslan.md` — zamiast każdego kolejnego modułu
> ponownie skanującego cały tekst umowy, wszystkie moduły czytają jedną
> ustrukturyzowaną tabelę z odesłaniami do §. Nie zastępuje żadnego
> istniejącego modułu merytorycznego — jest warstwą pod nimi.

---

## MU.0 KIEDY POMIJAĆ

```
Dokument < 15 stron / prosta analiza jednej klauzuli / triage-szybki →
  POMIŃ MU.1-MU.3, przejdź bezpośrednio do routingu PRIMARY/DOMAIN.
  Koszt ekstrakcji dla krótkiego dokumentu przewyższa korzyść.
```

---

## MU.1 TABELA EKSTRAKCJI (kontrakt jako dane)

Wykonaj JEDNORAZOWO, zaraz po Fazie 0 i weryfikacji podmiotów (POV-B/C),
przed wczytaniem modułu PRIMARY/DOMAIN. Wypełnij tabelę odsyłając do
paragrafów źródłowych — nie przepisuj treści klauzul, tylko wskaż lokalizację
i streść znaczenie prawne w 1 linii:

```
| Pole                | § w dokumencie | Streszczenie (1 linia)         | Status  |
|---------------------|-----------------|---------------------------------|---------|
| Strony               | §[x]           | [nazwy, role]                   | ✅/⬛    |
| Przedmiot            | §[x]           | [co jest przedmiotem]           | ✅/⬛    |
| Wynagrodzenie        | §[x]           | [kwota/mechanizm/waloryzacja]   | ✅/⬛    |
| Terminy              | §[x]           | [kluczowe daty/okresy]          | ✅/⬛    |
| Odpowiedzialność     | §[x]           | [zakres, cap, wyłączenia]       | ✅/⬛    |
| Rozwiązanie umowy    | §[x]           | [tryby wypowiedzenia/odstąpienia]| ✅/⬛   |
| Poufność             | §[x]           | [zakres, okres]                 | ✅/⬛    |
| IP / prawa autorskie | §[x]           | [przeniesienie/licencja]        | ✅/⬛    |
| RODO                 | §[x]           | [DPA / brak / niepełne]         | ✅/⬛    |
| Zabezpieczenia       | §[x]           | [kary umowne/gwarancje/kaucje]  | ✅/⬛    |
| Ryzyka zidentyfikowane| —             | [odesłanie do Modułu D/MCD]     | —       |
| Brakujące elementy   | —              | [odesłanie do mod-shared-missing-clause.md] | — |
```

- `⬛` = pole nieobecne w dokumencie → nie zgaduj, oznacz i przejdź dalej
  (to nie jest INTAKE-GAP — to obserwacja o SAMYM dokumencie, nie o danych
  od użytkownika).
- Każdy kolejny moduł (B/C/D/F, J0–MA, MCD, ORZECZ, RYZYKO, ECONOMIC) czyta
  tę tabelę zamiast ponownie skanować cały tekst. Gdy modułowi merytorycznemu
  potrzebny jest pełny cytat klauzuli — sięga po niego z dokumentu źródłowego
  pod wskazanym §, tabela służy WYŁĄCZNIE do nawigacji i syntezy, nie zastępuje
  odczytu źródła przy formułowaniu wniosków prawnych.
- Tabela nie jest osobnym raportem dla użytkownika — to wewnętrzne narzędzie
  robocze. Pokazuj ją użytkownikowi tylko na wyraźne żądanie ("pokaż jak
  rozłożyłeś umowę na elementy") lub jako Załącznik do Raportu F.1.

---

## MU.2 GRAF ZALEŻNOŚCI KLAUZUL I KONFLIKTY REŻIMÓW PRAWNYCH

> Formalizacja tego, co system już częściowo robi rozproszone w
> `mod-shared-wykladnia.md` (sprzeczności) i modułach RODO/AI-ACT osobno —
> nie nowa wiedza merytoryczna, tylko jedna jawna tabela spinająca wnioski.
> Wczytaj przy pełnym raporcie F.1 lub gdy użytkownik pyta o spójność umowy.

```
KROK 1 — Zależności między klauzulami (na bazie tabeli MU.1):
  Dla każdej pary klauzul, gdzie jedna determinuje skutek drugiej, zapisz:
  | Klauzula źródłowa | → wpływa na → | Klauzula zależna | Charakter wpływu |
  Przykład: Kara umowna §5 → wpływa na → Odpowiedzialność §7 (limituje ją,
  jeśli §7 przewiduje cap łączny) → wpływa na → Odstąpienie §9 (czy kara
  przepada przy odstąpieniu) → wpływa na → Force majeure §11 (czy FM
  wyłącza naliczanie kary).

KROK 2 — Konflikty reżimów prawnych (na bazie modułów już wczytanych):
  | Klauzula | Reżim A | Reżim B | Charakter konfliktu |
  Przykład: klauzula o profilowaniu klienta → RODO (mod-shared-rodo.md)
  vs. Prawo konsumenckie (mod-J8-b2c.md) vs. AI Act (mod-shared-ai-act.md)
  — jeśli reżimy nakładają się lub kolidują, wskaż który ma pierwszeństwo
  i na jakiej podstawie (lex specialis / hierarchia źródeł UE-PL).

ZASADA: ta sekcja NIE tworzy nowych ocen prawnych — agreguje wnioski z
modułów WYKLADNIA/RODO/AI-ACT/ORZECZ/ECONOMIC już wczytanych w toku analizy.
Jeśli dany moduł nie był wczytany (bo nie dotyczy tej umowy) — nie twórz
konfliktu na podstawie domysłu, oznacz "N/A — moduł nie dotyczy".
```

Wynik trafia do Raportu F.1 jako sekcja "Spójność wewnętrzna umowy" —
osobno od punktu 3 raportu (klauzule niedozwolone) i punktu 9 (brakujące
klauzule), bo dotyczy relacji MIĘDZY istniejącymi klauzulami, nie ich
treści z osobna.

---

## MU.3 WYKRYWANIE MARTWYCH KLAUZUL

> Uzupełnienie `mod-shared-missing-clause.md` (który wykrywa BRAKI) o
> przeciwny biegun: klauzule OBECNE, ale bezużyteczne. Tania, szybka
> pozycja audytowa — dodaj jako punkt checklisty przy pełnym raporcie F.1,
> nie jako osobny tryb pracy.

```
Dla każdej klauzuli z tabeli MU.1 sprawdź, czy jest:
  □ MARTWA — nie wywołuje żadnego odrębnego skutku prawnego (np. powtarza
    ogólną zasadę już wynikającą z przepisu bezwzględnie obowiązującego,
    bez żadnej modyfikacji/doprecyzowania)
  □ REDUNDANTNA — dubluje inną klauzulę tej samej umowy (ten sam skutek
    uregulowany dwa razy, ryzyko rozbieżnej wykładni przy przyszłej zmianie
    jednej z nich bez drugiej)
  □ WEWNĘTRZNIE SPRZECZNA — koliduje z inną klauzulą tej samej umowy w
    sposób uniemożliwiający jednoczesne zastosowanie obu (odeślij do
    mod-shared-wykladnia.md po pełną analizę tej sprzeczności)
  □ NIGDY NIEZNAJDUJĄCA ZASTOSOWANIA — warunek jej aktywacji jest pusty/
    niemożliwy do spełnienia w opisanym stanie faktycznym

Format wpisu w raporcie:
  §[X] — [MARTWA/REDUNDANTNA/SPRZECZNA z §Y/NIGDY NIEZNAJDUJĄCA ZASTOSOWANIA]
  Rekomendacja: [usuń / doprecyzuj / ujednolić z §Y]
```

Trafia do Raportu F.1 jako podpunkt sekcji 9 (obok brakujących klauzul) —
"klauzule zbędne", nie jako osobna sekcja numerowana, żeby nie rozbijać
istniejącej struktury raportu.

---

## MU.4 ZASADA SKALI — WYŁĄCZNIE JAKOŚCIOWA, NIE PROCENTOWA

> ⛔ ZASADA STAŁA: żaden wynik pochodzący z tego modułu (ani z
> `mod-shared-diff-intelligence.md`) nie może być wyrażony jako pojedyncza
> liczba/procent sugerująca pomiar ("87% egzekwowalności", "ryzyko wzrosło
> o 37%", "8.7/10 ogólnej oceny"). Model językowy nie dysponuje skalibrowanym
> rozkładem prawdopodobieństwa — taka liczba wygląda na pomiar, a jest
> sformatowanym wrażeniem. To ryzyko dla klienta/adresata raportu, który
> potraktuje ją jako zmierzoną wartość.
>
> Zamiast tego — stosuj WYŁĄCZNIE skale już istniejące w systemie:
>   - Ryzyko klauzuli: 🔴 Krytyczne / 🟠 Wysokie / 🟡 Średnie / 🟢 Niskie
>     (już w mod-core-checklist.md Moduł B.1/D)
>   - Pewność ustalenia faktycznego (przy diff/porównaniach): BEZSPORNE /
>     PEWNE / WYDEDUKOWANE / SPORNE (konwencja z chronologia-sprawy-v1)
>   - Balans dokumentu: scoring 0–10 z Modułu D.2 — ale to jest jawnie
>     opisana metodologia porównawcza (liczba uprawnień/obowiązków), NIE
>     zagregowany "health score" całej umowy. Nie buduj z niego pojedynczej
>     łącznej oceny "X/10 ogólnie", bo to miesza kategorie o różnej naturze
>     (balans ≠ ryzyko ≠ kompletność ≠ zgodność z prawem).
>
> Naruszenie tej zasady (podanie sfabrykowanego wskaźnika liczbowego jako
> wyniku pomiaru) traktuj jak błąd merytoryczny tej samej wagi co błędne
> przywołanie przepisu z pamięci.

---

*Moduł mod-shared-model-umowy.md v1.0 (dodany 2026-08-02) — patrz
references/CHANGELOG.md, wpis v1.21, oraz uzasadnienie w dokumentach
źródłowych analizy (Grok — kontrakt jako obiekt danych, pkt 1/3/6/12).*
