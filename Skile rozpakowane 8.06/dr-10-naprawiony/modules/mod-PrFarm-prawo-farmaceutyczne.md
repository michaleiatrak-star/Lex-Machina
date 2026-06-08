# Moduł [AA] — Prawo Farmaceutyczne

**Standard jakości:** stosuj `shared/MODULE-STANDARD-POLISH-LAW.md` oraz `shared/POLISH-LAW-COMPLETENESS-MATRIX.md`.
**Zakres:** Dopuszczanie produktów leczniczych do obrotu (pozwolenie, import
docelowy), wytwarzanie i GMP, reklama produktów leczniczych, obrót
(apteki ogólnodostępne, hurtownie, punkty apteczne), Apteka dla
Aptekarza, refundacja leków, wyroby medyczne, Państwowa Inspekcja
Farmaceutyczna (GIF/WIF), sankcje karne i administracyjne.

---

## ZASADA ABSOLUTNA — WERYFIKACJA ONLINE

> ⚠️ Prawo farmaceutyczne jest jedną z najczęściej nowelizowanych ustaw.
> **KAŻDY artykuł, stawka i wymóg formalny musi być zweryfikowany online
> przed podaniem.** Nie cytuj z pamięci.

---

## KLUCZOWE AKTY PRAWNE

| Akt | Dziennik Ustaw | Weryfikacja |
|---|---|---|
| Prawo farmaceutyczne z 6.09.2001 | **Dz.U. 2026 poz. 612 t.j.** | isap.sejm.gov.pl |
| Nowelizacja PF z 24.06.2025 | Dz.U. 2025 poz. 924 | isap.sejm.gov.pl |
| Ustawa o refundacji leków z 12.05.2011 | Dz.U. 2025 poz. 907 t.j. | isap.sejm.gov.pl |
| Nowelizacja ustawy refundacyjnej z 25.07.2025 | Dz.U. 2025 poz. 1192 | isap.sejm.gov.pl |
| Ustawa o wyrobach medycznych z 7.04.2022 | Dz.U. 2022 poz. 974 | isap.sejm.gov.pl |
| Rozporządzenie MDR 2017/745 (UE) | Dz.Urz. UE | eur-lex.europa.eu |

---

## STRUKTURA USTAWY — MAPA ROZDZIAŁÓW

```
Rozdz. 1  Przepisy ogólne (art. 1–2a)        → definicje, zakres
Rozdz. 2  Dopuszczanie do obrotu (art. 3–36aa) → pozwolenie, UPL, import docelowy
Rozdz. 2¹ Nadzór nad bezpieczeństwem (art. 36b–37) → farmakovigilancja
Rozdz. 2b Przepisy ogólne o zezwoleniach (art. 37am–37au)
Rozdz. 2c Monitorowanie przewozu (art. 37av–37z) → braki dostępności
Rozdz. 3  Wytwarzanie i import (art. 38–51a) → GMP, zezwolenia wytwórcze
Rozdz. 3a Substancje czynne (art. 51b–51m)   → API, GMP substancji
Rozdz. 4  Reklama (art. 52–64)               → zakazy i wymogi
Rozdz. 5  Obrót (art. 65–73)                 → kanały dystrybucji
Rozdz. 5a Pośrednictwo w obrocie (art. 73a–73i)
Rozdz. 6  Hurtownie farmaceutyczne (art. 74–85a)
Rozdz. 7  Apteki (art. 86–107)               → Apteka dla Aptekarza
Rozdz. 8  Inspekcja farmaceutyczna (art. 108–123b)
Rozdz. 9  Przepisy karne i kary (art. 124–134) → sankcje
```

---

## TABELA DECYZYJNA — KIEROWANIE DO FRAMEWORKU

| Problem użytkownika | Sekcja frameworku |
|---|---|
| Pozwolenie na dopuszczenie do obrotu, import docelowy | CZĘŚĆ I |
| Wytwarzanie, GMP, zezwolenie wytwórcze | CZĘŚĆ II |
| Reklama leku — dozwolona? do kogo? co wolno? | CZĘŚĆ III |
| Apteka — zezwolenie, Apteka dla Aptekarza, cofnięcie | CZĘŚĆ IV |
| Hurtownia — zezwolenie GDP, obowiązki | CZĘŚĆ V |
| Refundacja — lista, dopłata pacjenta, skarga | CZĘŚĆ VI |
| GIF/WIF — kontrola, nakaz, decyzja | CZĘŚĆ VII |
| Sankcje karne i kary pieniężne | CZĘŚĆ VIII |

---

## SZCZEGÓŁOWY FRAMEWORK

```
view /mnt/skills/user/prawny-router-v3/references/prawo-farmaceutyczne.md
```

---

## ŁĄCZ Z

| Sytuacja | Skill / Moduł |
|---|---|
| Odwołanie od decyzji WIF/GIF | `mod-G-administracyjne.md` + `pisma-procesowe-v3` |
| Skarga do WSA na decyzję org. farmaceutycznych | `mod-G-administracyjne.md` |
| Błąd medyczny / prawa pacjenta | `mod-V-medyczne.md` |
| Naruszenie przepisów — odpowiedzialność karna | `mod-N-karne.md` |
| Umowa z hurtownią / dystrybucja | `analizator-umow-v1` |
| Pismo do GIF / WIF | `pisma-procesowe-v3` |
| Analiza szans odwołania | `analiza-sadowa-v6` |
| Orzecznictwo NSA w sprawach farmaceutycznych | `orzeczenia-sadowe-v2` |

---

## ⚠️ WAŻNE ZMIANY 2025–2026 — WERYFIKUJ PRZED SPRAWĄ

### Nowelizacje PF po t.j. Dz.U. 2026 poz. 612 (weryfikuj w ISAP)
| Nowelizacja | Zakres |
|---|---|
| Dz.U. 2025 poz. 924 | Zm. art. 36z ust. 2 pkt 4 — brak wymogu wskazania miejsca dostawy |
| Dz.U. 2025 poz. 1416 | Zmiany PF — weryfikuj pełny zakres w isap.sejm.gov.pl |
| Dz.U. 2025 poz. 1537 | Zmiany podstawowych warunków prowadzenia apteki (rozp. MZ) |

