# mod-ustawa-UZNK-nieuczciwa-konkurencja

**Akt:** ustawa z 16.04.1993 r. o zwalczaniu nieuczciwej konkurencji (UZNK) — t.j. Dz.U. 2026 poz. 85.
**Brzmienie:** przed powołaniem pobierz z ELI (RZĄD 1): `isap_tekst` albo odczyt `https://api.sejm.gov.pl/eli/acts/DU/2026/85/text.pdf` kanałem hosta; zmiany po t.j. — ELI, pole „Akty zmieniające”.
**Ten moduł wskazuje przepis i jego funkcję (kwalifikator), nie zastępuje brzmienia.** Kwalifikatory sprawdzone z t.j. w ELI 2026-11-13.

---

## FAZA 0 — INTAKE

```
□ Jaki czyn: oznaczenie / naśladownictwo / tajemnica / pomawianie / reklama /
  utrudnianie dostępu do rynku / sprzedaż premiowana lub lawinowa / BIG / terminy zapłaty / platforma?
□ Strony: przedsiębiorcy (art. 1–2)? Kto ma legitymację (art. 18, 19)?
□ Cel procesowy: zaniechanie, usunięcie skutków, oświadczenie, szkoda, korzyści, zabezpieczenie?
□ Daty każdego naruszenia (art. 20 — bieg osobno dla każdego).
□ Czy jest wątek karny (art. 23–27) — wniosek/żądanie pokrzywdzonego?
```

---

## KATALOG CZYNÓW (Rozdział 2)

| Przepis | Kwalifikator | Powiązania / pułapki |
|---|---|---|
| art. 3 ust. 1 | klauzula generalna (sprzeczność z prawem lub dobrymi obyczajami + zagrożenie/naruszenie interesu) | ust. 2 — katalog przykładowy; stosuj, gdy czyn nie mieści się w art. 5–17h |
| art. 5 | oznaczenie przedsiębiorstwa mylące co do tożsamości (wcześniejsze, zgodne z prawem używanie) | pierwszeństwo używania; wyłączone z art. 19 ust. 1 |
| art. 6 | kolizja przy oznaczeniu nazwiskiem przedsiębiorcy | sąd nakazuje środki temu, kto zaczął później |
| art. 7 | oznaczenie po likwidacji, podziale, przekształceniu | sąd ustala oznaczenia (podziały spółek — KSH) |
| art. 8 | fałszywe/oszukańcze oznaczenie geograficzne | węższe niż art. 10 |
| art. 9 | chronione oznaczenia geograficzne i nazwy pochodzenia | ust. 2: dopisek „rodzaj”, „typ”, „metoda” nie wyłącza czynu |
| art. 10 | oznaczenie towaru/usługi (lub jego brak) mylące co do cech; zatajenie ryzyka | ust. 2: opakowanie — chyba że uzasadnione technicznie; karny odpowiednik art. 25 |
| art. 11 | tajemnica przedsiębiorstwa (ujawnienie, wykorzystanie, pozyskanie) | definicja i wyjątki w samym art. 11; roszczenia szczególne art. 18 ust. 3–5; karny art. 23 |
| art. 12 | nakłanianie pracownika/wykonawcy (ust. 1) lub klienta (ust. 2) do niewykonania lub rozwiązania umowy | ust. 3: wyłączenie dla związków zawodowych w sporze zbiorowym |
| art. 13 | naśladownictwo zewnętrznej postaci produktu technicznymi środkami reprodukcji | ust. 2: cechy funkcjonalne dozwolone, ale obowiązek oznaczenia; karny art. 24 |
| art. 14 | pomawianie lub nieuczciwe zachwalanie (własne lub cudze przedsiębiorstwo) | ust. 2–3 katalog (tytuły, atesty, badania, wyróżnienia); wyłączone z art. 19 ust. 1; karny art. 26 |
| art. 15 | utrudnianie dostępu do rynku | ust. 1 katalog otwarty (m.in. sprzedaż poniżej kosztów, bojkot, zróżnicowane traktowanie) |
| art. 15a | przekupstwo osoby pełniącej funkcję publiczną | wyłączone z art. 19 ust. 1 |
| art. 15b | urządzenia niedozwolone (dostęp warunkowy) — także posiadanie, instalacja, serwis | |
| art. 15c | naruszenie zakazu praktyk ograniczających konkurencję (uokik art. 6, 9; TFUE art. 101, 102) | przepis odsyłający: droga cywilna obok UOKiK; szkoda — ustawa z 21.04.2017 (art. 18 ust. 1a, art. 20 ust. 3) |
| art. 16 | reklama — katalog otwarty | ust. 3 reklama porównawcza; reklama wobec dzieci — `mod-reklama-wobec-nieletnich` |
| art. 17 | odpowiedzialność agencji reklamowej / twórcy reklamy za czyn z art. 16 | poszerza krąg pozwanych |
| art. 17a | sprzedaż konsumentom z nieodpłatną premią | ust. 2: wyjątki (niewielka wartość, próbki, loterie promocyjne, konkursy); karny art. 25 ust. 2 |
| art. 17c | system sprzedaży lawinowej | ust. 2: warunki dopuszczalności (cena rynkowa, odkup ≥90% w 6 mies.); karny art. 24a |
| art. 17d | sieci dyskontowe — marki własne ponad próg obrotów | próg w przepisie |
| art. 17f | BIG: wierzyciel (ust. 1) i biuro (ust. 2) | ustawa z 9.04.2010 o udostępnianiu informacji gospodarczych |
| art. 17g | nieuzasadnione wydłużanie terminów zapłaty | katalog otwarty; `mod-transakcje-handlowe-opoznienia` |
| art. 17h | platformy i wyszukiwarki — naruszenie rozp. (UE) 2019/1150 | legitymacja szczególna art. 19 ust. 3; wyłączone z art. 19 ust. 1 |
| art. 17b, 17e, 21, 24b | uchylone | nie powołuj |

