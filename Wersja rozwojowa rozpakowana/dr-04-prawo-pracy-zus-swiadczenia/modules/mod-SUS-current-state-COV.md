---
module: SUS-current-state-COV
version: "1.0"
verified_on: "2026-08-28"
coverage: "B+/COV — wszystkie 13 rozdziałów SUS zmapowane do realnych modułów i fresh gate"
source_policy: "RZĄD 1 ELI"
---

# Ustawa o systemie ubezpieczeń społecznych — current-state COV

## 1. Baza

**Ustawa o systemie ubezpieczeń społecznych:** t.j. Dz.U. 2026 poz. 1474
(obwieszczenie 9.10.2026, stan na 4.10.2026; ELI 2026-11-11; poprzedni t.j. 2026/199).
Konkretna jednostka nadal wymaga kontroli daty zdarzenia i dat wejścia w życie.

- https://eli.gov.pl/eli/DU/2026/1474/ogl

Zmiany ujęte w t.j. 2026/1474 względem poprzedniego t.j. 2026/199 (odczyt przepisów zmieniających w ELI):
- Dz.U. 2026 poz. 473 (ustawa o PIP, art. 5; od 8.07.2026) — decyzja inspektora pracy
  stwierdzająca istnienie stosunku pracy (art. 11 ust. 1 pkt 7a ustawy o PIP):
  art. 18 ust. 1b (do ostateczności decyzji albo prawomocności wyroku podstawą wymiaru
  są kwoty wykazane z tytułu umowy zlecenia/agencyjnej), art. 24 ust. 5h (zawieszenie
  przedawnienia składek od odwołania do ostateczności/prawomocności), art. 36 ust. 4e
  (zgłoszenie w 7 dni od ostateczności/prawomocności), art. 38b (składki z tytułu zlecenia
  zaliczane na poczet składek pracowniczych; bez art. 24 ust. 6a–6g), art. 50 ust. 11–13a;
- Dz.U. 2026 poz. 252 (od 3.04.2026) — art. 50 ust. 32 (dane dla organów cyberbezpieczeństwa);
- Dz.U. 2026 poz. 426 (od 14.04.2026) — art. 53 ust. 2 (dotacje i pożyczki dla FUS);
- Dz.U. 2026 poz. 734 (art. 2) — art. 50 ust. 16a; ⏳ art. 36 ust. 13a–13b od 6.12.2026;
- Dz.U. 2026 poz. 507 (art. 5) — ⏳ art. 36b ust. 2, art. 43 ust. 5aa od 1.11.2028.
Ujęte w t.j. z datą przyszłą: ⏳ Dz.U. 2025 poz. 1413 od 1.11.2026 — art. 45 ust. 1 pkt 4,
art. 50 ust. 28–31 (dane z konta płatnika dla banków i przedsiębiorców za jego zgodą);
⏳ Dz.U. 2026 poz. 26 — część zmian od 1.01.2027 (przypisy t.j.).

## 2. Mapa 13 rozdziałów

| Rozdział | Zakres strukturalny | Routing |
|---|---|---|
| 1 — Przepisy ogólne | art. 1–5 | `mod-SUS-uzupelnienie-pokrycia-2026.md` |
| 2 — Zasady podlegania ubezpieczeniom społecznym | art. 6–14 | `mod-SUS-dzial-2-podleganie-ubezpieczeniom.md` |
| 3 — Zasady ustalania składek na ubezpieczenia społeczne | art. 15–32 | `mod-SUS-uzupelnienie-pokrycia-2026.md` + `mod-ROZP-SKLADKOWE-podstawa-wymiaru.md` |
| 4 — Zgłoszenia, konta, rejestry, rozliczanie składek i zasiłków | art. 33–50a | `mod-SUS-uzupelnienie-pokrycia-2026.md` |
| 5 — Fundusz Ubezpieczeń Społecznych | od art. 51 | `mod-SUS-uzupelnienie-pokrycia-2026.md` |
| 6 — Fundusz Rezerwy Demograficznej | od art. 58 | jw. |
| 7 — Zakład Ubezpieczeń Społecznych | art. 66–79b | jw. + `mod-SUS-ZUS-ubezpieczenia-spoleczne.md` |
| 8 — Obowiązki ubezpieczonych oraz tryb odwoławczy | od art. 80 | `mod-SUS-ZUS-ubezpieczenia-spoleczne.md` + routing KPC |
| 9 — Zwrot nienależnie pobranych świadczeń i odsetki | art. 84–85 | `mod-SUS-uzupelnienie-pokrycia-2026.md` |
| 10 — Kontrola zadań z zakresu ubezpieczeń społecznych | art. 86–97 | jw. |
| 11 — Odpowiedzialność za wykroczenia | art. 98 | jw. + routing DR-03 |
| 12 — Zmiany w obowiązujących przepisach | art. 99–106 pominięte w t.j. | ten indeks; zakres historyczno-techniczny |
| 13 — Przepisy epizodyczne, przejściowe i końcowe | od art. 107 | ten indeks + fresh/temporal gate do ELI |

## 3. Co oznacza COV

COV jest **strukturalny**, nie artykuł-po-artykule:
- każdy rozdział ma jawny punkt wejścia;
- rozdziały materialne kierują do istniejących modułów;
- rozdziały historyczne/przejściowe są jawnie oznaczone i nie są pomijane;
- wartości składek, podstawy, limity, terminy i przepisy przejściowe zawsze
  wymagają świeżego odczytu.

Moduły szczegółowe mogą nadal mieć lokalną głębokość B/B+. Nie obniża to
strukturalnego COV całego aktu, ale wyklucza status `FULL`.

## 4. Quality gate

- [ ] ustalono tytuł ubezpieczenia;
- [ ] sprawdzono tekst ujednolicony po t.j. 2026/1474 (zmiany ⏳ z datą przyszłą);
- [ ] sprawdzono cztery akty zmieniające wskazane przez ELI i daty wejścia;
- [ ] dla składek odczytano również właściwy akt wykonawczy;
- [ ] dla odwołania uruchomiono właściwy reżim KPC;
- [ ] dla zdarzenia historycznego zastosowano wersję przepisu z właściwej daty.

## 5. F-108

F-108/29: **B+/COV** dla struktury całej ustawy; `FULL` nieprzyznany.
