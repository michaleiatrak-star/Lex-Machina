---
name: dr-09-budownictwo-srodowisko-energia-transport
version: "3.30"
description: "Budownictwo, środowisko, energia i transport: prawo budowlane, planowanie, odpady, ochrona środowiska, energetyka, drogi i regulacje transportowe."
---

> **Universal runtime:** przed wykonaniem zastosuj kanoniczny `shared/UNIVERSAL-RUNTIME-ADAPTER.md` z osobnego skilla `shared`. Lokalna sekcja adaptera poniżej jedynie go doprecyzowuje.


## ADAPTER RUNTIME — PORTABILITY (ChatGPT / Claude / inne hosty)

Ta sekcja zmienia wyłącznie wykonanie operacji technicznych. Merytoryka dziedzinowa, mapy aktów, hard gate’y, kolejność modułów i kryteria jakości tego DR-skilla pozostają bez zmian.

1. `view dr-09-budownictwo-srodowisko-energia-transport/<plik>` oraz `view modules/...` / `view references/...` oznaczają świeży odczyt odpowiedniego lokalnego pliku tego skilla. Literalna ścieżka `/mnt/skills/user` nie jest wymagana.
2. `view shared/<plik>` oznacza świeży odczyt z osobnego, kanonicznego skilla `shared`. NIE kopiuj `shared` do tej paczki. Brak obowiązkowego zasobu shared = fail-closed, nie substytucja pamięcią modelu.
3. `view <inny-skill>/<plik>` oznacza aktywację/odczyt wskazanego osobnego skilla. Nie vendoryzuj innych skilli do tego ZIP-a.
4. `web_search` / `web_fetch` i podobne nazwy oznaczają świeże wyszukanie/odczyt online przez równoważną funkcję hosta. Zachowaj wymagane źródła oficjalne, statusy weryfikacji i zakaz cytowania prawa z pamięci.
5. `show_widget`, `visualize:read_me`, `present_files`, `create_file`, shell/Python i podobne operacje są nazwami semantycznymi. Jeśli host nie ma literalnego narzędzia, użyj równoważnej funkcji natywnej bez omijania bramek jakości.
6. `/mnt/user-data/...` oznacza rzeczywiste załączniki użytkownika dostępne w bieżącym hoście; wymagany ponowny odczyt ma być faktycznym odczytem źródła.

**Zasada nadrzędna:** instrukcje, które są już zrozumiałe i wykonalne w bieżącym hoście, wykonuj bez konwersji. Adapter działa wyłącznie na granicy runtime.


# DR-09 — Budownictwo, Środowisko, Energia, Transport

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu lub sygnatury:**
1. Zweryfikuj brzmienie i Dz.U. w `isap.sejm.gov.pl`
2. Zweryfikuj orzeczenie w `orzeczenia.ms.gov.pl` / `nsa.gov.pl` / `sn.pl`
3. **NIGDY** nie podawaj artykułu, kary, terminu ani sygnatury wyłącznie z pamięci modelu.

Akty DR-09 (zwłaszcza Prawo budowlane, POŚ, Prawo wodne) są **bardzo często nowelizowane** —
tekst sprzed 6 miesięcy może być już nieaktualny. Zawsze pobieraj aktualny t.j. przed użyciem.


> ⛔ **SELF-CHECK ANTY-FASADA — obowiązkowy przed wysłaniem odpowiedzi/pisma**
> (podłączone 2026-08-24, flaga F-115 P3 — zamknięcie zakresu 16 skilli DR):
>
> ```
> view shared/SELF-CHECK-ANTY-FASADA.md
> ```
>
> Sprawdza dwie rzeczy: (1) czy w tekście stoi „zweryfikowano", data weryfikacji
> albo URL przy przepisie, dla którego NIE wywołano narzędzia W TEJ ODPOWIEDZI;
> (2) czy znacznik statusu nie został nadany treści WYGENEROWANEJ w tej odpowiedzi
> (AF-6). Treść listy jest w module, nie tutaj — celowo, żeby nie powstało kolejne
> miejsce dryfu (7 wcześniejszych kopii rozjechało się ze źródłem przy pierwszej
> zmianie brzmienia).
>
> ⛔ Wyzwalaczem jest BRAK WYWOŁANIA NARZĘDZIA dla danego twierdzenia w danej
> odpowiedzi — nie brak narzędzi w sesji. Niedostępność ISAP nie zwalnia z
> oznaczenia, tylko je wymusza.