### Reklama aptek (art. 94a PF) — PRZEŁOMOWA ZMIANA
- **Wyrok TSUE z 19.06.2025, C-200/2024:** całkowity zakaz reklamy aptek narusza dyrektywę 2000/31/WE oraz swobodę przedsiębiorczości.
- **Projekt nowelizacji art. 94a PF** (stan: projekt rządowy, planowane przyjęcie przez RM — III kw. 2026) — zakaz ma być zastąpiony ograniczonym systemem reklamy neutralnej/obiektywnej.
- ⚠️ Do czasu wejścia w życie nowelizacji — **art. 94a PF (zakaz) nadal obowiązuje.** Weryfikuj status projektu: legislacja.rcl.gov.pl / gov.pl

### Planowana deregulacja PF (projekt UDER114)
- Zmiany dotyczące aptek, kar GIF, badań jakościowych, przedłużania pozwoleń na dopuszczenie, wymagań wobec Osób Wykwalifikowanych.
- Planowane przyjęcie przez RM: III kwartał 2026 r. — weryfikuj aktualny status w legislacja.rcl.gov.pl

*Weryfikacja: 22.05.2026 | Źródła: isap.sejm.gov.pl, alertmedyczny.pl, gov.pl (projekt UDER114), TSUE C-200/2024*

---

# STANDARDOWE UZUPEŁNIENIE MODUŁU — poziom prawa pracy / prawa karnego

> Ten blok jest częścią obowiązkową modułu. Ma pierwszeństwo przed opisowym użyciem modułu. Nie zastępuje kontroli ISAP; wymusza praktyczny workflow kancelaryjny.

## 1. Intake szczególny

Przed odpowiedzią ustal co najmniej:
- status podmiotu;
- zezwolenie;
- produkt/obrót;
- organ GIF/WIF/URPL;
- decyzja/inspekcja;
- ryzyko kar administracyjnych;

## 2. Mapa proceduralna

```text
Identyfikacja trybu i organu/sądu
  ↓
Kontrola terminu, doręczenia, właściwości i legitymacji
  ↓
Ustalenie faktów materialnych i proceduralnych
  ↓
Matryca dowodowa: fakt → dowód → ciężar dowodu → luka
  ↓
Dobór pisma/środka: wniosek / odwołanie / zażalenie / skarga / pozew / zawiadomienie
  ↓
Walidacja formalna: shared/FORMAL-CHECK.md + shared/WARUNKI-SKUTECZNOSCI.md
  ↓
Ocena ryzyka: shared/RISK-ASSESSMENT.md + shared/QUALITY-CHECK.md
  ↓
Strategia: minimum, optimum, wariant eskalacyjny
```

## 3. Warunki skuteczności

```text
□ prawidłowy tryb
□ właściwy organ albo sąd
□ termin liczony od prawidłowego zdarzenia
□ legitymacja strony
□ żądanie możliwe prawnie
□ fakty powiązane z podstawą prawną
□ dowody przypisane do każdej tezy
□ kontrola opłat, odpisów, pełnomocnictw i podpisu
□ kontrola ISAP na dzień sporządzenia pisma
□ kontrola stanu prawnego na dzień zdarzenia oraz na dzień orzekania
```

## 4. Matryca dowodowa

Dowody typowe dla tego modułu:
- zezwolenia;
- protokoły kontroli;
- dokumentacja produktu;
- reklamacje;
- decyzje organów;
- procedury jakości;

Każdy dowód oceniaj według schematu:

```text
Dowód → fakt, który ma wykazać → bezpośredni/pośredni → wiarygodność → ryzyko podważenia → brakujący dowód wzmacniający
```

## 5. Typowe zarzuty i kontrzarzuty

W każdej sprawie przygotuj dwie wersje:

1. argumentację strony inicjującej sprawę,
2. argumentację organu/przeciwnika procesowego.

Typowe ryzyka i kontrargumenty:
- brak ścieżki inspekcyjnej;
- niedoszacowanie sankcji;
- brak dokumentacji GDP/GMP;
- równoległa odpowiedzialność karna;

## 6. Strategia procesowa

Zastosuj trzy warianty:

### Wariant ostrożny
Minimalizuje ryzyko formalne. Priorytet: termin, kompletność, zabezpieczenie dowodów.

### Wariant ofensywny
Eksponuje naruszenia proceduralne, wadliwość ustaleń, niewłaściwą wykładnię, naruszenie zasady proporcjonalności albo praw strony.

### Wariant eskalacyjny
Zakłada przejście do organu II instancji, WSA/NSA, sądu powszechnego, SN, TSUE, ETPC albo organu sektorowego — tylko gdy wynika to z trybu.

## 7. Quality gate

Przed końcową odpowiedzią sprawdź:

```text
□ Czy moduł działa praktycznie, a nie opisowo?
□ Czy wskazano decydujący element prawny?
□ Czy oddzielono fakty od interpretacji?
□ Czy podano ryzyka przeciwnika/organu?
□ Czy wskazano słabe punkty klienta?
□ Czy każdy przepis i Dz.U. ma kontrolę ISAP albo oznaczenie braku weryfikacji?
□ Czy użyto shared/MODULE-STANDARD-POLISH-LAW.md?
```

## 8. Łącz obowiązkowo z

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
# Prawo Farmaceutyczne — Szczegółowy Framework

## TERMINY — SPRAWDŹ JAKO PIERWSZE
```
Odwołanie od decyzji GIF / WIF:                    14 dni (art. 129 §2 KPA)
Skarga do WSA:                                     30 dni od decyzji II inst.
Cofnięcie zezwolenia na prowadzenie apteki:        postępowanie KPA — 14 dni na odwołanie
Sprzeciw WIF wobec uruchomienia apteki:            30 dni od zgłoszenia
Pozwolenie na dopuszczenie do obrotu (rejestracja): URPL — weryfikuj aktualny termin
Termin na uzupełnienie braków formalnych:          wyznaczony przez organ
Odpowiedzialność zawodowa farmaceuty:              brak terminu zawitego na skargę
```

