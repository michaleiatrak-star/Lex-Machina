# ROUTING-BJ-BW — Ubezpieczenia Społeczne, Niepełnosprawność, Sądownictwo, Zawody Zaufania

> Plik wydzielony z prawny-router-v3/SKILL.md (R1).
> Wczytaj gdy: problem użytkownika pasuje do jednej z kategorii poniżej.
> Wywołanie: `view prawny-router-v3/references/ROUTING-BJ-BW.md`

---

## TABELA ROUTINGU

| Problem użytkownika | Moduł obowiązkowy |
|---|---|
| decyzja ZUS, składki, podleganie, zasiłek, świadczenie rehabilitacyjne | `dr-04-prawo-pracy-zus-swiadczenia/modules/mod-SUS-ZUS-ubezpieczenia-spoleczne.md` (KRUS → `mod-KRUS-rolnicze-ubezpieczenia.md`) |
| niepełnosprawność, PZON/WZON, PFRON, świadczenie wspierające, dostępność | `dr-04-prawo-pracy-zus-swiadczenia/modules/mod-ustawa-rehabilitacja-PFRON.md` + `dr-04-prawo-pracy-zus-swiadczenia/modules/mod-ustawa-swiadczenie-wspierajace-WZON.md` |
| renta, emerytura, niezdolność do pracy, niezdolność do samodzielnej egzystencji | `dr-04-prawo-pracy-zus-swiadczenia/modules/mod-SUS-ZUS-ubezpieczenia-spoleczne.md` + `mod-FUS-zasilek-pogrzebowy-renta-rodzinna-waloryzacja.md`; emerytury pomostowe → `mod-emerytury-pomostowe.md` |
| opinia biegłego, zarzuty do opinii, inny biegły, instytut | `dr-12-sadownictwo-prokuratura-zawody-prawnicze/modules/mod-KPC-biegli-sadowi-opinie.md` |
| ustrój sądów, skarga na sąd, przewlekłość, wyłączenie sędziego, organizacja sądu | `dr-01-ustroj-konstytucyjny-i-zrodla-prawa/modules/mod-USP-ustroj-sadow-powszechnych.md`; przewlekłość/dostęp → także `dr-05-prawo-administracyjne-sadowoadministracyjne/modules/mod-ustawa-skargi-przewleklosc-dostep-sadu.md` |
| ORA, OIRP, adwokat, radca, notariusz, komornik, lekarz, zawód zaufania | DR-12: `mod-ustawa-adwokatura.md` / `mod-ustawa-radcowie-prawni.md` / `mod-ustawa-notariat.md` / `mod-ustawa-komornicy-sadowi-zawod.md`; lekarz → `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-ustawa-zawod-lekarza.md` |
| postępowanie dyscyplinarne zawodowe lub służbowe | zawody: `dr-12-sadownictwo-prokuratura-zawody-prawnicze/modules/mod-ustawa-odpowiedzialnosc-dyscyplinarna-zawodow.md`; służby: właściwy moduł konkretnej służby w DR-13 |
| prokuratura, policja, czynności organów ścigania, skargi służbowe | prokuratura → `dr-12-sadownictwo-prokuratura-zawody-prawnicze/modules/mod-PrProkuratura-organy-ochrony-prawa.md`; Policja → `dr-13-sluzby-bezpieczenstwo-informacje-niejawne/modules/mod-ustawa-policja.md` |
| komisje lekarskie, dokumentacja medyczna, RPP, orzecznictwo medyczne | `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-ustawa-prawa-pacjenta-framework.md` + `mod-rzecznik-praw-pacjenta-RPP.md`; właściwy moduł zawodu/świadczenia według sprawy |
| edukacja specjalna, PPP, uczelnia, dostosowania dla niepełnosprawności | `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-ustawa-edukacja-specjalna-dostepnosc.md` |
| służby mundurowe, dyscyplinarka, uposażenie, orzeczenia komisji | `dr-13-sluzby-bezpieczenstwo-informacje-niejawne/SKILL.md` → obowiązkowo właściwy istniejący moduł danej służby (Policja/SG/PSP/ABW-AW/CBA/SKW-SWW/ŻW/obrona) |
| KRUS, renta rolnicza, wypadek rolniczy, podleganie rolnicze | `dr-04-prawo-pracy-zus-swiadczenia/modules/mod-KRUS-rolnicze-ubezpieczenia.md` |
| koszty sądowe, wynagrodzenie biegłych, pomoc prawna, opłaty zawodowe | `dr-12-sadownictwo-prokuratura-zawody-prawnicze/modules/mod-KSCU-koszty-sadowe-i-pomoc-prawna.md` |
| przewlekłość, dostępność sądu, racjonalne dostosowanie, prawo do sądu | `dr-05-prawo-administracyjne-sadowoadministracyjne/modules/mod-ustawa-skargi-przewleklosc-dostep-sadu.md` + `dr-01-ustroj-konstytucyjny-i-zrodla-prawa/modules/mod-USP-ustroj-sadow-powszechnych.md` |

