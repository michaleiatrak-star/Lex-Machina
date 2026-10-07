# Moduł [AB] — Prawo AI / AI Act

> **Plik:** `dr-11-cyfrowe-cyber-ai-dane-ip/modules/mod-AI-Act-framework.md`
> **Wersja:** 1.2 (2026-09-27, FAZA 3E — naprawa F-205)
> **Status:** AKTUALIZOWANY — luki U-14 domknięte: art. 25, art. 6 ust. 3, zał. III (pełna, poprawiona lista), art. 13 ust. 3
> **Weryfikacja:** ✅ [VER: EUR-Lex, rozporządzenie (UE) 2024/1689 CELEX 32024R1689, pobranie bezpośrednie eur-lex.europa.eu, 2026-09-27] — poprzednia weryfikacja web_search 2026-07-27 (rp.pl, prawo.pl, gazetaprawna.pl, cyberdefence24.pl, tmt.expert, skarbiec.biz) pozostaje aktualna dla części dot. ustawy krajowej

---

**Zakres:** Rozporządzenie UE 2024/1689 (AI Act), polska ustawa o systemach AI (projekt
zatwierdzony przez rząd 01.04.2026 r.), odpowiedzialność za systemy AI, zgodność,
nadzór, kary administracyjne, systemy zakazane, systemy wysokiego ryzyka, GPAI.

---

## KLUCZOWE AKTY PRAWNE

```
PRAWO UE (bezpośrednio stosowane w Polsce — bez transpozycji):
  - Rozporządzenie PE i Rady (UE) 2024/1689 z 13.06.2024 r. — AI Act
    → weryfikuj: eur-lex.europa.eu
    → weszło w życie: 01.08.2024 r.

ETAPY STOSOWANIA AI Act (zweryfikowano 2026-05-25):
  02.02.2025  → Przepisy o systemach zakazanych (art. 5) + AI Literacy (art. 4)
  02.08.2025  → Organy krajowe + kary za naruszenia zakazów + modele GPAI (art. 51–55)
  02.08.2026  → Systemy wysokiego ryzyka (aneks III) — pełne obowiązki
  02.08.2027  → Niektóre systemy wbudowane (aneks I)

PRAWO POLSKIE:
  ⚡ POPRAWKA PILNA 2026-07-27 (FAZA 3E/ZASADA 14) — moduł był
  NIEAKTUALNY o CAŁY etap procesu legislacyjnego. Poprzednia wersja
  (VER 2026-05-25/06-05) opisywała ustawę jako "projekt przed
  uchwaleniem przez Sejm". W rzeczywistości od tego czasu:
    09.04.2026 — projekt wpłynął do Sejmu (po zatwierdzeniu przez
                 rząd 30.03.2026)
    11.06.2026 — Sejm UCHWALIŁ ustawę (421 za, 3 przeciw, 18 wstrzym.)
    25.06.2026 — Senat zgłosił 25 poprawek
    03.07.2026 — Sejm przyjął 24 z 25 poprawek Senatu, prace
                 parlamentarne ZAKOŃCZONE
    24.07.2026 — PREZYDENT PODPISAŁ ustawę (2 dni przed tym audytem!)
    sierpień 2026 — planowane wejście w życie (dokładna data zależy
                 od publikacji w Dzienniku Ustaw — SPRAWDŹ
                 isap.sejm.gov.pl dla konkretnej daty przed użyciem)

  - Ustawa o systemach sztucznej inteligencji (podpisana 24.07.2026)
    → Powołuje: Komisja Rozwoju i Bezpieczeństwa Sztucznej Inteligencji
      (KRiBSI) — niezależny krajowy organ nadzoru rynku AI, obsługa
      organizacyjno-kancelaryjna przez Ministerstwo Cyfryzacji
    → Struktura KRiBSI: Przewodniczący (kadencja 5 lat, powoływany
      przez Sejm za zgodą Senatu) + 2 zastępców + 4 członków
      delegowanych przez UOKiK, UKE, KNF, KRRiT
    → Wprowadza PIASKOWNICE REGULACYJNE dla przedsiębiorców i urzędów
    → Nowa ŚCIEŻKA SKARGOWA dla obywateli — prawo złożenia wniosku o
      interwencję do KRiBSI, jeśli system AI narusza przepisy
    → Penalizuje stosowanie zakazanych praktyk AI (art. 5 AI Act) —
      system kar administracyjnych
    → UWAGA: AI Act i tak obowiązuje bezpośrednio NIEZALEŻNIE od stanu
      ustawy krajowej — ustawa krajowa dotyczy NADZORU i EGZEKWOWANIA,
      nie samych materialnych obowiązków z Rozporządzenia UE

    Potwierdzone: rp.pl [21.07.2026], prawo.pl, gazetaprawna.pl,
    cyberdefence24.pl, tmt.expert [sprzed 2 dni], skarbiec.biz
    [sprzed 2 dni] — 6 źródeł zgodnych co do przebiegu procesu i treści.

POWIĄZANE:
  - RODO (rozporządzenie 2016/679) — dane osobowe w systemach AI
  - Dyrektywa 2013/36/UE (CRD IV) — AI w finansach
  - Dyrektywa o odpowiedzialności za AI (projekt) — w toku na poziomie UE
```

