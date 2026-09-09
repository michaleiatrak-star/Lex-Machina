# MOD-WYJATEK-GATE — Bramka wyjątków i przepisów szczególnych (WYJ-GATE)

> **Plik kanoniczny:** `shared/MOD-WYJATEK-GATE.md`
> **Wersja:** 2.1 | Utworzony: 2026-08-31 jako `MOD-UNIT-SWEEP.md` 1.0 (F-144),
> przebudowany i przemianowany 2026-08-31d — zakres rozszerzony z jednego
> zamiatania na cztery; 2.1 (2026-09-09, F-170/F-171) — S3 rozbite na dwie
> osie (strona chroniona / działalność regulowana), S4 uzupełnione o akt
> o etapowym stosowaniu
> **Wywołują:** `prawny-router-v3` (BRAMKA WYJĄTKÓW, przed KROK 4)
> **Nie jest** bramką weryfikacyjną — nie zastępuje `shared/PRAWO-HARDGATE.md`.
> Nie rozstrzyga sprawy; produkuje listę jednostek i aktów, których pominięcie
> trzeba świadomie uzasadnić.

---

## 1. PROBLEM, KTÓRY TEN MODUŁ ZAMYKA

> ⛔ **Weryfikacja punktowa przepisu nie wykrywa wyjątku, o którego istnieniu
> model nie wie. Sprawdza dokładnie to, o co sam siebie zapytał.**

HARD GATE zamyka pytanie „czy to, co cytuję, brzmi tak, jak twierdzę".
Kontrola temporalna (`shared/MOD-OS-CZASU-PRZESLANEK.md` §5,
`shared/TEMPORAL-LAW-CHECK.md`) zamyka pytanie „czy to właściwa wersja i reżim
na datę zdarzenia". Żadna nie zamyka pytania **„czy regułę, którą właśnie
powołałem, coś wyłącza, zawęża albo odsyła gdzie indziej"** — bo żeby je zadać,
trzeba już podejrzewać, że taki przepis istnieje. To jest wiedza negatywna
i nie da się jej dopisać do tablicy: tablica rośnie wyłącznie o pozycje raz już
przeoczone.

**Przypadek referencyjny (KAZUS 111, sesja 2026-08-31).** Odczytano art. 770
k.c. w brzmieniu właściwym dla umowy z 20.02.2011 — ze źródła, we właściwej
wersji czasowej, po poprawnym ustaleniu reżimu. Pominięto art. 770¹ k.c.,
dodany ustawą z 27.07.2002 i uchylony 25.12.2014, który dla
kupującego-konsumenta odsyłał umowę zawartą przez komisanta do przepisów
o sprzedaży konsumenckiej. Jednostka leżała w tym samym tytule, pod następnym
numerem. Wszystkie bramki weryfikacyjne zadziałały; żadna nie pyta o wyjątek.

---

## 2. DLACZEGO REGUŁA BRZMI „ZAMIATAJ ZAKRES", A NIE „SZUKAJ WYJĄTKU"

Reguła w brzmieniu „sprawdź, czy istnieje wyjątek albo przepis szczególny"
jest **ocenna** i dlatego bezużyteczna jako bramka:

```
(a) żeby ją wykonać, trzeba już podejrzewać, że wyjątek istnieje — a to jest
    dokładnie ta wiedza, której brak jest przyczyną błędu;
(b) nie da się zweryfikować jej wykonania z zewnątrz: nieobecności wyjątku
    nie sposób udowodnić, można tylko pokazać przeczytany zakres;
(c) warunek ocenny to udokumentowany tryb awarii tego systemu — F-113
    (reguła obecna w pliku, nieodpalająca) i F-119 (bramka samoraportująca).
```

