---
name: orzeczenia-sadowe-v2
description: >
  Wyszukuje, weryfikuje i cytuje realne orzeczenia sądowe z oficjalnych polskich
  portali prawnych (orzeczenia.ms.gov.pl, sn.pl, nsa.gov.pl, trybunal.gov.pl,
  saos.org.pl). Stosuj ZAWSZE gdy użytkownik pyta o orzecznictwo, wyroki,
  judykaturę, linię orzeczniczą, precedensy lub podobne sprawy sądowe — nawet
  jeśli nie używa tych słów wprost. Stosuj też gdy użytkownik chce wzmocnić
  pismo procesowe orzecznictwem lub potrzebuje podstawy orzeczniczej do
  argumentacji prawnej. Nigdy nie cytuj orzeczeń z pamięci — ten skill zawsze
  weryfikuje orzeczenia online przed podaniem sygnatury i nazwy sądu.
  NIE stosuj gdy użytkownik pyta tylko o przepisy prawa bez orzeczeń.
  v2: interaktywny widget z trybem laik/prawnik, wskaźnik pokrycia przesłanek,
  system alertów per orzeczenie, podział linii 3A/3B, linki wyłącznie do
  oryginalnych źródeł otwieranych w nowym oknie.
---

# Wyszukiwanie Orzeczeń Sądowych v2

Narzędzie procesowe dla pełnomocników, sędziów i stron działających pro se.
Łączy interaktywny widget HTML (tryb laik / prawnik) z weryfikowanym
wyszukiwaniem orzeczeń, wskaźnikiem pokrycia przesłanek i systemem alertów.

## Sekwencja działania (zawsze w tej kolejności)

1. **Wyświetl widget interaktywny** — patrz: sekcja Widget poniżej
2. **Emituj profil ryzyka** — alerty wstępne przed wyszukiwaniem (Faza 0-A)
3. **Ustal przesłanki i zakres** — przepis, znamiona, ciężar dowodu (Faza 0-B)
4. **Wyszukaj orzeczenia** — portale priorytetowe, 4 kroki (Faza 1)
5. **Skategoryzuj z alertami** — taksonomia 7 kategorii (Faza 2)
6. **Zweryfikuj aktualność linii** — jednolitość, zmiany prawa (Faza 3)
7. **Wygeneruj raport końcowy** — wskaźnik pokrycia, rekomendacje (Faza 4)
8. **Wyświetl widget ponownie** — z kompletnymi danymi z Faz 1–4

---

## Widget interaktywny

Uruchom widget opisany w `references/widget.md`.

Widget zawiera 5 zakładek:
- **Profil ryzyka** — alerty wstępne dla sprawy w trybie laik lub prawnik
- **Przesłanki** — pasek pokrycia per przesłanka i rozkład ciężaru dowodu
- **Orzeczenia** — pełna sygnatura, sąd z izbą, data, link do oryginału w nowym oknie
- **Alerty** — katalog aktywnych ostrzeżeń per orzeczenie z wyjaśnieniami
- **Raport** — wskaźnik pokrycia, ocena linii orzeczniczej, kolejność powołania

Przełącznik **LAIK / PRAWNIK** w nagłówku zmienia język alertów, tez i rekomendacji jednocześnie we wszystkich zakładkach.

Kod widgetu: patrz `references/widget.md` — wklej jako argument `widget_code` narzędzia
`show_widget`, podstawiając dane konkretnej sprawy w miejsca oznaczone `<!-- DANE: ... -->`.

Widget wywołujesz **dwukrotnie:**
- przed wyszukiwaniem — z danymi Fazy 0-A i 0-B, komunikat „Trwa wyszukiwanie…" w zakładkach Orzeczenia i Raport
- po wyszukiwaniu — z kompletnymi danymi wszystkich faz

---

## Zasady fundamentalne

**Zasada 1 — Zakaz cytowania z pamięci:**
Każde źródło weryfikujesz online przez web_search i web_fetch.
Sygnaturę, datę i sąd podajesz WYŁĄCZNIE po weryfikacji online.
Jeśli nie możesz zweryfikować: „Nie odnalazłem tego źródła online. Nie powołuję."

