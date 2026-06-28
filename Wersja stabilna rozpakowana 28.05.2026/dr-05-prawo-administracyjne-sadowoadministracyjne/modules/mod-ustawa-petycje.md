# mod-ustawa-petycje

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Źródło weryfikacji:** Ustawa o petycjach — Dz.U. 2018 poz. 870 t.j. — weryfikuj w ISAP | Konstytucja RP art. 63
**Data weryfikacji online:** 2026-06-05
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## 1. CORE

Zakres: petycja do organu władzy publicznej w interesie publicznym lub własnym; terminy rozpatrzenia; petycja wielokrotna; jawność; bezczynność (skarga do WSA); różnice względem skargi i wniosku KPA.

**Akt:** Ustawa o petycjach — Dz.U. 2018 poz. 870 t.j. — weryfikuj aktualne zmiany w ISAP.

---

## 2. INTAKE

```
□ Czy żądanie dotyczy interesu publicznego lub własnego podmiotu wnoszącego?
□ Do kogo kierowana: Sejm / Senat / organ JST / organ administracji rządowej?
□ Czy petycja jest anonimowa? (pozostawiona bez rozpatrzenia)
□ Czy toczy się postępowanie w tej samej sprawie (indywidualnej)?
□ Czy jest pilność — szkoda grożąca w razie bezczynności?
```

---

## 3. PROCEDURA

### Terminy i tryb

```
Wniesienie: pisemne lub elektronicznie (BIP organu / ePUAP)
Termin rozpatrzenia: 3 miesiące od złożenia
Przedłużenie: o kolejne 3 miesiące z uzasadnieniem (maksymalnie 6 miesięcy łącznie)
Odpowiedź: pisemna lub elektronicznie — z uzasadnieniem sposobu rozpatrzenia
Jawność: organ publikuje petycje i odpowiedzi na BIP
```

### Petycja wielokrotna

```
Gdy w ciągu 3 miesięcy wpłynęło wiele petycji w tej samej sprawie:
→ Organ ogłasza na BIP oczekiwanie na dalsze petycje (max 12 miesięcy)
→ Następnie rozpatruje wszystkie łącznie
```

### Petycja vs skarga i wniosek KPA — kwalifikator

```
PETYCJA: żądanie w interesie publicznym / własnym / innej osoby (za jej zgodą)
         → Brak trybu odwoławczego KPA → skarga do WSA na bezczynność

SKARGA KPA (art. 221): krytyka działania organu / zaniedbanie / naruszenie prawa
         → Tryb KPA; termin 1 miesiąc na rozpatrzenie

WNIOSEK KPA (art. 221): propozycja ulepszenia, udoskonalenia pracy organu
         → Tryb KPA; termin 1 miesiąc na rozpatrzenie
```

---

## 4. STRATEGIA, QUALITY GATE, OUTPUT

**Strategia:** Petycja skuteczna przy kwestiach systemowych lub legislacyjnych — nie do rozstrzygnięcia indywidualnej sprawy. Przy braku odpowiedzi — skarga do WSA na bezczynność (art. 3 §2 pkt 8 PPSA).

**Quality gate:** Dane podmiotu wskazane (nie anonimowa)? Organ właściwy? Termin 3 miesięcy — czy minął?

**Output:** Kwalifikacja (petycja / skarga / wniosek KPA) → wniesienie → monitoring terminu → skarga WSA przy bezczynności.

**Powiązania:** `dr-04` → `mod-KPA` | `pisma-procesowe-v3`

**Źródła:** https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20180000870

---

## WERYFIKACJA Dz.U.

```
Ustawa o petycjach: Dz.U. 2018 poz. 870 t.j.
  ✅ VER: isap.sejm.gov.pl 2026-06-05
  Nowszy t.j. NIE został ogłoszony — Dz.U. 2018 poz. 870 jest aktualnym t.j.
  → Weryfikuj zmiany po t.j. w ISAP: isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20180000870
```
