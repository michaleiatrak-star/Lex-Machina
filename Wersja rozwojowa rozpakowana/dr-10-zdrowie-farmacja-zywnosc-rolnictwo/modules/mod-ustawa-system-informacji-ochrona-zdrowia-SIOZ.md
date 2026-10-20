# Ustawa o systemie informacji w ochronie zdrowia (SIOZ) v1.0.0 (dodany 2026-10-20)

> ⛔ Moduł opisuje **wyłącznie** ustawę z 28.04.2011 r. o systemie informacji w ochronie zdrowia
> (SIM, IKP, EDM, rejestry medyczne, dostęp do danych). **Nie** opisuje: prawa do dokumentacji
> medycznej i jej okresów przechowywania (ustawa o prawach pacjenta — `mod-ustawa-prawa-pacjenta-framework.md`),
> treści recept (Prawo farmaceutyczne), zaświadczeń lekarskich e-ZLA (ustawa zasiłkowa) ani RODO jako takiego.
> ⛔ Nazwa „Centrum e-Zdrowia" **nie występuje** w tekście ustawy — ustawa używa formuły
> „jednostka podległa ministrowi właściwemu do spraw zdrowia, właściwa w zakresie systemów
> informacyjnych ochrony zdrowia" (dalej: **jednostka MZ**). Utożsamienie z CeZ wynika z aktu
> organizacyjnego MZ, nie z tej ustawy — sprawdź przy sprawie.

## ⛔ ŹRÓDŁO I STATUS WERYFIKACJI

| Akt | Dz.U. | Status w ELI |
|---|---|---|
| **Ustawa** z 28.04.2011 r. o systemie informacji w ochronie zdrowia | Dz.U. 2011 nr 113 poz. 657 | obowiązujący; w mocy od 1.01.2012 (art. 58) |
| **Tekst jednolity** (obwieszczenie Marszałka Sejmu z 17.09.2026, stan prawny na 16.09.2026) | **Dz.U. 2026 poz. 1304** | ogłoszony 7.10.2026 |
| Poprzedni t.j. | Dz.U. 2026 poz. 208 | zastąpiony |

✅ [VER: ELI DU/2026/1304 text.pdf, RZĄD 1, 2026-10-20]

