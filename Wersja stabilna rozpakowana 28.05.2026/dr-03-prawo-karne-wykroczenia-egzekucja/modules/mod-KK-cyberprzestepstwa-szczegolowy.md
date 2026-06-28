# Cyberprzestępczość — Szczegółowy Framework

## TERMINY — SPRAWDŹ JAKO PIERWSZE
```
Przedawnienie karalności (art. 101 KK) — zależne od zagrożenia:
  Do 3 lat (np. naruszenie tajemnicy korespondencji art. 267 §1): 5 lat
  Do 5 lat: 10 lat
  Powyżej 5 lat (art. 269a — sabotaż systemów): 15 lat
Zawiadomienie o przestępstwie:    brak terminu zawitego (ale jak najszybciej)
Zabezpieczenie dowodów cyfrowych: NATYCHMIAST — dane mogą być usunięte w godzinach
Pozew cywilny (dobra osobiste):   art. 4421 KC — 3 lata od dowiedzenia się o szkodzie (delikt); art. 117 §1 KC — 6 lat (ogólny termin roszczeń majątkowych)
```

## FAZA 0 — INTAKE
```
□ Co konkretnie nastąpiło?
  → hacking / phishing / ransomware / stalking online / groźby / DDoS
  → fałszywy profil / podszywanie się / zniesławienie / naruszenie wizerunku
  → kradzież danych / wyciek / doxxing
□ Kiedy odkryto i kiedy nastąpiło? (ocena przedawnienia i zakresu szkody)
□ Czy wiadomo kto jest sprawcą? (nick / IP / profil / znajomy / firma)
□ Jakie dowody już zabezpieczono?
□ Jaki efekt oczekuje klient?
  → ściganie karne / usunięcie treści / odszkodowanie / identyfikacja sprawcy
□ Czy sprawa ma wymiar transgraniczny (platforma lub sprawca za granicą)?
□ Czy to zdarzenie jednorazowe czy trwające? (stalking online → art. 190a)
□ Czy jest szkoda majątkowa? (phishing, ransomware, wyłudzenie → art. 287 KK)
□ Czy sprawca to osoba bliska? (tryb wnioskowy dla art. 268, 268a, 287 §3 KK)
```

## MAPA PRZESTĘPSTW — KWALIFIKACJA
| Czyn | Przepis | Zagrożenie | Tryb ścigania |
|---|---|---|---|
| Nielegalny dostęp do systemu | art. 267 §1 KK | do 2 lat | na wniosek |
| Podsłuch / przechwyt danych | art. 267 §3 KK | do 3 lat | na wniosek |
| Naruszenie integralności danych | art. 268 KK | do 2 lat (§1) / do 3 lat (§2 — znaczna szkoda) | na wniosek gdy os. bliska (art. 268 §3 KK) |
| Sabotaż systemów informatycznych | art. 268a KK | do 3 (§1) / do 5 lat (§2) | na wniosek gdy os. bliska (art. 268a §3 KK) |
| Zakłócenie pracy systemu (DDoS) | art. 269a KK | do 5 lat | z urzędu |
| Wytwarzanie/obrót narzędziami hakerskimi | art. 269b KK | do 2 lat | z urzędu |
| Phishing / wyłudzenie danych / oszustwo komputerowe | art. 287 KK | do 5 lat (§1); §3 (szkoda znaczna) do 8 lat | na wniosek gdy os. bliska (art. 287 §4 KK) |
| Kradzież tożsamości / podszywanie się | art. 190a §2 KK | 6 m–8 lat | na wniosek |
| Stalking online | art. 190a §1 KK | 6 m–8 lat | na wniosek |
| Groźby przez internet | art. 190 §1 KK | do 3 lat | na wniosek |
| Zniesławienie online | art. 212 §2 KK | do 2 lat lub grzywna | prywatnoskargowy |
| Naruszenie wizerunku (intymne) | art. 191a KK | 3 m–5 lat | na wniosek |

