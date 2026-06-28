# mod-wyroby-medyczne — Ustawa o wyrobach medycznych

> **Status:** wydzielony 2026-06-12 z mod-PrFarm-prawo-farmaceutyczne.md (CZĘŚĆ IX)
> jako samodzielny moduł — zgodnie z zasadą "jeden moduł = jeden akt prawny"
> (ustawa o wyrobach medycznych jest ODRĘBNĄ REGULACJĄ od Prawa farmaceutycznego).

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu, artykułu, terminu lub sygnatury:**
1. Zweryfikuj brzmienie i Dz.U. w `isap.sejm.gov.pl`
2. Zweryfikuj orzeczenie w `orzeczenia.ms.gov.pl` / `nsa.gov.pl` / `sn.pl`
3. **NIGDY** nie podawaj artykułu, terminu, kary ani sygnatury wyłącznie z pamięci modelu.

---

## Ustawa o wyrobach medycznych z 7.04.2022 (Dz.U. 2022 poz. 974 — weryfikuj t.j.)

```
Zakres: wyroby medyczne, wyposażenie, systemy i zestawy zabiegowe

Rozporządzenie UE MDR 2017/745: obowiązuje bezpośrednio w Polsce
Rozporządzenie UE IVDR 2017/746: wyroby do diagnostyki in vitro

Organy: Prezes URPL (Urząd Rejestracji Produktów Leczniczych, Wyrobów
        Medycznych i Produktów Biobójczych — rejestr, nadzór), GIF, inspekcja sanitarna
Rejestr wyrobów medycznych: EUDAMED (baza UE) oraz baza krajowa URPL

Klasyfikacja (MDR):
  → Klasa I (niskie ryzyko): samoocena zgodności
  → Klasa IIa, IIb, III (wysokie ryzyko): jednostka notyfikowana (NB)
  → Klasa III + wyroby implantowalne: obowiązkowo jednostka notyfikowana

Ocena kliniczna: obowiązkowa przed wprowadzeniem do obrotu
Zdarzenia niepożądane i incydenty: obowiązek zgłoszenia do Prezesa URPL
  → terminy zgłoszenia zróżnicowane wg powagi incydentu — weryfikuj
    aktualne terminy w MDR art. 87 i wytycznych MDCG przed powołaniem
```

### Obowiązki podmiotów gospodarczych (MDR)

```
WYTWÓRCA:
  → System zarządzania jakością + dokumentacja techniczna
  → Ocena zgodności (samoocena lub z udziałem jednostki notyfikowanej — wg klasy)
  → Oznakowanie CE — wymagane przed wprowadzeniem do obrotu w UE
  → System UDI: przypisanie unikalnego identyfikatora wyrobu + rejestracja w EUDAMED
  → Nadzór po wprowadzeniu do obrotu (PMS) — dla klasy I; okresowe raporty
    o bezpieczeństwie (PSUR) — dla klas IIa/IIb/III
  → Przechowywanie dokumentacji technicznej, deklaracji zgodności i certyfikatów:
    minimalne okresy określone w MDR — weryfikuj aktualne terminy (rzędu 10+ lat,
    dłużej dla implantów)
  → Producenci spoza UE: obowiązek wyznaczenia osoby odpowiedzialnej za zgodność
    regulacyjną (PRRC) lub stały dostęp do takiej osoby

IMPORTER / DYSTRYBUTOR:
  → Odrębne, własne obowiązki weryfikacyjne wynikające z MDR (rozdz. II) —
    kontrola oznakowania CE, dokumentacji, identyfikowalności
  → Weryfikuj aktualny zakres obowiązków w MDR przed powołaniem

EUDAMED:
  → System złożony z 6 modułów (rejestracja podmiotów, rejestracja wyrobów/UDI,
    jednostki notyfikowane i certyfikaty, badania kliniczne, obserwacja/nadzór
    po wprowadzeniu do obrotu, nadzór rynku)
  → Obowiązek stosowania każdego modułu zaczyna się po upływie terminu od
    ogłoszenia jego pełnej funkcjonalności w Dzienniku Urzędowym UE
    (rozp. (UE) 2024/1860, zmiana art. 34 MDR/IVDR) — weryfikuj aktualny status
    modułów: health.ec.europa.eu/medical-devices-eudamed
```

