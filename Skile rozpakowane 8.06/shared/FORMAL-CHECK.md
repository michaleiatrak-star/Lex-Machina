# FORMAL-CHECK — centralna walidacja formalna pisma

**Status:** moduł współdzielony, obowiązkowy dla generatorów pism.  
**Zakres:** pisma cywilne, pracownicze, gospodarcze, karne, administracyjne, sądowoadministracyjne, egzekucyjne i przedsądowe.  
**Zasada:** ten moduł nie zastępuje weryfikacji aktualnego tekstu ustawy. Przed wskazaniem przepisu, terminu albo opłaty sprawdź aktualny tekst aktu prawnego w ISAP / prawo.sejm.gov.pl lub innym oficjalnym źródle.

## 1. Bramka wejściowa

Przed redakcją ustal:

| Pole | Decyzja |
|---|---|
| Rodzaj pisma | pozew / odpowiedź / apelacja / zażalenie / wniosek / sprzeciw / zarzuty / zawiadomienie / odwołanie / skarga / inne |
| Tryb | KPC / KP / KPK / KPA / PPSA / egzekucja / przedsądowe |
| Etap | przedprocesowy / pierwsza instancja / odwoławczy / wykonawczy / nadzwyczajny |
| Termin | brak / zawity / instrukcyjny / materialny / przedawnienie |
| Opłata | brak / stała / stosunkowa / podstawowa / zwolnienie |
| Ryzyko | zwrot / odrzucenie / oddalenie / prekluzja / koszty |

Jeżeli nie da się ustalić rodzaju pisma, nie generuj wersji finalnej. Przygotuj szkic z polami `⬛ [UZUPEŁNIJ]` albo zadaj jedno pytanie zbiorcze tylko o dane krytyczne.

## 2. Wymogi wspólne dla pisma procesowego

Sprawdź przed oddaniem pisma:

- oznaczenie sądu albo organu,
- oznaczenie stron / uczestników / pełnomocników,
- adresy do doręczeń,
- PESEL / NIP / KRS / REGON, jeśli wymagane w danym trybie,
- sygnatura akt, jeżeli sprawa już się toczy,
- oznaczenie rodzaju pisma,
- jasne żądanie albo wniosek,
- podstawa faktyczna,
- dowody przypisane do konkretnych faktów,
- uzasadnienie,
- podpis,
- załączniki,
- odpisy dla stron przeciwnych, jeżeli wymagane,
- opłata albo wniosek o zwolnienie,
- właściwość rzeczowa, miejscowa i funkcjonalna,
- termin i sposób jego liczenia,
- wymogi szczególne dla danego pisma.

## 3. Minimalna mapa podstaw formalnych

| Tryb | Podstawowe przepisy do sprawdzenia |
|---|---|
| KPC — pismo procesowe | art. 126–130 k.p.c.; przy pozwie także art. 187 k.p.c. |
| KPC — apelacja | art. 367–373 k.p.c.; w szczególności art. 368–370 k.p.c. |
| KPC — zażalenie | przepisy o zażaleniu właściwe dla danego rodzaju postanowienia; sprawdź aktualny model zażaleniowy |
| KPC — sprzeciw / zarzuty | właściwy przepis dla nakazu zapłaty i trybu, w którym został wydany |
| KPK — pisma | art. 119–120 k.p.k. oraz przepisy szczególne dla środka zaskarżenia / zawiadomienia |
| KPA — podania | art. 63–64 k.p.a. oraz przepisy szczególne dla odwołania, zażalenia, ponaglenia |
| PPSA | przepisy PPSA właściwe dla skargi, zażalenia, skargi kasacyjnej i braków formalnych |
| Koszty cywilne | ustawa o kosztach sądowych w sprawach cywilnych, zwłaszcza właściwe przepisy o opłacie stałej / stosunkowej |

## 4. Decyzja walidacyjna

Po sprawdzeniu wydaj jedną z decyzji:

- `✅ FORMALNIE GOTOWE` — brak krytycznych braków.
- `⚠️ DO UZUPEŁNIENIA` — pismo może być szkicem, ale wymaga danych.
- `⛔ NIE SKŁADAĆ` — ryzyko zwrotu, odrzucenia albo nieskuteczności jest istotne.

## 5. Raport końcowy

Przed finalnym pismem lub po nim podaj krótki raport:

```text
FORMAL-CHECK
Tryb: ...
Termin: ...
Opłata: ...
Właściwość: ...
Braki krytyczne: ...
Braki uzupełniające: ...
Ryzyko procesowe: ...
Decyzja: ✅ / ⚠️ / ⛔
```