## FAZA 0 — INTAKE
```
□ Kto jest stroną?
  → apteka / hurtownia / wytwórca / importer / podmiot odpowiedzialny
  → farmaceuta / technik farmaceutyczny (sprawa dyscyplinarna)
  → pacjent (prawa pacjenta w aptece)
□ Jaki problem?
  → cofnięcie / odmowa zezwolenia na aptekę ogólnodostępną / szpitalną
  → kara administracyjna (GIF / WIF)
  → naruszenia przepisów aptecznych (reklama / substancje psychoaktywne)
  → dopuszczenie produktu leczniczego do obrotu
  → kwestia refundacji / cenowa
  → sprawa dyscyplinarna farmaceuty
□ Jaka data decyzji / zdarzenia? (termin odwołania)
□ Czy sprawa dotyczy obrotu produktami z art. 37j–37n PF (hurtownie)?
```

## MAPA ORGANÓW I KOMPETENCJI
```
GIF (Główny Inspektor Farmaceutyczny):
  → Organ II inst. od decyzji WIF
  → Nadzór nad hurtowniami ogólnopolskimi i wytwórcami
  → Rejestr aptek szpitalnych / zakładowych
  → Postępowanie w sprawie wycofania produktu z obrotu

WIF (Wojewódzki Inspektor Farmaceutyczny):
  → Organ I inst. dla aptek ogólnodostępnych
  → Kontrola aptek (KPA — wszczyna z urzędu lub na wniosek)
  → Decyzje o cofnięciu / zawieszeniu zezwolenia

URPL (Urząd Rejestracji Produktów Leczniczych, Wyrobów Medycznych i Produktów Biobójczych):
  → Dopuszczenie produktów leczniczych do obrotu
  → Rejestracja / zmiana / odnowienie / cofnięcie pozwolenia

MZ (Ministerstwo Zdrowia):
  → Wykaz leków refundowanych (obwieszczenie co 3 miesiące — weryfikuj: gov.pl)
  → Decyzje refundacyjne i cenowe
  → Nadzór nad GIF i URPL

NIA (Naczelna Izba Aptekarska):
  → Odpowiedzialność zawodowa farmaceutów
  → Sąd Aptekarski: OIA (I inst.) → NIA (II inst.)
```

## APTEKA OGÓLNODOSTĘPNA — ZEZWOLENIA

### Warunki uzyskania (art. 99 PF)
```
□ Podmiot: wyłącznie farmaceuta (osoba fizyczna) lub spółka jawna/partnerska
  → Zakaz: sieci apteczne (>1% aptek w woj.), hurtownie, producenci, sklepy ogólne
  → "Apteka dla aptekarza": zasada z nowelizacji 2017 r. — weryfikuj aktualne wyjątki
□ Lokal: spełnia wymagania architektoniczne i sanitarne (rozporządzenie MZ)
□ Kierownik apteki: farmaceuta z 5-letnim stażem (art. 88 PF)
□ Godziny otwarcia: min. 8h/dobę, w woj. i powiatach wg rozporządzenia
□ Przynależność do izby aptekarskiej
□ Brak podstaw odmowy z art. 104 PF (zbyt wiele aptek w gminie: 1 apteka / 3 000 mieszkańców)

KRYTERIUM DEMOGRAFICZNO-GEOGRAFICZNE (art. 99 ust. 3a PF):
  → 1 apteka na 3 000 mieszkańców w gminie (pkt 3a: uwzględnia się gminę)
  → max 1% aptek w województwie (art. 99 ust. 3a pkt 3b PF)
  ⚠️ Brak ustawowego kryterium odległości między aptekami — weryfikuj aktualny stan orzecznictwa NSA
```

### Cofnięcie zezwolenia (art. 103 PF)
```
OBLIGATORYJNE COFNIĘCIE gdy:
  → Apteka rażąco narusza przepisy PF (po wcześniejszym wezwaniu do usunięcia)
  → Przestała spełniać warunki wymagane przy udzieleniu zezwolenia
  → Farmaceuta-właściciel utracił prawo wykonywania zawodu

TRYB:
  Kontrola WIF → protokół → decyzja WIF
  ↓ [14 dni] odwołanie do GIF
  GIF → decyzja ostateczna
  ↓ [30 dni] skarga do WSA → NSA
```

## REKLAMA APTEK — STAN NA DZIEŃ WERYFIKACJI (22.05.2026)
```
OBECNY STAN: art. 94a PF (zakaz) NADAL OBOWIĄZUJE

WYROK TSUE C-200/2024 (19.06.2025):
  → TSUE uznał, że całkowity zakaz reklamy aptek narusza:
    - Dyrektywę 2000/31/WE (handel elektroniczny)
    - Swobodę przedsiębiorczości (art. 49 TFUE)
  → Polska ma obowiązek dostosowania prawa

PROJEKT NOWELIZACJI:
  → Planowane uchylenie art. 94a i zastąpienie ograniczonym systemem reklamy
    neutralnej / obiektywnej
  → Status: projekt rządowy; planowane przyjęcie przez RM III kw. 2026
  → ⚠️ Do czasu wejścia w życie — zakaz reklamy OBOWIĄZUJE
  → Weryfikuj: legislacja.rcl.gov.pl / gov.pl (projekt UDER114)

RYZYKO: postępowania GIF/WIF za naruszenie art. 94a PF mimo wyroku TSUE —
  rozważ powołanie się na wyrok TSUE i bezpośrednią skuteczność dyrektywy
  (weryfikuj aktualną linię NSA przed powołaniem: orzeczenia-sadowe-v2)
```

## REFUNDACJA I CENY

