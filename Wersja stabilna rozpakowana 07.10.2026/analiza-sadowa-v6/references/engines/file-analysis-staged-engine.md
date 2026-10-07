# STAGED FILE ANALYSIS ENGINE — v6

## Miejsce w modelu czteroprzebiegowym

Ten silnik opisuje sekwencję etapów dla obszernych materiałów.
W v6 etapy A–E są bezpośrednio zmapowane na Przejścia I–IV:

| Etap silnika | Przejście v6 | Weryfikacja |
|-------------|-------------|-------------|
| A — indeks  | Przejście I  | — |
| B — fakty   | Przejście I  | — |
| C — przesłanki | Przejście II | — |
| D — strategia | Przejście III | Weryfikacja Pierwsza W1–W4 |
| E — pismo   | Po Przejściu IV | Weryfikacja Ostateczna O1–O5 + GATE |

## Przy materiałach obszernych (≥5 dokumentów)

Nie twórz od razu pisma. Najpierw wykonaj:

### Etap A — indeks dokumentów
Dla każdego dokumentu:
- nazwa i data dokumentu
- autor i adresat
- znaczenie dla sprawy (Kluczowy / Pomocniczy / Marginalny)
- ryzyko dla naszej strony (Wysokie / Średnie / Niskie)
- czy wymaga weryfikacji dwukrotnej? (TAK jeśli Kluczowy i wpływa na predykcję)

### Etap B — fakty
Dla każdego faktu (wypełnia Przejście I):
- fakt (opis suchy, zero oceny)
- źródło (dokument + strona/akapit)
- dowód potwierdzający (dokument A lub B lub C lub D)
- status: bezsporny / sporny / nieudowodniony
- wymaga weryfikacji W1? TAK/NIE

### Etap C — przesłanki (wypełnia Przejście II)
- norma (art. X ustawy Y — pełna treść z ISAP)
- przesłanka / znamię
- fakt z Etapu B
- dowód
- status: SPEŁNIONE / NIESPEŁNIONE / WĄTPLIWE / BRAK DANYCH

### Etap D — strategia (wypełnia Przejście III)
- roszczenia i ich siła dowodowa
- zarzuty i słabości każdej ze stron
- ryzyka procesowe (symetrycznie)
- kontrargumenty i odpowiedzi
- WERYFIKACJA PIERWSZA (W1–W4): obowiązkowa przed przejściem do E

### Etap E — pismo (po Przejściu IV)
Dopiero po ukończeniu A–D ORAZ Weryfikacji Pierwszej I Ostatecznej.
Bez GATE: ZATWIERDZONE TAK → blokada generowania pisma.

## Zasada prekluzji

Fakty i dowody, które nie zostały wprowadzone do indeksu (Etap A)
i do mapy faktycznej (Etap B/Przejście I), nie mogą pojawić się
w analizie prawnej ani w raporcie końcowym.
