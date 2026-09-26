# mod-KRO-rodzinne — indeks bieżący

**Stan operacyjny:** 2026-08-28  
**Źródło kanoniczne:** ELI — Kodeks rodzinny i opiekuńczy, Dz.U. 2026 poz. 236 t.j., status obowiązujący.  
**Powiązana procedura:** aktualny KPC — pobieraj oddzielnie dla konkretnego trybu.

## Funkcja modułu

Ten plik jest indeksem operacyjnym KRO. Treść szczegółowa jest podzielona na osiem plików tematycznych; historia podziału i dawnych zmian nie jest częścią runtime.

## Główne obszary KRO

| Obszar | Zakres operacyjny | Plik |
|---|---|---|
| małżeństwo i prawa/obowiązki małżonków | zawarcie małżeństwa, prawa i obowiązki, ustroje majątkowe | `kro-rodzinne/czesc-01-malzenstwo-ustroj-konkubinat.md` |
| rozwód i separacja | przesłanki, skutki, mieszkanie/eksmisja, nazwisko | `kro-rodzinne/czesc-02-rozwod-separacja-eksmisja.md` |
| podział majątku | relacja KRO–KC–KPC, majątek wspólny i osobisty | `kro-rodzinne/czesc-03-podzial-majatku.md` |
| alimenty | dzieci, krewni, małżonkowie, zakres obowiązku | `kro-rodzinne/czesc-04-alimenty.md` |
| pochodzenie dziecka | macierzyństwo, ojcostwo, uznanie, zaprzeczenie | `kro-rodzinne/czesc-05-pochodzenie-dziecka.md` |
| rodzice i dzieci | władza rodzicielska, kontakty, piecza, reprezentacja | `kro-rodzinne/czesc-06-rodzice-dzieci-wladza-ozss.md` |
| procedura i dowody | właściwość, mediacja, zabezpieczenie, świadkowie, dane osobowe | `kro-rodzinne/czesc-07-procedura-dowody-zmiana-danych.md` |
| strategia i quality gate | routing, źródła urzędowe, kontrola kompletności | `kro-rodzinne/czesc-08-referencje-strategia.md` |
| opieka i kuratela | odrębny moduł tematyczny | `mod-KRO-opieka-i-kuratela.md` |

## Kwalifikator sprawy rodzinnej

```text
1. Ustal relację stron i status małoletnich.
2. Ustal materię: małżeństwo / rozwód / majątek / alimenty / pochodzenie / władza / kontakty / opieka.
3. Ustal tryb KPC i właściwy sąd — nie wyprowadzaj procedury wyłącznie z KRO.
4. Ustal stan prawny na datę zdarzenia oraz stan aktualny.
5. Jeżeli sprawa dotyczy dziecka, jawnie oceń dobro dziecka w zakresie wymaganym przez właściwy przepis.
6. Przy przemocy domowej dołącz DR-03 i właściwe ustawy ochronne; nie zakładaj mediacji jako rozwiązania domyślnego.
```

## Twarde bramki

- **Rozwód:** przed analizą pobierz aktualne przepisy o przesłankach rozwodu, winie, dzieciach, kontaktach, alimentach i mieszkaniu; nie opieraj się na projektach legislacyjnych.
- **Nazwisko po rozwodzie:** termin i organ ustalaj z aktualnego art. 59; nie przechowuj w module historycznych długości terminu.
- **Władza rodzicielska i kontakty:** odróżniaj władzę rodzicielską od kontaktów — ograniczenie jednego nie przesądza automatycznie o drugim.
- **Alimenty:** odrębnie ustal krąg zobowiązanych, przesłanki, usprawiedliwione potrzeby oraz możliwości zarobkowe/majątkowe według aktualnego KRO.
- **Pochodzenie dziecka:** terminy zawite i legitymację procesową pobieraj z aktualnego KRO/KPC dla konkretnego roszczenia.
- **Majątek:** odróżniaj przynależność składnika do majątku wspólnego/osobistego od sposobu rozliczenia nakładów i od samego postępowania działowego.
- **Opieka/kuratela:** używaj dedykowanego modułu; nie mieszaj z władzą rodzicielską.

## Intake minimalny

```text
□ rodzaj sprawy i żądanie
□ data i miejsce zdarzeń rodzinnych
□ dzieci: wiek, miejsce pobytu, aktualne rozstrzygnięcia
□ istniejące orzeczenia/ugody/akty stanu cywilnego
□ majątek i zobowiązania, jeśli relewantne
□ przemoc / ryzyko dla dziecka / potrzeba zabezpieczenia
□ właściwy tryb KPC, sąd i terminy
□ stan prawny właściwy temporalnie
```

## Fresh gate

Przed powołaniem konkretnego przepisu KRO pobierz aktualny tekst ujednolicony ELI/ISAP dla Dz.U. 2026 poz. 236 i sprawdź późniejsze zmiany. Procedurę, opłaty i terminy procesowe weryfikuj oddzielnie w aktualnym KPC/KSCU.
