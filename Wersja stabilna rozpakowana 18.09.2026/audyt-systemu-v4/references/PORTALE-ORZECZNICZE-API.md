# PORTALE-ORZECZNICZE-API — inwentarz dostępu maszynowego do orzecznictwa i interpretacji

> **Plik:** `audyt-systemu-v4/references/PORTALE-ORZECZNICZE-API.md`
> **Utworzony:** 2026-09-01c (flagi F-151, F-152)
> **Rozszerzony:** 2026-09-01d (flagi F-152, F-153) — sekcje §2B-§2D: rejestry
> publiczne, systemy legislacyjne i interpretacje organów niepodatkowych
> **Rozszerzony:** 2026-09-01d — sekcje 2A (Sejm/ORKA), 2B (rejestry podmiotowe)
> i 2C (interpretacje organów, w tym NOWA instytucja interpretacji GIP)
> **PRZEMIERZONY:** 2026-09-04 (F-152 ZAMKNIĘTA, nowe F-157/F-158) — domeny
> zostały dopisane do listy dozwolonych hosta, więc wszystkie statusy `⬛ host`
> ZASTĄPIONO WYNIKIEM POMIARU, zgodnie z §5 i §6 pkt 2 tego pliku
> („zmierzyć, nie przepisać"). Pomiar jest odtwarzalny:
> `scripts/check_domeny_allowlist.py` (T25), 52 sondy, 52/52 zgodnych.
> **UZUPEŁNIONY:** 2026-09-04b (F-158 częściowo ZAMKNIĘTA) — potwierdzone
> API UODO (§7.6) i EUREKA (§7.7); F-157 propagowana do `shared/`.
> **Rola:** materiał wykonawczy dla `shared/HIERARCHIA-ZRODEL.md` (RZĄD 1/2A)
> i `shared/PRAWO-HARDGATE.md` (POZIOM A/B). Nie jest źródłem prawa i nie
> zastępuje HARD GATE — mówi wyłącznie, CZY i JAK da się do źródła dotrzeć.
> **Zakres pomiaru:** stan na 2026-09-01, środowisko wykonawcze audytu.

---

## 1. PO CO TEN PLIK

System miał zapisaną hierarchię MOCY źródeł (RZĄD 1/2A/2B/3) i nie miał nigdzie
zapisanej hierarchii ICH OSIĄGALNOŚCI. Skutek był mierzalny: procedura POZIOMU B
w `PRAWO-HARDGATE.md` wskazywała endpoint, który zwraca tekst ogłoszony (F-150),
a sekcja REALIA w `HIERARCHIA-ZRODEL.md` opisywała blokadę narzędzia jako zakaz
serwera (F-151). Oba zapisy były nieweryfikowalne bez tabeli takiej jak poniższa.

⛔ Ten plik NIE rozstrzyga, czy z danego źródła wolno cytować — to nadal
`HIERARCHIA-ZRODEL.md`. Rozstrzyga wyłącznie, czy da się je odczytać i czym.

---

## 2. TABELA ZBIORCZA

Legenda kanałów: **W** = `web_fetch` · **K** = wykonanie kodu z siecią
(`curl`/skrypt) · **S** = wyłącznie snippet wyszukiwarki.

⛔ **Kolumna K zmieniła znaczenie 2026-09-04.** Do 2026-09-01e oznaczała
„niesprawdzone, domena poza listą" (`⬛`). Dziś zawiera **wynik pomiaru**:
✅ = odczytane, ⛔ = blokada portalu, ✖ = nieosiągalne z tej sieci.
⚠️ **Każdy odczyt kanałem K wymaga neutralnego User-Agenta i nagłówka
`Accept` — patrz §2G. Bez tego część pozycji ✅ zachowuje się jak ⛔, a dwie
z nich zwracają HTTP 200 ze stroną zastępczą, czyli awaria wygląda jak sukces.**

| Źródło | Zakres | API | W | K | Uwaga rozstrzygająca |
|---|---|---|:-:|:-:|---|
| `api.sejm.gov.pl/eli` | Dz.U., M.P. | ✅ pełne REST | ❌ | ✅ | Jedyne w pełni deterministyczne źródło aktów. ⛔ Pułapka `/text.html` — patrz §3 |
| `eli.gov.pl` | Dz.U., M.P. | metryki + text.html/pdf | ❌ | ✅ | `robots.txt` = `Disallow:` (pusty). Blokada `web_fetch` to decyzja narzędzia, nie serwera |
| `isap.sejm.gov.pl` | Dz.U., M.P. | ❌ | ❌ | ❌ | Pętla 302 na samego siebie. **Kanał martwy w obu trybach** — mimo pozycji nr 1 w RZĘDZIE 1 |
| `saos.org.pl` (SAOS) | SN, NSA/WSA, sądy powszechne, TK, KIO | ✅ REST: `/api/search`, `/api/dump` (hurt), `/api/judgments/{id}` | ❌ robots | ✅ 2026-09-04 | Wszystkie trzy API potwierdzone odczytem. ⛔ **`Accept` obowiązkowy — bez niego HTTP 406**; `pageSize` ≥ 10; indeks pełnotekstowy bywa wolny (TIMEOUT ≥ 60 s). Instrukcja: §7. Projekt akademicki (ICM UW) — nie planować jako jedynego kanału |
| `orzeczenia.nsa.gov.pl` (CBOSA) | NSA + 16 WSA od 2004 | ❌ | ❌ | ✅ 2026-09-04 | HTML odczytany (`/cbo/query`). NSA zapowiada blokowanie „praktyk nadmiernego korzystania"; CAPTCHA przy serii zapytań — **limituj tempo po naszej stronie**. Baza deklaruje charakter „jedynie informacyjny i edukacyjny", nie jest publikatorem |
| `orzeczenia.ms.gov.pl` | sądy rejonowe/okręgowe/apelacyjne | ❌ | ❌ | ✅ 2026-09-04 | ⚠️ **Pozycja referencyjna pułapki UA (§2G): 200 pod `curl/8.5.0`, 502 pod łańcuchem Chrome, 5/5 każdy wariant.** Ułamek orzeczeń, tylko z uzasadnieniami |
| `sn.pl` | SN | ❌ | ❌ | ✅ 2026-09-04 | Publikowane **wybrane** orzecznictwo, nie całość |
| `ipo.trybunal.gov.pl` + `otkzu.trybunal.gov.pl` | TK | ❌ | ❌ | ✅ 2026-09-04 | Pełne orzecznictwo wraz z dokumentami postępowania i zdaniami odrębnymi. ⛔ Sam `trybunal.gov.pl` = ✖ (503, 3/3) — orzecznictwo pokrywają te dwie subdomeny, więc brak strony głównej nie blokuje pracy |
| `orzeczenia.uodo.gov.pl` | decyzje Prezesa UODO | ✅ **REST, OpenAPI 3.1** | częściowo | ✅ 2026-09-04b | ⭐ **POTWIERDZONE (F-158): jedyny polski organ z udokumentowanym publicznym API do własnych rozstrzygnięć.** Łańcuch wyszukiwanie → metadane → pełna treść XML zmierzony end-to-end. Specyfikacja: `/api-doc/schemas/openapi.yml`. Parametry: §7.6 |
| `orzeczenia.uzp.gov.pl` | KIO | ❌ | ❌ | ✅ 2026-09-04 | Brak REST. Istnieje zewnętrzny konektor MCP (`kio-orzeczenia-mcp`, POC) czytający HTML: `Home/HtmlContent/{id}`, `Home/PdfContent/{id}?Kind=KIO` |
| `eureka.mf.gov.pl` | interpretacje indywidualne i ogólne, WIS, WIA, objaśnienia | ⚠️ **REST istnieje, nieudokumentowany** | ⬛ SPA | ✅ odczyt / ⛔ szukanie | **CZĘŚCIOWO ROZSTRZYGNIĘTE (F-158).** Baza `/api/public/v1` **odczytana z bundle `main.*.js`, nie zgadnięta**. Działa pobieranie po ID i katalog metadanych; wyszukiwanie wymaga POST o nieustalonym schemacie. Ścieżka SPA nadal oddaje skorupę 2,9 kB. Parametry i granice: §7.7 |
| `decyzje.uokik.gov.pl` | decyzje Prezesa UOKiK | ❌ | ❌ | ✅ 2026-09-04 | ⚠️ **Pozycja referencyjna pułapki przekierowania (§2G): root robi 302 na `uokik.gov.pl`, którego NIE MA na liście — proxy zwraca wtedy `host_not_allowed` i wygląda to jak awaria portalu. Ścieżka robocza `/bp/dec_prez.nsf` = HTTP 200.** Wcześniejszy zapis o odrzucaniu automatów nie potwierdził się w tym pomiarze |
| `rejestr.uokik.gov.pl` | klauzule niedozwolone (wyroki SOKiK) | ❌ | ❌ | ✅ 2026-09-04 | Brak API (`/api/klauzule` = 404). ⚠️ Jeden niepowtarzalny 503 na 5 prób — dlatego T25 ponawia raz przed orzeczeniem o nieosiągalności |
| `sudop.uokik.gov.pl` — SUDOP | pomoc publiczna i de minimis | ✅ API | — | ✅ 2026-09-04 | API istnieje, ale dotyczy pomocy publicznej, NIE decyzji. ⛔ Sama domena `uokik.gov.pl` pozostaje POZA listą — patrz wiersz `decyzje.` |
| `bip.uke.gov.pl` | decyzje Prezesa UKE | ❌ | ❌ | ✅ 2026-09-04 | Sam UKE zastrzega: baza „służy wyłącznie celom informacyjnym oraz edukacyjnym i nie ma statusu zbioru urzędowego" |
| `dane.gov.pl` / `api.dane.gov.pl` | katalog otwartych danych | ✅ JSON:API | ❌ | ⚠️ połowicznie | `dane.gov.pl` = ✅, ale to SPA bez danych. ⛔ **`api.dane.gov.pl` — jedyny host, na którym mieszka API — POZOSTAJE POZA LISTĄ** (`/1.4/datasets` = `host_not_allowed`). Domena dopisana bez swojego API nie odblokowuje niczego. ⚠️ Pułapka nieznanego filtra (§2C) nadal aktualna |

✅ = zmierzone i odczytane · ⛔ = osiągalne, ale treść zablokowana (WAF/SPA) ·
✖ = nieosiągalne z tej sieci · ⚠️ = działa częściowo, ograniczenie w uwadze.
Data przy znaczniku = dzień pomiaru. **Status bez daty jest nieważny** —
odtwórz go `scripts/check_domeny_allowlist.py`, nie przepisuj.

---

## 2A. WARSTWA PARLAMENTARNA — API Sejmu (następca ORKA/ORKA2)

`orka.sejm.gov.pl` i `orka2.sejm.gov.pl` to starsze interfejsy webowe. Funkcję
maszynową pełni **`api.sejm.gov.pl/sejm`** — pełna specyfikacja OpenAPI 3.0.3
pod `/sejm/openapi/` (133 KB), **55 ścieżek**, 13 tagów: MP, bills, clubs,
committees, groups, interpellations, prints, proceedings, processes,
transcripts, videos, votings, written questions. Zmierzone 2026-09-01d:
HTTP 200 z kanału kodu, bez klucza.

Ścieżki istotne dla pracy prawniczej:

| Ścieżka | Co daje | Zastosowanie w systemie |
|---|---|---|
| `/sejm/term{t}/prints` · `/prints/{num}` | druki sejmowe z listą załączników (`attachments`) | **uzasadnienia projektów** — wykładnia celowościowa i historyczna |
| `/sejm/term{t}/processes/{num}` | przebieg procesu legislacyjnego: `stages`, `documentType`, `closureDate`, **`ELI`** | most Dz.U. ↔ prace legislacyjne; materiał do S4 WYJ-GATE (przepisy przejściowe) |
| `/sejm/term{t}/processes/passed` | procesy zakończone uchwaleniem | zmierzone: 40 z 50 pozycji niosło pole `ELI` |
| `/sejm/term{t}/interpellations/{num}/reply/{key}/body` | treść odpowiedzi ministra na interpelację | stanowiska resortów — te same, które EUREKA publikuje wybiórczo |
| `/proceedings/{id}/{date}/transcripts/{n}` | stenogramy posiedzeń | debata nad przepisem |
| `/committees/{code}/sittings/{num}/html` | zapisy posiedzeń komisji | prace nad brzmieniem jednostki |

⛔ **Granica:** to materiał do wykładni, **nie źródło brzmienia przepisu**.
Brzmienie nadal wyłącznie z ELI (RZĄD 1), sekwencja B-T1…B-T3.
Pole `ELI` w procesie jest identyfikatorem, nie tekstem.

---

## 2B. REJESTRY PODMIOTOWE (weryfikacja stron — PRE-W2, KROK 0D)

| Rejestr | Endpoint | Klucz | Uwaga |
|---|---|---|---|
| **KRS** (MS) | `api-krs.ms.gov.pl/api/krs/OdpisAktualny/{krs}?rejestr=P\|S&format=json`; także `OdpisPelny` | ❌ brak — bezpłatne | `rejestr=P` przedsiębiorcy, `S` stowarzyszenia; numer dopełniany zerami do 10 cyfr. ⚠️📚 [RZĄD 3: apify.com, 2026] sygnalizuje maskowanie części danych osobowych w odpowiedzi API w stosunku do odpisu PDF — **do zweryfikowania u źródła przed oparciem na tym wniosku** |
| **CEIDG** (Hurtownia danych biznes.gov.pl) | `dane.biznes.gov.pl/api/ceidg/v3/firmy`; środowisko testowe `test-dane.biznes.gov.pl` | ✅ Bearer JWT | Limit ~50 żądań/180 s; przekroczenie = 180 s przerwy liczonej od OSTATNIEGO żądania, więc ponawianie przedłuża blokadę. Wielkość liter w nazwach parametrów ma znaczenie |
| **REGON/BIR** (GUS) | `api.stat.gov.pl/Home/RegonApi` | ✅ klucz + sesja | Wymaga logowania metodą `Zaloguj` przed każdym wywołaniem |
| **SUDOP** (UOKiK) | devportal `api-sudop.uokik.gov.pl:9443/devportal/apis`, spec JSON do pobrania w zakładce Try Out | publiczne, z limitami | Pomoc publiczna i de minimis z 10 lat; kryteria: NIP beneficjenta, NIP udzielającego, forma, przeznaczenie, sektor, kod gminy; do 10 tys. wierszy na stronę |
| **KRZ**, **MSiG/eKRS RDF** | `prs.ms.gov.pl/krz`, `ems.ms.gov.pl` | — | Brak publicznego API po stronie MS; dostęp przez interfejs webowy |

⛔ **SUDOP — zastrzeżenie samego UOKiK, nie nasze:** dane pochodzą z bazy
SHRIMP, czyli ze sprawozdań podmiotów udzielających pomocy, i zawierają błędy
(braki, powtórzenia, nieprawidłowy NIP lub nazwa beneficjenta, niewłaściwa
podstawa prawna). Wydruki mają charakter informacyjny i **nie zastępują
zaświadczeń** wymaganych przepisami. Rozbieżność rozstrzyga się z podmiotem
udzielającym pomocy, nie przez odczyt z bazy.

---

## 2C. INTERPRETACJE ORGANÓW — stan po 8 lipca 2026

**⚑ NOWA INSTYTUCJA — interpretacja indywidualna Głównego Inspektora Pracy.**
Od 8 lipca 2026 r. GIP wydaje na wniosek interpretacje indywidualne w zakresie
ustalenia, czy przedstawiony stosunek prawny stanowi stosunek pracy
✅ [VER: api.sejm.gov.pl/eli → Dz.U. 2026 poz. 473, text.pdf, 2026-09-01] · RZĄD 1.
Podstawa: art. 14b ustawy o Państwowej Inspekcji Pracy, dodany ustawą z dnia
11 marca 2026 r. (Dz.U. 2026 poz. 473, wejście w życie 2026-07-08) — ta sama ✅ [VER].
Cechy rozstrzygające dla routingu:
- wniosek składa podmiot z art. 13 pkt 1–6 ustawy o PIP; opłata **40 zł** od
  każdego odrębnego stanu faktycznego lub zdarzenia przyszłego; termin **30 dni**
  od kompletnego wniosku; braki — wezwanie z terminem **7 dni** pod rygorem
  pozostawienia bez rozpoznania — wszystkie te wartości ✅ [VER: jw.];
- forma **decyzji**, a odwołanie **na zasadach KPC**, nie KPA ✅ [VER: jw.] —
  czyli tor sądu pracy, nie sądu administracyjnego; to nietypowe i łatwe do
  przeoczenia przy routingu;
- wydanie interpretacji **nie wyłącza** oceny rzeczywistego charakteru stosunku
  w toku kontroli, jeżeli stan faktyczny okaże się inny ✅ [VER: jw.];
- interpretacje publikowane w **BIP GIP** po anonimizacji
  📚 [ŹRÓDŁO POMOCNICZE — RZĄD 2A: pip.gov.pl, 2026] — nowa baza interpretacyjna
  dla DR-04, bez API, bez wyszukiwarki maszynowej.

⛔ **Nie mylić z poradami PIP.** Porada prawna inspektora nie ma statusu
wykładni i nie chroni przed odmienną oceną w kontroli. Ochrona sankcyjna wiąże
się z interpretacją z art. 14b, nie z poradą.

⚠️ **Pułapka temporalna zmierzona na tym właśnie akcie** — patrz §3a.

---

## 2B. REJESTRY, SYSTEMY LEGISLACYJNE I INTERPRETACJE ORGANÓW

| Źródło | Zakres | API | W | K | Uwaga rozstrzygająca |
|---|---|---|:-:|:-:|---|
| `api.sejm.gov.pl/sejm/termN` | druki sejmowe, posiedzenia, interpelacje, głosowania — **następca ORKA/ORKA2** | ✅ REST | ❌ | ✅ | Zmierzone: `term10` → 3219 druków, `lastChanged` w metadanych. ⚠️ **`?limit` jest IGNOROWANY na `/prints`** (zwraca komplet z HTTP 200), a DZIAŁA na `/interpellations` — patrz §2C |
| `orka2.sejm.gov.pl`, `orka.sejm.gov.pl` | stary system Sejmu | ❌ | ❌ | ✖ poza listą | Funkcjonalnie zastąpiony przez `api.sejm.gov.pl/sejm/...`; nie budować integracji na starym adresie |
| `api.sejm.gov.pl/eli/acts/MP/{rok}` | Monitor Polski | ✅ REST | ❌ | ✅ | Ten sam interfejs co Dz.U.; obowiązuje ta sama pułapka `/text.html` |
| `api-krs.ms.gov.pl` | KRS — odpis aktualny i pełny | ✅ otwarte, bez klucza | ❌ | ✅ 2026-09-04 | Wzorzec `/api/krs/{typ_odpisu}/{nr_krs}?rejestr=P|S&format=json` — potwierdzony odczytem 63 kB odpisu 2026-09-04, bez klucza. ⛔ JSON jest **zanonimizowany** (inicjały, pierwsza cyfra PESEL) — PDF nie. Kanał słabo komunikowany przez MS |
| KRS — **pełne API** | jw. bez anonimizacji | ⛔ reglamentowane | — | — | Nowelizacja ustawy o KRS: pełny dostęp wyłącznie dla podmiotów z **decyzją Ministra Sprawiedliwości** ⚠️📚 [RZĄD 2B: prawo.pl, 2025-10] — przed planowaniem integracji sprawdzić stan wdrożenia |
| `dane.biznes.gov.pl` (CEIDG API v3) | wpisy CEIDG | ✅ REST/OpenAPI | ❌ | ⛔ 401 2026-09-04 | Wymaga tokenu. Dwa limity zapytań działające równocześnie, przerwa 180 s liczona od OSTATNIEGO żądania (ponawianie w trakcie przedłuża blokadę). Nazwy i wartości parametrów **case-sensitive**; zalecany zakres dat ≤5 dni |
| `api.stat.gov.pl` (BIR/REGON) | REGON, dane podmiotów | ✅ | ❌ | ✖ poza listą | Wymaga klucza; sesja logowania przed każdym wywołaniem |
| `sudop.uokik.gov.pl` | pomoc publiczna i de minimis | ✅ **API SUDOP** — publiczne, hurtowe | ❌ | ✅ 2026-09-04 | Jedyne API UOKiK. ⛔ Dotyczy pomocy publicznej, **nie decyzji Prezesa UOKiK** — nie mylić zakresów |
| `legislacja.rcl.gov.pl` (RCL) | przebieg rządowych prac legislacyjnych, projekty, uzgodnienia | ❌ | ❌ | ✖ 503 3/3 | Materiał do wykładni celowościowej i do ustalania vacatio legis przed publikacją w Dz.U. |
| **BIP GIP — interpretacje indywidualne PIP** | czy stosunek prawny jest stosunkiem pracy (art. 22 § 1 KP) | ❌ | ❌ | ✖ poza listą | ⚑ **NOWA INSTYTUCJA — patrz §2D.** Publikacja obowiązkowa w BIP GIP |
| `orzeczenia.uodo.gov.pl/api-doc/` | decyzje Prezesa UODO | ⚑ istnieje | częściowo | ✅ portal / ⛔ spec | Powtórzone z §2 — jedyne API orzecznicze po stronie organu |
| interpretacje składkowe ZUS | oskładkowanie | ⬛ niesprawdzone | — | — | ⚠️ Wzmiankowane w źródłach RZĘDU 2B/3 jako trzecia — obok KIS i GIP — odmiana interpretacji indywidualnych. **W tej sesji NIE zweryfikowane** co do bazy, adresu i dostępu; nie cytować jako ustalone |

## 2C. PUŁAPKA CICHO IGNOROWANEGO PARAMETRU (zmierzona)

Dwa niezależne API rządowe zachowują się tak samo i jest to najgroźniejszy
wzorzec w tym inwentarzu, bo **awaria wygląda jak sukces**:

| Zapytanie | Zachowanie |
|---|---|
| `api.sejm.gov.pl/sejm/term10/prints?limit=1` | zwraca **3219** pozycji, HTTP 200 — parametr zignorowany |
| `api.sejm.gov.pl/sejm/term10/interpellations?limit=1` | zwraca 1 pozycję — parametr zadziałał |
| `api.dane.gov.pl` z nieznaną nazwą filtra | filtr ignorowany, HTTP 200 z całym katalogiem |

⛔ **Reguła operacyjna:** nigdy nie wnioskuj z samego kodu 200, że filtr
zadziałał. Po zapytaniu z parametrem zawężającym **policz zwrócone pozycje**
i porównaj z oczekiwaniem. Zapytanie „daj mi jedno", które zwróciło trzy
tysiące, przy cichym przetworzeniu wygląda w raporcie jak poprawny wynik.

## 2D. INTERPRETACJE INDYWIDUALNE GIP — NOWE ŹRÓDŁO, BRAK W SYSTEMIE

Od **8 lipca 2026 r.** Główny Inspektor Pracy wydaje interpretacje indywidualne
w przedmiocie tego, czy przedstawiony stosunek prawny stanowi stosunek pracy
w rozumieniu art. 22 § 1 Kodeksu pracy.

- Podstawa: **art. 14b ustawy o Państwowej Inspekcji Pracy**, dodany art. 1
  pkt 5 ustawy z dnia 11 marca 2026 r. o zmianie ustawy o Państwowej Inspekcji
  Pracy oraz niektórych innych ustaw, **Dz.U. 2026 poz. 473**, wejście w życie
  **2026-07-08** ✅ [VER: api.sejm.gov.pl/eli → DU/2026/473/text.pdf,
  2026-09-01] · RZĄD 1.
- Tekst jednolity ustawy o PIP: **Dz.U. 2024 poz. 1712** (obwieszczenie,
  status: obowiązujący) ✅ [VER: api.sejm.gov.pl/eli, 2026-09-01] · RZĄD 1.
- Obowiązek publikacji: art. 14b ust. 15 — GIP **niezwłocznie zamieszcza**
  interpretację w BIP urzędu obsługującego GIP, po usunięciu danych
  identyfikujących ✅ [VER: jw.] · RZĄD 1.
- Termin wydania: bez zbędnej zwłoki, nie później niż **30 dni** od otrzymania
  kompletnego wniosku (art. 14b ust. 4) ✅ [VER: jw.] · RZĄD 1.

⛔ **Skutek dla systemu:** powstał nowy, publikowany urzędowo zbiór stanowisk
organu w dziedzinie DR-04, którego żaden moduł ani mapa źródeł nie zna.
To zakres nowej flagi **F-153**. Wolumen jest na razie znikomy, ale zbiór
rośnie od zera i właśnie dlatego moment na wpięcie jest teraz, a nie wtedy, gdy
strona przeciwna powoła się na interpretację, której nie mamy skąd sprawdzić.

⚠️ Zakres i granice ochrony wynikającej z zastosowania się do interpretacji
NIE były przedmiotem tej analizy — to zadanie dla DR-04, nie dla audytu
systemu. Tutaj ustalono wyłącznie, że źródło istnieje, jest publikowane
i jest osiągalne pod adresem BIP GIP.

---

## 2E. ZAMÓWIENIA PUBLICZNE, REJESTRY SĄDOWE MS I STATYSTYKA

| Źródło | Zakres | API | K | Uwaga rozstrzygająca |
|---|---|---|:-:|---|
| `orzeczenia.uzp.gov.pl` (KIO) | wyroki i postanowienia KIO | ❌ brak REST | ✅ 2026-09-04 | Treść pod `Home/HtmlContent/{id}`, PDF pod `Home/PdfContent/{id}?Kind=KIO` — ścieżki znane z zewnętrznego konektora MCP (POC), nie z dokumentacji UZP. ⛔ Traktować jako HTML scraping, nie API |
| `websrv.bzp.uzp.gov.pl/BZP_PublicWebService.asmx` | ogłoszenia BZP — „stare" PZP | ✅ SOAP | ✖ 503 3/3 | Dokumentacja: `bzp.uzp.gov.pl/WebService.aspx` |
| `ezamowienia.gov.pl/mo-board/api/v1/Board/Search` | ogłoszenia BZP — „nowe" PZP | ✅ REST | ✅ 2026-09-04 | Informacje o integracji: `ezamowienia.gov.pl/pl/integracja/`. Zakres danych analogiczny do przeglądarki |
| `api.ezamowienia.gov.pl` (pełna Platforma) | usługi Platformy e-Zamówienia | ⛔ reglamentowane | ✖ poza listą | Dostęp produkcyjny po wniosku i raporcie z testów wg „Procedury uzyskania dostępu"; to nie jest otwarte API |
| `krz.ms.gov.pl` (KRZ) | upadłość, restrukturyzacja, umorzone egzekucje | ⬛ oficjalne API niepotwierdzone | ⛔ 403 WAF | Portal publiczny, dane dostępne bez logowania. ⚠️ API oferują pośrednicy komercyjni ⚠️📚 [RZĄD 3: mgbi.pl] — to NIE dowodzi istnienia API urzędowego. Kluczowy dla DR-02 (upadłość/restrukturyzacja) |
| `prs.ms.gov.pl` (Portal Rejestrów Sądowych) | wnioski i akta rejestrowe KRS | ❌ | ✅ 2026-09-04 | Kanał składania, nie odczytu masowego |
| `wyszukiwarka-krs.ms.gov.pl` | wyszukiwarka KRS | ❌ (odczyt przez `api-krs.ms.gov.pl`, §2B) | ⛔ 403 WAF | — |
| `ekrs.ms.gov.pl/rdf/pd/search_df` | Przeglądarka Dokumentów Finansowych | ❌ | ⚠️ redirect poza listę | Sprawozdania finansowe złożone do KRS. ⛔ `ekrs.ms.gov.pl` jest na liście, ale ścieżka przekierowuje na **`rdf-przegladarka.ms.gov.pl`**, którego na liście NIE MA — wpis bez tego hosta jest martwy (F-157) |
| `ekw.ms.gov.pl` (EKW / księgi wieczyste) | treść ksiąg wieczystych | ❌ | ✅ `/eukw_ogol/menu.do` | ⚠️ Odczyt wymaga znajomości numeru KW; brak wyszukiwania po właścicielu jest cechą ustrojową rejestru, nie brakiem technicznym |
| `isws.ms.gov.pl` (ISWS) | statystyka wymiaru sprawiedliwości | ❌ | ✅ 2026-09-04 | Baza statystyczna MS: ewidencja spraw i orzecznictwo sądów powszechnych i wojskowych. Wartość: liczby o obciążeniu i czasie trwania, nie treść orzeczeń |
| `rps.ms.gov.pl` | Rejestr Sprawców Przestępstw na Tle Seksualnym | ❌ | ✖ poza listą | Rejestr o ograniczonym dostępie — przed jakąkolwiek integracją rozstrzygnąć podstawę prawną dostępu, nie tylko techniczną możliwość |

⛔ **Rozgraniczenie, które łatwo zgubić:** BZP (ogłoszenia o zamówieniach) i
orzecznictwo KIO to DWA różne zbiory u tego samego urzędu. BZP ma API w obu
generacjach PZP; orzeczenia KIO nie mają go wcale.

## 2F. NIEROZSTRZYGNIĘTE OZNACZENIE W ZLECENIU

⚠️ Skrót **„HIP"** z polecenia użytkownika nie został przypisany do żadnego
znanego portalu urzędowego ani orzeczniczego. Sprawdzone i odrzucone tropy:
IPO TK (§2), EKW/księgi wieczyste (§2E, ujęte niezależnie), BIP (§2D).
⛔ Pozycja pozostaje **nierozstrzygnięta** — nie zgadywano jej treści.
Do uzupełnienia przez użytkownika przy najbliższej okazji.

---

## 2G. PUŁAPKA UŻYTEGO NAGŁÓWKA — trzy warianty, wszystkie zmierzone (F-157)

⛔ **Najkosztowniejsze ustalenie pomiaru 2026-09-04.** Trzy pozycje tego
inwentarza zostały wcześniej zaklasyfikowane jako awaria serwisu, a były
awarią naszego żądania. Wszystkie trzy warianty łączy to samo: **kod odpowiedzi
nie wystarcza do orzeczenia o dostępności.**

### 2G-1. User-Agent przeglądarkowy = sygnatura bota

Podszywanie się pod przeglądarkę z adresu centrum danych jest dla WAF-ów
kilku polskich serwisów silniejszym sygnałem bota niż uczciwe `curl/8.5.0`.
Pomiar deterministyczny, 5/5 powtórzeń każdy wariant:

| Adres | `curl/8.5.0` lub brak UA | pełny łańcuch Chrome/120 |
|---|---|---|
| `orzeczenia.ms.gov.pl/` | **HTTP 200**, 197 kB | **HTTP 502** |
| `www.saos.org.pl/api/search/judgments` | **HTTP 200**, JSON | **HTTP 200, „Przerwa techniczna"** |

Drugi wiersz jest groźniejszy od pierwszego: HTTP 200 ze stroną zastępczą
przechodzi każdą kontrolę opartą na samym kodzie. `python-requests/2.31`
zachowuje się jak przeglądarka (502) — to nie jest podział „przeglądarka vs
narzędzie", więc nie zgaduj, tylko mierz.

⛔ **Reguła:** kanał kodu jedzie na neutralnym UA. Nie „naprawiaj" 502
łańcuchem przeglądarkowym — to go powoduje.

### 2G-2. Brak nagłówka `Accept` = HTTP 406

`curl` wysyła `Accept: */*` domyślnie, `urllib` **nie**. Skutek: ten sam adres
„działa w curlu i nie działa w skrypcie". Zmierzone na SAOS 2026-09-04:

| Nagłówek | Wynik |
|---|---|
| brak | **HTTP 406** |
| `*/*` | HTTP 200 |
| `application/json` | HTTP 200 |

### 2G-3. Przekierowanie na host spoza listy

Domena bywa na liście dozwolonych i mimo to nie działa, bo przekierowuje na
host, którego na liście NIE MA. Proxy zwraca wtedy 403 z `host_not_allowed` —
wygląda to jak blokada portalu, a jest luką w konfiguracji po naszej stronie:

| Wpis na liście | Przekierowuje na | Na liście? |
|---|---|---|
| `decyzje.uokik.gov.pl/` | `uokik.gov.pl` | ✖ (ścieżka `/bp/dec_prez.nsf` działa) |
| `ekrs.ms.gov.pl/rdf/pd/search_df` | `rdf-przegladarka.ms.gov.pl` | ✖ |
| `publications.europa.eu/` | `op.europa.eu` | ✖ (ścieżka `/webapi/rdf/sparql` działa) |
| `gov.pl` · `pip.gov.pl` · `bip.pip.gov.pl` | `www.gov.pl`, `www.pip.gov.pl` | ✖ |
| `unoosa.org` | `www.unoosa.org` | ✖ |

⛔ **Wniosek konstrukcyjny:** manifest T25 trzyma **ścieżki robocze, nie same
domeny**. Kod dla `/` nie mówi nic o użytecznej ścieżce.

### 2G-4. Niedeterminizm farmy — `bzp.uzp.gov.pl`

⛔ **KOREKTA WŁASNA 2026-09-04b.** Pierwszy zapis brzmiał: „root 404 w 2/8 prób
przy **stabilnym 8/8** na `Default.aspx`". Przy próbie 10-krotnej `Default.aspx`
też dał **2 razy 404**. Wniosek pierwotny był artefaktem małej próby —
niedeterministyczny jest **cały host**, ok. 20% żądań, nie sama ścieżka roota.

**Nauka z tego jest ogólniejsza niż sam BZP:** ośmiu udanych prób nie wolno
opisywać jako „stabilne". T25 dostał pole `flaky`, które przy takich hostach
ponawia przy KAŻDYM wyniku innym niż OK, oraz przypadek selftestu pilnujący,
by flagi nie użyto do uciszenia niewygodnego wyniku (wymaga udokumentowanego
pomiaru rozrzutu w uwadze).

### 2G-5. Limit tempa — test potrafi wywołać awarię, którą raportuje

⛔ **Zmierzone 2026-09-04b, ograniczenie własne narzędzia.** CBOSA
(`orzeczenia.nsa.gov.pl`) po serii żądań w jednym przebiegu zwróciło **503 ×3**;
po 60 s pauzy — **200/200/200**. Zapowiedź NSA o blokowaniu „nadmiernego
korzystania" przestała być cytatem ze strony, a stała się pomiarem.

Skutki wpisane do T25: pole `pauza` (CBOSA = 15 s), trzy ponowienia zamiast
jednego, przypadek selftestu wymagający uzasadnienia każdej pauzy limitem
tempa. ⚠️ **Pojedynczy przebieg z jednego adresu jest bezpieczny; pętla po
manifeście w kółko — nie.**

---

## 3. PUŁAPKA `/text.html` — skrót

Pełny opis: `shared/PRAWO-HARDGATE.md`, sekcja „PUŁAPKA `/text.html`".
Skrót operacyjny: `/text.html` na akcie BAZOWYM = tekst **ogłoszony**.
Treść tekstu jednolitego bierz z `/text.pdf` obwieszczenia wskazanego w
`/references` → „Inf. o tekście jednolitym", pozycja ze statusem
`obowiązujący`. Indeks górny z `pdftotext` wychodzi jako `Art. N[i]`.

---

## 3a. PUŁAPKA DRUGIEGO RZĘDU — t.j. też bywa nieaktualny (F-153)

Naprawa F-150 przestawiła odczyt z tekstu ogłoszonego na tekst jednolity.
To przesunęło punkt ślepy o jedną wersję dalej, nie usunęło go.

**Przypadek zmierzony 2026-09-01d.** Obowiązujący t.j. ustawy o PIP
(Dz.U. 2024 poz. 1712) **nie zawiera art. 14b** — jedyne trafienie „14b" w tym
tekście to punkt wyliczenia w innym artykule. Jednostka weszła w życie
2026-07-08 nowelizacją Dz.U. 2026 poz. 473. Zamiatanie S1/S2 wykonane na samym
t.j. tej jednostki NIE ZOBACZY. Rejestr ELI pokazuje dla tego aktu **sześć**
nowelizacji ogłoszonych po dacie t.j. (2024-11-30).

**Skutek narzędziowy:** `check_wyjatek_gate_eli.py` wypisuje od 2026-09-01d
listę aktów zmieniających ogłoszonych po dacie t.j. i dopisuje ostrzeżenie do
etykiety wersji. ⛔ Skrypt **nie scala** treści nowelizacji — rozpoznanie ich
wpływu pozostaje ręczne, zgodnie z KROK 2C `shared/PRAWO-HARDGATE.md`.

---

## 4. WNIOSEK OPERACYJNY

1. **Dla AKTÓW problemem nie jest brak API — API jest i działa.** Problemem był
   zły endpoint po naszej stronie (F-150, naprawione).
2. **Dla ORZECZNICTWA API praktycznie nie ma.** Trzy bazy o realnym pokryciu
   (CBOSA, Portal Orzeczeń, SN) nie mają żadnego interfejsu, a CBOSA aktywnie
   blokuje automaty. Jedyne pełne API — SAOS — jest projektem zewnętrznym
   o niepewnej ciągłości, a jedyne API po stronie organu to UODO.
2a. **Rejestry publiczne mają API częściej niż orzecznictwo** — KRS, CEIDG,
   REGON, SUDOP i cały korpus sejmowy są dostępne programowo. Odwrotnie niż
   przy orzeczeniach: tu problemem nie jest brak interfejsu, tylko limity,
   tokeny i ciche ignorowanie parametrów (§2C).
3. ~~**Wąskim gardłem jest lista dozwolonych domen hosta**~~ — **NIEAKTUALNE
   od 2026-09-04, F-152 ZAMKNIĘTA.** Deweloper dopisał domeny; pomiar T25
   pokazuje **32 pozycje ✅ na 40**. Wąskim gardłem stały się trzy inne rzeczy,
   w kolejności kosztu: (a) **kształt naszego żądania** — nagłówki i ścieżka,
   §2G, zakres F-157; (b) WAF portali, których żadna konfiguracja sieci nie
   ominie — ISAP, KRZ, wyszukiwarka KRS; (c) resztkowe braki na liście, już nie
   masowe, tylko punktowe — §6.
4. **Warstwa parlamentarna jest wyjątkiem od pkt 2** — `api.sejm.gov.pl/sejm`
   daje maszynowy dostęp do druków, uzasadnień, procesów legislacyjnych
   (z polem `ELI`) i odpowiedzi na interpelacje. Jest to najlepiej udostępniony
   maszynowo zasób prawny w Polsce po samym ELI i system dotąd go nie używał.
5. **Rejestry podmiotowe są w lepszym stanie niż orzecznictwo** — KRS bez klucza,
   CEIDG i REGON za kluczem, SUDOP publicznie. To materiał dla PRE-W2 i KROK 0D
   (status ⬛ podmiotu), nie dla brzmienia przepisu.
6. **Dźwignia formalna dla żądania API**: ustawa z 11 sierpnia 2021 r. o
   otwartych danych i ponownym wykorzystywaniu informacji sektora publicznego
   (Dz.U. 2021 poz. 1641; t.j. Dz.U. 2023 poz. 1524, obowiązujący; brak aktów
   zmieniających opublikowanych po dacie t.j. — sprawdzono w ELI 2026-09-01).
   ⛔ To wskazanie podstawy, nie analiza jej zastosowania — ocena, czy konkretny
   organ ma obowiązek udostępnić API, wymaga osobnej analizy przez właściwy
   skill DR, nie przez audyt systemu.

---

## 5. GRANICE TEGO INWENTARZA — nazwane wprost

- **Pomiar jest odtwarzalny, ale wciąż środowiskowy.** Od 2026-09-04 nie
  przepisuje się go ręcznie — wykonuje go `scripts/check_domeny_allowlist.py`
  (T25). Status bez daty pomiaru jest nieważny. ⛔ Wynik mówi o NASZEJ sieci
  i o NASZYM żądaniu, nie o portalu: ta sama pozycja daje 200 albo 502
  w zależności od nagłówka (§2G).
- **Brak API nie jest dowodem zakazu.** Kilka baz publikuje dane w trybie
  informacji publicznej; ograniczenia są techniczne (WAF, CAPTCHA, SPA), nie
  zawsze prawne.
- **Zastrzeżenie „nie jest zbiorem urzędowym"** (CBOSA, UKE) dotyczy statusu
  publikatora, nie wiarygodności ustalenia, że orzeczenie istnieje.
- **Ten plik nie jest listą zamkniętą** — obowiązuje ZASADA OTWARTEJ LISTY
  z `shared/HIERARCHIA-ZRODEL.md` (v1.3).

---

## 6. LISTA DOZWOLONYCH DOMEN — STAN PO POMIARZE (F-152 ZAMKNIĘTA)

Rekomendacja z 2026-09-01c została **wdrożona przez dewelopera**. Poniżej
wynik, nie postulat. Pomiar: `scripts/check_domeny_allowlist.py`, 2026-09-04,
40 sond, 40/40 zgodnych ze stanem odniesienia, 0 regresji.

**Rozkład:** ✅ 32 · ⛔ 4 (blokada portalu) · ✖ 3 (nieosiągalne) · ⚠️ 1 (SPA).

### 6A. Do DOPISANIA — braki resztkowe (kolejność = priorytet)

| Host | Co odblokowuje | Dlaczego bez niego nie działa |
|---|---|---|
| `api.dane.gov.pl` | API katalogu otwartych danych | `dane.gov.pl` jest na liście, ale to SPA — API mieszka wyłącznie tutaj |
| `wl-api.mf.gov.pl` | biała lista podatników VAT | ⛔ **jedyny maszynowy sposób weryfikacji rachunku kontrahenta; dziś nieosiągalny w ogóle** |
| `rdf-przegladarka.ms.gov.pl` | sprawozdania finansowe KRS | cel przekierowania z `ekrs.ms.gov.pl` |
| `op.europa.eu` | portal wydawniczy UE | cel przekierowania z `publications.europa.eu` |
| `www.gov.pl`, `www.pip.gov.pl` | BIP GIP — interpretacje z art. 14b (F-153) | cele przekierowań z `gov.pl` / `pip.gov.pl` / `bip.pip.gov.pl`; bez nich nowe źródło DR-04 jest nieosiągalne |
| `api.stat.gov.pl` | REGON/BIR | nigdy nie dopisany; wymaga nadto klucza |
| `www.unoosa.org`, `www.podatki.gov.pl` | dopełnienie wariantów | wpis bez `www.` jest martwy |
| `orzeczenia.*.sr/so/sa.gov.pl` | portale orzeczeń poszczególnych sądów | osiągalne niezależnie od agregatu; mają kanały RSS |

### 6B. Do USUNIĘCIA z listy

| Host | Powód |
|---|---|
| `websrv.bzp.uzp.gov.pl` | SOAP starego BZP; 503 3/3, usługa wygaszona po migracji do eZamówień, które działają |
| `npmjs.com`, `npmjs.org`, `www.npmjs.org`, `static.crates.io` | martwe duplikaty przy działających `registry.npmjs.org` i `index.crates.io` |

### 6C. Do ZOSTAWIENIA mimo statusu ✖ / ⛔

- `trybunal.gov.pl` (503 3/3) — orzecznictwo TK pokrywają `ipo.` i `otkzu.`,
  które działają; sama strona główna nie blokuje pracy.
- `legislacja.rcl.gov.pl` (503 3/3) — **brak zamiennika**. RCL nie ma API,
  a jest jedynym źródłem przebiegu rządowych prac legislacyjnych i vacatio
  legis przed publikacją w Dz.U. ⛔ Nie usuwać; zgłosić dostępność.
- `isap.sejm.gov.pl`, `krz.ms.gov.pl`, `wyszukiwarka-krs.ms.gov.pl` — blokada
  WAF po stronie portalu, której konfiguracja sieci nie zmieni. Zostają jako
  adresy do cytowania dla człowieka, nie jako kanał maszynowy.
- `gov.pl`, `pip.gov.pl`, `bip.pip.gov.pl`, `unoosa.org`, `publications.europa.eu`
  — zostawić **wyłącznie razem z dopisaniem celu przekierowania** z §6A;
  same z siebie nie działają.

⛔ **Trzy zastrzeżenia, każde potwierdzone pomiarem, nie założone:**
1. Dopisanie domeny odblokowuje kanał sieciowy, **nie zgodę portalu**. CBOSA
   zapowiada blokowanie „nadmiernego korzystania" i podaje CAPTCHA przy serii
   zapytań — limitowanie tempa jest po naszej stronie.
2. **Dopisanie domeny nie wystarcza, jeśli żądanie ma zły kształt.** To nowa
   wiedza z tego pomiaru: `orzeczenia.ms.gov.pl` i SAOS były na liście i
   raportowały się jako awarie wyłącznie z powodu nagłówków (§2G).
3. Część pozycji nie zadziała mimo dostępu sieciowego: CEIDG i REGON wymagają
   tokenu (§7), EUREKA renderuje treść w JS, KIO wymaga parsowania HTML.

---

## 7. INSTRUKCJE DOSTĘPU — wymogi ponad samą domenę

⛔ Ta sekcja powstała 2026-09-04, bo inwentarz odpowiadał na pytanie „czy da
się dotrzeć", a milczał o „co trzeba zrobić, żeby dotrzeć". Każda pozycja
poniżej to wymóg, którego pominięcie daje objaw wyglądający jak awaria.

### 7.0. Ustawienia domyślne kanału kodu — obowiązują wszędzie

```
User-Agent: curl/8.5.0        # ⛔ NIE przeglądarkowy — §2G-1
Accept: */*                   # ⛔ obowiązkowy — §2G-2
timeout >= 60 s               # indeks SAOS bywa wolny
ponowienie: 1 przy 5xx        # §2G-4
```

### 7.1. SAOS — dokumentacja i parametry

Dokumentacja: `www.saos.org.pl/help/index.php/dokumentacja-api` (odczytana
2026-09-04). Trzy API, wszystkie bez klucza:

| API | Adres | Uwaga |
|---|---|---|
| przeszukiwanie | `/api/search/judgments` | `pageSize` **≥ 10** — mniejsza wartość to HTTP 400 z komunikatem walidacji |
| pobieranie (hurt) | `/api/dump/judgments` | kanał do zaciągania korpusu |
| pojedyncze orzeczenie | `/api/judgments/{id}` | |

⭐ **Parametr o największej wartości dla tego systemu:**
`lawJournalEntryCode=RRRR/PPP` zwraca orzeczenia **powołujące konkretną
pozycję Dz.U.** (np. `1997/553` = Kodeks karny). To jedyny znaleziony
maszynowy most „przepis → orzecznictwo go stosujące" i naturalne wejście dla
`orzeczenia-sadowe-v2` oraz KROKU orzeczniczego `analiza-sadowa-v6`.
Pozostałe parametry: `courtType` (`COMMON`/`SUPREME`/`ADMINISTRATIVE`/
`CONSTITUTIONAL_TRIBUNAL`/`NATIONAL_APPEAL_CHAMBER`), `all` (pełny tekst),
`sortingField=JUDGMENT_DATE`, `sortingDirection`.

⛔ **Granica:** SAOS to RZĄD 2A (baza wtórna), nie publikator. Ustala, że
orzeczenie istnieje i co zawiera; nie zastępuje sprawdzenia sygnatury
u źródła przy powoływaniu się w piśmie.

### 7.2. CEIDG v3 — token

`dane.biznes.gov.pl/api/ceidg/v3/firmy` odpowiada **HTTP 401 bez tokenu**
(zmierzone 2026-09-04) — to potwierdzenie, że API żyje, nie awaria. Wymaga
Bearer JWT z konta na biznes.gov.pl. Limit ~50 żądań/180 s; przerwa liczona
od OSTATNIEGO żądania, więc ponawianie w trakcie **przedłuża** blokadę.
Nazwy i wartości parametrów są case-sensitive. Środowisko testowe:
`test-dane.biznes.gov.pl`.

### 7.3. KRS — bez klucza, ale z pułapką treści

`api-krs.ms.gov.pl/api/krs/{OdpisAktualny|OdpisPelny}/{nr}?rejestr=P|S&format=json`,
numer dopełniony zerami do 10 cyfr, `P` = przedsiębiorcy, `S` = stowarzyszenia.
⛔ JSON jest **zanonimizowany** względem odpisu PDF (inicjały, część PESEL) —
przy ustalaniu reprezentacji strony to może nie wystarczyć.

### 7.4. Pozostałe — ścieżka zamiast roota

| Źródło | Używaj | Nie używaj |
|---|---|---|
| `publications.europa.eu` | `/webapi/rdf/sparql?query=…&format=application/sparql-results+json` | roota (301 poza listę) |
| `decyzje.uokik.gov.pl` | `/bp/dec_prez.nsf` | roota (302 poza listę) |
| `ekw.ms.gov.pl` | `/eukw_ogol/menu.do` | roota (pętla) |
| `bzp.uzp.gov.pl` | `/Default.aspx` | roota (404 w 2/8 prób) |
| `ezamowienia.gov.pl` | `/mo-board/api/v1/Board/Search` | `api.ezamowienia.gov.pl` (reglamentowane) |
| HUDOC | `/app/query/results?query=(contentsitename=ECHR)&select=…&start=0&length=N` | — API nieudokumentowane, ale odpowiada JSON-em z `resultcount` |

### 7.6. UODO — jedyne potwierdzone API orzecznicze organu (F-158, 2026-09-04b)

⭐ **Rozstrzygnięcie flagi.** Specyfikacja nie została zgadnięta: adres wyjęto
z bloku `SwaggerUIBundle` w `/api-doc/` (`urls: [{url: "schemas/openapi.yml"}]`).

**Specyfikacja:** `orzeczenia.uodo.gov.pl/api-doc/schemas/openapi.yml` —
OpenAPI **3.1.0**, 17 kB, `servers: - url: /api`. Bez klucza.

| Ścieżka | Rola |
|---|---|
| `/api/documents/search/PublicDocument/{okno}/{warunki}` | wyszukiwanie identyfikatorów |
| `/api/documents/events/{id}` | metadane dokumentu |
| `/api/documents/events/{id}/000_pl.xml` | **pełna treść XML** |
| `/api/documents/events/{id}.tar` | paczka dokumentu |
| `/api/documents/public/items/{refpath}` | dostęp po ogólnym `refid` |

**Łańcuch zmierzony end-to-end 2026-09-04b:**
```
GET /api/documents/search/PublicDocument/1Y,/publicator_subtype:eq:uodo
    ?order=-id&fields=id,refid,refname
    -> 200, 35 dokumentów
GET /api/documents/events/{id}          -> 200, 9,4 kB metadanych
GET /api/documents/events/{id}/000_pl.xml -> 200, 118 kB, application/xml
```
Okno czasowe: `1M`, `1Y` itp. Sortowanie: `order=-id`. Zawężenie pól: `fields=`.
Identyfikator zewnętrzny w `refid` (`urn:ndoc:gov:pl:uodo:…`), sygnatura
w `refname` (np. `DKN.5131.34.2023`).

⚠️ **Pułapka pustego wyniku:** okno `1M` zwróciło `[]` przy HTTP 200. To
poprawna odpowiedź „brak dokumentów w oknie", nie awaria — ale przy cichym
przetworzeniu wygląda jak zerowy wynik wyszukiwania. Wariant tej samej klasy
co §2C.

⛔ **Granica:** decyzja Prezesa UODO to RZĄD 2A — rozstrzygnięcie organu,
nie źródło prawa. API ustala, że decyzja istnieje i co zawiera; nie zastępuje
brzmienia przepisu.

### 7.7. EUREKA — API istnieje, wyszukiwanie nierozstrzygnięte (F-158, częściowo)

⛔ **Metoda, nie zgadywanie.** Poprzednia sesja próbowała dwóch domyślonych
ścieżek i słusznie zaniechała dalszego zgadywania. Tym razem odczytano
bundle `main.535d199cee3ec94fe527.js` (2,6 MB) i wyjęto z niego konfigurację:
`{production:!1, api:"/api/public/v1", …}` oraz rejestr usług CRUD.

**Zasoby zadeklarowane w bundle:** `informacje`, `metadane`,
`parametry-wyszukiwarki`, `wyszukiwarka/prezentacja-wynikow`,
`pozycje-slownika/wyszukiwarka`, `komunikaty`, `faq`, `pomoc`, `ankiety`,
`oceny`, `uwagi`, `subskrypcja`, `documents/templates`.

**Zmierzone 2026-09-04b:**

| Wywołanie | Wynik |
|---|---|
| `GET /api/public/v1/informacje/100000` | **200**, 26 kB JSON (`dokument` + `informacjaTytulDto`) |
| `GET /api/public/v1/parametry-wyszukiwarki` | **200**, 40 metadanych wyszukiwania (m.in. „Sygnatura orzeczenia sądu/trybunału", „Przepisy", „Zagadnienia", „Tytuł (teza)") |
| `GET /api/public/v1/informacje/1` | 404 **z komunikatem dziedzinowym** („Nie znaleziono informacji o ID: 1") |
| `GET /api/public/v1/informacje` (lista) | 404 techniczny — zasób nie ma listowania |
| `GET /api/public/v1/wyszukiwarka/informacje` | **405** — zasób istnieje, wymaga POST |
| `POST /api/public/v1/wyszukiwarka/informacje` | **500** dla trzech domyślonych ciał żądania |

⚠️ **Rozróżnienie warte zapamiętania:** 404 z komunikatem dziedzinowym dowodzi,
że endpoint **żyje** (odpowiedział mu warstwa aplikacji), a 404 techniczny ze
`"path"` — że go nie ma. Mylenie ich prowadzi do wniosku „API nie istnieje"
tam, gdzie istnieje.

⛔ **Nierozstrzygnięte i świadomie zostawione:** schemat ciała POST dla
`wyszukiwarka/informacje`. Trzy próby dały 500; dalszego zgadywania zaniechano.
Do ustalenia z bundle (analiza serwisu wyszukiwarki) albo wnioskiem do MF na
podstawie ustawy o otwartych danych — patrz §4 pkt 6. **Pobieranie po ID
działa i to wystarcza do weryfikacji interpretacji, której numer już znamy;
nie wystarcza do wyszukiwania po treści.**

### 7.5. Czego NIE udało się ustalić — nazwane wprost

- ~~EUREKA — backend SPA~~ **ROZSTRZYGNIĘTE CZĘŚCIOWO 2026-09-04b, §7.7.**
  Pozostaje nieustalony wyłącznie schemat POST wyszukiwarki.
- ~~`orzeczenia.uodo.gov.pl/api-doc/`~~ **ROZSTRZYGNIĘTE 2026-09-04b, §7.6.**
  API potwierdzone, specyfikacja odczytana, łańcuch zmierzony end-to-end.
- **`api.stat.gov.pl` (REGON/BIR)** — host poza listą, więc wymogu klucza
  i sesji **nie zweryfikowano w tym środowisku**; opis pozostaje z RZĘDU 2B.