**Zasada 2 — Cztery obowiązkowe elementy każdego orzeczenia:**
```
[1] SYGNATURA — pełna, np. II PK 123/22
[2] DATA      — dzień-miesiąc-rok, np. 15 marca 2023
[3] SĄD       — pełna nazwa + izba/wydział
[4] URL       — link do oryginału w oficjalnym portalu, nowe okno
```
Brak któregokolwiek = błąd krytyczny, orzeczenie nie może być powołane.

**Zasada 3 — Limit cytatu: maksymalnie 30 słów.**

**Zasada 4 — Link wyłącznie do oryginału.**
Zakaz linkowania do LexLege, Prawo.pl, SIP itp. jako głównego źródła.

**Zasada 5 — Jedno wiarygodne oficjalne źródło wystarczy.**
Orzeczenie jest uznane za zweryfikowane gdy potwierdzone w co najmniej JEDNYM
z portali: sn.pl, orzeczenia.ms.gov.pl, orzeczenia.nsa.gov.pl, trybunal.gov.pl,
curia.europa.eu (TSUE), hudoc.echr.coe.int (ETPC).
saos.org.pl pełni rolę wsparcia — nie jest samodzielnym źródłem weryfikacji.
Nie wymagaj potwierdzenia w wielu portalach jednocześnie.

**Zasada 6 — Status „Źródło niepotwierdzone w portalu sądowym".**
Gdy orzeczenie pojawia się w wynikach wyszukiwania, ale nie można uzyskać
bezpośredniego URL z oficjalnego portalu sądowego:
  → Oznacz statusem: „Źródło niepotwierdzone w portalu sądowym"
  → NIE używaj określenia „niezweryfikowane"
  → NIE powołuj w piśmie procesowym bez potwierdzenia URL
  → Poinformuj użytkownika że weryfikacja bezpośrednia nie była możliwa

**Zasada 7 — Hierarchia portali (TSUE i ETPC jako pełnoprawne źródła):**
```
Tier 1 (krajowe): sn.pl · orzeczenia.ms.gov.pl · orzeczenia.nsa.gov.pl · trybunal.gov.pl
Tier 2 (UE/EU):  curia.europa.eu · hudoc.echr.coe.int
Tier 3 (backup): saos.org.pl (wyłącznie pomocniczo)
```
Orzeczenia TSUE i ETPC mają status równoważny z Tier 1 dla materii objętej prawem UE
lub Konwencją. Kategoria 5 (UE/TSUE) obejmuje teraz również orzeczenia ETPC.

---

## Faza 0-A — Profil ryzyka

Przed wyszukiwaniem emituj alerty wstępne — każdy w dwóch wariantach:

```
ALERT WSTĘPNY [WYSOKI / ŚREDNI / NISKI]
Dla laika:    [prosty język — co oznacza i co zrobić]
Dla prawnika: [procesowy — przepis, termin, ryzyko]
```

---

## Faza 0-B — Przesłanki i ciężar dowodu

```
RODZAJ POSTĘPOWANIA: [...]
KLUCZOWY PRZEPIS:    [np. art. 52 § 1 pkt 1 KP]
INSTYTUCJA PRAWNA:   [...]

PRZESŁANKI:
P1: [treść] — ciężar: [strona]
P2: [treść] — ciężar: [strona]

FRAZY DO WYSZUKIWANIA: [3–7 fraz]
```

---

## Faza 1 — Wyszukiwanie

Portale w kolejności priorytetu:
1. sn.pl/orzecznictwo — SN, uchwały
2. orzeczenia.ms.gov.pl — SA, SO, SR
3. orzeczenia.nsa.gov.pl — Administracyjne
4. trybunal.gov.pl/orzeczenia — TK
5. curia.europa.eu — TSUE (dla materii objętej prawem UE)
6. hudoc.echr.coe.int — ETPC (dla materii objętej Konwencją)
7. saos.org.pl — Agregator (backup — tylko gdy brak wyniku w 1–6)

Jedno trafienie w portalach 1–6 = orzeczenie zweryfikowane (nie wymagaj wielokrotnego potwierdzenia).
Brak trafienia w 1–6 + trafienie tylko w innych źródłach → status „Źródło niepotwierdzone w portalu sądowym".