---

## ŁĄCZ Z

- `mod-PrFarm-prawo-farmaceutyczne.md` — gdy sprawa dotyczy jednocześnie
  produktu leczniczego i wyrobu medycznego (np. wyrób medyczny zawierający
  substancję czynną — rozgraniczenie kwalifikacji)
- DR-11 (cyfrowe/RODO) — gdy wyrób medyczny zawiera oprogramowanie z AI
  (→ BAS-W36, AI Act — wyroby medyczne jako systemy wysokiego ryzyka,
  termin 02.08.2027 dla komponentów podlegających odrębnym normom)

---

## QUALITY GATE

```
□ Czy produkt kwalifikuje się jako wyrób medyczny (MDR art. 2) czy jako
  produkt leczniczy (PF art. 2 pkt 32)? — rozgraniczenie kluczowe
□ Jaka klasa ryzyka (I/IIa/IIb/III, implant)? → wymóg jednostki notyfikowanej?
□ Czy wykonano ocenę kliniczną przed wprowadzeniem do obrotu?
□ Oznakowanie CE i UDI przypisane?
□ Rola podmiotu: wytwórca / importer / dystrybutor / upoważniony przedstawiciel
  — czy obowiązki właściwe dla tej roli zostały zidentyfikowane?
□ Producent spoza UE — czy wyznaczono PRRC (osobę odpowiedzialną za zgodność)?
□ Czy zgłoszono zdarzenie niepożądane do Prezesa URPL w aktualnym terminie
  (weryfikuj MDR art. 87 + wytyczne MDCG — terminy zależą od powagi incydentu)?
□ Status modułów EUDAMED zweryfikowany (czy obowiązkowy dla tego zgłoszenia)?
□ Czy wyrób zawiera komponent AI? → sprawdź BAS-W36 (DR-11/DR-04)
```

---

## ŹRÓDŁA WERYFIKACJI

```
isap.sejm.gov.pl       → ustawa o wyrobach medycznych Dz.U. 2022 poz. 974 (t.j.)
eur-lex.europa.eu      → rozp. MDR 2017/745, IVDR 2017/746, rozp. (UE) 2024/1860
health.ec.europa.eu/medical-devices-eudamed → status modułów EUDAMED
gov.pl/web/urpl        → Urząd Rejestracji Produktów Leczniczych, Wyrobów
                          Medycznych i Produktów Biobójczych (rejestr krajowy)
web_search: "ustawa o wyrobach medycznych 2026 nowelizacja aktualny t.j."
web_search: "MDR 2017/745 terminy zgłaszania incydentów MDCG aktualne"
```

---
*mod-wyroby-medyczne.md · dr-10 · 2026-06-12, scalony 2026-06-14*
*Wydzielony z mod-PrFarm-prawo-farmaceutyczne.md CZĘŚĆ IX (06-12).*
*2026-06-14: scalono unikalną treść z mod-ustawa-wyroby-medyczne.md (NOTA-7) —
obowiązki wytwórcy/importera/dystrybutora, UDI, CE-marking, status EUDAMED
po rozp. (UE) 2024/1860; zaktualizowano nazwę organu na URPL (aktualna nazwa
zweryfikowana online 2026-06-14); usunięto niezweryfikowany termin "15-30 dni"
dla zgłoszeń incydentów — zastąpiono odesłaniem do MDR art. 87 + MDCG.
mod-ustawa-wyroby-medyczne.md USUNIĘTY jako duplikat.*
