# Moduł — VAT: sankcje, dodatkowe zobowiązanie podatkowe, bony SPV/MPV, pusta faktura, wyłączenia i proporcja odliczenia

> ⚠️ TEN moduł jest CZĘŚCIĄ RODZINY plików VAT, PODZIELONEJ
> 2026-08-12 (NOTA-4, audyt-systemu-v4/CHECKLIST-DEDUP.md — moduł
> źródłowy miał 3652 linie). Moduł MACIERZYSTY (z aktualnym stanem
> weryfikacji ustawy, ostrzeżeniami o nowelizacjach i alertami
> KSeF/PKWiU): `mod-VAT-podatek-od-towarow-i-uslug.md`.
>
> **⛔ KRYTYCZNE ostrzeżenie (dotyczy CAŁEJ rodziny plików VAT):**
> podstawowy termin zwrotu różnicy podatku to **40 DNI** (art. 87
> ust. 2 zd. 1), NIE 60 dni — SPRAWDŹ moduł macierzysty PRZED
> cytowaniem tego terminu.

---

## 4e. ⭐⭐⭐ SANKCJE VAT — DODATKOWE ZOBOWIĄZANIE PODATKOWE (art. 112b–
112c ustawy VAT) — dodane 2026-08-12, uzupełnienie luki
zidentyfikowanej w audycie pokrycia DR-06 (dotąd CAŁKOWICIE nieobecne
poza JEDNĄ ogólną wzmianką o "aktualnym sankcyjnym art. 109a" przy
JPK — TEN artykuł dotyczy INNEJ sankcji; art. 112b/112c to GŁÓWNY,
systemowy mechanizm sankcyjny VAT)