### Wykaz leków refundowanych
```
OBWIESZCZENIE MZ: aktualizacja co 3 miesiące (1 styczeń, kwiecień, lipiec, październik)
  → Weryfikuj aktualny wykaz: gov.pl/web/zdrowie → refundacja

DECYZJA REFUNDACYJNA:
  → Podmiot odpowiedzialny składa wniosek refundacyjny do MZ
  → Negocjacje z Komisją Ekonomiczną MZ
  → Decyzja MZ → odwołanie do MZ (III KPA) → skarga do WSA

CENY LEKÓW REFUNDOWANYCH:
  → Urzędowe ceny zbytu dla refundowanych — ustalane decyzją MZ
  → Marże hurtowe i apteczne: ustawowe, stałe
  → Apteka nie może udzielać rabatów na leki refundowane (naruszenie → kara WIF)
```

## PRODUKTY LECZNICZE — DOPUSZCZENIE DO OBROTU (URPL)
```
TRYBY:
  A. Procedura narodowa (art. 10–21 PF) — wyłącznie Polska
  B. Procedura zdecentralizowana (DCP) — kilka krajów UE jednocześnie
  C. Procedura wzajemnego uznania (MRP) — rozszerzenie istniejącego pozwolenia
  D. Procedura centralna (EMA) — pozwolenie EU-wide (lek innowacyjny, biologiczny)

POZWOLENIE NA PRODUKTY LECZNICZE: 5 lat → odnowienie (art. 28 PF)
(Zezwolenie na aptekę: bezterminowe — do cofnięcia przez organ; patrz art. 103 PF)
ZMIANA WARUNKÓW: CharPL, SPC — decyzja URPL; duże/małe zmiany (wg rozporządzeń)
COFNIĘCIE POZWOLENIA: gdy lek nieskuteczny, szkodliwy lub fałszywych danych

⚠️ Weryfikuj aktualne regulacje URPL: urpl.gov.pl — przepisy zmieniają się często
```

## ODPOWIEDZIALNOŚĆ ZAWODOWA FARMACEUTY
```
ORGANY:
  OIA (Okręgowa Izba Aptekarska) → Okręgowy Sąd Aptekarski (I inst.)
  NIA → Naczelny Sąd Aptekarski (II inst.)

KARY: upomnienie / nagana / zawieszenie prawa wykonywania (do 3 lat) / pozbawienie

PODSTAWY:
  → Naruszenie zasad etyki farmaceutycznej
  → Naruszenie przepisów o wykonywaniu zawodu
  → Rażące błędy zawodowe

TRYB: skarga do OIA → postępowanie wyjaśniające → rozprawa → orzeczenie
  Niezależne od postępowania karnego (możliwe równoległe)
```

## PREDYKCJA WYNIKU — SZABLON
```
Szanse: [0–100%]
IN PLUS: uchybienie proceduralne WIF, brak spełnienia przesłanek cofnięcia (art. 103),
         upływ terminu na wydanie decyzji (bezczynność), kryterium demograficzne
         niezastosowane prawidłowo, wyrok TSUE jako argument przy reklamie
IN MINUS: udokumentowane naruszenie art. 94a / warunków PF, utrata prawa wyk. zawodu,
          wielokrotne wezwania do usunięcia naruszeń zignorowane

BENCHMARKING:
  → Wywołaj orzeczenia-sadowe-v2 z frazą:
    "apteka cofnięcie zezwolenia WIF GIF NSA WSA"
    "art. 99 PF kryterium demograficzne"
  → Portal NSA: nsa.gov.pl | TSUE: curia.europa.eu
  ⚠️ NIEZWERYFIKOWANE — wyszukaj URL przed powołaniem

REKOMENDACJA: □ Odwołanie do GIF  □ Skarga do WSA  □ Wniosek o wstrzymanie decyzji
              □ Argumentacja z wyroku TSUE  □ Skarga do sądu aptekarskiego
```

## ŁĄCZ Z
| Sytuacja | Skill |
|---|---|
| Odwołanie od decyzji WIF/GIF | `mod-G-administracyjne.md` + `kpa-admin.md` + `pisma-procesowe-v3` |
| Skarga do WSA | `pisma-procesowe-v3` + `kpa-admin.md` |
| Błąd medyczny / prawa pacjenta | `mod-V-medyczne.md` + `prawo-medyczne.md` |
| Naruszenie przepisów — odpow. karna | `mod-N-karne.md` + `kwalifikator-karnomaterialny.md` |
| Umowa z hurtownią / dystrybucja | `analizator-umow-v1` |
| Analiza szans odwołania | `analiza-sadowa-v6` |
| Orzecznictwo NSA / WSA / TSUE | `orzeczenia-sadowe-v2` |

*PF: Dz.U. 2026 poz. 612 t.j. (obwieszczenie 17.04.2026) + nowelizacje Dz.U. 2025 poz. 924, 1416, 1537*
*URPL: urpl.gov.pl | GIF: gif.gov.pl | NIA: nia.org.pl*
*Projekt UDER114: legislacja.rcl.gov.pl | TSUE C-200/2024: curia.europa.eu*
*Weryfikacja: 22.05.2026 — zakaz cytowania przepisów z pamięci*
# Framework: Prawo Farmaceutyczne

> **Zasada absolutna:** Każdy artykuł weryfikować w isap.sejm.gov.pl.
> Prawo farmaceutyczne zmieniane jest kilka razy rocznie — NIGDY nie cytuj z pamięci.
> Aktualne t.j.: Prawo farmaceutyczne **Dz.U. 2026 poz. 612**;
> Ustawa refundacyjna **Dz.U. 2025 poz. 907**;
> Nowelizacje: PF z 24.06.2025 (Dz.U. 2025 poz. 924), refundacja z 25.07.2025 (Dz.U. 2025 poz. 1192).

---

## CZĘŚĆ I — DOPUSZCZANIE PRODUKTÓW LECZNICZYCH DO OBROTU

### Definicja produktu leczniczego (art. 2 pkt 32 PF — weryfikuj online)

