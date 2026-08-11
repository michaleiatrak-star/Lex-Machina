# JPK_CIT, księgi elektroniczne i e-sprawozdania finansowe
v1.0.0 (dodany 2026-08-11 — audyt pokrycia tematów rachunkowo-księgowych)

Zweryfikowano 2026-08-11 (ZASADA 14):
- **Rząd 1:** podatki.gov.pl/podatki-firmowe/cit/podstawa-prawna
  (oficjalny wykaz aktów wykonawczych MF), gov.pl/web/kas/struktury-
  e-sprawozdan, gov.pl/web/finanse/ustawa-csrd
- **Rząd 2A:** prawo.pl, lex.pl, inforlex.pl, pit.pl, gofin.pl
- **Rząd 2B:** Deloitte (×2 alerty podatkowe), PwC, ASB Group,
  vademecumksiegowego.pl, poradnikksiegowego.pl, pibr.org.pl
- **Rząd 3 (potwierdzenie zbieżności):** axelo.pl, comarch.pl,
  insert.com.pl, ksiegoboty.pl, audit-tax.pl

⚠️ ZNALEZISKO AUDYTOWE: JPK_KR / JPK_CIT występował w systemie WYŁĄCZNIE
jako jedna pozycja w tabeli ryzyk w `mod-KAS-kontrola-celno-skarbowa.md`
(„Brak JPK / niezgodność"). Obowiązek raportowy o skali porównywalnej z
KSeF, z trzema turami wdrożenia i dwiema zmianami terminów w 2026 r., nie
miał żadnego opracowania. E-sprawozdania finansowe (XML/JPK_SF) —
podobnie: jedna wzmianka bez treści.

---

## 1. ⭐⭐⭐ DWIE RODZINY STRUKTUR — NIE MYLIĆ

```
RODZINA PIT (podmioty na PKPiR lub księgach rachunkowych, opodatkowane
PIT) → szczegóły: mod-PKPiR-ewidencje-uproszczone.md
  → JPK_PKPIR — podatkowa księga przychodów i rozchodów
  → JPK_ST — ewidencja środków trwałych i WNiP
  → TERMIN: art. 45 ust. 1 ustawy o PIT (co do zasady 30 kwietnia roku
    następującego po roku podatkowym)

RODZINA CIT / PEŁNE KSIĘGI (tzw. „JPK_CIT" — parasol na dwie struktury):
  → **JPK_KR_PD** — pełne księgi rachunkowe rozszerzone o dane podatkowe
    (dziennik, obroty, salda, znaczniki kont, NIP kontrahentów, numery
    faktur KSeF, różnice wynik bilansowy vs podatkowy)
  → **JPK_ST_KR** — ewidencja środków trwałych oraz WNiP
  ⭐⭐ OBIE STRUKTURY SĄ ODRĘBNE: przygotowanie do JPK_KR_PD NIE
    zastępuje przygotowania do JPK_ST_KR — inne dane źródłowe, osobna
    walidacja

⭐ PODSTAWA OBOWIĄZKU: art. 9 ust. 1c i 1e ustawy o CIT
⭐ RÓWNOLEGŁY OBOWIĄZEK MATERIALNY: od 1.01.2025 księgi rachunkowe
  prowadzi się WYŁĄCZNIE w formie elektronicznej
⭐ PODATKOWE GRUPY KAPITAŁOWE: mimo wspólnego zeznania CIT, KAŻDA spółka
  tworząca PGK przekazuje JPK_KR_PD i JPK_ST_KR ODDZIELNIE, we własnym
  imieniu (art. 9 ust. 1g ustawy o CIT)
  ⚠️ [jednostka redakcyjna 1g — potwierdzona w Rzędzie 3 (audit-tax.pl);
  zweryfikuj w ISAP przed powołaniem w piśmie]
```

## 2. ⭐⭐ HARMONOGRAM WDROŻENIA — TRZY TURY

```
TURA 1 — rok podatkowy/obrotowy rozpoczynający się PO 31.12.2024:
  → podatkowe grupy kapitałowe (PGK)
  → podatnicy i spółki niebędące osobami prawnymi, u których przychody
    w poprzednim roku przekroczyły **50 mln EUR**
  → pierwsze pliki: za 2025 r., składane w 2026 r.

TURA 2 — rok rozpoczynający się PO 31.12.2025 (obowiązek przesyłania od
  1.01.2026):
  → podatnicy CIT i spółki niebędące osobami prawnymi zobowiązani do
    przesyłania JPK_VAT (czynni podatnicy VAT)
  → oraz podatnicy PIT prowadzący KSIĘGI RACHUNKOWE zobowiązani do
    JPK_V7M
  → pierwsze pliki: za 2026 r., składane w 2027 r.

TURA 3 — rok rozpoczynający się PO 31.12.2026:
  → pozostali podatnicy CIT i spółki niebędące osobami prawnymi
    (w tym mali podatnicy rozliczający VAT kwartalnie i podatnicy CIT
    zwolnieni z VAT)
```

## 3. ⭐⭐⭐ TERMIN PRZESŁANIA — ZMIENIONY DWUKROTNIE W 2026 r.

```
⛔ STAN ARCHIWALNY (NIE CYTOWAĆ JAKO OBOWIĄZUJĄCEGO): termin do dnia
  upływu terminu złożenia zeznania CIT-8, tj. co do zasady do końca
  3. MIESIĄCA po zakończeniu roku podatkowego

⭐ ETAP 1 — ROZPORZĄDZENIE (rozwiązanie tymczasowe): rozporządzenie
  Ministra Finansów i Gospodarki z **16 lutego 2026 r.** w sprawie
  przedłużenia terminów przesyłania ksiąg rachunkowych w zakresie
  podatku dochodowego od osób prawnych — **Dz.U. 2026 poz. 188**
  → ogłoszone 19.02.2026, w życie 20.02.2026
  → wydłuża termin do końca **7. MIESIĄCA** po zakończeniu roku
    podatkowego/obrotowego
  → zakres: lata rozpoczynające się po 31.12.2024, a KOŃCZĄCE SIĘ przed
    1.04.2026
  → dotyczy WYŁĄCZNIE struktury JPK_KR_PD
  → dodatkowo przedłuża do 31.07.2026 termin z art. 66 ust. 3 ustawy
    zmieniającej z 29.10.2021 r.

⭐⭐ ETAP 2 — USTAWA (rozwiązanie trwałe): ustawa z **15 maja 2026 r.**
  o zmianie ustawy o podatku dochodowym (…) — **Dz.U. 2026 poz. 779**
  → potwierdzona w oficjalnym wykazie MF: podatki.gov.pl/podatki-
    firmowe/cit/podstawa-prawna (Rząd 1), data publikacji 15.06.2026
  → w życie od **1 lipca 2026 r.**
  → TRWALE zapisuje 7-miesięczny termin dla art. 9 ust. 1c i 1e CIT
  → uzasadnienie MF: termin zatwierdzenia rocznego sprawozdania
    finansowego to do 6 miesięcy od dnia bilansowego (u.o.r.), a
    ostateczne zamknięcie ksiąg — do 15 dni od zatwierdzenia; termin
    3-miesięczny wyprzedzał zatem moment, w którym księgi są ostateczne

⭐⭐⭐ SKUTEK PRAKTYCZNY DLA TURY 1 (rok = kalendarzowy): pierwszy
  JPK_KR_PD za 2025 r. — do **31 lipca 2026 r.** (zamiast 31.03.2026)

⛔⛔ ROZDZIELENIE OBOWIĄZKÓW — NAJCZĘSTSZY BŁĄD: przedłużenie dotyczy
  WYŁĄCZNIE terminu PRZESŁANIA KSIĄG. **Termin złożenia zeznania CIT-8
  NIE ULEGA ZMIANIE.** To dwa odrębne obowiązki z odrębnymi terminami i
  odrębnymi sankcjami
```

## 4. ZAKRES DANYCH — UPROSZCZENIA PRZEJŚCIOWE

```
⭐ ROZPORZĄDZENIE BAZOWE (dane dodatkowe, CIT): rozporządzenie MF z
  16 sierpnia 2024 r. w sprawie dodatkowych danych, o które należy
  uzupełnić prowadzone księgi rachunkowe — t.j. Dz.U. 2024 poz. 1314
  (wg oficjalnego wykazu MF, Rząd 1)
⭐ ODPOWIEDNIK DLA PIT: rozporządzenie MFiG z 6 września 2025 r.
  (Dz.U. 2025 poz. 1311) — dane dodatkowe dla ksiąg i ewidencji ŚT/WNiP
  przekazywanych na podstawie ustawy o PIT, od 1.01.2026
⭐ ZWOLNIENIE Z CZĘŚCI KSIĄG: rozporządzenie MF z 13 grudnia 2024 r. —
  t.j. Dz.U. 2024 poz. 1861 (wg wykazu MF); na jego mocy obowiązek
  JPK_ST_KR ODROCZONO O ROK
⭐ ZWOLNIENIE DLA MSSF/MSR: rozporządzenie MFiG z 15 grudnia 2025 r.
  (Dz.U. 2025 poz. 1828) — przedłuża zwolnienie podmiotów stosujących
  MSSF/MSR z obowiązku oznaczania kont znacznikami do 1.01.2028

⭐ ZA ROK 2025 (tura 1) — ZAKRES OKROJONY: wymagane wyłącznie znaczniki
  identyfikujące konta (ZOiS). Pełne dane dodatkowe — m.in. NIP
  kontrahenta na poziomie zapisu dziennika i numery KSeF — obowiązkowe
  dopiero od roku 2026
  ⚠️ [§ 5 ust. 1 rozporządzenia z 16.08.2024 jako podstawa uproszczenia
  — potwierdzone w Rzędzie 3 (ksiegoboty.pl) i pośrednio w Rzędzie 2B;
  zweryfikuj jednostkę redakcyjną w ISAP przed powołaniem]
```

## 5. SANKCJA ZA NIEZŁOŻENIE

```
⭐ Niezłożenie JPK_CIT w terminie traktowane jak nieprzedłożenie
  informacji podatkowej — **art. 80 KKS**, kara grzywny do 240 stawek
  dziennych
  ⚠️ [POTWIERDZONE W RZĘDZIE 3 (inwentaryzujemy.pl) — pojedyncze źródło.
  ZWERYFIKUJ art. 80 KKS w ISAP oraz w dr-03/mod-KKS-karny-skarbowy-i-
  AML.md przed powołaniem w piśmie. Nie przenoś tej kwalifikacji
  automatycznie na JPK_V7 ani na JPK_PKPIR — inne struktury mogą
  podlegać innym przepisom]
```

## 6. ⭐⭐ E-SPRAWOZDANIA FINANSOWE (XML / JPK_SF)

```
PODSTAWA: art. 45 ust. 1f-1h ustawy o rachunkowości, obowiązuje od
  1 października 2018 r. (wprowadzone ustawą z 26 stycznia 2018 r. o
  zmianie ustawy o KRS oraz niektórych innych ustaw — Dz.U. 2018
  poz. 398 ze zm.)

⭐ ART. 45 UST. 1f — FORMA I PODPIS (dotyczy KAŻDEJ jednostki
  prowadzącej księgi rachunkowe): sprawozdanie finansowe sporządza się
  w POSTACI ELEKTRONICZNEJ i opatruje kwalifikowanym podpisem
  elektronicznym, podpisem zaufanym albo podpisem osobistym

⭐⭐ ART. 45 UST. 1g — STRUKTURA LOGICZNA (węższy krąg): jednostki
  wpisane do rejestru przedsiębiorców KRS sporządzają sprawozdanie w
  STRUKTURZE LOGICZNEJ i formacie udostępnianym w BIP na stronie
  urzędu obsługującego ministra właściwego ds. finansów publicznych
  (w praktyce: XML zgodny ze schemą XSD)
  → obowiązek formy ustrukturyzowanej obejmuje także: podatników PIT
    prowadzących księgi rachunkowe obowiązanych do sporządzenia
    sprawozdania oraz — co do zasady — podatników CIT przekazujących
    sprawozdanie Szefowi KAS (art. 27 ust. 2 ustawy o CIT)

⭐ ART. 45 UST. 1h — JEDNOSTKI STOSUJĄCE MSR: struktura logiczna
  obowiązuje, JEŻELI zostanie udostępniona w BIP. ⭐⭐ MF OFICJALNIE
  INFORMUJE, że struktury dla sprawozdań MSR **NIE BĘDĄ publikowane**
  (gov.pl/web/kas/struktury-e-sprawozdan — Rząd 1)
  → SKUTEK: jednostki MSR sporządzają sprawozdanie w postaci
    elektronicznej w formacie wybranym samodzielnie lub
    nieustrukturyzowanym. To NIE jest luka ani uchybienie — to
    świadomy stan wynikający z warunkowego brzmienia ust. 1h

⭐ ART. 49 UST. 7 — SPRAWOZDANIE Z DZIAŁALNOŚCI: jednostki wpisane do
  rejestru przedsiębiorców KRS sporządzają je w postaci elektronicznej
  i opatrują kwalifikowanym podpisem elektronicznym lub podpisem
  zaufanym (⚠️ katalog podpisów w ust. 7 może różnić się od art. 45
  ust. 1f — zweryfikuj w ISAP, jeśli chodzi o podpis osobisty)

⭐ ADRESACI ZŁOŻENIA — DWA RÓWNOLEGŁE KANAŁY:
  → KRS (Repozytorium Dokumentów Finansowych) — jednostki wpisane do
    rejestru przedsiębiorców
  → Szef KAS — m.in. podatnicy CIT niewpisani do rejestru
    przedsiębiorców KRS oraz podatnicy PIT prowadzący księgi
  ⚠️ [DOKŁADNY PODZIAŁ ADRESATÓW zależy od formy prawnej i przepisów
  podatkowych — ustal indywidualnie, nie stosuj domyślnie]

⭐ DOKUMENTY TOWARZYSZĄCE składane do KRS (uchwała zatwierdzająca,
  uchwała o podziale zysku, sprawozdanie z badania) nie mają narzuconej
  struktury XML; dla większości wymagana jest postać elektroniczna, przy
  czym uchwałę/postanowienie o zatwierdzeniu można dołączyć jako skan
  (biznes.gov.pl — Rząd 1)
```

---

## CROSS-REFERENCJE
- Sprawozdanie finansowe: struktura, terminy, badanie, konsolidacja →
  `mod-ustawa-rachunkowosci.md`
- PKPiR, JPK_PKPIR, JPK_ST → `mod-PKPiR-ewidencje-uproszczone.md`
- KSeF, JPK_V7 → `mod-VAT-podatek-od-towarow-i-uslug.md`
- Kontrola na podstawie plików JPK → `mod-KAS-kontrola-celno-skarbowa.md`
- CIT-8, art. 9 i 27 ustawy o CIT → `mod-CIT-podatek-dochodowy-prawne.md`
- Sankcje KKS → `dr-03-prawo-karne-wykroczenia-egzekucja/modules/
  mod-KKS-karny-skarbowy-i-AML.md`
