# Przyspieszone postępowanie układowe i postępowanie układowe

Źródło: [urzędowy tekst jednolity, Dz.U. 2026 poz. 533](https://api.sejm.gov.pl/eli/acts/DU/2026/533/text.pdf).
Opracowanie na podstawie korpusu pobranego 04.10.2026. Przed zastosowaniem odczytaj
przepis przez `python3 scripts/prrestr.py article NUMER --verify-online` oraz
`references/insolvency/wersje-i-przepisy-przejsciowe.md`. Dobór prawa do sprawy
wymaga dat zdarzeń; data pobrania PDF nie rozstrzyga przepisów przejściowych.
Każdy artykuł i wyjątek pozostaje dostępny w indeksie `references/prrestr/index.json`.

## Rozdzielenie trybów

Art. 3: PPU — sporne wierzytelności uprawniające do głosowania nie przekraczają
15%; PU — przekraczają 15%. Oba tryby wymagają zdolności restrukturyzacyjnej,
przesłanek art. 6 i kontroli pokrzywdzenia z art. 8. Dla PU uprawdopodobnij
finansowanie kosztów i zobowiązań po otwarciu. Nie odmawiaj sanacji wyłącznie
na podstawie wielkości sporów.

| Etap | PPU | PU |
|---|---|---|
| Wniosek i załączniki | 227–229; dane, wykaz majątku, spisy, zabezpieczenia, plan, oświadczenia | 265–267; własne wymagania i uprawdopodobnienie finansowania |
| Rozpoznanie, koszty, zabezpieczenie | 230–237 | 268–272; zabezpieczenie i tymczasowe organy |
| Dłużnik i zarząd | 238–239 | 273–274 i odesłania |
| Masa i zobowiązania | 240–256 | 275–276 i odesłania |
| Procesy i egzekucja | 257–260 | 277–279 |
| Spis, plan, głosowanie | 261–264 | 280–282 |

Dla każdego wezwania/rozstrzygnięcia zapisuj właściwy organ, termin i jego
zdarzenie początkowe. Odesłania stosowane „odpowiednio” wymagają ustalenia,
które różnice między trybami wykluczają mechaniczne przeniesienie przepisu.

## Otwarcie i bieżący zarząd

Odczytaj postanowienie i zakres zarządu, osobę nadzorcy, wezwania i obwieszczenie.
Zidentyfikuj czynności zwykłego zarządu i wymagające zgody (art. 39); zgoda rady
wierzycieli z art. 129 jest osobną kontrolą. Zbieraj dane do spisu i aktualizuj
budżet płynności po otwarciu. Nowy kredyt i zabezpieczenie oceniaj również pod
kątem wpływu na wierzycieli i koniecznych zgód.

Art. 247–256 zawierają ograniczenia dotyczące zobowiązań, potrącenia,
zabezpieczeń i wypowiadania umów. Dla każdej czynności określ datę powstania
wierzytelności, wymagalności i zabezpieczenia oraz to, czy jest objęta układem.
Nie utożsamiaj zakazu zaspokajania starych wierzytelności układowych z zakazem
regulowania wszystkich bieżących zobowiązań.

## Spis i głosowanie

PPU: spis i spis sporów, plan oraz dokumenty przed głosowaniem według art. 261.
Zastrzeżenia dłużnika i skutki sporności według art. 262. Nie stosuj bez
sprawdzenia trybu sprzeciwu z PU do uproszczonego spisu PPU.
PU: art. 280 — plan i spis w terminie 30 dni od otwarcia; dokumenty przed
głosowaniem z ustawowym wyprzedzeniem, powiązane z art. 10a i 140.
Spis podlega właściwej procedurze sprzeciwu (91–102).

W obu trybach kontroluj zaktualizowany udział sporów, udział wierzycieli,
podział na grupy, większości i test zaspokojenia. Art. 263–264 i 281–282
wyznaczają zwołanie i zawiadomienia. Zatwierdzenie spisu, głosowanie i sądowe
zatwierdzenie układu są odrębnymi czynnościami.

## Procesy, egzekucja i wyjście

Dopuszczalność procesu nie oznacza dopuszczalności egzekucji. W PU sprawdź
udział nadzorcy i bezskuteczność uznania/ugody bez jego zgody (277).
PPU: ochrona z 259–260; PU: 278–279. Wierzytelności nieobjęte układem oraz
zabezpieczenia wymagają odrębnej oceny, a nie globalnego hasła „wszystko zawieszone”.
Przekroczenie 15% w PPU: art. 326 ust. 1 z art. 165 ust. 3–4; wyjątek przy
ujawnieniu sporów po przyjęciu układu wymaga konkretnych dowodów.

Utrata płynności w PU uruchamia 326 ust. 2. Zakończenie i umorzenie: 324–333;
uproszczony wniosek o upadłość: 334–337. Po zatwierdzeniu układu nie pozostawiaj
sprawy bez harmonogramu spłat i nadzoru wykonania.
