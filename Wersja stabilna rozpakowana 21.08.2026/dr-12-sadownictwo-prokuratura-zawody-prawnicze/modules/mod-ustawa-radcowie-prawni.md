# mod-RP — Radcowie prawni (Ustawa o radcach prawnych)

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
---
WSPÓLNE ZASADY DLA MODUŁU:
- przed cytowaniem przepisu zastosuj `shared/ISAP-AUDIT-PROTOCOL.md`;
- metryki aktów sprawdzaj w `shared/ISAP-METRYKI-AKTOW.md`;
- jeżeli sprawa jest procesowa, uruchom `shared/FORMAL-CHECK.md`, `shared/WARUNKI-SKUTECZNOSCI.md`, `shared/TERM-CALC.md`, `shared/RISK-ASSESSMENT.md`;
- zakaz cytowania stawek OC i wynagrodzeń z pamięci.
---

**Zakres:** wpis na listę radców prawnych, aplikacja radcowska, tajemnica zawodowa,
OC, odpowiedzialność dyscyplinarna, zatrudnienie na umowie o pracę, pełna zdolność
postulacyjna (od 2015 — także w sprawach karnych z wyj. obligatoryjnej obrony),
zakaz reklamy, praca zdalna radcy.

## KLUCZOWE AKTY PRAWNE — ZWERYFIKOWANE

```
Ustawa o radcach prawnych:
  Dz.U. 2024 poz. 499 t.j.
  ✅ VER: isap.sejm.gov.pl 2026-06-05
  Nowelizacja 2025 (uchwalona): rewizja OC, praca zdalna, tajemnica, współpraca
  z adwokaturą — weryfikuj aktualne zm. w ISAP
  → https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20240000499

Powiązane akty (weryfikuj Dz.U. w ISAP przed użyciem):
  Postępowanie dyscyplinarne radców prawnych — Ustawa o radcach prawnych,
    art. 42 (organy samorządu) i art. 64 i nast. (odpowiedzialność
    dyscyplinarna):
    → I instancja: OKRĘGOWY SĄD DYSCYPLINARNY właściwej okręgowej izby
      radców prawnych
    → II i OSTATNIA instancja (odwoławcza): WYŻSZY SĄD DYSCYPLINARNY (organ
      samorządu wymieniony w art. 42 ust. 1, obok Krajowego Zjazdu, Krajowej
      Rady, Wyższej Komisji Rewizyjnej, Głównego Rzecznika Dyscyplinarnego,
      zgromadzeń i rad okręgowych izb, okręgowych komisji rewizyjnych i
      rzeczników dyscyplinarnych)
    → Ostrzeżenie dziekańskie (art. 66) — w wypadkach mniejszej wagi dziekan
      rady okręgowej izby może poprzestać na ostrzeżeniu; odwołanie do
      okręgowego sądu dyscyplinarnego (druga i ostatnia instancja dla tej
      formy)
    ✅ VER: 2026-07-02 (weryfikacja online na żądanie użytkownika, w ramach
    TRYB DZU krok 11/16 — zadanie specjalne, dodanie podstaw dyscyplinarnych)
  Kodeks Etyki Radcy Prawnego — uchwalony przez Nadzwyczajny Krajowy Zjazd
    Radców Prawnych, obowiązuje od 1 lipca 2015 r.; tekst jednolity ogłoszony
    Uchwałą nr 884/XI/2023 Prezydium Krajowej Rady Radców Prawnych z dnia
    7 lutego 2023 r. (NIE Dz.U. — akt korporacyjny KRRP, źródło: kirp.pl)
    Stosuje się odpowiednio do aplikantów radcowskich oraz — w zakresie
    wskazanym w przepisach odrębnych — do prawników zagranicznych świadczących
    w RP pomoc prawną odpowiadającą czynnościom radcy prawnego.
    Radca prawny działający transgranicznie obowiązany jest dodatkowo
    przestrzegać Kodeksu Etyki CCBE (Rady Adwokatur i Stowarzyszeń
    Prawniczych Europy), uznanego za wiążący Uchwałą nr 8/2010 IX Krajowego
    Zjazdu Radców Prawnych z 6.11.2010 r.
    ✅ VER: 2026-07-02 (dodano w ramach TRYB DZU krok 11/16 na żądanie
    użytkownika — dodanie KEA/KERP i odpowiedników)
  Rozp. MS w spr. wynagrodzenia radcy prawnego z urzędu — weryfikuj aktualne w ISAP
  KPC — zdolność postulacyjna radcy
  KPK art. 82 — obrona karna przez radcę (z ograniczeniami)
```

