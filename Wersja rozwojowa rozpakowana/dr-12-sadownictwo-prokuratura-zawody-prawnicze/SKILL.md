---
name: dr-12-sadownictwo-prokuratura-zawody-prawnicze
version: 4.5
description: |
  DR-12: Sądownictwo, Prokuratura, Zawody Prawnicze
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | orzeczenia.ms.gov.pl | sn.pl | orzeczenia.nsa.gov.pl (kontrola WSA/NSA wg PPSA, gdzie właściwa) + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
---

# DR-12 — Sądownictwo, Prokuratura, Zawody Prawnicze

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

```
PRZED każdym powołaniem:
  □ przepisu ustawy → isap.sejm.gov.pl (tekst jednolity + nowelizacje)
  □ sygnatury orzeczenia → orzeczenia.ms.gov.pl / sn.pl / cbosa.nsa.gov.pl
  □ stawki taksy notarialnej → aktualne rozp. MS w ISAP
  □ opłaty egzekucyjne komornika → aktualne rozp. MS w ISAP
  □ wynagrodzenie pełnomocnika z urzędu → aktualne rozp. MS w ISAP
  □ stawek OC zawodów → aktualne rozp. MS w ISAP

Naruszenie HARD GATE = błąd kwalifikowany. Nie ma wyjątków.
```

## Zasada architektoniczna

- Jeden moduł = jeden akt prawny (tekst jednolity Dz.U.)
- Ten sam akt NIE może pokrywać dwóch różnych DR-skills
- **Zakaz cytowania przepisów, sygnatur i stawek z pamięci — weryfikuj w ISAP**

## ⚠️ Ostrzeżenia systemowe

