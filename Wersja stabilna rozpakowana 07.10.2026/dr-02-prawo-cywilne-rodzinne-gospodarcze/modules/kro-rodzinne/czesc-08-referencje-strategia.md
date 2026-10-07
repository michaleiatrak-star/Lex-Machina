# KRO — część 8: weryfikacja, powiązania, quality gate, strategia

> Część modułu `mod-KRO-rodzinne.md` (podział 2026-08-20, naprawa F-78 —
> plik źródłowy przekroczył 1600 linii). Pełny indeks i zasady użycia:
> zobacz plik nadrzędny w katalogu `modules/`. To NIE jest samodzielny
> skill — ładowany WYŁĄCZNIE przez indeks nadrzędny na żądanie konkretnej
> części.

---

## WERYFIKACJA ONLINE

```
web_search: "KRO Kodeks rodzinny opiekuńczy isap.sejm.gov.pl Dz.U. 2026 poz. 236"
web_search: "rozwód przesłanki wina orzecznictwo SN sn.pl"
web_search: "alimenty zmiana stosunków art 138 KRO orzecznictwo"
web_search: "podział majątku wspólnego art 31 KRO składniki orzecznictwo SN"
web_search: "mediacja rozwodowa art 436 445(2) KPC isap.sejm.gov.pl"
web_search: "ustawa o opiniodawczych zespołach sądowych specjalistów tekst jednolity isap"
web_search: "art 233 KPC ocena wiarygodności świadka orzecznictwo SN"
web_search: "art 233 KK fałszywe zeznania orzecznictwo"
web_search: "rozwód rejestrowy USC weto Prezydenta status" (VER 2026-07-13: projekt zawetowany 30.04.2026 — sprawdzać wyłącznie czy pojawiła się NOWA inicjatywa, nie tę samą ustawę)
```

---


---

## ŁĄCZ Z

| Sytuacja | Skill / Moduł |
|---|---|
| Pismo: pozew o rozwód, o alimenty | `pisma-procesowe-v3` |
| Orzecznictwo SN rodzinne | `orzeczenia-sadowe-v2` |
| Analiza szans w sądzie | `analiza-sadowa-v6` |
| Analiza dokumentów majątkowych | `analizator-dowodow-v3` |
| Chronologia zdarzeń (np. rozkład pożycia) | `chronologia-sprawy-v1` |
| Techniki ataku na wiarygodność świadka (SW-A1..SW-A8) + obrona ante-cross (AC1-AC4) — KANONICZNE | `shared/MOD-ATAK-NA-SWIADKA.md` |
| Przygotowanie pytań / cross-examination świadka | `przesluchanie-swiadkow-v2-min90` |
| Ustalenie kręgu dziedzin sprawy mieszanej (np. rozwód + wątek karny gróźb) | `analizator-dowodow-v3` (MX: 25 dziedzin) |
| Zawarcie małżeństwa, przeszkody małżeńskie, bigamia, uznanie małżeństwa zagranicznego/jednopłciowego (dodane 2026-07-19) | `mod-KRO-zawarcie-malzenstwa-bigamia-transgraniczne.md` (ten sam DR-02) |

---


---

## ŹRÓDŁA ONLINE

- KRO: https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260000236
- SN (orzeczenia cywilne): https://www.sn.pl
- Orzeczenia sądów powszechnych: https://orzeczenia.ms.gov.pl

---


---

## QUALITY GATE

- [ ] Aktualny tekst t.j. aktu zweryfikowany w ISAP?
- [ ] Stan prawny właściwy temporalnie (na dzień zdarzenia i na dzień orzekania)?
- [ ] Każda przesłanka ma przypisany dowód?
- [ ] Termin nie upłynął?
- [ ] Właściwy organ / sąd wskazany?
- [ ] Ryzyka formalne i dowodowe ocenione?
- [ ] Brzmienie przepisów pobrane ze źródeł, nie z pamięci modelu?


---

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

---


---

## STRATEGIA

### Perspektywa powoda (strony inicjującej)

1. Ustal tryb postępowania (procesowy vs nieprocesowy) — błąd trybu = odrzucenie pisma.
2. Złóż wniosek o zabezpieczenie alimentów RAZEM z pozwem o rozwód / alimenty (sąd może orzec przed wysłuchaniem pozwanego — art. 753 KPC).
3. Jeśli jest kwestia winy w rozkładzie pożycia — zgromadź dowody przed złożeniem pozwu (wiadomości, zeznania świadków, nagrania).
4. W sprawach o kontakty / władzę rodzicielską: postaw dobro dziecka jako oś argumentacji (art. 56 §2, art. 95 KRO).

### Perspektywa pozwanego

1. Zakwestionuj trwałość rozkładu pożycia jeśli możliwe.
2. Wniosek o zaniechanie orzekania o winie (jeśli obu stronom zależy na szybkim rozwodzie bez kosztów).
3. Zgłoś wniosek o OZSS (Opiniodawczy Zespół Specjalistów Sądowych) jeśli sporna jest kwestia władzy rodzicielskiej lub kontaktów — zob. sekcję "OPINIA OZSS — ROZSZERZONE".
4. Rozważ wniosek o skierowanie do mediacji (art. 436 §1 KPC) — zwłaszcza gdy spór dotyczy głównie kwestii majątkowych/opiekuńczych, a nie samego faktu rozstania — zob. sekcję "MEDIACJA W SPRAWACH ROZWODOWYCH".
5. Przy świadkach strony przeciwnej: wywołaj `shared/MOD-ATAK-NA-SWIADKA.md` (SW-DETECT → profil → wektory ataku) i sekcję "ŚWIADKOWIE W SPRAWACH ROZWODOWYCH" tego modułu dla specyfiki dziedzinowej.

### Kontrargumenty / ryzyka

| Ryzyko | Opis | Działanie zaradcze |
|---|---|---|
| Brak dowodów winy | Twierdzenia nieudowodnione | Dokumenty, świadkowie, e-maile, nagrania |
| Negatywna opinia OZSS | Biegły niekorzystny dla strony | Wniosek o uzupełnienie / inny biegły — zob. "OPINIA OZSS — ROZSZERZONE" |
| Przewlekłość | Sprawy rodzinne trwają długo | Wniosek o zabezpieczenie na czas trwania (art. 753 KPC); rozważ mediację dla kwestii ugodowych |
| Ukrycie majątku przez dru. stronę | Zaniżenie majątku wspólnego | Wniosek o wyjawienie majątku (art. 913 KPC) |
| Upływ terminu na zaprzeczenie ojcostwa | Termin zawity — niemożność przywrócenia | Prokurator (art. 86 KRO) jako ścieżka pomocnicza |
| Stronniczy/niewiarygodny świadek strony przeciwnej | Świadek rodzinny/bliski, wiedza "ze słyszenia" | `shared/MOD-ATAK-NA-SWIADKA.md` (SW-A1/SW-A3) + sekcja ŚWIADKOWIE (S1-S4) tego modułu; formuła zarzutu wg art. 233 §1 KPC (S2) |
| Podejrzenie fałszywych zeznań świadka | Zeznanie sprzeczne z dowodami | Rozważ S3 — metodyczne podważenie wiarygodności (S2) często skuteczniejsze procesowo niż zawiadomienie z art. 233 KK |
| Eskalacja konfliktu utrudnia porozumienie ws. dzieci | Wysoki poziom emocji, alienacja rodzicielska | Wczesny wniosek o mediację (art. 436 §1 KPC) — zob. T5 i sekcję MEDIACJA |