Ścieżki bazowe modułów: konkretne katalogi `modules/` właściwych DR-01–DR-16 wskazane w tabeli powyżej. Nie istnieje wspólny katalog modułów materialnych pod `prawo-polskie-v2`; używaj bezpośrednio katalogu `modules/` właściwego DR.

---

## MODUŁY SHARED — OBOWIĄZKOWE PRZY SPRAWACH BJ–BW

Dołącz odpowiednio do typu sprawy:

```text
view shared/SOCIAL-SECURITY-LAW-STANDARD.md        (ZUS, KRUS, renty)
view shared/DISABILITY-FUNCTIONAL-ASSESSMENT.md    (niepełnosprawność, PFRON)
view shared/EXPERT-OPINION-AUDIT.md                (biegli, opinie)
view shared/DISCIPLINARY-PROCEEDINGS-STANDARD.md   (dyscyplinarki zawodowe)
view shared/JUDICIARY-LEGAL-STANDARD.md            (ustrój sądów, zawody zaufania)
```

---

## DELEGACJA DO ROUTERÓW DZIEDZINOWYCH

Dla prawa polskiego router używa najpierw:
- `prawo-polskie-v2/ROUTING-MAP.md`
- `DR-01–DR-16`

Nie kieruj spraw bezpośrednio do pojedynczych modułów `prawo-polskie-v2`,
jeżeli istnieje właściwy router dziedzinowy DR-01–DR-16.

---

## DODATKOWE ROUTINGI V4

| Frazy / sprawa | Moduł |
|---|---|
| MPZP, WZ, co wolno na działce, lokal pod działalność | `dr-08-samorzad-terytorialny-prawo-lokalne/modules/mod-MPZP-WZ-planowanie-przestrzenne.md` + `dr-09-budownictwo-srodowisko-energia-transport/modules/mod-PrBud-prawo-budowlane.md`; kontrole działalności → `dr-08-samorzad-terytorialny-prawo-lokalne/modules/mod-kontrola-administracji-inspekcje.md` |
| restauracja, warsztat, hurtownia, sanepid, UDT, PSP | `dr-08-samorzad-terytorialny-prawo-lokalne/modules/mod-kontrola-administracji-inspekcje.md`; Sanepid → `dr-10-zdrowie-farmacja-zywnosc-rolnictwo/modules/mod-GIF-GIS-nadzor-farmaceutyczny-sanitarny.md`; PSP → `dr-13-sluzby-bezpieczenstwo-informacje-niejawne/modules/mod-ustawa-PSP-OSP-ochrona-przeciwpozarowa.md` |
| SWZ, parametry techniczne, jedyny produkt, art. 99 PZP | `dr-07-zamowienia-publiczne-fundusze-ue/modules/mod-PZP-opis-przedmiotu-zakaz-znakow-towarowych.md` + `mod-PZP-wykonanie-umowy-compliance.md` |
| odwołanie od decyzji, ponaglenie, WSA | `dr-05-prawo-administracyjne-sadowoadministracyjne/modules/mod-KPA-postepowanie-administracyjne.md` + właściwy `mod-PPSA-*`; pismo → `pisma-procesowe-v3/modules/MOD-ADMIN.md` |
| ITD, SENT, tachograf | `dr-09-budownictwo-srodowisko-energia-transport/modules/mod-ustawa-transport-drogowy-kolejowy-lotniczy-morski.md`; pismo administracyjne → `pisma-procesowe-v3/modules/MOD-ADMIN.md` |
| UOKiK, klauzule, platforma | `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-ustawa-UOKIK-antymonopolowe.md` + `mod-ustawa-prawa-konsumenta.md`; platforma → `dr-11-cyfrowe-cyber-ai-dane-ip/modules/mod-DSA-digital-services-act.md` |
| NIS2, UKE, DSA, incydent cyber | `dr-11-cyfrowe-cyber-ai-dane-ip/modules/mod-KSC-NIS2-cyberbezpieczenstwo-telekom.md`; dane osobowe → `mod-RODO-GDPR-2016-679.md`; przestępstwo → `dr-03-prawo-karne-wykroczenia-egzekucja/modules/mod-KK-art267-269c-cyberprzestepstwa.md` + `mod-KK-KPK-framework-karne.md` |
| URE, OZE, przyłączenie | `dr-09-budownictwo-srodowisko-energia-transport/modules/mod-PrEnergetyczne-URE-OZE.md`; pismo → `pisma-procesowe-v3/modules/MOD-ADMIN.md` |
| upadłość, restrukturyzacja, syndyk | `dr-02-prawo-cywilne-rodzinne-gospodarcze/modules/mod-PrUpad-upadlosc-restrukturyzacja.md` + właściwy `mod-PrRestr-*`; zawód syndyka → `mod-ustawa-doradca-restrukturyzacyjny-zawod.md` |