⚠️ WERYFIKUJ TRYB ŚCIGANIA przed udzieleniem porady — od trybu zależy czy Policja działa sama.

## ZABEZPIECZANIE DOWODÓW CYFROWYCH — PROCEDURA
```
ZASADA: działaj NATYCHMIAST — logi serwera są kasowane po 30–90 dniach,
        platformy usuwają treści na zgłoszenie sprawcy

KROK 1 — Zabezpiecz samodzielnie (PRZED zgłoszeniem Policji):
  □ Zrzuty ekranu z widocznym URL i datą (F12 → Inspect → timestamp)
  □ Nagranie ekranu ze ścieżką URL w przeglądarce
  □ Pełne nagłówki e-maila (View Source / Show Original) — zawierają IP serwera
  □ Zapis HTML strony (Ctrl+S jako plik kompletny)
  □ Archiwum web: web.archive.org (Wayback Machine — zapisz URL)
  □ Hash pliku / zrzutu (SHA-256): narzędzia online lub CertUtil w Windows
  □ Wydruk PDF z datą i godziną w stopce przeglądarki

KROK 2 — Notarialne poświadczenie treści (opcjonalne, duże sprawy):
  → Akt notarialny stwierdzający treść strony internetowej / wiadomości
  → Walor dowodowy: dokument urzędowy (art. 244 KPC)

KROK 3 — Wniosek do sądu o zabezpieczenie danych (art. 218 KPK):
  → Sąd lub prokurator zarządza zatrzymanie danych u operatora
  → Wymaga wszczętego postępowania karnego lub zgody prokuratora
  → Termin: operator ma obowiązek natychmiastowej realizacji
```

## IDENTYFIKACJA SPRAWCY — ŚCIEŻKI
```
A. POLICJA (postępowanie karne):
   → Po zawiadomieniu — Policja kieruje zapytania o logi IP do platform/operatorów
   → MLAT (mutual legal assistance) — gdy platforma lub sprawca za granicą
   → Może potrwać miesiące lub lata (GAFAM: Meta, Google zwykle odpowiadają)

B. PLATFORMA / PORTAL:
   → Zgłoszenie naruszenia regulaminu (abuse report) — usunięcie treści (nie identyfikacja)
   → Platformy UE objęte DSA (Digital Services Act): obowiązek odpowiedzi na wniosek organu

C. POWÓDZTWO CYWILNE O UJAWNIENIE DANYCH:
   → Sąd cywilny może nakazać operatorowi ujawnienie danych abonenta
   → Podstawa: art. 159 ust. 2 pkt 4 Prawa telekomunikacyjnego (Dz.U. 2024.1221 t.j.) lub odpowiednik w ustawie o komunikacji elektronicznej — weryfikuj aktualnie w isap.sejm.gov.pl
   → Skuteczne np. wobec operatorów polskich — szybsze niż MLAT

D. EUROPEJSKI NAKAZ ZACHOWANIA DANYCH (e-Evidence):
   → Od 2026 r. wchodzi rozporządzenie UE e-Evidence — ułatwia trans-graniczne żądania
   → Weryfikuj aktualny status wdrożenia: EUR-LEX
```

## PRZESTĘPSTWA TRANSGRANICZNE — SPECYFIKA
```
WŁAŚCIWOŚĆ (art. 5–6 KK):
  → KK stosuje się do czynów popełnionych na terytorium PL
  → Także do czynów za granicą skierowanych przeciwko obywatelowi PL (art. 109 KK)
  → Platforma za granicą + skutek w PL → właściwość polskich organów

WSPÓŁPRACA MIĘDZYNARODOWA:
  → Europejski Nakaz Aresztowania (ENA): kraje UE
  → MLAT: umowy dwustronne z krajami spoza UE (USA: umowa PL-USA)
  → Interpol: gdy sprawca poza UE i poza MLAT

JURYSDYKCJA PLATFORM:
  → Meta, Google, X (Twitter): dane przechowywane w UE (GDPR) → łatwiejszy dostęp
  → Serwery poza UE: MLAT lub Emergency Disclosure Request (przy zagrożeniu życia)
```