Dlatego cel („nie przegap wyjątku") realizuje się przez **cztery policzalne
zamiatania** S1–S4. Każde z nich da się sprawdzić z zewnątrz pytaniem
„czy w odpowiedzi jest lista N pozycji z tego zakresu", bez wchodzenia
w merytorykę.

---

## 3. WYZWALACZ — MECHANICZNY

```
⛔ WYZWALACZ: KAŻDE powołanie jednostki redakcyjnej aktu prawnego
   w odpowiedzi, piśmie albo module.

⛔ ZAKAZ warunku ocennego. Wyzwalaczem NIE jest:
   „gdy przepis wygląda na powiązany z innymi" / „gdy sprawa jest złożona" /
   „gdy analiza tego wymaga".

Sprawdzian brzmi: CZY CYTUJESZ ARTYKUŁ? TAK → wykonaj S1…S4.
```

Dopuszczalne zawężenie (jedyne): przy powołaniu ≥6 jednostek z tego samego
aktu wykonaj zamiatanie **raz dla jednostki nadrzędnej**, obejmując wszystkie
powołane artykuły łącznie. Zawężenie dotyczy liczby odczytów, nie zakresu.

---

## 4. CZTERY ZAMIATANIA

> Wyjątki mieszkają w czterech miejscach. Zamiatanie tylko sąsiedztwa
> (wersja 1.0 tego modułu) pokrywało wyłącznie pierwsze z nich.

### S1 — SĄSIEDZTWO REDAKCYJNE

Odczytaj jednostkę nadrzędną zawierającą powołany artykuł, w wersji na datę
zdarzenia. Kolejność rozszerzania: rozdział → dział → tytuł.

```
ZAKRES MINIMALNY (nie podlega skróceniu):
  (a) artykuł poprzedzający i następujący;
  (b) ⛔ WSZYSTKIE artykuły z indeksem górnym przy tym samym numerze
      (art. X¹, X², X³ …) oraz przy numerze sąsiednim;
  (c) nagłówek jednostki nadrzędnej — nazwa bywa jedynym sygnałem zakresu
      podmiotowego;
  (d) artykuły oznaczone jako uchylone w wersji AKTUALNEJ, jeżeli na datę
      zdarzenia obowiązywały.
```

⛔ **Reguła indeksu górnego.** Artykuł `X¹` NIE jest częścią artykułu `X`.
To osobna jednostka, zwykle **dodana nowelizacją i zwykle stanowiąca lex
specialis albo odesłanie** — czyli dokładnie ta klasa przepisu, która
rozstrzyga sprawę i której punktowy odczyt nie widzi.

⛔ **Reguła kierunku czasu.** Bazy pokazują domyślnie stan aktualny. Przepis
uchylony po dacie zdarzenia jest tam niewidoczny albo pusty. Brak treści →
`⚠️ [NIEWERYFIKOWANE]`, nigdy „przepis nie istniał".

### S2 — KLAUZULE ZAKRESOWE JEDNOSTKI

Wyłączenia rzadko stoją przy przepisie, który wyłączają. Stoją na krawędziach
jednostki redakcyjnej.

```
ODCZYTAJ:
  (a) PIERWSZY artykuł działu/tytułu, w którym leży powołany przepis
      (typowo: zakres zastosowania, definicje, „ilekroć w dziale mowa o…");
  (b) OSTATNI artykuł tej jednostki (typowo: wyłączenia, odesłania,
      „przepisów niniejszego działu nie stosuje się do…");
  (c) jednostkę „PRZEPISY OGÓLNE" tej samej księgi/tytułu, jeżeli istnieje.

SZUKANE ZWROTY (lista otwarta, nie wyczerpująca):
  „nie stosuje się" · „stosuje się odpowiednio" · „chyba że" ·
  „przepisy … stosuje się do" · „z wyjątkiem" · „nie dotyczy".
```

### S3 — AKTY POWIĄZANE (lex specialis poza aktem)

> To jest zamiatanie, którego wersja 1.0 nie miała, a bez którego kazus 111
> i tak by nie wyszedł: wyłączenie rękojmi siedziało w **innej ustawie**,
> nie w kodeksie.

```
ODCZYTAJ dla aktu głównego, w wersji na datę zdarzenia:
  (a) listę aktów ZMIENIAJĄCYCH i ODSYŁAJĄCYCH (ELI: /references) —
      narzędzie robi to deterministycznie, patrz §6;
  (b1) OŚ STRONY CHRONIONEJ — czy na datę zdarzenia obowiązywał akt
      SEKTOROWY regulujący ten sam stosunek dla tej kategorii strony?
      (konsument · pacjent · pracownik · rolnik · najemca · inwestor ·
       beneficjent · uprawniony do zachowku · sygnalista — katalog OTWARTY)
  (b2) OŚ DZIAŁALNOŚCI REGULOWANEJ — czy któraś ze stron występuje w roli,
      z którą osobny akt wiąże własne obowiązki NIEZALEŻNIE od jej pozycji
      w stosunku podstawowym?
      (sponsor · nadawca · dostawca usługi · pośrednik · platforma ·
       instytucja obowiązana · administrator danych · zamawiający ·
       producent wyrobu — katalog OTWARTY)
      ⛔ b2 dodano 2026-09-09 (F-170). Luka źródłowa: akt sektorowy
      przywiązany do ROLI REGULOWANEJ, a nie do kategorii chronionej strony,
      pozostawał poza zasięgiem pytania (b) w brzmieniu 2.0 — zamiatanie
      wykonane literalnie i poprawnie NIE MOGŁO go wskazać, bo katalog
      obejmował wyłącznie role chronionej strony stosunku prywatnoprawnego.
      Obie osie zamyka się osobnym wpisem; „brak" jest wynikiem w każdej.
  (c) gdy TAK → który akt jest lex specialis i co z aktu głównego wypiera.

⛔ Wynik „brak" jest wynikiem i musi być zapisany. Milczenie nie jest
   odpowiedzią negatywną.
```

Ustalenie właściwego reżimu na tej podstawie prowadzi
`shared/MOD-OS-CZASU-PRZESLANEK.md` §5A (macierz trzyosiowa). Ten moduł
dostarcza kandydatów; tamten rozstrzyga, który reżim obowiązuje. Nie
duplikuj tablic.

### S4 — PRZEPISY PRZEJŚCIOWE

Dla każdej nowelizacji ujawnionej w S1–S3, która wchodzi w życie **między
datą zdarzenia a dniem dzisiejszym**, odczytaj przepisy przejściowe ustawy
zmieniającej.

⛔ **S4(b) — AKT O ETAPOWYM STOSOWANIU** (dodano 2026-09-09, F-171). Gdy akt
główny sam zawiera przepis o dacie rozpoczęcia stosowania (typowo ostatni
artykuł: „stosuje się od…", z wyliczeniem wyjątków rozdziałami, sekcjami lub
załącznikami), odczytaj TEN przepis w brzmieniu **AKTUALNYM**, nie
pierwotnym, i zapisz akt zmieniający harmonogram. Akt przesuwający wyłącznie
datę stosowania nie zmienia treści normy, więc **nie ujawnia się przy
odczycie samej normy** — S1–S3 go nie wskażą.
⛔ Zapis „akt X stosuje się zasadniczo od DATY" bez ustalenia, czy DATA
pochodzi z brzmienia pierwotnego czy aktualnego, jest wykonaniem FASADOWYM
tego zamiatania: pole wypełnione, kontrola niewykonana. Cezura bez przepisu przejściowego jest datą, nie regułą
stosowania. Procedura i tablica cezur: `MOD-OS-CZASU-PRZESLANEK.md` OŚ-5.4
i §5B — tu wyłącznie odesłanie, bez kopii.

---

## 5. BLOK WYJŚCIOWY (WIDOCZNY)

> ⛔ Krok niewidoczny w dostarczonym tekście jest krokiem, który można pominąć
> bez śladu.

```
WYJ-GATE: art. 770 k.c. (Dz.U. 1964 nr 16 poz. 93), stan na 20.02.2011
  S1 sąsiedztwo — tytuł XXIV: art. 769 (brak), art. 770¹ ⚑ ODSYŁA:
     kupujący-konsument → przepisy o sprzedaży konsumenckiej, art. 771 (brak)
  S2 krawędzie jednostki — art. 765 (zakres), art. 773 (brak wyłączeń)
  S3 akty powiązane — ⚑ ustawa z 27.07.2002 o szczególnych warunkach sprzedaży
     konsumenckiej: art. 1 ust. 4 wyłącza art. 556–581 k.c.
  S4 przepisy przejściowe — cezura 25.12.2014 późniejsza niż zdarzenie,
     bez wpływu
```

Forma skrócona (zero trafień) — dwie linie:
`WYJ-GATE: art. 222 k.c., dział V. S1 sąsiedzi 221/223 — brak. S2 krawędzie
działu — brak wyłączeń. S3 b1 brak aktu sektorowego, b2 brak roli
regulowanej. S4 nie dotyczy.`

⛔ Pozycja S3 zamyka się dopiero po zapisaniu OBU osi (b1 i b2). Wpis „S3
brak" bez rozróżnienia osi liczy się jako zamiatanie niewykonane (F-170).

⛔ Każda z czterech pozycji musi wystąpić. Pominięcie zamiatania = bramka
niewykonana, nawet gdy wynik i tak byłby pusty.

---

## 6. ZAKAZ OSI DOMYŚLNYCH

Wynik S2 i S3 zależy od tego, kim są strony. Przepis szczególny bywa
adresowany do konsumenta, przedsiębiorcy, rolnika, pacjenta albo pracownika
i nie odpali, jeżeli status strony zostanie **założony** zamiast ustalony.

```
⛔ Gdy status strony, charakter umowy albo rola zbywcy nie wynikają
   ze stanu faktycznego → ⬛ [UZUPEŁNIJ], nigdy wartość domyślna.
⛔ Zakaz cichego przyjęcia „konsument", „zwykła sprzedaż", „obrót
   profesjonalny" — brak informacji jest stanem, nie wartością.
```

---

## 7. WSPARCIE NARZĘDZIOWE

`audyt-systemu-v4/scripts/check_wyjatek_gate_eli.py` (test T20):

- `--article` → buduje zakres **S1** (sąsiedzi, indeksy górne, nagłówek);
- `--edges` → wskazuje kandydatów **S2** (pierwszy i ostatni artykuł jednostki);
- `--references` → pobiera z ELI listę aktów powiązanych, materiał do **S3**.

Skrypt **nie ocenia wpływu** — klasyfikacja „wyłącza / zawęża / odsyła"
pozostaje decyzją merytoryczną. Narzędzie, które by ją zgadywało, produkowałoby
fasadę. Przy braku dostępu do API wykonaj S1–S3 ręcznie i oznacz źródła zgodnie
z `shared/PRAWO-HARDGATE.md`.

---

## 8. GRANICE MODUŁU — nazwane wprost

1. **S3 jest tak dobre, jak kompletność rejestru odesłań.** Akt sektorowy,
   który nie odsyła wprost do aktu głównego, nie pojawi się na liście ELI —
   wtedy jedynym mechanizmem pozostaje pytanie zamknięte S3(b).
2. **Nie zastępuje HARD GATE.** Każda jednostka wypisana w S1–S3 i użyta
   w wywodzie przechodzi normalną weryfikację ze statusem.
3. **Kosztuje odczyty** — do trzech na akt (S1 i S2 zwykle z jednego odczytu
   jednostki nadrzędnej, S3 osobno). Koszt jest świadomy: przeoczony wyjątek
   kosztuje rozstrzygnięcie.
4. **Generuje pozycje bez znaczenia.** Większość zamiatań zamknie się wynikiem
   „brak". Nie tłum listy, żeby wyglądała czyściej — to ten sam kompromis co
   pełna siatka interwałów w OŚ-2.
5. ⚠️ **Obecność tego modułu w pliku NIE dowodzi zmiany zachowania.** Bramka
   jest samoraportująca, klasa F-119. Jedynym dowodem skuteczności jest test
   z grupą kontrolną wg `audyt-systemu-v4/references/PLAN-TESTU-BRAMEK-F113.md`.
   Do czasu pomiaru (F-144, część otwarta) deklaracja „system łapie wyjątki"
   jest nieuprawniona. Wyzwalacz jest jednak liczbowy, więc pominięcie da się
   wykryć mechanicznie: policz artykuły w wyjściu i sprawdź, czy każdy ma blok
   WYJ-GATE z czterema pozycjami.

---

## 9. WYWOŁANIE

```
view shared/MOD-WYJATEK-GATE.md
```

Konsumenci i punkty wpięcia:

| Skill | Punkt | Warunek | Stan wpięcia |
|---|---|---|---|
| `prawny-router-v3` | BRAMKA WYJĄTKÓW, przed KROK 4 | ≥1 powołany artykuł | ✅ WPIĘTE (3.36) |
| `analizator-przepisow-v2` | Moduł 1/1H (odczyt brzmienia) | zawsze | ⬛ NIEWPIĘTE — zakres F-144 |
| `pisma-procesowe-v3` | PRE-W2 | pismo z podstawą prawną | ⬛ NIEWPIĘTE — zakres F-144 |

⛔ Wiersze `⬛ NIEWPIĘTE` opisują wpięcie **zamierzone, jeszcze niewykonane**.
Dopóki tam stoją, moduł NIE uruchomi się z tych skilli — nie zakładaj, że
uruchomi. „Moduł-widmo" (deklarowany konsument bez faktycznego wywołania) to
klasa błędu wykrywana testem T18.

---

## 10. HISTORIA NAZWY

Wersja 1.0 nosiła nazwę `MOD-UNIT-SWEEP.md` i miała jedno zamiatanie
(sąsiedztwo redakcyjne). Nazwa opisywała **czynność**, nie cel, przez co
mechanizm wyglądał na wąską sztuczkę zamiast na regułę ogólną — i faktycznie
pokrywał tylko jedno z czterech miejsc, w których mieszkają wyjątki. Zmiana
nazwy i zakresu nastąpiła na uwagę użytkownika w tej samej sesji, przed
pierwszym użyciem produkcyjnym. Plik `MOD-UNIT-SWEEP.md` NIE pozostaje
w bibliotece — dwie nazwy tego samego mechanizmu to klasa błędu opisana
w `shared/DEDUPLICATION-POLICY.md`.
