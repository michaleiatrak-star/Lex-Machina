# SPR — Odstąpienie od umowy („zerwanie umowy”)

*Ładuj gdy: użytkownik chce odstąpić od umowy („zerwać umowę”): zakup przez internet lub poza
lokalem (14 / 30 dni), zwłoka drugiej strony, opóźnienie lub wadliwe wykonanie dzieła albo robót,
umowne prawo odstąpienia; także wezwanie z terminem dodatkowym przed odstąpieniem.*

„Zerwanie umowy” nie jest pojęciem ustawowym. Ustal, które oświadczenie jest właściwe:
odstąpienie (ten schemat), wypowiedzenie umowy ciągłej (SPN), obniżenie ceny lub odstąpienie
z powodu wady towaru (SPO), rozwiązanie za porozumieniem stron (projekt porozumienia —
`analizator-umow-v1`).

*Poza zakresem:* spór o skuteczność odstąpienia, zwrot świadczeń sądownie → `pisma-procesowe-v3`;
umowa o pracę → `dr-04`.

---

## PODSTAWA PRAWNA (odczyt ELI, RZĄD 1, 2026-10-15)

Ustawa z dnia 30 maja 2014 r. o prawach konsumenta (u.p.k.) — t.j. Dz. U. z 2026 r. poz. 1244:

| Przepis | Co rozstrzyga |
|---|---|
| art. 27 | umowa na odległość lub poza lokalem: odstąpienie w 14 dni bez podania przyczyny; 30 dni przy nieumówionej wizycie lub wycieczce |
| art. 28 | początek biegu: towar — od objęcia w posiadanie (partie: ostatnia; dostawy regularne: pierwsza); inne umowy — od zawarcia |
| art. 30 | oświadczenie (może być na formularzu z załącznika nr 2); do zachowania terminu wystarczy wysłanie |
| art. 32 | przedsiębiorca zwraca płatności (z kosztem dostarczenia) w 14 dni; może wstrzymać do otrzymania towaru lub dowodu odesłania |
| art. 34 | konsument zwraca towar w 14 dni od odstąpienia; bezpośrednie koszty zwrotu; odpowiedzialność za zmniejszenie wartości |
| art. 38 | wyjątki — brak prawa odstąpienia (m.in. usługa w pełni wykonana za zgodą, towar na zamówienie, zapieczętowany otwarty) |
| art. 7aa | także osoba fizyczna-przedsiębiorca bez charakteru zawodowego umowy |

Kodeks cywilny — t.j. Dz. U. z 2026 r. poz. 795:

| Przepis | Co rozstrzyga |
|---|---|
| art. 491 § 1–2 | zwłoka w umowie wzajemnej: **dodatkowy termin z zagrożeniem odstąpienia**, po bezskutecznym upływie — odstąpienie; świadczenia podzielne |
| art. 492 | odstąpienie bez terminu dodatkowego: termin ściśle określony z zastrzeżonym prawem odstąpienia albo spełnienie po terminie bez znaczenia (cel umowy wiadomy drugiej stronie) |
| art. 494 | skutki: zwrot świadczeń, naprawienie szkody na zasadach ogólnych; zwrot konsumentowi niezwłocznie |
| art. 395 | umowne prawo odstąpienia w oznaczonym terminie; oświadczenie; umowa uważana za niezawartą |
| art. 635 | dzieło: opóźnienie czyniące nieprawdopodobnym terminowe ukończenie — odstąpienie bez terminu dodatkowego, przed terminem wykonania |
| art. 636 § 1 | dzieło wadliwe lub sprzeczne z umową: wezwanie do zmiany sposobu wykonania z terminem, potem odstąpienie albo wykonanie zastępcze |
| art. 644 | dzieło: odstąpienie zamawiającego w każdej chwili przed ukończeniem, z zapłatą wynagrodzenia (minus oszczędności) |
| art. 656 § 1 | roboty budowlane: do opóźnienia, wadliwego wykonania i odstąpienia przed ukończeniem — odpowiednio przepisy o dziele |
| art. 77 § 2 | odstąpienie od umowy zawartej w formie pisemnej, dokumentowej albo elektronicznej — co najmniej forma dokumentowa, chyba że ustawa lub umowa zastrzega inną |

Przed użyciem sprawdź w ELI `zmiany_po_tj`. Orzecznictwo (np. „odpowiedni” termin dodatkowy,
znaczenie celu umowy) — tylko przez `orzeczenia-sadowe-v2`.

---

## KROK 0 — WYBIERZ PODSTAWĘ