## ODPOWIEDZIALNOŚĆ CYWILNA — DOBRA OSOBISTE
```
PODSTAWY (art. 23–24 KC + art. 448 KC):
  → Naruszenie dobrego imienia / wizerunku / prywatności
  → Roszczenia: usunięcie skutków / przeproszenie / zadośćuczynienie / odszkodowanie

PRAWO DO USUNIĘCIA TREŚCI:
  → Platforma polska / EU: RODO art. 17 (bycie zapomnianym) → `mod-P-rodo.md`
  → Google: wniosek o usunięcie z wyników wyszukiwania (prawo do bycia zapomnianym)
  → DSA (Digital Services Act): procedury Notice & Action

NARUSZENIE WIZERUNKU (art. 81 UPrAut + art. 23 KC):
  → Wizerunek chroniony bez zgody
  → Wyjątki: osoba publiczna w związku z pełnioną funkcją (wąsko interpretowane)
  → Intymny wizerunek (art. 191a KK): ścieżka karna + cywilna
```

## PREDYKCJA WYNIKU — SZABLON
```
Szanse: [0–100%]
IN PLUS: sprawca zidentyfikowany / IP ustalony, dowody cyfrowe zabezpieczone
         notarialnie, skutki finansowe udokumentowane, platforma polska / EU,
         nagranie audio własnych rozmów ze sprawcą (legalne)
IN MINUS: sprawca anonimowy / za granicą, brak zabezpieczonych dowodów,
          jednorazowe zdarzenie bez skutków materialnych, przedawnienie

BENCHMARKING:
  → Wywołaj orzeczenia-sadowe-v2 z frazą:
    "art. 267 KK hacking dostęp system SN" lub
    "zniesławienie internet art. 212 KK medium"
  ⚠️ NIEZWERYFIKOWANE — wyszukaj URL przed powołaniem: sn.pl / orzeczenia.ms.gov.pl

REKOMENDACJA: □ Zawiadomienie karne  □ Pozew cywilny  □ Zgłoszenie platforma
              □ Wniosek o zabezpieczenie danych  □ Oba tryby równolegle
```

## ŁĄCZ Z
| Sytuacja | Skill |
|---|---|
| Zawiadomienie karne (hacking, phishing, DDoS) | `pisma-procesowe-v3` |
| Pozew cywilny (dobra osobiste, wizerunek) | `pisma-procesowe-v3` + `mod-E-cywilne.md` |
| Naruszenie danych osobowych (wyciek) | `mod-P-rodo.md` + `prawo-rodo.md` |
| Naruszenie wizerunku + prawo autorskie | `mod-O-wlasnosc-intelektualna.md` |
| Stalking online | `mod-J-stalking.md` + `stalking-nekanie.md` |
| Analiza dowodów cyfrowych | `analizator-dowodow-v3` |
| Tryby ścigania — pełna tabela | `tryby-scigania.md` |
| Kwalifikacja karno-materialna | `kwalifikator-karnomaterialny.md` |
| Orzecznictwo SN / SA | `orzeczenia-sadowe-v2` |

*KK: Dz.U. 2025 poz. 383 t.j. | Rozdział XXXIII — Przestępstwa przeciwko ochronie informacji*
*Prawo telekomunikacyjne: Dz.U. 2024.1221 t.j. — weryfikuj w isap.sejm.gov.pl*
*DSA (Rozp. UE 2022/2065): stosowany od 17.02.2024 dla wszystkich platform*
*e-Evidence (Rozp. UE 2023/1543): wdrożenie transgraniczne — weryfikuj stan w EUR-LEX*
*Weryfikacja: 22.05.2026 — zakaz cytowania przepisów z pamięci*
