# mod-DP — Cyber, AI, DORA/NIS2/eIDAS, dowody cyfrowe i zgodność technologiczna

**Akt:** UODO (ustawa o ochronie danych osobowych) — t.j. Dz.U. 2019 poz. 1781 (zm. po t.j.: 2026/252 od 2026-04-03 — art. 104; 2026/548 od 2026-07-23 — art. 34; 2026/1003 od 2026-10-28 — art. 59, 59a).
**Akt:** KSC (ustawa o krajowym systemie cyberbezpieczeństwa) — t.j. Dz.U. 2026 poz. 20 (zm. po t.j.: 2026/252 od 2026-04-03 — art. 1, 2, 2a, 3, 3a, 4, 5, 5a, 6, 7, 7a, 7b, 7c, 7d, 7e, 7f, 7g, 7i, 7j, 7k; 2026/815 od 2026-07-04 — art. 15, 26, 46; 2026/1003 od 2026-10-28 — art. 26; 2026/1206 [OD 2027-01-11: 2026/1206] — zakres: tekst nowelizacji w ELI).
**Akt:** PKE (Prawo komunikacji elektronicznej) — akt pierwotny, bez t.j.: Dz.U. 2024 poz. 1221.
**Akt:** UUZ (ustawa o usługach zaufania oraz identyfikacji elektronicznej) — t.j. Dz.U. 2024 poz. 1725 (zm. po t.j.: 2026/252 od 2026-04-03 — art. 4, 15, 20a, 21b, 21t, 21u, 30a, 39, 46).
**Akt:** UZNK (ustawa o zwalczaniu nieuczciwej konkurencji) — t.j. Dz.U. 2026 poz. 85.
**Moduł wskazuje przepis i jego funkcję (kwalifikator), nie zastępuje brzmienia.** Kwalifikatory sprawdzone z t.j. w ELI 2026-11-14 (W-1: terminy, progi i kwoty porównane z t.j.).

## Status modułu

Moduł prawa polskiego klasy eksperckiej. Stosować analogicznie do modułów prawa pracy i prawa karnego: intake → akty prawne → procedura → dowody → strategia → ryzyka → orzecznictwo → checklisty → workflow.

## Źródła prawa i kontrola aktualności

Podstawą jest ISAP. Brzmienie przepisu, Dz.U., status aktu, tekst jednolity, nowelizacje i przepisy przejściowe muszą być sprawdzone w ISAP na dzień użycia. LEX/Legalis można użyć pomocniczo, gdy ISAP nie daje bezpośredniego dostępu do aktu albo gdy potrzebny jest komentarz/praktyka.

### Akty do sprawdzenia
- ustawa o krajowym systemie cyberbezpieczeństwa;
- ustawa o krajowym systemie certyfikacji cyberbezpieczeństwa;
- Prawo komunikacji elektronicznej;
- ustawa o usługach zaufania oraz identyfikacji elektronicznej;
- RODO i ustawa o ochronie danych osobowych;
- akty UE: AI Act, DORA, NIS2, eIDAS2, DSA/DMA — sprawdzać w EUR-Lex oraz implementację krajową.

## Zakres spraw
Incydenty cyber, obowiązki podmiotów kluczowych/ważnych, compliance technologiczny, usługi zaufania, podpisy, identyfikacja elektroniczna, cloud, dowody cyfrowe, systemy AI, platformy cyfrowe, zgłoszenia incydentów, odpowiedzialność za naruszenia danych.

## Organy i ścieżki instancyjne
CSIRT, minister właściwy ds. cyfryzacji, UODO, KNF przy DORA, UKE przy komunikacji elektronicznej, sądy cywilne/karne/administracyjne, organy ścigania przy cyberprzestępstwach.

## Intake — pytania obowiązkowe

1. Jaki jest organ, sąd albo podmiot prowadzący sprawę?
2. Czy istnieje decyzja, postanowienie, czynność faktyczna, zaniechanie albo akt wewnętrzny?
3. Jaka jest data doręczenia albo data dowiedzenia się o czynności?
4. Jaki środek prawny jest właściwy i czy termin jeszcze biegnie?
5. Czy sprawa ma komponent karny, cywilny, administracyjny, dyscyplinarny, RODO, UE albo konstytucyjny?
6. Jakie dokumenty pierwotne istnieją, a jakie są tylko relacją strony?
7. Czy występuje tajemnica prawnie chroniona, dane osobowe, informacja niejawna albo ograniczony dostęp do akt?
8. Jaki jest cel klienta: uchylenie aktu, odszkodowanie, zabezpieczenie, dostęp do informacji, wstrzymanie wykonania, odpowiedzialność osoby, dowód do innej sprawy?

## Procedura
Najpierw kwalifikuj: incydent cyber, naruszenie danych, awaria usług, cyberprzestępstwo, problem z podpisem/usługą zaufania, decyzja regulatora albo odpowiedzialność kontraktowa. Następnie sprawdź obowiązek notyfikacji, termin, organ, dowody techniczne i ryzyko równoległych postępowań.

## Dowody
Dowody: logi systemowe, hash, metadane, kopie forensic, SIEM, zgłoszenia incydentu, korespondencja z dostawcą, umowy SLA/DPA, rejestry czynności, polityki bezpieczeństwa, raporty audytu, chain of custody, opinia biegłego IT.

## Strategia procesowa
Strategia: najpierw zabezpieczyć dowody cyfrowe w sposób powtarzalny. Przy incydencie nie składać pochopnych twierdzeń bez raportu technicznego. W sprawach AI wskazać rolę podmiotu: dostawca, importer, dystrybutor, użytkownik/deployer. Przy DORA/NIS2 oddziel obowiązek regulacyjny od kontraktowego.

## Ryzyka
Ryzyka: utrata integralności dowodu, brak chain of custody, nieaktualność implementacji NIS2, konflikt RODO z retencją logów, tajemnica przedsiębiorstwa, outsourcing IT, odpowiedzialność kilku podmiotów, brak jurysdykcji krajowej.

## Orzecznictwo i praktyka
Orzecznictwo: TSUE w danych osobowych i usługach cyfrowych, NSA/WSA w decyzjach UODO i regulatorów, SN/sądy karne w dowodach cyfrowych. Nie używać przykładowych sygnatur bez weryfikacji.

## Checklisty jakości

- ustal aktualny stan prawny w ISAP;
- odróżnij akt powszechnie obowiązujący od aktu wewnętrznego;
- sprawdź właściwość organu i tryb;
- sprawdź termin i sposób doręczenia;
- oznacz ciężar dowodu;
- wskaż fakty kluczowe i fakty niewykazane;
- oddziel zarzuty formalne od materialnych;
- dodaj wnioski dowodowe tylko powiązane z tezami;
- sprawdź możliwość wstrzymania wykonania lub zabezpieczenia;
- sprawdź kolizję z innymi postępowaniami.

## Powiązania shared

- `shared/ISAP-AUDIT-PROTOCOL.md`
- `shared/TEMPORAL-LAW-CHECK.md`
- `shared/LEGAL-KNOWLEDGE-GRAPH.md`
- `shared/CROSS-DOMAIN-CONFLICT-ROUTER.md`
- `shared/POLISH-LAW-MAX-COVERAGE-STANDARD.md`
- `shared/RISK-ASSESSMENT.md`
- `shared/DOWODY-METODOLOGIA.md`

## Uwagi szczególne
Nie tworzyć instrukcji ataku, obchodzenia zabezpieczeń ani ukrywania śladów. Moduł służy do zgodności, obrony prawnej i dowodów.