---

## ROSZCZENIA I PROCES (Rozdział 3)

| Przepis | Kwalifikator | Uwagi praktyczne |
|---|---|---|
| art. 18 ust. 1 pkt 1–6 | zaniechanie, usunięcie skutków, oświadczenie, szkoda, korzyści, suma na cel społeczny | pkt 4–5 „na zasadach ogólnych” (KC); pkt 6 tylko przy czynie zawinionym |
| art. 18 ust. 1a | szkoda z naruszenia prawa konkurencji → ustawa z 21.04.2017 | nie pkt 4 |
| art. 18 ust. 2 | orzeczenie o wyrobach, opakowaniach, materiałach (np. zniszczenie) | na wniosek uprawnionego |
| art. 18 ust. 3–5 | tajemnica przedsiębiorstwa: publikacja wyroku, wynagrodzenie zamiast zakazu, ryczałt licencyjny | ust. 4 — przesłanki kumulatywne |
| art. 18a | odwrócony ciężar dowodu prawdziwości oznaczeń i reklamy | przy czynach „wprowadzenia w błąd” (art. 10, 14, 16) |
| art. 19 | legitymacja organizacji przedsiębiorców do roszczeń z art. 18 ust. 1 pkt 1–3 i 6 | ust. 1 pkt 1, 3, 4 uchylone; ust. 2 wyłączenia; ust. 3 (art. 17h) i lista ministra art. 19a–19e |
| art. 20 | przedawnienie | ust. 1: 3 lata, osobno dla każdego naruszenia; ust. 2: szkoda → art. 442¹ KC; ust. 3: prawo konkurencji; ust. 4: tajemnica + przestępstwo |
| art. 22 | oczywiście bezzasadne powództwo — oświadczenie i szkoda pozwanego | instrument obrony pozwanego |

Zabezpieczenie roszczeń: KPC art. 730 i n. (brzmienie z ELI); wykonanie — `mod-KPC-egzekucja-windykacja`.

---

## PRZEPISY KARNE (Rozdział 4) — kwalifikator

| Przepis | Typ | Zagrożenie | Znamiona kluczowe |
|---|---|---|---|
| art. 23 ust. 1–3 | przestępstwo | grzywna, ograniczenie wolności, pozbawienie wolności do 2 lat | ust. 1: obowiązek wobec przedsiębiorcy + poważna szkoda; ust. 2: bezprawne uzyskanie; ust. 3: wiedza z niejawnego postępowania |
| art. 24 | przestępstwo | jak art. 23 | kopiowanie postaci produktu + poważna szkoda |
| art. 24a | przestępstwo | pozbawienie wolności od 6 mies. do 8 lat | organizowanie lub kierowanie systemem lawinowym |
| art. 25 ust. 1–2 | wykroczenie | areszt albo grzywna | mylące oznaczenie + narażenie klientów na szkodę; ust. 2: reklama, art. 17a |
| art. 26 ust. 1–2 | wykroczenie | areszt albo grzywna | ust. 1: o cudzym przedsiębiorstwie w celu szkodzenia; ust. 2: o swoim, w celu korzyści |
| art. 27 | tryb | — | przestępstwa: na wniosek; wykroczenia: na żądanie pokrzywdzonego; ust. 2: organizacje z art. 19 ust. 1 — tylko art. 25 |

Kwalifikacja i proces karny: DR-03.

---

## WORKFLOW

1. Przyporządkuj fakty do czynu z katalogu; gdy brak — art. 3 ust. 1.
2. Pobierz z ELI brzmienie przepisu czynu, art. 18, 20 (i 19, gdy powodem jest organizacja).
3. Ustal datę każdego naruszenia → art. 20.
4. Dobierz roszczenia z art. 18 ust. 1 do celu klienta; przy tajemnicy — ust. 3–5.
5. Rozważ zabezpieczenie i art. 18a (ciężar dowodu).
6. Wątek karny: art. 23–27 + DR-03.

---

## ŁĄCZ Z

| Sytuacja | Skill / Moduł |
|---|---|
| Umowa (zakaz konkurencji, NDA) | `analizator-umow-v1` |
| Pozew / wniosek o zabezpieczenie | `pisma-procesowe-v3` |
| Własność intelektualna, znaki towarowe | `dr-11` |
| Praktyki ograniczające konkurencję | `mod-ustawa-UOKIK-antymonopolowe` |
| Orzecznictwo | `orzeczenia-sadowe-v2` |

---

## QUALITY GATE

- [ ] Brzmienie każdego powołanego przepisu pobrane z ELI (nie z kwalifikatora)?
- [ ] Stan prawny na dzień czynu i na dzień orzekania?
- [ ] Legitymacja (art. 18 / 19) i wyłączenia art. 19 ust. 2?
- [ ] Przedawnienie liczone osobno dla każdego naruszenia?
- [ ] Każda przesłanka ma dowód; art. 18a uwzględniony?

## OUTPUT

1. Stan faktyczny; 2. Kwalifikacja czynu (przepis + brzmienie z ELI); 3. Legitymacja i roszczenia;
4. Terminy (art. 20, daty graniczne); 5. Dowody i ciężar dowodu; 6. Ryzyka (art. 22); 7. Strategia i kolejne kroki.
