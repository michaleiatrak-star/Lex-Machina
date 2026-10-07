# PRAWO-HARDGATE-AKT-MIEJSCOWY — ścieżka B-L

> **Plik:** `shared/PRAWO-HARDGATE-AKT-MIEJSCOWY.md`
> **Wersja:** 1.0 (2026-09-10b) — wydzielony z `shared/PRAWO-HARDGATE.md` (F-180).
> **Status:** KANONICZNY. Treść bez zmian merytorycznych względem wersji sprzed wydzielenia.
> **Wyzwalacz:** przedmiotem sprawy jest akt prawa miejscowego — uchwała rady gminy,
> powiatu lub sejmiku, zarządzenie wójta/burmistrza/prezydenta, akt wojewody.

⛔ Poza tym wyzwalaczem plik jest bez zastosowania. Po jego padnięciu jest
obowiązkowy: aktów prawa miejscowego **nie ma w ELI Kancelarii Sejmu** i próba
weryfikacji ich tam zwraca fałszywy negatyw, który wygląda jak „akt nie istnieje".

---

### ŚCIEŻKA B-L — AKT PRAWA MIEJSCOWEGO (dodane 2026-09-01g, F-154)

Sekwencja B-T1…B-T3 do aktów lokalnych NIE pasuje: nie mają ELI, nie mają
tekstu jednolitego w rozumieniu obwieszczenia Marszałka Sejmu i nie mają
jednolitego wzorca adresu serwisu wojewódzkiego.

```
B-L1: portal zbiorczy https://dziennikiurzedowe.gov.pl → wybierz województwo
      ⛔ NIE buduj adresu z szablonu — formy są różne (`edziennik.…`,
         `e-dziennik.…`, wejście przez gov.pl). Weź link z portalu.
B-L2: identyfikacja aktu: Dz.Urz. Woj. {nazwa} z {rok}, poz. {N}
      + organ wydający + data ogłoszenia (dzień ogłoszenia = dzień publikacji
        elektronicznej)
B-L3: treść wyłącznie z pliku opublikowanego w dzienniku. BIP gminy jest
      źródłem POMOCNICZYM (projekty, porządek obrad) — nie publikatorem.
B-L4: sprawdź, czy aktu nie uchylono/zmieniono późniejszą uchwałą oraz czy
      nie ma rozstrzygnięcia nadzorczego wojewody / orzeczenia WSA
      stwierdzającego nieważność. ⛔ Brak takiej kontroli to ten sam błąd co
      cytowanie t.j. bez nowelizacji po jego dacie (F-153).
```

⛔ Konsolidowanego tekstu aktu prawa miejscowego zwykle NIE MA. Jeżeli akt był
zmieniany, brzmienie ustala się z aktu pierwotnego + wszystkich uchwał
zmieniających. Nie wolno przedstawiać rekonstrukcji jako tekstu urzędowego —
oznacz ją i wymień pozycje, z których powstała.
  Orzeczenia (SAOS):   https://www.saos.org.pl/api/search/judgments?caseNumber={sygnatura}
                       (⚠️ robots blokuje web_fetch; wymaga konektora lub dostępu sieciowego hosta)
  Prawo UE (CELLAR):   https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:{celex}
                       (wersje skonsolidowane: CELEX 0{...}-{YYYYMMDD})

POZIOM C — web_search / web_fetch na strony (dotychczasowe ŹRÓDŁO-1..3 poniżej):
  stosuj TYLKO gdy POZIOM A i B niedostępne lub nie znasz identyfikatora aktu
  (wtedy web_search służy do USTALENIA identyfikatora, a cytat i tak pobierz z POZIOMU A/B).
```