## ZASADY ABSOLUTNE

1. Tajemnica zawodowa radcy (art. 3 u.r.p.): obowiązkowa, zakaz zwolnienia
   bez wyraźnego upoważnienia ustawowego.
2. Możliwość łączenia z umową o pracę — kluczowa różnica vs adwokat.
3. Pełna zdolność postulacyjna we wszystkich sprawach od 2015 r.
4. Zakaz bezpośredniej reklamy; dozwolona informacja o kancelarii.
5. OC: obowiązkowe — stawki i suma gwarancyjna: weryfikuj w aktualnym rozp. MS.
6. Odpowiedzialność dyscyplinarna: Sąd Dyscyplinarny OIRP → Wyższy Sąd Dyscyplinarny KRRP → SN.

## WALIDACJA INTAKE

```text
□ radca prawny czy inny zawód? (decyduje o ustawie)
□ czy radca jednocześnie zatrudniony na umowie o pracę?
□ etap: wpis / aplikacja / zawieszenie / wykreślenie / sprawa dyscyplinarna?
□ data zdarzenia i termin zaskarżenia
□ czy naruszono tajemnicę zawodową?
□ jakiego środka szuka strona?
```

## 1. Intake szczególny

Przed odpowiedzią ustal co najmniej:
- rola: radca / klient / poszkodowany / organ dyscyplinarny;
- etap: wpis, aplikacja, zawieszenie, wykreślenie, sprawa dyscyplinarna, odszkodowanie;
- akt lub czynność kwestionowana;
- termin na środek (weryfikuj w ISAP i statucie KRRP);
- naruszenie tajemnicy, konflikt interesów, zakaz reklamy;

## 2. Mapa proceduralna

```text
Zdarzenie / czynność / decyzja organu samorządowego
  ↓
Kwalifikacja: wpis / aplikacja / odpowiedzialność dyscyplinarna / cywilna / karna
  ↓
Właściwy organ: OIRP / KRRP / Sąd Dyscyplinarny / WSD / SN / sąd powszechny
  ↓
Środek zaskarżenia: odwołanie / zażalenie / skarga dyscyplinarna / pozew
  ↓
Walidacja formalna: shared/FORMAL-CHECK.md + shared/WARUNKI-SKUTECZNOSCI.md
  ↓
Ocena ryzyka: shared/RISK-ASSESSMENT.md + shared/QUALITY-CHECK.md
  ↓
Strategia: ostrożny / ofensywny / eskalacyjny
```

## 3. Warunki skuteczności

```text
□ prawidłowy tryb i organ
□ termin na środek — weryfikuj w ustawie i statucie
□ legitymacja: klient, poszkodowany, rzecznik dyscyplinarny
□ żądanie możliwe prawnie
□ fakty powiązane z normą etyczną i ustawową
□ dowody przypisane do każdej tezy
□ kontrola ISAP na dzień sporządzenia pisma
□ kontrola stanu prawnego na dzień zdarzenia oraz orzekania
```

## 4. Matryca dowodowa

Dowody typowe dla tego modułu:
- uchwała rady izby / postanowienie KRRP / decyzja o wpisie;
- umowa zlecenia / umowa o pracę / pełnomocnictwo;
- korespondencja klient–radca;
- protokoły posiedzeń sądu (naruszenie tajemnicy, konflikt);
- polisy OC;
- faktury / rachunki (wynagrodzenie);
- orzeczenia organów dyscyplinarnych.

Każdy dowód oceniaj według schematu:

```text
Dowód → fakt, który ma wykazać → bezpośredni/pośredni → wiarygodność
      → ryzyko podważenia → brakujący dowód wzmacniający
```

## 5. Typowe zarzuty i kontrzarzuty

W każdej sprawie przygotuj dwie wersje:
1. argumentację strony skarżącej / klienta,
2. argumentację radcy / organu samorządowego.

Typowe ryzyka i kontrargumenty:
- tajemnica zawodowa jako bariera dowodowa;
- trudność wykazania szkody z naruszenia reprezentacji;
- uznaniowość orzekania dyscyplinarnego;
- przedawnienie dyscyplinarne (weryfikuj aktualne w ustawie + ISAP);
- specyfika łączenia zatrudnienia z praktyką a zakres konfliktu interesów;

## 6. Strategia procesowa

### Wariant ostrożny
Minimalizuje ryzyko formalne. Priorytet: termin, kompletność, zabezpieczenie dowodów.

### Wariant ofensywny
Eksponuje naruszenia etyczne, wadliwość reprezentacji, naruszenie tajemnicy lub zakazu konfliktu interesów.

### Wariant eskalacyjny
OIRP → KRRP / WSD → SN → sąd powszechny (odpowiedzialność cywilna za błąd).

## 7. Orzecznictwo

Nie twórz fikcyjnych sygnatur. Orzecznictwo pobieraj z:
- SN (sprawy dyscyplinarne, kasacje),
- orzeczenia.ms.gov.pl,
- LEX/Legalis pomocniczo.

Dla każdego orzeczenia wskaż:
- sąd; datę; sygnaturę; tezę użyteczną;
- relację do stanu faktycznego; aktualność linii orzeczniczej;
- czy to argument główny, pomocniczy, czy ryzykowny.

## 8. Quality gate

Przed końcową odpowiedzią sprawdź:

```text
□ Czy wskazano właściwy organ samorządowy i tryb?
□ Czy oddzielono odpowiedzialność dyscyplinarną od cywilnej i karnej?
□ Czy sprawdzono aktualność ustawy i Kodeksu Etyki w ISAP/KRRP?
□ Czy każda przesłanka ma dowód?
□ Czy wskazano termin i czy nie upłynął?
□ Czy podano ryzyki przeciwnika/organu?
□ Czy uwzględniono specyfikę nowelizacji 2025 (OC, praca zdalna)?
□ Czy użyto shared/MODULE-STANDARD-POLISH-LAW.md?
```

## 9. Łącz obowiązkowo z

| Potrzeba | Moduł współdzielony / skill |
|---|---|
| aktualność prawa | `shared/ISAP-AUDIT-PROTOCOL.md` + `shared/ISAP-METRYKI-AKTOW.md` |
| stan prawny w czasie | `shared/TEMPORAL-LAW-CHECK.md` |
| braki formalne | `shared/BRAKI-FORMALNE.md` |
| warunki skuteczności | `shared/WARUNKI-SKUTECZNOSCI.md` |
| dowody | `shared/DOWODY-METODOLOGIA.md` + `analizator-dowodow-v3` |
| ryzyka | `shared/RISK-ASSESSMENT.md` |
| pisma | `pisma-procesowe-v3` albo `pisma-proste-v2` |
| analiza sądowa | `analiza-sadowa-v6` |
| postępowanie dyscyplinarne | DR-12/`mod-ustawa-odpowiedzialnosc-dyscyplinarna-zawodow` |
| porównanie z adwokaturą | DR-12/`mod-ustawa-adwokatura` |

## Weryfikacja online

```
web_search: "ustawa radcach prawnych tekst jednolity Dz.U. 2024 poz. 499 isap"
web_search: "nowelizacja ustawa radcach prawnych 2025 OC praca zdalna tajemnica"
web_search: "wynagrodzenie radca prawny z urzędu rozporządzenie MS 2025"
```

---

## STATUS KANCELARSKI

**Status:** moduł klasy kancelaryjnej — poziom DR-03
**Data weryfikacji:** 2026-06-06
**Zasada:** Każde brzmienie przepisu przed powołaniem → isap.sejm.gov.pl