```
⭐⭐⭐ ISTOTA: dodatkowe ZOBOWIĄZANIE podatkowe (POTOCZNIE "sankcja
  VAT") to ADMINISTRACYJNA kara PIENIĘŻNA nakładana PRZEZ organ, GDY
  podatnik ZANIŻYŁ zobowiązanie PODATKOWE, zawyżył KWOTĘ zwrotu VAT,
  LUB zawyżył kwotę DO przeniesienia na KOLEJNY okres — NIEZALEŻNA
  od odpowiedzialności KARNEJ skarbowej (choć WYKLUCZAJĄCA się z nią
  DLA osób fizycznych — patrz NIŻEJ)
  → OBOWIĄZUJE od 1.01.2017 (przywrócona PO wcześniejszym
    funkcjonowaniu DO 30.11.2008) — NIE stosuje SIĘ do okresów
    rozliczeniowych PRZED tą datą

⭐⭐⭐ ⚡ FUNDAMENTALNA ZMIANA OD 6.06.2023 (nowelizacja W następstwie
  wyroku TSUE C-935/19, Grupa WARZYWNA) — ⚠️ KLUCZOWE dla PRAWIDŁOWEGO
  stosowania:
  → DO 5.06.2023: sankcja BYŁA ustalana SZTYWNO — dokładnie 15%, 20%,
    30% LUB 100%, bez MOŻLIWOŚCI miarkowania PRZEZ organ
  → OD 6.06.2023: sankcja jest ustalana "DO" wysokości — DO 30%, DO
    20% LUB do 15% (art. 112b ust. 1-2a) — organ USTALA wysokość
    ZINDYWIDUALIZOWANIE, uwzględniając OKOLICZNOŚCI konkretnej
    sprawy — SANKCJA 100% (art. 112c) POZOSTAJE sankcją SZTYWNĄ, BEZ
    słowa "do" — DALEJ NIE podlega miarkowaniu
  → ⚠️ STARSZE materiały/komentarze CYTUJĄCE sztywne stawki 15/20/30%
    jako OBOWIĄZUJące SĄ NIEAKTUALNE dla okresów PO 6.06.2023 —
    ZAWSZE weryfikuj, KTÓREGO okresu ROZLICZENIOWEGO dotyczy sprawa

⭐⭐⭐ GENEZA REFORMY — WYROK TSUE C-935/19 "GRUPA WARZYWNA" (15.04.2021):
  TSUE stwierdził NIEZGODNOŚĆ dawnej, SZTYWNEJ 20% sankcji Z zasadą
  PROPORCJONALNOŚCI wynikającą Z dyrektywy VAT — STAN faktyczny:
  podatnik BŁĘDNIE zakwalifikował transakcję ZWOLNIONĄ jako
  OPODATKOWANĄ (błąd W OCENIE, bez cech OSZUSTWA ani uszczuplenia
  wpływów) — TRYBUNAŁ: sankcja NIE MOŻE być stosowana BEZ
  rozróżnienia MIĘDZY sytuacją zwykłego BŁĘDU w ocenie A sytuacją
  faktycznego OSZUSTWA/uszczuplenia — sposób USTALANIA sankcji MUSI
  DAWAĆ organowi możliwość ZINDYWIDUALIZOWANIA kary — ⭐ WYROK miał
  charakter DEFINITYWNY (bez odesłania SPRAWY do sądu krajowego DO
  oceny w świetle KRYTERIÓW) — orzeczenie WPROST rozstrzygnęło o
  niezgodności
  → ⭐ LINIA orzecznicza POLSKICH sądów PRZED formalną nowelizacją
    (np. WSA w Białymstoku, I SA/Bk 1/23): SANKCJA z art. 112b
    możliwa WYŁĄCZNIE, gdy DZIAŁANIE podatnika ŚWIADOMIE zmierza DO
    nadużyć/uszczuplenia — ZWYKŁE zaniedbanie (BEZ cech oszustwa,
    BEZ realnego USZCZUPLENIA budżetu — np. GDY podatnik ZAPŁACIŁ
    odsetki, generując DODATKOWY dochód budżetowy) NIE uzasadnia
    sankcji, NAWET przed formalną korektą PRZEPISÓW

⭐⭐ PRÓG ZAWYŻENIA/ZANIŻENIA I POZIOMY SANKCJI (art. 112b ust. 1-2a):
  □ DO 30% — PODSTAWOWY próg, GDY podatnik NIE koryguje deklaracji
    SAMODZIELNIE (organ SAM stwierdza nieprawidłowość I ustala jej
    wysokość)
  □ DO 20% — GDY podatnik, PO zakończonej kontroli PODATKOWEJ/celno-
    skarbowej, ZŁOŻY korektę deklaracji UWZGLĘDNIAJĄCĄ stwierdzone
    nieprawidłowości I najpóźniej W dniu złożenia TEJ korekty
    WPŁACI kwotę zobowiązania/zwróci NIENALEŻNY zwrot (art. 112b
    ust. 2 pkt 1)
  □ DO 15% — NAJNIŻSZY próg, GDY podatnik ZŁOŻYŁ korektę W TRAKCIE
    kontroli CELNO-skarbowej, W terminie 14 DNI od doręczenia
    UPOWAŻNIENIA do kontroli, I NAJPÓŹNIEJ w dniu jej złożenia
    WPŁACIŁ kwotę zobowiązania/zwrócił NIENALEŻNY zwrot (art. 112b
    ust. 2a) — SZYBKA reakcja podatnika JEST premiowana NAJNIŻSZYM
    progiem

⭐⭐⭐ KRYTERIA MIARKOWANIA (uwzględniane PRZEZ organ PRZY ustalaniu
  konkretnej wysokości W GRANICACH "do X%", wprowadzone nowelizacją
  6.06.2023, art. 112b ust. 2b): RODZAJ i STOPIEŃ naruszenia
  ciążącego NA podatniku obowiązku, KTÓRE skutkowało powstaniem
  nieprawidłowości; WAGA i CZĘSTOTLIWOŚĆ stwierdzanych DOTYCHCZAS
  nieprawidłowości — ⚠️ przepis TEN NIE odwołuje się DO art. 112c
  (sankcja 100% POZOSTAJE poza mechanizmem MIARKOWANIA)

⭐⭐⭐ SANKCJA 100% — art. 112c (SZTYWNA, BEZ miarkowania nawet PO
  nowelizacji 2023):
  □ STOSOWANA wyłącznie GDY podatnik ŚWIADOMIE uczestniczył W
    oszustwie — czyli ODLICZYŁ VAT z FAKTUR, które: (1) zostały
    WYSTAWIONE przez PODMIOT nieistniejący, (2) STWIERDZAJĄ czynności,
    które NIE zostały dokonane (tzw. PUSTE faktury), (3) PODAJĄ
    kwoty NIEZGODNE z rzeczywistością (W części dotyczącej TYCH
    pozycji), (4) POTWIERDZAJĄ czynności OBJĘTE przepisami o
    POZORNOŚCI/obejściu prawa (art. 58, 83 KC)
  □ ⭐⭐ ZMIANA OD 6.06.2023 co DO ZAKRESU zastosowania art. 112c
    (RÓWNIEŻ objęta NOWELIZACJĄ, mimo że wyrok TSUE dotyczył
    BEZPOŚREDNIO art. 112b): sankcja 100% MA zastosowanie WYŁĄCZNIE,
    gdy DZIAŁANIE było SKUTKIEM celowego DZIAŁANIA podatnika LUB
    jego KONTRAHENTA, O KTÓRYM podatnik MIAŁ wiedzę — PRZYPADKI
    odliczenia Z wadliwych faktur ZWIĄZANE Z brakiem NALEŻYTEJ
    staranności (BEZ świadomości udziału W oszustwie) NIE SĄ objęte
    100% sankcją PO tej zmianie
  □ ⭐ ORZECZNICTWO (WSA w Bydgoszczy, I SA/Bd 165/19): PRZY
    przyjęciu do rozliczenia FAKTUR z art. 112c — sankcja WYNOSI
    100%, NIEZALEŻNIE od tego, CZY podatnik SAM koryguje deklarację,
    CZY robi TO organ — BRAK uzasadnienia dla "PREMIOWANIA"
    nieuczciwych podatników UJMUJĄCYCH takie faktury

⭐⭐⭐ WYŁĄCZENIA CAŁKOWITE — KIEDY SANKCJA NIE JEST NAKŁADANA (art.
  112b ust. 3):
  □ pkt 1 lit. a — podatnik ZŁOŻYŁ korektę deklaracji I zapłacił
    UISZCZONE zobowiązanie WRAZ z odsetkami ZA zwłokę — PRZED dniem
    WSZCZĘCIA kontroli podatkowej/celno-skarbowej
  □ pkt 1 lit. b — podatnik ZŁOŻYŁ brakującą DEKLARACJĘ (uprzednio
    niezłożoną), wykazał W niej podatek WE właściwej wysokości I
    zapłacił GO wraz Z odsetkami — PRZED wszczęciem KONTROLI
  □ pkt 2 lit. a — nieprawidłowość WYNIKA z OCZYWISTYCH błędów
    RACHUNKOWYCH lub OCZYWISTYCH omyłek POPEŁNIONYCH w DEKLARACJI
    podatkowej — ⚠️ ⭐ ISTOTNE ograniczenie zakresu: przepis DOTYCZY
    wyłącznie BŁĘDÓW w SAMEJ deklaracji — NIE obejmuje BŁĘDÓW
    popełnionych W EWIDENCJI (JPK), mimo że W praktyce TO WŁAŚNIE W
    ewidencji NAJCZĘŚCIEJ powstają POMYŁKI (deklaracje ELEKTRONICZNE
    zwykle SAME sumują pozycje) — LUKA w OCHRONIE podatnika,
    sygnalizowana W piśmiennictwie
  □ ⭐ RÓWNIEŻ: zaniżenie/zawyżenie ZWIĄZANE z BŁĘDNYM zastosowaniem
    przepisów PRAWA podatkowego, KTÓRE NIE miało NA celu wyłudzenia
    nienależnego ZWROTU ani świadomego ZANIŻENIA zobowiązania — NIE
    MOŻE stanowić PODSTAWY sankcji (linia ORZECZNICZA rozwijająca
    wyrok TSUE Grupa Warzywna — KRYTERIUM subiektywne: BRAK celowego
    działania)

⭐⭐ WYŁĄCZENIE PODMIOTOWE — ZBIEG z ODPOWIEDZIALNOŚCIĄ KARNĄ
  SKARBOWĄ (art. 112b ust. 4, ⭐ POWIĄZANIE z pisma-procesowe-v3/
  reprezentacją W postępowaniach KARNOSKARBOWYCH): dodatkowego
  zobowiązania PODATKOWEGO (15/20/30%/100%) NIE stosuje SIĘ wobec
  OSÓB FIZYCZNYCH, które ZA TEN SAM czyn PONOSZĄ odpowiedzialność ZA
  wykroczenie SKARBOWE albo PRZESTĘPSTWO skarbowe — ⭐ PRAKTYCZNA
  KONSEKWENCJA: JEDNOOSOBOWY przedsiębiorca (osoba FIZYCZNA)
  podlegający ODPOWIEDZIALNOŚCI z KKS za DANY czyn NIE zapłaci
  RÓWNOLEGLE sankcji administracyjnej Z art. 112b — ⚠️ TO wyłączenie
  DOTYCZY osób FIZYCZNYCH — SPÓŁKI (osoby PRAWNE) nie korzystają Z
  tego wyłączenia W ten sam sposób (odpowiedzialność KARNA skarbowa
  DOTYCZY osób fizycznych DZIAŁAJĄCYCH w imieniu spółki, NIE samej
  spółki jako TAKIEJ — sankcja administracyjna Z VAT MOŻE być
  nałożona NA spółkę niezależnie)

⭐ WYŁĄCZENIE PRZY MPP (POWIĄZANIE z sekcją split PAYMENT wyżej w
  tym module, art. 108c ust. 1): JEŻELI nabywca ZAPŁACIŁ zobowiązanie
  wynikające Z otrzymanej faktury Z ZASTOSOWANIEM mechanizmu
  podzielonej PŁATNOŚCI — DO wysokości kwoty ODPOWIADAJĄCEJ kwocie
  podatku Z tej faktury, naczelnik URZĘDU skarbowego/celno-
  skarbowego NIE stosuje przepisów O sankcji (112b ust. 1 pkt 1 —
  30%, ust. 2 pkt 1 — 20%, ust. 2a — 15%, ORAZ 112c — 100%) — ⭐
  DODATKOWY argument PRZEMAWIAJĄCY za STOSOWANIEM MPP przy
  transakcjach Z załącznika 15

Checklist praktyczny:
□ ZWERYFIKUJ, którego OKRESU rozliczeniowego dotyczy sprawa — PRZED/
  PO 6.06.2023 — różne ZASADY (sztywne stawki vs "do X%")
□ Czy NIEPRAWIDŁOWOŚĆ wynika Z celowego działania (→ POTENCJALNIE
  100%, art. 112c) czy Z błędu W ocenie/zaniedbania BEZ cech
  oszustwa (→ NIŻSZY próg LUB brak sankcji w OGÓLE, zgodnie Z linią
  Grupa Warzywna)
□ Czy ZASTOSOWANIE ma KTÓRETKOLWIEK z wyłączeń art. 112b ust. 3
  (korekta PRZED kontrolą + zapłata, OCZYWISTY błąd rachunkowy W
  samej deklaracji)
□ PRZY osobie fizycznej — czy RÓWNOLEGLE toczy się/może TOCZYĆ się
  postępowanie KARNOSKARBOWE za TEN sam czyn — jeśli TAK, sankcja
  administracyjna NIE powinna być STOSOWANA
□ Czy PRZY transakcji z zał. 15 zastosowano MPP — jeśli TAK,
  sprawdź WYŁĄCZENIE z art. 108c ust. 1
□ PRZY negocjacji Z organem/odwołaniu — powołaj się WPROST na
  kryteria MIARKOWANIA z ust. 2b oraz NA linię TSUE Grupa Warzywna,
  JEŚLI okoliczności wskazują NA brak celowego DZIAŁANIA

⚠️ Weryfikuj aktualne brzmienie art. 112b-112c w ISAP — TO obszar Z
  ISTOTNĄ, DOŚĆ ŚWIEŻĄ reformą (2023) — STARSZE orzecznictwo/
  komentarze SPRZED tej daty WYMAGAJĄ ostrożnego STOSOWANIA (część
  argumentacji, np. CO do samej ZASADY proporcjonalności, POZOSTAJE
  aktualna; część DOTYCZĄCA sztywnych stawek — NIE).
```

