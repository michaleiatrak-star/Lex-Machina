# mod-KPC-prawomocnosc-granice-apelacji

**Wersja:** 1.0.0 | **Dodano:** 2026-08-14 (NAPRAWA — F-65: raport
zewnętrzny KPC wskazał prawomocność orzeczeń [art. 365-366] i granice
apelacji [art. 378, 382-386] jako krytyczne luki — bez podstawy
prawnej mimo że engine `appellate-v8` [DR-16, `pisma-procesowe-v3`]
DZIAŁA operacyjnie na tych instytucjach, WYKORZYSTUJĄC je bez
posiadania własnego pokrycia merytorycznego w żadnym module DR-.)

> ⛔ HARDGATE — zweryfikuj aktualny t.j. na ISAP przed użyciem w piśmie.
> Akt bazowy: KPC, Dz.U. 2026 poz. 468 t.j.

**Rola w systemie:** KPC jest używany w DR-02, DR-05, DR-12, DR-16 bez
JEDNEGO, kanonicznego miejsca dla podstawowych instytucji procesowych
— ten moduł (obok `mod-KPC-egzekucja-windykacja.md`) zaczyna wypełniać
tę lukę dla dwóch najpilniejszych tematów.

---

## 1. PRAWOMOCNOŚĆ ORZECZEŃ (Dział IV, Rozdział 3, art. 363-366)

```
⭐⭐⭐ ART. 363 §1 — DEFINICJA: orzeczenie STAJE SIĘ prawomocne, JEŻELI
  NIE PRZYSŁUGUJE co do niego ŚRODEK ODWOŁAWCZY LUB inny środek
  zaskarżenia (⭐ prawomocność = WYCZERPANIE zwykłej drogi zaskarżenia,
  NIE to samo co "orzeczenie ostateczne" w innych systemach)

⭐⭐⭐ DWA RODZAJE PRAWOMOCNOŚCI (⭐ rozróżnienie DOKTRYNALNE, nie
  wprost nazwane w ustawie tymi terminami, ale kluczowe dla zrozumienia
  art. 363 vs 365):
  - PRAWOMOCNOŚĆ FORMALNA (art. 363 §1) — orzeczenie NIE MOŻE być już
    zaskarżone zwykłym środkiem — dotyczy SAMEGO orzeczenia
  - PRAWOMOCNOŚĆ MATERIALNA (art. 365 §1) — WYKLUCZENIE możliwości
    PONOWNEGO wystąpienia z POWÓDZTWEM w TEJ SAMEJ sprawie, jeśli
    została już prawomocnie rozstrzygnięta CO DO ISTOTY — UTOŻSAMIANA
    w doktrynie z POWAGĄ RZECZY OSĄDZONEJ (res iudicata, art. 366)

⭐⭐⭐ ART. 364 — TRYB STWIERDZENIA prawomocności (⭐ praktyczne: KIEDY i
  JAK uzyskać formalne potwierdzenie):
  §1: prawomocność orzeczenia STWIERDZA — NA WNIOSEK strony — SĄD I
    INSTANCJI na POSIEDZENIU NIEJAWNYM, A DOPÓKI akta znajdują się w
    sądzie II instancji — TEN sąd. Stwierdzenia dokonuje sąd
    JEDNOOSOBOWO (⭐ nie skład kolegialny, nawet jeśli orzeczenie
    merytoryczne było wydane w składzie 3-osobowym)
  §2: postanowienie w tej sprawie MOŻE wydać TAKŻE REFERENDARZ sądowy
    (⭐ nie tylko sędzia — czynność techniczna, nie merytoryczna)

⭐⭐⭐ ART. 365 §1 — MOC WIĄŻĄCA orzeczenia prawomocnego (⭐ zasięg
  PODMIOTOWY — KOGO wiąże, szerszy niż tylko strony postępowania):
  wiąże NIE TYLKO strony i sąd, który je wydał, LECZ RÓWNIEŻ: INNE
  sądy, INNE organy PAŃSTWOWE i organy administracji PUBLICZNEJ, A W
  WYPADKACH przewidzianych w ustawie — TAKŻE inne OSOBY (⭐ efekt
  "erga omnes" ograniczony do przypadków ustawowych, poza zwykłym
  "inter partes")
  §2: KPK OKREŚLA, w jakim zakresie orzeczenia sądu CYWILNEGO NIE
    WIĄŻĄ sądu w postępowaniu KARNYM (⭐ odesłanie do KPK — moc
    wiążąca NIE jest absolutna między gałęziami prawa)

⭐⭐⭐ ART. 366 — POWAGA RZECZY OSĄDZONEJ (res iudicata) — ⭐⭐⭐ NAJWAŻNIEJSZY
  przepis praktyczny tego modułu, DWA OGRANICZENIA zasięgu (⭐ oba
  MUSZĄ być spełnione, żeby powaga rzeczy osądzonej zablokowała nowe
  powództwo):
  1) OGRANICZENIE PRZEDMIOTOWE: TYLKO co do tego, co W ZWIĄZKU z
     PODSTAWĄ SPORU stanowiło PRZEDMIOT ROZSTRZYGNIĘCIA (⭐ powaga
     rzeczy osądzonej obejmuje SENTENCJĘ wyroku, NIE motywy/
     uzasadnienie — doktryna: motywy pełnią rolę WYŁĄCZNIE pomocniczą;
     ⚠️ jeśli sąd orzekł PONAD żądanie [plus] albo o CZYMŚ INNYM
     [aliud] — powagą objęte jest to, o CZYM RZECZYWIŚCIE
     rozstrzygnięto, nie to, o czym sąd POWINIEN był rozstrzygnąć —
     kwestia sporna w doktrynie, ale dominujące stanowisko orzecznicze
     SN [np. post. V CSK 673/14])
  2) OGRANICZENIE PODMIOTOWE: TYLKO MIĘDZY TYMI SAMYMI STRONAMI (⭐
     nowe powództwo z UDZIAŁEM innej osoby — nawet w tej samej
     sprawie faktycznej — NIE JEST zablokowane powagą rzeczy
     osądzonej z wcześniejszego wyroku)

⭐⭐ ZWIĄZANIE SĄDU WŁASNYM ORZECZENIEM vs POWAGA RZECZY OSĄDZONEJ (⭐
  rozróżnienie doktrynalne, orzecznictwo SN): "moc wiążąca" (art. 365)
  dotyczy ZWIĄZANIA faktem PRAWOMOCNEGO rozstrzygnięcia W INNYCH
  sprawach (np. kwestia PREJUDYCJALNA), podczas gdy "powaga rzeczy
  osądzonej" (art. 366) dotyczy NIEDOPUSZCZALNOŚCI ponownego
  ROZPOZNANIA TEJ SAMEJ sprawy — ⭐ dwa RÓŻNE mechanizmy ochronne,
  często mylone w praktyce
```

