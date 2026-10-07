# mod-DP — Cyber, AI, DORA/NIS2/eIDAS, dowody cyfrowe i zgodność technologiczna

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