---

## 4f. ⭐⭐⭐ BONY JEDNEGO I RÓŻNEGO PRZEZNACZENIA — SPV/MPV (Dział II
Rozdział 2a, art. 8a–8b; definicje art. 2 pkt 41-45; podstawa
opodatkowania art. 29a ust. 1a-1c; obowiązek podatkowy art. 19a ust.
1a, 4a) — dodane 2026-08-12, uzupełnienie luki zidentyfikowanej w
audycie pokrycia DR-06 (dotąd CAŁKOWICIE nieobecne, mimo licznych
odesłań DO tego rozdziału Z innych sekcji modułu — POWSZECHNE W
praktyce handlowej: karty PODARUNKOWE, vouchery, bony RABATOWE
sprzedawane ODPŁATNIE)

```
⭐⭐⭐ DEFINICJA "BONU" (art. 2 pkt 41): instrument, Z KTÓRYM wiąże się
  OBOWIĄZEK jego PRZYJĘCIA jako wynagrodzenia LUB części wynagrodzenia
  ZA dostawę towarów/świadczenie USŁUG — GDZIE towary/usługi, KTÓRE
  MAJĄ zostać dostarczone/wykonane, LUB tożsamość POTENCJALNYCH
  dostawców/usługodawców SĄ wskazane W samym instrumencie LUB W
  powiązanej DOKUMENTACJI (w TYM w warunkach jego wykorzystania) —
  ⭐ BON może mieć FORMĘ materialną (papierowy VOUCHER, karta) LUB
  elektroniczną (KOD), być PŁATNY lub BEZPŁATNY — NAZWA instrumentu
  (voucher, TALON, kupon podarunkowy) NIE ma znaczenia — ISTOTNE jest
  WYŁĄCZNIE, czy UPRAWNIA do zakupu OKREŚLONYCH (lub określalnych)
  towarów/usług W przyszłości

⭐⭐⭐ CO NIE JEST BONEM (WYŁĄCZENIE Z definicji) — CZĘSTY błąd
  PRAKTYCZNY:
  □ KARTY i kupony RABATOWE uprawniające DO określonej zniżki PRZY
    nabywaniu towarów/usług, ALE NIE dające PRAWA do uzyskania TYCH
    towarów/usług SAMYCH w sobie — TO NIE jest bon W rozumieniu
    ustawy
  □ KOD rabatowy — WPROST NIE jest bonem NA gruncie ustawy o VAT
  □ ⭐ PRAKTYCZNE rozróżnienie: BON "wymienia się NA towar/usługę"
    (jest SUBSTYTUTEM zapłaty); RABAT/kod rabatowy "OBNIŻA cenę"
    towaru/usługi (NIE zastępuje zapłaty, TYLKO ją zmniejsza) —
    KONSEKWENCJA: rabaty/kody RABATOWE rozliczane są NA zasadach
    OGÓLNYCH obniżenia podstawy OPODATKOWANIA (art. 29a — SEKCJA
    wyżej w TYM module), NIE przez mechanizm ROZDZIAŁU 2a
  □ ⭐ ODESŁANIE: STATUS jako "instrument PŁATNICZY" analizowany PRZY
    okazji INNYCH przepisów (np. USTAWA o usługach płatniczych) —
    NIE jest TOŻSAMY ze statusem "bonu" NA gruncie VAT — TO DWIE
    ODRĘBNE klasyfikacje, MOGĄCE się NAKŁADAĆ, ale niekoniecznie

⭐⭐⭐ DWA RODZAJE BONÓW — KRYTERIUM ROZRÓŻNIAJĄCE (art. 2 pkt 43-44):
  □ BON JEDNEGO PRZEZNACZENIA (SPV — single-purpose voucher): bon, W
    PRZYPADKU którego W CHWILI EMISJI ZNANE są ŁĄCZNIE: (a) MIEJSCE
    dostawy towarów/świadczenia usług, KTÓRYCH bon dotyczy, ORAZ (b)
    KWOTA należnego PODATKU (VAT/podatku o PODOBNYM charakterze) Z
    tytułu tej dostawy/usługi
  □ BON RÓŻNEGO PRZEZNACZENIA (MPV — multi-purpose voucher): KAŻDY
    bon INNY niż SPV — tj. GDY W chwili emisji NIE można ustalić
    MIEJSCA opodatkowania LUB kwoty PODATKU należnego (LUB OBU tych
    elementów) — NAJCZĘSTSZY praktyczny PRZYKŁAD: karta PODARUNKOWA
    do sieci SKLEPÓW oferującej TOWARY objęte RÓŻNYMI stawkami VAT
    (5/8/23%) — W momencie WYDANIA karty NIE wiadomo, JAKIE konkretnie
    towary ZOSTANĄ za nią NABYTE, WIĘC nie da SIĘ ustalić kwoty
    podatku Z GÓRY
  □ ⭐ TEST PRAKTYCZNY: JEDNA stawka VAT + JEDNO, znane MIEJSCE
    dostawy → SPV; RÓŻNE możliwe stawki LUB nieznane miejsce → MPV

⭐⭐⭐ SKUTKI PODATKOWE BONU JEDNEGO PRZEZNACZENIA (SPV, art. 8a) —
  OPODATKOWANY JUŻ NA ETAPIE TRANSFERU:
  □ ZASADA (ust. 1): TRANSFER bonu SPV dokonany PRZEZ podatnika
    działającego WE własnym imieniu UZNAJE się ZA dostawę
    towarów/świadczenie USŁUG, KTÓRYCH bon DOTYCZY — ⭐ EMISJA bonu
    ORAZ KAŻDE jego PÓŹNIEJSZE przekazanie (art. 2 pkt 45 —
    "TRANSFER") SĄ opodatkowane, TAK jakby DOSZŁO do faktycznej
    dostawy/usługi — UZASADNIENIE: W momencie emisji bonu SPV
    DOKŁADNIE znana JEST wysokość podatku NALEŻNEGO, WIĘC NIE MA
    przeszkód, by ROZLICZYĆ VAT już WTEDY
  □ ⭐⭐ FAKTYCZNA realizacja bonu SPV (ust. 2): faktyczne PRZEKAZANIE
    towarów/świadczenie USŁUG w zamian ZA bon SPV przyjęty JAKO
    wynagrodzenie NIE JEST uznawane ZA NIEZALEŻNĄ, ODRĘBNĄ transakcję
    — VAT ZOSTAŁ już ROZLICZONY na etapie TRANSFERU, WIĘC sama
    "REALIZACJA"/wymiana bonu NA towar nie GENERUJE drugiego
    zdarzenia OPODATKOWANEGO
  □ ⭐ TRANSFER PRZEZ POŚREDNIKA (ust. 3-4): JEŻELI transferu DOKONUJE
    podatnik DZIAŁAJĄCY w IMIENIU innego podatnika — TRANSFER
    UZNAJE się za DOSTAWĘ/usługę DOKONANĄ przez TEGO, w KTÓREGO
    imieniu się DZIAŁA; JEŻELI dostawca/usługodawca NIE JEST
    podatnikiem, KTÓRY wyemitował BON — UZNAJE się, że TEN
    dostawca/usługodawca DOKONAŁ dostawy/usługi NA rzecz EMITENTA
    bonu (⭐ ROZLICZENIE "łańcuchowe" W sieciach franczyzowych/
    partnerskich)
  □ ⭐ MOMENT obowiązku PODATKOWEGO (art. 19a ust. 1a, 4a): Z CHWILĄ
    dokonania TRANSFERU bonu SPV (NIE Z chwilą JEGO faktycznego
    wykorzystania PRZEZ konsumenta) — POWIĄZANIE z sekcją "obowiązek
    podatkowy" wyżej W tym module

⭐⭐⭐ SKUTKI PODATKOWE BONU RÓŻNEGO PRZEZNACZENIA (MPV, art. 8b) —
  OPODATKOWANY DOPIERO PRZY REALIZACJI:
  □ ZASADA (ust. 1): OPODATKOWANIU podlega WYŁĄCZNIE faktyczne
    PRZEKAZANIE towarów/świadczenie USŁUG dokonane W ZAMIAN za bon
    MPV przyjęty JAKO wynagrodzenie — WCZEŚNIEJSZY transfer bonu MPV
    (EMISJA i KAŻDE kolejne przekazanie) NIE podlega OPODATKOWANIU
    VAT w OGÓLE — TO logiczna KONSEKWENCJA braku znajomości STAWKI/
    miejsca w MOMENCIE emisji
  □ ⭐⭐ TRANSFER przez POŚREDNIKA innego niż WYSTAWCA świadczenia
    (ust. 2): JEŻELI transferu bonu MPV DOKONUJE podatnik INNY niż
    TEN, który OSTATECZNIE dokonuje OPODATKOWANEJ czynności (ust. 1)
    — OPODATKOWANIU podlegają WYŁĄCZNIE usługi POŚREDNICTWA oraz INNE
    możliwe do ZIDENTYFIKOWANIA usługi (np. DYSTRYBUCJI, promocji)
    DOTYCZĄCE tego bonu — NIE cała WARTOŚĆ bonu — ⭐ ISTOTNE DLA
    dystrybutorów/platform SPRZEDAJĄCYCH bony W imieniu wystawcy
    (np. platformy SPRZEDAJĄCE karty podarunkowe SIECI handlowych)

⭐⭐⭐ PODSTAWA OPODATKOWANIA DLA MPV (art. 29a ust. 1a-1c) —
  SZCZEGÓLNY mechanizm, ODMIENNY od zasady OGÓLNEJ:
  □ BON zrealizowany W CAŁOŚCI (ust. 1a): podstawa OPODATKOWANIA
    RÓWNA się: (1) WYNAGRODZENIU zapłaconemu ZA bon MPV, POMNIEJSZONEMU
    o KWOTĘ podatku ZWIĄZANĄ z dostarczonymi TOWARAMI/usługami; LUB
    (2) — GDY informacje O wynagrodzeniu SĄ niedostępne — WARTOŚCI
    pieniężnej WSKAZANEJ na bonie/W powiązanej DOKUMENTACJI,
    pomniejszonej O kwotę podatku
  □ BON zrealizowany W CZĘŚCI (ust. 1b): PODSTAWA opodatkowania równa
    się ODPOWIEDNIEJ CZĘŚCI powyższych KWOT (proporcjonalnie DO
    wykorzystanej CZĘŚCI bonu)
  □ ⭐ PRZYKŁAD PRAKTYCZNY: karta PODARUNKOWA o wartości 100 ZŁ (MPV)
    wymieniona NA spodnie — PODSTAWĄ opodatkowania JEST wartość
    NOMINALNA bonu W momencie REALIZACJI (100 zł POMNIEJSZONE o VAT
    zawarty W tej kwocie), NIE cena NABYCIA samej karty PRZEZ
    konsumenta (JEŚLI była INNA, np. przy PROMOCYJNEJ sprzedaży
    karty)
  □ ODPOWIEDNIE STOSOWANIE (ust. 1c): DO powyższych przypadków
    stosuje SIĘ odpowiednio ust. 2 i 5 art. 29a (koszt WYTWORZENIA
    przy nieodpłatnym PRZEKAZANIU towarów, koszt świadczenia PRZY
    nieodpłatnych usługach — POWIĄZANIE z sekcją 4b wyżej w TYM
    module)

⭐⭐⭐ NIEZREALIZOWANE BONY MPV — BRAK OPODATKOWANIA (⭐ ISTOTNE
  praktycznie, potwierdzone INTERPRETACJĄ KIS z 30.05.2025): JEŻELI
  bon MPV NIGDY nie zostanie ZREALIZOWANY (np. UTRACI ważność, KLIENT
  go NIE wykorzysta) — ŚRODKI pieniężne OTRZYMANE od klienta PRZY
  emisji NIE STANOWIĄ kwoty Z tytułu czynności PODLEGAJĄCEJ
  opodatkowaniu VAT — PONIEWAŻ NIE dochodzi DO "faktycznego
  świadczenia" WYMAGANEGO przez art. 8b ust. 1 — WNIOSEK: kwoty
  ZATRZYMANE ze sprzedaży NIEWYKORZYSTANYCH bonów MPV (tzw. "BREAKAGE")
  POZOSTAJĄ POZA VAT w CAŁOŚCI — ⚠️ TO ODWROTNIE niż PRZY bonach SPV,
  GDZIE VAT jest ROZLICZANY już PRZY emisji, WIĘC brak realizacji NIE
  ZMIENIA już DOKONANEGO rozliczenia (BRAK mechanizmu "zwrotu" VAT Z
  tego tytułu, chyba że NASTĄPI zwrot ŚRODKÓW klientowi — WTEDY
  zastosowanie MAJĄ zasady OGÓLNE korekty)

⭐ POWIĄZANIE Z INNYMI SEKCJAMI TEGO MODUŁU:
  □ Sekcja "OBOWIĄZEK podatkowy" (4a) — MOMENT dla SPV to CHWILA
    transferu (art. 19a ust. 1a), NIE zasada OGÓLNA "dokonania
    dostawy"
  □ Sekcja "PODSTAWA opodatkowania" (4b) — MECHANIZM dla MPV (art.
    29a ust. 1a-1c) to LEX SPECIALIS względem ZASADY ogólnej Z ust. 1
  □ Sekcja "ZWOLNIENIA przedmiotowe" (4c) — JEŻELI bon DOTYCZY
    świadczenia OBJĘTEGO zwolnieniem (np. USŁUGI medyczne) — analiza
    SPV/MPV MUSI uwzględniać RÓWNIEŻ status ZWOLNIENIA, nie TYLKO
    stawkę
  □ MECHANIZM VAT marża/OSS — bony W handlu TRANSGRANICZNYM (np.
    karty PODARUNKOWE platform e-commerce) MOGĄ wymagać ŁĄCZNEJ
    analizy Z sekcją OSS/IOSS wyżej W module, PRZY sprzedaży
    KONSUMENTOM w innych KRAJACH UE

Checklist praktyczny:
□ Czy INSTRUMENT w OGÓLE spełnia definicję "BONU" (art. 2 pkt 41) —
  CZY to raczej KARTA/kod RABATOWY (POZA zakresem Rozdziału 2a,
  rozliczane NA zasadach ogólnych OBNIŻENIA podstawy)
□ Czy W chwili EMISJI znane SĄ ŁĄCZNIE: miejsce OPODATKOWANIA I
  kwota PODATKU należnego — JEŚLI tak, TO bon SPV (VAT PRZY emisji);
  jeśli NIE (choćby JEDEN element NIEZNANY) — bon MPV (VAT PRZY
  realizacji)
□ PRZY dystrybucji bonów PRZEZ pośrednika/platformę — czy TO
  transfer bonu SPV (OPODATKOWANY w PEŁNEJ wartości NA każdym
  etapie) czy MPV (OPODATKOWANA tylko USŁUGA pośrednictwa/dystrybucji)
□ PRZY realizacji bonu MPV — czy PODSTAWĘ opodatkowania USTALONO wg
  wynagrodzenia ZAPŁACONEGO za bon (art. 29a ust. 1a PKT 1), CZY —
  przy BRAKU tej informacji — wg wartości NOMINALNEJ (pkt 2)
□ Czy PROWADZONA jest ewidencja WYSTARCZAJĄCA do ROZRÓŻNIENIA
  realizacji CAŁOŚCIOWEJ i CZĘŚCIOWEJ bonu MPV (proporcjonalne
  ustalenie PODSTAWY)
□ PRZY bonach NIEZREALIZOWANYCH (breakage) — POTWIERDŹ, że TO MPV
  (SPV rozliczono JUŻ przy emisji, NIEZALEŻNIE od PÓŹNIEJSZEGO losu)

⚠️ Weryfikuj aktualne brzmienie art. 2 pkt 41-45, art. 8a-8b, art.
  29a ust. 1a-1c oraz art. 19a ust. 1a/4a w ISAP — REGULACJA
  bonów WESZŁA w życie 1.01.2019 (implementacja DYREKTYWY UE
  2016/1065) — STOSUNKOWO STABILNA od tego CZASU, ale ZAWSZE
  weryfikuj AKTUALNE brzmienie PRZY konkretnej sprawie, SZCZEGÓLNIE
  przy TRANSAKCJACH transgranicznych/wieloetapowych łańcuchach
  dystrybucji.
```