```
1. Konsument, umowa przez internet / telefon / poza lokalem, w terminie 14 (30) dni?
   → wariant K (art. 27 u.p.k.); sprawdź wyjątki art. 38 i początek biegu art. 28
2. Druga strona w zwłoce (umowa wzajemna)?
   a) termin ściśle określony z zastrzeżonym prawem odstąpienia albo spełnienie po
      terminie bez znaczenia → wariant Z-bez (art. 492)
   b) w pozostałych przypadkach → NAJPIERW wariant W (wezwanie z terminem dodatkowym,
      art. 491 § 1), potem wariant Z (oświadczenie po bezskutecznym upływie)
3. Umowa o dzieło / roboty budowlane:
   a) opóźnienie, terminowe ukończenie nieprawdopodobne → wariant D (art. 635, art. 656)
   b) wykonywanie wadliwe lub sprzeczne z umową → wariant W z art. 636 § 1, potem
      odstąpienie
   c) zamawiający rezygnuje bez winy wykonawcy → art. 644 (zapłata wynagrodzenia —
      uprzedź użytkownika o kosztach)
4. Umowa przewiduje prawo odstąpienia (art. 395) → termin i warunki z umowy
5. Wada towaru → SPO (art. 43e u.p.k. / art. 560 KC), nie ten schemat
```

---

## DANE WYMAGANE (intake — M2-intake.md + poniżej)

```
□ Strony: imię i nazwisko / firma, adresy (do doręczeń z umowy lub regulaminu)
□ Umowa: rodzaj, data zawarcia, numer zamówienia, sposób zawarcia (sklep internetowy,
  telefon, wizyta), przedmiot, cena
□ Data objęcia towaru w posiadanie (konsument, art. 28)
□ Termin wykonania z umowy; czy zastrzeżono prawo odstąpienia (cytat z umowy)
□ Przebieg zwłoki / wad: daty, wezwania, odpowiedzi (fakty z dokumentów)
□ Data doręczenia wezwania z terminem dodatkowym (przy wariancie Z)
□ Żądania: zwrot ceny / zaliczki (kwota z dokumentów), rachunek, odbiór towaru, szkoda
```

---

## WARIANT K (konsument — odstąpienie bez podania przyczyny)

```
[Miejscowość], [data]
[Konsument — imię i nazwisko, adres, e-mail]
[Przedsiębiorca — firma, adres]

OŚWIADCZENIE O ODSTĄPIENIU OD UMOWY

Na podstawie art. 27 ust. 1 ustawy z dnia 30 maja 2014 r. o prawach konsumenta
oświadczam, że odstępuję od umowy [sprzedaży / o świadczenie usługi] [przedmiot],
zamówienie nr [nr] z dnia [data], [towar odebrany dnia [data]].

Proszę o zwrot wszystkich dokonanych płatności, w tym kosztów dostarczenia, w terminie
14 dni od otrzymania oświadczenia (art. 32 ust. 1), tym samym sposobem zapłaty
[albo: na rachunek nr …, jeżeli przedsiębiorca na to przystał]. Towar [odeślę /
odesłałem dnia …] (art. 34 ust. 1).

[podpis — przy wysyłce e-mailem wystarczy imię i nazwisko]
```

Wysłanie przed upływem terminu wystarcza (art. 30 ust. 2) — zalecaj dowód nadania lub e-mail
z potwierdzeniem.

## WARIANT W (wezwanie z terminem dodatkowym — art. 491 § 1 KC; art. 636 § 1 KC)

```
WEZWANIE DO WYKONANIA UMOWY Z WYZNACZENIEM DODATKOWEGO TERMINU

Wobec zwłoki w wykonaniu umowy [rodzaj] z dnia [data] ([opis: termin wykonania upłynął
dnia …; nie wykonano …]) wyznaczam dodatkowy termin do [wykonania / zmiany sposobu
wykonania] do dnia [data] z zagrożeniem, że po jego bezskutecznym upływie odstąpię od
umowy [art. 491 § 1 KC / art. 636 § 1 KC].
```

Termin ma być „odpowiedni” do rodzaju świadczenia — podaj użytkownikowi kryteria, nie
przesądzaj długości bez orzecznictwa.

## WARIANT Z / Z-bez / D (oświadczenie o odstąpieniu — zwłoka, dzieło)

```
OŚWIADCZENIE O ODSTĄPIENIU OD UMOWY

Na podstawie [art. 491 § 1 / art. 492 / art. 635 / art. 636 § 1 / art. 395 § 1
Kodeksu cywilnego] oświadczam, że odstępuję od umowy [rodzaj] z dnia [data].

Uzasadnienie: [fakty: termin z umowy, zwłoka, data i treść wezwania z terminem
dodatkowym, jego bezskuteczny upływ / ściśle określony termin i zastrzeżone prawo
odstąpienia / stan prac wskazujący, że ukończenie w terminie jest nieprawdopodobne].

Na podstawie art. 494 § 1 KC wzywam do zwrotu [kwota z dokumentów — zaliczka / cena]
zł na rachunek nr [nr] w terminie [7 / 14] dni [oraz zastrzegam dochodzenie naprawienia
szkody]. [Zwracam / udostępniam do odbioru otrzymane świadczenie: …]
```

---

## PO WYSŁANIU

```
□ Dowód doręczenia (od niego zależy skuteczność; przy art. 30 u.p.k. — dowód wysłania)
□ Brak zwrotu → wezwanie do zapłaty (SPE), potem pozew (pisma-procesowe-v3)
```

## OPŁATY

Oświadczenia i wezwania są pozasądowe — bez opłaty sądowej.
