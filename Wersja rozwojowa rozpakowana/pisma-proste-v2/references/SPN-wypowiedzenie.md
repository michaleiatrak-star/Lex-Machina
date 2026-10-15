# SPN — Wypowiedzenie umowy (najem, dzierżawa, zlecenie, usługi, umowa bezterminowa)

*Ładuj gdy: użytkownik chce wypowiedzieć umowę cywilnoprawną jednostronnym oświadczeniem:
najem lokalu (mieszkalnego lub użytkowego), dzierżawę, zlecenie, umowę o świadczenie usług,
inną umowę o charakterze ciągłym zawartą na czas nieoznaczony.*

*Poza zakresem (przełącz):* umowa o pracę → `dr-04-prawo-pracy-zus-swiadczenia` (Kodeks pracy, inny
reżim formy i odwołania); spór o skuteczność wypowiedzenia, pozew o eksmisję, powództwo
z art. 11 ust. 10 u.o.p.l. → `pisma-procesowe-v3`; analiza postanowień umowy o wypowiedzeniu
(kary, terminy umowne, klauzule abuzywne) → najpierw `analizator-umow-v1`, potem ten schemat.

---

## PODSTAWA PRAWNA (odczyt ELI, RZĄD 1, 2026-10-14)

Kodeks cywilny — t.j. Dz. U. z 2026 r. poz. 795 (ELI DU/2026/795, stan na 19.05.2026):

| Przepis | Co rozstrzyga |
|---|---|
| art. 61 § 1–2 KC | chwila złożenia oświadczenia: gdy doszło do adresata tak, że mógł się zapoznać z treścią; w postaci elektronicznej — wprowadzenie do środka komunikacji elektronicznej |
| art. 77 § 2 KC | umowa zawarta w formie pisemnej, dokumentowej albo elektronicznej: wypowiedzenie wymaga co najmniej formy dokumentowej, chyba że ustawa lub umowa zastrzega inną formę |
| art. 77 § 3 KC | umowa w innej formie szczególnej (np. akt notarialny): wypowiedzenie „powinno być stwierdzone pismem” |
| art. 365¹ KC | zobowiązanie bezterminowe o charakterze ciągłym: wypowiedzenie z zachowaniem terminów umownych, ustawowych lub zwyczajowych, a w ich braku wygasa niezwłocznie po wypowiedzeniu |
| art. 673 § 1–2 KC | najem na czas nieoznaczony: terminy umowne, w ich braku ustawowe (czynsz miesięczny — na miesiąc naprzód na koniec miesiąca kalendarzowego; dłuższe okresy — na trzy miesiące naprzód na koniec kwartału; krótsze — trzy dni; najem dzienny — jeden dzień) |
| art. 673 § 3 KC | najem na czas oznaczony: wypowiedzenie tylko w wypadkach określonych w umowie |
| art. 682 KC | najemca lokalu: wady zagrażające zdrowiu — wypowiedzenie bez zachowania terminów |
| art. 687 KC | wynajmujący lokalu: zwłoka z czynszem za co najmniej dwa pełne okresy — przed wypowiedzeniem bez terminów uprzedzenie na piśmie z dodatkowym miesięcznym terminem do zapłaty |
| art. 688 KC | najem lokalu na czas nieoznaczony, czynsz miesięczny: najpóźniej na trzy miesiące naprzód na koniec miesiąca kalendarzowego |
| art. 704 KC | dzierżawa (w braku odmiennej umowy): grunt rolny — na rok naprzód na koniec roku dzierżawnego; inna — na sześć miesięcy przed upływem roku dzierżawnego |
| art. 746 § 1–3 KC | zlecenie: każda strona w każdym czasie; skutki finansowe przy braku ważnego powodu; nie można zrzec się z góry wypowiedzenia z ważnych powodów |
| art. 750 KC | umowy o świadczenie usług nieuregulowane innymi przepisami — odpowiednio przepisy o zleceniu (w tym art. 746) |

Ustawa z dnia 21 czerwca 2001 r. o ochronie praw lokatorów, mieszkaniowym zasobie gminy
i o zmianie Kodeksu cywilnego (u.o.p.l.) — t.j. Dz. U. z 2023 r. poz. 725 (ELI DU/2023/725):

