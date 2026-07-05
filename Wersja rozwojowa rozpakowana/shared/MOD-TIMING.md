# MOD-TIMING — Strategia czasowa składania pism procesowych

> Wersja: 1.0.0 | Typ: moduł strategiczny | shared/
> Wywoływany z: STRATEGIA-PROCESOWA.md (§4) · pisma-procesowe-v3 W1 (krok W1.6)
> Podstawa ekspercka: Suntum ALI-ABA 2007 ("How and when you present the issue
> may affect how the court decides it") · Scalia/Garner *Making Your Case* (2008)

---

## 1. Cel modułu

Moduł nie pyta "czy złożyć" — pyta "kiedy złożyć, żeby maksymalizować efekt
procesowy." Timing wniosku zmienia:
- efekt psychologiczny (sędzia widzi sprawę z Twojej perspektywy przed odczytaniem
  stanowiska przeciwnika),
- efekt inercji (korzystne postanowienie wstępne trudniej wzruszyć),
- efekt zaskoczenia (obrona musi reagować bez przygotowania),
- efekt prekluzji (wymuszenie odpowiedzi na termin ustawowy przeciwnika).

---

## 2. Macierz decyzji timing

Dla każdego planowanego pisma odpowiedz na pytania T1–T5:

```
T1. Czy złożenie teraz da sędziemu "ramę odniesienia" przed pierwszą rozprawą?
    TAK → ZŁÓŻ WCZEŚNIE (min. 14 dni przed terminem)
    NIE → przejdź do T2

T2. Czy ujawnienie pisma teraz pozwoli przeciwnikowi przygotować kontratak,
    który bez pisma byłby niemożliwy lub utrudniony?
    TAK → ZŁÓŻ NA ROZPRAWIE lub dopiero gdy przeciwnik ujawni swój ruch
    NIE → przejdź do T3

T3. Czy masz korzystne postanowienie / decyzję etapu wcześniejszego, na której
    możesz budować inercję?
    TAK → ZŁÓŻ NIEZWŁOCZNIE, zanim skład się zmieni lub upłynie czas
    NIE → przejdź do T4

T4. Czy pismo dotyczy wniosku dowodowego, który może być objęty prekluzją?
    TAK → ZŁÓŻ W PIERWSZYM PIŚMIE (pozew / odpowiedź) — nie czekaj
    NIE → przejdź do T5

T5. Czy jest termin zawity na złożenie tego pisma?
    TAK → oblicz datę z TERM-CALC.md i złóż ≥7 dni przed terminem
    NIE → timing elastyczny; domyślnie: złóż po analizie T1–T4
```

---

## 3. Sześć modeli timing

### T-EARLY — złóż wcześnie, kształtuj perspektywę sądu

**Kiedy:** pierwsze pismo w sprawie, wniosek o zabezpieczenie, pismo edukacyjne
przed rozprawą (Suntum: "trial memo").

**Efekt:** sędzia zapoznaje się ze sprawą z Twojej perspektywy przed rozprawą.
Działa jak "trial memo" — 1–2 strony, które opisują fakty i spór z pozycji
korzystnej dla klienta, zanim sędzia usłyszy drugą stronę.

**Ryzyko:** danie czasu przeciwnikowi na przygotowanie odpowiedzi. Akceptowalne
gdy sprawa jest silna merytorycznie i czas nie osłabia pozycji.

---

### T-REACTIVE — złóż po ruchu przeciwnika, nie przed

**Kiedy:** zarzuty, które przeciwnik powinien zgłosić jako pierwszy; dowody
oparte na materiałach, których przeciwnik jeszcze nie ujawnił; pytania do biegłego
oparte na niespodziewanej tezie opinii.

**Efekt:** nie telegrafujesz linii obrony / ataku. Przeciwnik działa "na ciemno."

**Ryzyko:** prekluzja (sprawdź T4 zawsze). Nie stosuj gdy dowód może zostać
uznany za spóźniony.

---

### T-INERTIA — wykorzystaj efekt inercji orzeczenia

**Kiedy:** sąd wydał korzystne postanowienie wstępne (np. o zabezpieczeniu,
o właściwości, o dopuszczeniu dowodu). Złóż kolejne pismo nawiązujące do tego
postanowienia niezwłocznie, gdy sprawa jest świeża w aktach.

**Formuła procesowa:**
> "Sąd rozstrzygnął już kwestię [X] w postanowieniu z dnia [data]. Konsekwencją
> tego rozstrzygnięcia jest [Y]. Wnoszę o [Z] zgodnie z powyższym rozstrzygnięciem."

**Efekt:** sędzia (lub nowy skład) napotyka linię argumentacyjną opartą na
własnym wcześniejszym orzeczeniu. Wzruszenie wymaga odejścia od własnej
linii — co psychologicznie i prawnie jest trudniejsze.

---

### T-SERIAL — sekwencja wniosków częściowych zamiast omnibus

**Kiedy:** sprawa zawiera kilka odrębnych kwestii prawnych o różnej sile.
Zamiast jednego dużego pisma o wszystkim, złóż serię celowanych pism o każdej
kwestii z osobna.

**Efekt:** każde pismo jest krótkie i precyzyjne (wymóg Garnera: 2 str. intro).
Sąd rozstrzyga kwestię po kwestii — każde korzystne postanowienie to
kolejna cegiełka inercji.

**Ryzyko:** wzrost kosztów doręczeń i ryzyka prekluzji. Stosuj gdy kwestie
są istotnie odrębne i kumulacja nie jest wymagana procesowo.

---

### T-ORAL-AMBUSH — zachowaj na rozprawę, nie ujawniaj pisemnie

**Kiedy:** argument oparty na błędzie pisma przeciwnika, który przeciwnik może
poprawić jeśli go uprzedzisz; wniosek, który zyska na efekcie zaskoczenia
w ustnej wymianie z sądem; kwestia, co do której sędzia powinien usłyszeć
odpowiedź przeciwnika "na gorąco."

**Zasada bezpieczeństwa:** sprawdź czy argument nie jest objęty prekluzją
pisemną (art. 207 §6, art. 217 §2 KPC w brzmieniu na datę — weryfikacja ISAP).

---

### T-ADVANCE-NOTICE — złóż z wyprzedzeniem dla efektu edukacyjnego

**Kiedy:** sędzia prawdopodobnie nie zna dziedziny (specjalistyczne prawo:
RODO, PZP, prawo wodne, AI Act). Pismo edukacyjne złożone 4–6 tygodni przed
rozprawą daje czas na zapoznanie się.

**Format:** nie pozew ani wniosek — pismo procesowe informacyjne lub nota
prawna (Suntum: "trial memo"). Krótkie (2–4 str.), z odesłaniem do kluczowych
aktów i orzeczeń.

---

## 4. Raport timing (format wyjściowy)

```
RAPORT MOD-TIMING
─────────────────────────────────────────────────────────
Pismo:           [typ pisma]
Planowana data:  [data złożenia]
Model timing:    [T-EARLY / T-REACTIVE / T-INERTIA / T-SERIAL / T-ORAL-AMBUSH / T-ADVANCE-NOTICE]
─────────────────────────────────────────────────────────
Uzasadnienie:
  T1 wynik:  [TAK/NIE] → [wniosek]
  T2 wynik:  [TAK/NIE] → [wniosek]
  T3 wynik:  [TAK/NIE] → [wniosek]
  T4 wynik:  [TAK/NIE] → [wniosek — prekluzja!]
  T5 wynik:  [TAK/NIE] → termin zawity: [data lub "brak"]

Rekomendacja:    [złóż TERAZ / złóż po [event] / złóż na rozprawie]
Ryzyko timing:   [BRAK / NISKIE / WYSOKIE]
─────────────────────────────────────────────────────────
```

---

## 5. Integracja z pipeline pisma-procesowe-v3

Moduł wczytaj w W1 jako krok W1.6 (po W1.5 — braki krytyczne):

```
view /mnt/skills/user/shared/MOD-TIMING.md
→ Wypełnij macierz T1–T5
→ Wybierz model timing
→ Wstaw RAPORT MOD-TIMING do checkpointu W1
→ Timing staje się elementem ramy — użytkownik zatwierdza razem z W1
```

Moduł wczytaj też z STRATEGIA-PROCESOWA.md §4 gdy pytanie dotyczy "kiedy":

```
view /mnt/skills/user/shared/MOD-TIMING.md
→ Wygeneruj raport timing jako część analizy strategicznej
```
