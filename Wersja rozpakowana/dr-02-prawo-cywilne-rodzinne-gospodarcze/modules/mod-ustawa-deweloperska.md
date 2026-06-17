# mod-ustawa-deweloperska

**Źródło weryfikacji:** Ustawa deweloperska (ochrona nabywcy) — Dz.U. 2021 poz. 1177 ze zm.
**Data weryfikacji online:** 2026-06-05
**ZASADA:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl

---

## FAZA 0 — INTAKE

```
□ Czy deweloper posiada mieszkaniowy rachunek powierniczy (MRP)?
□ Jaki typ rachunku: zamknięty (bezpieczniejszy) czy otwarty z gwarancją?
□ Czy sporządzono prospekt informacyjny?
□ Jaki etap: umowa deweloperska / odbiór / przeniesienie własności?
□ Czy są wady lokalu? → termin i procedura zgłoszenia
□ Czy deweloper opóźnia wydanie lokalu lub przeniesienie własności?
□ Data zawarcia umowy (ustawa nowa = od 01.07.2022 lub stara)?
```

---

## KLUCZOWE OBOWIĄZKI DEWELOPERA

> ⚠️ Weryfikuj aktualne przepisy ustawy w ISAP — nowa ustawa deweloperska obowiązuje od 01.07.2022.

```
□ Mieszkaniowy rachunek powierniczy (MRP) — obowiązkowy dla nowych inwestycji
□ Prospekt informacyjny — przed zawarciem umowy
□ Forma aktu notarialnego — umowa deweloperska i umowa przeniesienia własności
□ Deweloperski Fundusz Gwarancyjny — ochrona nabywcy przy upadłości dewelopera
```

---

## WADY LOKALU — ŚCIEŻKA

```
Odbiór lokalu → protokół odbioru (sporządzić na piśmie!)
  → wpisać wszystkie wady do protokołu
  ↓
Deweloper: 30 dni na usunięcie wad od podpisania protokołu
  ↓ brak usunięcia
Nabywca: wyznacza dodatkowy termin ALBO
         odmawia odbioru (wada istotna) ALBO
         żąda obniżenia ceny
         
⚠️ Terminy i procedury — weryfikuj aktualne przepisy ustawy w ISAP.
```

---

## WERYFIKACJA ONLINE

```
web_search: "ustawa deweloperska ochrona nabywcy isap.sejm.gov.pl Dz.U. 2021 poz. 1177"
web_search: "mieszkaniowy rachunek powierniczy MRP deweloper obowiązki 2022"
web_search: "Deweloperski Fundusz Gwarancyjny UOKiK nabywca upadłość"
web_search: "wady lokalu protokół odbioru deweloper termin orzecznictwo"
```

---

## ŁĄCZ Z

| Sytuacja | Skill / Moduł |
|---|---|
| Analiza umowy deweloperskiej | `analizator-umow-v1` (moduł J2 — nieruchomości) |
| Pismo: reklamacja, wezwanie | `pisma-procesowe-v3` |
| Własność lokali | `mod-ustawa-spoldzielnie-wlasnosc-lokali` |

---

## ŹRÓDŁA ONLINE

- Ustawa deweloperska: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20210001177
- UOKiK (DFG): https://uokik.gov.pl


---

## QUALITY GATE

- [ ] Aktualny tekst t.j. aktu zweryfikowany w ISAP?
- [ ] Stan prawny właściwy temporalnie (na dzień zdarzenia i na dzień orzekania)?
- [ ] Każda przesłanka ma przypisany dowód?
- [ ] Termin nie upłynął?
- [ ] Właściwy organ / sąd wskazany?
- [ ] Ryzyka formalne i dowodowe ocenione?
- [ ] Brzmienie przepisów pobrane ze źródeł, nie z pamięci modelu?

## OUTPUT

Wynik pracy modułu:
1. Stan faktyczny;
2. Stan prawny i źródła (Dz.U. z ISAP);
3. Kwalifikacja trybu i właściwość;
4. Terminy (obliczone, z datami granicznymi);
5. Przesłanki (spełnione / wątpliwe / niespełnione);
6. Matryca dowodowa (teza → dowód → siła → luka);
7. Zarzuty i kontrargumenty;
8. Analiza ryzyk;
9. Strategia (wariant podstawowy + ewentualny);
10. Rekomendacja + kolejne kroki;
11. Kontrola ISAP/temporalności.
