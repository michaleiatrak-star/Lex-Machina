# BLUEPRINT-SCHEMA — Anonimizer Prawny JSX

## Cel
Moduł anonimizuje dokumenty przed analizą prawną i przekazuje wynik do routera za pomocą znaczników sesyjnych.

## Domyślny renderer
`assets/AnonimizerPrawny.jsx`

## Wejście
- tekst wklejony przez użytkownika,
- plik tekstowy wczytany w komponencie,
- opcje zakresu anonimizacji.

## Wyjście
### Dokument zanonimizowany
```
##ANON_START##
Źródło: ...
Anonimizacja: TAK | Usuniętych danych: N (...)
##ANON_END##

Oto zanonimizowany dokument do analizy prawnej:

...
```

### Dokument oryginalny za zgodą użytkownika
```
##PLIK_ORYGINALNY##
Źródło: ...
Anonimizacja: NIE — użytkownik wyraził zgodę na przetwarzanie danych oryginalnych w tej sesji.
##PLIK_ORYGINALNY_END##

Oto dokument oryginalny (bez anonimizacji) do analizy prawnej:

...
```

## Kategorie anonimizacji
1. imiona i nazwiska,
2. adresy,
3. PESEL/NIP/REGON,
4. telefony,
5. e-maile,
6. konta bankowe,
7. daty urodzenia / daty w kontekście osobowym,
8. nazwy firm.

## Reguły projektowe
- JSX jest domyślnym interfejsem.
- HTML legacy może istnieć tylko jako zapas archiwalny.
- Komponent nie rozstrzyga prawnie dokumentu; wykonuje wyłącznie przygotowanie danych.
- Wynik zawsze wymaga kontroli człowieka, bo regex może dać wyniki fałszywie dodatnie albo fałszywie ujemne.
