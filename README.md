⚖️ Lex Machina — System Prawnych Skilli dla Claude AI
Modularny, weryfikowalny system analizy prawa polskiego działający jako zestaw skilli (narzędzi) dla Claude AI.

Każdy przepis weryfikowany w ISAP. Każde orzeczenie z oficjalnego portalu. Żadnej halucynacji prawnej.


Czym jest Lex Machina?
Lex Machina to zestaw 47 wzajemnie połączonych skilli dla Claude AI, który zamienia asystenta w kompletne środowisko pracy prawnej. System obsługuje 16 dziedzin prawa polskiego, ponad 190 aktów prawnych i generuje dokumenty gotowe do złożenia w sądzie lub urzędzie.
System jest przeznaczony zarówno dla prawników i kancelarii (tryb zaawansowany z pełną dokumentacją procesową), jak i dla osób bez wykształcenia prawniczego (tryb prowadzenia krok po kroku przez Przewodnika Prawnego).
Kluczowa zasada systemu: Claude nigdy nie cytuje przepisu z pamięci. Każde powołanie na artykuł, paragraf, numer Dz.U. lub sygnaturę orzeczenia jest weryfikowane w oficjalnych źródłach online w czasie rzeczywistym — isap.sejm.gov.pl, orzeczenia.ms.gov.pl, sn.pl.

Jak to działa — architektura
Zapytanie użytkownika
        ↓
prawny-router-v3          ← orchestrator; wczytywany ZAWSZE jako pierwszy
        ↓
prawo-polskie-v2          ← router dziedzinowy (16 dziedzin → DR-01..DR-16)
        ↓
DR-skill właściwy         ← moduł merytoryczny dla danej dziedziny prawa
        ↓
Skill wykonawczy          ← pisma, analiza dowodów, umowy, orzeczenia...
        ↓
shared/                   ← wspólna biblioteka: walidacja, fakty, terminy, HARDGATE
        ↓
Wynik: analiza / pismo / raport / widget interaktywny
Każdy krok jest kontrolowany przez PRAWO-HARDGATE — mechanizm blokujący cytowanie przepisów bez uprzedniej weryfikacji online. Naruszenie HARDGATE jest błędem krytycznym (CRIT) wykrywanym przez audyt systemu.

