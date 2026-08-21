# MOD-RED-TEAM-WLASNY — Red Team Własnych Tez (przed redakcją pisma)

*Ładuj: W1.6, po W1.5 (Braki krytyczne), przed checkpointem W1→W2*
*Wersja: 1.0 | Wprowadzono: v3.7*

> Różnica względem MOD-OBAL: MOD-OBAL obala twierdzenia STRONY PRZECIWNEJ
> (reaktywnie — riposta/odpowiedź na pismo, które już wpłynęło).
> MOD-RED-TEAM-WLASNY atakuje WŁASNE tezy użytkownika (proaktywnie — zanim
> pismo zostanie napisane), niezależnie od typu pisma (pozew, apelacja,
> wniosek, zawiadomienie).

> ⛔ Moduł obowiązkowy gdy pismo:
> - dotyczy więcej niż jednego podmiotu,
> - opiera się na ciągłości stosunku prawnego (np. zatrudnienia),
> - zawiera roszczenie pieniężne,
> - zawiera konstrukcję wymagającą subsumcji złożonej,
> - opiera się na dowodzie, który może mieć więcej niż jedno znaczenie.
> W pozostałych przypadkach (pisma proste — patrz Test B w KROK 0) moduł
> jest pomijany; pisma-proste-v2 nie wczytuje tego modułu.

---

## R1 — TEST NADINTERPRETACJI DOWODU (ETAP 2)

Dla każdego dowodu z mapy W1.3, który ma więcej niż jedno możliwe odczytanie:

```
DOWÓD: [nazwa / DOC-ID]
1. Co dowód wykazuje wprost?            [...]
2. Czego dowód NIE wykazuje?            [...]
3. Jak może go użyć przeciwnik?         [...]
4. Najbezpieczniejsza interpretacja:    [...]
5. Czy pierwotna teza wymaga osłabienia? TAK / NIE
```

Jeśli dowód ma >1 możliwą interpretację — ZAKAZ przyjęcia interpretacji
najkorzystniejszej bez zastrzeżenia. Stosuj wzorzec:

```
"Okoliczność ta sama w sobie nie przesądza, że [...], lecz w powiązaniu
z [...], przemawia za wnioskiem, że [...]."
```

Przykład (dane rejestrowe podmiotów, ⚠️POD):
- Zakazane: „Obie spółki mają ten sam KRS.”
- Bezpieczne: „W dokumentacji występuje pomieszanie danych rejestrowych
  obu spółek, co może świadczyć o braku faktycznego rozdzielenia ich
  funkcjonowania.”

---

## R2 — TEST PEŁNOMOCNIKA PRZECIWNEJ STRONY (proaktywny) (ETAP 3)

Dla każdej GŁÓWNEJ tezy z W1.2/W1.3 (nie dla tez pobocznych):

```
TEZA WŁASNA:                         [...]
NAJSILNIEJSZY ARGUMENT PRZECIWNIKA:  [...]
ARGUMENT REALNY?                     TAK / NIE / CZĘŚCIOWO
JAK GO NEUTRALIZOWAĆ:                [...]
CZY NALEŻY ZMIENIĆ BRZMIENIE TEZY?   TAK / NIE
```

Jeśli „TAK” w ostatnim polu → przepisz tezę w W1.2/W1.3 PRZED przejściem
dalej. Nie przechodź do R3 z tezą oznaczoną do zmiany i nieprzepisaną.

---

## R3 — TEST SĘDZIEGO (ETAP 4)

Dla każdej głównej tezy (po R2):

```
TEZA: [...]
1. Czy fakt jest udowodniony?                    TAK / NIE / CZĘŚCIOWO
2. Czy dowód jest wiarygodny?                     TAK / NIE
3. Czy dowód dotyczy przesłanki prawnej?          TAK / NIE
4. Czy istnieje sprzeczność z innym dowodem?      TAK / NIE
5. Czy teza jest konieczna dla rozstrzygnięcia?   TAK / NIE
6. Czy to tylko argument retoryczny?              TAK / NIE
```

- Pyt. 6 = TAK i pyt. 5 = NIE → teza retoryczna: SKRÓĆ do 1 zdania albo USUŃ.
- Pyt. 5 = TAK → teza konieczna: ROZBUDUJ w W2.