---

## 4g. ⭐⭐⭐ PUSTA FAKTURA — OBOWIĄZEK ZAPŁATY PODATKU Z SAMEJ FAKTURY
(art. 108 ustawy VAT) — dodane 2026-08-12, uzupełnienie luki #1 z audytu
pokrycia VAT (dotąd moduł zawierał WYŁĄCZNIE art. 108a — MPP — i art.
108c, a SAM art. 108 nie występował ani razu, mimo że jest to jedna z
najczęstszych podstaw decyzji wymiarowych i praktycznie zawsze łączy się
z zarzutem karnoskarbowym)

```
⭐⭐⭐ TREŚĆ NORMY (art. 108 ust. 1–3):
  ust. 1 — gdy osoba prawna, jednostka organizacyjna niemająca osobowości
    prawnej LUB osoba fizyczna WYSTAWI FAKTURĘ, W KTÓREJ WYKAŻE KWOTĘ
    PODATKU — JEST OBOWIĄZANA DO JEGO ZAPŁATY
  ust. 2 — przepis ust. 1 stosuje się ODPOWIEDNIO, gdy podatnik wystawi
    fakturę z kwotą podatku WYŻSZĄ od kwoty podatku należnego
  ust. 3 — w przypadku z art. 43 ust. 12a do zapłaty podatku obowiązana
    jest ORGANIZACJA POŻYTKU PUBLICZNEGO
  ust. 4 — (uchylony)

⭐⭐⭐ TRZY CECHY KONSTRUKCYJNE, KTÓRE DECYDUJĄ O CAŁEJ OBRONIE:
  1) OBOWIĄZEK POWSTAJE Z SAMEGO WYSTAWIENIA faktury — NIEZALEŻNIE od
     tego, czy czynność w ogóle zaistniała, czy podlegała opodatkowaniu i
     czy była zwolniona. To NIE jest podatek od transakcji, lecz
     samoistny obowiązek od DOKUMENTU
  2) ADRESATEM jest KAŻDY WYSTAWCA — także podmiot NIEBĘDĄCY podatnikiem
     VAT (przepis mówi o „osobie prawnej / jednostce organizacyjnej /
     osobie fizycznej", nie o „podatniku" — inaczej niż ust. 2)
  3) ⭐ KWOTY Z ART. 108 NIE ROZLICZA SIĘ W DEKLARACJI na zasadach
     ogólnych i NIE POMNIEJSZA SIĘ jej o podatek naliczony — to
     zobowiązanie odrębne od rozliczenia okresowego

⭐⭐⭐ CHARAKTER PRAWNY — KLUCZOWY ARGUMENT OBRONY:
  → Wyrok TK z 21.04.2015 r., sygn. **P 40/13** — TK badał zgodność art.
    62 § 2 KKS w zakresie, w jakim dopuszcza odpowiedzialność
    karnoskarbową osoby fizycznej, wobec której za TEN SAM CZYN
    (wystawienie nierzetelnej faktury) zastosowano uprzednio obowiązek
    zapłaty z art. 108 ust. 1 ustawy o VAT. TK orzekł o ZGODNOŚCI art. 62
    § 2 KKS z art. 2 Konstytucji — a rozstrzygnięcie oparł na tezie, że
    art. 108 ust. 1 NIE MA charakteru SANKCYJNEGO; jego funkcją jest
    ZAPOBIEŻENIE USZCZUPLENIU wpływów budżetowych (rekompensata ryzyka),
    a nie karanie
  → ⭐ PRAKTYCZNA KONSEKWENCJA: skoro celem normy jest USUNIĘCIE RYZYKA
    USZCZUPLENIA, to TAM, GDZIE RYZYKO ZOSTAŁO W CZASIE WYELIMINOWANE,
    stosowanie art. 108 traci podstawę. To fundament linii obrony
  → ⚠️ UWAGA NA DEZAKTUALIZACJĘ: starsze orzecznictwo NSA (sprzed wyroku
    TK z 2015 r.) opisywało art. 108 jako przepis „sankcyjno-prewencyjny"
    — powoływanie TAKICH tez dziś jest błędem; niektóre WSA nadal
    posługują się terminem „sankcja" i TO WYMAGA SPROSTOWANIA w piśmie
  ✅ [VER: trybunal.gov.pl — komunikat o sprawie P 40/13, rozpoznanie
     21.04.2015; potwierdzone w 3 niezależnych źródłach z przytoczeniem
     sentencji, 2026-08-12]

⭐⭐ LINIA OBRONY — KOLEJNOŚĆ ARGUMENTÓW:
  1. NEGACJA HIPOTEZY: czy dokument jest w ogóle „fakturą" i czy został
     WPROWADZONY DO OBROTU PRAWNEGO? Faktura wystawiona i niewydana
     kontrahentowi (wycofana, zniszczona) — brak ryzyka odliczenia po
     stronie odbiorcy
  2. WYELIMINOWANIE RYZYKA W CZASIE: korekta faktury „do zera" przed
     wykorzystaniem przez odbiorcę; jeżeli odbiorca odliczył — wykazanie,
     że odliczenie zostało cofnięte/skorygowane
  3. DOBRA WIARA I RZECZYWISTA PRZYCZYNA BŁĘDU: błąd w kwalifikacji
     towaru/usługi (np. spór o klasyfikację → patrz
     mod-VAT-klasyfikacja-produktow-baza-niejednoznacznosci.md),
     omyłka rachunkowa, przedwczesne wystawienie — to NIE JEST „pusta
     faktura" w rozumieniu praktyki organów
  4. BRAK PRZYMIOTU WYSTAWCY: faktura wystawiona przez PRACOWNIKA z
     wykorzystaniem danych pracodawcy, poza jego wiedzą i kontrolą
     → wyrok TSUE **C-442/22** — obowiązek zapłaty obciąża PRACOWNIKA,
     a nie pracodawcę, POD WARUNKIEM że pracodawca dochował NALEŻYTEJ
     STARANNOŚCI rozsądnie wymaganej w celu KONTROLOWANIA DZIAŁAŃ tego
     pracownika; przy braku takiej staranności (lub złej wierze)
     odpowiedzialność wraca na pracodawcę
     ✅ [VER: opracowanie EY dot. C-442/22, 2026-08-12]
     ⚠️ [ZALECANA WERYFIKACJA pełnego tekstu na curia.europa.eu przed
        powołaniem w piśmie]
  5. ⭐ TEST ORGANIZACYJNY po C-442/22 — DO ZBADANIA W KAŻDEJ SPRAWIE
     PRACOWNICZEJ: czy pracownik miał uprawnienie do wystawiania faktur
     POZA systemem? czy wymagana była zgoda przełożonego? czy istniały
     mechanizmy kontroli wewnętrznej? BRAK tych mechanizmów bywa
     kwalifikowany przez organy jako niedochowanie należytej staranności
     pracodawcy

⛔ SPRZĘŻENIE KARNOSKARBOWE — OBOWIĄZKOWY KWALIFIKATOR:
  → Zastosowanie art. 108 ust. 1 NIE WYKLUCZA odpowiedzialności z art. 62
    § 2 KKS wobec TEJ SAMEJ osoby fizycznej za TEN SAM czyn (wprost
    przesądzone wyrokiem TK P 40/13)
  → Przy fakturach o dużej wartości bada się DODATKOWO kwalifikację z
    Kodeksu karnego (przestępstwa fakturowe) — ⚠️ PRZEPISY KK i KKS
    WERYFIKUJ w module dr-03 (prawo karne) PRZED powołaniem; NIE
    przenoś numerów artykułów karnych z tego modułu z pamięci
  → ⭐ KOLEJNOŚĆ PRACY: ustal najpierw, czy klient jest wystawcą, czy
    odbiorcą pustej faktury — po stronie ODBIORCY podstawą odmowy
    odliczenia jest art. 88 ust. 3a pkt 4 lit. a (patrz sekcja 4h
    niżej), a NIE art. 108

□ POWIĄZANIA WEWNĄTRZ MODUŁU: art. 88 ust. 3a (sekcja 4h) — strona
  nabywcy | art. 112b–112c (sekcja 4e) — dodatkowe zobowiązanie |
  art. 109a (sekcja 5) — odrębna sankcja 100% przy fakturze do paragonu
  bez NIP

✅ [VER: lexlege.pl / arslege.pl / przepisy.gofin.pl — zgodne brzmienie
   art. 108 ust. 1–3, Dz.U.2025.0.775 t.j., 2026-08-12]
⚠️ [ZALECANA WERYFIKACJA ISAP]
```

