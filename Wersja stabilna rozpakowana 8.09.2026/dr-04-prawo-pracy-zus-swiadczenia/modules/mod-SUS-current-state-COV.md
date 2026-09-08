---
module: SUS-current-state-COV
version: "1.0"
verified_on: "2026-08-28"
coverage: "B+/COV — wszystkie 13 rozdziałów SUS zmapowane do realnych modułów i fresh gate"
source_policy: "RZĄD 1 ELI"
---

# Ustawa o systemie ubezpieczeń społecznych — current-state COV

## 1. Baza

**Ustawa o systemie ubezpieczeń społecznych:** t.j. Dz.U. 2026 poz. 199.
ELI wskazuje akty zmieniające po t.j.; konkretna jednostka wymaga kontroli
tekstu ujednoliconego, daty zdarzenia i dat wejścia w życie.

- https://eli.gov.pl/eli/DU/2026/199/ogl

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
- [ ] sprawdzono tekst ujednolicony po t.j. 2026/199;
- [ ] sprawdzono cztery akty zmieniające wskazane przez ELI i daty wejścia;
- [ ] dla składek odczytano również właściwy akt wykonawczy;
- [ ] dla odwołania uruchomiono właściwy reżim KPC;
- [ ] dla zdarzenia historycznego zastosowano wersję przepisu z właściwej daty.

## 5. F-108

F-108/29: **B+/COV** dla struktury całej ustawy; `FULL` nieprzyznany.