---

## KLASYFIKACJA SYSTEMÓW AI (art. 5 i Aneks III AI Act)

### Systemy ZAKAZANE (art. 5 — od 02.02.2025)

```
□ Biometryczna identyfikacja w czasie rzeczywistym w przestrzeni publicznej
  (wyjątek: zwalczanie poważnej przestępczości — art. 5 ust. 1 lit. h)
□ Kategoryzacja biometryczna wg cech chronionych (rasa, religia, orientacja seksualna)
□ Systemy social scoring przez władze publiczne
□ Manipulacja podświadoma lub exploitacja wrażliwości (wiek, niepełnosprawność)
□ Przewidywanie przestępczości na podstawie profilowania (nie dowodów)
□ Nieuprawnione scraping twarzy z internetu lub CCTV
□ Rozpoznawanie emocji w miejscu pracy i edukacji (wyjątki: medycyna, bezpieczeństwo)
```

### Systemy WYSOKIEGO RYZYKA (Aneks III — od 02.08.2026)

```
⚡ POPRAWKA 2026-09-27 (FAZA 3E, F-205, U-14) — lista niżej była BŁĘDNA:
brakowało kategorii 1 (Biometria), numeracja kategorii 2–7 była przesunięta
o jeden punkt względem oryginału, a pozycja 8 podawała „Urządzenia medyczne”
— kategorii o tej nazwie W ZAŁĄCZNIKU III W OGÓLE NIE MA (urządzenia medyczne
mogą być wysokiego ryzyka na INNEJ podstawie — art. 6 ust. 1 + załącznik I,
jako produkt objęty odrębnym unijnym prawodawstwem harmonizacyjnym, np.
rozporządzeniem MDR — nie przez zał. III). Błąd nie miał dotąd zgłoszonej
flagi jako osobny numer — koryguję przy okazji F-205, ponieważ dotyczy tej
samej jednostki (zał. III), której weryfikację nakazywała flaga.
Poprawiona lista (✅ [VER: EUR-Lex, CELEX 32024R1689, załącznik III, 2026-09-27]):

Obszary (8, zgodnie z art. 6 ust. 2 — dokładna numeracja z aktu):
  1. Biometria (o ile dozwolona prawem Unii/krajowym): zdalna identyfikacja
     biometryczna (nie dotyczy weryfikacji 1:1 potwierdzającej tożsamość),
     kategoryzacja biometryczna wg cech wrażliwych/chronionych, rozpoznawanie emocji
  2. Infrastruktura krytyczna: elementy związane z bezpieczeństwem zarządzania
     krytyczną infrastrukturą cyfrową, ruchem drogowym, wodą/gazem/ciepłem/energią
  3. Kształcenie i szkolenie zawodowe: dostęp/przyjęcie do instytucji, ocena
     efektów uczenia się, ocena poziomu wykształcenia, wykrywanie niedozwolonego
     zachowania na testach
  4. Zatrudnienie, zarządzanie pracownikami i dostęp do samozatrudnienia:
     rekrutacja/selekcja (w tym ukierunkowane ogłoszenia, filtrowanie podań),
     decyzje o awansie/rozwiązaniu stosunku pracy, przydzielanie zadań,
     monitorowanie/ocena wydajności i zachowania
  5. Dostęp do podstawowych usług prywatnych oraz usług/świadczeń publicznych:
     kwalifikowalność do świadczeń publicznych, scoring/zdolność kredytowa
     (poza wykrywaniem oszustw finansowych), ocena ryzyka i cena ubezpieczeń
     życiowych/zdrowotnych, klasyfikacja zgłoszeń alarmowych/dysponowanie
     służbami ratunkowymi
  6. Ściganie przestępstw (o ile dozwolone prawem Unii/krajowym): ocena ryzyka
     bycia ofiarą, wariografy, ocena wiarygodności dowodów, ocena ryzyka
     popełnienia/powtórzenia przestępstwa, profilowanie w rozumieniu
     dyrektywy (UE) 2016/680
  7. Zarządzanie migracją, azylem i kontrolą graniczną: wariografy, ocena
     ryzyka (bezpieczeństwo/migracja nieuregulowana/zdrowie), wsparcie
     rozpatrywania wniosków azylowych/wizowych/pobytowych, wykrywanie/
     rozpoznawanie/identyfikacja osób (poza weryfikacją dokumentów podróży)
  8. Sprawowanie wymiaru sprawiedliwości i procesy demokratyczne: wspomaganie
     organu wymiaru sprawiedliwości w badaniu/interpretacji stanu faktycznego
     i prawa (także ADR), wpływanie na wynik wyborów/referendum lub zachowanie
     wyborców (nie dotyczy narzędzi czysto logistyczno-organizacyjnych kampanii)

⚠️ Sekcja „AI W WYMIARZE SPRAWIEDLIWOŚCI” niżej w tym module cytowała już
POPRAWNIE „Aneks III pkt 8” dla systemów wsparcia decyzji sądowych — czyli
w tym samym pliku współistniały DWIE sprzeczne numeracje tej samej jednostki.
Po tej poprawce obie są spójne.

Obowiązki dostawców systemów wysokiego ryzyka:
  □ System zarządzania ryzykiem (art. 9)
  □ Zarządzanie danymi i danymi szkoleniowymi (art. 10)
  □ Dokumentacja techniczna (art. 11)
  □ Prowadzenie dzienników zdarzeń (art. 12)
  □ Przejrzystość i dostarczanie informacji użytkownikom (art. 13) —
    ⭐ instrukcja obsługi wg art. 13 ust. 3 MUSI zawierać co najmniej
    (✅ [VER: EUR-Lex, CELEX 32024R1689, art. 13 ust. 3, 2026-09-27],
    dodane FAZA 3E/F-205/U-14 — dotąd tylko gołe odesłanie do art. 13):
      a) tożsamość i dane kontaktowe dostawcy (i upoważnionego przedstawiciela);
      b) cechy/możliwości/ograniczenia: przeznaczenie; poziom dokładności,
         solidności i cyberbezpieczeństwa (art. 15) wraz ze wskaźnikami
         oraz okolicznościami mogącymi na nie wpłynąć; znane/przewidywalne
         okoliczności użycia zgodnego z przeznaczeniem lub przewidywalnego
         niewłaściwego użycia mogące stwarzać ryzyko (art. 9 ust. 2);
         w stosownych przypadkach — możliwości wyjaśnialności wyników,
         działanie wobec określonych osób/grup, specyfikacje danych
         treningowych/walidacyjnych/testowych, informacje dla interpretacji
         wyników;
      c) zaplanowane z góry zmiany systemu i jego skuteczności działania;
      d) środki nadzoru ludzkiego (art. 14), w tym środki techniczne
         ułatwiające interpretację wyników;
      e) potrzebne zasoby obliczeniowe/sprzętowe, przewidywany cykl życia,
         środki konserwacji/aktualizacji;
      f) w stosownych przypadkach — opis mechanizmów zbierania/przechowywania/
         interpretowania rejestrów zdarzeń (art. 12).
    → PRAKTYCZNY SKUTEK: klauzula umowna typu „Dostawca dostarczy dokumentację
      techniczną” bez odesłania do powyższego katalogu jest NIEWYSTARCZAJĄCA
      dla zgodności z art. 13 — przy audycie/draftowaniu umowy wdrożeniowej
      systemu wysokiego ryzyka wymagaj wprost punktów a)–f).
  □ Nadzór ludzki (art. 14)
  □ Dokładność, solidność i cyberbezpieczeństwo (art. 15)
  □ Ocena zgodności + oznakowanie CE (art. 43–48)
```

