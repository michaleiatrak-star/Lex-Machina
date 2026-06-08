# mod-ustawa-prawa-konsumenta

**Źródło weryfikacji:** Ustawa o prawach konsumenta — Dz.U. 2023 poz. 2759 t.j. ze zm.
**Data weryfikacji online:** 2026-06-05
**ZASADA:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl
**Uwaga:** Moduł uzupełnia `mod-KC-konsumenckie` — skupia się na ustawie szczególnej.

---

## Zakres ustawy
Reguluje prawa konsumentów zawierających umowy z przedsiębiorcami, w szczególności:
- umowy zawierane na odległość (internet, telefon)
- umowy zawierane poza lokalem przedsiębiorcy
- obowiązki informacyjne przedsiębiorcy
- prawo odstąpienia od umowy

## Kluczowe przepisy — wskaźniki do ISAP

| Zagadnienie | Odesłanie do ustawy |
|---|---|
| Obowiązki informacyjne przedsiębiorcy | Rozdz. 2 ustawy — weryfikuj w ISAP |
| Prawo odstąpienia — termin i forma | art. 27–38 ustawy — weryfikuj w ISAP |
| Wyłączenia prawa odstąpienia | art. 38 ustawy — weryfikuj w ISAP |
| Rękojmia / niezgodność towaru | art. 43a–43g ustawy — weryfikuj w ISAP |
| Treści / usługi cyfrowe | art. 43h–43q ustawy — weryfikuj w ISAP |

## Weryfikacja online
```
web_search: "ustawa prawa konsumenta isap.sejm.gov.pl Dz.U. 2023 poz. 2759"
web_search: "prawo odstąpienia 14 dni umowa odległość art 27 ustawa prawa konsumenta"
```

## Łącz z
- `mod-KC-konsumenckie` — pełny framework (klauzule abuzywne, rękojmia, kredyt)
- `analizator-umow-v1` (moduł J8 — umowy B2C)
- `pisma-procesowe-v3` — pismo do przedsiębiorcy / pozew

## Źródła
- https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20230002759


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