```
PPSA: Sądowa kontrola regulatorów (UOKiK, URE, UKE, KNF) → sądy administracyjne
      (WSA/NSA) wg PPSA — Dz.U. 2026 poz. 143; chyba że przepis sektorowy stanowi
      inaczej (np. SOKiK dla UOKiK). Weryfikuj właściwość przed sporządzeniem pisma.

USP: Prawo o ustroju sądów powszechnych → DR-01/mod-USP-ustroj-sadow-powszechnych
     (nie powielaj w DR-12; do DR-12 należy wyłącznie status zawodowy sędziego
     i referendarza oraz ich odpowiedzialność dyscyplinarna).

EPPO: Od 2025 r. — Prokuratura Europejska działa w Polsce na podstawie
      Dz.U. 2025 poz. 304. Sprawy na szkodę budżetu UE (VAT-karuzele,
      nadużycia funduszy UE > 10 000 EUR) → właściwa EPPO, nie prokuratura krajowa.

NOTARIAT: Prawo o notariacie nie ma nowego tekstu jednolitego (ostatni: 1991).
          Każda nowelizacja osobno w ISAP. Weryfikuj przed każdym cytowaniem.

RADCOWIE-ORZECZENIA (2026-07-16): `wsd.kirp.pl`, opisywany dotąd w
mod-ustawa-odpowiedzialnosc-dyscyplinarna-zawodow.md jako "portal centralny
od 2018", zweryfikowany na żywo 2026-07-16 — dziś przekierowuje na kirp.pl
i nie działa już jako przeszukiwalna baza orzeczeń. Zastąpiono podtabelą
per-OIRP (19 izb) z osobnym statusem weryfikacji dla każdej.

RADCOWIE-ORZECZENIA — DRUGA TURA (2026-07-16): dodatkowa weryfikacja
potwierdziła własne archiwa dla Szczecina i Katowic. WAŻNE: Katowice były
w badaniu z 2019 r. wskazane jako izba w ogóle NIEODPOWIADAJĄCA na wnioski
o informację publiczną — dziś ma działającą, dedykowaną podstronę z
orzeczeniami. To potwierdzony przykład, że stan z 2019 r. się zmienia —
Bydgoszcz i Wałbrzych (nadal oznaczone ❌ z 2019 r.) powinny być
sprawdzone ponownie z tego samego powodu, nie zakładać trwałości statusu.
Kraków: potwierdzone tylko statystyki liczbowe postępowań, NIE pełne
treści orzeczeń — osobna kategoria 🟡 CZĘŚCIOWO. Łódź, Poznań: strony
organów bez potwierdzonego archiwum treści. Koszalin, Toruń, Opole:
pozostają całkowicie niezweryfikowane po dwóch turach — priorytet na
kolejny audyt.

RADCOWIE-ORZECZENIA — TRZECIA TURA (2026-07-16): Rzeszów potwierdzony ✅
(publikacja rozproszona w aktualnościach, nie zbiorcze archiwum — przykład
sygnatury „OSD 3/21"). Próby zweryfikowania Zielonej Góry, Kielc, Łodzi
i Poznania przez ogólne zapytania wyszukiwarki NIE powiodły się (wyniki
nietrafne). STAN KOŃCOWY po 3 turach: 7/19 izb potwierdzonych wprost
(Gdańsk, Wrocław, Lublin, Warszawa, Szczecin, Katowice, Rzeszów), 3/19
częściowo/pośrednio (Kraków — tylko statystyki; Białystok, Olsztyn —
pośrednio przez opis anonimizacji z badania 2019), 2/19 historycznie
negatywne wymagające rewalidacji (Bydgoszcz, Wałbrzych), 7/19 nadal
niezweryfikowane (Zielona Góra, Kielce, Łódź, Poznań, Koszalin, Toruń,
Opole). Dalsza weryfikacja tej ostatniej grupy wymaga bezpośredniego
web_fetch na konkretną podstronę każdej izby, nie samego web_search —
ogólne zapytania nie trafiają w podstrony zagnieżdżone głęboko w menu.

RADCOWIE-ORZECZENIA — CZWARTA TURA (2026-07-16, dokładny fetch Krakowa
na wyraźne żądanie): Kraków POTWIERDZONY DEFINITYWNIE jako 🔴 — bezpośredni
fetch treści strony (nie tylko snippetu) pokazał, że BIP izby publikuje
WYŁĄCZNIE zbiorcze statystyki liczbowe (bez sygnatur, bez uzasadnień),
a same statystyki nie były aktualizowane od 2021 r. (dane sięgają tylko
do 2020). To NAJSILNIEJSZY dotąd potwierdzony przypadek pozornej jawności
— strona sprawia wrażenie transparentnej, ale nie zawiera żadnej treści
orzeczniczej. Wałbrzych: znaleziono nową stronę opisującą skład OSD —
częściowa poprawa względem 2019 r. (jak Katowice), ale bez potwierdzonego
archiwum treści — nie awansowano do ✅. Zielona Góra: stary adres z mapy
(404), nowy adres znaleziony, ale bez archiwum treści.

RADCOWIE-ORZECZENIA — PIĄTA TURA (2026-07-16, samokorekta): kategoria
🟡 POŚREDNIO POTWIERDZONE dla Białegostoku i Olsztyna (nadana w drugiej
turze) była ZA MOCNA — opierała się na opisie praktyk anonimizacji z
badania 2019 r., ale ten opis mógł dotyczyć skanów przesłanych badaczowi
PRYWATNIE (na wniosek o informację publiczną), nie potwierdzonej publicznej
strony internetowej. Obniżono do ⚠️ z wyjaśnieniem. Ważna lekcja
metodologiczna: "izba odpowiedziała na wniosek o informację publiczną"
≠ "izba publikuje orzeczenia online" — to dwa różne fakty, które wcześniejsza
wersja tabeli myliła. Przy okazji: znaleziono wartościowy precedens
merytoryczny (niezależny od kwestii publikacji) — wyrok OSD Białystok
z 06.2016 uchylony przez SN w 05.2017 za brak jakiegokolwiek postępowania
dowodowego na rozprawie.

RADCOWIE-ORZECZENIA — SZÓSTA TURA (2026-07-16, bezpośredni fetch stron
głównych zamiast web_search): Kielce POTWIERDZONE ✅ (pełne archiwum
2007-2025 znalezione przez bezpośredni fetch podstrony menu — web_search
tego nie znajdował). Łódź i Poznań POTWIERDZONE NEGATYWNIE ❌ dopiero po
pełnym przejrzeniu całego drzewa menu (nie tylko snippetu) — brak
jakiegokolwiek linku do archiwum. Toruń — ciekawy przypadek: link
"Orzeczenia OSD" widoczny wprost na stronie, ale strona używa WordPress
Download Manager (JS), więc zwykły fetch nie dociera do treści — REALNY,
żywy przykład problemu "treść prawdopodobnie istnieje, ale niedostępna
przez web_fetch", dyskutowanego wcześniej w tej sesji na przykładzie
zablokowanych crawlerów. STAN KOŃCOWY: 8/19 potwierdzone ✅ (Gdańsk,
Wrocław, Lublin, Warszawa, Szczecin, Katowice, Rzeszów, Kielce), 3/19
potwierdzone negatywnie wprost (Kraków, Łódź, Poznań), 1/19 znalezione-
-ale-technicznie-niedostępne (Toruń), 2/19 częściowo poprawione
(Wałbrzych, Zielona Góra), 2/19 skorygowane w dół po samokrytyce
(Białystok, Olsztyn), 3/19 wciąż całkiem nieznalezione (Koszalin, Opole,
Bydgoszcz). Wniosek metodologiczny: bezpośredni fetch pełnego drzewa
menu okazał się skuteczniejszy niż sam web_search w tej turze.

RADCOWIE-ORZECZENIA — SIÓDMA TURA / ZAMKNIĘCIE (2026-07-16): Wałbrzych —
BIP izby (`oirpwalbrzych.ibip.wroc.pl`) blokuje automatyczny dostęp
(ROBOTS_DISALLOWED) — TRZECI już w tej sesji przypadek treści potencjalnie
istniejącej, ale technicznie niedostępnej dla narzędzi web_fetch (po
Toruniu i sądach powszechnych z CAPTCHA). Bydgoszcz — bez zmian względem
2019 r., brak archiwum na sprawdzonej stronie głównej. Koszalin i Opole
pozostają całkowicie nieznalezione mimo wielu prób — ZAMYKAM ten wątek
audytu na tym poziomie: 8/19 potwierdzone pozytywnie, 4/19 potwierdzone
negatywnie (Kraków, Łódź, Poznań, Bydgoszcz), 2/19 zablokowane technicznie
mimo prawdopodobnego istnienia (Toruń, Wałbrzych), 2/19 częściowa poprawa
vs 2019 (Katowice pełna, Wałbrzych częściowa — patrz wyżej), 2/19
skorygowane w dół (Białystok, Olsztyn), 2/19 nigdy nieznalezione (Koszalin,
Opole). To praktyczny sufit tego, co da się ustalić narzędziami
web_search/web_fetch bez ręcznego przeglądania w przeglądarce.

ADWOKATURA-ORZECZENIA — ÓSMA TURA (2026-07-16, system analogiczny do
radcowskiego, na żądanie użytkownika): `wsd.adwokatura.pl` zweryfikowany
bezpośrednim fetchem jako w pełni funkcjonalna baza pełnotekstowa
(przykład: orzeczenie WSD 55/19, kompletne uzasadnienie, tagi tematyczne)
— wyraźnie lepszy stan niż `wsd.kirp.pl` radców. ALE: ten portal obejmuje
wyłącznie II instancję (WSD) + kasacje SN, NIE 24 sądy dyscyplinarne
I instancji izb adwokackich. Sprawdzono bezpośrednio 11 z 24 izb (Kraków,
Wrocław, Gdańsk, Katowice, Warszawa, Lublin, Poznań, Szczecin, Rzeszów,
Bydgoszcz, Zielona Góra) — WSZYSTKIE bez wyjątku mają wyłącznie strony
składu osobowego sądu, zero archiwów treści orzeczeń. To bardziej spójny
negatywny wzorzec niż u radców (gdzie 8/19 miało jakąś publikację).
Pozostałe 13 izb (Białystok, Bielsko-Biała, Częstochowa, Kielce, Koszalin,
Olsztyn, Opole, Płock, Radom, Siedlce, Toruń, Wałbrzych) niezweryfikowane
w tej turze. Wniosek roboczy: adwokatura ma prawdopodobnie GORSZĄ
transparentność I instancji niż radcowie, mimo lepszego portalu
centralnego — ciekawy, nieoczywisty wynik do potwierdzenia w kolejnym
audycie.

ADWOKATURA-ORZECZENIA — DZIEWIĄTA TURA (2026-07-16): Kielce dodane do
listy potwierdzonych negatywnie (12/24) — jedyna strona dot. dyscyplinarki
to artykuł historyczny z lat 1957-1960, nie współczesne archiwum. Znaleziono
też cytat samego prezesa WSD adwokatury potwierdzający wprost BRAK
PODSTAWY PRAWNEJ do prowadzenia publicznego rejestru ukaranych — to
potwierdza, że brak publikacji I instancji jest świadomym stanem
systemowym, nie przypadkowym zaniedbaniem poszczególnych izb. 12/24 izb
sprawdzonych, wszystkie negatywne — wzorzec bardzo spójny.

ADWOKATURA-ORZECZENIA — DZIESIĄTA TURA / ZAMKNIĘCIE (2026-07-16): dodano
Białystok, Bielsko-Biała, Koszalin do listy potwierdzonych negatywnie
(15/24 sprawdzonych bezpośrednio, wszystkie negatywne — 100% spójność).
Pozostałe 9 izb (Częstochowa, Olsztyn, Opole, Płock, Radom, Siedlce,
Toruń, Wałbrzych) nie dały żadnego śladu archiwum w żadnym wyszukiwaniu,
ale bez pełnego fetchu menu każdej strony — status "prawdopodobnie
negatywny, formalnie niepotwierdzony". WNIOSEK KOŃCOWY: przy 15/15
spójnym wyniku, adwokatura ma strukturalnie GORSZĄ transparentność
I instancji niż radcowie prawni (gdzie 8/19 miało jakąś formę publikacji),
mimo znacznie lepszego portalu centralnego (WSD) — potwierdzone również
wprost przez prezesa WSD adwokatury, że brak jest podstawy prawnej do
prowadzenia takiego rejestru. To odwraca intuicyjne oczekiwanie: jakość
szczebla centralnego nie koreluje z jawnością szczebla lokalnego.

ADWOKATURA-ORZECZENIA — KOREKTA UŻYTKOWNIKA (2026-07-16, jedenasta tura):
użytkownik wskazał, że Poznań jednak PUBLIKUJE orzeczenia — jako pojedyncze
wpisy w kategorii "Ogłoszenia", nie w dedykowanym archiwum (przykład:
sygn. SD 18/24, wydalenie z adwokatury, potwierdzone też niezależnie
w prasie lokalnej). Poznań przeniesiony z ❌ na ✅ z zastrzeżeniem, że
publikacja może dotyczyć wyłącznie kar wydalenia (odrębny obowiązek
ochrony klientów), nie rutynowego archiwum wszystkich orzeczeń. Stan po
korekcie: 14/15 sprawdzonych izb nadal negatywnie, 1/15 (Poznań)
częściowo pozytywnie w formacie rozproszonym. LEKCJA METODOLOGICZNA
(powtórzenie wzorca z Rzeszowa u radców): wyszukiwanie po frazie "archiwum
orzeczeń"/"orzecznictwo" systematycznie pomija format "pojedyncze
ogłoszenia w aktualnościach" — przy kolejnych audytach warto dodatkowo
szukać po wzorcu sygnatury (np. "SD [numer]/[rok]") i słowie "ogłoszenia",
nie tylko po nazwach sekcji typu "archiwum".
```