### ⭐ Art. 6 ust. 3 — WYJĄTEK od klasyfikacji wysokiego ryzyka + PROFILOWANIE zawsze wysokiego ryzyka

> ✅ [VER: EUR-Lex, CELEX 32024R1689, art. 6 ust. 3, pobranie bezpośrednie 2026-09-27]
> Dodane FAZA 3E (F-205, U-14) — element dotąd NIEOBECNY w module, mimo że jest
> to najczęściej praktycznie istotny mechanizm przy ocenie, czy konkretny system
> z zał. III RZECZYWIŚCIE jest wysokiego ryzyka.

```
ZASADA (art. 6 ust. 3 akapit 1): system AI wymieniony w zał. III NIE jest
uznawany za system wysokiego ryzyka, jeżeli NIE stwarza znaczącego ryzyka
szkody dla zdrowia, bezpieczeństwa lub praw podstawowych osób fizycznych
(w tym poprzez brak znaczącego wpływu na wynik procesu decyzyjnego) —
POD WARUNKIEM że spełniony jest KTÓRYKOLWIEK z poniższych warunków:

  a) system wykonuje wąsko określone zadanie proceduralne;
  b) system poprawia wynik ZAKOŃCZONEJ UPRZEDNIO czynności wykonanej
     przez człowieka;
  c) system wykrywa wzorce decyzyjne lub odstępstwa od wzorców, bez celu
     zastąpienia/wywarcia wpływu na zakończoną uprzednio ocenę człowieka
     — BEZ odpowiedniej weryfikacji przez człowieka;
  d) system wykonuje zadania PRZYGOTOWAWCZE w kontekście oceny istotnej
     dla przypadków z zał. III.

⛔ WYŁĄCZENIE Z WYŁĄCZENIA (art. 6 ust. 3 akapit 2, zdanie kluczowe dla
praktyki kancelaryjnej): NIEZALEŻNIE od powyższych czterech warunków,
system z zał. III jest ZAWSZE uznawany za system wysokiego ryzyka, JEŻELI
DOKONUJE PROFILOWANIA OSÓB FIZYCZNYCH (w rozumieniu art. 4 pkt 4 RODO,
przez odesłanie systemowe AI Act do tego pojęcia).
→ PRAKTYCZNY SKUTEK: żadne narzędzie prawnicze/HR/scoringowe, które profiluje
  osoby fizyczne (np. przez automatyczne punktowanie cech/zachowań/przewidywanie
  preferencji), nie może skorzystać z wyjątku a)–d) powyżej, choćby spełniało
  formalnie jeden z tych warunków — od razu wysokiego ryzyka.

PROCEDURA DLA DOSTAWCY korzystającego z wyjątku (art. 6 ust. 4): przed
wprowadzeniem do obrotu/oddaniem do użytku — DOKUMENTUJE ocenę; podlega
obowiązkowi REJESTRACJI (art. 49 ust. 2); na żądanie organu krajowego
przedstawia dokumentację tej oceny.

Komisja ma wydać wytyczne wykonawcze do art. 6 najpóźniej 02.02.2026 r.
(art. 6 ust. 5) — sprawdź, czy już opublikowane, przy każdym użyciu.
```

