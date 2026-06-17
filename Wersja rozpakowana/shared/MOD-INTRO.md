# MOD-INTRO — executive summary pisma procesowego (str. 1)

> Wersja: 1.0.0 | Typ: moduł redakcyjny | shared/
> Wywoływany z: pisma-procesowe-v3 W2 (po W2.2 — struktura pisma, przed uzasadnieniem)
> Podstawa ekspercka: Suntum ALI-ABA 2007 ("A pleading should present the issue
> and tell the court how it should be decided up front, in as few paragraphs as possible");
> Garner LawProse ("Make a killer argument on page 1 — without a snarky tone");
> Scalia/Garner *Making Your Case*: "Courts don't like to spend a lot of time deciding
> what to decide."

---

## 1. Cel

Każde pismo złożone do sądu trafia do sędziego, który ma dziesiątki spraw.
Sędzia czytający pismo "na zimno" potrzebuje 1–2 akapitów, które:
- powiedzą mu KTO i CZEGO żąda (bez czytania petitum),
- pokażą DLACZEGO żądanie jest uzasadnione (bez czytania uzasadnienia),
- wskażą KLUCZOWY FAKT lub KLUCZOWY PRZEPIS, który rozstrzyga sprawę.

Executive summary to nie streszczenie dla czytelnika — to **rama poznawcza**,
przez którą sędzia następnie czyta całe uzasadnienie.

---

## 2. Kiedy generować MOD-INTRO

```
ZAWSZE gdy pismo jest:
  - pozwem (nowa sprawa),
  - apelacją lub zażaleniem,
  - pismem przygotowawczym o objętości > 3 stron,
  - repliką / odpowiedzią na pozew o objętości > 4 stron,
  - skargą do WSA lub NSA.

POMIŃ gdy pismo jest:
  - pisma-proste-v2 (krótkie pisma 1-wątkowe — nagłówek i petitum wystarczą),
  - wezwaniem do zapłaty / pismem przedsądowym,
  - wnioskiem o klauzulę wykonalności / doręczenie.
```

---

## 3. Struktura executive summary (2–5 zdań, max 150 słów)

```
ZDANIE 1 — Kto i czego żąda (+ kwota jeśli majątkowe):
  "[Powód / Wnioskodawca / Skarżący] wnosi o [żądanie główne w 1 zdaniu]."

ZDANIE 2 — Kluczowy fakt (najsilniejszy, niepodważalny):
  "Żądanie oparte jest na [kluczowy fakt / zdarzenie / dokument] z dnia [data]."

ZDANIE 3 — Podstawa prawna (1–2 przepisy, nie więcej):
  "Podstawę prawną stanowi ⚠️[art. X ustawa — WERYFIKACJA W3]."
  [W3: zostanie zastąpione zweryfikowanym oznaczeniem Dz.U.]

ZDANIE 4 — Dlaczego sąd powinien uwzględnić (teza centralna z W1.2):
  "[Jedno zdanie z W1.2 — teza centralna pisma]."

ZDANIE 5 (opcjonalne) — Uprzedzenie głównego zarzutu przeciwnika:
  "Spodziewany zarzut [X] jest bezzasadny, ponieważ [Y] — co wykazano
  szczegółowo w pkt [nr] uzasadnienia."
```

---

## 4. Zasady redakcji (Garner — Plain English)

```
⛔ ZAKAZ: emocji, ocen moralnych, przymiotników bez znaczenia prawnego
⛔ ZAKAZ: więcej niż 2 przepisów w executive summary
⛔ ZAKAZ: streszczenia historii sporu — to nie jest wstęp literacki
⛔ ZAKAZ: dłuższego niż 150 słów executive summary

✓ ZALECANE: pierwsze zdanie = kto i czego żąda (podmiot + żądanie)
✓ ZALECANE: aktywna strona gramatyczna ("Powód wnosi" nie "Wnoszono")
✓ ZALECANE: krótkie zdania (max 25 słów)
✓ ZALECANE: konkretne kwoty, daty, nazwy — nie przybliżenia
```

---

## 5. Pozycja w piśmie

```
[NAGŁÓWEK: sąd, strony, sygnatura]

[OZNACZENIE PISMA: POZEW / APELACJA / ...]

[EXECUTIVE SUMMARY]          ← MOD-INTRO generuje tę sekcję
  (2–5 zdań, max 150 słów)
  Bez tytułu akapitu — płynnie jako pierwszy akapit po oznaczeniu pisma.

[ŻĄDANIA — PETITUM]
  Wnoszę o: 1. ... 2. ...

[UZASADNIENIE]
  I. Stan faktyczny
  II. Podstawa prawna
  ...
```

---

## 6. Przykład (pozew pracowniczy — anonimizowany)

```
Powód [Imię Nazwisko] wnosi o zasądzenie od pozwanej [Nazwa Spółki sp. z o.o.]
kwoty [XX.XXX,XX] zł tytułem odszkodowania za niezgodne z prawem rozwiązanie
umowy o pracę. Stosunek pracy trwał [X] lat i zakończył się wypowiedzeniem
z dnia [data], które nie wskazywało konkretnej i rzeczywistej przyczyny, jak
wymaga ⚠️[art. 30 §4 KP — WERYFIKACJA W3]. Jedyna wskazana przyczyna —
"reorganizacja działu" — dotyczyła całego działu, tymczasem wszyscy pozostali
pracownicy działu zachowali zatrudnienie, co wykazuje dołączona korespondencja
wewnętrzna z dnia [data].
```

---

## 7. Integracja z pipeline

W pisma-procesowe-v3, W2, po W2.2 (struktura):

```
W2.2 → struktura pisma (nagłówek + petitum + szkielet uzasadnienia)
  ↓
W2.2a → MOD-INTRO: view /mnt/skills/user/shared/MOD-INTRO.md
         → Wygeneruj executive summary (2–5 zdań)
         → Wstaw jako pierwszy akapit pisma, przed petitum
         → Przepisy oznacz ⚠️[...] jak w reszcie W2
  ↓
W2.3 → lista placeholderów (przepisy z executive summary dołącz do listy ⚠️Pn)
```

W W3: przepisy z executive summary weryfikowane jak wszystkie ⚠️Pn.