## DEFINICJE — shared/definicje/

- `definicje/DEF-INTERES-WLASNY-WYLACZENIA.md` — ⚠️ NOWE: pełnomocnik —
  konflikt interesów i interes własny (zakaz reprezentowania sprzecznych
  interesów, skutek: odpowiedzialność dyscyplinarna ≠ automatyczna nieważność
  postępowania, art. 379 KPC), pełnomocnik jako świadek w tej samej sprawie

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-W29 Pełnomocnik / obrońca z urzędu (art. 117 KPC / art. 78-81a KPK —
  obligatoryjny vs fakultatywny, kryteria ETPCz art. 6 §3 lit. c)

## Moduły (13 łącznie — ✓ 13 OK, ☐ 0 STUB)

```
SĄDOWNICTWO I PROCEDURA:
  [✓] OK    mod-ustawa-sedziowie-referendarze-kuratorzy
              (USP, wyłączenie sędziego, odpowiedzialność dyscyplinarna,
               skarga na orzeczenie referendarza, kuratorzy sądowi)
  [✓] OK    mod-KPC-biegli-sadowi-opinie
              (powołanie biegłego, zarzuty do opinii, wynagrodzenie,
               metodologia, opinia uzupełniająca, instytut)
  [✓] OK    mod-KSCU-koszty-sadowe-i-pomoc-prawna
              (⚡ nowy t.j. Dz.U. 2025 poz. 1228; opłaty od pozwu, zwolnienie,
               prawo pomocy, wynagrodzenie pełnomocnika z urzędu)
  [✓] OK    mod-KPC-arbitraz-mediacja-ADR
              (arbitraż KPC art. 1154–1217, mediacja art. 1831–18315,
               Konwencja nowojorska, regulaminy SA KIG/Lewiatan;
               pełny framework ADR → DR-07/mod-ustawa-arbitraz-mediacja)
  [✓] OK    mod-techniki-mediacyjne-negocjacyjne  — dodany 2026-07-17,
              rozbudowany 2026-07-17 (v1.1), skorygowany 2026-07-17 (v1.2 —
              zastąpiono autorskie przypuszczenia realną literaturą: Koło
              Konfliktu Moore'a, PCM, Lewicki i in.): warstwa TECHNIK (nie
              procedury) — 5 zasad mediacji, przygotowanie w 5 krokach
              (Waszkiewicz: zbieranie informacji, wyznaczanie celów wg Koła
              Konfliktu Moore'a, plan, logistyka, analiza) + przygotowanie
              z perspektywy MEDIATORA (sesje wstępne, screening, za PCM),
              ustalanie priorytetów/kolejności kwestii, style/modele,
              typy negocjacji (transakcyjne/rozjemcze, dystrybucyjne/
              integracyjne), negocjacje oparte na interesach (Fisher/Ury),
              BATNA/ZOPA, techniki komunikacyjne, caucus, nierównowaga siły.
              Wypełnia lukę odnotowaną w CHECKLIST-DEDUP ("brak modułu
              ogólnego"). Komplementarny z mod-KPC-arbitraz-mediacja-ADR
              powyżej.

PROKURATURA I ORGANY OCHRONY PRAWA:
  [✓] OK    mod-PrProkuratura-organy-ochrony-prawa
              (Prawo o prokuraturze Dz.U. 2024 poz. 390 ze zm.;
               ⚡ EPPO: ustawa Dz.U. 2025 poz. 304 od 2025;
               skargi na czynności, nadzór, bezczynność)

REGULATORZY:
  [✓] OK    mod-ustawa-regulatorzy-UOKiK-URE-UKE-KNF
              (decyzje sektorowe, kary, Dz.U. 2025 poz. 1714 UOKiK,
               Dz.U. 2026 poz. 43 URE, Dz.U. 2024 poz. 1221 UKE;
               ⚠️ kontrola sądowa: WSA/NSA wg PPSA lub SOKiK — weryfikuj)

ODPOWIEDZIALNOŚĆ DYSCYPLINARNA:
  [✓] OK    mod-ustawa-odpowiedzialnosc-dyscyplinarna-zawodow
              (adwokaci, radcowie, lekarze, notariusze, komornicy —
               postępowania, kary, przedawnienie, tryby zaskarżenia)

ZAWODY PRAWNICZE — USTAWY KORPORACYJNE:
  [✓] OK    mod-ustawa-adwokatura
              (Dz.U. 2024 poz. 1564; tajemnica adwokacka; OC;
               odpowiedzialność dyscyplinarna 3-instancyjna;
               pełny intake/strategia/quality gate)
  [✓] OK    mod-ustawa-radcowie-prawni
              (Dz.U. 2024 poz. 499; nowelizacja 2025 — OC, praca zdalna;
               pełny intake/strategia/quality gate)
  [✓] OK    mod-ustawa-notariat
              (⚠️ brak t.j. — weryfikuj każdą nowelizację; taksa notarialna
               TYLKO z rozp. MS; NTE art. 777 KPC; odmowa czynności;
               pełny intake/strategia/quality gate)
  [✓] OK    mod-ustawa-komornicy-sadowi-zawod
              (Dz.U. 2024 poz. 1458; opłaty TYLKO z rozp. MS; OC;
               skarga art. 767 KPC; odpowiedzialność dyscyplinarna;
               wybór komornika; pełny intake/strategia/quality gate)
  [✓] NOWY  mod-ustawa-rzecznicy-patentowi-zawod
              (Dz.U. 2024 poz. 749 t.j. + nowelizacja Dz.U. 2025 poz. 1679
               [PESEL w rejestrze, w życie 3.02.2026]; zawód zaufania
               publicznego z mocy art. 1 ustawy; samorząd PIRP/KRRP;
               zastępstwo przed UP RP/sądami w sprawach IP z wyjątkiem
               postępowania karnego; pełny intake/mapa proceduralna/quality gate)
```

