# M11 — RODO, Monitoring, Cyberprzestępczość i Dowody Cyfrowe

## Cel

Obsłużyć sprawy, w których kluczowym wymiarem jest ochrona danych osobowych,
monitoring pracowniczy, dostęp do systemów teleinformatycznych, korespondencji
elektronicznej lub inne aspekty cyfrowe. Moduł łączy analizę prawną z analizą
techniczną dowodów cyfrowych.

**Reguła:** przy każdym przepisie z rozporządzenia (UE) 2016/679 (RODO),
dyrektywy, ustawy o ochronie danych lub KK weryfikuj aktualną treść w ISAP
lub EUR-Lex. Interpretacje organu nadzorczego (UODO) sprawdzaj na uodo.gov.pl.

---

## 11.1 Klasyfikacja sprawy RODO/cyber

```text
Typ zdarzenia:
  ☐ Przetwarzanie bez podstawy prawnej (art. 6 RODO)
  ☐ Naruszenie ochrony danych osobowych (art. 33–34 RODO)
  ☐ Nieuprawniony dostęp do systemu (art. 267 KK)
  ☐ Niszczenie / usuwanie danych (art. 268 KK)
  ☐ Zakłócenie działania systemu (art. 269 KK)
  ☐ Nielegalny monitoring pracownika (art. 222 KP, art. 111 KP)
  ☐ Nieuprawnione utrwalenie rozmowy / wizerunku (art. 267 KK, art. 81 PrAut)
  ☐ Phishing / oszustwo cybernetyczne (art. 286 KK)
  ☐ Naruszenie tajemnicy korespondencji (art. 267 KK, art. 23 KC)
  ☐ Wyciek danych klientów / pracowników
  ☐ Niezgodne z RODO profilowanie
  ☐ Naruszenie praw podmiotu danych (dostęp, sprzeciw, usunięcie)
  ☐ Inne:

Strony:
  Administrator danych:
  Podmiot przetwarzający:
  Podmiot danych:
  Organ nadzorczy (UODO): czy zawiadomiony / czy wszczął postępowanie
  Organ ścigania: tak / nie / w toku
```

---

## 11.2 Analiza podstaw prawnych przetwarzania (art. 6 RODO)

```text
[RODO-01]
Dane objęte sprawą (kategorie):
  ☐ Dane zwykłe (art. 6 RODO)
  ☐ Dane szczególnej kategorii (art. 9 RODO): zdrowie / rasa / religia / płeć / inne
  ☐ Dane dotyczące wyroków i naruszeń prawa (art. 10 RODO)

Podstawa przetwarzania wskazana przez administratora:
  ☐ Zgoda (art. 6 ust. 1 lit. a) — czy dobrowolna / świadoma / odwołalna?
  ☐ Umowa (art. 6 ust. 1 lit. b)
  ☐ Obowiązek prawny (art. 6 ust. 1 lit. c) — jaka podstawa?
  ☐ Ochrona żywotnych interesów (art. 6 ust. 1 lit. d)
  ☐ Zadanie publiczne (art. 6 ust. 1 lit. e)
  ☐ Uzasadniony interes (art. 6 ust. 1 lit. f) — czy przeprowadzono test równoważenia?

Ocena podstawy:
  Zarzuty wobec podstawy:
  Luki prawne:
  Orzecznictwo TSUE do sprawdzenia:
```

---

## 11.3 Monitoring pracowniczy — reżim prawny

```text
[MON-01]
Typ monitoringu:
  ☐ Monitoring wizyjny (art. 222 KP)
  ☐ Monitoring poczty elektronicznej (art. 223 KP)
  ☐ Monitoring aktywności na komputerze
  ☐ Monitoring GPS / lokalizacji
  ☐ Monitoring rozmów telefonicznych
  ☐ Kontrola skrzynek e-mail po rozwiązaniu stosunku pracy

Wymagania formalne art. 222–223 KP:
  □ Cel monitoringu uzasadniony i udokumentowany
  □ Monitoring uwzględniony w układzie zbiorowym lub regulaminie pracy
  □ Pracownicy poinformowani co najmniej 2 tygodnie przed uruchomieniem
  □ Oznaczenia wizualne (kamery) / informacje w systemie
  □ Zakres monitoringu proporcjonalny do celu

Naruszenia formalne:
Status monitoringu: legalny / częściowo nielegalny / nielegalny
Skutek procesowy nielegalnego monitoringu:
  → dowód z nielegalnego monitoringu: dopuszczalność w postępowaniu cywilnym
    (art. 308 KPC — sąd ocenia swobodnie; brak wyraźnego zakazu)
  → dowód z nielegalnego monitoringu: dopuszczalność w postępowaniu karnym
    (art. 168a KPK — zakaz dowodowy przy naruszeniu przepisów przy uzyskaniu dowodu)
```

