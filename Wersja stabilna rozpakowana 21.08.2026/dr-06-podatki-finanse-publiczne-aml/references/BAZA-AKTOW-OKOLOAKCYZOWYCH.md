---
name: baza-aktow-okoloakcyzowych
version: 1.0.0
utworzono: 2026-08-11 (AUDYT-2026-08-11 — patrz shared/PRAWO-HARDGATE.md v2.5)
status: production
przeznaczenie: |
  Ustrukturyzowana mapa aktów prawnych regulujących materię akcyzową
  i bezpośrednio z nią powiązaną (celną, karnoskarbową, monitorowania
  przewozu, wyrobu alkoholu). Cel: zmniejszyć ryzyko pomyłki numeracyjnej
  typu "numer artykułu istnieje, ale w złym akcie/dziale" — patrz
  incydent źródłowy niżej. To NIE jest substytut KROK 2C
  (shared/PRAWO-HARDGATE.md) — to mapa, która pomaga ODNALEŹĆ właściwy
  akt/dział PRZED weryfikacją treści konkretnego artykułu, którą i tak
  trzeba wykonać zgodnie z KROK 2C.
powiązane:
  - dr-06-podatki-finanse-publiczne-aml/modules/mod-ustawa-akcyzowa-i-clo-UCC.md
  - dr-06-podatki-finanse-publiczne-aml/modules/mod-UCC-clo-taryfa-celna.md
  - dr-06-podatki-finanse-publiczne-aml/modules/mod-alkohol-tyton-regulacja-sprzedazy.md
  - shared/PRAWO-HARDGATE.md (KROK 2C — obowiązkowa weryfikacja treści artykułu)
  - shared/HIERARCHIA-ZRODEL.md (kategoryzacja RZĄD 1/2A/2B/3 dla linków)
