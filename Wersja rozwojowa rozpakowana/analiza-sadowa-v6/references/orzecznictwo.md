# Orzecznictwo — Zasady Weryfikacji i Cytowania

> ⛔ **UZUPEŁNIENIE O KANONICZNĄ HIERARCHIĘ:** ten plik opisuje WYŁĄCZNIE
> dozwolone źródła i format cytowania. Ocenę **wagi/hierarchii** danego
> orzeczenia (SN 7 sędziów > uchwała SN > wyrok SN > NSA/WSA > SA > SO > SR
> > komentarz) oraz test aktualności linii orzeczniczej wykonuj wyłącznie wg
> pliku kanonicznego, żeby nie utrzymywać dwóch niezależnych ocen wagi:
> ```
> view /mnt/skills/user/shared/ORZECZENIA-HIERARCHIA.md
> ```
> (ten sam plik jest źródłem prawdy dla `analizator-dowodow-v3` i
> `pisma-procesowe-v3` — patrz CHECKLIST-DEDUP.md).

## Dozwolone źródła (wyłącznie te)

| Baza | URL | Zakres |
|------|-----|--------|
| Portal Orzeczeń MS | `orzeczenia.ms.gov.pl` | Sądy powszechne wszystkich instancji |
| Sąd Najwyższy | `sn.pl` | SN — izby cywilna, karna, pracy, kontroli nadzwyczajnej |
| Trybunał Konstytucyjny | `trybunal.gov.pl` | Orzeczenia TK |
| NSA / WSA | `nsa.gov.pl` | Sądownictwo administracyjne |
| SAOS | `saos.org.pl` | Agregator — wyłącznie do weryfikacji krzyżowej |


## Zasady cytowania

**Format obowiązkowy:**
```
[Nazwa sądu, data DD.MM.RRRR, sygnatura akt, URL]
```

**Przykład poprawny:**
```
SR Wrocław, 15.03.2023, VIII W 144/22, orzeczenia.ms.gov.pl
— sąd uznał, że brak dowodu zamiaru kierunkowego wyklucza skazanie.
```

**Ograniczenia:**
- Cytat: **maksymalnie 14 słów** z jednego orzeczenia
- **Jedno cytowanie** na jedno orzeczenie w całej analizie
- Priorytet: orzeczenia nie starsze niż 5 lat (od daty analizy)
- Przy starszych: wskazać, czy linia orzecznicza jest nadal aktualna

## Zakaz cytowania z

- Komentarzy wydawnictw prywatnych (Wolters Kluwer, C.H. Beck) — chyba że weryfikowane w oficjalnej bazie
- Blogów prawniczych, portali prawniczych (Legalis, LEX) — bez weryfikacji w oficjalnym źródle
- Orzeczeń bez sygnatury lub bez daty
- Tez prawnych bez wskazania konkretnego orzeczenia

## Procedura wyszukiwania

### Krok 1: Identyfikacja tez do sprawdzenia
Na podstawie Filtru #1 — dla każdego **spornego znamienia** szukaj odrębnie.

### Krok 2: Zapytania do baz
```
Sekwencja wyszukiwania:
1. orzeczenia.ms.gov.pl → [przepis] + [kluczowe słowo ze spornego znamienia]
2. sn.pl → [jak wyżej]
3. saos.org.pl → weryfikacja krzyżowa znalezionych sygnatur
```

### Krok 3: Weryfikacja orzeczenia
Przed cytowaniem sprawdź:
- Czy orzeczenie jest prawomocne?
- Czy nie zostało zmienione przez instancję wyższą?
- Czy sygnatura i data zgadzają się z treścią?
- Czy teza dotyczy tego samego stanu prawnego (uwaga na nowelizacje)?

### Krok 4: Ocena linii orzeczniczej
Szukaj wzorca, nie pojedynczego orzeczenia. Wskazuj gdy:
- Linia orzecznicza jest jednolita → dodatkowy walor argumentacyjny
- Linia orzecznicza jest rozbieżna → wskaż obie linie
- Brak orzecznictwa w danej kwestii → wskaż expressis verbis

## Przykłady prawidłowego i błędnego cytowania

**POPRAWNIE:**
```
SN, 12.09.2019, II KK 182/19, sn.pl
— sąd wskazał, że zamiar kierunkowy musi być udowodniony bezpośrednio.
```

**BŁĘDNIE (za długi cytat):**
```
„Sąd stwierdził, że zamiar kierunkowy musi być udowodniony bezpośrednio,
a nie domniemany z samego faktu powtarzalności zachowań, gdyż taka wykładnia
prowadziłaby do nadmiernego rozszerzenia kryminalizacji."
```
→ Przekroczono limit 14 słów. Należy sparafrazować lub skrócić.

**BŁĘDNIE (źródło niedozwolone):**
```
Komentarz do KW, red. Bojarski, Wolters Kluwer 2022, art. 107 — „..."
```
→ Komentarz prywatny bez weryfikacji w oficjalnej bazie.

## Specjalne przypadki

### Brak orzecznictwa
Gdy nie ma orzeczeń dotyczących danej kwestii — wskaż to expressis verbis:
```
„Brak zidentyfikowanego orzecznictwa [nazwa sądu] w kwestii [problem].
 Argumentacja oparta wyłącznie na wykładni gramatycznej / systemowej / celowościowej."
```

### Orzecznictwo europejskie
TSUE i ETPC mogą być cytowane gdy mają bezpośrednie zastosowanie:
- TSUE: `curia.europa.eu`
- ETPC: `hudoc.echr.coe.int`
Format jak wyżej: [Sąd, data, sygnatura, URL]