Zawartość systemu
Warstwa orkiestracji
SkillWersjaOpisprawny-router-v3v3.7Orchestrator każdej sprawy. Wykrywa tryb LAIK/PRAWNIK, koordynuje routing, generuje .docx/.pdfprawo-polskie-v2v4.1Fasada routera — mapa 191 aktów prawnych do 16 dziedzin DRprzewodnik-prawny-v2v2.1Gospodarz sesji dla użytkownika bez wiedzy prawniczej. Prowadzi krok po kroku
Dziedzinowe moduły prawne (DR-01 do DR-16)
SkillDziedzinaKluczowe aktydr-01Ustrój konstytucyjny i źródła prawaKonstytucja RP, TK, KRS, partie politycznedr-02Prawo cywilne, rodzinne i gospodarczeKC, KRO, KSH, prawo upadłościowe i restrukturyzacyjnedr-03Prawo karne, wykroczenia, egzekucjaKK, KPK, KW, KKS, KKW, ustawa antyprzemocowadr-04Prawo pracy, ZUS, świadczenia społeczneKP, KPA, SUS, KRUS, PIP, świadczenia rodzinnedr-05Prawo administracyjne i sądowoadministracyjneKPA, PPSA, UPEA, UDIP, RPO, SKO, cudzoziemcydr-06Podatki, finanse publiczne, AMLPIT, CIT, VAT, Ordynacja podatkowa, KAS, AML, Prawo bankowedr-07Zamówienia publiczne, fundusze UEPZP, PPP, fundusze UE 2021–2027, NIK, RIO, arbitrażdr-08Samorząd terytorialny i prawo lokalneUSG, USP, USWO, akty prawa miejscowegodr-09Budownictwo, środowisko, energia, transportPrawo budowlane, POŚ, Prawo energetyczne, OZE, transportdr-10Zdrowie, farmacja, żywność, rolnictwoPrawo farmaceutyczne, NFZ, prawa pacjenta, zawody medycznedr-11Cyfrowe, cyberbezpieczeństwo, AI, dane, IPRODO, KSC/NIS2, AI Act, prawo autorskie, znaki towarowedr-12Sądownictwo, prokuratura, zawody prawniczeUSP, Prawo o prokuraturze, adwokatura, radcowie, notariatdr-13Służby, bezpieczeństwo, informacje niejawnePolicja, ABW/AW, SG, SOP, obrona cywilna, informacje niejawnedr-14Prawo UE, międzynarodowe, prawa człowiekaRozporządzenia UE, EKPC, prawo traktatowe, ekstradycjadr-15Compliance, ISO, governance, audytISO 37001/37301/27001/42001, DORA, sygnaliści, AML compliancedr-16Pisma, strategia, dowody, orzecznictwoNarzędzia procesowe, strategia, dowody, orzecznictwo cross-domain
Skille wykonawcze
SkillWersjaCo robipisma-procesowe-v3v3Pisma wielowątkowe: pozwy, apelacje, odpowiedzi na pozew, pisma przygotowawczepisma-proste-v2v2Pisma jednostkowe: sprzeciw od nakazu, wniosek o klauzulę, wezwanie do zapłatyanalizator-umow-v1v1.6Analiza, redakcja i negocjacje umów — B2B, praca, najem, IT/SaaS, M&A, ubezpieczeniaanalizator-dowodow-v3v3/v5Ocena dowodów procesowych, hierarchia A–D, pokrycie przesłanek, analiza śledczaanalizator-przepisow-v2v2Analiza artykułów, przesłanki, wykładnia, historia nowelizacji, drzewo normorzeczenia-sadowe-v2v2.1Wyszukiwanie i weryfikacja orzeczeń z SN, NSA, WSA, TK — tylko z oficjalnych portalianaliza-sadowa-v6v6Czteroprzebiegowa analiza sprawy z podwójną weryfikacją dowodówchronologia-sprawy-v1v1.1Ekstrakcja i porządkowanie zdarzeń prawnych; wykrywanie sprzeczności datprzesluchanie-swiadkow-v2v2Przygotowanie pytań, kontrprzesłuchanie, impeachment, scoring wiarygodnościraport-sytuacyjny-v2v2Interaktywny widget: mapa ryzyk P1/P2/P3, chronologia, rekomendacje procesoweraport-klienta-v1v1Zewnętrzny raport statusu sprawy dla klienta — profil IND i BIZ
Biblioteka współdzielona (shared/)
Ponad 50 modułów kontrolnych używanych przez wszystkie skille, m.in.:

PRAWO-HARDGATE — globalny zakaz cytowania prawa i orzeczeń z pamięci
AKTY-PRAWNE-MASTER — jedyne źródło prawdy o aktualności 355 aktów prawnych
HYBRID-VALIDATION — walidacja hybrydowa przed wygenerowaniem .docx
MOD-WALIDACJA_v2 — formalna walidacja pism procesowych (bloki A–J)
FAKTY_v2 — weryfikacja zgodności faktycznej z dokumentami źródłowymi
LEGAL-STATUS-LOCK — klasyfikacja i weryfikacja statusu aktów prawnych
terminy — terminy zawite i przedawnienia (KPC/KPK/KPW/KPA/KP)

Narzędzia systemowe
SkillOpisaudyt-systemu-v4Audyt jakości, spójności i bezpieczeństwa systemu. Weryfikuje HARDGATE, ścieżki, metryki Dz.U., monitoring aktów oczekujących

Gwarancje systemu
PRAWO-HARDGATE (aktywny globalnie)
Żaden przepis, artykuł, numer Dz.U., kwota ustawowa, termin ani sygnatura orzeczenia nie może być podany bez uprzedniej weryfikacji w oficjalnym źródle online w tej samej odpowiedzi. Zakaz jest permanentny i nie wygasa w żadnym punkcie rozmowy.
Oficjalne źródła
System odwołuje się wyłącznie do: isap.sejm.gov.pl · orzeczenia.ms.gov.pl · sn.pl · nsa.gov.pl · trybunal.gov.pl · saos.org.pl · eur-lex.europa.eu
AKTY-PRAWNE-MASTER
Centralna baza 355 aktów prawnych z metrykami Dz.U., statusami (AKTUALNY / PO-TJ-ZMIANY / WYMAGA-KONTROLI / OCZEKUJE-WEJSCIA) i tabelą MONITORING aktów oczekujących na wejście w życie.
Audyt systemu
Każdy skill podlega scoringowi 0–10. Skill z wynikiem < 6.0 jest blokowany. Audyt obowiązkowo aktualizuje dziennik, mapę Dz.U. i tabelę MONITORING.

