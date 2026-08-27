# Moduł — VAT: obowiązek podatkowy, podstawa opodatkowania, zwolnienia przedmiotowe i nieruchomości, ulga na złe długi

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

## 4a. ⭐⭐⭐ OBOWIĄZEK PODATKOWY — ZASADY OGÓLNE (Dział IV Rozdział 1,
art. 19a ustawy VAT) — dodane 2026-08-12, uzupełnienie luki
zidentyfikowanej w audycie pokrycia DR-06 (dotąd CAŁKOWICIE nieobecne
poza momentem dla WNT — mechanizm FUNDAMENTALNY, decydujący w KTÓRYM
okresie rozliczeniowym wykazać podatek NALEŻNY)

```
⭐⭐⭐ ZNACZENIE PRAKTYCZNE: MOMENT powstania obowiązku podatkowego
  PRZESĄDZA, W KTÓREJ deklaracji/JPK_V7 NALEŻY wykazać podatek NALEŻNY
  — BŁĘDNE ustalenie SKUTKUJE albo ZANIŻENIEM (wykazanie ZA późno —
  ryzyko ODSETEK i sankcji), albo NIEPOTRZEBNYM przyspieszeniem
  rozliczenia (wykazanie ZA wcześnie — ryzyko ZAKWESTIONOWANIA przez
  organ z ODWROTNYCH przyczyn, choć rzadsze W praktyce)

⭐⭐⭐ ZASADA OGÓLNA (art. 19a ust. 1): obowiązek PODATKOWY powstaje Z
  CHWILĄ DOKONANIA dostawy towarów LUB wykonania USŁUGI — NIE Z chwilą
  wystawienia FAKTURY ani Z chwilą ZAPŁATY (⚠️ CZĘSTY błąd praktyczny:
  utożsamianie MOMENTU wystawienia faktury Z momentem powstania
  obowiązku — FAKTURA jest jedynie DOKUMENTEM potwierdzającym
  wcześniej POWSTAŁY obowiązek, NIE jego ŹRÓDŁEM, poza WYJĄTKAMI
  wskazanymi niżej)
  □ USŁUGI PRZYJMOWANE częściowo (ust. 2): usługę UZNAJE się za
    wykonaną RÓWNIEŻ w przypadku wykonania JEJ części, DLA KTÓREJ
    określono ZAPŁATĘ (np. ETAPY dużego projektu Z odrębnym
    wynagrodzeniem ZA każdy etap)

⭐⭐⭐ USŁUGI CIĄGŁE/ROZLICZANE OKRESOWO (ust. 3–4) — SZCZEGÓLNIE
  ISTOTNE dla umów O STAŁĄ obsługę (np. USŁUGI prawne AT/miesięczny
  ryczałt, najem, ABONAMENTY):
  □ USŁUGA, DLA KTÓREJ ustalane SĄ następujące PO sobie terminy
    płatności/rozliczeń → UZNAJE się za WYKONANĄ z UPŁYWEM każdego
    okresu, DO KTÓREGO odnoszą się TE płatności/rozliczenia — AŻ do
    ZAKOŃCZENIA świadczenia usługi
  □ USŁUGA świadczona W sposób CIĄGŁY przez okres DŁUŻSZY niż ROK,
    DLA KTÓREJ w DANYM roku NIE upływają terminy płatności/rozliczeń
    → UZNAJE się za wykonaną Z upływem KAŻDEGO roku podatkowego, AŻ
    do zakończenia ŚWIADCZENIA
  □ ⚠️ ORZECZNICTWO (WSA w Poznaniu, I SA/Po 1297/16): przepis TEN
    NIE odnosi się DO wszystkich usług POWTARZAJĄCYCH się, LECZ
    TYLKO do tych O charakterze RZECZYWIŚCIE ciągłym — GDZIE
    poszczególnych CZYNNOŚCI usługodawcy NIE sposób WYODRĘBNIĆ jako
    osobnych ŚWIADCZEŃ — ROZRÓŻNIENIE "usługa ciągła" vs "usługa
    powtarzalna, ale WYODRĘBNIALNA" jest ŹRÓDŁEM licznych sporów Z
    organami
  □ ⭐ TERMIN faktury PRZY usługach ciągłych: art. 106i ust. 1 —
    NIE później NIŻ 15. dnia MIESIĄCA następującego PO upływie
    okresu rozliczeniowego (LUB po otrzymaniu ZALICZKI w trakcie
    okresu) — POTWIERDZONE interpretacją KIS Z 3.06.2025 (sygn.
    0111-KDIB3-1.4012.212.2025.7.KO)

⭐⭐⭐ ZALICZKI, ZADATKI, PRZEDPŁATY (ust. 8) — ZASADA I WYJĄTEK:
  □ ZASADA: JEŻELI PRZED dokonaniem dostawy/wykonaniem usługi
    otrzymano CAŁOŚĆ lub CZĘŚĆ zapłaty (przedpłata, ZALICZKA,
    zadatek, RATA, wkład budowlany/mieszkaniowy) → obowiązek
    podatkowy POWSTAJE z CHWILĄ jej OTRZYMANIA, w ODNIESIENIU do
    otrzymanej KWOTY
  □ ⭐⭐⭐ WYJĄTEK KLUCZOWY (ust. 8 w zw. Z ust. 5 pkt 4) — ZALICZKA
    NIE rodzi obowiązku PODATKOWEGO przy: dostawie ENERGII
    elektrycznej/cieplnej/CHŁODNICZEJ, gazu PRZEWODOWEGO, usługach Z
    poz. 24–37, 50 i 51 ZAŁĄCZNIKA nr 3 (m.in. dostarczanie WODY,
    odprowadzanie ŚCIEKÓW, wywóz ODPADÓW), NAJMIE, dzierżawie,
    LEASINGU lub usługach O podobnym CHARAKTERZE, OCHRONIE osób/
    mienia, USŁUGACH stałej obsługi PRAWNEJ i BIUROWEJ — DLA tych
    świadczeń obowiązek PODATKOWY powstaje DOPIERO Z chwilą
    WYSTAWIENIA faktury (NIE z chwilą otrzymania zaliczki) —
    ⚠️ POTWIERDZONE liniami ORZECZNICZYMI WSA Kraków (I SA/Kr
    528/16) i NSA (I FSK 1842/16): SAMO ustalenie W umowie terminu
    zapłaty ZALICZKI ANI jej FAKTYCZNA zapłata NIE powoduje
    powstania obowiązku — TYLKO wystawienie FAKTURY
    → ⭐ PRAKTYCZNA DONIOSŁOŚĆ dla PRAKTYKI kancelaryjnej: umowy O
      stałą OBSŁUGĘ prawną Z miesięcznym RYCZAŁTEM należą DO tej
      kategorii — otrzymanie ZALICZKI od klienta NIE generuje
      obowiązku, DOPÓKI nie wystawiono FAKTURY

⭐⭐ SZCZEGÓLNE MOMENTY (ust. 5) — NAJWAŻNIEJSZE PRZYPADKI:
  □ pkt 1 — Z chwilą OTRZYMANIA całości/części ZAPŁATY: komis
    (wydanie TOWARU komisantowi), przeniesienie WŁASNOŚCI Z nakazu
    organu władzy W zamian za ODSZKODOWANIE, dostawa W trybie
    EGZEKUCJI (art. 18), usługi NA zlecenie sądów/prokuratury
    związane Z postępowaniem (Z wyjątkiem usług art. 28b
    stanowiących IMPORT usług), usługi ZWOLNIONE z art. 43 ust. 1
    pkt 37–41 (m.in. UBEZPIECZENIOWE/finansowe)
  □ pkt 3–4 — USŁUGI BUDOWLANE/budowlano-montażowe ORAZ dostawa
    KSIĄŻEK/czasopism (Z zastrzeżeniami) — SZCZEGÓLNY reżim ust. 7:
    GDY podatnik NIE wystawił faktury LUB wystawił JĄ Z opóźnieniem
    → obowiązek POWSTAJE z chwilą UPŁYWU terminu wystawienia
    faktury (art. 106i ust. 3–4), A gdy TERMINU nie określono — Z
    chwilą upływu TERMINU płatności
  □ pkt 4 — MEDIA (energia, gaz, woda, ŚCIEKI) i USŁUGI ciągłe
    wymienione WYŻEJ (najem, ochrona itd.) — obowiązek Z chwilą
    WYSTAWIENIA faktury (POWIĄZANE z wyjątkiem OD zaliczek, ust. 8,
    opisanym wyżej)

⭐ MOMENT DLA BONÓW JEDNEGO PRZEZNACZENIA (ust. 1a, 4a; art. 8a) —
  obowiązek PODATKOWY powstaje Z CHWILĄ dokonania TRANSFERU bonu
  jednego PRZEZNACZENIA (NIE z chwilą jego FAKTYCZNEGO wykorzystania)
  — ⭐ POWIĄZANIE z Rozdziałem 2a ustawy (opodatkowanie PRZY
  stosowaniu bonów) — TEMAT dotąd NIEOPISANY w tym module, SYGNAŁ do
  ewentualnego POGŁĘBIENIA przy sprawie Z udziałem bonów/voucherów

⭐ WNT, WDT, IMPORT TOWARÓW — ODESŁANIE: momenty SZCZEGÓLNE DLA tych
  kategorii transakcji SĄ uregulowane ODRĘBNIE (art. 20 dla WNT/WDT —
  patrz sekcja "WNT I IMPORT USŁUG" wyżej w TYM module, gdzie OPISANO
  termin 15. dnia miesiąca NASTĘPUJĄCEGO po dostawie).

  ✅ **ZWERYFIKOWANE (2026-08-19, F-35) — art. 19a ust. 9-11 dla importu
  towarów, PEŁNA treść aktualnej numeracji (Dz.U.2025.775 t.j.):**
  - **Ust. 9 (ZASADA OGÓLNA):** obowiązek podatkowy z tytułu importu
    towarów powstaje **z chwilą powstania DŁUGU CELNEGO**, z zastrzeżeniem
    ust. 10a i 11.
  - **Ust. 10a (PROCEDURA USZLACHETNIANIA CZYNNEGO — WYJĄTEK SZCZEGÓLNY):**
    obowiązek podatkowy powstaje **z chwilą ZAMKNIĘCIA procedury
    uszlachetniania czynnego** (zgodnie z art. 324 rozporządzenia
    wykonawczego UE 2015/2447 do unijnego kodeksu celnego) — NIE z
    chwilą powstania długu celnego jak w zasadzie ogólnej. ⭐ To
    KLUCZOWA różnica: przy uszlachetnianiu czynnym dług celny może w
    ogóle NIE powstać (towar wraca poza UE po przetworzeniu), więc
    ustawodawca powiązał obowiązek podatkowy z odrębnym zdarzeniem
    (zamknięciem procedury), nie z długiem celnym.
  - **Ust. 11 (PROCEDURY Z OPŁATAMI WYRÓWNAWCZYMI, BEZ DŁUGU CELNEGO):**
    dla procedur: składu celnego, odprawy czasowej z całkowitym
    zwolnieniem z należności celnych, uszlachetniania czynnego (inny
    wariant niż ust. 10a — z pobieraniem opłat wyrównawczych), tranzytu,
    wolnego obszaru celnego — JEŻELI pobierane są opłaty wyrównawcze/
    podobne, obowiązek podatkowy powstaje **z chwilą WYMAGALNOŚCI TYCH
    OPŁAT** (nie z chwilą długu celnego, bo dług celny w tych
    procedurach zwykle NIE powstaje jednocześnie z importem).
  ⭐⭐ **Wniosek praktyczny:** przy sprawie z procedurą uszlachetniania
  czynnego kluczowe pytanie brzmi: **który wariant** (ust. 10a — system
  zawieszeń bez opłat, czy ust. 11 — z opłatami wyrównawczymi)? To
  determinuje, czy licząca się data to zamknięcie procedury (10a) czy
  wymagalność opłaty (11) — pomylenie tych dwóch dat może prowadzić do
  błędnego wyliczenia terminu deklaracji/odliczenia VAT. Potwierdzone w
  5+ zgodnych źródłach: lexlege.pl, sip.lex.pl (t.j. aktualny), gofin.pl
  (historia numeracji), isp-modzelewski.pl, poradnikprzedsiebiorcy.pl,
  z przykładem realnej interpretacji indywidualnej KIS
  (0114-KDIP1-2.4012.311.2023.2.RM) potwierdzającej praktyczne stosowanie
  zasady ogólnej ust. 9.

Checklist praktyczny:
□ Czy USTALONO faktyczną datę DOKONANIA dostawy/wykonania usługi —
  NIE datę wystawienia FAKTURY ani datę ZAPŁATY — jako PUNKT wyjścia
□ Przy USŁUGACH rozliczanych okresowo — czy ŚWIADCZENIE rzeczywiście
  ma CHARAKTER ciągły (brak MOŻLIWOŚCI wyodrębnienia poszczególnych
  czynności), CZY to tylko usługa POWTARZALNA, lecz WYODRĘBNIALNA —
  RÓŻNE traktowanie na gruncie ust. 3–4
□ Przy OTRZYMANEJ zaliczce — czy ŚWIADCZENIE, którego DOTYCZY,
  znajduje SIĘ na LIŚCIE wyjątków ust. 5 pkt 4 (media, NAJEM, ochrona
  itd.) — JEŚLI tak, obowiązek POWSTAJE dopiero PRZY wystawieniu
  faktury, NIE przy wpłacie
□ Przy USŁUGACH budowlanych — czy FAKTURA została wystawiona W
  terminie (art. 106i ust. 3–4) — PRZY opóźnieniu obowiązek I TAK
  powstaje Z upływem tego TERMINU (nie można GO odroczyć przez
  zwłokę w FAKTUROWANIU)
□ Czy TRANSAKCJA nie jest OBJĘTA odrębnym reżimem szczególnym
  (WNT/WDT/import towarów/bony) WYMAGAJĄCYM odrębnej analizy

⚠️ Weryfikuj aktualne brzmienie art. 19a w ISAP — przepis ma LICZNE
  ustępy Z odesłaniami krzyżowymi (1a, 1b, 4a i in.), CZĘSTO
  nowelizowane PRZY okazji zmian W innych obszarach (KSeF, bony,
  interfejsy elektroniczne) — SPRAWDŹ najnowszą WERSJĘ przy
  konkretnej sprawie.
```

