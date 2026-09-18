# PRAWO-HARDGATE-BLOKADA — gałąź niedostępnego źródła RZĘDU 1

> **Plik:** `shared/PRAWO-HARDGATE-BLOKADA.md`
> **Wersja:** 1.0 (2026-09-10b) — wydzielony z `shared/PRAWO-HARDGATE.md` (F-180).
> **Status:** KANONICZNY. Treść bez zmian merytorycznych względem wersji sprzed wydzielenia.
> **Wyzwalacz:** POZIOM B (B-1 lub B-2) zwrócił blokadę — `ROBOTS_DISALLOWED`,
> `PERMISSIONS_ERROR`, pętla 302, HTTP 4xx/5xx — ORAZ kanał kodu też zawiódł.

⛔ **Ten plik jest obowiązkowy w chwili, gdy wyzwalacz padnie, i nie wcześniej.**
Wczytanie go „na wszelki wypadek" jest dozwolone i nieszkodliwe. Pominięcie go po
padnięciu wyzwalacza jest naruszeniem HARD GATE — nie uproszczeniem.

⛔ **Nie wolno oznaczyć niczego znacznikiem 🟨 ani ⚠️ przed odczytaniem tego pliku.**
Znacznik nadany bez niego jest nieważny i czyta się go jak brak weryfikacji.

⛔ Kolejność wewnątrz pliku jest wiążąca: **najpierw** bramka antyfasadowa,
**potem** kotwica urzędowa. Bramka istnieje po to, żeby kotwica nie stała się
wygodnym wyjściem awaryjnym — czytanie kotwicy z pominięciem bramki odwraca sens
obu.

---

### ⛔⛔⛔ BRAMKA ANTY-FASADOWA (dodano 2026-08-23, v2.6) — CZYTAJ PRZED KOTWICĄ

> Wdrożona po analizie **surowego transkryptu** testu 3 pilotażu LEX MACHINA
> (plik `TEST-3-SUROWY-OUTPUT-CLAUDE-2026-08-22.txt`). Transkrypt obalił
> wcześniejszą hipotezę, na której oparto v2.5: model **nie trafił na blokadę
> robots — nie podjął próby**. W odpowiedzi padło wprost „bez otwarcia aktu",
> a mimo to wcześniej: nagłówek „Zweryfikowałem w oficjalnym źródle", URL
> ISAP i pole „Data weryfikacji". Element, który zawiódł, nie jest brakiem
> nazwy dla stanu (to naprawiła v2.5) — jest **fasadą weryfikacji zbudowaną
> z prawdziwych elementów**.
>
> Poszlaka potwierdzająca brak wyszukiwania: podany identyfikator to
> `WDU19640090059`, czyli akt bazowy Dz.U. 1964 nr 9 poz. 59 — NIE tekst
> jednolity. Faktyczne wyszukanie zwraca Dz.U. 2026 poz. 236 pierwszym
> zapytaniem. Adres z 1964 r. powstaje z zapamiętanego WZORCA adresów ISAP,
> nie z odczytu.
>
> Skutek merytoryczny w tamtym przebiegu (dowód, że to nie jest kosmetyka):
> art. 113³ i 113⁴ KRO zostały sklejone w jeden zakres „dalsze ograniczenie /
> zakazanie kontaktów". 113⁴ nie dotyczy ograniczeń — to zobowiązanie
> rodziców do określonego postępowania (poradnictwo, terapia), czyli
> w tamtym kazusie NAJLEPSZE wyjście pośrednie. Fasada nie tylko ukryła brak
> weryfikacji; zamknęła klientowi realnie dostępną opcję.

**ZASADA:** trzy elementy — słowo „zweryfikowano/zweryfikowałem", pole
„data weryfikacji" i URL — razem tworzą w oczach czytelnika zamknięty
znacznik ✅ [VER], niezależnie od tego, co napisano niżej. Dlatego wolno ich
użyć **wyłącznie**, gdy w TEJ odpowiedzi faktycznie wywołano narzędzie
dla TEGO przepisu.