### ⭐ Art. 25 — Odpowiedzialność w całym łańcuchu wartości AI

> ✅ [VER: EUR-Lex, CELEX 32024R1689, art. 25, pobranie bezpośrednie 2026-09-27]
> Dodane FAZA 3E (F-205, U-14) — element dotąd NIEOBECNY w module; kluczowy
> dla klientów będących dystrybutorami/importerami/integratorami systemów AI,
> nie tylko pierwotnymi dostawcami.

```
ZASADA: dystrybutor, importer, podmiot stosujący lub inna strona trzecia
STAJE SIĘ „dostawcą” systemu AI wysokiego ryzyka (i przejmuje PEŁNIĘ
obowiązków dostawcy z art. 16) w KAŻDEJ z sytuacji (art. 25 ust. 1):

  a) umieszcza swoją nazwę/znak towarowy na już wprowadzonym do obrotu/
     oddanym do użytku systemie AI wysokiego ryzyka (bez uszczerbku dla
     odmiennych ustaleń umownych co do podziału obowiązków);
  b) dokonuje ISTOTNEJ ZMIANY już wprowadzonego systemu AI wysokiego
     ryzyka, tak że pozostaje on systemem wysokiego ryzyka wg art. 6;
  c) zmienia PRZEZNACZENIE systemu AI (w tym GPAI) niesklasyfikowanego
     jako wysokiego ryzyka, tak że STAJE SIĘ on systemem wysokiego ryzyka
     wg art. 6.

SKUTEK (art. 25 ust. 2): pierwotny dostawca PRZESTAJE być uznawany za
dostawcę tego systemu; ma obowiązek ścisłej współpracy z nowym dostawcą
(informacje, dostęp techniczny, wsparcie) — CHYBA że wyraźnie zastrzegł,
że jego system nie może zostać przekształcony w system wysokiego ryzyka
(wtedy zwolniony z obowiązku przekazania dokumentacji).

Art. 25 ust. 4: dostawca systemu wysokiego ryzyka i strona trzecia
dostarczająca komponenty/narzędzia/usługi integrowane z tym systemem
MUSZĄ w PISEMNEJ UMOWIE określić informacje/zdolności/dostęp techniczny
potrzebne dostawcy do spełnienia obowiązków z rozporządzenia — NIE dotyczy
to podmiotów udostępniających bezpłatnie na licencji open-source narzędzia
inne niż modele GPAI. Urząd ds. AI MOŻE opracować dobrowolne wzorcowe
postanowienia umowne dla takich kontraktów.

PRAKTYCZNY SKUTEK DLA UMÓW (łącz z `analizator-umow-v1`): przy integracji/
white-labelingu/istotnej modyfikacji cudzego systemu AI — sprawdź, czy
umowa z pierwotnym dostawcą PRZEWIDUJE mechanizm przekazania informacji
technicznych wymaganych art. 25 ust. 4, oraz czy klauzula podziału
obowiązków (art. 25 ust. 1 lit. a) jest w ogóle zawarta — jej brak
oznacza domyślne przejęcie PEŁNI obowiązków dostawcy przez integratora/
rebrandera z mocy samego prawa.
```