```
Produkt leczniczy = substancja lub mieszanina substancji, o właściwościach:
  [A] leczniczych lub zapobiegawczych w odniesieniu do chorób ludzi/zwierząt, LUB
  [B] podawana człowiekowi/zwierzęciu w celu postawienia diagnozy lub przywrócenia,
      poprawy czy modyfikacji fizjologicznych funkcji organizmu

Kategorie:
  • Produkt leczniczy wydawany na receptę (Rx)
  • Produkt leczniczy wydawany bez recepty (OTC)
  • Produkt leczniczy weterynaryjny
  • Badany produkt leczniczy (w badaniu klinicznym)
  • Immunologiczny produkt leczniczy (szczepionki)
  • Radiofarmaceutyk
  • Lek recepturowy i apteczny

UWAGA: Wyrób medyczny ≠ produkt leczniczy (odrębna ustawa 7.04.2022, Dz.U. 2022 poz. 974)
Suplement diety ≠ produkt leczniczy (ustawa o bezpieczeństwie żywności)
```

### Zasada pozwolenia (art. 3 PF)

```
REGUŁA: Do obrotu dopuszczone są produkty lecznicze, które uzyskały:
  → pozwolenie krajowe (wydaje Prezes UPLWMiPB)
  → pozwolenie unijne (Rada UE lub Komisja Europejska — EMA)

PREZES URZĘDU = Prezes Urzędu Produktów Leczniczych, Wyrobów Medycznych
                i Produktów Biobójczych (dawny URPL) — weryfikuj aktualną nazwę

WYJĄTKI — bez pozwolenia dopuszczone są (art. 3 ust. 4 i art. 4 PF):
  → leki recepturowe i apteczne (sporządzane w aptece)
  → produkty radiofarmaceutyczne przygotowywane na miejscu
  → import docelowy (art. 4 PF) — patrz poniżej

Wydawanie pozwolenia: procedura:
  □ Narodowa (krajowa) — wniosek do Prezesa Urzędu
  □ Wzajemnego uznania (MRP) — referencja innego państwa UE
  □ Zdecentralizowana (DCP) — jednoczesna ocena w kilku państwach
  □ Scentralizowana (CP) — EMA, obowiązkowa dla biotechnologii, nowotworów, HIV, cukrzycy
```

### Import docelowy (art. 4 PF)

```
Dopuszczenie do obrotu bez pozwolenia dla:
  → produktu leczniczego sprowadzanego z zagranicy
  → na zapotrzebowanie lekarza dla konkretnego pacjenta
  → gdy brak dostępności w Polsce (lub gdy wymaga tego interes pacjenta)

Procedura:
  → Lekarz wystawia zapotrzebowanie → do hurtowni farmaceutycznej
  → Hurtownia składa wniosek przez SOID (System Obsługi Importu Docelowego)
  → Prezes Urzędu wydaje zgodę (lub odmawia)
  → Produkt może być wydany wyłącznie na receptę lekarza wnioskującego

Podstawa prawna: art. 4 PF — weryfikuj aktualne brzmienie i procedurę w ISAP
```

---

## CZĘŚĆ II — WYTWARZANIE I GMP

### Zezwolenie na wytwarzanie (art. 38 PF)

```
Wytwarzanie i import produktów leczniczych wymaga zezwolenia Prezesa Urzędu.

WYJĄTKI (art. 38 ust. 1 pkt 1 PF — weryfikuj):
  → apteki sporządzające leki recepturowe i apteczne
  → podmioty lecznicze wytwarzające produkty radiofarmaceutyczne na własne potrzeby

Wymogi dla wytwórcy:
  → pomieszczenia i wyposażenie zgodne z GMP (Dobra Praktyka Wytwarzania)
  → Osoba Wykwalifikowana (Qualified Person) odpowiedzialna za zwolnienie serii
  → system zarządzania jakością (QMS)
  → dokumentacja techniczna i rejestracyjna

GMP = Dobra Praktyka Wytwarzania (art. 2 pkt 13 PF)
  → gwarantuje że produkt wytwarzany i kontrolowany zgodnie z wymaganiami
  → weryfikacja przez GIF w toku inspekcji

Zwolnienie serii = poświadczenie przez Osobę Wykwalifikowaną (art. 2 pkt 47a PF)
```

### Substancje czynne (API) — rozdział 3a PF

```
Wytwarzanie, import i dystrybucja substancji czynnych (API):
  → wymagają rejestracji u Prezesa Urzędu (nie pełnego zezwolenia wytwórczego)
  → obowiązuje GMP substancji pomocniczych
  → wytwórcy z państw trzecich: certyfikat GMP uznawany przez Prezesa Urzędu
  → dostawcy API muszą figurować w dokumentacji rejestracyjnej leku
```

---

## CZĘŚĆ III — REKLAMA PRODUKTÓW LECZNICZYCH

### Zakres regulacji (art. 52–64 PF)

```
DEFINICJA REKLAMY (art. 52 ust. 1 PF — weryfikuj):
  Każde działanie polegające na informowaniu lub zachęcaniu do stosowania
  produktu leczniczego, mające na celu zwiększenie liczby przepisywanych recept,
  dostarczania, sprzedaży lub konsumpcji produktów leczniczych.

NIE JEST REKLAMĄ (art. 52 ust. 2 PF):
  → oznakowanie opakowania i ulotka dla pacjenta
  → korespondencja z odpowiedzią na pytanie o konkretny produkt
  → informacje o cenach i wykazach zamieszczone w hurtowniach/aptekach
  → ostrzeżenia zdrowotne i kampanie zdrowotne
```

### Reklama kierowana do publiczności (OTC)

```
DOPUSZCZALNA TYLKO DLA: produktów leczniczych wydawanych bez recepty (OTC)

OBLIGATORYJNE ELEMENTY reklamy (art. 53 PF — weryfikuj aktualne brzmienie):
  → nazwa produktu leczniczego
  → wskazania terapeutyczne (ogólne)
  → wymagane ostrzeżenie: "Przed użyciem zapoznaj się z ulotką..." (dokładne brzmienie weryfikuj)

BEZWZGLĘDNE ZAKAZY (art. 55 PF — weryfikuj):
  → sugerowanie że produkt jest suplementem diety lub kosmetykiem
  → zapewnienie o braku działań niepożądanych
  → reklama skierowana wyłącznie lub głównie do dzieci
  → reklama przez lekarzy, farmaceutów lub inne osoby polecające w ramach zawodu
  → sponsorowanie przekazów skierowanych do ogółu, jeśli dotyczą leków Rx
```

