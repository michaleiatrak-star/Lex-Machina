# mod-ustawa-prawa-konsumenta

**Stan operacyjny:** 2026-08-28  
**Źródło kanoniczne:** ELI — ustawa z 30.05.2014 r. o prawach konsumenta, Dz.U. 2024 poz. 1796 t.j., status obowiązujący; ELI wskazuje akty zmieniające po tekście jednolitym, więc każda jednostka wymaga fresh gate.

**Rola:** ustawa szczególna wobec ogólnego frameworku konsumenckiego KC. Klauzule abuzywne i ogólna definicja konsumenta pozostają również w aktualnym KC.

## Struktura operacyjna

| Rozdział | Zakres | Status |
|---|---|---|
| 1 | przepisy ogólne i definicje | 🟢 B+ / COV |
| 2 | obowiązki przedsiębiorcy w umowach innych niż na odległość/poza lokalem | 🟢 B+ / COV |
| 3 | obowiązki przy umowach na odległość i poza lokalem | 🟢 B+ / COV |
| 4 | odstąpienie od umowy na odległość/poza lokalem | 🟢 B+ / COV |
| 5 | usługi finansowe zawierane na odległość | 🟡 B+ |
| 5a | umowy zobowiązujące do przeniesienia własności towaru | 🟢 B+ / COV |
| 5b | treści cyfrowe i usługi cyfrowe | 🟢 B+ / COV |
| dalsze przepisy | przepisy szczególne, zmieniające i końcowe — kontrola temporalna |

## Kwalifikator umowy B2C

```text
1. Czy strona jest konsumentem w danej czynności?
2. Czy druga strona działa jako przedsiębiorca?
3. Jaki typ umowy: w lokalu / na odległość / poza lokalem / towar / treść cyfrowa / usługa cyfrowa / finansowa?
4. Jakie informacje przedkontraktowe należało przekazać i kiedy?
5. Czy powstało prawo odstąpienia i czy zachodzi ustawowy wyjątek?
6. Jeżeli problem dotyczy towaru — zastosuj reżim zgodności towaru z umową z Rozdziału 5a.
7. Jeżeli problem dotyczy treści/usługi cyfrowej — zastosuj Rozdział 5b.
8. Oddziel roszczenia z ustawy o prawach konsumenta od klauzul abuzywnych KC i ewentualnej praktyki UOKiK.
```

## Odstąpienie

Nie utrwalaj jednego terminu odstąpienia dla wszystkich konfiguracji. Przed obliczeniem daty końcowej pobierz aktualne przepisy Rozdziału 4 i ustal typ umowy, moment rozpoczęcia terminu, spełnienie obowiązków informacyjnych oraz ewentualny wyjątek ustawowy.

## Towary — zgodność z umową

Przy reklamacji towaru nie opieraj się automatycznie na dawnym modelu rękojmi konsumenckiej z KC. Ustal reżim temporalny i aktualne przepisy Rozdziału 5a dotyczące zgodności towaru z umową, środków naprawczych, obniżenia ceny/odstąpienia oraz terminów odpowiedzialności.

## Treści i usługi cyfrowe

Dla aplikacji, SaaS, subskrypcji, plików cyfrowych i usług online ustal:
- czy świadczenie jest treścią cyfrową czy usługą cyfrową;
- czy konsument płaci cenę czy dostarcza dane osobowe w konfiguracji objętej ustawą;
- zgodność świadczenia z umową;
- aktualizacje, w tym aktualizacje bezpieczeństwa;
- moment i ciągłość dostarczania;
- środki konsumenta przy braku zgodności;
- skutki rozwiązania/odstąpienia dla danych i treści.

## Obowiązki informacyjne

Obowiązki informacyjne zależą od rodzaju umowy i kanału zawarcia. Dla e-commerce kontroluj także sposób prezentacji ceny, kosztów, funkcjonalności/interoperacyjności treści cyfrowych oraz dodatkowe obowiązki wynikające z innych ustaw i prawa UE.

## Rozgraniczenie UOKiK

Indywidualne roszczenie konsumenta z umowy nie jest tym samym co postępowanie Prezesa UOKiK w sprawie zbiorowych interesów konsumentów lub niedozwolonych postanowień wzorców. W razie problemu systemowego dołącz `mod-ustawa-UOKIK-antymonopolowe.md`.

## Dowody

```text
□ zamówienie/umowa/regulamin z daty zawarcia
□ potwierdzenie informacji przedkontraktowych
□ historia zmian regulaminu/ceny
□ dowód dostarczenia towaru/treści/usługi
□ zgłoszenie reklamacyjne i odpowiedź
□ oświadczenie o odstąpieniu i dowód jego wysłania
□ dowody właściwości produktu/usługi i ujawnionych zapewnień
```

## Fresh gate

Przed podaniem terminu, wyjątku od odstąpienia, kolejności środków reklamacyjnych lub skutku prawnego pobierz aktualny tekst ujednolicony ELI dla Dz.U. 2024 poz. 1796 wraz z późniejszymi zmianami. Prawo UE stanowiące tło implementacyjne weryfikuj w EUR-Lex.
