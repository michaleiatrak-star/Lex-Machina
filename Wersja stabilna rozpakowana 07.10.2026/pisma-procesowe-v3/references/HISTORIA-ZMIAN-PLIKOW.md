# Historia zmian plików — pisma-procesowe-v3

> Plik historyczny: historia zmian SKILL.md i modułów, przeniesiona z plików roboczych
> (AUDYT-2026-10-04n). Model nie czyta go podczas pracy; bieżący stan jest w plikach roboczych,
> historia wersji skilla — w `references/CHANGELOG.md`.


## SKILL.md (przeniesione 2026-10-04n)

## CHANGELOG

⛔ **Historia zmian tego skilla NIE mieszka w tym pliku** (ZASADA 15,
`audyt-systemu-v4/SKILL.md`). Jedyna lokalizacja kanoniczna:

```
view pisma-procesowe-v3/references/CHANGELOG.md
```

*(Wpisy 5.15 … 5.12 wraz z blokiem odsyłającym przeniesione stąd 1:1 do `references/CHANGELOG.md`
dnia 2026-08-24, flaga F-126 — usunięcie stanu przejściowego, w którym
historia mieszkała w DWÓCH miejscach. Treść nie została przeredagowana
ani odtworzona z pamięci; przeniesiony został istniejący tekst.)*


## modules/MOD-PRACODAWCA-RZECZYWISTY.md (przeniesione 2026-10-04n)

## HISTORIA ZMIAN

```
2.2.0 (2026-06-27) — WARSTWA 0 zamieniona na pointer do MOD-IDENTYFIKACJA-STRONY-UMOWY:
  Logikę W0 (dane większościowe) wydzielono do osobnego modułu shared
  `MOD-IDENTYFIKACJA-STRONY-UMOWY.md` (WARN-19 zamknięty). Moduł jest teraz
  wywoływany przez W0 jako view + ISU-1→ISU-5. Powód wydzielenia: mechanika
  danych większościowych jest użyteczna poza sprawami pracowniczymi — działa
  na umowach B2B, fakturach VAT, polisach, zamówieniach, pismach procesowych.
  Wpływ: MOD-DOKUMENT-ANOMALIE DA-3 → ISU → MOD-PRACODAWCA-RZECZYWISTY W1–W4
  (sekwencja: identyfikacja strony PRZED scaleniem pracodawców).

2.1.0 (2026-06-27) — Dodano WARSTWA 0 (dane większościowe):
  Propozycja dewelopera: zamiast budować argument na doktrynie prawnej,
  zaczynać od empirycznego odczytu — który podmiot jest wskazany przez większość
  elementów identyfikacyjnych dokumentu. KRS błędny = błąd pisarski, gdy NIP,
  nazwa, adres i podpis zgodnie wskazują na podmiot_B.
  Ocena: bardziej uniwersalna (działa na każdym typie umowy), trudniejsza do obalenia
  (pozwana nie może powiedzieć "literówka" bo tym samym przyznaje tożsamość kontrahenta),
  zgodna z art. 65 §1 KC (wykładnia oświadczeń woli).
  Ograniczenie: W0 identyfikuje stronę umowy, nie scala pracodawców dla art. 25¹ KP —
  do zliczania umów nadal konieczne warstwy 1–4.
  Architektura: W0 = "kto jest stroną każdej umowy" → W1-W4 = "czy liczyć razem".
  Naprawa KAT-I: zaktualizowano konsekwencję — ZASTOSUJ W0 (nie "zastosuj venire").
  Wbudowanie w system: brak nowego pliku — W0 jest warstwą w R3 istniejącego modułu.

2.0.0 (2026-06-27) — Upgrade po błędzie krytycznym VII P 94/25:
  Root cause: moduł nie miał triggera w PRE-W2; pipeline generował pismo bez
  wywołania modułu gdy rozbieżność wykryta dopiero po wygenerowaniu tekstu.
  Skutek: pismo v3 opierało argument na błędnym KRS z umów ("ten sam KRS"),
  co pozwana mogła obalić jednym zdaniem ("to literówka").
  Naprawy v2.0.0:
  (1) Dodano ⛔ TRIGGER PRE-W2 na początku pliku — moduł teraz wywołany explicite
      z PRE-W2-VERIFICATION-GATE gdy PRE-W2.C/D wykryje T1/T2/T3/T4.
  (2) Dodano protokół R1–R5 (wcześniej tylko PR1–PR4) — obejmuje klasyfikację
      KAT-I/II/III i hedge procesowy (OPCJA A/B/C).
  (3) Dodano 4-warstwowy argument R3: pracodawca rzeczywisty (art.3 KP) +
      obejście prawa (art.58§1 KC) + venire (art.8 KP) + dowody tożsamości.
  (4) Dodano ⛔ LISTA ZAKAZÓW (R1-R4) — w szczególności ZAKAZ-R1 zakazuje
      argumentu "ten sam KRS" gdy KRS w umowach jest błędny.
  (5) Dodano przykład VII P 94/25 jako case study.
  (6) Scalono z nowym plikiem /home/claude/MOD-PRACODAWCA-RZECZYWISTY.md
      (duplikat stworzony w tej samej sesji — eliminacja zgodnie z CHECKLIST-DEDUP).

1.0.0 (2026-06-21) — Pierwsza wersja.
  Przyczyna: brak dedykowanego modułu do obsługi spraw wielopodmiotowych.
  System posiadał MOD-STRATEGIA-WYBOR (identyfikacja ścieżek, z przykładem VII P 94/25),
  ale brakowało szczegółowej sekwencji z tabelą kryteriów i orzecznictwem.
```

## HISTORIA ZMIAN

```
1.0.0 (2026-06-21) — Pierwsza wersja.
Przyczyna: brak dedykowanego modułu do obsługi spraw wielopodmiotowych.
System posiadał MOD-STRATEGIA-WYBOR (identyfikacja ścieżek, z przykładem VII P 94/25),
ale brakowało szczegółowej sekwencji PR1–PR4 z tabelą kryteriów i orzecznictwem.
Zidentyfikowano po analizie porównawczej pisma generowanego i pisma poprawionego
przez użytkownika w sprawie VII P 94/25: różnica w jakości opracowania tematu
pracodawcy rzeczywistego była krytyczna dla oceny (6,8 vs 9,1/10).
```
