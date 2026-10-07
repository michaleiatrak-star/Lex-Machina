# Korpus benchmarkowy „posiane wady" — F-203(a)

Korpus 5 oryginalnych umów napisanych od zera dla `analizator-umow-v1`, z
manifestem złotego standardu i instrukcją sędziego, na potrzeby regresyjnego
mierzenia jakości analizy umów przez ten skill (i przez `shared`).

## Zawartość

```
umowy/
  01-czysta-b2b.md              — kontrolna, BEZ posianych wad
  02-jawne-nda.md                — wady jawne/oczywiste (NDA wzajemne)
  03-ukryte-wdrozenie.md          — wady ukryte/kumulatywne (wdrożenie WMS)
  04-matematyczna-tm.md           — wady rachunkowe (kontrakt Time & Materials)
  05-adwersarialne-injection.md   — wstrzyknięte instrukcje + rozbieżności liczbowe (SaaS)
manifesty/
  manifest.yaml           — TAJNY: pełna lista posianych wad, lokalizacje, poziomy, liczby
  instrukcja-sedziego.md   — protokół oceny (5 metryk + warunki FAIL)
wyniki/
  oceny/                   — tu trafiają oceny per konfiguracja (puste do pierwszego przebiegu)
```

## Zasada tajności

`manifest.yaml` i `instrukcja-sedziego.md` są **materiałem sędziego**, nie
materiałem wejściowym audytu. Uruchamiając `analizator-umow-v1` na plikach z
`umowy/`, nie udostępniaj tych dwóch plików modelowi/skillowi ocenianemu —
inaczej pomiar jest bezwartościowy (analogicznie do zasady „TAJNE dla
audytującego" w źródle metodologii).

## Pochodzenie i atrybucja

Struktura korpusu (podział na klasy czyste/jawne/ukryte/rachunkowe/adwersarialne,
format manifestu, 5-metrykowy protokół sędziego, wymóg „twardego zera"
zmyśleń) jest zaadaptowana — na zasadzie Apache License 2.0 — z projektu
**Polish Commercial Legal** (`apiotrowski-afk/commercial-legal-pl`,
`examples/benchmark/`). Pełna atrybucja: `../../NOTICE`.

**Same teksty umów są własne.** Oryginalne umowy testowe z repozytorium
źródłowego (`umowy/`, `contracts/`) są tam celowo wyłączone przez `.gitignore`
i nie są publicznie dostępne — nie zostały więc skopiowane ani sparafrazowane;
5 umów w tym katalogu napisano od zera na potrzeby Lex Machina, z własnym
zestawem posianych wad opartym o świeżo zweryfikowane (2026-09-26) przepisy:
art. 483 §1 KC, art. 473 §2 KC, art. 41 ust. 2 ustawy o prawie autorskim i
prawach pokrewnych, art. 484 §1 KC, art. 28 RODO, art. 4 pkt 3 i art. 7 ustawy
z dnia 8 marca 2013 r. o przeciwdziałaniu nadmiernym opóźnieniom w
transakcjach handlowych (t.j. Dz.U. z 2023 r. poz. 1790).

## Zakres i ograniczenie — jawne

Ocena wg tego korpusu jest dziś **ręczna** (sędzia-człowiek lub odrębny
przebieg modelu bez dostępu do `manifesty/`), zgodnie z
`instrukcja-sedziego.md`. Automatyczny skrypt porównujący cytaty/ID wad nie
wchodzi w zakres F-203(a) — to potencjalny przedmiot F-203(b) (przebiegi w
dwóch ramionach, ≥2 modele), który pozostaje otwarty i zależny od warunków
opisanych przy F-113 w `WARN-OTWARTE.md`.