### Modele AI ogólnego przeznaczenia GPAI (art. 51–55 — od 02.08.2025)

```
Obowiązki dostawców GPAI:
  □ Dokumentacja techniczna
  □ Streszczenie danych treningowych (prawa autorskie)
  □ Polityka zgodności z prawem autorskim
  □ Dodatkowe dla modeli z ryzykiem systemowym (FLOP > 10^25):
    - Ocena ryzyka
    - Raportowanie incydentów
    - Środki cyberbezpieczeństwa
```

---

## KARY (art. 99 AI Act)

```
Systemy zakazane (art. 5):         do 35 mln EUR lub 7% globalnego obrotu
Systemy wysokiego ryzyka (narusz.): do 15 mln EUR lub 3% globalnego obrotu
Podanie nieprawdziwych informacji:  do 7,5 mln EUR lub 1,5% globalnego obrotu
Podmioty MŚP:                       kary obliczane proporcjonalnie (niższy próg)

⚡⚡ POTWIERDZONE 2026-07-30 (na żądanie użytkownika) — USTAWA KRAJOWA
JUŻ PODPISANA: Ustawa z 3.07.2026 o systemach sztucznej inteligencji
(druk sejmowy 2443) — Sejm przyjął 24 z 25 poprawek Senatu (3.07.2026),
Prezydent Karol Nawrocki PODPISAŁ **24.07.2026** (razem z 4 innymi
ustawami tego dnia, w tym nowelizacją o ochronie zwierząt — "ustawa
łańcuchowa"). KRiBSI JUŻ NIE JEST projektem — to REALNY, powołany
organ:
  → Struktura: Przewodniczący (kadencja 5 lat) + 2 zastępców,
    działa jako POJEDYNCZY PUNKT KONTAKTOWY (art. 70 ust. 2 AI Act)
  → Kompetencje: kontrole, postępowania, rozpatrywanie SKARG,
    nakładanie kar, NAKAZ WYCOFANIA niezgodnego systemu z rynku/użytku
  → Kary NIE SĄ automatyczne — organ OCENIA: charakter/wagę/czas
    trwania naruszenia, liczbę dotkniętych osób, poziom szkody,
    wielkość przedsiębiorcy, współpracę, umyślność, działania
    naprawcze — dopiero na tej podstawie ustala wysokość w granicach
    unijnego maksimum
  → PIASKOWNICE REGULACYJNE: MŚP mogą BEZPŁATNIE testować technologie
    AI w kontrolowanym środowisku regulacyjnym
  → Postępowanie w sprawie kary: JEDNOINSTANCYJNE — odwołanie
    BEZPOŚREDNIO do Sądu Okręgowego w Warszawie (Sąd Ochrony
    Konkurencji i Konsumentów, SOKiK) — NIE zwykła droga administracyjna
  → Środki z kar: PRZYCHÓD BUDŻETU PAŃSTWA, egzekwowane wg przepisów
    o postępowaniu egzekucyjnym w administracji
  → Ustawa NOWELIZUJE PRZY OKAZJI: KPC, postępowanie egzekucyjne w
    administracji, ustawę o radiofonii i telewizji, ustawę o
    ograniczeniu działalności gospodarczej osób pełniących funkcje
    publiczne, ustawę o ABW/AW, ustawę o kosztach sądowych, ustawę o
    nadzorze nad rynkiem finansowym, ustawę o ochronie danych
    osobowych, ustawę o KSC (cyberbezpieczeństwo)
  → ⚡ Od **2 SIERPNIA 2026 R.** (za 3 dni od tej weryfikacji!)
    zaczynają obowiązywać przepisy o PRZEJRZYSTOŚCI systemów AI —
    użytkownik MUSI zostać poinformowany, że kontaktuje się z
    MASZYNĄ, nie człowiekiem
  Potwierdzone w 5+ zgodnych źródłach (forsal.pl, skarbiec.biz,
  orka.sejm.gov.pl — Rząd 1, pełny tekst ustawy) — WSZYSTKIE zgodne.

KRiBSI (Polska): postępowania + kary + kontrole — organ JUŻ POWOŁANY
  ustawą (patrz wyżej) — sprawdź na dzień użycia, czy Komisja
  ZOSTAŁA już faktycznie OBSADZONA (powołanie przewodniczącego/
  zastępców to ODRĘBNY, kolejny krok od samego wejścia ustawy w życie)
UWAGA: kary za naruszenia art. 5 (zakazy) mogą być nakładane od 02.08.2025 r.
       nawet bez powołanego KRiBSI przez Komisję Europejską / inne organy
```