## Jak wywołać

```
view /mnt/skills/user/dr-12-sadownictwo-prokuratura-zawody-prawnicze/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-12-sadownictwo-prokuratura-zawody-prawnicze/MAPA-AKTOW.md
```

## Powiązania zewnętrzne

- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- USP / ustrój sądów: `dr-01` → `mod-USP-ustroj-sadow-powszechnych`
- Arbitraż / mediacja (pełny framework): `dr-07` → `mod-ustawa-arbitraz-mediacja`
- Notariat (czynności notarialne w rejestrach): `dr-07` → `mod-PrNotariat-notariat-rejestry`
- KPK (obrońca w procesie karnym): `dr-03`
- Egzekucja komornicza (tryb KPC) — patrz `shared/...` lub `mod-ustawa-komornicy-sadowi-zawod` (sekcja "Łącz obowiązkowo z")
- PPSA (skargi na regulatorów): `dr-05` → `mod-PPSA-postepowanie-sadowoadministracyjne`
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Rejestr źródeł uchwał/kodeksów etyki samorządów zawodowych (NRA, KRRP,
  KRN, KRK, PIRP i inne — także zawody medyczne/gospodarcze poza DR-12):
  `shared/SAMORZADY-ZAWODOWE-DOKUMENTY.md` (dodano 2026-07-17)

## ⚖️ DISCLAIMER (obowiązkowy)

Po zakończeniu analizy lub przed oddaniem odpowiedzi zawierającej ocenę prawną:

```text
view /mnt/skills/user/shared/DISCLAIMER.md
```

Wybierz wariant odpowiedni do trybu:
- **PRAWNIK / kancelaria** → wariant techniczny (art. 4 Prawa o adwokaturze / art. 6 u.r.p.)
- **LAIK / pro se** → wariant uproszczony (informacja ≠ porada prawna)

Disclaimer musi być **ostatnim elementem** każdej odpowiedzi zawierającej analizę prawną,
ocenę szans, kwalifikację prawną lub interpretację przepisu.