| Przepis | Co rozstrzyga |
|---|---|
| art. 2 ust. 1 pkt 1, 2, 4 | „lokator”, „właściciel” (także wynajmujący), „lokal” (lokal mieszkalny; nie pomieszczenia krótkotrwałego pobytu) |
| art. 11 ust. 1 | wypowiedzenie przez właściciela przy odpłatnym używaniu lokalu tylko z przyczyn ustawowych; **pod rygorem nieważności na piśmie i z określeniem przyczyny** |
| art. 11 ust. 2 pkt 1–4 | przyczyny z terminem nie później niż na miesiąc naprzód, na koniec miesiąca kalendarzowego (m.in. pkt 2: zwłoka za co najmniej trzy pełne okresy płatności **po pisemnym uprzedzeniu o zamiarze wypowiedzenia i wyznaczeniu dodatkowego miesięcznego terminu**) |
| art. 11 ust. 3–5, 7 | niezamieszkiwanie ponad 12 miesięcy (6 miesięcy); tytuł do innego lokalu (miesiąc); zamiar zamieszkania właściciela (pół roku z lokalem zamiennym / 3 lata bez); osoba bliska — wskazanie jej pod rygorem nieważności |
| art. 11 ust. 12 | lokator powyżej 75 lat przy wypowiedzeniu z ust. 5 — szczególna skuteczność |

Przed każdym użyciem sprawdź w ELI, czy po t.j. nie ogłoszono zmian tych przepisów
(`isap_tekst` zwraca `zmiany_po_tj`). Brzmienie cytuj z ELI, nie z tego pliku.

**Kolizja reżimów (z brzmienia przepisów):** wypowiedzenie najmu **lokalu mieszkalnego przez
wynajmującego** ocenia się według art. 11 u.o.p.l. (ust. 1: „tylko z przyczyn określonych”),
a nie według art. 673 i 688 KC. Terminy z art. 673 i 688 KC stosuj do wypowiedzenia przez
**najemcę** lokalu mieszkalnego oraz do najmu lokalu użytkowego. Najem okazjonalny
i instytucjonalny (rozdział 2a u.o.p.l.) — odczytaj ich przepisy w ELI przed redakcją; nie
zakładaj, że stosuje się do nich art. 11.

**Orzecznictwo:** nie powołuj z pamięci. Gdy umowa skraca termin ustawowy (np. art. 688 KC) albo
strona kwestionuje „ważny powód” (art. 746 KC) — `orzeczenia-sadowe-v2` przed powołaniem.

---

## ZASADA 1 — PISMO JEDNOWĄTKOWE

Wypowiedzenie to jednostronne oświadczenie woli. Pismo obejmuje: oświadczenie, termin i dzień
rozwiązania, przyczynę (gdy wymagana), żądania towarzyszące (wydanie lokalu, rozliczenie kaucji,
zwrot rzeczy). Gdy użytkownik chce równocześnie dochodzić zapłaty zaległości sądownie, żąda
eksmisji albo druga strona już kwestionuje wypowiedzenie → `pisma-procesowe-v3`.

---

## KROK 0 — USTAL TRYB (przed redakcją, pytania zbiorcze M2)

```
1. Rodzaj umowy: najem lokalu mieszkalnego / najem lokalu użytkowego / dzierżawa /
   zlecenie / świadczenie usług / inna umowa ciągła (jaka?) / umowa o pracę → dr-04
2. Kto wypowiada: najemca, wynajmujący, zleceniodawca, zleceniobiorca, usługobiorca...
3. Czas trwania: nieoznaczony / oznaczony (do kiedy?) — przy oznaczonym: czy umowa
   wskazuje wypadki wypowiedzenia (art. 673 § 3 KC)? Jeśli nie → wypowiedzenie
   niedopuszczalne poza przepisami szczególnymi (art. 682, 687 KC; art. 11 u.o.p.l.);
   zaproponuj porozumienie stron
4. Postanowienia umowy o wypowiedzeniu: termin, forma, przyczyny, sposób doręczenia
   (umowa może zastrzec formę surowszą niż dokumentowa — art. 77 § 2 KC)
5. Okres płatności czynszu (miesięczny / inny) — wyznacza termin ustawowy
6. Przyczyna (obowiązkowa przy wypowiedzeniu przez wynajmującego lokalu mieszkalnego):
   która z art. 11 ust. 2–5 u.o.p.l.; przy zaległości — czy wysłano już pisemne
   uprzedzenie z miesięcznym terminem (jeśli nie → najpierw wariant U)
7. Planowany sposób i data doręczenia (list polecony za zwrotnym potwierdzeniem odbioru,
   doręczenie osobiste za pokwitowaniem, e-mail — tylko gdy forma dokumentowa wystarcza)
```

