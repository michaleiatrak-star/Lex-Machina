# POKRYCIE DZIEDZINOWE — Mapa dziedzin → DR-skills

> Wczytuj ten plik tylko gdy potrzebna jest pełna mapa dziedzin z powiązanymi skillami.
> Dla samego routingu wystarczy KROK 1B → prawo-polskie-v2 → ROUTING-MAP.md.
>
> ⚠️ ZASADA ARCHITEKTONICZNA: Treść prawa materialnego mieszka WYŁĄCZNIE w DR-skills (dr-01..dr-16).
> Router nie duplikuje treści — tylko kieruje. Routing odbywa się przez:
> KROK1-detekcja.md → prawo-polskie-v2/ROUTING-MAP.md → DR-skill → moduł aktu.
>
> **Stan operacyjny 2026-08-28:** wszystkie DR-01..DR-16 mają `MAPA-POKRYCIA.md`.
> Każda lokalna `MAPA-POKRYCIA.md` jest jedynym bieżącym źródłem statusu pokrycia dla danego DR.
> Mapy runtime nie przechowują historii dawnych luk ani warstwy baseline/delta.
> Historia zmian należy do audytu/changelogu. Spójność strukturalną wymusza
> `audyt-systemu-v4/scripts/check_coverage_coherence.py`.