---

## Zasada architektoniczna
- Jeden moduł = jeden akt prawny (tekst jednolity Dz.U.)
- Wyjątek: wydzielone rozdziały jednej ustawy mogą mieć osobny moduł (z adnotacją)
- Ten sam akt NIE może pokrywać dwóch różnych DR-skills
- **Zakaz cytowania przepisów z pamięci — każde brzmienie weryfikuj w ISAP**
- **Dz.U. DR-09 zmieniają się bardzo często — przed każdym powołaniem weryfikuj t.j.**

---

## DEFINICJE — shared/definicje/ (bezpośrednie, lazy loading per temat)

- `definicje/DEF-BUDOWLANE-DROGOWE.md` — obiekt liniowy (kable w kanalizacji
  ≠ obiekt budowlany), samowola budowlana, decyzja WZ, definicje ministerialne
  prawa budowlanego (H.2) — PLIK GŁÓWNY dla tej dziedziny

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-007 Gospodarstwo rolne
- BAS-105 Zabudowa zagrodowa na gruntach leśnych (ORKA-REG-05 — def. techniczna
  nie tworzy prawa do zabudowy)
- BAS-108 Odbiorca wrażliwy energii (PE art. 3 pkt 13c + zmiana dyr. 2024/1711)
- BAS-109 Względy techniczne — podatek od nieruchomości (art. 1a ust. 1 pkt 3 upol)
- BAS-111 Strona postępowania w sprawach WZ
- BAS-115 Wolnostojące ogniwa fotowoltaiczne (kwalifikacja: zgłoszenie vs pozwolenie)
- BAS-W09 Samowola budowlana po nowelizacji 2023 (abolicja, brak przedawnienia)
- BAS-W10 Obiekt liniowy (art. 3 pkt 3a PrBud — kable w kanalizacji ≠ obiekt!)
- BAS-W14 ⚠️ Reforma upol 2025 — nowe definicje budynek/budowla (dot. też DR-06)

## Moduły (36 łącznie — ✓ 36 OK, ☐ 0 STUB)

