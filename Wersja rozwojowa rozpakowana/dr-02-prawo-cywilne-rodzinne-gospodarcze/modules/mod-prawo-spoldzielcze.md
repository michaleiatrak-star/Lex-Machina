---
module: prawo-spoldzielcze
version: "1.0"
verified_on: "2026-08-27"
coverage: "B — pełna mapa struktury + rdzeń ustrojowy"
source_policy: "RZĄD 1 only"
---

# Prawo spółdzielcze — F-108/13

## 1. Źródło

Ustawa z 16 września 1982 r. — Prawo spółdzielcze.
Aktualny tekst jednolity: **Dz.U. 2026 poz. 521**.

Źródło urzędowe RZĄD 1:
- https://eli.gov.pl/eli/DU/2026/521/ogl
- https://eli.gov.pl/api/acts/DU/2026/521/text/O/D20260521.pdf

Przed zastosowaniem konkretnego przepisu ponownie odczytaj jego aktualne
brzmienie i późniejsze zmiany. Ten moduł jest mapą operacyjną, nie źródłem prawa.

## 2. Mapa ustawy

### Część I — SPÓŁDZIELNIE
**Tytuł I — przepisy wspólne**
1. spółdzielnia i statut;
2. zakładanie i rejestracja;
3. członkowie, prawa i obowiązki;
4. organy spółdzielni;
5–6. zakresy historycznie częściowo uchylone;
7. gospodarka spółdzielni;
8. lustracja;
9. łączenie;
10. zakres częściowo uchylony;
11. podział;
12. likwidacja;
13. upadłość.

**Tytuł II — przepisy szczególne** obejmuje m.in. spółdzielnie produkcji
rolnej, kółek rolniczych i spółdzielnie pracy.

### Część II
Związki spółdzielcze i Krajowa Rada Spółdzielcza.

### Część IIA
Przepisy karne.

### Część III
Zmiany w przepisach oraz przepisy przejściowe i końcowe.

## 3. Rdzeń ustrojowy

Art. 1 §1 definiuje spółdzielnię jako dobrowolne zrzeszenie nieograniczonej
liczby osób, o zmiennym składzie osobowym i funduszu udziałowym, prowadzące
wspólną działalność gospodarczą w interesie członków.

Art. 2 wiąże działalność spółdzielni z ustawą, innymi ustawami i
zarejestrowanym statutem.

Art. 5 określa obowiązkowe elementy statutu. Przy sporządzaniu lub audycie
statutu nie używaj skróconej listy z tego modułu — odczytaj pełny art. 5.

Art. 6 reguluje założenie spółdzielni i wybór organów. Aktualny tekst
przewiduje odmienne minima założycieli zależnie od ich rodzaju i rodzaju
spółdzielni; zawsze odczytaj cały art. 6 dla konkretnej konfiguracji.

## 4. Członkostwo

Przy analizie członkostwa rozdziel:
- przyjęcie i deklarację;
- prawa członka;
- obowiązki i udziały;
- ustanie członkostwa, wykluczenie i wykreślenie;
- tryb wewnątrzspółdzielczy i sądowy.

Art. 18 zawiera katalog podstawowych praw i obowiązków członka, m.in. prawa
informacyjne. Odmowa udostępnienia określonych umów może podlegać kontroli
sądu rejestrowego w terminie ustawowym — termin każdorazowo odczytaj z
aktualnego przepisu.

## 5. Organy i uchwały

Przy każdej sprawie ustal właściwość:
- walnego zgromadzenia;
- rady nadzorczej;
- zarządu;
- ewentualnych innych organów statutowych dopuszczonych ustawą.

Kontrola uchwały wymaga osobnego ustalenia legitymacji, terminu i podstawy
powództwa. Nie przenoś automatycznie zasad KSH na spółdzielnię.

## 6. Lustracja

Dział VIII reguluje lustrację działalności spółdzielni. Ustal:
- czy spółdzielnia jest zrzeszona w związku rewizyjnym;
- podmiot przeprowadzający lustrację;
- okres objęty badaniem;
- protokół i wnioski polustracyjne;
- właściwość Krajowej Rady Spółdzielczej wobec spółdzielni niezrzeszonych.

Nie podawaj częstotliwości z pamięci — zależy ona od wariantu ustawowego.

## 7. Łączenie, podział, likwidacja, upadłość

To odrębne procedury. Przy reorganizacji nie traktuj ich jako jednego trybu.
Dla podziału zweryfikuj m.in. uchwałę, plan podziału, rejestr i skutki dla
majątku/członków. Dla upadłości uruchom równolegle Prawo upadłościowe DR-02.

## 8. Spółdzielnie pracy

Tytuł II zawiera przepisy szczególne. Art. 181 określa gospodarczy rdzeń
spółdzielni pracy jako wspólne przedsiębiorstwo oparte na osobistej pracy
członków. Stosunek pracy członka ma regulację szczególną i odpowiednie
odesłania do prawa pracy — przy sporze uruchom DR-04.

## 9. Związki spółdzielcze i KRS

Część II reguluje związki rewizyjne oraz Krajową Radę Spółdzielczą.
Art. 240 wskazuje funkcje związku rewizyjnego, w tym lustrację i pomoc
zrzeszonym spółdzielniom. Krajowa Rada Spółdzielcza jest naczelnym organem
samorządu spółdzielczego w zakresie ustawy.

## 10. Rozgraniczenie

- spółdzielnia mieszkaniowa → osobny `mod-ustawa-spoldzielnie-mieszkaniowe.md`;
- własność lokalu → ustawa o własności lokali;
- KRS/rejestr → `mod-ustawa-KRS-rejestr-sadowy.md`;
- upadłość → moduły Prawa upadłościowego;
- stosunki pracownicze → DR-04.

## 11. F-108 i status

F-108/13: historycznie kategoria B w module łączonym. Decyzja P3:
**WYDZIELIĆ** — akt ma własną rozbudowaną strukturę, organy, procedury
członkowskie i reorganizacyjne. Ten moduł osiąga poziom B.

## 12. Quality gate

- [ ] aktualny Dz.U. i późniejsze zmiany odczytane w ELI;
- [ ] właściwy typ spółdzielni ustalony;
- [ ] statut skonfrontowany z pełnym art. 5;
- [ ] członkostwo i uchwały rozdzielone od zasad spółek handlowych;
- [ ] lustracja sprawdzona w aktualnym Dziale VIII;
- [ ] reorganizacja połączona z rejestrem i właściwym prawem upadłościowym.