---

## TERMIN — OBLICZ I WSKAŻ NA POCZĄTKU ODPOWIEDZI (Zasada 4 M1)

Termin liczy się od dnia, w którym oświadczenie doszło do adresata (art. 61 KC), nie od daty
pisma ani nadania.

```
„na N miesięcy naprzód na koniec miesiąca kalendarzowego”:
  dzień rozwiązania = ostatni dzień miesiąca, w którym upływa N miesięcy od doręczenia,
  a gdy doręczenie nastąpiło w ostatnim dniu miesiąca — ostatni dzień N-tego miesiąca
  po nim.
  Przykład (art. 688 KC, N = 3): doręczenie 15.10 → 31.01; doręczenie 31.10 → 31.01;
  doręczenie 1.11 → koniec lutego.
Doręczenie po terminie przesuwa rozwiązanie o miesiąc — podaj użytkownikowi ostatni dzień
doręczenia dla wskazanej daty rozwiązania i zalecenie wysłania z zapasem.
```

W piśmie wskaż dzień rozwiązania jako skutek („z zachowaniem … terminu wypowiedzenia, tj. ze
skutkiem na dzień [data]”) i dodaj zastrzeżenie, że w razie doręczenia w terminie późniejszym
umowa ulega rozwiązaniu z upływem najbliższego terminu wypowiedzenia. Datę oznacz jako
wyliczoną z danych użytkownika (HYBRID-VAL: kwoty i daty z faktów, nie z modelu).

---

## FORMA

| Sytuacja | Minimalna forma |
|---|---|
| wynajmujący wypowiada najem lokalu mieszkalnego (art. 11 ust. 1 u.o.p.l.) | **pisemna pod rygorem nieważności** (własnoręczny podpis albo kwalifikowany podpis elektroniczny) + przyczyna |
| umowa w formie pisemnej / dokumentowej / elektronicznej (art. 77 § 2 KC) | dokumentowa, chyba że ustawa lub umowa zastrzega inną |
| umowa w innej formie szczególnej (art. 77 § 3 KC) | stwierdzenie pismem |
| umowa zastrzega formę (np. list polecony, pisemna) | forma z umowy |

Zalecenie praktyczne: zawsze pismo z podpisem i dowodem doręczenia; e-mail tylko jako
dodatkowy kanał, gdy forma dokumentowa wystarcza.

---

## DANE WYMAGANE (intake — M2-intake.md + poniżej)

```
□ Strona wypowiadająca: imię i nazwisko / firma, adres (KRS/NIP przy przedsiębiorcy)
□ Adresat: imię i nazwisko / firma, adres do doręczeń z umowy
□ Umowa: rodzaj, data zawarcia, ewentualny numer, przedmiot (adres lokalu, nr księgi
  wieczystej nie jest wymagany)
□ Czas trwania i postanowienia o wypowiedzeniu (cytat z umowy, jeśli dostarczona)
□ Okres płatności czynszu / wynagrodzenia
□ Przyczyna wypowiedzenia (obowiązkowa w reżimie art. 11 u.o.p.l.; przy zleceniu —
  wskazanie ważnego powodu ogranicza ryzyko odszkodowawcze art. 746 KC)
□ Data uprzedzenia i dodatkowego terminu (art. 687 KC, art. 11 ust. 2 pkt 2 u.o.p.l.)
□ Planowana data doręczenia → wyliczony dzień rozwiązania
□ Żądania towarzyszące: termin i sposób wydania lokalu / rzeczy, protokół
  zdawczo-odbiorczy, rozliczenie kaucji (numer rachunku), zwrot dokumentów, kluczy
```

---

## STRUKTURA PISMA — WARIANT P (podstawowy: wypowiedzenie z zachowaniem terminu)

