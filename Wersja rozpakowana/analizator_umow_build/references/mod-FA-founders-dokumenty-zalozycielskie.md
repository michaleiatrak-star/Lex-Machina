# MODUŁ J20 — FOUNDERS' AGREEMENT, UMOWA SPÓŁKI/STATUT, REGULAMINY ORGANÓW
## Analizator Umów v1 · Moduł J20 (DOMAIN, lazy-loaded)

> Wczytaj dla: founders' agreement / umowa założycielska (pre- i
> post-formation), umowa spółki cywilnej, umowa spółki handlowej (jawnej,
> partnerskiej, komandytowej, S.K.A., sp. z o.o., PSA), statut (S.A., PSA,
> S.K.A.), regulamin zarządu / rady nadzorczej / rady dyrektorów / walnego
> zgromadzenia, term sheet na etapie pre-seed (bez inwestora zewnętrznego).
>
> **Status:** moduł NOWY — utworzony 2026-06-15, kontynuacja rozbudowy
> DR-02/`mod-KSH-spolki-handlowe` (sekcja "DOKUMENTY ZAŁOŻYCIELSKIE I
> WEWNĘTRZNE", ✅ VER online 2026-06-15).
>
> ⛔ ZAKRES vs MA (mod-MA-transakcje.md): ten moduł obejmuje etap
> ZAŁOŻENIA/FORMACJI spółki — dokumenty PRZED lub PRZY powstaniu spółki
> (founders' agreement pre-formation, umowa spółki/statut jako akt
> założycielski, regulaminy pierwszych organów). Moduł MA obejmuje etap
> POST-FORMATION/TRANSAKCYJNY — SPA (sprzedaż udziałów), SHA (umowa
> wspólników już istniejącej spółki, zwykle przy wejściu inwestora), LOI/
> Term Sheet dla rundy inwestycyjnej. Jeśli sprawa obejmuje OBA etapy
> (np. founders' agreement + planowana runda seed) — wczytaj OBA moduły.
>
> ⛔ ZAKRES vs DR-02/mod-KSH-spolki-handlowe: ten moduł = ANALIZA/REDAKCJA
> KONKRETNEGO DOKUMENTU (klauzule, pułapki, rekomendacje). DR-02/mod-KSH
> = PRZEGLĄD FORM DZIAŁALNOŚCI i kontekst prawny (KSH, odpowiedzialność,
> kapitały minimalne). Dla pytań "jaką formę wybrać" → DR-02. Dla "przeanalizuj
> mi tę umowę spółki / ten statut / ten founders' agreement" → ten moduł.

---

> ⛔ HARD GATE — przed podaniem JAKIEGOKOLWIEK artykułu KSH/KC, terminu,
> wymogu formy weryfikuj w ISAP. Zakaz cytowania z pamięci. Znacznik
> ✅ [VER: źródło, data] obowiązkowy.
>
> ```
> KLUCZOWE AKTY — ZWERYFIKOWANE 2026-06-15:
> KSH — Dz.U. 2024 poz. 18 t.j. ze zm.
>   https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20240000018
> KC (spółka cywilna, art. 860-875; swoboda umów art. 353¹) — Dz.U. 2025
>   poz. 1071 ze zm.
>   https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250001071
> Prawo przedsiębiorców (JDG, CEIDG) — Dz.U. 2025 poz. 1480 t.j.
>   https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250001480
> ```

---

## J20.1 ROUTING WEWNĘTRZNY — KTÓRY DOKUMENT?

| Dokument | Forma prawna | Sekcja |
|---|---|---|
| Founders' agreement (pre-formation, brak spółki) | swoboda umów, forma pisemna rekomendowana | J20.2 |
| Founders' agreement (uzupełniający istniejącą umowę spółki) | jak wyżej | J20.2 |
| Umowa spółki cywilnej | pisemna ad probationem (art. 860 §2 KC) | J20.3 |
| Umowa spółki jawnej/partnerskiej/komandytowej | pisemna / akt notarialny (komandytowa) / S24 | J20.4 |
| Umowa spółki z o.o. / statut PSA (akt założycielski) | akt notarialny / S24 (wzorzec) | J20.5 |
| Statut S.A. / S.K.A. | akt notarialny | J20.5 |
| Regulamin zarządu | forma wg umowy/statutu — zwykle pisemna, uchwała | J20.6 |
| Regulamin rady nadzorczej / rady dyrektorów (PSA monistyczna) | jak wyżej | J20.6 |
| Regulamin walnego zgromadzenia | jak wyżej | J20.6 |

---

## J20.2 FOUNDERS' AGREEMENT — ANALIZA I REDAKCJA

### Charakter prawny

```
✅ VER online 2026-06-15: brak odrębnej regulacji ustawowej — dokument
oparty na swobodzie umów (art. 353¹ KC). NIE jest tożsamy z umową spółki/
statutem: nie tworzy odrębnego podmiotu, nie jest obligatoryjny, może
istnieć obok umowy spółki (regulując kwestie, których strony nie chcą
umieszczać w jawnym dokumencie złożonym do KRS).
```

### Checklist analizy — 9 elementów obligatoryjnych do sprawdzenia

```
1. PODZIAŁ UDZIAŁÓW/AKCJI
   □ procenty/liczby jasno określone, suma = 100%?
   □ zasady ZMIANY podziału (np. przy wejściu nowego foundera, rozwodnieniu)?

2. WKŁADY WSPÓLNIKÓW
   □ pieniężne / niepieniężne (aport) / praca-usługi?
   ⚠️ PSA dopuszcza wkład w postaci pracy/usług na kapitał akcyjny —
     sp. z o.o./S.A. NIE (art. 14 §1 KSH — zakaz aportu w postaci pracy/
     usług dla sp. z o.o. i S.A.; weryfikuj aktualne brzmienie i wyjątki)
   □ wycena wkładów niepieniężnych — kto i jak wycenia?

3. ROLE I OBOWIĄZKI FOUNDERÓW
   □ kto za co odpowiada operacyjnie (CEO/CTO/CMO itd.)?
   □ minimalne zaangażowanie czasowe (full-time / part-time)?
   □ konsekwencje niewykonywania roli (np. utrata niezavestowanych udziałów)

4. VESTING I REVERSE VESTING
   □ okres vestingu (typowo 4 lata) + cliff (typowo 1 rok)?
   □ harmonogram: liniowy / milestone-based / mieszany?
   □ REVERSE VESTING: co się dzieje z NIEnabytymi udziałami przy odejściu
     foundera przed końcem vestingu — odkupienie przez spółkę/pozostałych
     wspólników po jakiej cenie (nominalna? rynkowa?)?
   □ GOOD LEAVER / BAD LEAVER: czy rozróżniono powody odejścia (np. choroba
     vs naruszenie umowy) i różne konsekwencje dla każdego?

5. WŁASNOŚĆ INTELEKTUALNA
   ⚠️ KRYTYCZNE — bez wyraźnego przeniesienia praw IP wytworzonych przez
   founderów PRZED powstaniem spółki (kod, design, marka, know-how) NA
   SPÓŁKĘ, spółka może nie mieć praw do własnego produktu!
   □ czy jest klauzula przeniesienia praw autorskich (pola eksploatacji —
     art. 41 PrAut, weryfikuj) z momentu powstania utworu, nie tylko "na
     żądanie"?
   □ czy uregulowano IP wytworzone PRZED założeniem spółki (tzw.
     pre-existing IP)?
   → przy złożonym IP wczytaj RÓWNIEŻ `mod-J9-ip-prawa-autorskie.md`
     (i `mod-J6-it-konsorcjum.md` SD-1 dla software)

6. WYNAGRODZENIA FOUNDERÓW
   □ czy i od kiedy founderzy pobierają wynagrodzenie?
   □ z jakiego budżetu (np. tylko po pierwszej rundzie inwestycyjnej)?
   □ czy wynagrodzenie wpływa na podział udziałów (np. "sweat equity")?

7. PROCEDURY DECYZYJNE
   □ decyzje zwykłe: większość prosta?
   □ decyzje strategiczne: wymagana zgoda wszystkich / kwalifikowana
     większość — jakie decyzje są "strategiczne" (lista zamknięta)?
   □ prawo weta — dla kogo, w jakich sprawach?

8. ZAKAZ KONKURENCJI PO ODEJŚCIU
   □ okres (zwykle 12-24 mies.), zakres terytorialny i przedmiotowy?
   □ ekwiwalent — czy przewidziany? (przy braku ekwiwalentu klauzula może
     być nieskuteczna lub łatwo podważalna — patrz `zakaz-konkurencji.md`)
   → wczytaj RÓWNIEŻ `references/zakaz-konkurencji.md`

9. MECHANIZMY WYJŚCIA / ROZSTANIA
   □ LOCK-UP: zakaz sprzedaży udziałów przez określony okres od startu?
   □ PRAWO ODKUPU od odchodzącego foundera — cena, termin płatności?
   □ SHOTGUN CLAUSE: jedna strona proponuje cenę za 100%, druga MUSI
     wybrać: sprzedać swoje udziały za tę cenę LUB kupić udziały
     proponującego za tę samą cenę (per-udział) — symetryczny mechanizm
     przy deadlocku
   □ PROCEDURA PRZY DEADLOCKU: rozmowy wewnętrzne → mediacja (neutralna
     strona) → arbitraż/sąd — kolejność i terminy na każdym etapie?
```

### ⚠️ PUŁAPKA PRAWNA — niezamierzona spółka cywilna

```
Jeśli founders' agreement zawierany PRZED rejestracją spółki handlowej
i strony zobowiązują się dążyć do WSPÓLNEGO CELU GOSPODARCZEGO przez
wniesienie WKŁADÓW — dokument może zostać zakwalifikowany jako UMOWA
SPÓŁKI CYWILNEJ (art. 860 KC), niezależnie od nazwy/intencji strony.

SKUTKI niezamierzonej kwalifikacji:
→ SOLIDARNA odpowiedzialność wspólników całym majątkiem (art. 864 KC)
→ każdy "founder" staje się przedsiębiorcą (obowiązek CEIDG, ZUS, VAT)
→ rozwiązanie "spółki cywilnej" wymaga odpowiednich czynności (rozliczenie
  wkładów, majątku wspólnego)

REKOMENDACJA — KLAUZULA WYŁĄCZAJĄCA (wzór do adaptacji):
"Strony zgodnie postanawiają, że niniejsza Umowa nie stanowi umowy spółki
cywilnej w rozumieniu art. 860 i nast. Kodeksu cywilnego i nie tworzy
między Stronami żadnego stosunku spółki, wspólnego przedsięwzięcia w
rozumieniu prawa cywilnego, ani jakiejkolwiek formy współwłasności majątku.
Strony nie wnoszą do żadnego wspólnego majątku wkładów w rozumieniu art. 860
§1 KC."
⚠️ Samo zastrzeżenie NIE jest gwarancją — sąd ocenia rzeczywistą treść
stosunku (czynności faktyczne), nie tylko nazwę/zastrzeżenie. Im bardziej
dokument przypomina substancjalnie umowę spółki (wspólny majątek, wspólne
prowadzenie sprawy, podział zysków), tym wyższe ryzyko reklasyfikacji.
```

### Kolejność dokumentów przy wejściu inwestora (poza zakresem tego modułu)

```
Founders' Agreement (ten moduł)
  → Term Sheet / LOI (runda inwestycyjna) → mod-MA-transakcje.md (MA.2)
  → Umowa inwestycyjna (powoływanie zarządu, prawa nadzorcze inwestora,
    exit plan)
  → SHA — umowa wspólników/akcjonariuszy post-investment → mod-MA-
    transakcje.md (MA.4 — ROFR/ROFO/tag along/drag along)

Jeśli analiza obejmuje PRZEJŚCIE od founders' agreement do SHA — wczytaj
OBA moduły (J20 + MA) i sprawdź SPÓJNOŚĆ postanowień (np. czy vesting
z founders' agreement jest odzwierciedlony w mechanizmach transferu
udziałów w SHA).
```

---

## J20.3 UMOWA SPÓŁKI CYWILNEJ — ANALIZA I REDAKCJA

```
PODSTAWA: KC art. 860-875 (Dz.U. 2025 poz. 1071 ze zm.) ✅ VER 2026-06-15
FORMA: pisemna ad probationem (art. 860 §2 KC) — nieważność formy NIE
  powoduje nieważności umowy, ale utrudnia dowód jej treści

CHECKLIST OBLIGATORYJNA:
□ CEL GOSPODARCZY — jasno określony (art. 860 §1 KC wymaga "wspólnego celu
  gospodarczego")
□ WKŁADY każdego wspólnika — pieniężne / rzeczy / świadczenie usług —
  wycena
□ UDZIAŁ W ZYSKACH I STRATACH (art. 867-868 KC) — domyślnie równy, ale
  można uregulować odmiennie
□ PROWADZENIE SPRAW SPÓŁKI (art. 865 KC) — domyślnie każdy wspólnik ma
  prawo i obowiązek; czy umowa to modyfikuje (np. tylko jeden wspólnik
  prowadzi sprawy)?
□ REPREZENTACJA wobec osób trzecich (art. 866 KC) — domyślnie odpowiada
  zasadom prowadzenia spraw
□ ODPOWIEDZIALNOŚĆ — SOLIDARNA, całym majątkiem (art. 864 KC) — NIE MOŻNA
  jej wyłączyć wobec osób trzecich (skutek erga omnes ograniczeń
  wewnętrznych — tylko między wspólnikami)
□ WYSTĄPIENIE WSPÓLNIKA / ROZWIĄZANIE SPÓŁKI (art. 869-875 KC) — termin
  wypowiedzenia, rozliczenie wkładu, podział majątku wspólnego

⚠️ PUŁAPKA — PRZEKSZTAŁCENIE: gdy biznes rośnie i wspólnicy chcą
ograniczyć odpowiedzialność, częste przekształcenie spółki cywilnej w
spółkę jawną (jeśli przychody netto przekroczą ustawowy próg — obowiązek
przekształcenia w sp. jawną wynika z KSH, weryfikuj aktualny próg w art. 26
§4 KSH) lub w sp. z o.o. — sprawdź czy umowa spółki cywilnej zawiera
postanowienia ułatwiające taką transformację (np. zgoda z góry większości
na przekształcenie).
```

---

## J20.4 UMOWA SPÓŁKI OSOBOWEJ (JAWNA / PARTNERSKA / KOMANDYTOWA / S.K.A.)

```
PODSTAWA: KSH (Dz.U. 2024 poz. 18 t.j. ze zm.) ✅ VER 2026-06-15

CHECKLIST OBLIGATORYJNA wg KSH (elementy minimalne umowy — weryfikuj
dokładną treść art. 25 KSH dla sp. jawnej, analogicznie dla innych):
□ firma i siedziba spółki
□ przedmiot działalności
□ czas trwania spółki (jeśli określony)
□ wkłady każdego wspólnika i ich wartość
□ (sp. komandytowa) suma komandytowa każdego komandytariusza — KLUCZOWE,
  wyznacza górną granicę odpowiedzialności
□ (S.K.A.) wysokość kapitału zakładowego, sposób jego zebrania, nominalna
  wartość akcji

SPECYFIKA SP. PARTNERSKIEJ:
□ określenie WOLNEGO ZAWODU partnerów (art. 87 KSH — katalog zawodów,
  weryfikuj aktualną listę w ISAP)
□ czy umowa przewiduje, że niektórzy partnerzy odpowiadają jak wspólnicy
  spółki jawnej za zobowiązania niezwiązane z wykonywaniem wolnego zawodu
  (art. 95 §2 KSH — weryfikuj)?
□ regulamin wykonywania wolnego zawodu — jeśli wymagany przez ustawę
  zawodową (np. dla adwokatów/radców — DR-12, dla biegłych
  rewidentów/doradców podatkowych — DR-06)

FORMA:
□ sp. jawna/partnerska: pisemna (forma elektroniczna dopuszczalna; S24 —
  uproszczony wzorzec dla sp. jawnej)
□ sp. komandytowa/S.K.A.: AKT NOTARIALNY (lub S24 dla komandytowej —
  weryfikuj aktualną dostępność wzorca)

⚠️ PUŁAPKA — KOMPLEMENTARIUSZ vs KOMANDYTARIUSZ: rozkład ról determinuje
odpowiedzialność. Częsty schemat: sp. z o.o. jako komplementariusz (sama
ponosi nieograniczoną odpowiedzialność, ale jej wspólnicy są chronieni
przez sp. z o.o.) + osoby fizyczne jako komandytariusze (odpowiedzialność
ograniczona do sumy komandytowej) — popularna struktura optymalizacyjna
"sp. z o.o. sp.k." — sprawdź, czy umowa konsekwentnie odzwierciedla ten
podział we wszystkich klauzulach (reprezentacja, podział zysków, wkłady).
```

---

## J20.5 UMOWA SPÓŁKI Z O.O. / STATUT (PSA, S.A., S.K.A.) — AKT ZAŁOŻYCIELSKI

```
PODSTAWA: KSH ✅ VER 2026-06-15

FORMA: AKT NOTARIALNY (art. 157 §2 KSH dla sp. z o.o. — weryfikuj) ALBO
system S24 (wzorzec uproszczony, podpis elektroniczny — ograniczona
elastyczność treści, ale szybsza i tańsza rejestracja)

CHECKLIST OBLIGATORYJNA — elementy minimalne (weryfikuj art. 157 KSH dla
sp. z o.o., art. 304 KSH dla S.A., odpowiednio dla PSA/S.K.A.):
□ firma i siedziba
□ przedmiot działalności (PKD)
□ wysokość kapitału zakładowego (sp. z o.o.: min. 5 000 zł; S.A./S.K.A.:
  min. 100 000 zł) / kapitału akcyjnego (PSA: min. 1 zł — art. 300² §2 KSH,
  weryfikuj)
□ liczba i wartość nominalna udziałów/akcji objętych przez każdego
  wspólnika/akcjonariusza
□ czas trwania spółki (jeśli określony)
□ organy spółki — system dualistyczny (zarząd + RN) vs MONISTYCZNY
  (rada dyrektorów — TYLKO PSA, art. 300⁷³ i n. KSH)

POSTANOWIENIA FAKULTATYWNE — WARTE ROZWAŻENIA PRZY REDAKCJI:
□ ograniczenia zbycia udziałów/akcji (zgoda spółki — art. 182 KSH dla
  sp. z o.o., weryfikuj odpowiedniki dla PSA/S.A.)
□ prawo pierwokupu/pierwszeństwa wspólników (jeśli nie regulowane w
  odrębnym SHA — patrz J20.2/MA.4 o spójności dokumentów)
□ kworum i większości dla uchwał zgromadzenia (czy wyższe niż ustawowe
  minimum dla spraw strategicznych?)
□ uprzywilejowanie udziałów/akcji (co do głosu, dywidendy, podziału
  majątku likwidacyjnego)
□ kadencja i sposób powołania/odwołania członków zarządu/RN
□ wkłady niepieniężne (aport) — opis i wycena; PAMIĘTAJ: sp. z o.o./S.A.
  NIE dopuszczają aportu w postaci pracy/usług (art. 14 §1 KSH — weryfikuj
  wyjątki), PSA — dopuszcza na kapitał akcyjny

⚠️ ZMIANA UMOWY/STATUTU wymaga AKTU NOTARIALNEGO (art. 255 §3 KSH dla
sp. z o.o., art. 430 §1 KSH dla S.A. — weryfikuj) + odpowiedniej większości
na zgromadzeniu + wpisu zmiany do KRS (zmiana skuteczna z dniem wpisu dla
niektórych postanowień — weryfikuj art. 256 §3 KSH).
```

---

## J20.6 REGULAMINY ORGANÓW (ZARZĄD / RADA NADZORCZA / RADA DYREKTORÓW / WALNE)

```
HIERARCHIA: statut/umowa spółki > regulamin organu. Regulamin nie może być
sprzeczny z umową/statutem — w razie kolizji rozstrzyga umowa/statut.

REGULAMIN ZARZĄDU (sp. z o.o., PSA dualistyczna, S.A.):
□ zwykle FAKULTATYWNY — sprawdź, czy umowa/statut NAKAZUJE jego uchwalenie
  i przez KOGO (zarząd samodzielnie / zgromadzenie wspólników / RN)
□ typowa treść: podział kompetencji między członków zarządu, tryb
  podejmowania uchwał zarządu (kworum, większość), zasady reprezentacji
  (czy zgodne z umową/statutem — regulamin NIE MOŻE zmienić zasad
  reprezentacji ustalonych w umowie/KRS!), tryb posiedzeń

REGULAMIN RADY NADZORCZEJ / RADY DYREKTORÓW:
□ sp. z o.o.: RN fakultatywna poza wyjątkami ustawowymi (np. przekroczenie
  progów — weryfikuj art. 213 KSH)
□ S.A.: RN OBLIGATORYJNA (art. 381 i n. KSH)
□ S.K.A.: RN obligatoryjna przy >25 akcjonariuszach (weryfikuj art. 142 KSH)
□ PSA — WYBÓR SYSTEMU w statucie:
  - DUALISTYCZNY: zarząd + RN (jak sp. z o.o./S.A.)
  - MONISTYCZNY: rada dyrektorów łącząca funkcje zarządcze i nadzorcze
    (art. 300⁷³ i n. KSH) — regulamin rady dyrektorów określa podział
    między dyrektorów wykonawczych i niewykonawczych
□ typowa treść regulaminu RN: tryb posiedzeń, kworum, kompetencje
  nadzorcze (zatwierdzanie określonych czynności zarządu — lista czynności
  wymagających zgody RN), delegowanie członków RN do indywidualnego
  nadzoru, zasady wynagradzania członków RN (jeśli nie w statucie)

REGULAMIN WALNEGO ZGROMADZENIA (S.A., PSA z walnym):
□ zwykle fakultatywny — organizacja obrad, sposób głosowania (w tym zdalne/
  korespondencyjne, jeśli statut to dopuszcza), prowadzenie protokołu,
  porządek obrad

QUALITY GATE DLA REGULAMINÓW:
□ czy regulamin jest sprzeczny z umową/statutem (np. inny tryb reprezentacji,
  inne kworum)? → regulamin w tym zakresie BEZSKUTECZNY
□ czy organ uchwalający regulamin ma do tego kompetencję wg umowy/statutu?
□ czy zmiana regulaminu wymaga niższego kworum/formy niż zmiana statutu
  (typowo tak — to jedna z zalet wydzielenia regulacji do regulaminu)?
```

---

## J20.7 MASTER CHECKLISTA — UZUPEŁNIENIE DLA DOKUMENTÓW ZAŁOŻYCIELSKICH

```
Oprócz MASTER CHECKLISTY z mod-J0-routing.md, dla dokumentów tego modułu
sprawdź DODATKOWO:

□ FORMA: czy zastosowano wymaganą formę (akt notarialny / pisemna /
  S24-wzorzec) dla DANEJ formy spółki — niezgodność formy = nieważność
  (art. 73 KC w zw. z przepisami szczególnymi KSH)
□ SPÓJNOŚĆ MIĘDZY DOKUMENTAMI: jeśli istnieje więcej niż jeden dokument
  (umowa spółki + founders' agreement + regulaminy) — czy są SPÓJNE
  (brak postanowień wzajemnie sprzecznych)? W razie kolizji który ma
  pierwszeństwo (zwykle: umowa/statut > founders' agreement w zakresie
  korporacyjnym, ale founders' agreement > umowa/statut w zakresie
  zobowiązań WYŁĄCZNIE między stronami, nieujawnianych w KRS)?
□ REJESTRACJA: czy dokument wymaga wpisu do KRS (umowa/statut — TAK; zmiana
  niektórych postanowień skuteczna z dniem wpisu)? Founders' agreement i
  regulaminy — NIE wpisuje się do KRS (dokumenty wewnętrzne)
□ PODATKI PRZY ZAŁOŻENIU: PCC od umowy spółki (stawka i podstawa — weryfikuj
  aktualne przepisy o PCC w DR-06), opłaty notarialne i sądowe (KRS)
```

---

## ŁĄCZ Z

| Sytuacja | Skill / Moduł |
|---|---|
| Wybór formy działalności / kapitały minimalne / odpowiedzialność | DR-02/`mod-KSH-spolki-handlowe` |
| Status syndyka/restrukturyzacji (jeśli spółka w trudnościach) | DR-02/`mod-PrUpad-upadlosc-restrukturyzacja`, `mod-ustawa-doradca-restrukturyzacyjny-zawod` |
| Runda inwestycyjna / SPA / SHA post-formation | `mod-MA-transakcje.md` |
| Przeniesienie IP (kod, design, marka) na spółkę | `mod-J9-ip-prawa-autorskie.md`, `mod-J6-it-konsorcjum.md` (SD-1) |
| Zakaz konkurencji founderów po odejściu | `references/zakaz-konkurencji.md` |
| PCC od umowy spółki, opodatkowanie form działalności | DR-06 → moduły PIT/CIT/PCC |
| Rejestracja w KRS | DR-02/`mod-ustawa-KRS-rejestr-sadowy` |
| Spór między wspólnikami — pismo procesowe | `pisma-procesowe-v3` |
| Rejestracja JDG / działalność nierejestrowana | DR-02/`mod-KSH-spolki-handlowe` (sekcja "FORMY DZIAŁALNOŚCI") |

---

## WERYFIKACJA ONLINE

```
web_search: "umowa spółki z o.o. elementy obligatoryjne art 157 KSH aktualne"
web_search: "statut spółki akcyjnej elementy art 304 KSH aktualne brzmienie"
web_search: "prosta spółka akcyjna rada dyrektorów regulamin system monistyczny art 300(73) KSH"
web_search: "founders agreement wzór klauzula wyłączająca spółkę cywilną art 860 KC"
web_search: "art 14 KSH zakaz aportu praca usługi sp z o.o. SA wyjątki aktualne"
web_search: "przekształcenie spółki cywilnej w jawną obowiązek przychód art 26 par 4 KSH"
```

---
*MODUŁ J20 / analizator-umow-v1 · utworzony 2026-06-15*
*Prawo weryfikuj ZAWSZE w ISAP · Wzory branżowe (founders' agreement) nie
mają statusu ustawowego — traktuj jako punkt wyjścia, nie wzorzec
normatywny.*