---

## 11.4 Art. 267 KK — nieuprawniony dostęp do systemu

```text
[CYBER-01]
Przepis: art. 267 § 1–4 KK (weryfikacja aktualnego brzmienia: ISAP)

Znamiona:
  § 1: Kto bez uprawnienia uzyskuje dostęp do informacji dla niego
       nieprzeznaczonej — sprawca musi przełamać zabezpieczenie
  § 2: Uzyskanie informacji przez podsłuch, wizyjny lub inny specjalny środek
  § 3: Ujawnienie informacji uzyskanej bezprawnie
  § 4: Zniszczenie, uszkodzenie, usunięcie lub zmiana informacji

Analiza stanu faktycznego:
  Czy była ochrona techniczna (hasło, szyfrowanie, ograniczenie dostępu)?
  Czy dostęp był faktycznie nieuprawniony czy istnieje spór o uprawnienie?
  Czy doszło do dalszego ujawnienia informacji?
  Kto jest pokrzywdzonym?
  Tryb ścigania: na wniosek (§ 1–3) / z urzędu (§ 4)?

Zarzuty obrony (najczęstsze):
  — brak zabezpieczenia technicznego (brak przełamania)
  — uprawnienie domniemane (np. pracownik z dostępem)
  — brak umyślności
  — działanie w obronie własnego interesu prawnego

[H-ŚLEDCZA] Hipoteza dotycząca art. 267 KK:
```

---

## 11.5 Analiza dowodów cyfrowych

### Katalog dowodów cyfrowych

```text
[DOW-CYF-001]
Typ dowodu:
  ☐ E-mail (nagłówki + treść)
  ☐ SMS / MMS / wiadomość komunikatora
  ☐ Zrzut ekranu / screenshot
  ☐ Log systemowy / dziennik zdarzeń
  ☐ Nagranie audio / video (plik cyfrowy)
  ☐ Metadane dokumentu (autor, data, zmiany)
  ☐ Dane GPS / geolokalizacja
  ☐ Historia przeglądarki / aktywność w systemie
  ☐ Zdjęcie cyfrowe (EXIF)
  ☐ Dane z mediów społecznościowych
  ☐ Nagranie z monitoringu (plik wideo)
  ☐ Inne:

Źródło pozyskania:
Kto posiada oryginał:
Forma przekazana do akt: wydruk / plik / kopia uwierzytelniona
```

### Chain of custody dowodów cyfrowych

```text
[CoC-001]
Dowód:
Moment pierwotnego pozyskania (data, godzina, sposób):
Kto pozyskał:
Hash pliku źródłowego (MD5/SHA-256): [jeśli dostępny]
Gdzie przechowywano:
Czy były kopie:
Czy mogła nastąpić modyfikacja: tak / nie / nie można wykluczyć
Kto miał dostęp:
Sposób przekazania do sądu:
Integralność: potwierdzona / wątpliwa / nieweryfikowalna
Ryzyko kwestionowania przez przeciwnika:
Jak zabezpieczyć na przyszłość:
```

---

## 11.6 Dowody z nagrań — admissibility i strategia

```text
[NAGR-001]
Typ nagrania: rozmowy prywatnej / rozmowy z pracodawcą / zebranie / inne
Nagrywający: strona sporu / osoba trzecia
Czy nagrywany wiedział: tak / nie
Czy wymagana zgoda: [analiza art. 267 KK, art. 14 ust. 1 KP, art. 47 Konstytucji]

Dopuszczalność w postępowaniu cywilnym:
  → Sądy dopuszczają dowód z nagrania bez zgody nagranego, gdy:
    (a) strona nagrywała własną rozmowę,
    (b) brak innej możliwości udowodnienia faktu,
    (c) treść nie jest poufna co do istoty.
  → Kluczowe orzeczenia: [weryfikacja przez orzeczenia-sadowe-v2]
  → Ryzyko oddalenia z art. 235² § 1 pkt 2 KPC (zbędność / dowód spóźniony)

Dopuszczalność w postępowaniu karnym:
  → art. 168a KPK: zakaz dowodowy przy naruszeniu przepisów
  → czy nagranie zostało pozyskane przez funkcjonariusza publicznego?
  → czy nagranie wiąże się z czynem zabronionym z art. 267 KK?

Transkrypcja:
  Czy sporządzono: tak / nie
  Kto sporządził:
  Czy zweryfikowano z nagraniem:
  Fragmenty sporne:

[H-ŚLEDCZA] Hipoteza dotycząca autentyczności nagrania:
```

