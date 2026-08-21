# MOD-OBAL — Obalanie Twierdzeń Strony Przeciwnej

*Ładuj gdy: odpowiedź na pozew, riposta, pismo przygotowawcze po złożeniu pisma przez przeciwnika*

---

## OBAL-1 — Inwentaryzacja twierdzeń strony przeciwnej

Wypisz WSZYSTKIE twierdzenia strony przeciwnej, które kwestionujesz:

```
TWIERDZENIE nr [1]:
"[dosłowny cytat lub dokładna treść]"
Źródło: [pismo z dnia X, str. Y / zeznanie z dnia X, godz. Y]
Priorytet: [KRYTYCZNE / WAŻNE / POMOCNICZE]
```

---

## OBAL-2 — Protokół obalania (dla każdego twierdzenia)

```
TWIERDZENIE STRONY PRZECIWNEJ:
"[dosłowny cytat]"
Źródło: [pismo/zeznanie, data, str./godz.]
DOWÓD OBALAJĄCY — TYP: [A/B/C/D/E/F]
Nazwa: [pełna nazwa, data]
Lokalizacja: [str. X / protokół z dnia Y, godz. Z]
Fragment: "[opis faktu lub cytat max 14 słów]"
Jak zaprzecza:
  → Twierdzenie mówi [X]. Dowód wykazuje [Y].
  → Sprzeczność: [precyzyjny opis]
  → Skutek procesowy: [co to oznacza]

WEWNĘTRZNA SPRZECZNOŚĆ (jeśli istnieje):
Twierdzenie to jest sprzeczne z własnym stanowiskiem strony
z [pismo/zeznanie, data]: "[cytat]"
Sprzeczność: [opis]
```

---

## OBAL-3 — Hierarchia siły obaleń

Stosuj od najsilniejszego:

**Siła A — Obalenie dokumentem urzędowym (najsilniejsze)**
Dokument poziomu A (protokół, wynik kontroli, wpis do rejestru) zaprzecza
twierdzeniu słownemu.

**Siła B — Obalenie własnym twierdzeniem strony (bardzo silne)**
Strona w jednym miejscu twierdzi X, w innym not-X. Zasada venire contra
factum proprium + art. 3 §1 KPC.

**Siła C — Obalenie zeznaniem świadka**
Zeznanie poziomu B z protokołu sądowego/prokuratorskiego przeczy twierdzeniu.

**Siła D — Obalenie brakiem dowodu**
Strona twierdzi coś, ale nie przedstawiła żadnego dowodu (art. 6 KC).

**Siła E — Obalenie orzecznictwem**
Teza prawna strony sprzeczna z utrwalonym orzecznictwem SN/SA.
→ Zawsze weryfikuj przez `orzeczenia-sadowe-v2`.

**Siła F — Obalenie kombinowane (najskuteczniejsze)**
Łączymy A + B lub A + C lub B + D itp. Wymień każdy element osobno.

---

## OBAL-4 — Gotowe formaty do wklejenia w pismo

### Format A — Dokument urzędowy
```
Twierdzenie strony [pozwanej/powodowej], iż [parafraza], pozostaje
w rażącej sprzeczności z [nazwa dokumentu] z dnia [data] (str. [X] akt).
Z dokumentu tego wynika jednoznacznie, że [konkretny fakt odwrotny].
Różnica dotyczy [precyzyjny opis sprzeczności] — okoliczności kluczowej
dla rozstrzygnięcia niniejszej sprawy.
```

### Format B — Własne twierdzenie strony
```
Twierdzenie strony [pozwanej/powodowej], iż [X], jest sprzeczne
z jej własnym stanowiskiem wyrażonym w [piśmie/zeznaniu] z dnia [data],
gdzie wskazano: "[dosłowny cytat max 14 słów]". Strona nie może skutecznie
twierdzić [X] i jednocześnie [Y]. Sprzeczność tę należy ocenić
w świetle art. 3 §1 KPC, nakładającego obowiązek dawania wyjaśnień zgodnych
z prawdą.
```

### Format C — Zeznanie świadka
```
Twierdzeniu strony [pozwanej/powodowej], iż [X], przeczą zeznania
świadka [imię nazwisko], złożone dnia [data], godz. [Y] (protokół str. [Z]).
Świadek zeznał: "[cytat max 14 słów]". Zeznanie to, złożone pod rygorem
odpowiedzialności karnej za składanie fałszywych zeznań, zaprzecza
twierdzeniu strony w zakresie [konkretna kwestia].
```

### Format D — Brak dowodu
```
Strona [pozwana/powodowa] twierdzi, że [X], jednak nie przedstawiła
żadnego dowodu na poparcie tego twierdzenia. Zgodnie z art. 6 KC ciężar
udowodnienia faktu spoczywa na tym, kto z faktu wywodzi skutki prawne.
Twierdzenie nieudowodnione nie może stanowić podstawy rozstrzygnięcia.
```

### Format E — Orzecznictwo
```
Twierdzenie strony [pozwanej/powodowej] pozostaje w sprzeczności
z utrwalonym orzecznictwem. [Sąd] w wyroku z dnia [data], sygn. [X]
(dostępny: [URL oficjalny]) — podobieństwo do sprawy: [Y/5] —
wskazał, że [teza własnymi słowami, max 14 słów]. Oznacza to, że [wniosek
odwrotny do twierdzenia strony].
```

### Format F — Kombinowany
```
Twierdzeniu strony [pozwanej/powodowej], iż [X], przeczą łącznie:
Po pierwsze — [dokument urzędowy]: [szczegóły + opis sprzeczności].
Po drugie — [zeznanie/własne twierdzenie]: [szczegóły + opis sprzeczności].
Po trzecie — [orzecznictwo / brak dowodu]: [szczegóły].
Tak wielowymiarowe zaprzeczenie uniemożliwia przyjęcie tego twierdzenia
za podstawę ustaleń faktycznych (art. 233 §1 KPC).
```

---

## OBAL-5 — Zakazy w obalaniu

- **Nigdy:** "Twierdzenie jest nieprawdziwe." — bez rozwinięcia = bezskuteczne
- **Nigdy:** oceny moralne ("kłamliwie", "bezczelnie") — zrażają sąd
- **Zawsze:** konkretny fakt + źródło + opis sprzeczności
- **Zawsze:** przy Format E — wywołaj `orzeczenia-sadowe-v2` dla weryfikacji
