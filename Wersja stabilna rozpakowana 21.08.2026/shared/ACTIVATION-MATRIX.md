# ACTIVATION-MATRIX — Macierz Aktywacji Skilli

> **Plik kanoniczny:** `/mnt/skills/user/shared/ACTIVATION-MATRIX.md`
> **Wersja:** 1.0 | Data: 2026-06-02
> **Cel:** Eliminacja konfliktu deskryptorów — każda fraza mapuje do JEDNEGO skilla.

Router sprawdza tę macierz gdy fraza wyzwalająca pasuje do ≥2 skillów.

---

## ZASADA PRIORYTETU

```
1. Fraza z tej macierzy → skill PRIMARY wskazany tu (nie w deskryptorze skilla)
2. Brak frazy → standardowy routing [1]–[10] z SKILL.md routera
3. Kombinacja PRIMARY+SECONDARY zawsze dopuszczalna — macierz wskazuje ENTRY POINT
```

---

## MACIERZ AKTYWACJI (fraza → PRIMARY skill)

### Frazy analityczne — najczęstsze konflikty

| Fraza / sygnał | PRIMARY skill | NIE używaj jako PRIMARY |
|---|---|---|
| "jakie mam szanse" / "czy mam szansę" | `analiza-sadowa-v6` | analizator-dowodow, analizator-przepisow |
| "co mam zrobić" / "od czego zacząć" | `przewodnik-prawny-v2` | analiza-sadowa-v6 |
| dostarcza akta / wyrok / pismo przeciwnika | `analiza-sadowa-v6` | analizator-dowodow-v3 |
| dostarcza dowody bez pisma (maile, SMS, nagrania) | `analizator-dowodow-v3` | analiza-sadowa-v6 |
| "oceń moje dowody" / "czy ten dowód jest mocny" | `analizator-dowodow-v3` | analiza-sadowa-v6 |
| "art. X" / "§ Y" / "co mówi przepis" / wykładnia normy | `analizator-przepisow-v2` | analiza-sadowa-v6 |
| "czy przepis mnie dotyczy" / przesłanki ustawowe | `analizator-przepisow-v2` | analiza-sadowa-v6 |
| pismo procesowe + dostarczone akta | `analiza-sadowa-v6` (W1) → `pisma-procesowe-v3` (W2) | analizator-dowodow |
| "napisz pozew / apelację / zażalenie" | `pisma-procesowe-v3` | pisma-proste-v2 |
| 1 wątek + katalog pisma prostego | `pisma-proste-v2` | pisma-procesowe-v3 |
| "znajdź wyrok" / "precedens" / sygnatura do weryfikacji | `orzeczenia-sadowe-v2` | analiza-sadowa-v6 |
| orzecznictwo jako wsparcie do pisma (W3) | `orzeczenia-sadowe-v2` jako SECONDARY | — |
| "analiza umowy" / "czy mogę podpisać" / klauzule | `analizator-umow-v1` | analiza-sadowa-v6 |
| "co to znaczy" / "nie rozumiem pisma" / wyjaśnienie | `przewodnik-prawny-v2` | analizator-przepisow-v2 |
| ZUS / KRUS / niepełnosprawność / emerytura | `DR routing BJ–BW` via prawo-polskie-v2 | analiza-sadowa-v6 |
| świadek / pytania do przesłuchania / cross-examination | `przesluchanie-swiadkow-v2` | analizator-dowodow-v3 |
| chronologia / oś czasu / timeline | `chronologia-sprawy-v1` (bramka auto) | — |
| "raport dla klienta" / "wyślij klientowi" | `raport-klienta-v1` | raport-sytuacyjny-v2 |
| "stan sprawy" / "aktualny status" / raport ogólny | `raport-sytuacyjny-v2` | raport-klienta-v1 |

---

## ZASADY ROZSTRZYGANIA NAKŁADAŃ

### analiza-sadowa-v6 vs analizator-dowodow-v3

```
WEJŚCIE: tylko dowody (maile, SMS, nagrania, faktury, zdjęcia)
  → analizator-dowodow-v3 (hierarchia A–D, scoring, terminy)

WEJŚCIE: akta / pismo sądowe / wyrok + pytanie o szanse
  → analiza-sadowa-v6 (model 4-przebiegowy, raport §1–§11)

WEJŚCIE: pismo + dowody + "co zrobić dalej"
  → analiza-sadowa-v6 jako PRIMARY, analizator-dowodow-v3 jako SECONDARY w Przejście I
```

### analiza-sadowa-v6 vs analizator-przepisow-v2

```
WEJŚCIE: pytanie o konkretny artykuł (art. X KPC, §Y KC)
  → analizator-przepisow-v2 (drzewo przesłanek, historia nowelizacji)

WEJŚCIE: sprawa sądowa + pytanie o podstawę prawną
  → analiza-sadowa-v6 (kwalifikacja prawna w Przejście II)

WEJŚCIE: "czy art. X mnie dotyczy" bez kontekstu sprawy
  → analizator-przepisow-v2
```

### pisma-procesowe-v3 vs pisma-proste-v2

```
WARUNEK PROSTY (wszystkie trzy muszą być spełnione):
  1. Jedno żądanie procesowe
  2. Jedna podstawa prawna
  3. Typ należy do katalogu pisma-proste-v2 (sprzeciw od nakazu, klauzula, wgląd do akt itd.)
→ pisma-proste-v2

KAŻDA WĄTPLIWOŚĆ → pisma-procesowe-v3
```

### orzeczenia-sadowe-v2 vs analiza-sadowa-v6 (orzecznictwo)

```
CEL: znaleźć / zweryfikować orzeczenie (sygnatura, precedens, linia)
  → orzeczenia-sadowe-v2 jako PRIMARY

CEL: orzecznictwo jako wsparcie do budowanego pisma (W3.2)
  → orzeczenia-sadowe-v2 jako SECONDARY (wywołany z pisma-procesowe-v3/W3.2)
```

---

## KOMBINACJE SKILLI (entry point → pipeline)

| Sprawa | Entry point | Pipeline |
|---|---|---|
| Dokument + wezwanie | analizator-umow-v1 | → analiza-sadowa-v6 → pisma-procesowe-v3 |
| Akta + riposta + orzecznictwo | analiza-sadowa-v6 | → pisma-procesowe-v3 → orzeczenia-sadowe-v2 |
| Pismo złożone + orzecznictwo | pisma-procesowe-v3 | → orzeczenia-sadowe-v2 (W3.2) |
| Dowody + terminy + koszty | analizator-dowodow-v3 | → analiza-sadowa-v6 |
| Świadek + strategia | przesluchanie-swiadkow-v2 | → analizator-dowodow-v3 |
| Przepis + pismo | analizator-przepisow-v2 | → orzeczenia-sadowe-v2 → pisma-procesowe-v3 |
| Laik bez pojęcia | przewodnik-prawny-v2 | → dowolny skill zależnie od odpowiedzi |
| Raport dla klienta | raport-klienta-v1 | ← raport-sytuacyjny-v2 (źródło danych) |

---

## UWAGA AUTORSKA

Ta macierz jest JEDYNYM miejscem rozstrzygania konfliktów aktywacji.
Deskryptory poszczególnych skilli (sekcja `description` w SKILL.md) mogą mieć
nakładające się frazy — macierz ma pierwszeństwo przed deskryptorem.

Aktualizacja macierzy: gdy dodawany jest nowy skill z nakładającym się deskryptorem,
dodaj wiersz do tej tabeli PRZED wdrożeniem skilla.