---

## 11.7 Naruszenie ochrony danych — procedura zgłoszenia i odpowiedzialność

```text
[NARUSZONE-01]
Czy doszło do naruszenia ochrony danych (art. 4 pkt 12 RODO)?
Klasyfikacja naruszenia:
  ☐ Poufność (nieuprawniony dostęp)
  ☐ Integralność (nieautoryzowana modyfikacja)
  ☐ Dostępność (utrata / zniszczenie)

Obowiązek zgłoszenia do UODO (art. 33 RODO):
  Termin: 72 godziny od stwierdzenia naruszenia
  Czy zgłoszono: tak / nie / przekroczono termin
  Skutki braku zgłoszenia: [kara administracyjna art. 83 RODO — do weryfikacji]

Obowiązek zawiadomienia osób (art. 34 RODO):
  Czy naruszenie stwarza wysokie ryzyko dla osób: tak / nie
  Czy zawiadomiono osoby: tak / nie

Odpowiedzialność administratora:
  Kara UODO: do 20 mln EUR lub 4% obrotu (art. 83 ust. 5 RODO)
  Odszkodowanie (art. 82 RODO): majątkowe + niemajątkowe
  Odpowiedzialność karna (ustawa z 10.05.2018 o ochronie danych): [weryfikacja]
```

---

## 11.8 Prawa podmiotu danych — analiza naruszeń

```text
[PRAWA-01]
Prawo | Status realizacji | Naruszenie | Termin odpowiedzi | Skutek
------|-------------------|------------|-------------------|-------
Dostęp (art. 15) | | | 1 miesiąc | skargi do UODO
Sprostowanie (art. 16) | | | 1 miesiąc |
Usunięcie (art. 17) | | | 1 miesiąc |
Ograniczenie przetwarzania (art. 18) | | | niezwłocznie |
Przenoszenie danych (art. 20) | | | 1 miesiąc |
Sprzeciw (art. 21) | | | niezwłocznie |

Tryb skargi do UODO:
  Art. 77 RODO — prawo wniesienia skargi
  Art. 78–79 RODO — prawo do sądu
  Art. 80 RODO — reprezentacja przez organizację
```

---

## 11.9 Integracje specyficzne dla M11

| Kiedy | Działanie |
|-------|-----------|
| Każda podstawa prawna RODO / KK | Weryfikacja w ISAP + EUR-Lex |
| Kara UODO lub orzeczenie TSUE | `orzeczenia-sadowe-v2` + orzeczenia.uodo.gov.pl |
| Nagranie jako dowód | Patrz sekcja 11.6 + analiza admissibility M8 |
| Monitoring pracowniczy | Sekcja 11.3 + `analizator-umow-v1` (klauzule) |
| Metadane dokumentów | OSINT → M6 sekcja 6.6 |
| Zawiadomienie organów | M5 sekcja 5.2 (proceduralne) + M7 rekomendacje |

---

## 11.10 Lista pytań RODO/cyber do listy śledczej (→ M6 sekcja 6.11)

```text
DOKUMENTY DO ŻĄDANIA / ZABEZPIECZENIA:
  □ Rejestr czynności przetwarzania (art. 30 RODO)
  □ Polityka bezpieczeństwa / SZBI
  □ Ocena skutków dla ochrony danych (DPIA, art. 35 RODO)
  □ Umowa powierzenia przetwarzania (art. 28 RODO)
  □ Logi dostępu do systemów
  □ Korespondencja z UODO
  □ Zgody na przetwarzanie danych
  □ Dokumentacja monitoringu (regulamin, informacje dla pracowników)

PYTANIA DO STRONY / ŚWIADKA:
  □ Kto miał dostęp do danych / systemu i kiedy?
  □ Czy istniały hasła / zabezpieczenia techniczne?
  □ Kto poinformował pracowników o monitoringu i kiedy?
  □ Kiedy stwierdzono naruszenie i co zrobiono?

ORGANY DO SPRAWDZENIA LUB ZAWIADOMIENIA:
  □ UODO (uodo.gov.pl)
  □ Prokuratura (art. 267 KK)
  □ CERT Polska (incydenty cyberbezpieczeństwa)
```