---

## 2. GRANICE APELACJI (Dział V, Rozdział 1, art. 378, 380-386)

```
⭐⭐⭐ ART. 378 §1 — ZASADA ZWIĄZANIA GRANICAMI ZASKARŻENIA: sąd
  II instancji ROZPOZNAJE sprawę W GRANICACH apelacji — ⭐⭐⭐
  PRAKTYCZNA KONSEKWENCJA (⭐ NAJCZĘSTSZY punkt formalny do
  sprawdzenia PRZED złożeniem apelacji): apelacja MUSI wprost wskazać,
  czy wyrok I instancji jest zaskarżony W CAŁOŚCI czy W CZĘŚCI —
  CZĘŚĆ wyroku NIEWSKAZANA jako zaskarżona STAJE SIĘ prawomocna I NIE
  MOŻE być objęta kontrolą sądu odwoławczego (⭐ powiązanie z sekcją 1
  wyżej — częściowe zaskarżenie = częściowa prawomocność pozostałej
  części, NATYCHMIAST po upływie terminu apelacji dla tej części)
  §2 — SĄD II instancji BIERZE jednak Z URZĘDU pod uwagę NIEWAŻNOŚĆ
    postępowania (art. 379) — ⭐ JEDYNY wyjątek od związania granicami
    — nieważność bada się ZAWSZE, niezależnie od zarzutów apelacji

⭐⭐ ART. 380 — ROZSZERZENIE ZAKRESU ROZPOZNANIA: sąd II instancji NA
  WNIOSEK strony — MOŻE rozpoznać RÓWNIEŻ postanowienia sądu I
  instancji, które nie podlegały ZASKARŻENIU w drodze ZAŻALENIA, a
  MIAŁY WPŁYW na rozstrzygnięcie sprawy (⭐ mechanizm "wciągnięcia" do
  kontroli apelacyjnej postanowień WPADKOWYCH, np. dowodowych, które
  same nie były zaskarżalne osobno)

⭐⭐ ART. 381 — PREKLUZJA DOWODOWA w postępowaniu apelacyjnym: sąd
  II instancji MOŻE POMINĄĆ nowe fakty i dowody, JEŻELI STRONA MOGŁA
  je POWOŁAĆ w postępowaniu PRZED sądem I instancji, CHYBA że
  POTRZEBA powołania wynikła PÓŹNIEJ (⭐⭐ zasada CO DO ZASADY
  RESTRYKCYJNA wobec "nowości" na etapie apelacji — ale NIE jest to
  zakaz BEZWZGLĘDNY, tylko UPRAWNIENIE sądu do pominięcia, ocena
  ad casum)

⭐⭐⭐ ART. 382 — PODSTAWA ORZECZENIA sądu II instancji: sąd II instancji
  ORZEKA na PODSTAWIE materiału zebranego W POSTĘPOWANIU W I
  INSTANCJI ORAZ W POSTĘPOWANIU APELACYJNYM (⭐ tzw. "APELACJA PEŁNA"
  — sąd II instancji nie jest ograniczony wyłącznie do kontroli błędów
  I instancji, lecz KONTYNUUJE merytoryczne rozpoznanie sprawy na
  całości zebranego materiału — fundamentalna cecha polskiego modelu
  apelacyjnego)

⭐⭐ ART. 383 — ZAKAZ PRZEKSZTAŁCEŃ PODMIOTOWYCH I PRZEDMIOTOWYCH
  ŻĄDANIA: w postępowaniu apelacyjnym NIE MOŻNA rozszerzyć żądania
  pozwu ANI wystąpić z NOWYMI roszczeniami — ⚠️ WYJĄTEK: w RAZIE
  zmiany OKOLICZNOŚCI można żądać, ZAMIAST pierwotnego przedmiotu
  sporu, JEGO WARTOŚCI lub INNEGO przedmiotu (⚠️ dokładne brzmienie
  wyjątku NIE zweryfikowane w tej sesji — punkt startowy)

⭐⭐⭐ ART. 384 — ZAKAZ REFORMATIONIS IN PEIUS (⭐⭐⭐ jeden z
  najważniejszych mechanizmów ochronnych całego postępowania
  apelacyjnego): sąd NIE MOŻE uchylić LUB zmienić wyroku NA NIEKORZYŚĆ
  strony WNOSZĄCEJ apelację, CHYBA że strona PRZECIWNA RÓWNIEŻ wniosła
  apelację (⭐⭐ konsekwencja praktyczna: strona wnosząca JEDYNĄ
  apelację w sprawie ma GWARANCJĘ, że wynik NIE będzie dla niej GORSZY
  niż wyrok I instancji — "nie ma nic do stracenia" składając apelację
  samodzielnie). ⚠️ NIUANSE z orzecznictwa SN (zweryfikowane
  pośrednio): zakaz MOŻE być WYŁĄCZONY wobec rozstrzygnięć
  NIEORZEKAJĄCYCH co do ISTOTY sprawy oraz wobec ROZSTRZYGNIĘĆ O
  KOSZTACH procesu; W POSTĘPOWANIU NIEPROCESOWYM stosowanie zakazu NIE
  PODLEGA generalizacji — zależy od RODZAJU sprawy (np. sprawy
  działowe, zasiedzenie, stwierdzenie nabycia spadku mają odrębne,
  ustalone linie orzecznicze) — ⚠️ punkt startowy do pogłębienia przy
  konkretnej sprawie nieprocesowej

⭐⭐ ART. 385 — ODDALENIE APELACJI: gdy apelacja jest BEZZASADNA — sąd
  ODDALA (⚠️ dokładne brzmienie i szczegóły proceduralne NIE
  zweryfikowane w tej sesji)

⭐⭐⭐ ART. 386 — POZOSTAŁE ROZSTRZYGNIĘCIA sądu II instancji (⭐
  katalog rozstrzygnięć POZA samym oddaleniem/uwzględnieniem —
  KLUCZOWY dla zrozumienia co może zrobić sąd odwoławczy):
  §4 (wzmiankowany w orzecznictwie) — MOŻLIWOŚĆ UCHYLENIA wyroku I
    instancji i PRZEKAZANIA sprawy do PONOWNEGO rozpoznania (⭐
    rozstrzygnięcie KASATORYJNE — ⚠️ dokładne przesłanki KIEDY sąd
    MOŻE/MUSI wybrać uchylenie zamiast merytorycznej zmiany — NIE
    zweryfikowane szczegółowo w tej sesji, punkt startowy) — orzecznictwo
    SN: WYJŚCIE przez sąd II instancji, W TOKU formułowania sentencji
    na podstawie art. 386 §4, POZA granice apelacji I granice
    zaskarżenia (np. uchylenie CAŁOŚCI wyroku, gdy zaskarżono TYLKO
    część) — STANOWI NARUSZENIE zasad z art. 378 (przykład z praktyki
    orzeczniczej SN, III PZ 2/18)

⚠️ ART. 387 (Uzasadnienie) — poza zakresem tej naprawy, punkt startowy.
```