```
Obowiązkowe dla wszystkich czynnych podatników VAT
Składane elektronicznie: do 25. dnia miesiąca następnego
JPK_V7M: rozliczenie miesięczne
JPK_V7K: rozliczenie kwartalne (ale część ewidencyjna co miesiąc)

Błędy w JPK:
  → Korekta: złożona przed wszczęciem kontroli → skuteczna
  → Sankcja: korekta wymuszona (po wezwaniu organu) może nie zwolnić od sankcji
  → ⭐ SPROSTOWANE 2026-08-12: art. 109a przewiduje dodatkowe
    zobowiązanie podatkowe w wysokości **100% kwoty podatku** z faktury
    ujętej w ewidencji, gdy dotyczy ona sprzedaży potwierdzonej
    PARAGONEM BEZ NIP nabywcy — pełna treść i wyłączenia: sekcja 5 tego
    modułu (nie mylić z art. 112b–112c, sekcja 4e)
```

---

## 4b. ⭐⭐⭐ PODSTAWA OPODATKOWANIA I FAKTURY KORYGUJĄCE IN MINUS/IN PLUS
(Dział VI, art. 29a) — dodane 2026-08-12, uzupełnienie luki
zidentyfikowanej w audycie pokrycia DR-06 (dotąd CAŁKOWICIE nieobecne
— DRUGI z dwóch czynników, OBOK stawki, decydujących O wysokości VAT)