Wymagania

Konto Claude AI (claude.ai) — plan Pro lub Team (wymagany dostęp do skilli)
Przeglądarka internetowa
Brak instalacji oprogramowania


Instalacja i konfiguracja
Szczegółowa instrukcja krok po kroku: INSTALACJA.md
Skrót dla zaawansowanych:

Pobierz folder skilla z tego repozytorium
W Claude AI: Customize → Nowy skill → Wgraj skill z komputera → wskaż folder
Powtórz dla każdego skilla w kolejności: shared/ → prawo-polskie-v2 → prawny-router-v3 → pozostałe skille
W Claude AI → Settings → User Preferences wpisz:

Prawo PL: router→v3 pierwszy, ISAP każdy przepis, HYBRID-VAL przed .docx. Karne: +kwalifikator.

Dla deweloperów
Struktura skilla
Każdy skill to katalog zawierający:
nazwa-skilla/
├── SKILL.md          ← wymagany; YAML frontmatter + instrukcje dla modelu
├── MAPA-AKTOW.md     ← (w DR-skills) lokalna mapa aktów prawnych z metrykami Dz.U.
├── modules/          ← opcjonalne moduły ładowane przez lazy loading
└── references/       ← pliki referencyjne (mapy, dzienniki, dane)
YAML frontmatter (wymagany w każdym SKILL.md)
yaml---
name: nazwa-skilla
version: 1.0
type: executive | orchestration | domain | governance-audit | ux-guide
status: production | draft
description: |
  Opis skilla (max 1024 znaków — limit Claude AI)
compatibility:
  tools:
    - web_search
    - web_fetch
---
Zasady rozszerzania systemu
Nowy skill dziedzinowy (DR)

Utwórz katalog dr-NN-nazwa/
Dodaj SKILL.md z frontmatter i logiką routingu
Dodaj MAPA-AKTOW.md z tabelą aktów i metrykami Dz.U.
Dodaj moduły w modules/ według wzorca: mod-AKTSKROT-opis.md
Zarejestruj w prawo-polskie-v2/ROUTING-MAP.md
Zaktualizuj shared/AKTY-PRAWNE-MASTER.md

Nowy moduł w istniejącym DR

Utwórz plik modules/mod-XXXXXX.md
Dodaj wpis do MAPA-AKTOW.md skilla
Zarejestruj w prawo-polskie-v2/ROUTING-MAP.md

Zasada HARDGATE — obowiązkowa w każdym nowym skillu
Każdy skill musi na początku SKILL.md zawierać blok wywołujący HARDGATE:
view /mnt/skills/user/shared/PRAWO-HARDGATE.md
lub odwołanie do niego. Brak HARDGATE = błąd CRIT w audycie.
Lazy loading
Moduły nie są ładowane z góry. Skill ładuje tylko moduł pasujący do sprawy. Pozwala to na obsługę dziedzin z dziesiątkami aktów prawnych bez przeciążenia kontekstu.
Uruchamianie audytu
Po każdej zmianie w systemie uruchom audyt:
przeprowadź audyt systemu
lub w trybie docelowym:
audytuj mapę Dz.U.
Audyt weryfikuje: ścieżki, wersje cross-referencji, metryki Dz.U., HARDGATE, długości description, czystość kodu, monitoring aktów oczekujących.

Zastrzeżenie prawne
System Lex Machina jest narzędziem wspomagającym analizę prawną, nie zastępuje porady prawnej udzielonej przez licencjonowanego prawnika. Wyniki analizy należy zawsze skonsultować z adwokatem lub radcą prawnym przed podjęciem decyzji procesowych lub kontraktowych. Autor systemu nie ponosi odpowiedzialności za decyzje podjęte wyłącznie na podstawie wyników systemu.

Licencja
MIT License — szczegóły w pliku LICENSE.

Lex Machina · https://github.com/michaleiatrak-star/Lex-Machina · Aktualizacja systemu: 2026-06-07
