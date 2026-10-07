# Restrukturyzacja — pomoc publiczna i test prywatnego wierzyciela

Źródło: [urzędowy tekst jednolity, Dz.U. 2026 poz. 533](https://api.sejm.gov.pl/eli/acts/DU/2026/533/text.pdf).
Opracowanie na podstawie korpusu pobranego 04.10.2026. Przed zastosowaniem odczytaj
przepis przez `python3 scripts/prrestr.py article NUMER --verify-online` oraz
`references/insolvency/wersje-i-przepisy-przejsciowe.md`. Dobór prawa do sprawy
wymaga dat zdarzeń; data pobrania PDF nie rozstrzyga przepisów przejściowych.
Każdy artykuł i wyjątek pozostaje dostępny w indeksie `references/prrestr/index.json`.

## Rozpoznanie: art. 139a–140

Art. 139a uchylony. Dla publicznego wierzyciela najpierw oceń, czy zmiana
warunków spłaty spełnia przesłanki pomocy publicznej; publiczny charakter
należności sam nie przesądza wyniku. Art. 140 obejmuje test prywatnego
wierzyciela/inwestora. Porównaj rzeczywiste alternatywy, zabezpieczenia,
kolejność, czas i ryzyko odzysku; założenia muszą być weryfikowalne.
Nie zastępuj go testem zaspokojenia art. 10a: cele testów są różne.

## Warunki udzielenia: art. 141–149

| Zakres | Ustalenia wymagane przed propozycją |
|---|---|
| Dopuszczalność i wcześniejsza pomoc — 141 | Rodzaj i daty pomocy, sytuacja przedsiębiorcy, wyjątki i ograniczenia |
| Cel i konieczność — 142–143 | Trwała rentowność, niezbędność i proporcjonalność, alternatywy |
| Udział własny — 144 | Pochodzenie, rzeczywisty charakter i dostępność środków; właściwy próg dla przedsiębiorcy |
| Ograniczenie zakłóceń — 145 | Środki strukturalne/behawioralne/otwarcia rynku oraz reguły małego przedsiębiorcy |
| Usługi ogólnego interesu — 146 | Niezbędność dla ciągłości i ograniczony czas |
| Zmiana pomocy — 147 | Powiązanie kwoty, kosztów, wkładu własnego i środków wyrównujących |
| Notyfikacja/wyłączenie — 148–149 | MŚP, suma pomocy w tym samym procesie, warunki programu i decyzji KE |

Art. 148 przewiduje warunkowe wyłączenie notyfikacji dla MŚP przy łącznej
kwocie do równowartości 10 mln EUR. Sam próg nie wystarcza: wymagane są
warunki 141–147 i 149 oraz właściwe unijne podstawy. Ustal kurs i datę
z przepisu. Nie korzystaj z nieaktualnej decyzji KE lub programu tylko
dlatego, że polska ustawa nadal zawiera odesłanie.

## Integracja z planem i układem

Zbierz historię pomocy/de minimis i decyzje zwrotowe, dane przedsiębiorcy,
plan i testy, stanowiska publicznych wierzycieli, źródła finansowania
oraz właściwe zgody. ZUS ma szczególne granice restrukturyzacji w 160;
zwrot pomocy nakazany przez KE podlega ograniczeniu 156 ust. 4.
Sąd odmawia zatwierdzenia układu naruszającego prawo pomocy (165 ust. 1).

Ustawa o udzielaniu pomocy w celu ratowania/restrukturyzacji przedsiębiorców
jest osobnym aktem: dołącz `mod-ustawa-pomoc-ratowanie-restrukturyzacja-przedsiebiorcow.md`.
Prawo unijne i decyzje KE odczytaj w źródłach UE w sprawie; nie są zastępowane
przez korpus dwóch ustaw. Wynik: kwalifikacja środka, testy, warunki programu,
procedura notyfikacji albo podstawa wyłączenia oraz wpływ na treść układu.
