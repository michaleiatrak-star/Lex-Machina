---
module: ustawa-oplaty-w-sprawach-karnych
version: "1.0"
verified_on: "2026-08-27"
coverage: "B+ — pełna mapa art. 1–23, rdzeń stawek i środków"
source_policy: "RZĄD 1 only"
---

# Ustawa o opłatach w sprawach karnych

## 1. Źródło

Ustawa z 23 czerwca 1973 r. o opłatach w sprawach karnych.
Aktualny tekst jednolity zweryfikowany 27.08.2026: **Dz.U. 2023 poz. 123**,
status ELI: obowiązujący.

- ELI: https://eli.gov.pl/eli/DU/2023/123/ogl {RZĄD: 1}
- tekst urzędowy HTML:
  https://eli.gov.pl/api/acts/DU/2023/123/text.html {RZĄD: 1}

Tekst jednolity uwzględnia m.in. zmianę z Dz.U. 2022 poz. 2600, która dla
art. 2 weszła w życie 14.03.2023. Wyszukiwanie ELI 27.08.2026 nie ujawniło
późniejszej odrębnej nowelizacji tej ustawy.

**HARD GATE:** każdą stawkę i podstawę ponownie odczytaj z ELI przed
zastosowaniem w sprawie. Nie utożsamiaj tej ustawy z KSCU (koszty cywilne),
KPK (koszty procesu) ani rozporządzeniami o wydatkach.

## 2. Mapa art. 1–23

| Blok | Zakres | Status |
|---|---|---|
| art. 1 | zasada opłat na rzecz Skarbu Państwa | 🟢 |
| art. 2–7 | opłaty w I instancji według rodzaju kary / rozstrzygnięcia | 🟢 |
| art. 8–12 | opłaty w postępowaniu odwoławczym | 🟢 |
| art. 13–14 | oskarżyciel posiłkowy/prywatny i wyłączenie instytucji | 🟢 |
| art. 15 | opłaty od wniosków i próśb | 🟢 |
| art. 16–18 | określenie, zwolnienie i zażalenie | 🟢 |
| art. 19 | opłata kancelaryjna | 🟢 |
| art. 20 | przedawnienie ściągnięcia/zwrotu | 🟢 |
| art. 21 | KKS, wykroczenia i sprawy wojskowe | 🟢 |
| art. 22–23 | uchylone | ⚪ |

## 3. Pierwsza instancja — art. 2–7

### Art. 2 — kara pozbawienia wolności

> ⛔⛔ **PUŁAPKA DWÓCH BRZMIEŃ OBOK SIEBIE — dopisana 2026-09-12.**
> Tekst jednolity `Dz.U. 2023 poz. 123` zawiera **dwa warianty art. 2 ust. 1
> pkt 6**, rozróżnione wyłącznie odnośnikami:
>
> | Odnośnik | Brzmienie | Status |
> |---|---|---|
> | 2) | „do 15 lat **albo 25 lat** – 600 zł" | „obowiązuje **do wejścia w życie** zmiany z odnośnika 3" |
> | 3) | „do 15 lat – 600 zł" (+ dodany pkt 7: powyżej 15 lat – 1000 zł, odnośnik 4) | ustalone ustawą z 7.07.2022 (`Dz.U. 2022 poz. 2600`), w życie **14.03.2023** |
>
> **Obowiązuje wariant z odnośnika 3.** Odczyt tekstu jednolitego bez przypisów
> daje brzmienie wygasłe, w którym **nie ma progu „powyżej 15 lat"**.
> To ta sama klasa usterki co art. 13 ust. 2 KSCU (cap 100 000 zł obok
> wygasłego 200 000 zł) — patrz `shared/TABELE-OPLAT.md` sekcje 1 i 5.
> Reprodukcja: `curl -s api.sejm.gov.pl/eli/acts/DU/2023/123/text.pdf | pdftotext -layout - - | sed -n '/Art. 2. 1./,/Art. 3./p'`.