```
⭐⭐⭐ ZASADA OGÓLNA (art. 29a ust. 1): podstawą OPODATKOWANIA jest
  WSZYSTKO, co STANOWI zapłatę, KTÓRĄ dokonujący dostawy/usługodawca
  OTRZYMAŁ lub MA otrzymać Z tytułu sprzedaży OD nabywcy, usługobiorcy
  LUB osoby trzeciej — WŁĄCZNIE z otrzymanymi DOTACJAMI, subwencjami I
  innymi dopłatami O PODOBNYM charakterze, MAJĄCYMI bezpośredni WPŁYW
  na CENĘ (⭐ dotacja "DO ceny" WLICZA się do podstawy; dotacja NA
  pokrycie OGÓLNYCH kosztów działalności — CO do zasady NIE)
  → ⭐ TERMINOLOGICZNIE: dawne pojęcie "OBROTU" (sprzed 2014 r.) ZOSTAŁO
    zastąpione "PODSTAWĄ opodatkowania" — GDY starsze przepisy
    wykonawcze LUB orzecznictwo POSŁUGUJĄ się nadal SŁOWEM "obrót",
    NALEŻY je ROZUMIEĆ jako podstawę OPODATKOWANIA w OBECNYM stanie
    prawnym

⭐⭐ CO WLICZA SIĘ DO PODSTAWY (ust. 6):
  1) PODATKI, cła, opłaty I inne należności O podobnym charakterze,
     Z WYJĄTKIEM samego podatku VAT
  2) KOSZTY dodatkowe: PROWIZJE, koszty OPAKOWANIA, transportu I
     ubezpieczenia, POBIERANE przez dostawcę/usługodawcę OD nabywcy
     — ⭐ PRAKTYCZNA konsekwencja: KOSZT wysyłki/przesyłki DOLICZONY
     do sprzedaży NIE jest odrębnym ŚWIADCZENIEM opodatkowanym
     osobno — DZIELI stawkę VAT TOWARU głównego (świadczenie
     KOMPLEKSOWE)

⭐⭐⭐ CO NIE WLICZA SIĘ DO PODSTAWY (ust. 7) — CZĘSTY temat SPORNY:
  1) obniżka CEN w formie RABATU z tytułu WCZEŚNIEJSZEJ zapłaty
     (skonto)
  2) UDZIELONE nabywcy OPUSTY i obniżki CEN, uwzględnione W MOMENCIE
     sprzedaży (RABAT natychmiastowy — NIE wchodzi w OGÓLE do
     podstawy, W przeciwieństwie do rabatu UDZIELONEGO później,
     patrz ust. 10 niżej)
  3) kwoty OTRZYMANE od nabywcy jako ZWROT udokumentowanych wydatków
     PONIESIONYCH w IMIENIU i NA rzecz nabywcy, ujmowane
     PRZEJŚCIOWO w EWIDENCJI (tzw. "PRZEJŚCIÓWKI" — np. OPŁATY
     sądowe/skarbowe UISZCZONE przez pełnomocnika W imieniu klienta
     — ⭐ ISTOTNE dla PRAKTYKI kancelaryjnej: TAKIE kwoty NIE
     zwiększają podstawy OPODATKOWANIA honorarium, POD warunkiem
     właściwej DOKUMENTACJI i ewidencji PRZEJŚCIOWEJ)

⭐⭐⭐ OBNIŻENIE PODSTAWY PO SPRZEDAŻY (ust. 10) — RABAT POŚREDNI i
  BEZPOŚREDNI:
  □ podstawę OBNIŻA się o: kwoty UDZIELONYCH PO dokonaniu sprzedaży
    OPUSTÓW i obniżek CEN; WARTOŚĆ zwróconych towarów I opakowań (Z
    zastrzeżeniem ust. 11-12 — patrz OPAKOWANIA zwrotne niżej);
    zwróconą nabywcy CAŁOŚĆ/część zapłaty PRZED dokonaniem sprzedaży,
    jeśli DO niej NIE doszło; wartość ZWRÓCONYCH dotacji/subwencji
  □ ⭐⭐ RABAT POŚREDNI (art. 29a ust. 10 pkt 1, W ZW. z praktyką
    interpretacyjną): DOPUSZCZALNE jest OBNIŻENIE podstawy
    opodatkowania PRZEZ producenta/dystrybutora WYPŁACAJĄCEGO premię
    pieniężną BEZPOŚREDNIO na rzecz ODBIORCY OSTATECZNEGO (np.
    detalisty), Z KTÓRYM producent NIE ma bezpośredniej RELACJI
    sprzedażowej (transakcja PRZESZŁA przez pośrednika) — POD
    warunkiem, że RABAT nie jest WYNAGRODZENIEM za jakiekolwiek
    ŚWIADCZENIE wzajemne (np. SAMO osiągnięcie określonego OBROTU
    lub TERMINOWA zapłata NIE stanowią usługi — potwierdzone
    interpretacjami KIS, m.in. Z 3.06.2025 i 30.06.2023)

⭐⭐⭐ WARUNKI FORMALNE OBNIŻENIA — FAKTURA KORYGUJĄCA IN MINUS (ust.
  13-14) — ⚠️ ZASADNICZO ZMIENIONE OD 1.02.2026 (KSeF):
  □ ZASADA OGÓLNA (ust. 13): obniżenia PODSTAWY dokonuje SIĘ za
    okres, W KTÓRYM wystawiono FAKTURĘ korygującą — POD warunkiem
    POSIADANIA dokumentacji, Z KTÓREJ wynika, że: (a) UZGODNIONO Z
    nabywcą WARUNKI obniżenia oraz (b) WARUNKI te ZOSTAŁY spełnione
  □ ⭐⭐ "UZGODNIENIE" NIE wymaga odrębnego OŚWIADCZENIA — MOŻE
    wynikać z: postanowienia UMOWY handlowej (np. rabat PO
    przekroczeniu obrotu), REGULAMINU współpracy, PRZYJĘCIA zwrotu
    towaru W systemie, uznania REKLAMACJI, korespondencji MAILOWEJ
    — DECYDUJE uzgodnienie TREŚCI ekonomicznej, NIE formalna
    "akceptacja" samego DOKUMENTU faktury
  □ ⭐⭐⭐ NOWY MECHANIZM art. 29a ust. 13a (OD 1.02.2026, ZWIĄZANY z
    obowiązkowym KSeF): DLA faktur korygujących WYSTAWIONYCH jako
    faktura USTRUKTURYZOWANA (W KSeF) — sprzedawca OBNIŻA podstawę
    ZA okres, W KTÓRYM wystawił fakturę KORYGUJĄCĄ w SYSTEMIE (data
    PRZYJĘCIA przez KSeF PO pozytywnej walidacji) — BEZ konieczności
    POSIADANIA odrębnej dokumentacji POTWIERDZAJĄCEJ uzgodnienie —
    ⚠️ UPROSZCZENIE dotyczy TYLKO formy DOKUMENTU, NIE zwalnia z
    materialnego WARUNKU faktycznego ZAISTNIENIA przesłanek korekty
    (rabat, ZWROT, błąd) — SAMA obecność DOKUMENTU w systemie NIE
    tworzy AUTOMATYCZNIE prawa DO obniżenia VAT
  □ FAKTURA NIE-ustrukturyzowana (papierowa/PDF) — STARA zasada
    NADAL obowiązuje: obniżenie ZA okres OTRZYMANIA potwierdzenia
    otrzymania faktury KORYGUJĄCEJ przez nabywcę
  □ BRAK dokumentacji W momencie wystawienia KOREKTY (przy
    fakturach nie-ustrukturyzowanych) → obniżenia DOKONUJE się W
    rozliczeniu ZA okres, w KTÓRYM dokumentację TĘ uzyskano —
    ODROCZENIE, nie UTRATA prawa
  □ ⭐ WYJĄTKI od WYMOGU dokumentacji uzgodnienia (ust. 15): EKSPORT
    towarów i WDT; dostawy/usługi Z miejscem opodatkowania POZA
    Polską; sprzedaż ENERGII elektrycznej/cieplnej/gazu, USŁUGI
    dystrybucji energii, TELEKOMUNIKACYJNE i NIEKTÓRE inne z zał. 3;
    faktura korygująca W formie ustrukturyzowanej (KSeF — pkt WYŻEJ)

⭐⭐ ZWIĘKSZENIE PODSTAWY — KOREKTA IN PLUS (ust. 17) — ODMIENNE
  zasady TIMING niż PRZY in minus:
  □ JEŻELI przyczyną korekty jest BŁĄD w fakturze PIERWOTNEJ →
    księgowanie NASTĘPUJE wstecz, W okresie wystawienia FAKTURY
    pierwotnej (KOREKTA "historyczna")
  □ JEŻELI przyczyną jest NOWE zdarzenie (np. PODWYŻSZENIE ceny po
    fakcie, dodatkowe usługi DOLICZONE później) → korektę UJMUJE się
    NA bieżąco, w dacie JEJ wystawienia (BEZ cofania się do okresu
    pierwotnego)
  □ PRZY eksporcie towarów I WDT: zwiększenie podstawy NASTĘPUJE nie
    wcześniej NIŻ w deklaracji SKŁADANEJ za okres, W KTÓRYM wykazano
    TE transakcje (SPECYFICZNE ograniczenie czasowe)

⭐⭐ OPAKOWANIA ZWROTNE (ust. 11-12) — ⚠️ POWIĄZANE Z systemem
  KAUCYJNYM (nowelizacja OD 1.01.2025, art. 29a ust. 11a):
  □ Do PODSTAWY nie wlicza się WARTOŚCI opakowania, JEŻELI dostawca
    dokonał DOSTAWY w opakowaniu ZWROTNYM, pobierając KAUCJĘ (LUB
    określając ją W umowie) — dopóki OPAKOWANIE nie zostaje TRWALE
    "sprzedane"
  □ Do podstawy NIE wlicza się RÓWNIEŻ kaucji pobieranej ZA
    opakowanie OBJĘTE systemem KAUCYJNYM (butelki/puszki W systemie
    kaucyjnym WPROWADZONYM ustawą o gospodarce OPAKOWANIAMI — ⭐
    NOWY, odrębny REŻIM od "zwykłych" opakowań zwrotnych)
  □ ⭐⭐⭐ FIKCJA PRAWNA przy NIEZWRÓCENIU (ust. 12): jeśli nabywca NIE
    zwróci opakowania → PODSTAWĘ opodatkowania PODWYŻSZA się o
    WARTOŚĆ tego opakowania — W dniu NASTĘPUJĄCYM po dniu, W KTÓRYM
    umowa PRZEWIDYWAŁA zwrot (JEŚLI termin był OKREŚLONY) — traktuje
    SIĘ to jak FIKCYJNĄ dostawę opakowania NABYWCY w TYM dniu
  □ ⭐⭐ ZMIANA OD 1.02.2026 (art. 29a ust. 15c, DODANY nowelizacją Z
    16.06.2023, art. 1 pkt 2 lit. e — WESZŁA w ŻYCIE dopiero
    1.02.2026): dla OPAKOWAŃ objętych SYSTEMEM kaucyjnym —
    WPROWADZAJĄCY produkty W opakowaniach NA napoje PODWYŻSZA
    podstawę opodatkowania NA ostatni dzień ROKU o RÓŻNICĘ w
    wartości KAUCJI wynikającą Z wprowadzonych PRZEZ niego DO obrotu
    w DANYM roku opakowań — MECHANIZM roczny, ODRĘBNY od zasady
    "dzień PO terminie zwrotu" opisanej wyżej — ⚠️ TA regulacja jest
    ŚWIEŻA (weszła w życie w TRAKCIE bieżącej sesji audytowej) —
    SPRAWDŹ aktualne brzmienie PRZY sprawach Z branży NAPOJOWEJ/
    systemu kaucyjnego

⭐ ODESŁANIA DO PRZEPISÓW SZCZEGÓLNYCH (poza art. 29a):
  □ art. 30a — podstawa OPODATKOWANIA dla WNT (odpowiednie
    stosowanie art. 29a ust. 1-1b, 6, 7, 10, 11, 17)
  □ art. 30b — podstawa OPODATKOWANIA dla IMPORTU towarów — ✅
    **ZWERYFIKOWANE (2026-08-19, F-35), pełna treść ust. 1-6
    (Dz.U.2025.775 t.j.):**
    - **Ust. 1 (zasada ogólna):** wartość CELNA + należne CŁO (+ akcyza,
      jeśli towar akcyzowy).
    - **Ust. 2 (uszlachetnianie BIERNE):** różnica między wartością celną
      produktów przetworzonych/zamiennych dopuszczonych do obrotu A
      wartością towarów wywiezionych czasowo, + należne cło (+ akcyza).
    - **Ust. 3 (odprawa czasowa z częściowym zwolnieniem celnym):**
      wartość celna + cło, które BYŁOBY należne, gdyby towar był objęty
      procedurą dopuszczenia do obrotu (+ akcyza).
    - **Ust. 3a (uszlachetnianie CZYNNE z art. 324 rozp. 2015/2447):**
      WYŁĄCZNIE wartość celna (bez dodawania cła — bo w tej procedurze
      cło zwykle nie jest wymierzane w standardowy sposób).
    - **Ust. 4 (koszty dodatkowe):** DOLICZA się prowizje, opakowania,
      transport, ubezpieczenie — O ILE NIE zostały już wliczone do
      wartości celnej, PONIESIONE do PIERWSZEGO miejsca przeznaczenia
      na terytorium kraju.
    - **Ust. 6:** DOLICZA się także inne należności wymagane przez organy
      celne z tytułu importu.
    ⭐⭐ **Praktyczna pułapka:** ust. 3a (uszlachetnianie czynne) jest
    WYJĄTKIEM od reguły "wartość celna + cło" — TU cła się NIE dodaje,
    tylko sama wartość celna. Pomylenie z zasadą ogólną (ust. 1) prowadzi
    do zawyżenia podstawy opodatkowania. Potwierdzone w 6+ zgodnych
    źródłach: lexlege.pl, sip.lex.pl, mddp.pl, ifirma.pl, gofin.pl,
    izbapodatkowa.pl.
  □ art. 30c — PRZYPADKI, w KTÓRYCH podstawy opodatkowania SIĘ NIE
    ustala (bony RÓŻNEGO przeznaczenia — POWIĄZANIE z Rozdziałem 2a
    ustawy, DOTĄD nieopisanym w TYM module)
  □ art. 32 — SZACOWANIE podstawy PRZEZ organ PODATKOWY przy
    powiązaniach MIĘDZY stronami transakcji WPŁYWAJĄCYCH na CENĘ
    (odesłanie do CEN transferowych — ⭐ POWIĄZANIE Z mod-CIT,
    sekcja cen TRANSFEROWYCH, jeśli ISTNIEJE)

Checklist praktyczny:
□ Czy DANY element ceny/dopłaty WLICZA się do podstawy (ust. 6) CZY
  jest Z niej WYŁĄCZONY (ust. 7) — SZCZEGÓLNIE przy KOSZTACH
  dodatkowych (transport, OPAKOWANIE) i PRZEJŚCIÓWKACH
□ PRZY korekcie IN MINUS — czy POSIADANA jest dokumentacja
  UZGODNIENIA (chyba że FAKTURA jest USTRUKTURYZOWANA w KSeF — WTEDY
  wymóg ODPADA, ale materialne PRZESŁANKI nadal MUSZĄ być SPEŁNIONE)
□ Czy KOREKTA in plus wynika Z BŁĘDU pierwotnego (→ WSTECZ) czy Z
  NOWEGO zdarzenia (→ NA bieżąco) — TO PRZESĄDZA okres ROZLICZENIOWY
□ PRZY OPAKOWANIACH zwrotnych — czy TO "zwykłe" opakowanie CZY
  opakowanie W systemie KAUCYJNYM — RÓŻNE mechanizmy (dzień PO
  terminie ZWROTU vs roczne ROZLICZENIE różnicy od 1.02.2026)
□ Czy RABAT jest bezpośredni (KONTRAHENT bezpośredni) czy POŚREDNI
  (wypłacony DALSZEMU ogniwu łańcucha) — OBA typy MOGĄ obniżać
  podstawę, ALE wymagają INNEJ dokumentacji

⚠️ Weryfikuj aktualne brzmienie art. 29a w ISAP — przepis BYŁ
  WIELOKROTNIE nowelizowany (SLIM VAT, KSeF, system KAUCYJNY) —
  SZCZEGÓLNIE sprawdź, CZY dana zmiana (np. ust. 13a, 15c) JUŻ
  WESZŁA w życie NA dzień analizy KONKRETNEJ sprawy.
```