---

## 4h. ⭐⭐⭐ WYŁĄCZENIA PRAWA DO ODLICZENIA — KATALOG NEGATYWNY
(art. 88 ustawy VAT) — dodane 2026-08-12, uzupełnienie luki #2 z audytu
pokrycia VAT (dotąd sekcja o odliczeniu opisywała WYŁĄCZNIE zarzut braku
dobrej wiary; sam art. 88 — czyli przesłanki NEGATYWNE odliczenia — nie
występował w całym DR-06)

```
⭐⭐⭐ UKŁAD NORMY: prawo do odliczenia wymaga spełnienia przesłanek
  POZYTYWNYCH (art. 86 ust. 1 — związek z czynnościami opodatkowanymi)
  ORAZ NIEZAISTNIENIA przesłanek NEGATYWNYCH (art. 88). Organ, który
  odmawia odliczenia, MUSI wskazać KONKRETNĄ jednostkę art. 88 —
  ⭐ brak precyzyjnej podstawy w decyzji to samodzielny zarzut

⭐⭐ ART. 88 UST. 1 — WYŁĄCZENIA PRZEDMIOTOWE (rodzaj nabycia):
  pkt 1–3 — (uchylone)
  pkt 4 — **usługi noclegowe i gastronomiczne**, Z WYJĄTKIEM:
    a) (uchylona)
    b) nabycia GOTOWYCH POSIŁKÓW przeznaczonych DLA PASAŻERÓW przez
       podatników świadczących usługi PRZEWOZU OSÓB
    c) ⭐ usług NOCLEGOWYCH nabywanych W CELU ICH ODPRZEDAŻY,
       opodatkowanych u tego podatnika na podstawie art. 8 ust. 2a
       (refakturowanie) — ⚠️ WYJĄTEK DOTYCZY WYŁĄCZNIE NOCLEGÓW;
       usługi GASTRONOMICZNE nabywane w celu odprzedaży NIE zostały
       objęte tym wyjątkiem
  pkt 5 — (uchylony)

□ ART. 88 UST. 1a — wyłączenie dla wydatków, o których mowa w art. 29a
  ust. 7 pkt 3 (kwoty otrzymane od nabywcy jako zwrot udokumentowanych
  wydatków, ponoszonych w imieniu i na rzecz nabywcy)

⭐⭐⭐ ART. 88 UST. 3a — WYŁĄCZENIA DOKUMENTOWE (najczęstsza podstawa
  odmowy odliczenia w sporach). NIE STANOWIĄ podstawy do obniżenia
  podatku należnego ani zwrotu — faktury i dokumenty celne, gdy:
  pkt 1 lit. a — sprzedaż udokumentowano fakturą/fakturą korygującą
    wystawioną przez **PODMIOT NIEISTNIEJĄCY**; lit. b — (uchylona)
  pkt 2 — transakcja udokumentowana fakturą **NIE PODLEGA OPODATKOWANIU
    ALBO JEST ZWOLNIONA** od podatku
  pkt 3 — (uchylony)
  pkt 4 — wystawione faktury / faktury korygujące / dokumenty celne:
    a) **STWIERDZAJĄ CZYNNOŚCI, KTÓRE NIE ZOSTAŁY DOKONANE** — w części
       dotyczącej tych czynności ⭐ TO JEST PODSTAWOWY ZARZUT PRZY
       PUSTYCH FAKTURACH PO STRONIE NABYWCY (lustrzane odbicie art. 108
       po stronie wystawcy — sekcja 4g wyżej)
    b) **PODAJĄ KWOTY NIEZGODNE Z RZECZYWISTOŚCIĄ** — w części dotyczącej
       tych pozycji ⭐ ZWRÓĆ UWAGĘ: wyłączenie jest CZĘŚCIOWE, nie
       obejmuje całej faktury — organ często stosuje je zbyt szeroko
    c) potwierdzają czynności, do których mają zastosowanie **art. 58 i
       art. 83 Kodeksu cywilnego** (nieważność bezwzględna, pozorność) —
       w części dotyczącej tych czynności
  pkt 5 — faktury/faktury korygujące wystawione PRZEZ NABYWCĘ
    (samofakturowanie) NIE ZOSTAŁY ZAAKCEPTOWANE przez sprzedającego
  pkt 6 — (uchylony)
  pkt 7 — wystawiono faktury z wykazaną kwotą podatku w stosunku do
    czynności opodatkowanych, dla których NIE WYKAZUJE SIĘ kwoty podatku
    na fakturze — w części dotyczącej tych czynności (m.in. odwrotne
    obciążenie / procedura marży)

□ UST. 3b — ust. 3a stosuje się ODPOWIEDNIO do DUPLIKATÓW faktur oraz
  KOLEJNYCH EGZEMPLARZY faktur
□ UST. 4 — wyłączenie dla podatników NIEZAREJESTROWANYCH jako VAT czynni
  zgodnie z art. 96, z wyłączeniem przypadków z art. 86 ust. 2 pkt 7
  ⭐ ORZECZNICTWO TSUE konsekwentnie ogranicza formalizm rejestracyjny —
  sama późniejsza rejestracja bywa uznawana za wystarczającą; ⚠️ zweryfikuj
  aktualną linię PRZED powołaniem
□ UST. 6 — wyłączenie dla podatku naliczonego z art. 86 ust. 2 pkt 4 lit.
  c przy WNT „sankcyjnym" z art. 25 ust. 2 (podanie polskiego numeru VAT
  UE, gdy towary kończą transport w innym państwie członkowskim)

⭐⭐ MAPA ZARZUTÓW I KONTRZARZUTÓW:
  ZARZUT organu: art. 88 ust. 3a pkt 1 lit. a (podmiot nieistniejący)
    → OBRONA: „nieistniejący" ≠ „wykreślony z rejestru"; wykaż FAKTYCZNE
      PROWADZENIE działalności przez kontrahenta w dacie transakcji
      (adres, personel, magazyn, transport, korespondencja)
  ZARZUT: art. 88 ust. 3a pkt 4 lit. a (czynność niedokonana)
    → OBRONA: dowody RZECZYWISTOŚCI świadczenia (WZ, CMR, protokoły,
      zdjęcia, korespondencja, przepływy pieniężne) + dobra wiara i
      należyta staranność wg orzecznictwa TSUE
  ZARZUT: art. 88 ust. 3a pkt 4 lit. b (kwoty niezgodne)
    → OBRONA: żądaj OGRANICZENIA wyłączenia DO POZYCJI zakwestionowanych
      — ustawa mówi „w części dotyczącej tych pozycji"
  ZARZUT: art. 88 ust. 1 pkt 4 (nocleg/gastronomia)
    → OBRONA: sprawdź, czy nie zachodzi wyjątek lit. c (odprzedaż
      noclegów) albo czy świadczenie nie jest elementem USŁUGI
      KOMPLEKSOWEJ o innym charakterze głównym

✅ [VER: lexlege.pl — pełny tekst art. 88 ustawy o VAT, Dz.U.2025.0.775
   t.j., stan prawny na 12.08.2026; pobrane 2026-08-12; brzmienie
   potwierdzone dodatkowo w arslege.pl i eureka.mf.gov.pl]
⚠️ [ZALECANA WERYFIKACJA ISAP]
```

