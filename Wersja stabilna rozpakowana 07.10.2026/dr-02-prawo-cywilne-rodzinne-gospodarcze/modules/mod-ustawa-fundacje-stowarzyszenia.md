# mod-ustawa-fundacje-stowarzyszenia

**Stan operacyjny:** 2026-08-28

**Źródła kanoniczne:**
- ustawa z 6.04.1984 r. o fundacjach — t.j. Dz.U. 2023 poz. 166, z obowiązującą zmianą Dz.U. 2026 poz. 316;
- ustawa z 7.04.1989 r. — Prawo o stowarzyszeniach — t.j. Dz.U. 2020 poz. 2261, z obowiązującą zmianą Dz.U. 2026 poz. 316;
- Dz.U. 2026 poz. 346 jest aktem ogłoszonym, ale jego wejście w życie nastąpi 30.09.2028 — nie stosuj tej zmiany jako prawa obowiązującego 28.08.2026.

## 1. Kwalifikator: fundacja czy stowarzyszenie

| Cecha | Fundacja | Stowarzyszenie |
|---|---|---|
| Konstrukcja | majątek przeznaczony przez fundatora na prawnie dopuszczalny cel | dobrowolne, samorządne i trwałe zrzeszenie osób o celach niezarobkowych |
| Akt założycielski | oświadczenie fundatora + statut | uchwała założycielska/statut lub regulamin przy stowarzyszeniu zwykłym |
| Rejestr | KRS | stowarzyszenie rejestrowe — KRS; stowarzyszenie zwykłe — właściwa ewidencja |
| Organ podstawowy | zarząd wymagany ustawą/statutem | walne zebranie/delegaci + zarząd i organ kontroli wewnętrznej według ustawy/statutu |
| Nadzór | według ustawy o fundacjach i właściwości organu | Rozdział 3 Prawa o stowarzyszeniach |

## 2. Fundacje — mapa operacyjna

Przed utworzeniem lub oceną fundacji ustal:

```text
□ cel fundacji i jego zgodność z ustawą
□ fundatora/fundatorów i prawidłowość oświadczenia o ustanowieniu
□ majątek przeznaczony na realizację celu
□ treść statutu: nazwa, siedziba, majątek, cele, zasady/formy działania, zarząd
□ czy statut dopuszcza działalność gospodarczą i czy spełniono jej odrębne warunki
□ wpis do KRS i osoby uprawnione do reprezentacji
□ właściwy organ nadzoru
□ podstawę zmiany statutu, połączenia albo likwidacji
```

### Aktualna zmiana 2026

Dz.U. 2026 poz. 316 obowiązuje od 27.03.2026 i uchylił art. 5 ust. 1b ustawy o fundacjach. Nie odtwarzaj uchylonego obowiązku w checklistach statutu.

## 3. Prawo o stowarzyszeniach — aktualna struktura

| Rozdział | Zakres | Status |
|---|---|---|
| 1 | przepisy ogólne | 🟢 B+ / COV |
| 2 | tworzenie stowarzyszeń | 🟢 B+ / COV |
| 3 | nadzór nad stowarzyszeniami | 🟢 B+ / COV |
| 4 | majątek stowarzyszenia | 🟢 B+ / COV |
| 5 | likwidacja stowarzyszeń | 🟢 B+ / COV |
| 6 | stowarzyszenia zwykłe | 🟢 B+ / COV |
| 7 | przepisy szczególne, przejściowe i końcowe | kontrola temporalna |

### Tworzenie stowarzyszenia — bramka

Przy tworzeniu stowarzyszenia rejestrowego pobierz aktualny Rozdział 2 i sprawdź minimalną liczbę założycieli, elementy statutu, wybór władz oraz dokumenty do KRS. Nie utrwalaj w runtime liczby/formularza jako reguły bez fresh gate, gdy procedura rejestrowa może się zmienić.

### Stowarzyszenie zwykłe

Stowarzyszenie zwykłe ma odrębny reżim Rozdziału 6. Nie traktuj go jako „małego stowarzyszenia rejestrowego”; sprawdzaj jego regulamin, przedstawiciela/zarząd, ewidencję, majątek, zaciąganie zobowiązań i możliwość przekształcenia według aktualnych przepisów.

### Aktualne zmiany temporalne

- Dz.U. 2026 poz. 316 obowiązuje od 27.03.2026 i uchylił art. 10 ust. 1e Prawa o stowarzyszeniach.
- Dz.U. 2026 poz. 346 został ogłoszony 16.03.2026, lecz ma datę wejścia w życie 30.09.2028. Do spraw z 28.08.2026 używaj stanu **przed** wejściem tej nowelizacji w życie; można ją oznaczyć jedynie jako przyszłą zmianę wymagającą kontroli temporalnej.

## 4. Nadzór i ingerencja organu

Przy nadzorze ustal dokładnie:
- właściwy organ nadzorujący;
- podstawę żądania dokumentów/wyjaśnień;
- przesłankę środka nadzorczego;
- czy wymagane jest wystąpienie do sądu;
- właściwy środek zaskarżenia i tryb.

Nie utożsamiaj nadzoru administracyjnego z prawem organu do dowolnego ingerowania w wewnętrzne decyzje zgodne z ustawą i statutem.

## 5. Majątek i działalność gospodarcza

Dla obu form rozdziel:
1. działalność statutową nieodpłatną/odpłatną według właściwych ustaw szczególnych;
2. działalność gospodarczą;
3. podatki i rachunkowość;
4. status OPP, jeśli występuje.

Sam wpis działalności gospodarczej nie zmienia celu organizacji w cel zarobkowy. Szczegóły podatkowe/OPP kieruj do właściwych ustaw i DR-06/08/15.

## 6. Likwidacja

Przed likwidacją ustal podstawę ustawową/statutową, właściwy organ lub sąd, likwidatora, zasady reprezentacji w likwidacji, zaspokojenie zobowiązań, przeznaczenie pozostałego majątku oraz wykreślenie z właściwego rejestru/ewidencji.

## 7. Routing

- rejestr KRS → `mod-ustawa-KRS-rejestr-sadowy`;
- postępowanie rejestrowe → KPC + ustawa o KRS;
- podatki/rachunkowość → DR-06;
- działalność pożytku publicznego/OPP → właściwa ustawa NGO;
- zamówienia, dotacje i środki publiczne → DR-07/08 według relacji prawnej.

## 8. Fresh gate

Przed powołaniem konkretnego przepisu pobierz aktualny tekst ELI/ISAP obu ustaw i sprawdź późniejsze nowelizacje. W szczególności zawsze rozróżniaj zmianę już obowiązującą (Dz.U. 2026 poz. 316) od ogłoszonej zmiany przyszłej (Dz.U. 2026 poz. 346, wejście 30.09.2028).