| Dziedzina | DR-skill (Primary) | Moduł wejściowy | Rejestr pokrycia | Łącz ze skillem |
|---|---|---|---|---|
| Prawo pracy / ZUS | dr-04 | mod-KP-prawo-pracy.md | dr-04/MAPA-POKRYCIA.md | analizator-dowodow-v3, pisma-procesowe-v3 |
| Mobbing / dyskryminacja | dr-04 | mod-KP-mobbing-dyskryminacja.md | dr-04/MAPA-POKRYCIA.md | analizator-dowodow-v3, pisma-procesowe-v3 |
| Prawo rodzinne | dr-02 | mod-KRO-rodzinne.md | dr-02/MAPA-POKRYCIA.md | pisma-procesowe-v3 |
| Prawo spadkowe | dr-02 | mod-KC-spadki.md | dr-02/MAPA-POKRYCIA.md | analizator-umow-v1 |
| Prawo cywilne / zobowiązania | dr-02 | mod-KC-cywilne-zobowiazania-odpowiedzialnosc.md | dr-02/MAPA-POKRYCIA.md | analizator-umow-v1, analiza-sadowa-v6 |
| Prawo konsumenckie | dr-02 | mod-KC-konsumenckie.md | dr-02/MAPA-POKRYCIA.md | analizator-umow-v1 |
| Administracyjne / KPA | dr-05 | mod-KPA-postepowanie-administracyjne.md | dr-05/MAPA-POKRYCIA.md | pisma-procesowe-v3, orzeczenia-sadowe-v2 |
| ZUS / świadczenia | dr-04 | mod-SUS-ZUS-ubezpieczenia-spoleczne.md | dr-04/MAPA-POKRYCIA.md | pisma-proste-v2, pisma-procesowe-v3 |
| Wykroczenia / mandaty | dr-03 | mod-KW-kodeks-wykroczen.md | dr-03/MAPA-POKRYCIA.md | pisma-proste-v2 |
| Opłaty w sprawach karnych | dr-03 | mod-ustawa-oplaty-w-sprawach-karnych.md | dr-03/MAPA-POKRYCIA.md | pisma-procesowe-v3, pisma-proste-v2 |
| Stalking / nękanie | dr-03 | mod-KK-art190a-stalking.md | dr-03/MAPA-POKRYCIA.md | analizator-dowodow-v3 |
| Przesłuchanie świadków | przesluchanie-swiadkow-v2-min90 | SKILL.md | N/D — capability proceduralne | — |
| Prawo gospodarcze / spółki | dr-02 | mod-KSH-spolki-handlowe.md | dr-02/MAPA-POKRYCIA.md | analizator-umow-v1, analiza-sadowa-v6 |
| Nieruchomości / najem | dr-02 | mod-ustawa-deweloperska.md | dr-02/MAPA-POKRYCIA.md | analizator-umow-v1 |
| Prawo karne | dr-03 | mod-KK-KPK-framework-karne.md → mod-KK-kwalifikator-karnomaterialny.md | dr-03/MAPA-POKRYCIA.md | analiza-sadowa-v6, analizator-dowodow-v3 |
| IP / prawo autorskie | dr-11 | mod-PrAut-wlasnosc-intelektualna-IP.md | dr-11/MAPA-POKRYCIA.md | analizator-umow-v1, pisma-procesowe-v3 |
| RODO / ochrona danych | dr-11 | mod-RODO-GDPR-2016-679.md | dr-11/MAPA-POKRYCIA.md | pisma-procesowe-v3, pisma-proste-v2 |
| Prawo podatkowe | dr-06 | mod-OP-ordynacja-podatkowa.md → następnie właściwy mod-PIT / mod-CIT / mod-VAT według podatku | dr-06/MAPA-POKRYCIA.md | pisma-procesowe-v3, analiza-sadowa-v6 |
| Ubezpieczeniowe | dr-02 | mod-KC-ubezpieczenia.md | dr-02/MAPA-POKRYCIA.md | analizator-umow-v1, pisma-procesowe-v3 |
| Ubezpieczenia obowiązkowe / UFG / PBUK | dr-02 | mod-ustawa-ubezpieczenia-obowiazkowe-UFG-PBUK.md | dr-02/MAPA-POKRYCIA.md | pisma-procesowe-v3, analizator-dowodow-v3 |
| Fundacja rodzinna | dr-02 | mod-ustawa-fundacja-rodzinna.md | dr-02/MAPA-POKRYCIA.md | analizator-umow-v1, pisma-procesowe-v3 |
| Przemoc domowa | dr-03 | mod-KK-art207-przemoc-domowa.md | dr-03/MAPA-POKRYCIA.md | pisma-procesowe-v3 |
| Cyberprzestępczość | dr-03 | mod-KK-art267-269c-cyberprzestepstwa.md | dr-03/MAPA-POKRYCIA.md | analizator-dowodow-v3, pisma-procesowe-v3 |
| Cudzoziemcy / legalizacja | dr-05 | mod-ustawa-cudzoziemcy.md (kanoniczny administracyjny) | dr-05/MAPA-POKRYCIA.md; DR-02 tylko perspektywa prywatno-pracownicza | pisma-procesowe-v3 |
| Prawo medyczne | dr-10 | mod-ustawa-prawa-pacjenta-framework.md | dr-10/MAPA-POKRYCIA.md | pisma-procesowe-v3, analiza-sadowa-v6 |
| Prawo budowlane | dr-09 | mod-PrBud-prawo-budowlane.md | dr-09/MAPA-POKRYCIA.md | pisma-procesowe-v3 |
| Zamówienia publiczne / KIO / PZP | dr-07 | mod-PZP-zamowienia-publiczne-KIO.md | dr-07/MAPA-POKRYCIA.md | pisma-procesowe-v3, analiza-sadowa-v6 |
| Ochrona środowiska | dr-09 | mod-POS-prawo-ochrony-srodowiska.md | dr-09/MAPA-POKRYCIA.md | pisma-procesowe-v3 |
| Windykacja / egzekucja | dr-02 | mod-KPC-egzekucja-windykacja.md | dr-02/MAPA-POKRYCIA.md | pisma-procesowe-v3, pisma-proste-v2, analiza-sadowa-v6 |
| Prawo farmaceutyczne | dr-10 | mod-PrFarm-prawo-farmaceutyczne.md | dr-10/MAPA-POKRYCIA.md | pisma-procesowe-v3 |
| AI Act / prawo AI | dr-11 | mod-AI-Act-framework.md | dr-11/MAPA-POKRYCIA.md | analizator-umow-v1, pisma-procesowe-v3 |
| Chronologia / oś czasu | chronologia-sprawy-v1 | SKILL.md | N/D — capability proceduralne | — |
| Chemikalia / REACH / CLP | dr-10 | mod-REACH-CLP-chemikalia.md | dr-10/MAPA-POKRYCIA.md | pisma-procesowe-v3 |
| Akcyza / cło / celne | dr-06 | mod-ustawa-akcyzowa-i-clo-UCC.md + mod-UCC-clo-taryfa-celna.md | dr-06/MAPA-POKRYCIA.md | pisma-procesowe-v3 |
| Działalność regulowana | dr-08 | mod-kontrola-administracji-inspekcje.md | dr-08/MAPA-POKRYCIA.md | pisma-procesowe-v3 |
| Compliance SWZ/OPZ | dr-07 | mod-PZP-opis-przedmiotu-zakaz-znakow-towarowych.md + mod-PZP-wykonanie-umowy-compliance.md | dr-07/MAPA-POKRYCIA.md | pisma-procesowe-v3 |
| Prawo UE / MPH | dr-14 | mod-TFUE-TUE-prawo-pierwotne-UE.md | dr-14/MAPA-POKRYCIA.md | pisma-procesowe-v3 |
| Compliance / ISO | dr-15 | SKILL.md (routing per norma) | dr-15/MAPA-POKRYCIA.md | pisma-procesowe-v3 |
| Sądownictwo / zawody prawnicze | dr-12 | SKILL.md | dr-12/MAPA-POKRYCIA.md | — |
| Służby / bezpieczeństwo | dr-13 | SKILL.md | dr-13/MAPA-POKRYCIA.md | — |
| Ustrój / Konstytucja | dr-01 | SKILL.md | dr-01/MAPA-POKRYCIA.md | — |
| Samorząd / lokalne | dr-08 | SKILL.md | dr-08/MAPA-POKRYCIA.md | — |