---

## AI W WYMIARZE SPRAWIEDLIWOŚCI

```
Art. 5 ust. 1 lit. f AI Act: zakaz systemów oceny ryzyka recydywy opartych WYŁĄCZNIE
na profilowaniu (bez indywidualnej oceny przez człowieka).

Systemy wsparcia decyzji sądowych → kategoria wysokiego ryzyka (Aneks III pkt 8):
  □ Wymóg nadzoru ludzkiego (sędzia musi zachować kontrolę nad decyzją)
  □ Zakaz zastąpienia sędziego przez AI
  □ Transparentność: strony muszą wiedzieć o użyciu AI

Praktyczne pytania prawne 2025–2026:
  - Czy dowód z AI (transkrypcja AI, analiza AI) jest dopuszczalny? → Brak expressis verbis
    regulacji KPK/KPC; stosuj: zasada swobodnej oceny dowodów (art. 233 KPC, art. 7 KPK)
    + wymóg transparentności AI Act
  - Odpowiedzialność cywilna za błąd AI → KC art. 415 (wina) lub art. 435 (ryzyko) +
    dyrektywa o odpowiedzialności za AI (projekt UE)
  - RODO + AI w postępowaniu sądowym → art. 22 RODO: zakaz wyłącznie zautomatyzowanego
    podejmowania decyzji wywołujących skutki prawne
```