---

## 3. ROZGRANICZENIE

| Temat | Gdzie |
|---|---|
| Egzekucja i windykacja (KPC cz. III) | `mod-KPC-egzekucja-windykacja.md` — NIE duplikować |
| Arbitraż i mediacja (KPC cz. V) | `mod-KPC-arbitraz-mediacja-ADR.md` (DR-02/DR-12) |
| Skarga kasacyjna do SN (KPC Dział Va, art. 398¹-398²¹) | ⚠️ POZA zakresem tej naprawy — nadal bez podstawy prawnej, punkt startowy |
| Skarga na orzeczenie referendarza (KPC Dział Vb, art. 398²²-398²⁴) | Treść ISTNIEJE, ale w `pisma-proste-v2/references/SPH-inne.md` (moduł DRAFTOWANIA pism), NIE w kanonicznym module DR- — ✅ ZWERYFIKOWANE 2026-08-14: to NIE jest realna luka merytoryczna, tylko rozproszenie lokalizacji (patrz F-65, punkt zamknięty jako "fałszywy alarm") |
| Zażalenie (KPC Dział V, Rozdział 2) | ⚠️ POZA zakresem tej naprawy, punkt startowy |
| Wznowienie postępowania CYWILNEGO (KPC Dział VI) | ⚠️ POZA zakresem tej naprawy, punkt startowy — NIE mylić z wznowieniem postępowania ADMINISTRACYJNEGO (DR-05, `mod-KPA-tryby-nadzwyczajne-i-strategia.md`) |

