# mod-BQ-prokuratura-sluzby-organy-ochrony-prawa — PROKURATURA I ORGANY OCHRONY PRAWA

Status: moduł prawa polskiego klasy wzorcowej, uzupełniony do standardu prawa pracy i prawa karnego.
Data wdrożenia: 2026-05-28.
Zakres: prokuratura, policja, służby, skargi, odpowiedzialność służbowa, kontrola czynności.

## Wspólne moduły obowiązkowe

Zawsze stosuj razem z:

- `shared/MODULE-STANDARD-POLISH-LAW.md`,
- `shared/ISAP-AUDIT-PROTOCOL.md`,
- `shared/TEMPORAL-LAW-CHECK.md`,
- `shared/LEGAL-LIFECYCLE-MANAGEMENT.md`,
- `shared/LEGAL-QUALITY-GATE.md`,
- `shared/RISK-ASSESSMENT.md`,
- `shared/QUALITY-CHECK.md`.

## 1. Zakaz pracy z pamięci

Dziennik Ustaw, status aktu, data wejścia w życie, brzmienie przepisu i przepisy przejściowe muszą być sprawdzone w ISAP na dzień użycia. Jeżeli ISAP nie daje bezpośredniego dostępu do tekstu aktu albo aktu wykonawczego, wolno użyć LEX/Legalis wyłącznie pomocniczo i oznaczyć źródło w raporcie. Nie wolno rekonstruować brzmienia przepisu z pamięci.

## 2. Intake obowiązkowy

Ustal:

1. typ sprawy i tryb;
2. organ/sąd/właściwy samorząd;
3. daty zdarzeń, decyzji, doręczeń i terminów;
4. stan prawny na dzień zdarzenia, decyzji i wniesienia środka;
5. interes prawny i legitymację;
6. rozstrzygnięcie zaskarżane lub czynność kwestionowaną;
7. dowody podstawowe i brakujące;
8. możliwe równoległe tryby: cywilny, karny, administracyjny, dyscyplinarny, pracowniczy.

## 3. Warstwa normatywna CORE

Dla każdego używanego przepisu wygeneruj tabelę:

| Akt | Dz.U./tekst jednolity | Przepis | Brzmienie z ISAP/LEX/Legalis | Znaczenie | Skutek procesowy |
|---|---|---|---|---|---|
| do uzupełnienia po kontroli źródła | do uzupełnienia | art. ... | cytuj tylko po weryfikacji | przesłanka/tryb/termin | zwrot/oddalenie/uchylenie/odpowiedzialność |

Nie wpisuj literalnego brzmienia, jeżeli nie zostało pobrane z aktualnego źródła urzędowego albo wskazanego systemu prawniczego.

## 4. Procedura

Wybierz właściwy tor:

- wniosek pierwotny;
- odwołanie/zażalenie/sprzeciw;
- skarga do WSA;
- środek do sądu powszechnego;
- skarga kasacyjna/kasacja;
- skarga dyscyplinarna;
- wniosek dowodowy;
- skarga administracyjna;
- skarga na przewlekłość;
- zawiadomienie karne albo deliktowe, jeżeli zachowanie przekracza zwykłe naruszenie proceduralne.

## 5. Dowody

Każda teza musi mieć przypisany dowód. Obowiązkowa tabela:

| Teza | Dowód | Źródło | Siła | Luka | Działanie |
|---|---|---|---|---|---|
| przesłanka ustawowa | dokument/zeznanie/opinia | akta/organ/sąd | wysoka/średnia/niska | co nieudowodnione | uzupełnić/wnioskować/atakować |

## 6. Biegli i opinie

Jeżeli sprawa zawiera element specjalistyczny, zastosuj `shared/EXPERT-OPINION-AUDIT.md`.

W szczególności sprawdź:

- zakres tezy dowodowej;
- kwalifikacje biegłego;
- kompletność dokumentacji;
- metodologię;
- odpowiedź na pytania sądu/organu;
- funkcjonalne skutki ustaleń;
- możliwość opinii uzupełniającej albo innego biegłego.

## 7. Strategia