---

## 4c. ⭐⭐⭐ ZWOLNIENIA PRZEDMIOTOWE (art. 43) I VAT A NIERUCHOMOŚCI —
dodane 2026-08-12, uzupełnienie DWÓCH luk zidentyfikowanych w audycie
pokrycia DR-06 (dotąd CAŁKOWICIE nieobecne poza fragmentaryczną
wzmianką przy VAT marża — połączone W jedną sekcję, bo NIERUCHOMOŚCI
są NAJWAŻNIEJSZYM praktycznie podzbiorem zwolnień przedmiotowych)

```
⭐⭐ ROZRÓŻNIENIE od zwolnienia PODMIOTOWEGO (art. 113, opisanego
  wyżej): zwolnienie PRZEDMIOTOWE zależy OD rodzaju czynności, NIE od
  wysokości OBROTU — status podatnika (mały/duży) NIE ma znaczenia —
  podatnik NIE wybiera zwolnienia przedmiotowego DOBROWOLNIE (poza
  wyjątkami Z opcją opodatkowania, patrz NIŻEJ) — STOSUJE się je
  OBLIGATORYJNIE, gdy czynność MIEŚCI się w katalogu USTAWOWYM
⭐ ZASADA WYKŁADNI: zwolnienia PRZEDMIOTOWE, jako WYJĄTEK od zasady
  POWSZECHNOŚCI opodatkowania, NALEŻY interpretować ŚCIŚLE — bez
  wykładni ROZSZERZAJĄCEJ ani zawężającej WPROWADZAJĄCEJ pozaustawowe
  WARUNKI zwolnienia

⭐⭐⭐ NAJWAŻNIEJSZE KATEGORIE Z KATALOGU art. 43 ust. 1 (⚠️ katalog
  jest OBSZERNY — poniżej NAJCZĘŚCIEJ spotykane W praktyce, NIE
  pełna lista):
  □ pkt 1-2 — dostawa towarów WYKORZYSTYWANYCH wyłącznie NA cele
    działalności ZWOLNIONEJ, jeśli PRZY nabyciu/imporcie/wytworzeniu
    NIE przysługiwało prawo DO odliczenia VAT — ⭐ RYGORYSTYCZNE
    kryteria, W praktyce RZADKO stosowane przy zbywaniu NIERUCHOMOŚCI
  □ pkt 9-10a — DOSTAWA nieruchomości — patrz ROZBUDOWANA sekcja
    niżej
  □ pkt 17-41 — KATALOG opisowy (wprowadzony NOWELIZACJĄ od
    1.01.2011): usługi POCZTOWE powszechne, FINANSOWE (kredyty,
    pożyczki, gwarancje, TRANSAKCJE płatnicze, obrót WALUTAMI,
    zarządzanie FUNDUSZAMI), UBEZPIECZENIOWE i reasekuracyjne,
    EDUKACYJNE (kształcenie W systemie oświaty, w TYM szkoły
    NIEPUBLICZNE wpisane DO ewidencji JST, nauczanie PRYWATNE
    świadczone PRZEZ nauczycieli — pkt 29, m.in. KOREPETYCJE — ⚠️
    NIE obejmuje DORADZTWA), OPIEKA medyczna (świadczona PRZEZ
    podmioty LECZNICZE w RAMACH działalności LECZNICZEJ — pkt 18-19),
    usługi KULTURALNE (świadczone PRZEZ podmioty prawa PUBLICZNEGO
    lub INNE uznane instytucje KULTURY), transakcje DOTYCZĄCE walut/
    banknotów/monet jako PRAWNEGO środka płatniczego, krew/OSOCZE/
    ludzkie ORGANY, znaczki POCZTOWE sprzedawane PO wartości
    nominalnej, złoto DLA Narodowego Banku Polskiego
  □ ⭐ NAJEM lokali MIESZKALNYCH na cele MIESZKANIOWE (pkt 36) —
    ZWOLNIENIE OBLIGATORYJNE (bez opcji rezygnacji) — ⚠️ CZĘSTY
    przedmiot SPORÓW co DO faktycznego CELU najmu (mieszkaniowy VS
    inny, np. najem NA rzecz firmy w celu ZAKWATEROWANIA pracowników
    — WYMAGA odrębnej weryfikacji CELU rzeczywistego użytku)

⭐⭐⭐ VAT A NIERUCHOMOŚCI — art. 43 ust. 1 pkt 10 i 10a (KLUCZOWY,
  NAJCZĘSTSZY temat W praktyce transakcyjnej):
  □ ZASADA (pkt 10): dostawa BUDYNKÓW, budowli LUB ich części jest
    CO do zasady ZWOLNIONA — Z DWOMA WYJĄTKAMI wykluczającymi
    zwolnienie: (a) dostawa DOKONYWANA w RAMACH pierwszego
    zasiedlenia LUB przed NIM; (b) MIĘDZY pierwszym zasiedleniem A
    dostawą upłynął OKRES KRÓTSZY niż 2 LATA
  □ ⭐⭐⭐ DEFINICJA "PIERWSZEGO ZASIEDLENIA" (art. 2 pkt 14) —
    KLUCZOWA dla całej analizy: oddanie DO użytkowania PIERWSZEMU
    nabywcy/użytkownikowi LUB rozpoczęcie użytkowania NA potrzeby
    WŁASNE budynków/budowli/ich CZĘŚCI, PO: (a) wybudowaniu, LUB
    (b) ULEPSZENIU — JEŚLI wydatki na ULEPSZENIE (w rozumieniu
    przepisów O podatku dochodowym) STANOWIŁY co NAJMNIEJ 30%
    wartości POCZĄTKOWEJ — ⭐ ULEPSZENIE przekraczające TEN próg
    "ODNAWIA" pierwsze zasiedlenie — budynek PONOWNIE staje się
    "NOWY" na potrzeby TEGO przepisu, mimo WCZEŚNIEJSZEGO wieloletniego
    użytkowania
  □ ⭐ SZEROKA wykładnia "pierwszego ZASIEDLENIA" (utrwalona linia
    interpretacyjna): OBEJMUJE zarówno ODDANIE budynku w NAJEM PO
    wybudowaniu, JAK i wykorzystywanie NA potrzeby WŁASNEJ
    działalności GOSPODARCZEJ podatnika — W OBU przypadkach dochodzi
    DO "korzystania" Z budynku uruchamiającego BIEG terminu
  □ ⭐⭐⭐ ZWOLNIENIE "REZERWOWE" — pkt 10a: STOSUJE SIĘ TYLKO gdy
    dostawa NIE kwalifikuje się DO zwolnienia z pkt 10 (tj. GDY
    dostawa jest W ramach pierwszego zasiedlenia/przed NIM lub PRZED
    upływem 2 LAT) — WYMAGA łącznego SPEŁNIENIA DWÓCH przesłanek: (a)
    W stosunku DO budynku NIE przysługiwało dokonującemu DOSTAWY
    prawo DO obniżenia VAT naliczonego, (b) dokonujący DOSTAWY nie
    ponosił WYDATKÓW na jego ULEPSZENIE przekraczających 30% wartości
    początkowej (LUB ponosił, ale WYKORZYSTYWAŁ budynek W stanie
    ULEPSZONYM do CZYNNOŚCI opodatkowanych PRZEZ co NAJMNIEJ 5 LAT)
    — ⚠️ dotyczy WYŁĄCZNIE budynków "GOTOWYCH do oddania DO
    użytkowania" — NIE obejmuje OBIEKTÓW w TRAKCIE budowy (np. same
    ŁAWY fundamentowe)
  □ ⭐⭐⭐ OPCJA OPODATKOWANIA — REZYGNACJA ze zwolnienia (art. 43 ust.
    10-11) — DOSTĘPNA WYŁĄCZNIE dla zwolnienia Z pkt 10 (⚠️ NIE dla
    pkt 10a — TAM strony NIE mają możliwości wyboru opodatkowania):
    → WARUNKI: obie STRONY (dostawca I nabywca) SĄ zarejestrowanymi
      czynnymi PODATNIKAMI VAT ORAZ złożą, PRZED dniem dokonania
      dostawy, właściwemu DLA nabywcy naczelnikowi US ZGODNE
      oświadczenie O wyborze opodatkowania — OŚWIADCZENIE musi
      zawierać: dane IDENTYFIKACYJNE obu stron, PLANOWANĄ datę
      zawarcia UMOWY, adres NIERUCHOMOŚCI
    → ⭐⭐ SENS EKONOMICZNY: pozwala NABYWCY na ODLICZENIE VAT
      naliczonego (JEŚLI nieruchomość BĘDZIE wykorzystywana do
      czynności OPODATKOWANYCH) — BEZ opcji, VAT naliczony PRZY
      zakupie zwolnionym byłby KOSZTEM bezpowrotnym — ⭐ POWIĄZANIE Z
      PCC: wybór OPODATKOWANIA VAT WYŁĄCZA obowiązek ZAPŁATY PCC od
      nabycia (PCC I VAT wykluczają SIĘ wzajemnie CO do zasady — PATRZ
      niżej)
    → ⚠️ MOMENT złożenia OŚWIADCZENIA przy ZALICZCE/zadatku: JEŻELI
      strony PLANUJĄ opodatkowanie, oświadczenie MUSI być złożone
      PRZED dniem ZAPŁATY zaliczki, NIE tylko przed samą DOSTAWĄ —
      W PRZECIWNYM razie zaliczka ROZLICZANA jest jako ZWOLNIONA
      (potwierdzone interpretacją KIS Z 31.01.2020, aktualność
      SPRAWDŹ przy konkretnej sprawie)
    → ⭐⭐⭐ ROZBIEŻNOŚĆ ORZECZNICZA co do FORMY oświadczenia: WSA w
      Bydgoszczy (I SA/Bd 419/24, październik 2024) — brak
      FORMALNEGO oświadczenia z ust. 11 NIE dyskwalifikuje wyboru,
      JEŻELI z TREŚCI aktu notarialnego I okoliczności wynika ZGODNA
      wola stron CO do opodatkowania; NSA (I FSK 540/22, czerwiec
      2025) — PRZECIWNE stanowisko: BEZ oświadczenia spełniającego
      WSZYSTKIE ustawowe wymogi NIE MA skutecznej rezygnacji ze
      zwolnienia — ⚠️ ROZBIEŻNOŚĆ istnieje, NIE jest rozstrzygnięta
      jednolicie — PRZY REDAGOWANIU umowy/aktu notarialnego BEZPIECZNIEJ
      jest zawsze SPEŁNIĆ WSZYSTKIE formalne wymogi ust. 11 wprost,
      NIEZALEŻNIE od korzystniejszej linii WSA Bydgoszcz
    → ⭐ RYZYKO PRAKTYCZNE nieskutecznej rezygnacji (ex post):
      GDY organ PO LATACH stwierdzi, że rezygnacja NIE była skuteczna
      — sprzedawca WYKAZAŁ VAT nienależnie (BRAK prostej ścieżki
      zwrotu), nabywca TRACI prawo do odliczenia Z faktury — ⭐
      REKOMENDACJA: umowa/akt POWINIEN zawierać klauzule
      zabezpieczające NA wypadek zmiany KWALIFIKACJI przez organ
      (kto PONOSI dodatkowy VAT/utracone ODLICZENIE, korekta CENY,
      kto POKRYWA ewentualne PCC)
  □ ⭐ GRUNT dzieli LOS podatkowy budynku (art. 29a ust. 8 — POWIĄZANIE
    z sekcją 4b wyżej): PRZY dostawie budynku/budowli WRAZ z gruntem,
    NA którym są POSADOWIONE — wartości GRUNTU NIE wyodrębnia się Z
    podstawy opodatkowania — GRUNT "dzieli byt PRAWNY" budynku:
    JEŻELI budynek KORZYSTA ze zwolnienia, ZWOLNIONA jest RÓWNIEŻ
    dostawa gruntu (I odwrotnie — PRZY opodatkowaniu budynku,
    opodatkowany JEST też grunt)
  □ ⭐ DZIAŁKI NIEZABUDOWANE — odrębny reżim (art. 43 ust. 1 pkt 9):
    zwolniona jest DOSTAWA terenów NIEZABUDOWANYCH, INNYCH niż
    tereny BUDOWLANE — ⚠️ BRAK opcji rezygnacji Z tego zwolnienia
    (w przeciwieństwie DO pkt 10) — DZIAŁKA budowlana (objęta
    planem ZAGOSPODAROWANIA lub DECYZJĄ o warunkach zabudowy) jest
    OPODATKOWANA obligatoryjnie, NIE zwolniona

⭐⭐ VAT A PCC — WZAJEMNA WYŁĄCZNOŚĆ (odesłanie do mod-ustawa-PCC-i-
  podatek-spadkow-darowizn):
  □ ZASADA OGÓLNA: transakcja OPODATKOWANA VAT (w TYM zwolniona Z
    VAT, JEŚLI zwolnienie WYNIKA z przepisów O VAT) CO DO zasady NIE
    podlega RÓWNOCZEŚNIE PCC — sprzedaż NIERUCHOMOŚCI zwolniona Z
    VAT na PODSTAWIE pkt 10/10a (BEZ wyboru opcji opodatkowania) →
    NABYWCA płaci PCC (2% wartości RYNKOWEJ nieruchomości) — sprzedaż
    OPODATKOWANA VAT (w TYM PRZEZ wybór opcji Z ust. 10-11) → BRAK
    PCC po stronie NABYWCY
  □ ⭐ PRAKTYCZNA DECYZJA biznesowa: WYBÓR opodatkowania VAT (zamiast
    zwolnienia) PRZENOSI ciężar Z jednorazowego PCC (2%, KOSZT
    bezzwrotny) NA VAT (23%, ALE PODLEGAJĄCY odliczeniu PRZEZ
    nabywcę będącego CZYNNYM podatnikiem) — DLA nabywcy PROWADZĄCEGO
    działalność OPODATKOWANĄ, opcja VAT jest ZAZWYCZAJ korzystniejsza
  □ ⚠️ Szczegółowa ANALIZA relacji VAT-PCC (w TYM przypadki, GDY OBA
    podatki MOGĄ wystąpić RÓWNOCZEŚNIE przy CZĘŚCIOWYM zwolnieniu) —
    patrz mod-ustawa-PCC-i-podatek-spadkow-darowizn, JEŚLI zawiera
    tę tematykę; W PRZECIWNYM razie WYMAGA odrębnego opracowania

⭐ ODESŁANIE DO WIS: PRZY wątpliwości CO do zwolnienia KONKRETNEJ
  usługi (np. czy DANE świadczenie MIEŚCI się w kategorii
  "EDUKACYJNej" lub "MEDYCZNEJ") — WIS (sekcja wyżej W tym module)
  obejmuje RÓWNIEŻ zwolnienia, NIE tylko stawki obniżone

Checklist praktyczny (nieruchomości):
□ USTAL datę PIERWSZEGO zasiedlenia (art. 2 pkt 14) — sprawdź, czy
  budynek BYŁ kiedykolwiek ODDANY do użytkowania (najem, WŁASNA
  działalność) — I czy PÓŹNIEJSZE ulepszenia PRZEKROCZYŁY 30%
  wartości POCZĄTKOWEJ (co "ODNAWIA" pierwsze zasiedlenie)
□ POLICZ, czy od pierwszego ZASIEDLENIA do PLANOWANEJ dostawy minęły
  PEŁNE 2 LATA — jeśli TAK, zastosowanie ma PKT 10 (zwolnienie ZE
  swobodą wyboru OPODATKOWANIA); jeśli NIE, sprawdź WARUNKI pkt 10a
  (zwolnienie BEZ opcji)
□ JEŻELI planowana jest OPCJA opodatkowania — czy OBIE strony są
  CZYNNYMI podatnikami VAT, czy OŚWIADCZENIE zostanie złożone
  formalnie I przed właściwym TERMINEM (przed dostawą, a JEŚLI jest
  zaliczka — PRZED jej zapłatą)
□ Czy AKT notarialny/umowa zawiera WSZYSTKIE elementy oświadczenia Z
  ust. 11 WPROST (nie tylko OGÓLNĄ wzmiankę o VAT) — BIORĄC pod
  uwagę rozbieżność ORZECZNICZĄ WSA/NSA, bezpieczniej SPEŁNIĆ
  wszystkie wymogi FORMALNE
□ Czy w UMOWIE zabezpieczono strony NA wypadek ZAKWESTIONOWANIA
  kwalifikacji przez ORGAN (kto PONOSI dodatkowy VAT/PCC, korekta
  ceny)
□ Czy TO nieruchomość ZABUDOWANA (pkt 10/10a) czy NIEZABUDOWANA (pkt
  9) — RÓŻNE reżimy, przy DZIAŁCE budowlanej brak ZWOLNIENIA w ogóle

⚠️ Weryfikuj aktualne brzmienie art. 43 w ISAP — KATALOG jest
  OBSZERNY (ust. 1 ma KILKADZIESIĄT punktów) i BYŁ wielokrotnie
  nowelizowany. Śledź TAKŻE projekt DEREGULACYJNY zmian W VAT
  planowanych OD 1.10.2026 (skład VAT, split PAYMENT, limit
  zwolnienia PODMIOTOWEGO, odpowiedzialność SOLIDARNA) — NIE dotyczy
  bezpośrednio art. 43, ALE MOŻE wpływać NA powiązane mechanizmy —
  SPRAWDŹ status prac LEGISLACYJNYCH przy sprawach Z terminem BLISKO
  tej daty.
```

