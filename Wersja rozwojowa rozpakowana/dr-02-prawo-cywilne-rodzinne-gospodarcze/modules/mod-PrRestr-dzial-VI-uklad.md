# Układ — zakres, propozycje, głosowanie, zatwierdzenie i wykonanie

Źródło: [urzędowy tekst jednolity, Dz.U. 2026 poz. 533](https://api.sejm.gov.pl/eli/acts/DU/2026/533/text.pdf).
Opracowanie na podstawie korpusu pobranego 04.10.2026. Przed zastosowaniem odczytaj
przepis przez `python3 scripts/prrestr.py article NUMER --verify-online` oraz
`references/insolvency/wersje-i-przepisy-przejsciowe.md`. Dobór prawa do sprawy
wymaga dat zdarzeń; data pobrania PDF nie rozstrzyga przepisów przejściowych.
Każdy artykuł i wyjątek pozostaje dostępny w indeksie `references/prrestr/index.json`.

## Zakres układu: art. 150–154

Utwórz tabelę wierzytelności według daty powstania, podstawy, zabezpieczenia,
wartości jego przedmiotu i zgód. Art. 150 obejmuje ustawowe wierzytelności
sprzed otwarcia, odsetki po otwarciu, wierzytelności warunkowe oraz zabezpieczone
przeniesieniem własności rzeczy/praw. Dla PZU stosuj właściwy dzień układowy.
Umowy wzajemne: art. 150 ust. 2 wymaga świadczenia podzielnego i obejmuje
spełnioną przed otwarciem część bez otrzymanego świadczenia wzajemnego.

Art. 151 ust. 1 wyłącza wskazane alimenty/renty, roszczenia o wydanie mienia
lub zaniechanie naruszeń oraz określone długi spadkowe. Wierzytelności
pracownicze z ust. 2 wymagają bezwarunkowej, nieodwołalnej zgody najpóźniej
przed głosowaniem. Art. 153: odpowiednie stosowanie do FGŚP; art. 152:
kontrola wcześniejszego układu; art. 154: podmioty/zobowiązania szczególne.

**Korekta po reformie 2025/1085:** zabezpieczenie rzeczowe lub przewłaszczenie
nie oznacza obecnie automatycznego wyłączenia z układu do chwili zgody
wierzyciela. Art. 151 ust. 2a i 3 są uchylone. Wartość zabezpieczonej części
ustal według 150 ust. 3, grupę według 161 ust. 1a pkt 3, a ochronę według
161a. Dla starych spraw najpierw art. 4 nowelizacji; nie mieszaj reżimów.

## Propozycje i grupy: art. 155–163

Uprawnieni do propozycji: 155; sposoby restrukturyzacji i warunki konwersji:
156–159. ZUS: 160 ust. 1 przewiduje raty lub odroczenie, a nie swobodne
umorzenie składek; FGŚP ma odrębne reguły w ust. 4–5. Sprzedaż w wykonaniu
układu likwidacyjnego nie wywołuje skutków sprzedaży egzekucyjnej (159 ust. 2).
Nie przenoś na nią skutków sprzedaży przez syndyka lub zarządcę w sanacji.

Grupy według obiektywnych kryteriów: 161, z obowiązkowym wyodrębnieniem
kategorii z ust. 1a. Sądowe zatwierdzenie podziału, środki zaskarżenia i jego
skutki: ust. 4–7; ten mechanizm nie działa w PZU. Dla zabezpieczonych minimum
zaspokojenia i sposób świadczenia kontroluje 161a, łącznie z potrzebnymi
zgodami na odstępstwa. Art. 162: równe warunki w grupie i ustawowe wyjątki,
163: ochrona pracowników, wierzytelności niepieniężne i pierwszeństwo.
Art. 156 ust. 5 pkt 4 ma wariant przyszły dopiero od 18.02.2027.

## Głosowanie: art. 119

Zasadniczo większość osobowa głosujących z ważnym głosem i co najmniej 2/3
sumy wierzytelności głosujących. Przy grupach oba warunki badaj w każdej
grupie. Wyłączenia od głosowania i kwoty ustal z art. 104–118, nie z samego
saldo księgowego. Nie zastępuj większości osobowej większością kwotową.

Art. 119 ust. 3–6 pozwala przyjąć układ mimo braku większości w niektórych
grupach, ale wymaga ustawowego układu poparcia grup, co najmniej połowy
sumy wierzytelności głosujących i ochrony właściwej kolejności zaspokojenia.
W wariancie ust. 3 pkt 2 popierająca grupa musi należeć do grup z jakimkolwiek
odzyskiem przy wycenie kontynuacyjnej. Ust. 4 chroni sprzeciwiające się grupy
wyższe, gdy niższe dostają zaspokojenie; uwzględnij ust. 5–6. Nie redukuj
tej konstrukcji do dawnego „2/3 ogółem i nie gorzej niż upadłość”.

## Zatwierdzenie: art. 164–165a

Sąd zatwierdza układ. Odrębne są: przyjęcie przez wierzycieli, zastrzeżenia,
kontrola i prawomocność. Zastrzeżenia przeciw układowi w ustawowym tygodniu
(164 ust. 3) muszą spełniać wymagania pisma. Przy zarzucie najlepszego
interesu lub 119 ust. 3 pkt 2 możliwa jest opinia weryfikująca test (164 ust. 3a).

Art. 165 ust. 1: zgodność z prawem (w tym pomoc publiczna) i oczywista
niewykonalność. Ust. 2: zarzut głosującego przeciw wierzyciela, że układ daje
mu gorszą sytuację niż właściwy scenariusz porównawczy. Ust. 3–4: próg sporów
PZU/PPU i wyjątek PPU. Ust. 5–8: brak przyjęcia, obwieszczenia, zażalenie
w terminie dwóch tygodni i prawomocność. Art. 165a dopuszcza ograniczoną
korektę przez sąd; nie jest uprawnieniem do dowolnego przepisania układu.

## Skutki i dalszy nadzór: art. 166–179

Art. 166: związanie układem i wyjątek nieujawnionego nieuczestniczącego
wierzyciela; 167: prawa wobec poręczycieli/współdłużników i zabezpieczeń
na mieniu osób trzecich; 168 uchylony; 169 wpisy/konwersja/zarząd;
170 egzekucje po prawomocnym zatwierdzeniu; 171 nadzór wykonania;
172 stwierdzenie wykonania; 173–175 zmiana; 176–177 uchylenie i zbieg wniosków;
178 wygaśnięcie z mocy prawa; 179 skutki uchylenia lub wygaśnięcia. Dla każdej raty rejestruj termin,
kwotę, wykonanie i dowód. Wykonanie układu nie następuje przez samo
zatwierdzenie, a uchylenie wymaga właściwej procedury.

Wynik: tabela kwalifikacji wierzytelności, grup, porównania odzysku i głosów,
projekt propozycji, zastrzeżenia lub wniosek oraz harmonogram wykonania.