---

## 4i. ⭐⭐⭐ ODLICZENIE CZĘŚCIOWE — PROPORCJA (art. 90), PREWSPÓŁCZYNNIK
(art. 86 ust. 2a–2h) I KOREKTA WIELOLETNIA (art. 91) — dodane 2026-08-12,
uzupełnienie luki #3 z audytu pokrycia VAT (dotąd cały mechanizm
odliczenia częściowego był nieobecny poza JEDNĄ wzmianką o art. 90 ust.
10c przy grupie VAT — dotyczy każdej działalności mieszanej: JST, ochrona
zdrowia, edukacja, finanse, NGO, spółdzielnie)

```
⭐⭐⭐ DWA ODRĘBNE, NAKŁADAJĄCE SIĘ MECHANIZMY — NIE MYLIĆ:
  ETAP 1 — PREWSPÓŁCZYNNIK (art. 86 ust. 2a): dzieli podatek naliczony
    między DZIAŁALNOŚĆ GOSPODARCZĄ a CELE INNE NIŻ działalność
    gospodarcza (np. działalność publicznoprawna gminy, działalność
    statutowa nieodpłatna)
  ETAP 2 — PROPORCJA / WSPÓŁCZYNNIK (art. 90 ust. 2): W RAMACH
    działalności gospodarczej dzieli podatek między czynności
    OPODATKOWANE a ZWOLNIONE
  ⭐ Podatnik może podlegać OBU ETAPOM JEDNOCZEŚNIE (najpierw pre-, potem
    współczynnik) — typowo gmina prowadząca odpłatny najem i sprzedaż
    zwolnioną obok zadań własnych

⭐⭐ ETAP 1 — PREWSPÓŁCZYNNIK (art. 86 ust. 2a–2h):
  □ Przesłanka: nabycia wykorzystywane ZARÓWNO do działalności
    gospodarczej, JAK I do celów innych, gdy PRZYPISANIE w całości do
    działalności gospodarczej NIE JEST MOŻLIWE
  □ Kryterium ustawowe (ust. 2b): sposób określenia proporcji ma
    NAJBARDZIEJ ODPOWIADAĆ SPECYFICE działalności i dokonywanych nabyć —
    zapewniać odliczenie wyłącznie w części przypadającej na działalność
    gospodarczą i obiektywnie odzwierciedlać wykorzystanie
  □ Przykładowe klucze (ust. 2c): OSOBOWY, GODZINOWY, OBROTOWY,
    POWIERZCHNIOWY — katalog OTWARTY
  □ Rozporządzenie MF z 17.12.2015 r. w sprawie sposobu określania
    zakresu wykorzystywania nabywanych towarów i usług do celów
    działalności gospodarczej w przypadku niektórych podatników
    (Dz. U. z 2015 r. poz. 2193) — narzuca klucz obrotowy m.in. JST,
    zakładom budżetowym, uczelniom, instytutom
  □ ⭐⭐⭐ ART. 86 UST. 2h — PRAWO WYJŚCIA POZA ROZPORZĄDZENIE: podatnik,
    dla którego sposób określenia proporcji wskazuje rozporządzenie,
    MOŻE zastosować INNY, BARDZIEJ REPREZENTATYWNY sposób, jeżeli uzna,
    że metoda rozporządzeniowa nie odpowiada specyfice jego działalności
    → CIĘŻAR ARGUMENTACJI PO STRONIE PODATNIKA: musi WYKAZAĆ, że metoda
      alternatywna jest BARDZIEJ WŁAŚCIWA, nie tylko korzystniejsza
    → ⭐ NAJCZĘSTSZY SPÓR PRAKTYCZNY: gospodarka wodno-kanalizacyjna JST
      — klucz metrażowy/ilościowy (m³ dostarczonej wody) zamiast klucza
      obrotowego z rozporządzenia; linia orzecznicza sądów
      administracyjnych jest tu w znacznej części KORZYSTNA dla gmin
    ⚠️ [SPRAWDŹ AKTUALNĄ LINIĘ ORZECZNICZĄ przed sporządzeniem pisma —
       użyj skilla orzeczenia-sadowe-v2; NIE powołuj sygnatur z pamięci]
  □ Korekta roczna prewspółczynnika: art. 90c (odesłanie do art. 91 ust.
    2–9); ust. 3 art. 90c ⭐ POZWALA przy korekcie przyjąć INNY sposób
    określania proporcji niż przyjęty na dany rok, jeżeli byłby bardziej
    reprezentatywny dla zakończonego roku

⭐⭐ ETAP 2 — PROPORCJA (art. 90):
  □ ust. 1 — OBOWIĄZEK odrębnego określenia kwot podatku naliczonego
    związanych z czynnościami dającymi prawo do odliczenia (alokacja
    bezpośrednia MA PIERWSZEŃSTWO przed proporcją)
  □ ust. 3 — proporcja = roczny obrót z czynności z prawem do odliczenia
    / całkowity obrót z czynności z prawem i bez prawa
  □ ust. 4 — ustalana PROCENTOWO w stosunku rocznym na podstawie obrotu
    ROKU POPRZEDNIEGO, ZAOKRĄGLANA W GÓRĘ do liczby całkowitej
  □ ust. 5 — do obrotu NIE WLICZA SIĘ dostawy środków trwałych i WNiP
    podlegających amortyzacji oraz gruntów i praw wieczystego
    użytkowania zaliczonych do środków trwałych — używanych na potrzeby
    działalności podatnika
  □ ust. 6 — NIE WLICZA SIĘ obrotu z transakcji POMOCNICZYCH w zakresie
    nieruchomości i pomocniczych transakcji FINANSOWYCH oraz usług z art.
    43 ust. 1 pkt 7, 12 i 38–41 w zakresie, w jakim mają charakter
    POMOCNICZY ⭐ „pomocniczość" to samodzielne, częste pole sporu
  □ ust. 8–9 — proporcja SZACUNKOWA gdy brak obrotu w roku poprzednim
    albo obrót był niższy niż **30 000 zł**, a także gdy podatnik uzna
    obrót za NIEREPREZENTATYWNY; ZAWIADOMIENIE naczelnika US do **25.
    dnia miesiąca** następującego po miesiącu pierwszego zastosowania,
    nie później niż w dniu przesłania ewidencji z art. 109 ust. 3
  □ ⭐ ust. 10 — PROGI ZAOKRĄGLENIA: proporcja > **98%** ORAZ kwota
    nieodliczona w skali roku < **10 000 zł** → można przyjąć **100%**;
    proporcja ≤ **2%** → można przyjąć **0%**
    ⚠️ WARUNEK KWOTOWY przy 98% JEST ŁATWY DO PRZEOCZENIA — sama
    proporcja powyżej 98% NIE WYSTARCZA
  □ ust. 10a–10b — w JST proporcję ustala się ODRĘBNIE DLA KAŻDEJ
    jednostki organizacyjnej (jednostka budżetowa, zakład budżetowy,
    urząd gminy / starostwo / urząd marszałkowski)
  □ ust. 10c–10g — grupa VAT (proporcja odrębnie dla każdego członka) i
    reguły po utracie statusu przez grupę / przywróceniu rejestracji z
    art. 96 ust. 9k

⭐⭐⭐ KOREKTA (art. 91) — NAJCZĘSTSZE ŹRÓDŁO NIEDOSZACOWANEGO RYZYKA:
  □ ust. 1 — korekta ROCZNA po zakończeniu roku, wg proporcji
    RZECZYWISTEJ dla zakończonego roku
  □ ⭐ ust. 1a–1b — MOŻNA NIE KOREGOWAĆ, gdy różnica proporcji ≤ **2
    PUNKTY PROCENTOWE**; przy proporcji rzeczywistej NIŻSZEJ — dodatkowo
    kwota nieodliczona (z różnicy proporcji + korekty z ust. 2, bez
    środków trwałych ≤ 15 000 zł) nie może przekraczać **10 000 zł**
  □ ⭐⭐⭐ ust. 2 — KOREKTA WIELOLETNIA: środki trwałe i WNiP podlegające
    amortyzacji oraz grunty i prawa wieczystego użytkowania zaliczone do
    środków trwałych, o wartości początkowej POWYŻEJ **15 000 zł**:
    → **5 KOLEJNYCH LAT** (roczna korekta = 1/5)
    → **10 LAT** dla NIERUCHOMOŚCI i praw wieczystego użytkowania
      gruntów (roczna korekta = 1/10), licząc OD ROKU ODDANIA DO
      UŻYTKOWANIA
    → wartość początkowa ≤ 15 000 zł — korekta JEDNORAZOWA po zakończeniu
      roku oddania do użytkowania
  □ ust. 2a — obowiązek korekty 10-letniej NIE dotyczy OPŁAT ROCZNYCH za
    użytkowanie wieczyste (stosuje się ust. 1)
  □ ust. 3 — korektę wykazuje się w deklaracji za PIERWSZY OKRES
    ROZLICZENIOWY roku następnego, a przy zakończeniu działalności — w
    deklaracji za OSTATNI okres
  □ ⭐ ust. 4–6 — SPRZEDAŻ w okresie korekty: przyjmuje się, że towar jest
    nadal wykorzystywany do czynności opodatkowanych AŻ DO KOŃCA okresu
    korekty, a korekty dokonuje się JEDNORAZOWO za cały pozostały okres.
    Jeżeli sprzedaż była ZWOLNIONA lub niepodlegająca — dalsze
    wykorzystanie traktuje się jako związane WYŁĄCZNIE z czynnościami
    zwolnionymi/niepodlegającymi → ⚠️ TO GENERUJE SKOKOWY ZWROT
    ODLICZONEGO VAT przy sprzedaży nieruchomości ze zwolnieniem z art. 43
    ust. 1 pkt 10 — LICZ TO PRZED podjęciem decyzji o opcji opodatkowania
    (patrz sekcja 4c)
  □ ust. 7–7d — korekta przy ZMIANIE PRAWA do odliczenia (nabycie z
    pełnym prawem, potem zmiana przeznaczenia i odwrotnie); ust. 7c —
    korekty NIE dokonuje się, jeżeli od końca okresu rozliczeniowego
    wydania do użytkowania upłynęło **12 MIESIĘCY**; ust. 7d — towary
    handlowe/surowce: korekta w deklaracji za okres, w którym nastąpiła
    zmiana
  □ ⭐ ust. 7e — podatnik korzystający ze zwolnień z art. 43 ust. 1 pkt 3,
    art. 113 ust. 1 albo art. 113a ust. 1 MOŻE skorygować podatek za
    pozostały okres korekty w deklaracji za OSTATNI okres, w którym był
    VAT czynnym
  □ ⭐⭐ ust. 9 — przy ZBYCIU PRZEDSIĘBIORSTWA LUB ZCP korekty z ust. 1–8
    dokonuje **NABYWCA** — to samodzielna, często pomijana pozycja
    ryzyka w due diligence transakcyjnym

□ POKREWNE KOREKTY SZCZEGÓLNE:
  → art. 90a — nieruchomość z art. 86 ust. 7b: zmiana stopnia
    wykorzystania w ciągu **120 MIESIĘCY** od oddania do użytkowania
  → art. 90b — pojazdy samochodowe: **60 MIESIĘCY** (a przy wartości
    początkowej ≤ 15 000 zł — **12 MIESIĘCY**); pełne opracowanie w
    mod-odliczenia-uzytek-mieszany-firma-prywatny-KUP.md

✅ [VER: lexlege.pl — pełny tekst art. 90, 90a, 90b, 90c i 91 ustawy o
   VAT, Dz.U.2025.0.775 t.j.; pobrane 2026-08-12. Art. 86 ust. 2a–2h i
   rozporządzenie Dz.U. 2015 poz. 2193 — potwierdzone w 4 niezależnych
   źródłach, w tym interpretacji KIS i opracowaniu KPMG]
✅ ZAMKNIĘTE 2026-08-20 (F-18) — metryka rozporządzenia z 17.12.2015 r.
   w sprawie sposobu określania zakresu wykorzystywania nabywanych
   towarów i usług do celów działalności gospodarczej w przypadku
   niektórych podatników (na podstawie art. 86 ust. 22 ustawy o VAT)
   POTWIERDZONA: Dz.U. 2015 poz. 2193 (isap.sejm.gov.pl, adres
   dokumentu WDU20150002193, widoczny w indeksowanych wynikach
   wyszukiwania + 6 zgodnych źródeł Rząd 2: infor.pl, inforlex.pl,
   przepisy.gofin.pl, vademecumpodatnika.pl, platformaedukacyjna.eu,
   izbapodatkowa.pl). ⭐ USTALENIE DODATKOWE: rozporządzenie doczekało
   się TEKSTU JEDNOLITEGO — Dz.U. 2021 poz. 999 z 2.06.2021, z
   późniejszą zmianą Dz.U. 2020 poz. 289 — ⚠️ ten t.j. NIE był dotąd
   przywoływany w module, rekomendacja: przy najbliższym audycie
   Ordynacji/VAT rozważyć aktualizację odesłania z "Dz.U. 2015 poz.
   2193" na "t.j. Dz.U. 2021 poz. 999" dla precyzji cytowania.
⚠️ [ZALECANA WERYFIKACJA ISAP — w szczególności aktualny status i tekst
   rozporządzenia z 17.12.2015 r., którego metryki NIE potwierdzono w
   źródle urzędowym]
```

---



---

## Połącz z
- DR-06/mod-VAT-podatek-od-towarow-i-uslug (moduł MACIERZYSTY)
- DR-06/mod-VAT-obowiazek-podstawa-zwolnienia-nieruchomosci