---

## 4d. ⭐⭐⭐ ULGA NA ZŁE DŁUGI (art. 89a–89b ustawy VAT) — dodane
2026-08-12, uzupełnienie luki zidentyfikowanej w audycie pokrycia
DR-06 (dotąd CAŁKOWICIE nieobecne — ISTOTNE narzędzie w sporach Z
niewypłacalnymi kontrahentami, WYSOKA częstotliwość w praktyce
kancelaryjnej przy WINDYKACJI należności handlowych)

```
⭐⭐⭐ ISTOTA MECHANIZMU: obowiązek rozliczenia VAT NALEŻNEGO co DO
  zasady istnieje NIEZALEŻNIE od tego, CZY podatnik OTRZYMAŁ zapłatę
  — ULGA na złe długi POZWALA wierzycielowi ODZYSKAĆ rozliczony
  wcześniej podatek NALEŻNY, gdy KONTRAHENT nie zapłacił — LUSTRZANE
  odbicie PO stronie dłużnika: OBOWIĄZEK skorygowania (ZMNIEJSZENIA)
  podatku NALICZONEGO, który wcześniej ODLICZYŁ, a NIE zapłacił

⭐⭐⭐ WIERZYCIEL — PRAWO do korekty (art. 89a):
  □ WARUNEK PODSTAWOWY (ust. 1a): nieściągalność WIERZYTELNOŚCI
    uważa się za UPRAWDOPODOBNIONĄ, gdy wierzytelność NIE została
    uregulowana LUB zbyta w JAKIEJKOLWIEK formie w CIĄGU 90 DNI od
    dnia UPŁYWU terminu jej PŁATNOŚCI określonego w UMOWIE lub na
    FAKTURZE — ⭐ LICZY się TERMIN płatności (NIE data wystawienia
    faktury ANI data transakcji) — TERMIN 90-dniowy liczony OD tej
    daty
  □ ⭐⭐ WARUNKI aktualne PO nowelizacji 1.10.2021 i wyroku TSUE
    C-335/19 (art. 89a ust. 2, ⚠️ ISTOTNIE ZMIENIONE względem
    starszego stanu prawnego): NA dzień poprzedzający dzień ZŁOŻENIA
    deklaracji, W której dokonuje SIĘ korekty: (a) WIERZYCIEL jest
    podatnikiem ZAREJESTROWANYM jako czynny PODATNIK VAT; (b) OD
    daty wystawienia FAKTURY dokumentującej wierzytelność NIE
    upłynęły 3 LATA, licząc OD końca roku, W KTÓRYM została
    WYSTAWIONA
  □ ⭐⭐⭐ USUNIĘTE wymogi (WYROK TSUE C-335/19 z 15.10.2020,
    STWIERDZAJĄCY niezgodność Z prawem UNIJNYM): DAWNIEJ wymagano
    RÓWNIEŻ, by (a) dłużnik BYŁ zarejestrowanym czynnym PODATNIKIEM
    VAT i (b) dłużnik NIE był W trakcie postępowania
    RESTRUKTURYZACYJNEGO/upadłościowego/likwidacji — OBA te warunki
    ZOSTAŁY USUNIĘTE nowelizacją OD 1.10.2021 — ⚠️ starsze materiały/
    komentarze MOGĄ wciąż BŁĘDNIE wymieniać te WARUNKI jako
    aktualne — SKORYGUJ przy cytowaniu
  □ ⭐⭐ DODATKOWA ścieżka DLA dłużników NIEBĘDĄCYCH podatnikami VAT
    czynnymi (art. 89a ust. 2a, dodany OD 1.10.2021): korekta MOŻLIWA,
    JEŻELI: (1) wierzytelność POTWIERDZONA prawomocnym orzeczeniem
    SĄDU i skierowana NA drogę postępowania EGZEKUCYJNEGO, LUB (2)
    wierzytelność WPISANA do rejestru DŁUGÓW prowadzonego na
    poziomie KRAJOWYM, LUB (3) wobec dłużnika OGŁOSZONO upadłość
    KONSUMENCKĄ — ⭐ ISTOTNE przy WIERZYTELNOŚCIACH wobec konsumentów/
    podmiotów NIEBĘDĄCYCH czynnymi podatnikami VAT
  □ ⭐ MOMENT korekty (ust. 3): W rozliczeniu ZA okres, W KTÓRYM
    nieściągalność UZNAJE się za uprawdopodobnioną (tj. OKRES, w
    KTÓRYM upłynął 90. dzień) — POD warunkiem, że DO dnia złożenia
    deklaracji ZA ten okres wierzytelność NIE została uregulowana/
    zbyta — ⚠️ korekty NIE dokonuje SIĘ wstecznie za OKRES pierwotnego
    wykazania FAKTURY — WYŁĄCZNIE na BIEŻĄCO, w okresie SPEŁNIENIA
    warunku 90 dni
  □ ⭐⭐ ODWRÓCENIE korekty PRZY późniejszej ZAPŁACIE (ust. 4): jeśli
    PO skorzystaniu z ulgi NALEŻNOŚĆ zostanie uregulowana LUB zbyta w
    jakiejkolwiek FORMIE — wierzyciel MA obowiązek zwiększenia
    podstawy OPODATKOWANIA i podatku NALEŻNEGO w rozliczeniu ZA
    okres, w KTÓRYM należność ZOSTAŁA uregulowana/zbyta — PRZY
    częściowym uregulowaniu — ZWIĘKSZENIE proporcjonalnie DO tej
    części
  □ ⭐ NASTĘPCY podatkowi: Z ulgi MOGĄ korzystać RÓWNIEŻ następcy
    podatkowi WIERZYCIELA (sukcesja PRAWNA)
  □ ⭐ BRAK obowiązku INFORMOWANIA dłużnika przez WIERZYCIELA o
    skorzystaniu Z ulgi — TO nie tylko uproszczenie ADMINISTRACYJNE,
    lecz świadome ROZWIĄZANIE ustawowe (dłużnik I TAK ma odrębny,
    SAMOISTNY obowiązek monitorowania WŁASNYCH zaległości płatniczych
    — patrz NIŻEJ)

⭐⭐⭐ DŁUŻNIK — OBOWIĄZEK korekty (art. 89b):
  □ ⭐⭐⭐ ZASADA (ust. 1): W przypadku NIEUREGULOWANIA należności W
    terminie 90 DNI od dnia upływu TERMINU płatności — dłużnik JEST
    OBOWIĄZANY do KOREKTY odliczonej kwoty PODATKU naliczonego
    wynikającej Z tej faktury, W rozliczeniu ZA okres, w KTÓRYM
    upłynął 90. dzień — ⭐⭐ OBOWIĄZEK ten jest NIEZALEŻNY od tego,
    czy WIERZYCIEL faktycznie SKORZYSTAŁ z ulgi PO swojej stronie —
    dłużnik MUSI korygować SAMODZIELNIE, z URZĘDU, niezależnie od
    działań kontrahenta
  □ WYJĄTEK: przepisu NIE stosuje się, GDY dłużnik ureguluje
    należność NAJPÓŹNIEJ w OSTATNIM dniu okresu rozliczeniowego, W
    KTÓRYM upłynął 90. dzień (tj. ZAPŁATA jeszcze W tym samym
    okresie ZWALNIA z obowiązku korekty)
  □ ⭐⭐⭐ ⚠️ NIESPÓJNOŚĆ MIĘDZY art. 89a i 89b PO nowelizacji
    1.10.2021 (sygnalizowana W piśmiennictwie, dotycząca DŁUŻNIKÓW
    w RESTRUKTURYZACJI): art. 89a (STRONA wierzyciela) NIE zawiera
    już WYŁĄCZENIA dla dłużników W restrukturyzacji/upadłości —
    JEDNAK art. 89b (STRONA dłużnika) W DOSŁOWNYM brzmieniu NADAL
    nakłada OBOWIĄZEK korekty NAWET gdy dłużnik jest W trakcie
    postępowania RESTRUKTURYZACYJNEGO w chwili UPŁYWU 90. dnia —
    ⭐ W piśmiennictwie WSKAZUJE się, że przepisy PRAWA
    restrukturyzacyjnego (chroniące MASĘ restrukturyzacyjną przed
    powstawaniem NOWYCH zobowiązań poza planem) MOGĄ mieć
    PIERWSZEŃSTWO przed art. 89b w TAKIEJ sytuacji — ⚠️ KWESTIA
    SPORNA i NIEJEDNOZNACZNIE rozstrzygnięta w PRAKTYCE — przy
    SPRAWIE z udziałem dłużnika W restrukturyzacji WYMAGANA jest
    odrębna, POGŁĘBIONA analiza (POWIĄZANIE z prawem
    RESTRUKTURYZACYJNYM, poza zakresem TEGO modułu)
  □ ⭐⭐ ODWRÓCENIE korekty PRZY późniejszej zapłacie PRZEZ dłużnika
    (ust. 4): PO uregulowaniu należności PO dokonaniu korekty —
    dłużnik MA prawo DO ponownego zwiększenia kwoty PODATKU
    naliczonego W rozliczeniu za OKRES, w KTÓRYM należność
    UREGULOWANO — PRZY częściowym uregulowaniu — zwiększenie
    proporcjonalnie DO tej części
  □ ⭐ PRZYPADEK SZCZEGÓLNY — dłużnik NIGDY nie odliczył podatku Z
    danej faktury (potwierdzone interpretacją KIS Z 14.09.2021, nr
    0113-KDIPT1-1.4012.544.2021.1.MSU): JEŚLI dłużnik NIE dokonał
    ODLICZENIA podatku PRZED upływem 90 dni — art. 89b W OGÓLE nie
    ma ZASTOSOWANIA (BRAK czego korygować) — DŁUŻNIK zachowuje
    PRAWO do odliczenia PO uregulowaniu zobowiązania, Z zastrzeżeniem
    OGÓLNEGO terminu art. 86 ust. 13 (5 LAT od początku roku, w
    KTÓRYM powstało prawo DO odliczenia)

⭐⭐ ASPEKTY TECHNICZNE — JPK_V7 (POWIĄZANIE z sekcją **5 NIŻEJ** w tym
  module — „Ewidencja VAT (JPK_V7), korekta ewidencji i sankcje
  ewidencyjne"; ⚠️ do 2026-08-12 odesłanie wskazywało na „sekcję 5
  wyżej", która NIE ISTNIAŁA — naprawione wraz z utworzeniem sekcji 5):
  □ Korekta ULGI NIE wymaga oznaczeń KODÓW GTU ani OZNACZENIA "WEW"
  □ WIERZYCIEL: pole "KorektaPodstawyOpodt" — art. 89a ust. 1 PRZY
    zaznaczaniu korekty NA minus (nieuregulowana należność), art.
    89a ust. 4 PRZY korekcie NA plus (późniejsza ZAPŁATA)
  □ DŁUŻNIK: pola P_46 (korekta Z art. 89b ust. 1 — TYLKO wartości
    ujemne LUB zero) i P_47 (zwiększenie PO uregulowaniu — art. 89b
    ust. 4) — BEZ standardowych pól ODLICZENIA
  □ OD stycznia 2022: WIERZYCIEL musi wykazywać W części
    ewidencyjnej JPK TERMIN płatności DLA dokumentów objętych ulgą —
    UMOŻLIWIA to organowi WERYFIKACJĘ, czy korekta PO stronie
    dłużnika (OBLIGATORYJNA) rzeczywiście NASTĄPIŁA
  □ ⭐ PRAKTYCZNA rekomendacja Z interpretacji (2026): WYDRUK z
    rejestru VAT NA stronie MF (biała LISTA) na DZIEŃ poprzedzający
    korektę STANOWI akceptowane POTWIERDZENIE statusu VAT dłużnika/
    wierzyciela — WARTO archiwizować JAKO dowód spełnienia warunków

⭐ PRZESUNIĘCIE terminu PŁATNOŚCI: jeśli STRONY (za zgodą OBU) chcą
  USTALIĆ nowy termin PŁATNOŚCI — MUSI to nastąpić W okresie, GDY
  NIE minęło jeszcze 90 dni OD pierwotnego terminu — NIEDOCHOWANIE
  tego (wg STANOWISKA organów) SKUTKUJE obowiązkiem rozliczenia ulgi
  MIMO późniejszej zmiany terminu

⭐ UMORZENIE zobowiązania: NIE stanowi "UREGULOWANIA należności" w
  rozumieniu USTAWY — umorzenie PRZEZ wierzyciela NIE zwalnia go z
  obowiązku WYKAZANIA podatku należnego (wg ulgi), a DŁUŻNIK traci
  PRAWO do odliczenia — SKUTKI SYMETRYCZNE do braku ZAPŁATY, nie
  identyczne Z "uregulowaniem"

Checklist praktyczny (WIERZYCIEL — dochodzenie ulgi):
□ Czy MINĘŁO 90 dni OD terminu płatności OKREŚLONEGO w umowie/na
  fakturze (NIE od daty WYSTAWIENIA faktury)
□ Czy na DZIEŃ poprzedzający złożenie DEKLARACJI wierzyciel jest
  CZYNNYM podatnikiem VAT ORAZ nie upłynęły 3 LATA od końca roku
  wystawienia FAKTURY
□ Jeśli DŁUŻNIK nie jest czynnym PODATNIKIEM VAT — czy SPEŁNIONA
  jest jedna Z alternatywnych przesłanek ust. 2a (WYROK sądu +
  EGZEKUCJA, wpis DO rejestru długów, upadłość KONSUMENCKA)
□ Czy KOREKTA ujęta jest W deklaracji za WŁAŚCIWY okres (moment
  upływu 90 DNI), nie retrospektywnie
□ Czy ARCHIWIZOWANY jest dowód STATUSU VAT kontrahenta (wydruk Z
  białej listy) NA właściwą datę

Checklist praktyczny (DŁUŻNIK — obrona/zgodność):
□ Czy termin 90 DNI od terminu płatności JUŻ upłynął — JEŚLI tak,
  obowiązek korekty JEST niezależny od DZIAŁAŃ wierzyciela
□ Czy DŁUŻNIK w ogóle wcześniej ODLICZYŁ VAT z DANEJ faktury — jeśli
  NIE, art. 89b nie ma ZASTOSOWANIA
□ PRZY dłużniku w RESTRUKTURYZACJI — flaguj JAKO obszar SPORNY,
  wymagający odrębnej analizy Z prawem restrukturyzacyjnym, NIE
  stosuj automatycznie DOSŁOWNEGO brzmienia art. 89b BEZ tej
  weryfikacji

⚠️ Weryfikuj aktualne brzmienie art. 89a-89b w ISAP — SZCZEGÓLNIE
  uważaj na STARSZE materiały cytujące WARUNKI sprzed nowelizacji
  1.10.2021 (WYMÓG statusu VAT dłużnika, WYŁĄCZENIE przy
  restrukturyzacji PO stronie wierzyciela) — TE wymogi ZOSTAŁY
  usunięte w WYNIKU wyroku TSUE C-335/19 i JUŻ NIE obowiązują PO
  stronie art. 89a.
```

---



---

## Połącz z
- DR-06/mod-VAT-podatek-od-towarow-i-uslug (moduł MACIERZYSTY)
- DR-06/mod-VAT-miejsce-swiadczenia-zwolnienia
- DR-06/mod-OP-ordynacja-podatkowa (nadpłata, sekcja 4a)