incydent_zrodlowy: |
  AUDYT-2026-08-11: analiza sprawy karnoskarbowej ("produkcja poza składem
  podatkowym, brak zezwolenia") oznaczyła ✅ art. 100 ustawy o podatku
  akcyzowym jako podstawę — artykuł istnieje, ale reguluje wyłącznie
  opodatkowanie akcyzą samochodów osobowych. Prawidłowa podstawa:
  art. 63 § 3 lub art. 69a KKS. Root cause i naprawa mechanizmu
  weryfikacji: shared/PRAWO-HARDGATE.md v2.5, KROK 2C.
---

# Baza aktów okołoakcyzowych

> ⛔ Ta baza podaje NAZWY aktów, ich PRZEDMIOT i orientacyjne oznaczenia
> Dz.U. — służy do ODNALEZIENIA właściwego aktu/działu. NIE zwalnia
> z obowiązku weryfikacji aktualnego tekstu jednolitego i treści
> konkretnego artykułu na ISAP przed cytowaniem (KROK 1-6 +
> KROK 2C, `shared/PRAWO-HARDGATE.md`). Oznaczenia Dz.U. poniżej
> WERYFIKUJ — akty nowelizowane są tu orientacyjne, nie do cytowania wprost.

## 0. ⛔ STATUS AKTUALNOŚCI — wynik weryfikacji online (data kontroli: 2026-08-11)

> Wykonano zgodnie z `shared/PRAWO-HARDGATE.md`, REGUŁA AKTUALNOŚCI —
> sprawdzono na ISAP/obwieszczeniach Marszałka Sejmu najnowszy ogłoszony
> tekst jednolity każdego aktu z sekcji 1 i 3. **Wynik: baza w wersji
> 1.0.0 zawierała nieaktualne oznaczenie Dz.U. dla ustawy akcyzowej —
> poprawiono w tabelach niżej.** Ten sam błąd (stare `Dz.U. 2025 poz. 126`)
> występował też w `mod-ustawa-akcyzowa-i-clo-UCC.md` — poprawiono
> równolegle.

| Akt | Oznaczenie w bazie v1.0.0 | ✅ Aktualny t.j. (zweryfikowany 2026-08-11) | Status |
|---|---|---|---|
| Ustawa o podatku akcyzowym | Dz.U. 2025 poz. 126 t.j. | **Dz.U. 2026 poz. 412 t.j.** (obwieszczenie Marszałka Sejmu z 12.03.2026) | ⛔ NIEAKTUALNE w v1.0.0 — poprawiono |
| Kodeks karny skarbowy | Dz.U. 2025 poz. 633 t.j. | Dz.U. 2025 poz. 633 t.j. (obwieszczenie z 10.04.2025) — **nadal aktualny t.j.**, ale ⚠️ z nowelizacjami po nim: Dz.U. 2026 poz. 347, 421, 846, 901 — sprawdź każdą pod kątem, czy dotyczy artykułu, którego akurat używasz, PRZED cytowaniem (KROK 2C) | ✅ t.j. aktualny / ⚠️ sprawdź nowelizacje punktowo |
| Ustawa o wyrobie alkoholu etylowego oraz wytwarzaniu wyrobów tytoniowych | (nie było w tabeli, tylko wzmianka opisowa) | **Dz.U. 2025 poz. 1893 t.j.** (obwieszczenie z 19.12.2025) | ✅ dodano do sekcji 3 |
| Ustawa o systemie monitorowania drogowego i kolejowego przewozu towarów (SENT) | (nie było oznaczenia) | **Dz.U. 2024 poz. 1218 t.j.** (obwieszczenie z 01.08.2024) | ✅ dodano do sekcji 3 |
| Unijny Kodeks Celny (UCC) | rozp. 952/2013 | rozp. (UE) nr 952/2013 — akt unijny, brak "tekstu jednolitego" w polskim rozumieniu; obowiązuje w wersji skonsolidowanej EUR-Lex | ✅ bez zmian, patrz `mod-UCC-clo-taryfa-celna.md` |

⚠️ **Ważne zastrzeżenie proceduralne:** powyższa weryfikacja potwierdza
WYŁĄCZNIE, że wskazany Dz.U. jest najnowszym ogłoszonym tekstem
jednolitym danego AKTU jako całości. **Nie zwalnia to z KROK 2C**
(weryfikacja treści KONKRETNEGO artykułu) przy cytowaniu — to właśnie
brak tego drugiego kroku spowodował incydent źródłowy tej bazy.

⚠️ **Projekt w toku legislacyjnym (nie obowiązuje jeszcze):** zaostrzenie
przepisów ustawy o wychowaniu w trzeźwości i ustawy o wyrobie alkoholu
etylowego (podwyżki stawek do 2029 r., ograniczenie sprzedaży mocnych
alkoholi) — na dzień kontroli status projektu w Sejmie, BRAK potwierdzenia
uchwalenia. Nie cytuj jako obowiązującego prawa bez ponownej weryfikacji
statusu procesu legislacyjnego.

---

## 1. Rdzeń systemu akcyzowego

| Akt | Przedmiot | Uwaga dot. zakresu |
|---|---|---|
| Ustawa z dnia 6 grudnia 2008 r. o podatku akcyzowym (u.p.a. / u.a.a.) — ✅ [VER: ISAP/obwieszczenie 12.03.2026, Dz.U. 2026 poz. 412 t.j., zweryfikowano 2026-08-11] | Konstrukcja podatku: przedmiot opodatkowania, podatnicy, skład podatkowy, procedura zawieszenia poboru, stawki, zwolnienia, WIA | Akt WIELODZIAŁOWY — sąsiednie numery artykułów regulują zupełnie różne wyroby/instytucje (np. Dział V, art. 100-113a = WYŁĄCZNIE samochody osobowe; produkcja/skład podatkowy = art. 40-56, 47 i n.). ⛔ Nigdy nie zakładaj, że numer artykułu "z okolic" pasuje tematycznie bez sprawdzenia działu. ⚠️ Po t.j. z marca 2026 odnotowano dalszą nowelizację: ustawa z 27.03.2026 o zmianie ustawy o podatku akcyzowym (Dz.U. 2026 poz. 414) — sprawdź, czy dotyczy artykułu, który cytujesz. |
| Kodeks karny skarbowy (KKS), Rozdział 6 Części szczególnej (art. 54-84) — ✅ [VER: ISAP/obwieszczenie 10.04.2025, Dz.U. 2025 poz. 633 t.j., zweryfikowano 2026-08-11] | Sankcje karnoskarbowe za naruszenia podatkowe, w tym akcyzowe | Właściwy akt dla WSZYSTKICH kwalifikacji karnych/wykroczeniowych związanych z akcyzą — NIE u.p.a. (u.p.a. reguluje sam podatek, nie sankcje karne za jego obejście). ⚠️ Po t.j. z kwietnia 2025 odnotowano nowelizacje ogłoszone w Dz.U. 2026 poz. 347, 421, 846, 901 — sprawdź punktowo, czy obejmują akurat cytowany artykuł. |
| Rozporządzenia wykonawcze do u.p.a. (stawki, zwolnienia, wzory deklaracji, znaki akcyzy) | Doprecyzowanie ustawy — stawki i procedury szczegółowe | Zmieniane co roku/kwartał — zawsze weryfikuj aktualność, nie polegaj na dacie w tej bazie. |

## 2. Mapa: który przepis KKS dla jakiego naruszenia akcyzowego

> ✅ [VER: KKS Dz.U. 2025 poz. 633 t.j., zweryfikowano 2026-08-11 — patrz
> sekcja 0]. Rozróżnienie kluczowe dla uniknięcia błędu z incydentu
> źródłowego — zawsze zacznij TU, nie w u.p.a., gdy stan faktyczny opisuje
> naruszenie (nie samą konstrukcję podatku).

| Zachowanie / stan faktyczny | Właściwy przepis KKS | Nie mylić z |
|---|---|---|
| Uchylanie się od opodatkowania (nieujawnienie przedmiotu/podstawy, brak deklaracji) | art. 54 KKS | — |
| Produkcja poza składem podatkowym + wydanie/sprzedaż wyrobów bez znaków akcyzy | art. 63 § 3 KKS | art. 100 u.p.a. (samochody — NIE dotyczy) |
| Wydawanie wyrobów akcyzowych bez znaków akcyzy po zakończeniu procedury zawieszenia | art. 63 § 1 KKS | art. 65 KKS (to paserstwo, inny sprawca) |
| Sprowadzanie wyrobów akcyzowych na terytorium kraju bez znaków akcyzy | art. 63 § 2 KKS | — |
| Produkcja/magazynowanie/przeładunek poza składem podatkowym z naruszeniem warunków procedury zawieszenia poboru akcyzy | art. 69a KKS (§ 2: mniejsza waga → wykroczenie) | art. 63 KKS (dotyczy raczej wydania/sprzedaży niż samej produkcji) |
| Wyprowadzenie ze składu podatkowego wyrobów bez znaków akcyzy w celu wywozu za granicę | art. 64 KKS | — |
| Paserstwo akcyzowe (nabycie/przechowanie/pomoc w zbyciu wyrobów pochodzących z czynu z art. 63-64/69/69a/73/73a) | art. 65 KKS | art. 291-292 KK (paserstwo "zwykłe" — nie stosuje się do wyrobów akcyzowych) |
| Podanie nieprawdziwych danych o rodzaju/ilości/jakości wyprodukowanych wyrobów | art. 69 § 2 KKS | — |
| Usuwanie wyrobów akcyzowych z miejsca produkcji/przechowywania wbrew przepisom | art. 69 § 3 KKS | — |
| Nieoznaczenie/nieprawidłowe oznaczenie znakami akcyzy przy obrocie poza procedurą zawieszenia | art. 68 KKS | — |
| Przemyt celny wyrobów akcyzowych (brak zgłoszenia celnego w ogóle) | art. 86 KKS | art. 87 KKS (towar zgłoszony, ale z innymi cechami — to oszustwo celne, nie przemyt) |
| Oszustwo celne (zgłoszenie z niezgodnymi danymi, w tym błędna klasyfikacja CN) | art. 87 KKS | art. 86 KKS |

> Pełne rozróżnienie art. 86 vs 87 KKS oraz kwalifikator CN/UCC →
> `modules/mod-ustawa-akcyzowa-i-clo-UCC.md`, sekcja 4a.

## 3. Akty powiązane spoza rdzenia akcyzowego

| Akt | Przedmiot | Kiedy sięgać |
|---|---|---|
| Ustawa o wyrobie alkoholu etylowego oraz wytwarzaniu wyrobów tytoniowych — ✅ [VER: ISAP/obwieszczenie 19.12.2025, Dz.U. 2025 poz. 1893 t.j., zweryfikowano 2026-08-11] | Reglamentacja produkcji alkoholu/wyrobów tytoniowych (zezwolenia, koncesje — odrębnie od samej akcyzy) | Gdy stan faktyczny dotyczy braku zezwolenia/koncesji na wytwarzanie, nie tylko obejścia akcyzy. Zawiera własne przestępstwa (art. 12a, 13, 14 — nielegalny wyrób/skażanie alkoholu), ODRĘBNE od KKS. ⚠️ Projekt zaostrzenia przepisów (podwyżki stawek do 2029, ograniczenia sprzedaży) w toku legislacyjnym na 2026-08-11 — NIE obowiązuje, sprawdź status przed powołaniem. |
| Ustawa o systemie monitorowania drogowego i kolejowego przewozu towarów oraz obrotu paliwami opałowymi (SENT) — ✅ [VER: ISAP/obwieszczenie 01.08.2024, Dz.U. 2024 poz. 1218 t.j., zweryfikowano 2026-08-11] | Zgłoszenia przewozu wyrobów wrażliwych (w tym części akcyzowych: paliwa, alkohol powyżej progu) | Gdy w sprawie pojawia się transport/przewóz, nie tylko produkcja. Wykaz towarów objętych SENT określa rozporządzenie wykonawcze MF — zmieniane często (ostatnio Dz.U. 2026 poz. 813), zawsze sprawdź aktualny wykaz osobno od samej ustawy. |
| Unijny Kodeks Celny (UCC, rozp. 952/2013) + akty wykonawcze (DA/IA) | Procedury celne, wartość celna, klasyfikacja CN/TARIC, WIT | Import/eksport spoza UE, klasyfikacja taryfowa → `mod-UCC-clo-taryfa-celna.md` |
| Dyrektywa Rady (UE) 2020/262 (dyrektywa akcyzowa, dawniej 2008/118/WE) | Harmonizacja unijna procedury zawieszenia poboru akcyzy, EMCS | Gdy sprawa ma element transgraniczny UE |
| Dyrektywa 92/83/EWG (zmieniona 2020/1151/UE) | Harmonizacja struktury akcyzy na alkohol | Sprawy alkoholowe z elementem unijnym |
| Ustawa o podatku od towarów i usług (VAT) | Odrębny podatek pośredni — może zbiegać się z naruszeniem akcyzowym przy tym samym imporcie/obrocie | Gdy w tym samym stanie faktycznym pojawia się też uszczuplenie VAT — zbieg z art. 54/56 KKS |
| Ustawa Prawo energetyczne | Koncesje na obrót paliwami/energią — odrębne od akcyzy na wyroby energetyczne | Gdy w grze jest brak koncesji, nie tylko akcyza |

## 4. Procedura odnalezienia właściwej podstawy (skrót)

```
1. Zidentyfikuj, czy stan faktyczny opisuje:
   (a) KONSTRUKCJĘ podatku (kto jest podatnikiem, jaka stawka,
       jakie zwolnienie) → u.p.a. + rozporządzenia wykonawcze
   (b) NARUSZENIE/SANKCJĘ (brak zezwolenia, brak znaków akcyzy,
       uchylanie się od podatku, przemyt) → KKS, tabela sekcja 2 wyżej
   (c) PROCEDURĘ CELNĄ (import spoza UE, klasyfikacja CN) → UCC,
       `mod-UCC-clo-taryfa-celna.md`
   (d) REGLAMENTACJĘ DZIAŁALNOŚCI (koncesja/zezwolenie na wytwarzanie,
       niezależnie od samego podatku) → ustawy sektorowe, sekcja 3

2. Dla (b) — dobierz WIERSZ z tabeli sekcja 2 wg CZASOWNIKA opisującego
   zachowanie (produkuje / wydaje / sprowadza / przechowuje / przewozi /
   nie zgłasza) — różne czasowniki = różne przepisy KKS, nawet dla tego
   samego wyrobu.

3. Po wyborze aktu i artykułu → OBOWIĄZKOWO KROK 2C
   (shared/PRAWO-HARDGATE.md): pobierz pełną treść, zacytuj fragment,
   porównaj tematycznie PRZED nadaniem ✅. Ta baza wskazuje TYLKO
   kierunek wyszukiwania — nie jest źródłem do cytowania wprost.
```

## 5. Synchronizacja z pozostałymi rejestrami aktów (dodano 2026-08-11)

> Ten sam akt (ustawa akcyzowa) był katalogowany OSOBNO w trzech miejscach:
> tym pliku, `dr-06-podatki-finanse-publiczne-aml/MAPA-AKTOW.md` i
> `prawo-polskie-v2/ROUTING-MAP.md` — każde z nich niezależnie mogło (i
> faktycznie miało) nieaktualne oznaczenie Dz.U., mimo że dwa z tych
> plików zostały wcześniej "zweryfikowane" w osobnych sesjach. Przy
> AUDYT-2026-08-11c poprawiono WSZYSTKIE TRZY miejsca równocześnie:

| Plik | Rola | Status po 2026-08-11 |
|---|---|---|
| `dr-06-podatki-finanse-publiczne-aml/references/BAZA-AKTOW-OKOLOAKCYZOWYCH.md` (ten plik) | Szczegółowa mapa aktów okołoakcyzowych + mapa KKS wg czasownika czynu | ✅ Dz.U. 2026 poz. 412 t.j. |
| `dr-06-podatki-finanse-publiczne-aml/MAPA-AKTOW.md` | Lokalna mapa WSZYSTKICH aktów dziedziny DR-06 (nie tylko akcyza) | ✅ Poprawione, wiersz akcyza + alkohol + dodano SENT |
| `prawo-polskie-v2/ROUTING-MAP.md` | Globalna mapa routingu — fasada nad wszystkimi DR-skills | ✅ Poprawione, wiersz akcyza + alkohol |

⛔ **Wniosek strukturalny:** te trzy pliki NIE są ze sobą automatycznie
zsynchronizowane — to trzy niezależne, ręcznie utrzymywane rejestry tego
samego faktu (aktualny Dz.U. ustawy akcyzowej). Przy KAŻDEJ przyszłej
aktualizacji tego aktu (nowy t.j., istotna nowelizacja) trzeba
zaktualizować wszystkie trzy miejsca, nie tylko to najbardziej
oczywiste. Rozważyć przy kolejnym audycie systemowym (`audyt-systemu-v4`),
czy nie połączyć ich w jedno źródło prawdy — podobny problem duplikacji
(dwie niezależne implementacje tego samego mechanizmu) opisano już
wcześniej dla `PRAWO-HARDGATE.md` vs `WERYFIKACJA-SLAD.md` (v2.3).

## 6. Changelog

- **1.2.0 (2026-08-11):** Dodano sekcję 6 (synchronizacja z MAPA-AKTOW.md
  i ROUTING-MAP.md) po tym, jak użytkownik zapytał, czy zweryfikowane akty
  zostały też dodane do mapy aktów prawnych w `prawo-polskie-v2` i
  odpowiednim module DR — okazało się, że nie, i że te same nieaktualne
  oznaczenia Dz.U. (ustawa akcyzowa: 2025 poz. 126) występowały
  niezależnie w obu tych plikach. Poprawiono wszystkie trzy miejsca
  równocześnie, patrz AUDYT-2026-08-11c/d w AUDIT-JOURNAL.md.
- **1.1.0 (2026-08-11):** Kontrola aktualności zgodnie z REGUŁĄ
  AKTUALNOŚCI (`shared/PRAWO-HARDGATE.md`). Wynik: **ustawa akcyzowa
  była oznaczona nieaktualnym t.j.** (Dz.U. 2025 poz. 126 zamiast
  aktualnego Dz.U. 2026 poz. 412) — poprawiono w sekcji 0 i 1, oraz
  równolegle w `mod-ustawa-akcyzowa-i-clo-UCC.md`. Dodano zweryfikowane
  oznaczenia Dz.U. dla ustawy o wyrobie alkoholu etylowego (Dz.U. 2025
  poz. 1893 t.j.) i ustawy SENT (Dz.U. 2024 poz. 1218 t.j.), wcześniej
  wymienionych bez konkretnego oznaczenia. Odnotowano nowelizacje
  post-t.j. do sprawdzenia punktowo (KKS: poz. 347/421/846/901 z 2026;
  u.p.a.: poz. 414 z 2026) oraz projekt legislacyjny w toku (zaostrzenie
  przepisów alkoholowych) — nieobowiązujący, wymaga odrębnej weryfikacji
  statusu przed użyciem.
- **1.0.0 (2026-08-11):** Utworzenie bazy w ramach naprawy AUDYT-2026-08-11
  (błędne oznaczenie ✅ dla art. 100 u.p.a. w sprawie dot. produkcji poza
  składem podatkowym). Pierwsza wersja — pokrycie: rdzeń akcyzowy, mapa
  KKS art. 54-91, akty powiązane. Do rozbudowy w miarę kolejnych spraw
  (np. szczegółowa mapa rozporządzeń wykonawczych do u.p.a., jeśli
  okaże się potrzebna praktycznie).