## Zasada odczytu statusu

1. Ten plik odpowiada tylko na pytanie: **gdzie routować temat**.
2. `MAPA-AKTOW.md` odpowiada: **jaki akt i moduł odpowiadają za temat**.
3. Lokalna `MAPA-POKRYCIA.md` odpowiada: **jaki jest aktualny faktyczny poziom pokrycia** i jest jedynym źródłem tego statusu w runtime.
4. Historia zmian nie bierze udziału w routingu ani w ocenie bieżącego pokrycia.
5. Żaden status strukturalny nie zwalnia z fresh hard gate do ELI/ISAP/EUR-Lex przed użyciem przepisu.

## MOSTY DZIEDZINOWE (rejestr — AUDYT-2026-10-04b; przeniesiony z SKILL.md, limit korpusu T17)

Mosty nie zawierają prawa — wskazują kanoniczny moduł DR/shared. Wczytaj most tylko,
gdy KROK 1 wskazał jedną z tych dziedzin, a `prawo-polskie-v2/ROUTING-MAP.md` nie jest
w kontekście; inaczej idź wprost do modułu z ROUTING-MAP.

```text
view prawny-router-v3/references/cyberprzestepstwa.md          → dr-03 (art. 267–269c KK)
view prawny-router-v3/references/kwalifikator-karnomaterialny.md → dr-03 kwalifikator
view prawny-router-v3/references/mobbing-dyskryminacja.md       → dr-04 mobbing/dyskryminacja
view prawny-router-v3/references/przemoc-domowa.md              → dr-03 (art. 207 KK)
view prawny-router-v3/references/przesluchanie-swiadkow.md      → shared/PRZESLUCHANIE-SWIADKOW-KPC.md
view prawny-router-v3/references/stalking-nekanie.md            → dr-03 (art. 190a KK) + shared/STALKING-NEKANIE.md
view prawny-router-v3/references/tryby-scigania.md              → dr-03 tryby ścigania
view prawny-router-v3/references/wykroczenia.md                 → dr-03 KW/KPW
```

Archiwum `references/legacy-material-router/` (8 plików, treść sprzed przeniesienia do DR,
merge `d3385b9`) **usunięte w 3.60 (AUDYT-2026-10-04c, F-226)** — porównanie z modułami
wskazanymi przez mosty: kanon obejmuje treść archiwum (kwalifikator: archiwum v1.0 wobec
v3.0 w DR-03); 4 tematy bez odpowiednika w DR przekazane do FAZY 3E jako F-228 (nie
przeniesione — treść archiwum nie przechodziła T28). Historia: git `main` do `f66715f`.
