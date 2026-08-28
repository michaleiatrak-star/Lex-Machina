# F-135 — cross-check wartości prawnych — 2026-08-28

## Cel

Systematyczna kontrola twardych wartości normatywnych w DR i `shared`: kwot, progów, stawek, terminów, procentów, okresów oraz innych parametrów, których błędna wartość może zmienić wynik analizy.

## Zasada zaliczenia

Pozycja jest zaliczona wyłącznie gdy:
1. wskazano dokładny moduł i twierdzenie/wartość;
2. wartość porównano ze źródłem urzędowym aktualnym na dzień weryfikacji;
3. wynik oznaczono jako `POTWIERDZONA`, `SKORYGOWANA` albo `NIEWERYFIKOWALNA`;
4. przy korekcie zmieniono źródłowy moduł, nie tylko raport;
5. weryfikacja części wartości nie jest przedstawiana jako weryfikacja całego modułu.

## Batch 1 — DR-07 / PZP / KIO

**Moduł:** `dr-07-zamowienia-publiczne-fundusze-ue/modules/mod-PZP-zamowienia-publiczne-KIO.md`

**Źródła urzędowe:**
- ELI, Prawo zamówień publicznych, t.j. Dz.U. 2026 poz. 793: https://eli.gov.pl/eli/DU/2026/793/ogl
- UZP, progi unijne 2026–2027 / M.P. 2025 poz. 1247: https://www.gov.pl/web/uzp/aktualne-progi-unijne-oraz-ich-rownowartosci-w-zlotych-na-lata-2026-2027
- ELI, rozporządzenie Prezesa RM o wpisach KIO, Dz.U. 2020 poz. 2437: https://eli.gov.pl/eli/DU/2020/2437/ogl

| Wartość / reguła | Wynik | Stan po cross-checku |
|---|---|---|
| próg krajowy PZP dla zamówień klasycznych zamawiających publicznych | POTWIERDZONA | 170 000 zł, art. 2 ust. 1 pkt 1 PZP |
| kurs EUR dla progów 2026–2027 | POTWIERDZONA | 4,31 zł |
| roboty budowlane — próg UE | POTWIERDZONA | 5 404 000 EUR / 23 291 240 zł |
| dostawy/usługi — administracja centralna | POTWIERDZONA | 140 000 EUR / 603 400 zł |
| dostawy/usługi — pozostali zamawiający klasyczni | POTWIERDZONA | 216 000 EUR / 930 960 zł |
| usługi społeczne klasyczne | POTWIERDZONA | 750 000 EUR / 3 232 500 zł |
| dostawy/usługi sektorowe | POTWIERDZONA | 432 000 EUR / 1 861 920 zł |
| usługi społeczne sektorowe | POTWIERDZONA | 1 000 000 EUR / 4 310 000 zł |
| wpis KIO poniżej progów UE | **SKORYGOWANA** | 7 500 zł dla dostaw/usług lub konkursu; **10 000 zł dla robót budowlanych** |
| wpis KIO na poziomie/progach UE | POTWIERDZONA | 15 000 zł dostawy/usługi lub konkurs; 20 000 zł roboty |
| termin zapłaty wpisu | **SKORYGOWANA redakcyjnie** | wpis musi być uiszczony najpóźniej do upływu terminu wniesienia odwołania; 3-dniowe wezwanie z art. 518 dotyczy braków / dowodu terminowej zapłaty, nie dodatkowego terminu na spóźnioną zapłatę |
| terminy odwołania art. 515 ust. 1–2 | POTWIERDZONE | 10/15 dni ≥ UE; 5/10 dni < UE; dokumenty/ogłoszenie 10 dni ≥ UE i 5 dni < UE |
| zmiana umowy de minimis, art. 455 ust. 2 | **SKORYGOWANA** | 10% wartości pierwotnej dla dostaw/usług, 15% dla robót budowlanych, jednocześnie poniżej progów UE i bez zmiany ogólnego charakteru umowy |

## Granica batcha

Batch 1 nie oznacza pełnej re-weryfikacji wszystkich wartości w module PZP/KIO. W szczególności kolejne terminy szczególnych trybów, wartości kwalifikujące przesłanki wykluczenia oraz inne parametry wykonania umowy pozostają do osobnego sprawdzenia, jeśli wejdą do kolejnych batchy F-135.

## Następne priorytety

1. DR-06 — wartości podatkowe i limity o najwyższej zmienności;
2. DR-03 — progi/terminy karne i wykroczeniowe o znaczeniu kwalifikacyjnym;
3. `shared` — wartości powielane między dziedzinami, gdzie rozjazd propaguje się globalnie.


## Batch 2 — DR-06 / Ordynacja podatkowa

**Moduły:**
- `dr-06-podatki-finanse-publiczne-aml/modules/mod-OP-czynnosci-sprawdzajace-dzial-V.md`
- `dr-06-podatki-finanse-publiczne-aml/modules/mod-OP-ulgi-w-splacie-dzial-III-rozdzial-7a.md`

**Źródła urzędowe:**
- ELI / API Sejmu, Ordynacja podatkowa — t.j. Dz.U. 2026 poz. 622;
- EUR-Lex — rozporządzenie Komisji (UE) 2023/2831;
- UOKiK — „Zasady pomocy de minimis”.

| Wartość / reguła | Wynik | Stan po cross-checku |
|---|---|---|
| art. 274 § 1 pkt 1 Op. — limit korekty deklaracji dokonywanej przez organ | POTWIERDZONA | 5000 zł w obowiązującym t.j. Dz.U. 2026 poz. 622 |
| art. 274 § 3 Op. — sprzeciw od korekty organu | POTWIERDZONA | 14 dni od doręczenia uwierzytelnionej kopii skorygowanej deklaracji |
| art. 67da § 2 Op. — wygaśnięcie decyzji ratalnej | POTWIERDZONA | niedotrzymanie terminu płatności trzech rat; przepis nie ustanawia wymogu, aby były kolejne |
| art. 57 § 2 Op. — opłata prolongacyjna | POTWIERDZONA | stawka opłaty prolongacyjnej = obniżona stawka odsetek za zwłokę |
| de minimis — limit ogólny | POTWIERDZONA | 300 000 EUR |
| de minimis — sposób liczenia okresu | **SKORYGOWANA** | kroczący okres poprzednich 3 lat; usunięto błędny skrót „rok bieżący + 2 poprzednie lata podatkowe” |

### Temporal gate

Na dzień 2026-08-28 ELI wskazuje Dz.U. 2026 poz. 622 jako obowiązujący tekst jednolity Ordynacji podatkowej. Akty Dz.U. 2026 poz. 825 i 846 są oznaczone jako oczekujące na wejście w życie, więc batch 2 nie aktywuje ich wartości przed właściwymi datami temporalnymi.