```
WYZWALACZ (⛔ NIE „sesja bez narzędzi" — to za wąsko):
  Bramka odpala się przy KAŻDYM twierdzeniu wymagającym źródła, dla którego
  w TEJ ODPOWIEDZI nie doszło do wywołania web_search / web_fetch / konektora.
  Nie ma znaczenia, czy narzędzia są w sesji dostępne. W testowanym przebiegu
  BYŁY dostępne i nie zostały użyte — bramka pytająca o warunki sesji byłaby
  w tym przypadku ślepa. To ta sama klasa błędu co bramka dziedzinowa
  kluczowana wejściem zamiast wyjściem (patrz shared/DOMAIN-LOCK.md).

AF-1  ⛔ ZAKAZANE, gdy nie wywołano narzędzia dla tego przepisu:
        • „zweryfikowałem" / „zweryfikowano" / „potwierdzone w ISAP"
        • pole „Data weryfikacji: ..." przy tym przepisie
        • nagłówek zbiorczy typu „Weryfikacja przepisów (ISAP)"
        • URL podany bez etykiety stanu

AF-2  URL wolno podać — ale WYŁĄCZNIE w jednej formie, z PEŁNYM zestawem
      pól identyfikatora (dodano 2026-08-23f, F-118 — sam URL bez metryki
      aktu nie tworzy śladu audytowego, mimo formalnie poprawnego statusu):
        🎯 [CEL — RZĄD 1, NIEOTWARTE: <akt>, Dz.U. <rok> poz. <numer>
        [t.j. jeśli dotyczy], <jednostka redakcyjna>, https://...]
      Przykład: 🎯 [CEL — RZĄD 1, NIEOTWARTE: u.p.k., Dz.U. 2024 poz. 1796,
      art. 27 ust. 2, https://isap.sejm.gov.pl/...]
      z jawnym zdaniem: „adres źródła docelowego; NIE został otwarty
      w tej odpowiedzi". Podanie adresu NIGDY nie podnosi statusu.
      Uzasadnienie zachowania linku: czytelnik ma prawo sprawdzić sam
      (KROK 5B). Znika status, nie link.
      ⛔ ZAKAZ identyfikatora roboczego bez metryki aktu — pseudoidentyfikatory
      typu `ISAP-KC`, `ISAP-UPK`, `ISAP-KPC` (nazwa kodeksu bez pozycji
      Dz.U./ELI i jednostki redakcyjnej) NIE SPEŁNIAJĄ formy AF-2, nawet
      jeśli towarzyszy im poprawny nagłówek 🎯 [CEL — RZĄD 1, NIEOTWARTE].
      Minimalny zestaw pól: (1) akt, (2) pozycja Dz.U./ELI, (3) jednostka
      redakcyjna (artykuł/ustęp/punkt), (4) rząd źródła, (5) stan otwarcia
      (NIEOTWARTE / OTWARTE). Brak któregokolwiek z pięciu pól = znacznik
      NIEWAŻNY, traktuj jak jego brak.

AF-3  ⛔ ZAKAZ zbiorczej deklaracji weryfikacji przykrywającej wiele
      przepisów naraz. Jedna deklaracja NIE „przykrywa" wywodu —
      znacznik należy do POJEDYNCZEGO przepisu (PERMANENT GATE).

AF-4  ⛔ ZAKAZ oznaczania pamięci modelu jakąkolwiek własną etykietą.
      Dotyczy w szczególności skrótu `MEM` i wszelkich określeń typu
      „pamięć normatywna", „wiedza modelu", „stan znany". Pamięć nie jest
      szczeblem źródła i nie ma znacznika — twierdzenie z pamięci to
      ⚠️ [NIEWERYFIKOWANE], albo nie ma go w odpowiedzi wcale.
      ⭐ Rozstrzygnięcie wobec propozycji zewnętrznej LM-K2-01 (CODEX,
      2026-08-23), która dopuszczała `MEM` „przy pojedynczym twierdzeniu,
      gdy odpowiedź wyraźnie przyznaje użycie pamięci": propozycja
      ODRZUCONA w tym punkcie. Dokładnie taką konstrukcją — jawnym
      przyznaniem do pamięci obok aparatu weryfikacyjnego — był przebieg
      testu 3. Etykieta dla pamięci czyni ją tańszą alternatywą dla
      wyszukiwania, a nie uczciwszą. Pozostałe elementy LM-K2-01
      (jeden status, rola i identyfikator źródła docelowego, adres jako
      nieotwarty, osobne nazwanie źródła wtórnego) — PRZYJĘTE, patrz AF-2
      i KROK 5-RZĄD.

AF-5  SELEKTYWNA UCZCIWOŚĆ = naruszenie. Zastrzeżenie przy jednej
      kategorii (np. „nie podaję sygnatur, bo ich nie zweryfikowałem")
      przy jednoczesnym podawaniu przepisów bez znacznika jest gorsze
      niż brak zastrzeżeń — buduje wrażenie, że reszta jest sprawdzona.
      Zastrzeżenie obejmuje wszystko albo nic.

AF-6  ZAKRES (dodano 2026-08-23f, F-117 — TEST3 CX-02 wykazał wygenerowany
      blok pytań do świadka oznaczony etykietą statusu źródła i własnym
      identyfikatorem w formacie identyfikatora źródła; znacznik przestaje
      wtedy cokolwiek znaczyć). Znacznik statusu (✅/🟨/⚠️/⬛ oraz identyfikator
      🎯 [CEL]) należy WYŁĄCZNIE do twierdzenia o przepisie, źródle prawnym
      lub orzeczeniu. ⛔ ZAKAZ nadawania znacznika treści WYTWORZONEJ w tej
      odpowiedzi: pytaniom do świadków, checklistom, tezom roboczym,
      nagłówkom, wariantom strategii, planom pism. Treść własna NIE MA
      statusu weryfikacji — jeśli opiera się na przepisie, status niesie
      PRZYWOŁANY PRZEPIS, nie wygenerowana wokół niego treść.

AF-7  FORMA ZNACZNIKA ✅ [VER] (dodano 2026-09-09, F-169 — audyt czterech
      arkuszy odpowiedzi na bank kazusów wykazał 24 wystąpienia gołego
      „✅ [VER]" bez kanału i daty; z pięciu sprawdzonych dwa okazały się
      fałszywe. Rygor nieważności istniał dotąd WYŁĄCZNIE dla 🎯 [CEL]
      w AF-2 — znacznik NAJSILNIEJSZY był jedynym bez sankcji za
      niekompletność formy).
      Minimalny zestaw pól znacznika ✅: (1) kanał odczytu
      (api.sejm.gov.pl ELI / ISAP / EUR-Lex / saos.org.pl / web-fallback),
      (2) identyfikator aktu lub orzeczenia, (3) data odczytu W TEJ TURZE.
      ⛔ Brak któregokolwiek z trzech pól = znacznik NIEWAŻNY, traktuj jak
      jego brak, czyli jak ⚠️ [NIEWERYFIKOWANE].
      ⛔ Data odczytu ≠ data odpowiedzi. Wpisanie daty bieżącej bez
      wykonanego w tej turze wywołania jest naruszeniem AF-1, nie brakiem
      formy.
      ⛔ Reguła jest SKŁADNIOWA i sprawdzalna z zewnątrz bez dostępu do
      logów: samo „✅ [VER]" odczytane w dostarczonym tekście jest zawsze
      naruszeniem, niezależnie od tego, co wykonano w tle.
      ⚠️ Skutek wdrożenia: dotychczasowe odpowiedzi z gołym „✅ [VER]"
      stają się formalnie nieoznaczone. Wzrost liczby ⚠️ w pierwszej sesji
      po wdrożeniu jest dowodem działania reguły, nie nową flagą.
```

