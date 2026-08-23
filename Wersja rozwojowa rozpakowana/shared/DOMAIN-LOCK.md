# DOMAIN-LOCK — bramka izolacji dziedzinowej (kontrola na WYJŚCIU)

> **Plik:** `/mnt/skills/user/shared/DOMAIN-LOCK.md`
> **Wersja:** 1.0 (2026-08-23)
> **Status:** KANONICZNY — hard gate, wykonywany PRZED wysłaniem każdej
> odpowiedzi zawierającej analizę prawną.
> **Konsumenci:** `prawny-router-v3/references/SELF-CHECK.md`,
> `pisma-procesowe-v3` (W3), `analiza-sadowa-v6`, `analizator-dowodow-v3`,
> `przewodnik-prawny-v2`.

## Powód powstania

Test 5 pilotażu LEX MACHINA (sprawa B2B: przedawnienie i odsetki od
niezapłaconych faktur). System poprawnie sklasyfikował sprawę jako cywilną,
przeprowadził tor cywilny — i **dołożył kwalifikację z art. 286 KK
(oszustwo) bez jednego faktu ją uzasadniającego**, bez wczytania dr-03
i bez weryfikacji przepisu.

Diagnoza przyczyny (audyt 2026-08-23): istniejąca bramka w
`prawny-router-v3/references/SELF-CHECK.md` brzmiała *„Sprawa karna →
wczytałem mod-N-karne.md → mod-N zdecydował: kwalifikator TAK/NIE?"*.
Jest **kluczowana wejściem** — klasyfikacją sprawy w KROKU 1. W sprawie
zaklasyfikowanej jako cywilna odpowiedź na to pytanie brzmi „to nie jest
sprawa karna", checkbox zamyka się PUSTO, a przepis KK w treści odpowiedzi
przechodzi bez żadnej kontroli. Bramka kluczowana wejściem jest z definicji
ślepa na kontaminację powstałą PO klasyfikacji.

## ZASADA

> ⛔ Klasyfikacja dziedzinowa dokonana na WEJŚCIU nie kontroluje tego, co
> faktycznie znalazło się w WYJŚCIU. DOMAIN-LOCK skanuje **treść własnej
> odpowiedzi** i porównuje ją z ustalonym PRIMARY.

Kontaminacja dziedzin to błąd skojarzeniowy: model przechodzi od faktu
(dług) do sąsiedniej instytucji z innej dziedziny (oszustwo), bo są
powiązane semantycznie — nie dlatego, że materiał sprawy to uzasadnia.
Najczęstsze pary: dług → oszustwo · zwolnienie → mobbing · spór o granicę →
zniszczenie mienia · nieprawidłowa faktura → KKS · konflikt rodzinny →
znęcanie · przetarg → zmowa przetargowa.

## PROCEDURA — wykonaj PRZED wysłaniem odpowiedzi

```
DL-1  Odczytaj PRIMARY ustalony w KROKU 1 routera (dziedzina wiodąca).

DL-2  Przeskanuj WŁASNĄ, gotową odpowiedź pod kątem powołań spoza PRIMARY.
      Skanuj po nazwach aktów, nie po temacie:
        KK · KKS · KW · KPK · KPW · "przestępstwo" · "wykroczenie" ·
        "odpowiedzialność karna" · "zawiadomienie o możliwości popełnienia"
      — a przy PRIMARY karnym analogicznie: KC/KP/KPA w roli dołożonej.

DL-3  Trafienie? → zadaj TRZY pytania. Każde musi mieć odpowiedź TAK:
      (a) Czy w materiale sprawy jest KONKRETNY FAKT wypełniający znamię,
          nie samo skojarzenie tematyczne?
          ⛔ "nie zapłacił" NIE jest faktem wskazującym na zamiar
             wprowadzenia w błąd w chwili zawierania umowy
          ⛔ "zachowywał się konfliktowo" NIE jest faktem wskazującym
             na znęcanie
      (b) Czy w TEJ odpowiedzi wczytano właściwy skill dziedzinowy
          (dla karnego: dr-03 → mod-KK-KPK-framework-karne.md, a gdy
          mod-N wskaże TAK — mod-KK-kwalifikator-karnomaterialny.md)?
      (c) Czy przepis przeszedł pełną weryfikację wg
          `shared/PRAWO-HARDGATE.md` w TEJ odpowiedzi?

DL-4  Którekolwiek NIE → ⛔ USUŃ powołanie z odpowiedzi. Bez wyjątku.
      Nie osłabiaj sformułowania, nie dopisuj "potencjalnie", nie
      przenoś do sekcji "warto rozważyć" — USUŃ.

DL-5  Chcesz zasygnalizować możliwy wątek z innej dziedziny mimo braku
      podstawy faktycznej? Jedyna dopuszczalna forma — BEZ numeru
      przepisu i BEZ nazwy typu czynu:
        "Materiał nie zawiera faktów uzasadniających wątek karny.
         Gdyby pojawiły się okoliczności wskazujące na [opis faktyczny,
         np. wprowadzenie w błąd co do zamiaru zapłaty już przy zawieraniu
         umowy] — sprawa wymagałaby osobnego przejścia przez dr-03."
      ⛔ ZAKAZ podania numeru artykułu w tej formie. Numer przepisu bez
      podstawy faktycznej sugeruje klientowi ścieżkę, której nie ma.

DL-6  Sprawa RZECZYWIŚCIE wielowątkowa (fakty na obie dziedziny)?
      → NIE dokładaj wątku doraźnie. Wróć do
        `shared/CROSS-DOMAIN-CONFLICT-ROUTER.md` i ustal procedurę
        dominującą + moduły pomocnicze zgodnie z tabelą.
```

## SELF-CHECK (jedna linia do checklisty routera)

```
□ [DOMAIN-LOCK] Czy odpowiedź zawiera przepis spoza PRIMARY (KK/KKS/KW/KPK/KPW
  przy torze cywilnym lub odwrotnie)?
    NIE → OK
    TAK → DL-3 (a)+(b)+(c) wszystkie TAK? → zostaw
          którekolwiek NIE → USUŃ powołanie (DL-4) lub przeformułuj wg DL-5
```

## Skutki naruszenia

Kwalifikacja karna dopisana bez podstawy faktycznej to nie kosmetyka.
W trybie LAIK sugeruje osobie ścieżkę zawiadomienia do prokuratury,
która zostanie umorzona, a przy złej wierze naraża ją na art. 234 KK.
W trybie PRAWNIK trafia do pisma i podważa wiarygodność całego wywodu.
Traktuj tak samo jak halucynację przepisu.
