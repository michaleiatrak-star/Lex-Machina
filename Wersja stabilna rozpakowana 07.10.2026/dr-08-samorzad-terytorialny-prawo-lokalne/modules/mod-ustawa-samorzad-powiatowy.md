---
module: ustawa-samorzad-powiatowy
version: "1.1"
verified_on: "2026-08-28"
coverage: "B+ / COV — aktualny Dz.U. 2025 poz. 1684, pełna mapa 10 rozdziałów + rdzeń ustrojowy, prawo miejscowe i nadzór"
source_policy: "RZĄD 1 only"
---

# Ustawa o samorządzie powiatowym — current-state COV

## 1. Źródło

Ustawa z 5 czerwca 1998 r. o samorządzie powiatowym.  
Aktualny tekst jednolity: **Dz.U. 2025 poz. 1684**.

Źródło urzędowe:
- `https://eli.gov.pl/eli/DU/2025/1684/ogl`

Tekst jednolity uwzględnia zmiany ogłoszone przed 23.10.2025, w tym ustawę o ochronie ludności i obronie cywilnej. Przed zastosowaniem konkretnego przepisu sprawdź ELI pod kątem późniejszych zmian.

## 2. Mapa ustawy

| Rozdział | Zakres |
|---|---|
| 1 | Przepisy ogólne |
| 2 | Zakres działania i zadania powiatu |
| 3 | Władze powiatu |
| 4 | Akty prawa miejscowego stanowione przez powiat |
| 5 | Mienie powiatu |
| 6 | Finanse powiatu |
| 7 | Związki powiatów i związki powiatowo-gminne oraz stowarzyszenia i porozumienia powiatów |
| 8 | Nadzór nad działalnością powiatu |
| 9 | Miasta na prawach powiatu |
| 10 | Przepis końcowy |

## 3. Status i zadania

Powiat wykonuje zadania publiczne o charakterze ponadgminnym w imieniu własnym i na własną odpowiedzialność, ma osobowość prawną, a jego samodzielność podlega ochronie sądowej.

Przed przypisaniem konkretnego zadania powiatowi odczytaj Rozdział 2 oraz ustawę sektorową — ustawa ustrojowa nie zastępuje lex specialis.

## 4. Władze

Rozdział 3 reguluje radę powiatu i zarząd powiatu. Przy każdej sprawie ustal:
- właściwość rady, zarządu i starosty;
- formę działania: uchwała, zarządzenie, decyzja administracyjna albo czynność materialno-techniczna;
- quorum i większość z aktualnego przepisu;
- ewentualny konflikt interesów lub wyłączenie.

Nie przenoś reguł gminy lub województwa bez sprawdzenia ustawy powiatowej.

## 5. Prawo miejscowe

Dla aktu prawa miejscowego sprawdź łącznie:
1. konkretną delegację ustawową;
2. właściwy organ;
3. procedurę stanowienia;
4. publikację w wojewódzkim dzienniku urzędowym;
5. zgodność z granicami delegacji i prawem wyższego rzędu.

## 6. Mienie i finanse

Rozdziały 5–6 są warstwą ustrojową. Przy konkretnej czynności majątkowej lub budżetowej dołącz ustawę o finansach publicznych, ustawę o dochodach JST, przepisy o gospodarce nieruchomościami i właściwe uchwały lokalne.

## 7. Związki i współdziałanie JST

Rozdział 7 obejmuje związki powiatów, związki powiatowo-gminne, stowarzyszenia i porozumienia. Ustal konkretną formę współdziałania, statut/porozumienie oraz skutki dla wykonywania zadania i finansowania.

## 8. Nadzór

Rozdział 8 reguluje nadzór nad działalnością powiatu. Przy kontroli legalności uruchom równolegle `mod-nadzor-wojewody-RIO-legalnosc-uchwal.md` oraz PPSA dla kontroli sądowej.

## 9. Miasto na prawach powiatu

Miasto na prawach powiatu jest jedną JST wykonującą zadania gminy i powiatu. Nie traktuj go jako dwóch odrębnych osób prawnych.

## 10. Quality gate

- [ ] sprawdzono aktualny Dz.U. 2025 poz. 1684 i późniejsze zmiany;
- [ ] ustalono właściwość rady/zarządu/starosty;
- [ ] zadanie potwierdzono w ustawie sektorowej;
- [ ] dla prawa miejscowego sprawdzono delegację i publikację;
- [ ] dla mienia i finansów dołączono właściwe ustawy szczególne;
- [ ] dla nadzoru sprawdzono właściwy organ i PPSA.

**Status runtime:** B+/COV, bez deklaracji `FULL` artykuł-po-artykule.