**SELF-CHECK WYKONAWCZY — treść w module kanonicznym, nie tutaj:**

```
view shared/SELF-CHECK-ANTY-FASADA.md
```

⛔ **Deklaracja „propagowana do wszystkich skilli" była NIEPRAWDZIWA** od
2026-08-23 do 2026-08-23i: pomiar `grep -rl ANTY-FASADA` dawał 7 plików wobec
~25 skilli cytujących prawo, a po dodaniu AF-6 (F-117) źródło miało 2 pozycje
listy, a wszystkie 7 kopii — 1. Naprawione podłączeniem modułu (F-115); aktualny
rejestr skilli, które go wołają, znajduje się W TYM MODULE, nie tutaj — jedno
miejsce prawdy zamiast deklaracji, której nikt nie weryfikował.

⚠️ Zmieniasz brzmienie AF-1…AF-6 wyżej? Sprawdź, czy lista wykonawcza w module
nadal się z nimi zgadza. Rozjazd między nimi znaczy, że zaktualizowano jedno z
dwóch miejsc.

### 🟨 KOTWICA URZĘDOWA — trzeci status, obowiązkowy gdy B-2 zwraca blokadę

> Dodano 2026-08-23 (v2.5). Powód: dotąd HARDGATE znał wyłącznie dwa stany
> końcowe (✅ / ⚠️), a stan faktycznie osiągalny w tym środowisku jest trzeci
> i nie miał nazwy. **Brak nazwy dla realnego stanu jest przyczyną, dla której
> model wymyśla własną etykietę.** Ten status tę lukę zamyka.