✅ [VER] RZĄD 1 2026-09-12 — odczyt treści; wykaz aktów zmieniających akt bazowy
(`DU/1973/152/references`) potwierdza **zero nowelizacji po tekście jednolitym**.

Aktualne stawki po wejściu w życie zmiany z 14.03.2023:

| Kara | Opłata |
|---|---:|
| do 3 miesięcy | 60 zł (art. 2 ust. 1 pkt 1) |
| do 6 miesięcy | 120 zł (art. 2 ust. 1 pkt 2) |
| do 1 roku | 180 zł (art. 2 ust. 1 pkt 3) |
| do 2 lat | 300 zł (art. 2 ust. 1 pkt 4) |
| do 5 lat | 400 zł (art. 2 ust. 1 pkt 5) |
| do 15 lat | 600 zł (art. 2 ust. 1 pkt 6, brzmienie z odnośnika 3) |
| powyżej 15 lat | 1000 zł (art. 2 ust. 1 pkt 7, dodany tą samą nowelizacją) |

Kara **ograniczenia wolności** — stawki z pkt 1–4 **odpowiednio** (art. 2 ust. 2).
✅ [VER] RZĄD 1 2026-09-16e — podstawy w wierszach dopisane po T32 (`Dz.U. 2023 poz. 123`).

Art. 2 ust. 2 odsyła odpowiednio do progów pkt 1–4 przy karze ograniczenia
wolności. Przed użyciem sprawdź aktualny tekst i kwalifikację kary.

### Art. 3 — grzywna

- grzywna jako kara w I instancji: 10% kwoty grzywny, minimum 30 zł;
- grzywna obok kary pozbawienia wolności: 20% kwoty grzywny;
- art. 3 ust. 2 zawiera odrębną regułę dla grzywny wskazanej w tym przepisie.

### Art. 4–7

- art. 4 — uchylony;
- art. 5 — 30 zł w ustawowo wskazanych przypadkach odstąpienia od kary;
- art. 6 — przy karze łącznej opłatę wymierza się od tej kary; przy wyroku
  łącznym nie pobiera się od niej odrębnej opłaty;
- art. 7 — przy warunkowym umorzeniu: 60–100 zł.

## 4. Postępowanie odwoławcze — art. 8–12

- art. 8: przy nieuwzględnieniu apelacji na korzyść oskarżonego skierowanej
  przeciwko winie lub karze zasadniczej opłata odpowiada regule I instancji
  dla zaskarżonej kary;
- art. 9: nie pobiera się opłaty przy nieuwzględnieniu apelacji wniesionej
  wyłącznie przez oskarżyciela publicznego albo przy nieuwzględnieniu kasacji;
- art. 10: gdy sąd odwoławczy zmienia rodzaj/wymiar kary lub skazuje dopiero
  w II instancji, wymierza jedną opłatę za obie instancje według kary przez
  siebie orzeczonej;
- art. 11: jeśli apelacja oskarżonego nie dotyczy winy ani kary zasadniczej,
  przy jej nieuwzględnieniu opłata wynosi 30 zł;
- art. 12: reguły art. 8–11 stosuje się odpowiednio do środka odwoławczego
  od orzeczenia o warunkowym umorzeniu.

## 5. Oskarżyciel posiłkowy i prywatny — art. 13–14

Art. 13 przewiduje opłatę 60–240 zł w ustawowo opisanych przypadkach
uniewinnienia albo nieuwzględnienia środka odwoławczego oskarżyciela
posiłkowego/prywatnego. Przepis zawiera wyjątek i możliwość obniżenia lub
odstąpienia w określonych sytuacjach — czytaj cały art. 13.

Art. 14: instytucje państwowe i społeczne występujące jako oskarżyciel
posiłkowy lub prywatny nie ponoszą opłat.

## 6. Wnioski i prośby — art. 15