### Reklama kierowana do profesjonalistów (HCP)

```
DOPUSZCZALNA DLA: leków Rx i OTC, kierowana do lekarzy, farmaceutów, ratowników

WYMOGI (art. 56–58 PF — weryfikuj):
  → informacja zgodna z ChPL (Charakterystyką Produktu Leczniczego)
  → nazwa produktu, ChPL, data zatwierdzenia, data reklamy
  → zakaz oferowania prezentów powyżej wartości "de minimis" (weryfikuj aktualne limity)
  → zakaz uzależniania korzyści od ilości przepisywanych recept
  → próbki: wyłącznie na pisemny wniosek, max 4 szt. rocznie, z ChPL, bez próbek narkotyków

ZAKAZ: reklamy produktów w trakcie badań klinicznych (bez zatwierdzonego pozwolenia)
```

### Nadzór nad reklamą

```
Organ nadzoru: Główny Inspektor Farmaceutyczny (GIF) — art. 62 PF
Procedura: GIF nakazuje zaprzestanie i usunięcie reklamy, może nałożyć karę pieniężną
Podstawa skargi: podmiot, któremu wyrządzono szkodę reklamą, lub organ może wszcząć
Kara pieniężna: weryfikuj art. 62 i 127 PF — aktualne widełki po nowelizacji 2025
```

---

## CZĘŚĆ IV — APTEKI I OBRÓT DETALICZNY

### Apteka dla Aptekarza — art. 99 PF (aktualny stan po nowelizacjach)

```
PODMIOT UPRAWNIONY DO UZYSKANIA ZEZWOLENIA (art. 99 ust. 4 PF):
  pkt 1: farmaceuta posiadający prawo wykonywania zawodu,
         prowadzący jednoosobową działalność gospodarczą
  pkt 2: spółka jawna lub spółka partnerska, której:
          - przedmiotem działalności jest WYŁĄCZNIE prowadzenie aptek
          - wspólnikami/partnerami są WYŁĄCZNIE farmaceuci z prawem wyk. zawodu

ZAKAZ SUKCESJI (art. 99 ust. 4 PF in fine):
  → do zezwoleń nie stosuje się art. 494 §2, 531 §2, 553 §2 KSH
  → zezwolenie NIE przechodzi automatycznie na nabywcę w ramach połączenia/podziału spółki

OGRANICZENIA ANTYKONCENTRACYJNE (art. 99 ust. 3 PF — weryfikuj aktualne brzmienie):
  → jeden podmiot (lub podmioty powiązane) nie może prowadzić więcej niż 1% aptek
    ogólnodostępnych w danym województwie
  → limit 4 aptek per farmaceuta/spółka (po nowelizacji — weryfikuj aktualny stan)

KRYTERIA GEOGRAFICZNO-DEMOGRAFICZNE (art. 99 ust. 3a–3b PF):
  → odmowa gdy: liczba mieszkańców gminy / liczba aptek < 3000 per apteka
    I odległość od planowanej apteki do najbliższej istniejącej < 500 m

PRZENIESIENIE ZEZWOLENIA (art. 104a PF):
  → możliwe przy sprzedaży całej apteki (zorganizowana część przedsiębiorstwa)
  → nabywca musi spełniać wymogi Apteki dla Aptekarza
  → apteka musi pozostać w tym samym lokalu
  → organ: WIF na wniosek

ORGAN: Wojewódzki Inspektor Farmaceutyczny (WIF)
TRYB ODWOŁAWCZY: odwołanie do GIF → skarga do WSA → NSA
```

### Cofnięcie zezwolenia (art. 103 PF — weryfikuj aktualne brzmienie)

```
WIF COFA ZEZWOLENIE gdy apteka:
  → prowadzi obrót produktami leczniczymi niedopuszczonymi do obrotu
  → prowadzi obrót hurtowy produktami leczniczymi (zakaz dla aptek)
  → w ciągu 3 miesięcy nie podjęła działalności / przerwała ją bez uzasadnienia
  → narusza przepisy dot. informowania o cenach leków
  → przekazuje dane pacjentów innym podmiotom (z wyjątkami po nowelizacji 2025)
  → narusza art. 86a PF (zbywanie i przekazywanie produktów leczniczych)
  → nastąpiła utrata prawa wykonywania zawodu przez farmaceutę-właściciela
    i brak możliwości dalszego prowadzenia apteki

DEREGULACJA 2025: projekt łagodzenia art. 103 ust. 2 pkt 4a — weryfikuj
stan po wejściu w życie nowelizacji z 24.06.2025 (Dz.U. 2025 poz. 924)
```

### Kierownik apteki (art. 88 PF)

```
Obowiązkowe zatrudnienie osoby odpowiedzialnej za prowadzenie apteki.
Wymagania: farmaceuta z co najmniej 5-letnim stażem w aptece
           LUB 3-letnim stażem + specjalizacja farmaceutyczna
Odpowiedzialność: za przestrzeganie prawa farmaceutycznego w aptece
```

### Punkty apteczne i obrót pozaapteczny (art. 70–71 PF)

```
Punkt apteczny: zezwolenie WIF; ograniczony asortyment (leki OTC + sprzęt rehab.)
Obrót pozaapteczny: sklepy zielarsko-medyczne, sklepy ogólnodostępne, apteki szpitalne
  → wykaz produktów dopuszczonych do sprzedaży pozaaptecznej — rozporządzenie MZ
  → weryfikuj aktualne rozporządzenie wykonawcze online
```

---

## CZĘŚĆ V — HURTOWNIE FARMACEUTYCZNE

### Zezwolenie i wymogi GDP (art. 74–85a PF)

