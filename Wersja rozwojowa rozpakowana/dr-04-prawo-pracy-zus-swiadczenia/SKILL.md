---
name: dr-04-prawo-pracy-zus-swiadczenia
version: 3.4
description: |
  DR-04: Prawo Pracy, ZUS, Świadczenia Społeczne
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | orzeczenia.ms.gov.pl | sn.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
---

# DR-04 — Prawo Pracy, ZUS, Świadczenia Społeczne

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu, artykułu, terminu lub sygnatury:**
1. Zweryfikuj brzmienie i Dz.U. w `isap.sejm.gov.pl`
2. Zweryfikuj orzeczenie w `orzeczenia.ms.gov.pl` / `nsa.gov.pl` / `sn.pl`
3. **NIGDY** nie podawaj artykułu, terminu, kary ani sygnatury wyłącznie z pamięci modelu.

---

## Zasada architektoniczna
- Jeden moduł = jeden akt prawny (tekst jednolity Dz.U.)
- Wyjątek: wydzielone rozdziały jednej ustawy mogą mieć osobny moduł (z adnotacją)
- Ten sam akt NIE może pokrywać dwóch różnych DR-skills
- **Zakaz cytowania przepisów z pamięci modelu podczas sesji — każde brzmienie weryfikuj w ISAP**
- Źródło podstawowe: ISAP; LEX/Legalis dopuszczalne wyłącznie pomocniczo

## DEFINICJE — shared/definicje/ (bezpośrednie, lazy loading per temat)

- `definicje/DEF-PRACA.md` — pracownik/pracodawca (A.4), mobbing (definicja
  ustawowa + linia SN + alert nowelizacji 2026), dyskryminacja, forma umowy,
  nieobecności, urlopy, wypadek przy pracy, zasiłki ZUS, niealimentacja
  — PLIK GŁÓWNY dla tej dziedziny (313 linii, scalony z BAS-W20)

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-001/002/003/014/075 Praca nierejestrowana / nielegalne zatrudnienie /
  odpowiednia praca / bezrobotny
  ✅ ZAKTUALIZOWANO: ustawa o promocji zatrudnienia UCHYLONA 01.06.2025,
  definicje przeniesione bez zmiany substancji do art. 2 pkt 1/14/16 ustawy
  o rynku pracy i służbach zatrudnienia (Dz.U. 2025 poz. 620). NOWOŚĆ:
  rolnicy >2 ha przeliczeniowe bez stałych dochodów mogą się rejestrować
  jako bezrobotni; nowa kategoria "osoby bierne zawodowo" (emeryci,
  studenci, urlop wychowawczy — objęci wsparciem PUP, nie są bezrobotnymi)
- BAS-120 Powierzenie cudzoziemcowi nielegalnej pracy (ustawa 2012, sankcje)
- BAS-W01 Uzasadnione potrzeby pracodawcy (art. 42 §4 KP — zmiana rodzaju pracy)
- BAS-W02 Szczególne potrzeby pracodawcy / nadgodziny (art. 151 §1 KP)
- BAS-W03 Praca zdalna okazjonalna (24 dni, niezależnie od etatu — MRiPS 2023)
- BAS-W04 Ochrona szczególna pracownika — kategorie (osobiste/zawodowe)
- BAS-W05 Urlop wypoczynkowy — definicja funkcjonalna (MRiPS 2023)
- BAS-W15 Choroba zawodowa — 2 przesłanki (art. 235¹ KP + wykaz RM)
- BAS-W16 Godziny ponadwymiarowe nauczycieli (Karta Nauczyciela art. 35)
- BAS-W20 Mobbing — granice (art. 94³ KP — 5 przesłanek, "ofiara rozsądna")
- BAS-W36 ⚠️⚠️ TERMIN 02.08.2026: AI Act — system AI wysokiego ryzyka (Annex III
  pkt 4) — rekrutacja, ocena kandydatów, decyzje o awansie/zwolnieniu,
  monitorowanie wydajności pracowników przez AI. Obowiązki: FRIA, nadzór
  ludzki, zgodność z prawem pracy. Pracownik: prawo do informacji o logice
  AI + interwencji ludzkiej (art. 22 RODO)
- BAS-W28 Nadużycie prawa w stosunkach pracy (art. 8 KP)
- BAS-004/102/124/131-134 Niepełnosprawność — świadczenia, PFRON, świadczenie
  wspierające (→ mod-niepelnosprawnosc-intelektualna-gluchota.md,
  mod-niewidomy-prawa-prawne.md, mod-prawa-obywatelskie-srodki-karne.md)

## Moduły (26 łącznie — ✓ 26 OK, ☐ 0 STUB; 1 przeniesiony do DR-05)