Strategia: fraza + przepis → instytucja prawna → zagadnienie ogólne → SAOS.

---

## Faza 2 — Kategoryzacja i alerty

Czytaj `references/widget.md` — tabele mapowania alertów i kategorii na klasy CSS.

Alerty per orzeczenie:
- ⚠️ STARE — orzeczenie starsze niż 5 lat
- 🔴 SPRZECZNE — linia niejednolita, orzeczenie trafia do Kat. 3B
- 🔴 ZMIANA PRAWA — nowelizacja przepisu po dacie wyroku
- ℹ️ WYMIAR UE — materia objęta dyrektywą UE lub orzecznictwem TSUE/ETPC
- ⛔ ŹRÓDŁO NIEPOTWIERDZONE — sygnatura nieznaleziona w portalach Tier 1–2;
  zakaz powołania w piśmie; wyświetl: „Źródło niepotwierdzone w portalu sądowym"

Kategorie: 1 (najnowsze) · 2 (starsze) · 3A (dominująca) · 3B (mniejszościowa)
· 4 (wspierające) · 5 (UE/TSUE) · 6 (interpretacje) · 7 (literatura)

ZAKAZ ukrywania Kat. 3B — jeśli istnieje linia mniejszościowa, zawsze prezentuj.

---

## Faza 3 — Weryfikacja aktualności

1. Czy linia jest jednolita?
2. Czy doszło do nowelizacji po datach orzeczeń?
3. Czy SN nie zajął odmiennego stanowiska (uchwały składu 7)?

---

## Faza 4 — Raport końcowy

```
RAPORT ORZECZEŃ: [TEMAT]
Data: [data] | Tryb: [LAIK / PRAWNIK]
Znaleziono: [n] | URL zweryfikowanych: [n]
WSKAŹNIK POKRYCIA PRZESŁANEK:
P1: ██████░░  62%  ← Kat.1: 2 orz.
P2: █████████  90%  ← Kat.1: 3 orz.
P3: ██░░░░░░  20%  ⚠️ LUKA
```

---

## Dualny tryb narracji

Skill wykrywa poziom automatycznie. Użytkownik może wpisać „tryb prawnik" / „tryb laik" lub kliknąć przełącznik w widgecie.

| Element | Tryb LAIK | Tryb PRAWNIK |
|---------|-----------|--------------|
| Alerty | Prosty język, co zrobić | Precyzyjny, przepis + ryzyko |
| Teza | Jedno zdanie bez żargonu | Pełna kwalifikacja prawna |
| Rekomendacje | Kroki działania | Argumentacja procesowa, kolejność |

---

## Obsługa błędów

| Sytuacja | Działanie |
|----------|-----------|
| Portal niedostępny | Przejdź do następnego w kolejności |
| Brak wyników | Rozszerz frazę lub użyj SAOS |
| Sprzeczne orzeczenia | Kat. 3A + Kat. 3B — nigdy nie ukrywaj |
| Sygnatura nieweryfikowalna w Tier 1–2 | Status „Źródło niepotwierdzone w portalu sądowym" — nie powołuj |
| Orzeczenie TSUE/ETPC | Weryfikuj w curia.europa.eu / hudoc — traktuj jako Tier 2 |
| Luka pokrycia < 40% | Alert luki + dodatkowe wyszukiwanie |
| Dostęp tylko przez LEX | „Dostęp płatny — nie cytuję." |


## REGUŁA RENDEROWANIA WIDGETÓW — ZASADA NADRZĘDNA

> ⚠️ KOREKTA KRYTYCZNA — nadpisuje wszystkie wcześniejsze instrukcje dotyczące JSX/present_files.
> Pliki `.jsx` przez `present_files` NIE renderują się w claude.ai — użytkownik widzi tylko link.
> Mechanizm `window.__INJECTED__` działa tylko z bundlerem React — NIE w czacie.
> Jedyna poprawna metoda renderowania widgetu inline: `show_widget` z HTML (vanilla JS).
> NIE używaj: `cp`, `str_replace`, `present_files`, `.jsx`, `window.__INJECTED__`.