```
Obrót hurtowy: WYŁĄCZNIE przez hurtownie farmaceutyczne (art. 65 ust. 1 PF)
Organ: Główny Inspektor Farmaceutyczny (GIF)

Wymogi dla hurtowni:
  → pomieszczenia i wyposażenie zgodne z GDP (Dobra Praktyka Dystrybucji)
  → Osoba Odpowiedzialna (OP) za zgodną z prawem dystrybucję
  → rejestracja dostaw i sprzedaży — pełna identyfikowalność serii
  → zakaz dystrybucji produktów leczniczych nieznanego pochodzenia

GDP = Dobra Praktyka Dystrybucji — Rozporządzenie Komisji UE 2013/C 68/01
  → transport w odpowiednich warunkach temperaturowych
  → weryfikacja autentyczności produktów (FMD — Falsified Medicines Directive)

Inwentaryzacja i zwrot do wytwórcy: obowiązki przy wycofaniu z rynku (recall)
```

---

## CZĘŚĆ VI — REFUNDACJA LEKÓW

### Ustawa refundacyjna z 12.05.2011 (Dz.U. 2025 poz. 907 t.j.)

```
LISTA LEKÓW REFUNDOWANYCH:
  → ogłaszana obwieszczeniem Ministra Zdrowia co 2 miesiące
  → weryfikuj aktualną listę na stronie MZ: mz.gov.pl → refundacja
  → trzy grupy limitowe: lek podstawowy, lek uzupełniający, lek o wskazaniu do stosowania

POZIOMY ODPŁATNOŚCI PACJENTA:
  → bezpłatny (0 zł) — seniorzy 75+, ciężarne, dzieci do 18. roku życia (weryfikuj warunki)
  → ryczałtowy (3,20 zł / weryfikuj aktualną kwotę)
  → 50% limitu finansowania
  → 30% limitu finansowania
  → pełna odpłatność poza limitem

RECEPTA NA LEK REFUNDOWANY:
  → wystawiana przez lekarza posiadającego umowę z NFZ
  → oznaczenie: "Rp" + poziom refundacji + PESEL pacjenta
  → recepta wystawiona niezgodnie z przepisami → apteka odmawia realizacji po refundowanej cenie

ZMIANY USTAWĄ Z 25.07.2025 (Dz.U. 2025 poz. 1192):
  → weryfikuj zakres zmian przed podaniem szczegółów — nowelizacja weszła w życie
    w II połowie 2025 r. / 2026 r. (sprawdź datę wejścia w życie online)
```

### Decyzja refundacyjna — tryb administracyjny

```
Podmiot odpowiedzialny (wytwórca/MAH) składa wniosek do MZ o:
  → objęcie refundacją → Minister Zdrowia wydaje decyzję administracyjną
  → podwyższenie ceny / rozszerzenie wskazań refundowanych

Odwołanie od decyzji MZ:
  → do Ministra Zdrowia (ponowne rozpatrzenie)
  → skarga do Wojewódzkiego Sądu Administracyjnego w Warszawie
  → skarga kasacyjna do NSA

Skargi pacjentów (brak dostępu do refundowanego leku):
  → Narodowy Fundusz Zdrowia (NFZ) — właściwy oddział
  → Rzecznik Praw Pacjenta (gov.pl/web/rpp)
  → Skarga do WIF gdy apteka odmówiła realizacji recepty refundowanej
```

---

## CZĘŚĆ VII — PAŃSTWOWA INSPEKCJA FARMACEUTYCZNA

### Struktura i kompetencje (art. 108–123b PF)

```
GIF (Główny Inspektor Farmaceutyczny):
  → nadzór nad wytwarzaniem, importem, dystrybucją hurtową
  → zezwolenia na wytwarzanie i prowadzenie hurtowni
  → inspekcje GMP i GDP
  → środki tymczasowe przy bezpośrednim zagrożeniu dla zdrowia
  → wycofanie serii produktu leczniczego z obrotu (recall)
  → nadzór nad reklamą (art. 62 PF)
  → organ odwoławczy od decyzji WIF

WIF (Wojewódzki Inspektor Farmaceutyczny):
  → zezwolenia na prowadzenie aptek i punktów aptecznych
  → nadzór nad obrotem detalicznym i aptecznym
  → inspekcje aptek i punktów aptecznych
  → I instancja w sprawach aptecznych

Uprawnienia kontrolne (art. 119 PF — weryfikuj):
  → prawo wstępu do pomieszczeń
  → żądanie dokumentów i próbek
  → nakazy natychmiastowego zaprzestania działalności (rygor natychmiastowej wykonalności)
  → zawiadomienie organów ścigania o przestępstwach farmaceutycznych
```

### Tryb odwoławczy od decyzji organów farmaceutycznych

```
WIF (I instancja) → odwołanie do GIF (II instancja)
  → termin: 14 dni od doręczenia decyzji WIF

GIF (II instancja) → skarga do WSA w Warszawie
  → termin: 30 dni od doręczenia decyzji GIF

WSA → skarga kasacyjna do NSA
  → termin: 30 dni od doręczenia wyroku WSA

Wniosek o zawieszenie wykonania decyzji (art. 135 KPA):
  → ważne przy cofnięciu zezwolenia — apteka może działać do rozstrzygnięcia
  → organ rozpatruje niezwłocznie; w razie odmowy — wniosek do WSA
```

---

## CZĘŚĆ VIII — SANKCJE KARNE I KARY PIENIĘŻNE

### Odpowiedzialność karna (rozdział 9 PF — weryfikuj Dz.U. 2026 poz. 612)

```
Art. 124 PF — WPROWADZANIE DO OBROTU BEZ POZWOLENIA:
  Kto wprowadza do obrotu lub przechowuje w celu wprowadzenia do obrotu
  produkt leczniczy, nie posiadając pozwolenia na dopuszczenie do obrotu
  → grzywna, ograniczenie wolności albo pozbawienie wolności do lat 2
  → w razie skazania: przepadek przedmiotu przestępstwa obowiązkowy

Art. 126 PF — PRZETERMINOWANY PRODUKT LECZNICZY:
  Wprowadzanie do obrotu produktu po upływie terminu ważności
  → grzywna, ograniczenie wolności albo pozbawienie wolności do lat 2

Art. 126b PF — NARUSZENIE ZAKAZU ZBYCIA:
  Sprzedaż lub zbycie wbrew zakazowi zbycia wydanemu przez GIF
  → grzywna lub ograniczenie wolności

Art. 126c PF — WYWÓZ / ZBYWANIE BEZ ZGŁOSZENIA:
  → kara pieniężna: 10 000 zł (weryfikuj aktualne stawki po nowelizacji 2025)

Art. 129 PF — PROWADZENIE APTEKI BEZ ZEZWOLENIA:
  → grzywna, ograniczenie wolności albo pozbawienie wolności do lat 2

KUMULACJA: odpowiedzialność karna + administracyjne cofnięcie zezwolenia są niezależne
```