Zawsze wygeneruj:

1. najkorzystniejszą konstrukcję roszczenia/wniosku/środka;
2. argument podstawowy;
3. argument ewentualny;
4. najsilniejszy kontrargument organu/przeciwnika;
5. odpowiedź na kontrargument;
6. ryzyka formalne;
7. ryzyka dowodowe;
8. ryzyka kosztowe;
9. rekomendowane następne pismo.

## 8. Orzecznictwo

Nie twórz fikcyjnych sygnatur. Orzecznictwo pobieraj z oficjalnych baz sądów, SN, NSA/CBOSA albo wiarygodnych systemów prawniczych. Dla każdego orzeczenia wskaż:

- sąd;
- datę;
- sygnaturę;
- tezę użyteczną;
- relację do stanu faktycznego;
- aktualność linii orzeczniczej;
- czy jest to argument główny, pomocniczy, czy ryzykowny.

## 9. Quality gate

Nie kończ analizy bez odpowiedzi:

- czy sprawdzono aktualność aktu;
- czy stan prawny jest właściwy temporalnie;
- czy wskazano pełną podstawę prawną;
- czy znane jest brzmienie przepisu z aktualnego źródła;
- czy każda przesłanka ma dowód;
- czy istnieje termin i czy nie upłynął;
- czy dobrano właściwy tryb;
- czy wnioski są procesowo wykonalne.

## 10. Output

Standard odpowiedzi/pisma:

1. stan faktyczny;
2. stan prawny i źródła;
3. przesłanki;
4. dowody;
5. zarzuty;
6. analiza ryzyk;
7. strategia;
8. wnioski;
9. załączniki;
10. kontrola ISAP/temporalności.

---

## KLUCZOWE AKTY PRAWNE — ZWERYFIKOWANE

```
Prawo o prokuraturze:
  Dz.U. 2024 poz. 390 t.j. ze zm.
  ✅ VER: isap.sejm.gov.pl 2026-06-05
  → https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20240000390

⚡ ALERT — PROKURATURA EUROPEJSKA:
  Ustawa z 24.01.2025 r. o zmianie niektórych ustaw w związku z przystąpieniem RP
  do wzmocnionej współpracy w zakresie Prokuratury Europejskiej (EPPO):
  → Dz.U. 2025 poz. 304
  ✅ VER: isap.sejm.gov.pl 2026-06-05

  Co zmienia przystąpienie do EPPO:
  → EPPO (European Public Prosecutor's Office) = organ UE ścigający przestępstwa
    na szkodę budżetu UE (VAT-karuzele, nadużycia funduszy UE)
  → EPPO może wszcząć postępowanie w Polsce bez zgody prokuratury krajowej
  → Prokuratorzy krajowi mogą być oddelegowani do EPPO
  → Sprawy EPPO: przestępstwa > 10 000 EUR szkody dla budżetu UE (Rozp. UE 2017/1939)
  → Strony mają prawa procesowe jak w polskim KPK (art. 86 i n. KPK — obrońca, dostęp do akt)

Zakres spraw prokuratorskich — kluczowe pytania INTAKE:
  □ Czy to sprawa krajowa (prokuratura powszechna / PK) czy unijska (EPPO)?
  □ Czy złożono zażalenie na odmowę wszczęcia / umorzenie?
  □ Termin na zażalenie: 7 dni od doręczenia postanowienia (art. 306 KPK — weryfikuj)
  □ Czy jest możliwe działanie posiłkowego pełnomocnika pokrzywdzonego?
  □ Czy sprawa dotyczy nadużycia środków UE → właściwy EPPO

Skargi na czynności prokuratora:
  → Zażalenie na odmowę wszczęcia śledztwa / umorzenie (art. 306 KPK)
  → Zażalenie na inne czynności (art. 302 KPK)
  → Skarga administracyjna do prokuratury przełożonej
  → Skarga do Rzecznika Praw Obywatelskich (RPO)
  ⚠️ Weryfikuj aktualne przepisy KPK w ISAP (Dz.U. 2025 poz. 1390 lub aktualny t.j.)
```