| Wniosek / prośba | Opłata |
|---|---:|
| odroczenie wykonania kary pozbawienia/ograniczenia wolności | 80 zł |
| przerwa w odbywaniu kary pozbawienia wolności / aresztu | 60 zł |
| warunkowe przedterminowe zwolnienie | 45 zł |
| zwolnienie z reszty kary ograniczenia wolności / środka karnego | 45 zł |
| ponowny wniosek o raty grzywny | 2% kwoty objętej wnioskiem, min. 25 zł |
| warunkowe zawieszenie wykonania odroczonej kary pozbawienia wolności | 100 zł |
| wniosek z art. 155 §1 KKW wskazany w ustawie | 100 zł |
| zatarcie skazania | 45 zł |
| ponowna prośba o ułaskawienie | 45 zł |
| wznowienie postępowania | 150 zł |

Opłaty uiszcza się wraz z wnioskiem/prośbą i dołącza dowód wpłaty.
Przy wznowieniu ustawa przewiduje zwrot opłaty w sytuacji wskazanej w art. 15
ust. 2. Organy wskazane w ust. 3 są zwolnione z obowiązku uiszczenia.

## 7. Określenie opłaty, zwolnienie, środek — art. 16–18

- art. 16: co do zasady wysokość opłaty określa sąd w orzeczeniu kończącym;
  przepis reguluje też brak lub błędne określenie opłaty;
- art. 17: do zwolnienia od opłat stosuje się odpowiednio przepisy o zwolnieniu
  od kosztów postępowania karnego; dla art. 15 decyzja zapada przed
  rozpoznaniem wniosku/prośby;
- art. 18: na orzeczenie w przedmiocie opłat przysługuje zażalenie, jeżeli
  nie wniesiono apelacji.

## 8. Opłata kancelaryjna i przedawnienie — art. 19–20

- art. 19: 6 zł za każdą stronę zaświadczenia lub innego dokumentu wydawanego
  na wniosek na podstawie akt; opłata wraz z wnioskiem;
- art. 20: prawo do ściągnięcia zasądzonych opłat oraz prawo strony do żądania
  zwrotu opłaty przedawniają się po 3 latach, z różnymi punktami początkowymi
  opisanymi w ustawie.

## 9. KKS, wykroczenia, wojskowe — art. 21

Ustawę stosuje się także w postępowaniu o przestępstwo skarbowe/wykroczenie
skarbowe oraz o wykroczenie, z odrębnymi regułami wskazanymi w art. 21.
Dla wykroczeń opłata przy skazaniu na areszt albo ograniczenie wolności
wynosi 30 zł, natomiast opłatę od wniosku o wznowienie określają przepisy KPW.
Sprawy wojskowe mają własny wariant art. 21 pkt 3.

## 10. Intake i pułapki

Przed podaniem kwoty ustal:
- rodzaj postępowania: KK / KKS / wykroczenie / wojskowe;
- etap: I instancja / odwoławczy / wykonawczy;
- rodzaj i wymiar kary;
- kto wnosi środek lub wniosek;
- czy zachodzi zwolnienie;
- czy chodzi o opłatę sądową, wydatki, należności Skarbu Państwa czy opłatę
  kancelaryjną.

**Pułapka F-108:** moduł KSCU dotyczy kosztów cywilnych i nie jest podstawą
do wyliczenia opłaty karnej.

## 10a. ⛔ KOSZTY PROCESU (KPK) — warstwa obok tej ustawy

✅ [VER] RZĄD 1 2026-09-12c — odczyt treści KPK `Dz.U. 2026 poz. 490`.

Art. 616 § 1 KPK: koszty procesu = **koszty sądowe** + **uzasadnione wydatki
stron**, w tym z tytułu ustanowienia **jednego** obrońcy lub pełnomocnika.
Art. 616 § 2: koszty sądowe = **opłaty** + **wydatki Skarbu Państwa** od chwili
wszczęcia postępowania. ⛔ **Art. 617 KPK odsyła po opłaty do odrębnej ustawy —
czyli do tego modułu.** Katalog wydatków: art. 618 § 1 (doręczenia, przejazdy,
sprowadzenie i przewóz, oględziny i badania, ogłoszenia, wykonanie orzeczenia,
należności świadków i tłumaczy, koszty mediacji, należności biegłych, obserwacja
psychiatryczna).