```
[Miejscowość], [data]

[Strona wypowiadająca — imię i nazwisko / firma, adres]

[Adresat — imię i nazwisko / firma, adres]

Dotyczy: umowy [najmu lokalu / dzierżawy / zlecenia / o świadczenie usług] z dnia [data]
[nr …], [przedmiot: lokal przy ul. …]

WYPOWIEDZENIE UMOWY [NAJMU]

Działając na podstawie [art. 673 § 1 i 2 / art. 688 / art. 704 / art. 746 § 1 lub 2 /
art. 365¹ Kodeksu cywilnego] [oraz § … umowy], niniejszym wypowiadam umowę [rodzaj] z dnia
[data], z zachowaniem [umownego / ustawowego] [N-miesięcznego] terminu wypowiedzenia,
tj. ze skutkiem na dzień [data rozwiązania].

[Przyczyna — gdy wymagana albo celowa: „Przyczyną wypowiedzenia jest …”]

W razie doręczenia niniejszego pisma w terminie uniemożliwiającym rozwiązanie umowy we
wskazanym dniu, umowa ulega rozwiązaniu z upływem najbliższego terminu wypowiedzenia.

[Żądania towarzyszące — np. „Wnoszę o wydanie lokalu wraz z kluczami w dniu [data],
w stanie niepogorszonym ponad normalne zużycie, i podpisanie protokołu zdawczo-
odbiorczego. Kaucję proszę zwrócić na rachunek nr [nr] po rozliczeniu, w terminie
wynikającym z umowy.”]

[podpis własnoręczny]

Załączniki: [kopia umowy — opcjonalnie]
```

## WARIANT W-L (wynajmujący, lokal mieszkalny — art. 11 u.o.p.l.)

Jak wariant P, z różnicami (każda pod rygorem nieważności z art. 11 ust. 1 i 7 u.o.p.l.):

```
- podstawa: art. 11 ust. [2 pkt … / 3 pkt … / 4 / 5] ustawy z dnia 21 czerwca 2001 r.
  o ochronie praw lokatorów, mieszkaniowym zasobie gminy i o zmianie Kodeksu cywilnego
  (Dz. U. z [rok] r. poz. [nr] — z ELI);
- termin z przepisu, nie z art. 673/688 KC;
- przyczyna opisana konkretnie (fakty, daty, kwoty zaległości z dokumentów, odesłanie do
  pisemnego upomnienia / uprzedzenia z datą doręczenia);
- przy ust. 4–5 w zw. z ust. 7: imię i nazwisko osoby mającej zamieszkać;
- forma pisemna (podpis własnoręczny), e-mail nie wystarcza.
```

## WARIANT U (uprzedzenie przed wypowiedzeniem z powodu zaległości)

Osobne pismo przed wypowiedzeniem: art. 687 KC (lokal, dwa pełne okresy, wypowiedzenie bez
terminów) albo art. 11 ust. 2 pkt 2 u.o.p.l. (lokal mieszkalny, trzy pełne okresy, potem
wypowiedzenie na miesiąc naprzód na koniec miesiąca).

```
UPRZEDZENIE O ZAMIARZE WYPOWIEDZENIA UMOWY NAJMU

Uprzedzam, że z uwagi na zwłokę z zapłatą czynszu [i opłat] za okresy: [miesiące],
w łącznej kwocie [kwota z dokumentów] zł, zamierzam wypowiedzieć umowę najmu z dnia [data].
Wyznaczam dodatkowy, miesięczny termin do zapłaty zaległych [i bieżących] należności,
liczony od dnia doręczenia niniejszego pisma, na rachunek nr [nr].
```

## WARIANT N (bez zachowania terminu — art. 682 KC, najemca)

Wskaż wady lokalu i zagrożenie dla zdrowia (fakty, daty zgłoszeń, dowody: protokoły, opinie,
zdjęcia), skutek z chwilą doręczenia, termin wydania lokalu.

---

## PO WYSŁANIU

```
□ Zachowaj dowód doręczenia (zwrotne potwierdzenie odbioru, pokwitowanie) — od niego
  liczy się termin (art. 61 KC)
□ Adresat kwestionuje wypowiedzenie / nie wydaje lokalu → pisma-procesowe-v3
  (eksmisja, ustalenie, zapłata)
□ Zaległości po rozwiązaniu → SPE (wezwanie do zapłaty), potem pozew
```

## OPŁATY

Wypowiedzenie jest pismem pozasądowym — bez opłaty sądowej (M6 dopiero przy pozwie).