---

## R4 — WAŻENIE ROSZCZEŃ (ETAP 6)

Stosuj gdy pismo zawiera >1 roszczenie/żądanie. Dla każdego roszczenia
z `shared/ROSZCZENIA.md` przypisz siłę i wynikający z niej rejestr pisania
TEGO KONKRETNEGO fragmentu uzasadnienia (nie całego pisma — patrz różnica
względem MOD-WARIANTY-POZWU, który ustala styl dla całego pisma):

```
ROSZCZENIE: [...]
SIŁA:  A — mocne / B — średnie / C — ryzykowne / D — słabe (ewentualne)
REJESTR PISANIA:
  A → stanowczo, bez zastrzeżeń
  B → stanowczo, z antycypacją zarzutu (wczytaj R2 dla tego roszczenia)
  C → ostrożnie + wniosek dowodowy pomocniczy
  D → ewentualnie / poza petitum głównym — wymaga decyzji użytkownika
```

Roszczenia D nie wpisuj do petitum głównego bez wyraźnej zgody użytkownika
— zaznacz to w checkpointcie W1→W2 jako pytanie otwarte.

---

## R5 — TEST „CZY TO NIE SZKODZI?” (ETAP 7)

Filtr stosowany w W2, bezpośrednio przed wpisaniem KAŻDEGO argumentu
pobocznego (nie głównej tezy roszczenia) do uzasadnienia:

```
1. Czy argument pomaga w głównym roszczeniu?           TAK / NIE
2. Czy przeciwnik może go łatwo obalić?                TAK / NIE
3. Czy odciąga sąd od sedna?                           TAK / NIE
4. Czy tworzy niepotrzebną sprzeczność z inną tezą?     TAK / NIE
5. Czy podważa wiarygodność strony?                    TAK / NIE
```

- Prawdziwy, ale poboczny (pyt. 1=NIE) → SKRÓĆ.
- Ryzykowny (pyt. 2/4/5 = TAK) → przenieś do części pomocniczej albo USUŃ.

---

## R6 — KONSTRUKCJE ALTERNATYWNE / EWENTUALNE (ETAP 8)

Wzorzec obowiązkowy gdy teza główna może upaść:

```
"Nawet gdyby Sąd nie podzielił stanowiska [powoda/wnioskodawcy] co do [...],
to nadal [...], ponieważ [...]."
```

Stosuj OBOWIĄZKOWO (sprawdź przy każdym W1.3) gdy sprawa dotyczy:

```
☐ premii / świadczeń uznaniowych
☐ świadczeń regulaminowych
☐ praktyki zakładowej (zwyczaj jako źródło roszczenia)
☐ pozorności czynności prawnej lub obejścia prawa (art. 83 KC)
☐ ustalenia faktycznego pracodawcy (grupa kapitałowa, outsourcing personalny)
☐ nieważności porozumienia / czynności
☐ ustalenia istnienia stosunku pracy (art. 22 §1 KP / art. 25¹ KP)
```

Jeśli ≥1 pole zaznaczone — wygeneruj konstrukcję ewentualną PRZED W2 i wpisz
ją do mapy W1.3 jako odrębną pozycję żądania (żądanie ewentualne).

---

## RAPORT R — wynik modułu (wejście do W1.6 RED-TEAM, patrz SKILL.md)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RAPORT MOD-RED-TEAM-WLASNY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
R1 Dowody z >1 interpretacją:     [n] — osłabione: [n]
R2 Tezy główne testowane:         [n] — do przepisania: [n] 🔴
R3 Tezy retoryczne wykryte:       [n] — usunięte/skrócone: [n]
R4 Roszczenia wg siły:            A:[n] B:[n] C:[n] D:[n]
R5 Argumenty poboczne odrzucone:  [n]
R6 Konstrukcje ewentualne dodane: [n]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STATUS: ✅ GOTOWE DO W2 / 🔴 WYMAGA PRZEBUDOWY RAMY (wróć do W1.2-W1.3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Jeśli STATUS = 🔴 — NIE przechodź do checkpointu W1→W2. Wróć do W1.2/W1.3,
przepisz oznaczone tezy, powtórz R2/R3 dla przepisanych tez, dopiero potem
wygeneruj RAPORT R ponownie.