## ŁĄCZ Z

| Sytuacja | Skill / Moduł |
|---|---|
| Pismo: apelacja, wniosek o stwierdzenie prawomocności | `pisma-procesowe-v3` (w tym engine `appellate-v8`, KTÓRY TERAZ ma podstawę merytoryczną dla granic apelacji) |
| Orzecznictwo dot. prawomocności i apelacji | `orzeczenia-sadowe-v2` |

---

## ⚠️ POZOSTAJE DO POGŁĘBIENIA (jawnie oznaczone, poza zakresem tej naprawy)
- Skarga kasacyjna do SN (art. 398¹-398²¹) — całkowicie poza zakresem
  tej naprawy, wciąż bez podstawy prawnej w żadnym module DR-.
- Zażalenie (art. 394 i n.) — poza zakresem.
- Wznowienie postępowania cywilnego (art. 399-416¹) — poza zakresem.
- Dokładne przesłanki wyboru między rozstrzygnięciem merytorycznym a
  kasatoryjnym przez sąd II instancji (art. 386 §2-4 w pełnym
  brzmieniu).
- Wyjątek z art. 383 (zmiana okoliczności — żądanie wartości/innego
  przedmiotu) — dokładne brzmienie niezweryfikowane.
- Zastosowanie zakazu reformationis in peius w postępowaniu
  NIEPROCESOWYM — zależne od typu sprawy, wymaga odrębnej analizy
  przy konkretnym stanie faktycznym.