Stan opisywany: **tożsamość i metryka aktu potwierdzone urzędowo (indeks ISAP/ELI),
brzmienie przepisu odczytane z RZĘDU 2 i skrzyżowane.** To NIE jest ✅ i NIE jest
pamięć modelu.

```
WARUNKI ŁĄCZNE — wszystkie cztery muszą być spełnione:
  K-1: snippet z isap.sejm.gov.pl LUB eli.gov.pl potwierdza tożsamość aktu
       i numer aktualnego tekstu jednolitego (Dz.U. RRRR poz. NNN)
  K-2: brzmienie przepisu odczytane z co najmniej DWÓCH niezależnych
       źródeł RZĘDU 2B, wzajemnie zgodnych
  K-3: na stronie RZĘDU 2B widoczny znacznik t.j. ZGODNY z K-1
       (⛔ portale serwują wersje archiwalne pod tym samym numerem artykułu —
        zweryfikowane 2026-08-23: przepisy.gofin.pl zwrócił obok siebie
        aktualne art. 113 KRO i brzmienie sprzed nowelizacji z 2008 r.
        spod URL-a z parametrem daty. Sam cross-check dwóch portali NIE
        chroni, jeśli oba trafią w ten sam odcinek czasu — rozstrzyga
        znacznik t.j. na stronie)
  K-4: jawne wskazanie, że RZĄD 1 był niedostępny i dlaczego

ZNACZNIK (oba człony obowiązkowe, nigdy sam pierwszy):
  🟨 [KOTWICA-URZĘDOWA: eli.gov.pl/ISAP indeks — Dz.U. RRRR poz. NNN t.j., data]
  📚 [TREŚĆ: RZĄD 2B — portal-1 + portal-2, znacznik t.j. sprawdzony, data]

⛔ K-1 NIESPEŁNIONY → nie wolno użyć tego statusu → ⚠️ [NIEWERYFIKOWANE]
⛔ K-2 lub K-3 NIESPEŁNIONY → ⚠️ [NIEWERYFIKOWANE]
⛔ Status 🟨 NIE jest równoważny ✅. W piśmie procesowym (.docx) przechodzi
   przez HYBRID-VALIDATION jako WYMAGAJĄCY DOMKNIĘCIA, nie jako zweryfikowany.
⛔ ZAKAZ tworzenia jakiegokolwiek INNEGO statusu pośredniego. Hierarchia jest
   zamknięta i liczy dokładnie cztery pozycje:
     ✅ [VER]  >  🟨 [KOTWICA-URZĘDOWA]  >  ⚠️ [NIEWERYFIKOWANE]  >  ⬛ [DO UZUPEŁNIENIA]
   Jeżeli sytuacja nie mieści się w żadnej z nich — to jest ⚠️, nie nowa etykieta.
   Nazwanie pamięci modelu jakimkolwiek „szczeblem źródła" (w tym określeniami
   typu „pamięć normatywna", „wiedza modelu", „MEM") jest naruszeniem tego
   hard gate tej samej wagi co halucynacja przepisu.
```

**Reguły warstwy strukturalnej:**

1. Wynik z POZIOMU A/B oznaczaj: `✅ [VER: api.sejm.gov.pl ELI DU/RRRR/NNN, data]`
   lub `✅ [VER: saos.org.pl API, data]` — to znacznik silniejszy niż web-fallback.
2. Weryfikację t.j. wykonuj przez endpoint `/references` (typ „Tekst jednolity") —
   NIE przez web_search. Endpoint zwraca pełny łańcuch t.j.; najnowszy = obowiązujący.
   Narzędzie/endpoint ostrzega też o nowelizacjach PO tekście jednolitym — nałóż je
   i sprawdź vacatio legis względem daty zdarzenia.
3. Akt OGŁOSZONY ≠ OBOWIĄZUJĄCY: z metadanych ELI odczytaj datę wejścia w życie
   i status; przy nowelizacji sprawdź artykuł „wchodzi w życie" (różne daty dla
   różnych jednostek redakcyjnych).
4. Brak aktu/orzeczenia w odpowiedzi API ≠ dowód nieistnienia, jeżeli API nie
   pokrywa danego zakresu (np. SAOS nie indeksuje NSA/WSA; indeksacja ELI bywa
   opóźniona). Wtedy przejdź na POZIOM C i zaznacz ograniczenie pokrycia.
5. Do dosłownego cytatu w piśmie/umowie preferuj urzędowy PDF t.j. (ELI `text.pdf`),
   bo konwersja HTML bywa zlepiona.
