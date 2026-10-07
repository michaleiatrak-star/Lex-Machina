# Upadłość — organy, wierzyciele i wspólna procedura

Źródło: [urzędowy tekst jednolity, Dz.U. 2026 poz. 913](https://api.sejm.gov.pl/eli/acts/DU/2026/913/text.pdf).
Opracowanie na podstawie korpusu pobranego 04.10.2026. Przed zastosowaniem odczytaj
przepis przez `python3 scripts/prup.py article NUMER --verify-online` oraz
`references/insolvency/wersje-i-przepisy-przejsciowe.md`. Dobór prawa do sprawy
wymaga dat zdarzeń; data pobrania PDF nie rozstrzyga przepisów przejściowych.
Każdy artykuł i wyjątek pozostaje dostępny w indeksie `references/prup/index.json`.

## Kompetencje: art. 149–188

Sąd upadłościowy, sędzia-komisarz i jego zastępca mają różne kompetencje.
Wypisz je z postanowienia i przepisów, wraz z regułami zastępstwa.
Syndyk: art. 156–178 — kwalifikacje i konflikt interesów, ustanowienie,
obowiązki, odpowiedzialność, sprawozdania, wynagrodzenie i odwołanie.
Szczegółowe czynności → `mod-PrUpad-syndyk-likwidacja.md`.
Nie używaj dawnych przepisów o nadzorcy/zarządcy z uchylonych 179–184
jako podstawy aktualnego postępowania likwidacyjnego. Uczestnicy: 185–188.

## Zgromadzenie i rada: art. 189–213

Ustal podstawę zwołania zgromadzenia, podmioty uprawnione do udziału,
wartość głosów, wyłączenia, quorum i większość dla konkretnej uchwały.
Wierzytelność na liście nie zawsze daje prawo głosu w każdej sprawie.
Dla rady ustal sposób ustanowienia, skład, zastępców, powiązania,
tryb podejmowania uchwał, kontrolę uchwał i uprawnienia sędziego-komisarza.

Czynności z art. 206 wymagają właściwej zgody; art. 213 reguluje wykonywanie
kompetencji przy braku rady lub jej bezczynności w ustawowym zakresie.
Zgoda rady, zgoda sędziego i decyzja syndyka nie są zamienne.
Przy sprzedaży, prowadzeniu przedsiębiorstwa, zaciąganiu zobowiązań,
ugodzie lub uznaniu roszczenia sprawdź katalog, wyjątki i właściwą formę.

## Pisma, akta, doręczenia: art. 214–234

Dane i umocowanie, wymogi KRZ (216a i dalsze), ustawowe wyjątki papierowe
(216aa–216ab), akta i doręczenia, obwieszczenia oraz bieg terminów.
Nie odrzucaj papierowego pisma bez zbadania uprawnienia uczestnika do wyjątku.
Nie licz terminu zawsze od e-maila ani od samego pojawienia się dokumentu
w systemie — ustal właściwe zdarzenie prawne.

Dla każdego postanowienia sprawdź szczególną zaskarżalność, legitymację,
termin, właściwy sąd i wpływ środka na wykonalność. Art. 229 odsyła do KPC
z wyłączeniami; najpierw przepis szczególny. Odczytaj przepisy o kosztach
(230 i dalsze), nie myl ich z kategoriami art. 342.

## Wariant konsumencki

Najpierw art. 491¹–491² i treść postanowienia. Wyłączenie przepisów o
sędzim-komisarzu/radzie/liście w trybie uproszczonym oznacza inny rozkład
kompetencji; nie twórz brakującego organu ani zgody przez analogię.
Możliwe przejście do zasad ogólnych wymaga przewidzianego rozstrzygnięcia.

## Wynik

Macierz organ–czynność–podstawa–zgoda–środek zaskarżenia, rejestr doręczeń,
kalendarz, wykaz dokumentów i braków. Dla nieustalonego zdarzenia początkowego
pokaż brak dowodu i możliwe warianty terminu, zamiast jednej pozornej daty.