---

## AI LITERACY (art. 4 — od 02.02.2025)

```
Obowiązek pracodawców (dostawcy i podmioty stosujące AI):
  → Zapewnienie odpowiedniego poziomu kompetencji AI wśród personelu
  → Dotyczy osób zajmujących się działaniem i wykorzystaniem systemów AI
  → Brak precyzyjnego progu — proporcjonalne do ryzyka i złożoności systemu
```

---

## PYTANIA KWALIFIKACYJNE (routing)

Pytanie od użytkownika → moduł AB gdy zawiera:
- "AI Act" / "sztuczna inteligencja prawo" / "system AI zgodność" / "GPAI"
- "zakaz AI" / "wysokie ryzyko AI" / "certyfikacja AI" / "oznakowanie CE AI"
- "kara za AI" / "KRiBSI" / "komisja AI Polska"
- "odpowiedzialność za błąd AI" / "dowód z AI w sądzie" / "AI w rekrutacji prawo"
- "AI literacy" / "kompetencje AI obowiązek" / "dokumentacja AI"
- "profilowanie AI zawsze wysokie ryzyko" / "wyjątek zał. III" / "system AI nie jest wysokiego ryzyka"
- "importer/dystrybutor systemu AI" / "rebranding AI" / "integracja systemu AI odpowiedzialność"
  / "łańcuch wartości AI" / "kto jest dostawcą systemu AI"
- "instrukcja obsługi systemu AI wysokiego ryzyka" / "art. 13 AI Act treść"

---

## ŁĄCZ Z

| Sytuacja | Skill / Moduł |
|---|---|
| RODO + AI (dane osobowe w systemach AI) | `dr-11-cyfrowe-cyber-ai-dane-ip/modules/mod-RODO-GDPR-2016-679.md` |
| Prawa autorskie do treści AI | `dr-11-cyfrowe-cyber-ai-dane-ip/modules/mod-PrAut-wlasnosc-intelektualna-IP.md` |
| AI w umowach (klauzule zgodności) | `analizator-umow-v1` |
| Pismo / skarga do KRiBSI | `pisma-procesowe-v3` |
| AI w postępowaniu sądowym (dowód) | `analizator-dowodow-v3` |
| AI w miejscu pracy (art. 5 zakazy) | `dr-04-prawo-pracy-zus-swiadczenia/modules/mod-KP-prawo-pracy.md` |
| AI w administracji publicznej | `dr-05-prawo-administracyjne-sadowoadministracyjne/modules/mod-KPA-postepowanie-administracyjne.md` |

---

## WERYFIKACJA

Przepisy AI Act: eur-lex.europa.eu (rozporządzenie 2024/1689)
Status ustawy polskiej: legislacja.gov.pl (projekt MC, 2026)
Wytyczne KE: digital-strategy.ec.europa.eu
Aktualizuj przy każdym pytaniu — etapy stosowania AI Act są kroczące.

```
⚠️ UWAGA SYSTEMOWA: AI Act jest prawem dynamicznym (kolejne etapy stosowania
w 2025, 2026, 2027). ZAWSZE weryfikuj aktualny etap stosowania przed analizą.
Stan na 2026-07-27: obowiązują art. 5 (zakazy) + art. 4 (AI literacy) + art. 51-55 (GPAI). Polska ustawa o AI PODPISANA (24.07.2026), wejście w życie w sierpniu 2026 (sprawdź dokładną datę).
```

---

## ⚡ AKTUALIZACJA STATUS PRAWA POLSKIEGO (VER: 2026-07-27)

