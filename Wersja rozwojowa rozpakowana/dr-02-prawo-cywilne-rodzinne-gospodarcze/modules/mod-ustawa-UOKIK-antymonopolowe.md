# mod-ustawa-UOKIK-antymonopolowe

**Stan operacyjny:** 2026-08-28  
**Źródło kanoniczne:** ELI — ustawa z 16.02.2007 r. o ochronie konkurencji i konsumentów, Dz.U. 2025 poz. 1714 t.j., status obowiązujący.

## Zakres

Moduł obejmuje publicznoprawną ochronę konkurencji i zbiorowych interesów konsumentów: praktyki ograniczające konkurencję, koncentracje, niedozwolone postanowienia wzorców umów, praktyki naruszające zbiorowe interesy konsumentów, organizację ochrony, postępowanie przed Prezesem UOKiK oraz sankcje.

Nie zastępuje ustawy o zwalczaniu nieuczciwej konkurencji ani indywidualnych roszczeń konsumenta z KC/ustawy o prawach konsumenta.

## Mapa ustawy

| Dział | Zakres | Status |
|---|---|---|
| I | przepisy ogólne | 🟢 B+ / COV |
| II | praktyki ograniczające konkurencję | 🟢 B+ / COV |
| III | koncentracje przedsiębiorców | 🟢 B+ / COV |
| IIIa | niedozwolone postanowienia wzorców umów | 🟢 B+ / COV |
| IV | praktyki naruszające zbiorowe interesy konsumentów | 🟢 B+ / COV |
| V | organizacja ochrony konkurencji i konsumentów | 🟢 B+ / COV |
| VI | postępowanie przed Prezesem UOKiK | 🟢/🟡 B+ |
| VII | kary pieniężne | 🟢/🟡 B+; każda sankcja wymaga fresh gate |
| VIII i przepisy końcowe | odpowiedzialność/przepisy szczególne — kontrola aktualnego tekstu i temporalności |

## Kwalifikator sprawy

```text
1. Czy sprawa dotyczy interesu publicznego/struktury rynku czy indywidualnego sporu?
2. Jeżeli konkurencja: porozumienie, pozycja dominująca czy koncentracja?
3. Jeżeli konsumenci: zbiorowy interes konsumentów / wzorzec umowy czy indywidualne roszczenie B2C?
4. Zdefiniuj rynek właściwy produktowo i geograficznie, jeżeli jest relewantny.
5. Ustal właściwe postępowanie Prezesa UOKiK, środek dowodowy i etap proceduralny.
6. Sankcje, progi obrotowe, terminy i warunki leniency/settlement pobierz z aktualnego tekstu — bez stałych wartości z pamięci.
```

## Praktyki ograniczające konkurencję

Oddziel porozumienia ograniczające konkurencję od nadużywania pozycji dominującej. Samo posiadanie silnej pozycji rynkowej nie jest automatycznie zakazane; ocena naruszenia wymaga zastosowania ustawowych definicji i zakazów do konkretnego rynku i zachowania.

Przy porozumieniu ustal co najmniej: strony, formę koordynacji, cel/skutek, rynek, udział w rynku, możliwe wyłączenie ustawowe oraz dowody kontaktu/uzgodnienia. Przy zmowie przetargowej dodatkowo sprawdź DR-03 i art. 305 KK w aktualnym brzmieniu.

## Koncentracje

Przed zgłoszeniem lub oceną koncentracji ustal:

```text
□ rodzaj koncentracji według ustawy
□ przedsiębiorców uczestniczących
□ aktualne obroty obliczone według ustawowych reguł
□ aktualne progi zgłoszeniowe i wyłączenia
□ moment, przed którym koncentracja nie może zostać dokonana
□ możliwe decyzje: zgoda / zgoda warunkowa / zakaz / inne skutki ustawowe
```

Nie przechowuj w runtime kwot progów — pobieraj je z aktualnego art. 13 i przepisów powiązanych.

## Zbiorowe interesy konsumentów i wzorce

Nie utożsamiaj decyzji Prezesa UOKiK z rozstrzygnięciem indywidualnego sporu konsumenta. Ta sama praktyka może rodzić równolegle publicznoprawne postępowanie UOKiK oraz indywidualne roszczenia cywilne.

## Postępowanie i dowody

Przy postępowaniu przed Prezesem UOKiK ustal dokładnie tryb wszczęcia, stronę, dostęp do akt, zobowiązania przedsiębiorcy, kontrolę/przeszukanie, tajemnicę przedsiębiorstwa, decyzję i właściwy środek zaskarżenia. Nie przenoś automatycznie KPA, jeżeli ustawa zawiera regulację szczególną.

## Sankcje

Kary pieniężne zależą od rodzaju naruszenia, podmiotu, podstawy ustawowej i aktualnych reguł obliczania. Przed podaniem procentu, maksymalnej kwoty, kary dla osoby zarządzającej lub warunków obniżenia kary pobierz właściwe przepisy Działu VII.

## Routing

- nieuczciwa konkurencja między przedsiębiorcami → `mod-ustawa-UZNK-nieuczciwa-konkurencja.md`;
- indywidualny konsument → `mod-ustawa-prawa-konsumenta.md` + `mod-KC-konsumenckie.md`;
- zmowa przetargowa / odpowiedzialność karna → DR-03;
- prawo konkurencji UE → art. 101/102 TFUE i właściwe akty UE w DR-14;
- skarga/odwołanie od decyzji organu → właściwa procedura szczególna + DR-05/16 według trybu.

## Fresh gate

Przed podaniem definicji, progu, terminu, kary, warunku koncentracji albo środka zaskarżenia pobierz aktualny tekst ELI/ISAP dla Dz.U. 2025 poz. 1714 i sprawdź późniejsze zmiany. Przy prawie konkurencji UE użyj EUR-Lex.