✅ [VER: ELI DU/2011/657 `references` — „Akty zmieniające", RZĄD 1, 2026-10-20] — **brak** aktów zmieniających ogłoszonych po t.j. 1304; jedyna zmiana oczekująca: **Dz.U. 2025 poz. 1705** (ustawa z 7.11.2025, w mocy **1.01.2027**) — już ujęta w t.j. jako odnośniki 10, 14, 16, 66 (art. 3 ust. 3 pkt 11, art. 5 ust. 1 pkt 2 lit. c, art. 5 ust. 3a, art. 24 → EPS).

T.j. 1304 uwzględnia nowele: Dz.U. 2026 poz. 252 (KSC, w mocy 3.04.2026), poz. 791 (e-zdrowie, w mocy 1.07.2026), poz. 1007 (KSO, w mocy 11.08.2026).

⚠️ **Granice tej weryfikacji — czytaj przed użyciem w sprawie:**
- Odczytany jest **cały tekst ustawy** (art. 1–58; art. 41–52 „pominięte" w t.j.). Rozporządzenia wykonawcze (art. 11 ust. 4a, art. 13a, art. 20, art. 24 ust. 8/13, art. 39 ust. 13) — **nie** czytane.
- **Ustawa nie zawiera przepisów karnych ani kar pieniężnych.** Sankcje za naruszenia wynikają z innych aktów (RODO art. 83, ustawa o ochronie danych osobowych, KK, umowy z NFZ, ustawa o prawach pacjenta) — poza tym modułem.
- Terminy „e-recepta", „e-skierowanie", „e-zlecenie" **nie występują** w ustawie; ustawa posługuje się pojęciami „recepta", „skierowanie", „zlecenie na zaopatrzenie" jako rodzajami EDM (art. 2 pkt 6 lit. b).
- Art. 53 ust. 4 odsyła do art. 19 ust. 9, który jest **uchylony** — odesłanie martwe (przepis przejściowy z 2011 r.).
- Przepisy przejściowe noweli 791 (art. 10–14: uruchomienie DOM, e-Konsylium, HDeZ, PUI w ≤ 5 mies. od wejścia w życie) — stan faktycznego uruchomienia **nie** weryfikowany; sprawdź komunikaty MZ/BIP.
- Orzecznictwo (NSA/WSA, UODO) — nie weryfikowane; `orzeczenia-sadowe-v2`.

---

## 1. ZAKRES I POJĘCIA (art. 1–2)

- Cel: dane do polityki zdrowotnej, jakości i dostępności świadczeń, finansowania (art. 1 ust. 1).
- **Wyłączenia:** podmioty lecznicze dla osób pozbawionych wolności (art. 102 pkt 1 i 115 § 1 KKW) i podmioty w formie jednostki wojskowej (art. 1 ust. 3–4).

| Pojęcie | Treść | Przepis |
|---|---|---|
| **usługodawca** | świadczeniodawca (art. 5 pkt 41 ustawy o świadczeniach) **oraz apteka** | art. 2 pkt 15 |
| **usługobiorca** | osoba korzystająca lub uprawniona do świadczeń | art. 2 pkt 16 |
| **EDM** | (a) karta pacjenta (art. 30b UPP); (b) podpisane QES / podpisem zaufanym / osobistym / narzędziem ZUS: recepty, dokumenty z rozp. art. 13a, skierowania (art. 59aa ust. 2 u.ś.), zlecenia na zaopatrzenie i naprawy (art. 38 ust. 4a ustawy refundacyjnej), Karty Szczepień, wyniki histopatologii, karty DiLO, plany leczenia onkologicznego, Karty Opieki Kardiologicznej, orzeczenia lekarskie z art. 229 § 8 KP; (c) opis konsultacji medycznej | art. 2 pkt 6 |
| **jednostkowe dane medyczne** | dane o świadczeniach udzielonych/udzielanych/planowanych i o stanie zdrowia | art. 2 pkt 7 |
| **rejestr medyczny** | uporządkowany zbiór danych do zadań publicznych w ochronie zdrowia | art. 2 pkt 12 |
| **IKP** | moduł platformy P1 (art. 7 ust. 1) z danymi z SIM i Systemu RUM–NFZ | art. 2 pkt 19 |

## 2. ARCHITEKTURA SYSTEMU (art. 3–7, 10)

```
SYSTEM INFORMACJI (art. 3, 5)
├─ SIM — System Informacji Medycznej (art. 10)        adm. danych: minister zdrowia (art. 10 ust. 8)
│   moduły: KSO (11a), KSK (11b), Domowa Opieka Medyczna (11c),
│           e-Konsylium (11d), Hurtownia Danych e-Zdrowia (11e)
├─ Platforma Usług Inteligentnych — AI w diagnostyce obrazowej (art. 31d)
├─ dziedzinowe systemy (art. 5 ust. 1 pkt 2, art. 22–31c): RUM–NFZ, Statystyka, SEZOZ/EPS,
│   Monitorowanie Zagrożeń, Dostępności, Kosztów, ZSMOPL, SMK, SOLR, IOWISZ, RAM, SOID
└─ rejestry medyczne (art. 15–20)
OBSŁUGA: P2 — Platforma Udostępniania On-Line… Rejestrów Medycznych (art. 6)
         P1 — Elektroniczna Platforma Gromadzenia, Analizy i Udostępnienia… (art. 7) ← IKP, wymiana EDM
Administrator systemów: jednostka MZ (art. 6 ust. 2, 7 ust. 2, 10 ust. 7, 40 ust. 2)
```

- Zakres danych o usługobiorcy: art. 4 ust. 3 (m.in. PESEL, dokument tożsamości, adresy, telefon, e-mail, opiekunowie faktyczni i pełnomocnicy, sprzeciw z rejestru transplantacyjnego, przyczyna zgonu). **Wykształcenie — wyłącznie cele statystyczne** (art. 4 ust. 4).
- Dane z SIM, PUI, RUM–NFZ i in. **nie** podlegają udostępnieniu w trybie dostępu do informacji publicznej ani ustawy o otwartych danych (art. 5 ust. 3a; od 1.01.2027 także EPS).
- Pseudonimizacja: klucz odwrócenia ze szczególnymi środkami bezpieczeństwa; dane powiązywalne w czasie → separacja + art. 32 RODO (art. 5a).
- Informacje wprowadzone przez pacjenta i dane z wyrobów/aplikacji dobrostanu są **odrębnie oznaczane** od dokumentacji medycznej (art. 10 ust. 6c).

## 3. EDM — OBOWIĄZKI USŁUGODAWCY (art. 11, 13a, 13b, 56)

| Obowiązek | Przepis |
|---|---|
| Prowadzić EDM | art. 11 ust. 1 |
| EDM z art. 2 pkt 6 lit. b i c — w formatach z BIP MZ | art. 11 ust. 1a |
| Wymiana EDM wg standardów z BIP MZ | art. 11 ust. 1b |
| Przekazywać do SIM **dane zdarzenia medycznego** (od 1.07.2021) | art. 11 ust. 3–4a, art. 56 ust. 2a |
| **W czasie rzeczywistym:** recepty i skierowania oraz realizacja recepty / zmiana statusu skierowania | art. 11 ust. 5 pkt 1 |
| Wynik histopatologii — niezwłocznie po sporządzeniu | art. 11 ust. 5 pkt 2 |
| **Awaria P1:** zamieścić dane niezwłocznie, ≤ **3 dni** od usunięcia awarii (bez dni wolnych usługodawcy); MZ może wydłużyć obwieszczeniem przy awarii > 1 dnia | art. 11 ust. 5a–5c |
| Zgodność systemów z minimalnymi wymaganiami z BIP — **9 mies.** od zamieszczenia | art. 8b ust. 1 |
| Bezpieczna komunikacja systemów (usługodawcy i dostawcy IT) — **9 mies.**; zmiany ≥ 1 mies. | art. 8d |
| Podłączenie do P1 po akceptacji deklaracji gotowości | art. 7 ust. 3a–3c |
| Certyfikaty do uwierzytelniania danych i systemu | art. 16 ust. 5–5a |

- **Forma pisemna:** EDM spełnia wymóg formy pisemnej lub równoważnej, także zastrzeżonej pod rygorem nieważności (art. 11 ust. 7).
- Udostępnianie EDM **poza SIM** → wg ustawy o prawach pacjenta (art. 11 ust. 8).
- Rodzaje EDM — rozporządzenie z art. 13a. Papier dopuszczalny był do 31.12.2018; recepty papierowe do 7.01.2020 (art. 56 ust. 1–2 — przepisy historyczne; wyjątki w Prawie farmaceutycznym — poza modułem).
- **Recepta, skierowanie, zlecenie** — ustawa reguluje tylko: kwalifikację jako EDM (art. 2 pkt 6 lit. b), obowiązek zamieszczenia w SIM (art. 11 ust. 5), udostępnianie danych NFZ i AOTMiT (art. 11 ust. 9), recepta transgraniczna przez KPK (art. 7 ust. 1 pkt 10, ust. 2a–2b), narzędzie do odpłatności (art. 9b), zamówienie recepty kontynuacyjnej przez IKP (art. 7a ust. 1 pkt 19). Wymogi treści recepty → Prawo farmaceutyczne.

**Podpis EDM:** pracownik medyczny lub osoba upoważniona — QES, podpis zaufany, osobisty albo narzędzie ZUS (art. 31b ust. 14); do narzędzia ZUS nie trzeba upoważnienia ZUS do e-ZLA (art. 31b ust. 15).

### Digitalizacja dokumentacji papierowej (art. 13b)
```
1. Odwzorowanie cyfrowe + QES / podpis zaufany / osobisty / pieczęć zaawansowana (ust. 2)
   — także narzędziem udostępnianym przez jednostkę MZ (ust. 2a–2c); może trafić do SIM (ust. 4a)
2. Dokument zdigitalizowany = równoważny oryginałowi (ust. 3)
3. Informacja dla pacjenta + termin odbioru papieru ≥ 1 ROK (ust. 4)
4. Odbiór: pacjent, przedstawiciel, upoważniony, po śmierci osoba bliska (ust. 5)
5. Nieodebrane → zniszczenie uniemożliwiające identyfikację (ust. 6)
Odpowiednio: deklaracje POZ i dokumenty rozliczeniowe NFZ (ust. 7)
```

## 4. IKP — INTERNETOWE KONTO PACJENTA (art. 7a–7b, 34)

Funkcje (art. 7a ust. 1, wybór): dostęp do świadczeń i kwot NFZ (pkt 1), prawa do świadczeń z CWU (pkt 2), **upoważnienia do dokumentacji** (art. 26 ust. 1 UPP) i zgody z art. 35 ust. 1a (pkt 3), zgoda na informację (art. 9 ust. 3 UPP) (pkt 4), zgoda/odmowa na świadczenia z art. 16–18 UPP (pkt 5), e-ZLA (pkt 6), składka (pkt 7), refundacja (pkt 8), zgoda transgraniczna (pkt 9), deklaracja POZ (pkt 10), EKUZ (pkt 12), wycofane leki (pkt 13), skargi do RPP/MZ/NFZ (pkt 14), zlecenia na wyroby (pkt 17), centralna e-rejestracja (pkt 18), zamówienie recepty (pkt 19), dane z wyrobów/aplikacji (pkt 20–21), orzeczenia lekarskie z art. 229 § 8 KP (pkt 23).

- Oświadczenia z pkt 5 (zgoda na świadczenia) — uwierzytelnienie **dwuskładnikowe** (art. 7a ust. 2).
- Dostęp: pacjent, przedstawiciel ustawowy, osoba upoważniona; logowanie wg art. 20a ust. 1 pkt 1 ustawy o informatyzacji; także mObywatel (art. 7b ust. 1–1a).
- Dzieci: dane rodzinne z NFZ i rejestru centralnego z ustawy o pomocy państwa w wychowywaniu dzieci (art. 7b ust. 2–3); potwierdzenie tożsamości przez jednostkę MZ (ust. 4); drugi rodzic — oświadczenie pod rygorem odpowiedzialności karnej (ust. 4a–4b).
- **Blokada dostępu przedstawiciela:** z urzędu przy wątpliwości lub na wniosek z interesem prawnym/faktycznym (art. 7b ust. 5).
- Raport z udostępnienia danych SIM — przez IKP (art. 34 ust. 1).

## 5. DOSTĘP DO DANYCH I UPOWAŻNIENIA (art. 12, 35, 31b)

**Kto ma dostęp do danych pacjenta w systemie usługodawcy lub SIM bez zgody (art. 35 ust. 1):**
1. pracownik, który wytworzył EDM lub zlecił jej wytworzenie (pkt 1);
2. pracownik u usługodawcy, u którego powstała EDM / na którego zlecenie udzielono świadczenia — jeśli niezbędne do diagnostyki, ciągłości leczenia lub rozliczeń (pkt 2);
3. pracownik u usługodawcy onkologicznego/kardiologicznego — monitorowanie i ciągłość (pkt 2a);
4. lekarz, pielęgniarka, położna POZ (pkt 3); uczestnicy e-Konsylium (pkt 3a);
5. **każdy pracownik medyczny w sytuacji zagrożenia życia** (pkt 4);
6. osoby wykonujące czynności pomocnicze — na podstawie upoważnienia usługodawcy (koordynacja świadczeń POZ, onkologia/kardiologia, świadczenia z centralnej e-rejestracji) — tylko rejestracja i rozliczenia (pkt 5).

- **Poza tym — za zgodą** pacjenta/przedstawiciela, z zakresem czasowym i przedmiotowym (art. 35 ust. 1a); zgoda składana m.in. przez IKP (art. 7a ust. 1 pkt 3).
- Brak zgody **nieskuteczny wobec NFZ** przy zadaniach z art. 11 ust. 1 u.ś. i art. 12 ust. 1 pkt 1–4, 6, 8 (art. 35 ust. 4).
- Art. 35 nie narusza zasad dostępu do dokumentacji z UPP (art. 35 ust. 5).
- Dostęp w SIM zależy od uprawnień użytkownika (art. 12 ust. 2); katalog uprawnionych: pacjent (ust. 3), NFZ (ust. 4), wojewoda — dane zbiorcze (ust. 5), personel (ust. 6), rejestry (ust. 7), komisje lekarskie wojskowe (ust. 7a), JST (ust. 8); pobieranie **nieodpłatne** (ust. 9).

**Blokada dostępu usługodawcy/pracownika do P1 (art. 7 ust. 3d–3k):**
```
Podejrzenie nadużycia lub zagrożenia bezpieczeństwa → weryfikacja → ograniczenie/blokada (3d–3e)
→ niezwłoczna informacja + termin na wyjaśnienia (3f) → przywrócenie niezwłocznie po usunięciu (3g)
Dokumentacja czynności: 3 LATA od ostatniej czynności (3h–3i)
Blokada > 3 dni → wniosek elektroniczny do MZ o weryfikację; rozpatrzenie ≤ 3 dni (3j); MZ może nakazać przywrócenie (3k)
```
⚠️ Ustawa nie określa formy rozstrzygnięcia MZ (decyzja/czynność) ani drogi sądowej — kwalifikacja do ustalenia (`dr-05`).

**RAM — Rejestr Asystentów Medycznych (art. 31b):** upoważnienia do wystawiania EDM/e-ZLA przez osoby upoważnione (art. 41a ustawy o zawodach lekarza, art. 54a ustawy zasiłkowej). Upoważnienie podpisuje pracownik medyczny (ust. 5); konto zakłada osoba uprawniona do wniosku o wpis do RPWDL (ust. 3). Obowiązuje: EDM — od dnia następnego po udzieleniu lub od daty wskazanej, co później (ust. 11); e-ZLA — od pozytywnej weryfikacji ZUS lub daty wskazanej, co później (ust. 10).

## 6. REJESTRY MEDYCZNE (art. 15–20)

| Rejestr centralny | Przepis | Adm. danych |
|---|---|---|
| Centralny Wykaz Usługobiorców (CWU) | art. 15 | MZ (ust. 6) |
| Centralny Wykaz Usługodawców | art. 16 | MZ (ust. 7) |
| Centralny Wykaz Pracowników Medycznych | art. 17 | MZ (ust. 4) |
| Centralny Wykaz Produktów Leczniczych | art. 17a | MZ prowadzi (ust. 4) |

- Izby zawodowe przekazują dane do CWPM w **1 dzień roboczy** od uchwały o wpisie (art. 17 ust. 2c).
- Płatnicy i ZUS itd. przekazują dane o niepełnosprawności/uprawnieniach dodatkowych ≤ **3 dni** (art. 15 ust. 5a).
- Identyfikatory: PESEL pacjenta, kod resortowy usługodawcy, NPWZ pracownika (art. 17c); brak PESEL → obowiązek wniosku o PESEL (art. 17c ust. 6).

**Rejestry dziedzinowe (art. 19–20):** tworzy MZ **rozporządzeniem** (art. 20 ust. 1) w celach z art. 19 ust. 1, w 23 obszarach z art. 19 ust. 1a; wniosek może złożyć podmiot leczniczy, NFZ, jednostka MZ, towarzystwo naukowe (ust. 1b). Wykaz rejestrów — BIP MZ (art. 20 ust. 3). Adm. danych = podmiot prowadzący rejestr (art. 20 ust. 4).
- Obowiązek **nieodpłatnego** zasilania rejestrów przez usługodawców, NFZ, adm. SIM itd. (art. 19 ust. 8).
- Publikacja danych zanonimizowanych do końca I kwartału (ust. 7a); raport analityczny do **30 listopada** roku następnego (ust. 7b–7c).
- Udostępnianie NFZ / jednostce MZ / AOTMiT — w **30 dni** od wniosku (ust. 11–14); NIZP-PZH (ust. 13a).
- Nauka i statystyka — tylko bez możliwości powiązania z osobą (art. 19 ust. 7).
- SZBI wg art. 8 ustawy o KSC (art. 19 ust. 16, w brzmieniu noweli 252).

## 7. OKRESY PRZECHOWYWANIA (wprost w ustawie)

| Dane | Okres | Przepis |
|---|---|---|
| Wynik histopatologii w SIM | wg UPP | art. 11 ust. 5 pkt 2 |
| Domowa Opieka Medyczna | **5 lat** od końca roku wprowadzenia | art. 11c ust. 6 |
| e-Konsylium — karta i opis konsultacji | **20 lat** od końca roku sporządzenia opisu | art. 11d ust. 5 pkt 1 |
| e-Konsylium — nagranie | **9 miesięcy** od zakończenia konsultacji | art. 11d ust. 5 pkt 2 |
| e-Konsylium — inne dane medyczne | **3 miesiące** od zakończenia | art. 11d ust. 5 pkt 3 |
| Hurtownia Danych e-Zdrowia | ≥ okres z art. 29 UPP; identyfikatory także po śmierci | art. 11e ust. 6–7 |
| PUI — dane obrazowe i wyniki AI | do pobrania, max **6 miesięcy**; potem nieodwracalna anonimizacja | art. 31d ust. 7–8 |
| Dokumentacja blokady dostępu P1 | **3 lata** | art. 7 ust. 3i |
| Dane z systemu rejestracji COVID-19 | ≥ okres z art. 29 UPP | art. 15 noweli 791 (poza t.j.) |

Ogólne okresy przechowywania dokumentacji medycznej → art. 29 UPP (`mod-ustawa-prawa-pacjenta-framework.md`).

## 8. OCHRONA DANYCH I POWIERZENIE (art. 9a, 20, 37, 40)

- Wszystkie podmioty prowadzące bazy — warunki organizacyjno-techniczne ochrony (art. 37); rejestry — art. 19 ust. 15.
- **Procesor** (art. 28 ust. 3 RODO) w SIM, PUI, systemach dziedzinowych, rejestrach: zabezpieczenia; kontrola przez administratora; zwrot danych przy zaprzestaniu; **tajemnica także po śmierci pacjenta** (art. 9a ust. 2–6; dla rejestrów art. 20 ust. 5–10).
- Personel jednostki MZ — tajemnica jednostkowych danych medycznych (art. 40 ust. 6); stosuje się art. 24 ust. 5–6 UPP (art. 40 ust. 5).
- Służby specjalne — szczególne wymagania bezpieczeństwa (art. 8a, 8c); podmiot leczniczy ABW/AW może nie zamieszczać danych funkcjonariusza w SIM (art. 11 ust. 6).

## 9. NADZÓR I KONTROLA — ZAMIAST KAR (art. 38–40)

```
MZ: nadzór nad systemem (art. 40 ust. 1); kontrola baz danych — legalność, celowość, rzetelność (art. 38)
Kontrolerzy: upoważnienie imienne (art. 39 ust. 4); wstęp, wgląd, wyjaśnienia (ust. 5);
             dane medyczne — tylko osoba wykonująca właściwy zawód medyczny (ust. 6)
Protokół → zastrzeżenia w 14 DNI → MZ rozstrzyga w 14 dni, stanowisko ostateczne (ust. 10–11)
→ zalecenia pokontrolne z terminem (ust. 12)
Jednostka MZ: sprawozdanie roczne do 31 marca (art. 40 ust. 4)
```
⛔ **Brak sankcji karnych/administracyjnych w ustawie.** Środki ustawowe to tylko: blokada dostępu do P1 (art. 7 ust. 3d), zalecenia pokontrolne (art. 38–39). Odpowiedzialność szukaj w: RODO/UODO, KK (tajemnica), umowie z NFZ, UPP.

## 10. NOWE MODUŁY 2026 (nowela Dz.U. 2026 poz. 791, w mocy 1.07.2026)

| Moduł | Istota | Przepis |
|---|---|---|
| Domowa Opieka Medyczna | dane z wyrobów medycznych i aplikacji dobrostanu; podmioty z ust. 3 pkt 4 — **tylko na żądanie i za zgodą pacjenta** | art. 11c |
| e-Konsylium | telekonsultacje usługodawca–usługodawca (świadczenia publiczne); możliwe nagranie | art. 11d |
| Hurtownia Danych e-Zdrowia | dane pseudonimizowane do analiz | art. 11e |
| Platforma Usług Inteligentnych | narzędzia AI dla szpitali; pseudonimizacja; limit usługodawców w BIP; pierwszeństwo szpitali z systemu podstawowego szpitalnego zabezpieczenia (art. 95l u.ś.) | art. 31d |

## 11. ROUTING / POWIĄZANIA

| Zagadnienie | Moduł |
|---|---|
| Prawa pacjenta, dostęp do dokumentacji, okresy przechowywania (art. 29 UPP) | `dr-10/modules/mod-ustawa-prawa-pacjenta-framework.md` |
| Rzecznik Praw Pacjenta (skargi, także przez IKP) | `dr-10/modules/mod-rzecznik-praw-pacjenta-RPP.md` |
| Działalność lecznicza, RPWDL | `dr-10/modules/mod-ustawa-dzialalnosc-lecznicza-pacjent.md` |
| Recepty, apteki, refundacja | `dr-10/modules/mod-PrFarm-prawo-farmaceutyczne.md`, `dr-10/modules/mod-PrFarm-refundacja-nadzor-sankcje.md` |
| NFZ, świadczenia, e-rejestracja | `dr-10/modules/mod-ustawa-NFZ-swiadczenia.md` |
| Wyroby medyczne | `dr-10/modules/mod-wyroby-medyczne.md` |
| Zawód lekarza (art. 41a — asystent; art. 42 — recepta kontynuacyjna) | `dr-10/modules/mod-ustawa-zawod-lekarza.md` |
| RODO — podstawy, procesor, DPIA, prawa osób | `dr-11/modules/mod-RODO-GDPR-2016-679.md`, `mod-RODO-RCP-DPA-rejestr-powierzenie.md`, `mod-RODO-DPIA-ocena-skutkow.md`, `mod-RODO-DSAR-zadania-osob.md` |
| UODO — skarga, kary | `dr-11/modules/mod-UODO-postepowanie-ochrona-danych.md` |
| KSC (SZBI rejestrów, art. 19 ust. 16) | `dr-11/modules/mod-KSC-NIS2-cyberbezpieczenstwo-telekom.md` |
| AI Act (Platforma Usług Inteligentnych) | `dr-11/modules/mod-AI-Act-framework.md` |
| Otwarte dane (wyłączenie art. 5 ust. 3a) | `dr-11/modules/mod-ustawa-otwarte-dane.md` |
| e-ZLA (art. 7a ust. 1 pkt 6, art. 31b ust. 9–10) | `dr-04/modules/mod-ustawa-zasilkowa-choroba-macierzynstwo.md` |

⛔ EHDS (rozp. 2025/327) — ustawa przywołuje tylko definicję „aplikacji wspierającej dobrostan" (art. 2 pkt 2b); stosowanie EHDS — poza modułem, fresh gate.
