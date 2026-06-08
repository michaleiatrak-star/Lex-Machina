# M1 — Ekstrakcja faktów, twierdzeń, milczeń i cytatów

## Cel
Wydobyć z dokumentów materiał faktyczny bez interpretacji. Fakt, twierdzenie, dowód, opinia i argument prawny muszą być od siebie oddzielone.

## 1.1 Zasada rozdzielenia

- **Fakt twardy:** data, kwota, nazwa, czynność, dokument, zdarzenie.
- **Twierdzenie strony:** opis zdarzenia przedstawiony przez stronę.
- **Dowód:** dokument, nagranie, e-mail, świadek, opinia, potwierdzenie, protokół.
- **Ocena / interpretacja:** wniosek strony, kwalifikacja, zarzut.
- **Milczenie:** brak informacji, która powinna pojawić się przy danym twierdzeniu.

## 1.2 Warstwy ekstrakcji

### Warstwa A — dane twarde

Wydobądź wszystkie:

- daty;
- kwoty;
- osoby i podmioty;
- adresy i miejsca;
- sygnatury;
- numery dokumentów;
- tytuły przelewów;
- oznaczenia załączników;
- terminy procesowe;
- podpisy i pełnomocnictwa;
- organy i instytucje.

Format:

```text
[F001]
Typ: data / kwota / osoba / dokument / czynność / miejsce / termin
Treść dosłowna:
Parafraza techniczna:
Źródło: DOC-ID, strona/akapit/linia
Strona twierdząca:
Status: bezsporne / sporne / wymaga weryfikacji / kolizja
```

### Warstwa B — czynności procesowe i materialnoprawne

Wyodrębnij:

- złożenie pozwu, odpowiedzi, apelacji, zażalenia;
- doręczenia;
- wezwania;
- oświadczenia woli;
- wypowiedzenia;
- potrącenia;
- uznania długu;
- ugody i propozycje ugodowe;
- zawiadomienia organów;
- decyzje, postanowienia, wyroki.

### Warstwa C — twierdzenia stron

Dla każdego twierdzenia:

```text
[TW001]
Strona:
Treść twierdzenia:
Dowód powołany:
Dowód faktycznie załączony: tak / nie / nie wiadomo
Źródło:
Ryzyko: udokumentowane / częściowo udokumentowane / gołosłowne / sprzeczne
Znaczenie: kluczowe / pomocnicze / tło
```

### Warstwa D — milczenia i opuszczenia

Szukaj braków:

- brak daty przy zarzucie;
- brak dowodu przy poważnym twierdzeniu;
- brak wyjaśnienia zmiany stanowiska;
- brak odpowiedzi na wezwanie;
- brak dokumentu wymienionego w treści;
- brak podpisu lub pełnomocnictwa;
- brak wskazania podstawy prawnej;
- brak wskazania szkody albo związku przyczynowego.

Format:

```text
[MIL001]
Kategoria:
Opis braku:
Dlaczego to istotne:
Możliwa interpretacja sądu:
Możliwy atak przeciwnika:
Priorytet uzupełnienia: wysoki / średni / niski
```

### Warstwa E — cytaty kluczowe

Wyciągnij dosłownie zdania, które:

- stanowią przyznanie;
- zawierają zarzut;
- zawierają ocenę osoby;
- mogą naruszać dobra osobiste;
- wskazują datę lub kwotę;
- są dwuznaczne;
- są potencjalnie sprzeczne z innym dokumentem.

Format:

```text
[CYT001]
Cytat dosłowny:
Źródło:
Dlaczego kluczowy:
Powiązane fakty:
Ryzyko użycia przez przeciwnika:
```

## 1.3 Oś czasu

Twórz oś czasu tylko z datowanych faktów. Brak daty oznacz jako `[DATA NIEUSTALONA]`.

```text
Data | Fakt | Źródło | Strona | Znaczenie | Kolizja
```

## 1.4 Reguły antyhalucynacyjne

- Nie uzupełniaj dat z pamięci.
- Nie poprawiaj nazw własnych.
- Nie streszczaj cytatu jako cytatu.
- Jeżeli źródło nie ma strony, użyj akapitu lub lokalizacji opisowej.
- Jeżeli fakt wynika pośrednio, oznacz: `WNIOSEK Z FAKTÓW`, nie `FAKT`.