```
AI Act (Rozp. UE 2024/1689):
  → W życie: 01.08.2024
  → Etapy stosowania (OBOWIĄZUJĄCE na 2026-07-27):
    ✅ 02.02.2025: Zakazy (art. 5) + AI Literacy (art. 4) — OBOWIĄZUJĄ
    ✅ 02.08.2025: GPAI (art. 51–55) + organy krajowe — OBOWIĄZUJĄ
    ⏳ 02.08.2026: Systemy wysokiego ryzyka (Aneks III) — ZA OK. TYDZIEŃ,
       jeszcze nie weszło w życie na dzień audytu (26.07.2026), ale BARDZO
       BLISKO — sprawdź ponownie przy każdym użyciu w lipcu/sierpniu 2026
    ⏳ 02.08.2027: Systemy wbudowane (Aneks I) — JESZCZE NIE

Polska ustawa o systemach AI:
  ⚡ PODPISANA PRZEZ PREZYDENTA 24.07.2026 r. — prace parlamentarne
  ZAKOŃCZONE (Sejm 11.06.2026, Senat 25.06.2026, Sejm ponownie 03.07.2026).
  → ⭐ METRYKA USTALONA 2026-08-14 (domknięcie flagi F-50, FAZA 3E —
    ZASADA 11 treść-po-mapie; poprzednia sesja poprawiła sam wiersz
    MAPA-AKTOW.md, ale NIE treść tego modułu):
    • Ustawa z dnia 3 lipca 2026 r. o systemach sztucznej inteligencji
    • **Dz.U. 2026 poz. 1003** — akt PIERWOTNY (ogłoszenie), NIE t.j.
    • Podpisana przez Prezydenta: 24.07.2026
    • Ogłoszona w Dzienniku Ustaw: koniec lipca 2026 (źródła Rzędu 2/3
      podają 27.07 albo 28.07 — ⚠️ przy powoływaniu DATY OGŁOSZENIA w
      piśmie potwierdź ją w ISAP, rozbieżność nierozstrzygnięta)
    • **Wejście w życie: 11 sierpnia 2026 r.** (zasadniczo — ustawa
      zawiera przepisy o odrębnych terminach; przy terminie
      procesowym zawsze sprawdź przepis końcowy w ELI (RZĄD 1))
    ŹRÓDŁA (ZASADA 12): Rząd 1 — isap.sejm.gov.pl (WDU20260001003),
    eli.gov.pl/eli/DU/2026/1003/ogl, gov.pl/web/cyfryzacja;
    Rząd 3 (potwierdzenie zbieżności, nie samodzielna podstawa) —
    kancelarie zglegal.pl, dlklegal.com, kancelariamacura.pl
  → Terminy ustrojowe KRiBSI liczone OD WEJŚCIA W ŻYCIE: przewodniczący
    w ciągu 2 miesięcy (→ ok. X.2026), pełny skład Komisji w ciągu
    3 miesięcy (→ ok. XI.2026) — źródło Rząd 1 (Ministerstwo Cyfryzacji)
  → ⚠️ ZMIANA W TOKU PRAC PARLAMENTARNYCH (źródło Rząd 3, wymaga
    potwierdzenia w tekście ustawy przed powołaniem w piśmie):
    zrezygnowano z przyznania KRiBSI uprawnienia do NAKAZANIA wycofania
    systemu z rynku / usunięcia jego elementów — jeśli budujesz
    argumentację na zakresie kompetencji KRiBSI, zweryfikuj to
    bezpośrednio w Dz.U. 2026 poz. 1003
  → Powołuje: KRiBSI (przewodniczący 5-letnia kadencja + 2 zastępców +
    4 członków z UOKiK/UKE/KNF/KRRiT), piaskownice regulacyjne, ścieżka
    skargowa obywateli
  → UWAGA: AI Act obowiązuje BEZPOŚREDNIO niezależnie od stanu ustawy
    krajowej — ustawa krajowa dotyczy nadzoru/egzekwowania

web_search: "ustawa o systemach sztucznej inteligencji Dziennik Ustaw data wejścia w życie"
web_search: "AI Act systemy wysokiego ryzyka 2 sierpnia 2026"
```
