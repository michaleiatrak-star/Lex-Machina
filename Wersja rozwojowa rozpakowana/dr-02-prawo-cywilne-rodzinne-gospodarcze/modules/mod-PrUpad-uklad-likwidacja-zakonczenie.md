# Upadłość — układ w postępowaniu upadłościowym (PrUp art. 266a–266f)

**Status:** moduł klasy kancelaryjnej — poziom A / COV-ART (każdy obowiązujący artykuł z zakresu omówiony)
**Źródło:** Prawo upadłościowe — t.j. [Dz.U. 2026 poz. 913](https://api.sejm.gov.pl/eli/acts/DU/2026/913/text.pdf) (ELI DU/2026/913); odesłania do Prawa restrukturyzacyjnego — t.j. [Dz.U. 2026 poz. 533](https://api.sejm.gov.pl/eli/acts/DU/2026/533/text.pdf) (ELI DU/2026/533)
**Weryfikacja:** snapshoty PDF 04.10.2026 (SHA-256 zgodne z `references/{prup,prrestr}/metadata.json`); oba t.j. „obowiązuje” wg ELI 08.10.2026 ✅ [VER: isap_lookup DU/2003/535 → DU/2026/913; DU/2015/978 → DU/2026/533, 2026-10-08]
**Zmiany po t.j.:** PrUp — brak w tym zakresie; PrRestr — DU/2026/1206 (art. 4 ust. 2 pkt 4, od 11.01.2027) i DU/2026/176 (art. 156 ust. 5 pkt 4, od 18.02.2027) — sprawdź, gdy układ stosuje te przepisy odpowiednio.
**ZASADA:** przed powołaniem odczytaj przepisy: `python3 scripts/prup.py article NUMER --verify-online`, `python3 scripts/prrestr.py article NUMER`; reżim nowelizacji 2025/1085 — `references/insolvency/wersje-i-przepisy-przejsciowe.md`.

---

## FAZA 0 — INTAKE

```
□ Kto zgłasza propozycje: upadły / wierzyciel / syndyk (266a ust. 2)?
□ Czy lista wierzytelności jest zatwierdzona? częściowo? jaki udział mają sprzeciwy (266c ust. 3)?
□ Jakie wierzytelności obejmie układ, a jakie nie — skąd zaspokojenie nieobjętych (266b ust. 2)?
□ Poparcie wierzycieli uprawnionych do głosowania nad układem: ≥ 50% sumy? (266c ust. 2)
□ Czy potrzebne wstrzymanie likwidacji (266b)? w jakim zakresie? czy zabezpieczeni wierzyciele
  rzeczowi się sprzeciwiają?
□ Prognoza wykonalności: przepływy, finansowanie, porównanie z likwidacją (dowód
  uprawdopodobnienia z 266c ust. 1)
□ Wierzyciele wyłączeni z głosu w sprawach układu (art. 116 PrRestr — osoby i spółki powiązane)
```

---

## A. Dopuszczalność i propozycje (art. 266a)

W postępowaniu upadłościowym **dopuszczalne jest zawarcie układu** (ust. 1). Propozycje układowe mogą zgłosić **upadły, wierzyciel oraz syndyk** (ust. 2). Treść propozycji, podział na grupy, zakres objęcia i skutki układu — wg PrRestr stosowanego odpowiednio (art. 266f).

## B. Wstrzymanie likwidacji (art. 266b)

```
Wniosek: składa uprawniony do propozycji, RAZEM z propozycjami — o całkowite lub częściowe
  wstrzymanie likwidacji do zatwierdzenia układu (ust. 1)
Niedopuszczalne, gdy propozycje NIE przewidują zaspokojenia wierzytelności nieobjętych układem
  niezwłocznie po zatwierdzeniu i prawomocnym zakończeniu postępowania (ust. 2)
Niedopuszczalne co do przedmiotu obciążonego hipoteką / zastawem / zastawem rejestrowym /
  skarbowym / hipoteką morską, jeżeli sprzeciwi się zabezpieczony wierzyciel; sprzeciw po
  postanowieniu → s.-k. uchyla wstrzymanie w tym zakresie (ust. 3)
S.-k. MOŻE wstrzymać, gdy spełnione przesłanki z 266c ust. 1 (ust. 4)
S.-k. WSTRZYMUJE, gdy spełnione przesłanki z 266c ust. 2 (poparcie ≥ 50%) (ust. 5)
Zakres — wyłącznie niezbędny do wykonania układu (ust. 6)
```
⛔ Samo złożenie propozycji nie zatrzymuje likwidacji — potrzebne postanowienie s.-k. w granicach ust. 2–6.

## C. Zwołanie zgromadzenia wierzycieli (art. 266c)

| Ust. | Przesłanka | Charakter |
|---|---|---|
| 1 | **uprawdopodobnienie**, że układ zostanie przyjęty i wykonany | s.-k. **może** zwołać |
| 2 | wniosek popiera wierzyciel / wierzyciele z łącznie ≥ **50%** sumy wierzytelności uprawnionych do głosowania nad układem | s.-k. **zwołuje** |
| 3 | zgromadzenie po **zatwierdzeniu listy**; przy liście zatwierdzonej częściowo (poza sprzeciwami) — gdy wierzytelności objęte sprzeciwami ≤ **15%** sumy wierzytelności objętych układem | warunek zwołania |

**Większość przyjęcia układu** (art. 119 PrRestr, stosowany przez art. 266f — wg urzędowego t.j. DU/2026/533): większość głosujących wierzycieli, którzy oddali ważny głos, mających łącznie ≥ **2/3** sumy wierzytelności głosujących (ust. 1); przy głosowaniu w grupach — taka większość w każdej grupie (ust. 2), z możliwością przyjęcia mimo braku większości w niektórych grupach na warunkach ust. 3 (cross-class cram-down) — odczytaj pełne brzmienie art. 119 ust. 3 przed zastosowaniem. Próg 50% z art. 266c ust. 2 dotyczy zwołania, nie przyjęcia.

## D. Zakończenie i wynagrodzenie syndyka (art. 266d–266e)

- **Art. 266d:** po **prawomocnym zatwierdzeniu** układu sąd wydaje postanowienie o **zakończeniu postępowania**; art. 362–367 odpowiednio (obwieszczenia, wykreślenie wpisów, odzyskanie zarządu, wydanie majątku i dokumentów, umorzenie procesów syndyka o bezskuteczność) → `mod-PrUpad-zakonczenie-zakaz-karne`.
- **Art. 266e:** wynagrodzenie ostateczne syndyka **może** zostać ustalone wg art. 55 i 58–61 PrRestr (zasady wynagrodzenia zarządcy), jeżeli jest to **korzystne dla syndyka** i **uzasadnione jego zaangażowaniem** w skuteczne zawarcie układu. Elementy z PrRestr (t.j. DU/2026/533): art. 55 — suma pięciu części składowych w granicach od 3- do 208-krotności podstawy wynagrodzenia; art. 58 — wniosek o wynagrodzenie ostateczne w terminie **tygodnia** (spóźnienie → wynagrodzenie w wysokości pobranych zaliczek, możliwe przywrócenie terminu); art. 59 — przy prawomocnym zatwierdzeniu układu kwota nie wyższa niż z art. 55, wypłata do 85% po uprawomocnieniu, reszta po stwierdzeniu wykonania układu; art. 60 — podział między kilku; art. 61 — możliwość ustalenia uchwałą zgromadzenia wraz z uchwałą o układzie. Odpowiednie stosowanie wymaga odczytu tych przepisów na dzień sprawy.

## E. Odesłanie do PrRestr (art. 266f)

W zakresie nieuregulowanym w tytule V do układu i jego skutków stosuje się **odpowiednio Prawo restrukturyzacyjne**; czynności zastrzeżone dla **nadzorcy sądowego lub zarządcy wykonuje syndyk**. Dotyczy m.in. propozycji, grup, głosowania, zatwierdzenia, skutków, zmiany i uchylenia układu → `mod-PrRestr-dzial-VI-uklad`, `mod-PrRestr-dzial-IV-uczestnicy-wierzyciele`.

⛔ Tytuł VI części pierwszej PrUp jest uchylony — dawne rozróżnienie upadłości „likwidacyjnej” i „z możliwością zawarcia układu” nie jest dziś wyborem trybu; obecny układ w upadłości działa wyłącznie przez art. 266a–266f.

---

## TERMINY I PROGI

| Wartość | Znaczenie | Podstawa |
|---|---|---|
| ≥ 50% | poparcie wniosku → obowiązkowe zwołanie zgromadzenia i wstrzymanie likwidacji | art. 266b ust. 5, 266c ust. 2 |
| ≤ 15% | dopuszczalny udział wierzytelności objętych sprzeciwami przy częściowo zatwierdzonej liście | art. 266c ust. 3 |
| ≥ 2/3 + większość głosujących | przyjęcie układu | art. 119 PrRestr przez art. 266f |
| tydzień | wniosek o wynagrodzenie ostateczne (odpowiednio art. 58 PrRestr) | art. 266e |

## PUŁAPKI

- Wstrzymanie likwidacji bez zapewnienia zaspokojenia wierzytelności nieobjętych układem jest niedopuszczalne (266b ust. 2).
- Sprzeciw wierzyciela zabezpieczonego rzeczowo wyłącza wstrzymanie co do jego przedmiotu, także po wydaniu postanowienia (266b ust. 3).
- Przed zatwierdzeniem listy zgromadzenia nie zwołuje się, chyba że sprzeciwy ≤ 15% (266c ust. 3).
- Art. 266e to możliwość, nie automatyczna premia — wymaga korzyści dla syndyka i uzasadnienia jego zaangażowaniem.
- Funkcje nadzorcy/zarządcy z PrRestr pełni syndyk — nie ustanawia się nadzorcy (266f).

## POWIĄZANIA

- Lista wierzytelności i sprzeciwy → `mod-PrUpad-wierzytelnosci-235-266`
- Likwidacja masy (art. 306 i n.) → `mod-PrUpad-syndyk-likwidacja`
- Zgromadzenie wierzycieli (art. 191–200) → `mod-PrUpad-organy-procedura`
- Skutki zakończenia (art. 362–367) → `mod-PrUpad-zakonczenie-zakaz-karne`
- Układ w PrRestr → `mod-PrRestr-dzial-VI-uklad`, `mod-PrRestr-dzial-IV-uczestnicy-wierzyciele`

## WYNIK

Propozycje układowe z zakresem objęcia i źródłem zaspokojenia nieobjętych, wniosek o wstrzymanie likwidacji z zakresem niezbędnym (266b), rachunek poparcia i sprzeciwów (266c), kalkulacja większości (art. 119 PrRestr) i — po zatwierdzeniu — wniosek o zakończenie (266d) oraz ewentualnie o wynagrodzenie syndyka (266e).
