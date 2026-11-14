# Bazy urzędów i sądów dyscyplinarnych — dostęp maszynowy

Skill nie ma sesji użytkownika: tylko `web_fetch`/`curl` (neutralny UA) i `web_search`. Blokada (captcha, Imperva/Incapsula, 401/403) → nie obchodź jej, wynik `OUT_OF_SCOPE` z nazwą źródła, przejdź do następnego. Brak trafienia ≠ brak orzeczenia. Aplikacja Lex Machina pobiera te bazy na serwer (wyszukiwarka czatu `search_case_law source=BAZA`).

| Źródło | Wejście | Kanał skilla | Uwaga |
|---|---|---|---|
| KNF — wykazy kar, stanowiska KNF/UKNF | `https://www.knf.gov.pl/wyniki_wyszukiwania?searchText=<fraza>&perPage=50&page=N` | GET; wyniki jako JSON w stronie: pary `"title"`, `"href"` do `knf.gov.pl/knf/pl/komponenty/img/*.pdf` | wykaz kar: jeden PDF na rok, nazwa pliku zmienia się przy aktualizacji — szukaj frazą „Wykaz kar nałożonych przez KNF w RRRR” |
| UKE — decyzje i kary Prezesa UKE | `https://bip.uke.gov.pl/decyzje/<kategoria>/`, `/kary-pieniezne/` | GET; listy `N,strona.html`, wpisy `<slug>,N.html`, pliki `/download/...pdf` | znak sprawy np. `DR.WWM.6171.21.2026`; data z linii „Warszawa, dnia …” |
| RIO — uchwały kolegium, rozstrzygnięcia nadzorcze | `https://bip.<miasto>.rio.gov.pl/wyszukiwanie?searchPhrase=<fraza>&size=50&page=N&sortBy=0&lang=PL` (warszawa, bialystok, bydgoszcz, gdansk, kielce, krakow, poznan, szczecin, zielonagora) | GET; artykuł `/kategorie/…/artykuly/…`, plik `https://bip-api.<miasto>.rio.gov.pl/api/attachments/N` | pozostałe izby (Katowice, Łódź, Lublin, Olsztyn, Opole, Rzeszów, Wrocław) — inne systemy BIP, wyszukiwanie ręczne w ich BIP |
| KR RIO — stanowiska, uchwały | `https://rio.gov.pl/181/stanowiska-krrio.html`, `/180/uchwaly-krrio.html` | GET | — |
| KRRiT — decyzje Przewodniczącego (kary), stanowiska | `https://www.gov.pl/web/krrit` → sekcje decyzji | GET; pliki `gov.pl/attachment/<uuid>` | kary: art. 53 ustawy o radiofonii i telewizji (brzmienie z ELI) |
| URE — decyzje, taryfy | `https://bip.ure.gov.pl/bip/taryfy-i-inne-decyzje-b/<dział>` | GET; pliki `/download/...` | sygnatury np. `Ciepło 289/2026`, `EE 282/2025` |
| UODO | `https://orzeczenia.uodo.gov.pl` | GET | — |
| KIO | `https://orzeczenia.uzp.gov.pl` | GET | Faza 1-K |
| TK | `https://ipo.trybunal.gov.pl` | GET | Zasada 5B |
| EUREKA (interpretacje podatkowe) | `https://eureka.mf.gov.pl/api/public/v1` | GET JSON | — |
| WSD adwokatury | `https://wsd.adwokatura.pl/rejestry/showMain/orzecznictwo-19` | GET | — |
| Sądy dyscyplinarne OIRP/ORA (I instancja) | tabela izb w DR-12 `mod-ustawa-odpowiedzialnosc-dyscyplinarna-zawodow` | GET PDF z listy izby | ORA Poznań: WordPress `wp-json/wp/v2/posts?search=orzeczenie` |
| Sejm — druki, procesy | `https://api.sejm.gov.pl/sejm/term10/prints`, `/processes` | GET JSON | ORKA2 chronione przed automatami — nie używaj |
| RPO — wystąpienia generalne | `https://bip.brpo.gov.pl/sprawy-generalne/` | za Imperva → zwykle blokada | `web_search` po sygnaturze/temacie; trafienie potwierdź treścią dostępnego dokumentu albo `OUT_OF_SCOPE` |
| Rzecznik Finansowy — stanowiska | `https://rf.gov.pl/publikacje/stanowiska-rzecznika-finansowego/` | za Imperva → zwykle blokada | jak RPO |
| NIL — orzeczenia sądów lekarskich | SharePoint NIL (folder „PRAWOMOCNE ORZECZENIA”) | gość: podgląd bez pobierania (403) | `OUT_OF_SCOPE`; wskaż użytkownikowi folder |
| ZUS — interpretacje | `https://bip.zus.pl/inne/interpretacje` | archiwa RAR | rozpakuj, jeśli host ma `unrar`/`7z`; inaczej `OUT_OF_SCOPE` |

Rangi: decyzje i stanowiska organów to materiał referencyjny (nie źródło prawa, art. 87 Konstytucji); orzeczenia sądów dyscyplinarnych — Tier 1 dla praktyki DR-12, gdy pobrane z oficjalnej strony izby.
