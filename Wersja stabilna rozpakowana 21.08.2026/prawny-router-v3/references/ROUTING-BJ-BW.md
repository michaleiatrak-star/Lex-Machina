# ROUTING-BJ-BW — Ubezpieczenia Społeczne, Niepełnosprawność, Sądownictwo, Zawody Zaufania

> Plik wydzielony z prawny-router-v3/SKILL.md (R1).
> Wczytaj gdy: problem użytkownika pasuje do jednej z kategorii poniżej.
> Wywołanie: `view /mnt/skills/user/prawny-router-v3/references/ROUTING-BJ-BW.md`

---

## TABELA ROUTINGU

| Problem użytkownika | Moduł obowiązkowy |
|---|---|
| decyzja ZUS, składki, podleganie, zasiłek, świadczenie rehabilitacyjne | `mod-BJ-prawo-ubezpieczen-spolecznych-zus-krus.md` |
| niepełnosprawność, PZON/WZON, PFRON, świadczenie wspierające, dostępność | `mod-BK-niepelnosprawnosc-pfron-swiadczenie-wspierajace.md` |
| renta, emerytura, niezdolność do pracy, niezdolność do samodzielnej egzystencji | `mod-BL-renty-emerytury-fus-krus.md` |
| opinia biegłego, zarzuty do opinii, inny biegły, instytut | `mod-BM-biegli-sadowi-opinie-eksperckie.md` |
| ustrój sądów, skarga na sąd, przewlekłość, wyłączenie sędziego, organizacja sądu | `mod-BN-sadownictwo-ustroj-sadow.md` |
| ORA, OIRP, adwokat, radca, notariusz, komornik, lekarz, zawód zaufania | `mod-BO-zawody-zaufania-publicznego-ora-oirp.md` |
| postępowanie dyscyplinarne zawodowe lub służbowe | `mod-BP-postepowania-dyscyplinarne-profesjonalne.md` |
| prokuratura, policja, czynności organów ścigania, skargi służbowe | `mod-BQ-prokuratura-sluzby-organy-ochrony-prawa.md` |
| komisje lekarskie, dokumentacja medyczna, RPP, orzecznictwo medyczne | `mod-BR-prawo-medyczne-orzecznicze-i-komisje.md` |
| edukacja specjalna, PPP, uczelnia, dostosowania dla niepełnosprawności | `mod-BS-edukacja-specjalna-dostepnosc-ppp.md` |
| służby mundurowe, dyscyplinarka, uposażenie, orzeczenia komisji | `mod-BT-sluzby-mundurowe-dyscyplinarne.md` |
| KRUS, renta rolnicza, wypadek rolniczy, podleganie rolnicze | `mod-BU-krus-rolnicze-ubezpieczenia-spoleczne.md` |
| koszty sądowe, wynagrodzenie biegłych, pomoc prawna, opłaty zawodowe | `mod-BV-koszty-oplaty-i-pomoc-prawna.md` |
| przewlekłość, dostępność sądu, racjonalne dostosowanie, prawo do sądu | `mod-BW-skargi-na-przewleklosc-i-dostepnosc-sadu.md` |

Ścieżka bazowa modułów: `/mnt/skills/user/prawo-polskie-v2/references/modules/`

---

## MODUŁY SHARED — OBOWIĄZKOWE PRZY SPRAWACH BJ–BW

Dołącz odpowiednio do typu sprawy:

```text
view /mnt/skills/user/shared/SOCIAL-SECURITY-LAW-STANDARD.md        (ZUS, KRUS, renty)
view /mnt/skills/user/shared/DISABILITY-FUNCTIONAL-ASSESSMENT.md    (niepełnosprawność, PFRON)
view /mnt/skills/user/shared/EXPERT-OPINION-AUDIT.md                (biegli, opinie)
view /mnt/skills/user/shared/DISCIPLINARY-PROCEEDINGS-STANDARD.md   (dyscyplinarki zawodowe)
view /mnt/skills/user/shared/JUDICIARY-LEGAL-STANDARD.md            (ustrój sądów, zawody zaufania)
```

---

## DELEGACJA DO ROUTERÓW DZIEDZINOWYCH

Dla prawa polskiego router używa najpierw:
- `shared/DOMAIN-ROUTER-MATRIX.csv`
- `routery-dziedzinowe-v1`

Nie kieruj spraw bezpośrednio do pojedynczych modułów `prawo-polskie-v2`,
jeżeli istnieje właściwy router dziedzinowy DR-01–DR-16.

---

## DODATKOWE ROUTINGI V4

| Frazy / sprawa | Moduł |
|---|---|
| MPZP, WZ, co wolno na działce, lokal pod działalność | mod-W1 + mod-W + mod-AE |
| restauracja, warsztat, hurtownia, sanepid, UDT, PSP | mod-AE + mod-W1 |
| SWZ, parametry techniczne, jedyny produkt, art. 99 PZP | mod-X + mod-X-compliance |
| odwołanie od decyzji, ponaglenie, WSA | mod-G + pisma-procesowe-v3/MOD-ADMIN |
| ITD, SENT, tachograf | mod-AG + MOD-ADMIN |
| UOKiK, klauzule, platforma | mod-AF + mod-F |
| NIS2, UKE, DSA, incydent cyber | mod-AI + mod-P/mod-T według potrzeby |
| URE, OZE, przyłączenie | mod-AK + MOD-ADMIN |
| upadłość, restrukturyzacja, syndyk | mod-AJ |
