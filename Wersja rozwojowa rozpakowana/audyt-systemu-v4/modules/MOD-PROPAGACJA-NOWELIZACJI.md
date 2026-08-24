# MOD-PROPAGACJA-NOWELIZACJI — Śledzenie zmienionych przepisów przez CAŁY system

## Cel

`MOD-TRESC-MERYTORYCZNA.md` (FAZA 3E) odpowiada na pytanie: *"ten akt ma
nowy t.j. w mapie — czy moduł DR, który go opisuje, wciąż jest zgodny?"*
Działa **od aktu do jednego modułu** (przez kolumnę `Moduł` w
`MAPA-AKTOW.md`).

Ten moduł odpowiada na inne, szersze pytanie, ujawnione w sesji
2026-07-26 (transze FAZA 3E h-l, patrz `AUDIT-JOURNAL.md`):

> **"Ta KONKRETNA nowelizacja zmieniła KONKRETNE artykuły X, Y, Z jednego
> aktu (np. KK). Ten sam akt jest cytowany w DZIESIĄTKACH plików w
> całym systemie, nie tylko w jednym 'domowym' module DR. Czy
> KTÓRYKOLWIEK z tych plików — niezależnie od dziedziny, niezależnie od
> tego, czy jest 'oficjalnie' przypisany do tego aktu w MAPA-AKTOW.md —
> nadal zawiera przedawnioną wartość sprzed nowelizacji?"**

To różnica jakościowa: MOD-TRESC-MERYTORYCZNA sprawdza 1 moduł na 1 akt.
Ten moduł sprawdza **CAŁY SYSTEM** na 1 nowelizację (konkretne artykuły).

**Geneza:** w transzy FAZA 3E-l (AUDYT-2026-07-26l) znaleziono, że
`mod-KK-art101-105-przedawnienie-karalnosci.md` **sam ostrzegał** o
nowelizacji z 2022 r. (Dz.U. 2022 poz. 2600), ale nie zastosował jej do
własnej liczby (30→40 lat dla zabójstwa). To rodzi pytanie: czy INNE
pliki w systemie, które WSPOMINAJĄ zabójstwo/art. 148 KK/przedawnienie
w innym kontekście (np. cross-referencje, przykłady w modułach
proceduralnych, tabele w skillach niedziedzinowych), też mają tę samą,
przedawnioną liczbę? Ostrzeżenie w JEDNYM pliku nie chroni pozostałych.

---

## Kiedy się uruchamia