```
  [✓] OK    mod-KP-prawo-pracy
              (PRZYCIĘTY 2026-06-12: 524→337 linii. RDZEŃ — rozwiązanie umowy
               o pracę, wypowiedzenie, dyscyplinarka, roszczenia art.45 KP.
               3 byłe aneksy wydzielone niżej — lazy loading.)
  [✓] NOWY  mod-KP-mobbing-dyskryminacja
  [✓] NOWY  mod-KP-naduzycia-pracodawcy-limity-kary-degradacja
  [✓] NOWY  mod-KP-konflikt-interesow-rodzina-nepotyzm
              (dodany 2026-07-18: sektor prywatny — pełna legalność
               zatrudniania rodziny, brak ograniczeń ustawowych; sektor
               publiczny — obowiązek z ustawy o finansach publicznych +
               zakaz podległości bezpośredniej krewnych; nepotyzm/
               kumoterstwo, instrumenty przeciwdziałania. Odpowiedź na
               pytanie o konflikt interesów rodzina/pracownik)
              (dodany 2026-07-17: obejście limitu 3 umów/33 miesięcy przez
               rotację między podmiotami powiązanymi — doktryna "przebicia
               zasłony korporacyjnej"/nadużycia osobowości prawnej, art. 8
               KP; elementy konieczne kar porządkowych i konsekwencje ich
               braku (art. 108-113); degradacja karna [niedopuszczalna,
               poza zamkniętym katalogiem] vs faktyczna w trybie
               wypowiedzenia zmieniającego [legalna, art. 42]; odesłania
               do sygnalistów [DR-15] i BHP [luka odnotowana])
              (wydzielony z ANEKS A: kwalifikacja mobbing/dyskryminacja/
               molestowanie, tabela roszczeń, strategia dowodowa; definicja
               i linia SN → shared/definicje/DEF-PRACA.md; projekt UD183/
               RM 17.02.2026 SCALONY z dwóch wcześniej rozbieżnych wpisów)
  [✓] NOWY  mod-wypadek-przy-pracy-choroba-zawodowa
              (2026-07-21: dodano obowiązek zawiadomienia PIP i
               PROKURATORA o wypadku ciężkim/śmiertelnym/zbiorowym
               [art. 234 §2 KP] — odrębny od zwykłego zgłoszenia
               pracodawcy, z sankcją wykroczeniową za niedopełnienie.
               Odpowiedź na pytanie użytkownika o zgłoszenia do PIP)
              (wydzielony z ANEKS B: intake wypadkowy, świadczenia ZUS,
               terminy, ścieżka sporna; definicja 4-elementowa →
               shared/definicje/DEF-PRACA.md H.1.4)
  [✓] NOWY  mod-KP-praca-zdalna
              (wydzielony z ANEKS C: obowiązki BHP, praca zdalna okazjonalna;
               wykładnia MRiPS → BAS-W03)
  [✓] OK    mod-KP-dzial-VI-czas-pracy
              (dodany 2026-07-17: Dział VI KP — normy czasu pracy, okresy
               odpoczynku, NADGODZINY (limit 150h/rok, granica 48h/tydzień,
               dodatki 50%/100%, czas wolny), nowelizacja 2026 forma
               elektroniczna wniosków. Najwyższy priorytet z audytu KP)
  [✓] OK    mod-KP-dzial-VII-urlopy-pracownicze
              (dodany 2026-07-17: Dział VII KP — wymiar urlopu (20/26 dni),
               zasady udzielania/odwołania, ekwiwalent art. 171 (w tym
               nowe §4-5 z 2026), urlop na żądanie, siła wyższa. Drugi
               priorytet z audytu KP)
  [✓] OK    mod-KP-dzial-V-XIV-odpowiedzialnosc-materialna-przedawnienie
              (dodany 2026-07-17: Dział V KP — odpowiedzialność materialna
               (zwykła vs mienie powierzone, KLUCZOWE odwrócenie ciężaru
               dowodu przy mieniu powierzonym) + Dział XIV — przedawnienie
               roszczeń (3 lata, wyjątek dla roszczeń pracodawcy art. 291
               §2). Domyka priorytety wysokie z audytu KP)
  [✓] OK    mod-KP-dzial-III-wynagrodzenie-swiadczenia-jawnosc
              (dodany 2026-07-17: Dział III KP — art. 92 wynagrodzenie
               chorobowe (świadczenie WYPŁACANE PRZEZ PRACODAWCĘ, 33/14
               dni, 80%/100%) + ZUPEŁNIE NOWY temat: jawność wynagrodzeń,
               dyrektywa UE 2023/970, Etap 1 już obowiązuje od 24.12.2025.
               Odpowiedź na pytanie użytkownika o świadczenia pracodawcy)
  [✓] PRZENIESIONY 2026-07-19 → DR-05
              mod-KPA-postepowanie-administracyjne
              (moduł kanoniczny KPA/PPSA przeniesiony do DR-05, gdzie
               logicznie przynależy — sprawdź tam, rozbudowany o
               sekcję 4a: ugoda, milczące załatwienie, zaświadczenia,
               skargi/wnioski Działu VIII)
  [✓] OK    mod-SUS-ZUS-ubezpieczenia-spoleczne
              (2026-07-21: dodano ANEKS D — interpretacja indywidualna
               ZUS [art. 34 Prawa przedsiębiorców, właściwość WYŁĄCZNIE
               oddziały Gdańsk/Lublin, milcząca zgoda po 30 dniach,
               znaczenie strategiczne przy ryzyku przekwalifikowania
               umowy], z odesłaniem do nowego wzoru SPJ w
               pisma-proste-v2. Odpowiedź na pytanie użytkownika)
              (zawiera Aneks A: renta — 3 przesłanki z tabelą stażu;
               Aneks B: kalkulator terminów ZUS; Aneks C: predykcja wyniku)
  [✓] OK    mod-KRUS-rolnicze-ubezpieczenia
  [✓] OK    mod-ustawa-zwolnienia-grupowe
  [✓] OK    mod-ustawa-zwiazki-zawodowe-spory-zbiorowe
  [✓] OK    mod-ustawa-PIP-inspekcja-pracy
  [✓] OK    mod-ustawa-minimalne-wynagrodzenie
  [✓] OK    mod-ustawa-ZFSS
  [✓] OK    mod-ustawa-praca-tymczasowa
  [✓] OK    mod-ustawa-rynek-pracy-zatrudnienie
  [✓] OK    mod-ustawa-swiadczenia-rodzinne
  [✓] OK    mod-dodatek-pielegnacyjny-swiadczenie-rehabilitacyjne-wyrownawcze
              (dodany 2026-07-20: dodatek pielęgnacyjny ZUS [75+ lat
               automatycznie, zakaz łączenia z zasiłkiem
               pielęgnacyjnym], zasiłek pielęgnacyjny pełne opracowanie,
               świadczenie rehabilitacyjne ZUS, świadczenie wyrównawcze
               [2 niezwiązane warianty]. UCZCIWA korekta: "dodatek
               rehabilitacyjny" NIE ISTNIEJE pod tą nazwą — wskazano
               4 prawdopodobne świadczenia. Odpowiedź na pytanie
               użytkownika)
              (2026-07-20: PEŁNE opracowanie świadczenia pielęgnacyjnego
               [reforma 2024 — opiekun może PRACOWAĆ BEZ LIMITU
               jednocześnie pobierając świadczenie, wcześniej zakaz
               całkowity], ustawa "za życiem" [4000 zł, termin 12 mies.],
               opieka wytchnieniowa [limity 240h/14 dób, PUŁAPKA: utrata
               świadczenia pielęgnacyjnego przy całodobowym pobycie >5
               dni/tydzień]. Odpowiedź na pytanie użytkownika)
  [✓] OK    mod-ustawa-aktywny-rodzic
  [✓] OK    mod-ustawa-rehabilitacja-PFRON
              (2026-07-20: dodano ANEKS — LIKWIDACJA WYPOŻYCZALNI PFRON
               [historia fiaska programu — 73% sprzętu niewykorzystane,
               dwie prokuratury; mechanizm "reaktywacji likwidacyjnej"
               od 10.06.2026 — kaucja 2%, przekazanie na własność po
               uchwaleniu druku sejmowego 2701, przedłużenie umów do
               2028]. Temat BARDZO ŚWIEŻY, w toku. Odpowiedź na
               pytanie użytkownika)
              (zawiera Aneks: świadczenie uzupełniające 500+ dla niepełnosprawnych)
  [✓] OK    mod-ustawa-pomoc-spoleczna
  [✓] OK    mod-ustawa-ochrona-konkurencji-konsumentow-UOKiK
  [✓] OK    mod-ustawa-swiadczenie-wspierajace-WZON
```

## Jak wywołać

```
view /mnt/skills/user/dr-04-prawo-pracy-zus-swiadczenia/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-04-prawo-pracy-zus-swiadczenia/MAPA-AKTOW.md
```

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Weryfikacja prawa: isap.sejm.gov.pl
- Orzecznictwo: orzeczenia.ms.gov.pl, sn.pl, nsa.gov.pl

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
