# HARD GATE ORZECZNICZY — SN / NSA / TK / ETPCZ / TSUE

## Cel
Wykluczyć fikcyjne sygnatury i niezweryfikowane tezy.

## Procedura obowiązkowa

1. Ustal, czy orzecznictwo jest potrzebne.
2. Wyszukaj orzeczenia w publicznych źródłach:
   - SN: baza SN / SAOS / portale sądowe,
   - NSA: CBOSA,
   - TK: trybunal.gov.pl,
   - ETPCz: HUDOC,
   - TSUE: CURIA.
3. Zweryfikuj:
   - sygnaturę,
   - datę,
   - sąd/skład,
   - stan faktyczny,
   - tezę,
   - fragment uzasadnienia.
4. Ustal funkcję orzeczenia:
   - ratio decidendi,
   - obiter dicta,
   - przykład pomocniczy,
   - rozbieżność linii.
5. Dopiero wtedy wolno użyć orzeczenia.

## Standard potwierdzenia istnienia (od routera 3.54)

Orzeczenie **istnieje** dopiero wtedy, gdy sygnatura, sąd i data pochodzą
z **jednego i tego samego rekordu** w źródle RZĘDU 1/2A (portal sądu, SAOS, baza
SN, CBOSA) lub z odczytanego pełnego tekstu. Nie wystarcza:

- zbieżność samej daty albo samej sygnatury w wynikach wyszukiwarki,
- skojarzenie sygnatury z jednego wyniku z datą z innego wyniku,
- trafienie w katalogu haseł (np. teza „skatalogowana” w LEX) bez odczytu
  uzasadnienia — to potwierdza istnienie, nie treść.

Statusy (wyłącznie te):
- `✅ ISTNIEJE + TREŚĆ` — rekord i odczytany fragment uzasadnienia;
- `🟧 ISTNIEJE, TREŚĆ NIEODCZYTANA` — rekord bez tekstu; zakaz przypisywania
  tezy i stanu faktycznego;
- `⚠️ NIEPOTWIERDZONE` — wszystko inne.

⛔ Zakazane sformułowania: „prawdopodobnie istnieje”, „wygląda na realne”.
⛔ Dwie sygnatury z tym samym dniem i miesiącem w jednej odpowiedzi → sprawdź
osobno każdą parę sygnatura–data; zbieżność traktuj jako sygnał pomyłki.
⛔ Brak dostępu do tekstu jednym narzędziem (blokada narzędzia, `robots.txt`)
→ użyj innej drogi: kanały z `shared/DOSTEP-MASZYNOWY-API.md` §3, kanał kodu,
przeglądarka, inny portal z tym samym orzeczeniem (zasada innej drogi, §0).
Gdy wszystkie zawiodą — poproś użytkownika o pobranie orzeczenia i wgranie pliku.

## Format użycia w piśmie

Orzeczenie może być użyte tylko gdy podano:
- sąd,
- data,
- sygnatura,
- konkretna teza,
- związek z przesłanką sprawy.

## Blokada
Jeżeli nie zweryfikowano sygnatury:
- nie wolno użyć orzeczenia jako argumentu,
- można napisać wyłącznie: „wymaga weryfikacji”.
