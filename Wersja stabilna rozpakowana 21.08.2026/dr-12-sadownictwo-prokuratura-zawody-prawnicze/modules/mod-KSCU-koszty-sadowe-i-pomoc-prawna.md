# mod-BV-koszty-oplaty-i-pomoc-prawna — KOSZTY, OPŁATY, ZWOLNIENIA I POMOC PRAWNA

Status: moduł prawa polskiego klasy wzorcowej, uzupełniony do standardu prawa pracy i prawa karnego.
Data wdrożenia: 2026-05-28.
Zakres: koszty sądowe, opłaty zawodowe, wynagrodzenie pełnomocników i biegłych, prawo pomocy.

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
- odwołanie/zażalenie/sprzeciw; [⚠️ adresat zależy od KONKRETNEGO postanowienia — patrz `shared/ZAZALENIE-ADRESAT-GATE.md`, nie zakładaj automatycznie sądu wyższej instancji (np. odmowa zwolnienia od kosztów = zażalenie poziome)]
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
Ustawa o kosztach sądowych w sprawach cywilnych (KSCU):
  ⚡ Nowy t.j.: Dz.U. 2025 poz. 1228 (obwieszczenie z 01.09.2025)
  ✅ VER: isap.sejm.gov.pl 2026-06-05
  Oryginał DR-12 miał Dz.U. 2024 poz. 1303 — NIEAKTUALNY
  → https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20251228

⚠️ STAWKI I KWOTY — ZAWSZE WERYFIKUJ PRZED PODANIEM:
  web_search: "KSCU opłaty sądowe stawki 2025 2026 isap koszty sądowe cywilne"

Kluczowe stawki (⚠️ POPRAWKA 2026-07-27, FAZA 3E/ZASADA 14 — poprzednia
wersja miała nieaktualny limit i oversimplified strukturę; naprawiono
na podstawie dosłownego cytatu art. 13 KSCU z arslege.pl [t.j.
Dz.U.2025.1228]):
  Opłata od pozwu — DWA REŻIMY zależnie od WPS (od reformy z 25.07.2025,
  w życie 23.09.2025 — GÓRNY LIMIT OBNIŻONY z 200 000 na 100 000 zł):
    - WPS do 20 000 zł → OPŁATA STAŁA wg tabeli progowej (art. 13 ust. 1):
      do 500 zł → 30 zł | 500-1500 zł → 100 zł | 1500-4000 zł → 200 zł |
      4000-7500 zł → 400 zł | 7500-10000 zł → 500 zł | 10000-15000 zł →
      750 zł | 15000-20000 zł → 1000 zł
    - WPS powyżej 20 000 zł → opłata STOSUNKOWA 5% tej wartości, NIE
      WIĘCEJ niż 100 000 zł (⚠️ BYŁO błędnie "200 000 zł" — ten limit
      OBNIŻONO nowelizacją z 25.07.2025)
    - postępowanie GRUPOWE: połowa opłaty ustalonej wg powyższych zasad
      (wcześniej: 2% z odrębnym limitem — sprawdź czy ta zmiana też
      weszła w życie z tą samą nowelizacją, NIEZWERYFIKOWANE w tej sesji)
  Opłata od apelacji: tyle samo co od pozwu
  Opłata od skargi kasacyjnej: dwukrotność opłaty od apelacji
  Opłata stała od odwołania od decyzji UOKiK/URE/UKE/UTK: 1 000 zł
  Wniosek o zwolnienie od kosztów: bezpłatny

Prawo pomocy (sąd adm.) i zwolnienie od kosztów (sąd cyw.):
  → Wniosek o prawo pomocy: do WSA, bez opłaty
  → Zwolnienie: osoba fizyczna — wykazanie niemożności poniesienia kosztów
    bez uszczerbku dla koniecznego utrzymania
  → Formularz: urzędowy (weryfikuj aktualny wzór na stronie MS)

Wynagrodzenie pełnomocnika z urzędu:
  Wg rozporządzeń MS — weryfikuj aktualne stawki osobno dla:
  → Spraw cywilnych (Rozp. MS z 22.10.2015 — weryfikuj zmiany w ISAP)
  → Spraw karnych (Rozp. MS z 03.10.2016 — weryfikuj zmiany w ISAP)
  → Spraw administracyjnych
  web_search: "wynagrodzenie pełnomocnik z urzędu 2025 2026 stawki rozporządzenie MS"
```