**Na żądanie**, gdy użytkownik wskazuje konkretną nowelizację do
propagacji ("sprawdź, czy nowelizacja X dotarła wszędzie", "przeprowadź
propagację zmiany Y przez system"), LUB **automatycznie jako
uzupełnienie FAZA 3E**, gdy transza FAZA 3E ujawni, że moduł ostrzegał o
nowelizacji, ale jej nie zastosował (dokładnie wzorzec z 2026-07-26l) —
w takim przypadku propagacja jest naturalnym następnym krokiem, nie
osobnym wywołaniem.

---

## Procedura

### KROK 1 — Zidentyfikuj DOKŁADNY zakres nowelizacji

Nie poprzestawaj na nazwie/dacie aktu zmieniającego. Ustal, w formie
listy, KTÓRE artykuły zostały: (a) zmienione (z jaką wartością PRZED i
PO), (b) dodane, (c) uchylone. Stosuj ZASADĘ 14 (gradacja źródeł) —
priorytet: tekst ustawy nowelizującej w ISAP/ELI (Rząd 1) > omówienia w
Rządzie 2B (kancelarie prawa dużych wydawnictw, rp.pl, gazetaprawna.pl)
> Rząd 3 jako dodatkowe potwierdzenie.

Wynik tego kroku to TABELA:

| Artykuł | Wartość PRZED | Wartość PO | Weryfikacja |
|---|---|---|---|
| art. 101 §1 pkt 1 KK | 30 lat | 40 lat | rp.pl (2B, akt. 13.04.2026), arslege.pl (2B, t.j. 2025.383), gov.pl (Kmiecik) |

### KROK 2 — Przeszukaj CAŁY system, nie jeden DR

Dla KAŻDEGO wiersza z KROKU 1, zbuduj zapytanie `grep` łączące numer
artykułu ORAZ starą wartość (żeby złapać tylko podejrzane wystąpienia,
nie każde wystąpienie numeru artykułu w ogóle):

```bash
grep -rn "art\. 101\|art\.148\|zabójstw" /mnt/skills/user/ \
  --include="*.md" | grep -v archive | grep -i "30 lat\|30-let"
```

Uwzględnij WARIANTY zapisu (myślnik/spacja, "30-letni" vs "30 lat" vs
"lat 30"), bo różne moduły pisane w różnym czasie mogą używać różnej
konwencji. Nie ograniczaj się do katalogu DR, w którym akt "mieszka"
oficjalnie wg `MAPA-AKTOW.md` — sprawdź `shared/`, moduły proceduralne
(`pisma-procesowe-v3`, `analizator-dowodow-v3` itd.), przykłady w innych
DR, gdzie dany przepis mógł zostać przywołany incydentalnie.

### KROK 3 — Dla każdego trafienia: sklasyfikuj

| Kategoria | Znaczenie | Akcja |
|---|---|---|
| ✅ AKTUALNE | plik już ma wartość PO nowelizacji | brak akcji |
| ❌ NIEAKTUALNE | plik ma wartość PRZED nowelizacji, przedstawioną jako aktualna | NAPRAW (str_replace, z adnotacją źródła i daty) |
| ⚪ HISTORYCZNE/KONTEKSTOWE | plik świadomie opisuje STAN SPRZED nowelizacji w kontekście historycznym/porównawczym (np. "przed reformą było 30, teraz 40") | brak akcji — to poprawne użycie starej wartości |
| ⚠️ NIEJEDNOZNACZNE | nie da się ustalić bez przeczytania szerszego kontekstu | oznacz i przejrzyj ręcznie |

### KROK 4 — Napraw i zarejestruj

Każda naprawa: `str_replace` na pliku źródłowym (nie na kopii — pliki w
`/mnt/skills/user/` są zapisywalne w tym środowisku), z tym samym
formatem adnotacji co w transzach FAZA 3E (⚠️ POPRAWKA [data], nazwa
nowelizacji, źródła). Sprawdź integralność nagłówków (`grep -c "^## "`)
przed i po, zgodnie z ogólną zasadą audytu.

### KROK 5 — Raport zbiorczy

Wpis do `AUDIT-JOURNAL.md` w formacie:

```
## AUDYT-YYYY-MM-DD — Propagacja nowelizacji: [nazwa aktu zmieniającego]

**Zakres zmiany:** [tabela z KROKU 1]
**Przeszukano:** N plików w całym systemie (nie tylko 1 DR)
**Znaleziono nieaktualnych:** M
**Naprawiono:** M (lista plików)
**Historyczne/kontekstowe (bez zmian):** K (lista, z uzasadnieniem czemu zostały)
```

---

## Ograniczenia (świadome, Zasada 6)

- Ten mechanizm NIE zastępuje FAZA 3E dla nowych nowelizacji wykrytych
  przez FAZA 3A-3D — to DODATKOWY, głębszy krok dla nowelizacji już
  RAZ złapanych jako problem w jednym module, żeby sprawdzić, czy
  problem jest szerszy.
- Skuteczność zależy od tego, czy stara wartość jest wystarczająco
  charakterystyczna do wyszukania (`grep`) bez zbyt wielu fałszywych
  trafień — dla zmian NIE-liczbowych (np. zmiana definicji, nowe
  przesłanki) automatyczne wyszukiwanie jest trudniejsze i wymaga
  więcej osądu przy KROKU 3.
- Nie uruchamiaj tego mechanizmu "profilaktycznie" dla wszystkich
  nowelizacji w historii systemu naraz — to zadanie na miarę pojedynczej,
  konkretnej nowelizacji na sesję, analogicznie do transz FAZA 3E.