```
BUDOWNICTWO:
  [✓] NOWY  mod-ochrona-zabytkow-obiekty-uzytecznosci-publicznej
              (dodany 2026-07-30, na żądanie użytkownika — ochrona
               zabytków: katalog czynności wymagających pozwolenia
               WKZ, podwójny wymóg pozwolenie WKZ+PrBud, nakaz/
               wstrzymanie konserwatorskie; obiekty użyteczności
               publicznej: bezwzględny wymóg dostępności dla
               niepełnosprawnych, dane NIK o realnej niezgodności.
               ✅ PODZIELONY 2026-08-20 — naprawa F-78, priorytet 10
               [OSTATNI Z LISTY 10 PRIORYTETOWYCH, 1008 linii]: plik
               pod NIEZMIENIONĄ nazwą stał się indeksatorem [44 linie],
               treść 15 sekcji przeniesiona do 6 plików w podkatalogu
               `ochrona-zabytkow/` [max 219 linii/plik]. Zweryfikowano
               100% integralność [15 nagłówków = 15]. Naprawiono 2
               odesłania cross-file [dostępność → część 1, stacje
               transformatorowe → część 3])
  [✓] OK    mod-PrBud-prawo-budowlane
  [✓] NOWY  mod-PrBud-uzupelnienie-pokrycia-2026
              (funkcje techniczne, roboty, EDB/c-KOB, katastrofa, e-Budownictwo, organy i odpowiedzialność zawodowa)
              (samowola, PINB/WINB, pozwolenie, zgłoszenie, WZ/MPZP, umowa z wykonawcą,
               uchwała NSA 7 sędziów luty 2026 — art. 49f i wcześniejszy nakaz rozbiórki)
  [✓] OK    mod-UGN-gospodarka-nieruchomosciami
              (deweloper, MRP, DFG, WM, najem, zasiedzenie, KW, służebności)
  [✓] OK    mod-PrGeodezyjne-kartografia-wywlaszczenia
              (ewidencja gruntów, podziały, wywłaszczenie, ZRID, specustawy)
  [✓] OK    mod-ustawa-planowanie-przestrzenne
              (Plan Ogólny Gminy, MPZP, WZ, ZPI — reforma 2023)
  [✓] NOWY  mod-ustawa-architekci-inzynierowie-budownictwa-zawod
              (Dz.U. 2025 poz. 1783 t.j.; zawody zaufania publicznego —
               samorządy IARP/PIIB; uprawnienia budowlane art. 14 PrBud,
               tytuł rzeczoznawcy budowlanego; ⚠️ URBANISTA — samorząd
               zniesiony 2014, obecnie tylko dobrowolne stowarzyszenia)

ŚRODOWISKO:
  [✓] OK    mod-POS-prawo-ochrony-srodowiska
              (POŚ, pozwolenia, IPPC, emisje, kary WIOŚ, KK 181-188a)
  [✓] OK    mod-inspekcja-ochrony-srodowiska-GIOS-WIOS
              (dodany 2026-07-21: struktura dwuinstancyjna GIOŚ + 16
               WIOŚ, powołanie [premier/wojewoda za zgodą GIOŚ],
               kompetencje kontrolne, Departament Inspekcji GIOŚ jako
               II instancja szczególnie dla emisji. Odpowiedź na
               pytanie użytkownika)
  [✓] OK    mod-formy-ochrony-przyrody-obszary-chronione
              (dodany 2026-07-21: 10 form ochrony przyrody z podziałem
               na typy [obszarowe najsurowsze — park narodowy/rezerwat;
               pośrednie — park krajobrazowy/obszar chronionego
               krajobrazu ze STREFAMI/Natura 2000; punktowe najłagodniejsze
               — pomniki/stanowiska/użytki/zespoły; gatunkowa jako
               jedyna nieobszarowa] + tabela organów ustanawiających.
               Odpowiedź na pytanie użytkownika)
  [✓] OK    mod-POS-prawo-ochrony-srodowiska-szczegoly
              (szczegółowy framework OOŚ: intake, screening, Natura 2000, predykcja,
               kary administracyjne WIOŚ, odpowiedzialność szkodowa)
  [✓] OK    mod-ustawa-OOS-oceny-srodowiskowe
              (DŚU, OOŚ, RDOŚ/GDOŚ, udział społeczeństwa, organy)
  [✓] OK    mod-ustawa-odpadach-gospodarka-komunalna
              (BDO, zezwolenia, kary, nielegalne składowanie, rekultywacja)
  [✓] OK    mod-ustawa-lesna-lowiecka-ochrona-przyrody
  [✓] OK    mod-lowiectwo-klusownictwo
  [✓] OK    mod-PrBud-patodeweloperka-uzytkowanie-male-obiekty-ograniczenia
              (dodany 2026-07-18: zmiana sposobu użytkowania (art. 71/71a),
               reforma "antypatodeweloperska" 2024 [odległość 5 m dla
               budynków >4 kondygnacji, 30 m od przemysłu, tereny zielone
               25%/20%], niewielkie obiekty (domy do 70 m² bez pozwolenia),
               strefy ochronne linii wysokiego napięcia, obszary
               szczególnego zagrożenia powodzią (Prawo wodne art. 77))
  [✓] OK    mod-srodowisko-wycinka-odpady-niebezpieczne-rekultywacja
  [✓] OK    mod-UE-PPWR-EUDR-rozporzadzenia-srodowiskowe
              (dodany 2026-09-13: dwa rozporządzenia UE BEZPOŚREDNIO
               STOSOWANE — PPWR (UE) 2025/40, opakowania, stosuje się
               od 12.08.2026 i uchyla dyrektywę 94/62/WE; EUDR
               (UE) 2023/1115, wylesianie, stosuje się od 30.12.2026
               [mikro i małe przedsiębiorstwa: 30.06.2027] po DWÓCH
               przesunięciach. ⛔ Moduł katalogowo-metrykalny: daty
               i pułapki datowe, treść obowiązków — u źródła)
  [✓] OK    mod-system-kaucyjny-opakowania
              (dodany 2026-07-19: system kaucyjny opakowań po napojach
               [obowiązuje od 1.10.2025 — 3 kategorie: PET do 3l/puszki
               do 1l/szkło zwrotne do 1,5l, kaucja 0,50/1,00 zł, cele
               77%/90%, wyjątek dla browarów od lutego 2026]. Odpowiedź
               na pytanie użytkownika o "kaucję")
              (dodany 2026-07-18, DOKOŃCZONY 2026-07-18: wycinka drzew
               [progi obwodu pnia, wyjątki rolnicy/drzewa owocowe, kary],
               odpady niebezpieczne [katalog odpadów, zakaz obchodzenia
               klasyfikacji przez rozcieńczanie], tereny skażone/
               rekultywacja [POŚ art. 101a-101m, 3 scenariusze
               odpowiedzialności: władający/inny sprawca/solidarna],
               dopalacze/NPS [kluczowe rozróżnienie: środek zastępczy =
               reżim administracyjny vs NSP na liście = reżim karny
               art. 62b])
              (dodany 2026-07-18; KOREKTA 2.0 z 2026-08-16, F-91:
               kłusownictwo — TRZY odrębne reżimy (Prawo łowieckie
               art. 52 — wykroczenie / art. 53 — przestępstwo + przepadek;
               KK art. 181 §3 — chronione gatunki zwierząt; ustawa o
               ochronie przyrody art. 131 pkt 14 — naruszenie zakazów
               wobec gatunków chronionych; dodatkowo ustawa o rybactwie
               śródlądowym art. 27c — kłusownictwo rybackie). Nie wolno
               mieszać sankcji między reżimami)
  [✓] OK    mod-ustawa-prawo-wodne
              (pozwolenia wodnoprawne, Wody Polskie, opłaty, powódź)

ENERGIA:
  [✓] OK    mod-PrEnerg-prawo-energetyczne
              (URE, koncesje, taryfy, przyłączenia, OSD/OSP, odbiorcy)
  [✓] OK    mod-ustawa-OZE-odnawialne-zrodla-energii
              (OZE, prosument, aukcje, magazyny, wspólnoty energetyczne)
  [✓] OK    mod-ustawa-efektywnosc-energetyczna
              (białe certyfikaty, audyt energetyczny, obowiązki przedsiębiorstw)
  [✓] OK    mod-ustawa-rynek-mocy
              (rynek mocy, aukcje, obowiązki mocowe)
  [✓] OK    mod-ustawa-zapasy-paliw-rezerwy-strategiczne
              (RARS, zapasy ropy/gazu, bezpieczeństwo energetyczne)
  [✓] NOWY  mod-ustawa-elektromobilnosc-paliwa-alternatywne
              (Dz.U. 2025 poz. 1490 t.j.; strefy czystego transportu,
               infrastruktura ładowania, AFIR UE 2023/1804, floty JST,
               autobusy zeroemisyjne; **Kraków SCT od 1.01.2026**,
               Warszawa SCT od 1.07.2024)
  [✓] NOWY  mod-ustawa-o-przygotowaniu-i-realizacji-inwestycji-w-zakresie-obiektow-energetyki-jadrowej
              (Dz.U. 2024 poz. 1410 t.j.; specustawa jądrowa 2011 — decyzja
               zasadnicza [RM], lokalizacyjna [wojewoda], pozwolenie PAA,
               ZRID, wywłaszczenia; decyzja zasadnicza EJ1 Lubiatowo-Kopalino
               2023, decyzja lokalizacyjna 2025)

TRANSPORT:
  [✓] OK    mod-ustawa-drogi-publiczne
              (zarządcy dróg, pas drogowy, opłaty, zezwolenia)
  [✓] OK    mod-ustawa-prawo-o-ruchu-drogowym
              (kierowcy, pojazdy, mandaty, punkty, zatrzymanie PJ)
  [✓] OK    mod-ustawa-transport-drogowy
              (ITD, licencje, czas pracy, tachografy, kary)
  [✓] OK    mod-ustawa-kierujacy-pojazdami
              (PJ, egzaminy, punkty, badania, zatrzymanie/cofnięcie)
  [✓] OK    mod-ustawa-transport-kolejowy
              (UTK, przewoźnicy, infrastruktura, bezpieczeństwo)
  [✓] OK    mod-ustawa-prawo-lotnicze
              (ULC, przewoźnicy, prawa pasażerów, drony)
  [✓] OK    mod-ustawa-zegluga-srodladowa
              (żegluga, kwalifikacje, bezpieczeństwo)
  [✓] OK    mod-ustawa-gospodarka-morska-porty
              (porty, administracja morska, bezpieczeństwo)
  [✓] OK    mod-ustawa-przewoz-towarow-niebezpiecznych
              (ADR/RID/ADN, obowiązki, kary)
```