| Rozstrzygnięcie | Kto ponosi koszty | Podstawa |
|---|---|---|
| skazanie | oskarżony | art. 627 KPK |
| uniewinnienie / umorzenie, **oskarżenie prywatne** | oskarżyciel prywatny; przy pojednaniu — każdy w swoim zakresie, o ile ugoda nie stanowi inaczej | art. 632 pkt 1 KPK |
| uniewinnienie / umorzenie, **oskarżenie publiczne** | Skarb Państwa, z wyjątkiem należności pełnomocnika pokrzywdzonego lub oskarżyciela posiłkowego | art. 632 pkt 2 KPK |
| wypadki wyjątkowe przy umorzeniu | sąd może obciążyć oskarżonego | art. 632a KPK |

### ⛔⛔ Zryczałtowana równowartość wydatków — KWOTA ZMIENIONA 1.07.2025

Oskarżyciel prywatny składa **przy akcie oskarżenia** dowód wpłacenia
zryczałtowanej równowartości wydatków (art. 621 § 1 KPK).

| Okres | Kwota | Akt |
|---|---|---|
| do 30.06.2025 | 300 zł | rozp. MS z 28.05.2003, `Dz.U. 2003 nr 104 poz. 980` — **UCHYLONE** |
| **od 1.07.2025** | **1000 zł** | rozp. MS z 10.06.2025, **`Dz.U. 2025 poz. 770`** § 1 |

⛔ **Powszechnie powtarzana kwota 300 zł jest nieaktualna.** Rozporządzenie
z 2003 r. zostało wprost uchylone (§ 3 nowego aktu). ⚠️ § 2 nowego
rozporządzenia: jeżeli obowiązek uiszczenia **powstał przed** 1.07.2025, wpłaca
się kwotę **dotychczasową** — decyduje data powstania obowiązku, nie data wpłaty.
⚠️ Ryczałt **nie obejmuje** kosztów z art. 618 § 1 pkt 5 i 11. ⚠️ Art. 622 KPK
przewiduje zwrot przy pojednaniu przed wszczęciem przewodu sądowego — odczytać
przy sprawie.

## 11. Połączenia

- KPK / środek odwoławczy → właściwy moduł KPK w DR-03;
- wykonanie kary → mod-KKW-kodeks-karny-wykonawczy.md;
- wykroczenia → mod-KW-KPW-framework-szczegolowy.md;
- koszty cywilne → DR-12 / mod-KSCU-koszty-sadowe-i-pomoc-prawna.md;
- ⛔ **tabela kanoniczna kwot i kolejność sięgania po nie → `shared/TABELE-OPLAT.md`**
  (sekcja 5 jest wyciągiem z tego modułu; sekcja 7 prowadzi rejestr tabel
  satelickich). ⛔ Opłata **kancelaryjna 6 zł za stronę** z art. 19 ust. 1 tej
  ustawy bywa mylona z cywilną opłatą kancelaryjną, która wynosi **20 zł za każde
  rozpoczęte 10 stron** (art. 77 ust. 1 KSCU) — to dwa różne akty.

## 12. Quality gate

- [ ] odczytano bieżący tekst ELI Dz.U. 2023 poz. 123;
- [ ] sprawdzono, czy po 2023 r. ogłoszono nowelizację;
- [ ] użyto aktualnego wariantu art. 2 po 14.03.2023;
- [ ] ustalono etap i rodzaj postępowania;
- [ ] nie pomylono opłaty z kosztami/wydatkami;
- [ ] zweryfikowano zwolnienie i środek zaskarżenia;
- [ ] wykonano SELF-CHECK routera.