### Kary pieniężne administracyjne (art. 127 PF — weryfikuj aktualne stawki)

```
UWAGA: art. 127 PF był wielokrotnie nowelizowany — SPRAWDŹ ONLINE przed podaniem kwot.
Nowelizacja z 24.06.2025 zmieniła górne limity kar (max 100 000 zł dla badań jakościowych).

Przykładowe podstawy kar (weryfikuj aktualne stawki):
  → prowadzenie apteki wbrew warunkom zezwolenia → kara pieniężna
  → prowadzenie hurtowni wbrew warunkom zezwolenia → kara pieniężna
  → wywóz produktu bez zgłoszenia → 10 000 zł
  → odmowa wykonania obowiązku zbycia produktu → 50 000–100 000 zł
  → nieprzekazanie dokumentów na żądanie GIF → 10 000–50 000 zł

Organ nakładający: GIF lub WIF (zależnie od rodzaju naruszenia)
Odwołanie: do GIF / wniosek o uchylenie → skarga do WSA
```

---

## CZĘŚĆ IX — WYROBY MEDYCZNE (ODRĘBNA REGULACJA)

### Ustawa o wyrobach medycznych z 7.04.2022 (Dz.U. 2022 poz. 974)

```
Zakres: wyroby medyczne, wyposażenie, systemy i zestawy zabiegowe
Rozporządzenie UE MDR 2017/745: obowiązuje bezpośrednio w Polsce
Rozporządzenie UE IVDR 2017/746: wyroby do diagnostyki in vitro

Organy: Prezes UPLWMiPB (rejestr, nadzór), GIF, inspekcja sanitarna
Rejestr wyrobów medycznych: mddr.ema.europa.eu (EUDAMED) oraz baza krajowa

Klasyfikacja (MDR):
  → Klasa I (niskie ryzyko): samoocena zgodności
  → Klasa IIa, IIb, III (wysokie ryzyko): jednostka notyfikowana

Ocena kliniczna: obowiązkowa przed wprowadzeniem do obrotu
Zdarzenia niepożądane i incydenty: obowiązek zgłoszenia do Prezesa UPLWMiPB
```

---

## CZĘŚĆ X — PERSPEKTYWA TROJGA

```
┌─────────────────────────────────────────────────────────────────┐
│ PODMIOT ODPOWIEDZIALNY / WYTWÓRCA / APTEKARZ                    │
│  • Czy posiadam ważne pozwolenie / zezwolenie?                  │
│  • Czy reklama spełnia wymogi art. 52–64 PF?                    │
│  • Jakie działania podjąć przy wycofaniu serii (recall)?        │
│  • Jak odwołać się od decyzji WIF/GIF?                          │
├─────────────────────────────────────────────────────────────────┤
│ ORGAN (GIF/WIF/MZ)                                              │
│  • Podstawy cofnięcia/odmowy zezwolenia                         │
│  • Przesłanki nałożenia kary pieniężnej                         │
│  • Granice kompetencji (WIF vs GIF)                             │
│  • Środki tymczasowe (natychmiastowe zawieszenie działalności)  │
├─────────────────────────────────────────────────────────────────┤
│ PACJENT / KONSUMENT                                             │
│  • Prawo do leku refundowanego (poziomy odpłatności)            │
│  • Skarga na odmowę realizacji recepty                          │
│  • Bezpieczeństwo produktu — zgłoszenie do GIF                  │
│  • Prawo do informacji (ChPL, ulotka)                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## ŹRÓDŁA WERYFIKACJI

| Źródło | URL | Zakres |
|---|---|---|
| ISAP — teksty jednolite | isap.sejm.gov.pl | PF, ustawa refundacyjna, u.w.m. |
| UPLWMiPB (dawny URPL) | urpl.gov.pl | Rejestr pozwoleń, decyzje, wytyczne |
| GIF | gif.gov.pl | Decyzje, kontrole, wycofania, wytyczne |
| Lista leków refundowanych | mz.gov.pl → refundacja | Aktualne obwieszczenia MZ |
| EMA — pozwolenia unijne | ema.europa.eu | Pozwolenia scentralizowane, ChPL |
| EUDAMED — wyroby medyczne | ec.europa.eu/tools/eudamed | Rejestr wyrobów medycznych UE |
| NFZ — refundacja | nfz.gov.pl | Umowy, realizacja recept |
| RPP | gov.pl/web/rpp | Skargi pacjentów |
| Orzeczenia NSA farm. | orzeczenia.nsa.gov.pl | Wyroki w sprawach farmaceutycznych |
| EUR-Lex — MDR/IVDR | eur-lex.europa.eu | Rozporządzenia UE o wyrobach medycznych |

---

## ✅ WERYFIKACJA Dz.U. — STATUS 2026-06-05

```
Prawo farmaceutyczne: Dz.U. 2026 poz. 612 t.j.
  ✅ VER: isap.sejm.gov.pl 2026-06-05
  Oryginał DR-10 miał Dz.U. 2022 poz. 974 — NIEAKTUALNY
  → https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260000612

Ustawa refundacyjna: Dz.U. 2025 poz. 907 t.j. ze zm. (zm.: Dz.U. 2025 poz. 1192)
  ✅ VER: isap.sejm.gov.pl 2026-06-05

Ustawa o działalności leczniczej: Dz.U. 2026 poz. 156 t.j.
  ✅ VER: isap.sejm.gov.pl 2026-06-05
  Oryginał DR-10 miał Dz.U. 2024 poz. 799 — NIEAKTUALNY
  → https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260000156
```