---

## Mapowanie modułów → rodzaj sprawy

| Temat | Moduł |
|---|---|
| Prawo budowlane, samowola, pozwolenie, zgłoszenie | `mod-PrBud-prawo-budowlane.md` |
| Uzupełnienie pokrycia PrBud: funkcje techniczne, roboty, EDB/c-KOB, katastrofa, e-Budownictwo | `mod-PrBud-uzupelnienie-pokrycia-2026.md` |
| Nieruchomości, deweloper, wspólnota, najem | `mod-UGN-gospodarka-nieruchomosciami.md` |
| Geodezja, podziały, wywłaszczenia, ZRID | `mod-PrGeodezyjne-kartografia-wywlaszczenia.md` |
| Planowanie, MPZP, WZ, Plan Ogólny | `mod-ustawa-planowanie-przestrzenne.md` |
| POŚ, emisje, pozwolenia środowiskowe | `mod-POS-prawo-ochrony-srodowiska.md` |
| Inspekcja ochrony środowiska, GIOŚ/WIOŚ, kontrole, organy, II instancja | `mod-inspekcja-ochrony-srodowiska-GIOS-WIOS.md` |
| Formy ochrony przyrody, parki/rezerwaty/Natura 2000/pomniki/gatunkowa | `mod-formy-ochrony-przyrody-obszary-chronione.md` |
| OOŚ, DŚU, RDOŚ/GDOŚ | `mod-ustawa-OOS-oceny-srodowiskowe.md` |
| Odpady, BDO, składowanie | `mod-ustawa-odpadach-gospodarka-komunalna.md` |
| Wycinka, odpady niebezpieczne, rekultywacja, dopalacze/NPS | `mod-srodowisko-wycinka-odpady-niebezpieczne-rekultywacja.md` |
| UE: PPWR opakowania, EUDR wylesianie — daty stosowania i pułapki | `mod-UE-PPWR-EUDR-rozporzadzenia-srodowiskowe.md` |
| System kaucyjny opakowań po napojach (PET/puszki/szkło) | `mod-system-kaucyjny-opakowania.md` |
| Prawo wodne, Wody Polskie | `mod-ustawa-prawo-wodne.md` |
| Energetyka, URE, taryfy, przyłączenia | `mod-PrEnerg-prawo-energetyczne.md` |
| OZE, prosument, aukcje | `mod-ustawa-OZE-odnawialne-zrodla-energii.md` |
| Efektywność energetyczna, białe certyfikaty | `mod-ustawa-efektywnosc-energetyczna.md` |
| Rynek mocy | `mod-ustawa-rynek-mocy.md` |
| Zapasy paliw, RARS | `mod-ustawa-zapasy-paliw-rezerwy-strategiczne.md` |
| Drogi publiczne, pas drogowy | `mod-ustawa-drogi-publiczne.md` |
| Ruch drogowy, mandaty, punkty | `mod-ustawa-prawo-o-ruchu-drogowym.md` |
| Transport drogowy, ITD, licencje | `mod-ustawa-transport-drogowy.md` |
| Kierujący pojazdami, PJ | `mod-ustawa-kierujacy-pojazdami.md` |
| Transport kolejowy, UTK | `mod-ustawa-transport-kolejowy.md` |
| Prawo lotnicze, ULC, drony | `mod-ustawa-prawo-lotnicze.md` |
| Żegluga śródlądowa | `mod-ustawa-zegluga-srodladowa.md` |
| Gospodarka morska, porty | `mod-ustawa-gospodarka-morska-porty.md` |
| Przewóz towarów niebezpiecznych, ADR/RID/ADN | `mod-ustawa-przewoz-towarow-niebezpiecznych.md` |

---

## Routing

**Tryb LAIK:** wyjaśnij prostym językiem + kroki + ostrzeżenia  
**Tryb PRAWNIK:** przepisy + orzecznictwo + ryzyka + strategia procesowa

### Ścieżki specjalne
- `pytanie o przepis` → `analizator-przepisow-v2`
- `orzecznictwo` → `orzeczenia-sadowe-v2`
- `pismo` → `pisma-procesowe-v3`
- `analiza sądowa` → `analiza-sadowa-v6`

---

## SELF-CHECK

Przed odpowiedzią sprawdź:
- [ ] Czy załadowałem właściwy moduł?
- [ ] Czy zweryfikowałem aktualny t.j. w ISAP?
- [ ] Czy każde orzeczenie ma źródło i sygnaturę?
- [ ] Czy nie cytuję niczego z pamięci?
- [ ] Czy zaznaczyłem ryzyka i alternatywy?
