# MOD-FAKTY — Weryfikacja Zgodności Faktycznej Pisma ze Źródłem

*Ładuj ZAWSZE gdy pismo generowane z dostarczonych przez użytkownika:*
*akt sprawy, pozwu, odpowiedzi, pism, dowodów, dokumentów, faktur, umów,*
*wyroków, decyzji lub innych materiałów wgranych do konwersacji*
*Ładuj PO MOD-DOWODY, PRZED MOD-WALIDACJA*

---

## ZASADY MATERIAŁU ŹRÓDŁOWEGO

```
MATERIAŁ ŹRÓDŁOWY = wszystko dostarczone przez użytkownika w tej konwersacji:
  - dokumenty wgrane jako pliki (.docx, .pdf, obrazy, itp.)
  - treść wklejona bezpośrednio w wiadomości
  - fakty podane słownie przez użytkownika

DOKUMENT NIEOBECNY FIZYCZNIE W KONWERSACJI:
  → może być uznany za wykazany, jeśli jest wprost wymieniony lub opisany
    w dostarczonym materiale źródłowym (np. faktura wspomniana w piśmie,
    wyrok powołany w uzasadnieniu, umowa opisana w pozwie)
  → oznaczaj jako: [WYKAZANY POŚREDNIO — wskazany przez: źródło]
  → NIE oznaczaj jako fikcyjny — jest pośrednio potwierdzony przez źródło

FAKT FIKCYJNY = twierdzenie, data, kwota, nazwa, zdarzenie, kwalifikacja
  lub opis, które NIE wynikają w żaden sposób z materiału źródłowego
  i NIE są wymienione przez żadne ze źródeł — nawet pośrednio.
  → traktuj jako BŁĄD KRYTYCZNY (⛔)
```

---

## KROK F1 — INWENTARYZACJA TWIERDZEŃ

Wypisz wszystkie twierdzenia faktyczne z wygenerowanego pisma:

```
□ daty i godziny zdarzeń
□ kwoty (należności, odszkodowania, kary, odsetki)
□ nazwy własne (strony, sądy, organy, firmy)
□ opisy zdarzeń (co, kiedy, gdzie, jak)
□ kwalifikacje faktyczne (np. „brak wypłaty wynagrodzenia")
□ dane stron (imiona, PESEL, NIP, KRS, adresy)
□ sygnatury akt i numery decyzji
□ nazwy dokumentów (umowy, faktury, protokoły)
□ wyliczenia i sumy
```

---

## KROK F2 — PRZYPISANIE DO ŹRÓDŁA

Dla każdego twierdzenia z F1 przypisz jedno oznaczenie:

```
[✅ WPROST]
  Identyczne lub synonimiczne z materiałem źródłowym.
  Dopuszczalne — bez adnotacji.

[✅ WYKAZANY POŚREDNIO — wskazany przez: źródło]
  Dokument nieobecny fizycznie, lecz wymieniony/opisany w dostarczonym źródle.
  Dopuszczalne — oznacz dla przejrzystości.

[⚠️ PARAFRAZA]
  Uogólnienie lub przeformułowanie bliskie źródłu, ale nie identyczne.
  Dopuszczalne z adnotacją — opisz różnicę.
  Przykład: źródło: „silny uraz psychiczny" → pismo: „poważny uraz psychiczny"

[⚠️ OBLICZENIE]
  Wynik operacji arytmetycznej na danych ze źródła (suma kwot, odsetki, itd.).
  Dopuszczalne — oznacz jako obliczenie, pokaż działanie.
  Przykład: 3 faktury × [kwoty ze źródła] = [suma]

[⛔ FIKCJA]
  Brak jakiegokolwiek oparcia w materiale źródłowym.
  BŁĄD KRYTYCZNY — wymaga natychmiastowej reakcji.
```

---

## KROK F3 — KLASYFIKACJA I REAKCJA

```
JEŚLI wszystkie oznaczenia to ✅ lub ⚠️:
  → Wyświetl raport z wynikiem ✅ BRAK FIKCJI
  → Ostrzeżenia ⚠️ przekaż użytkownikowi bez blokowania pisma

JEŚLI wystąpiło choćby jedno ⛔ FIKCJA:
  → BŁĄD KRYTYCZNY
  → USUŃ twierdzenie z pisma LUB zastąp znacznikiem ⬛ [UZUPEŁNIJ: opis]
  → NIGDY nie zostawiaj fikcji w wygenerowanym piśmie
  → Zgłoś użytkownikowi: co usunięto i dlaczego
  → Raport MOD-FAKTY wyświetl ZAWSZE — nawet gdy wynik to ✅
```

---

## ZAKAZY ABSOLUTNE

```
⛔ PISMO NIE MOŻE zawierać żadnego twierdzenia faktycznego oznaczonego jako FIKCJA.
⛔ ZAKAZ uzupełniania ⬛ domysłem — czekaj na dane od użytkownika.
⛔ ZAKAZ podawania dat „orientacyjnie" gdy żadne źródło daty nie podaje.
⛔ ZAKAZ zaokrąglania kwot bez podstawy w dokumencie.
⛔ ZAKAZ dodawania opisu zdarzeń/skutków „logicznie" bez oparcia w aktach.
⛔ ZAKAZ powoływania pisma/decyzji której nie dostarczono i nie wskazuje jej żadne źródło.
```

Reguła: fakty nieznane → oznacz `⬛ [UZUPEŁNIJ: opis brakującego faktu]`.
Nigdy nie uzupełniaj ⬛ domysłem.

---

## FORMAT RAPORTU MOD-FAKTY

Wyświetl po każdym piśmie generowanym ze źródeł:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RAPORT WERYFIKACJI FAKTYCZNEJ PISMA (MOD-FAKTY)
Pismo: [typ pisma]
Materiał źródłowy: [lista wgranych dokumentów/opisów]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WYNIK: [BRAK FIKCJI ✅ / WYKRYTO BŁĘDY KRYTYCZNE ⛔]

⛔ BŁĘDY KRYTYCZNE — fakty fikcyjne (usunięte lub oznaczone ⬛):
  [nr]. "[twierdzenie]"
        Brak źródła: [wyjaśnienie co konkretnie nie ma pokrycia]
        Działanie: [usunięto / zastąpiono ⬛ [UZUPEŁNIJ: ...] / zmieniono na: ...]

⚠️ OSTRZEŻENIA — parafrazy wykraczające poza źródło:
  [nr]. "[twierdzenie w piśmie]" ← w źródle: "[oryginalne brzmienie]"
        Różnica: [opis] | Zalecenie: [zostaw / zmień na brzmienie ze źródła]

ℹ️ OBLICZENIA ARYTMETYCZNE (dopuszczalne):
  [nr]. [opis obliczenia: składniki] = [wynik]

ℹ️ WYKAZANE POŚREDNIO (nieobecne fizycznie, lecz wskazane w źródle):
  [nr]. [dokument/fakt] — wskazany przez: [źródło + fragment]

✅ ZGODNE ZE ŹRÓDŁEM: [X] twierdzeń bez zastrzeżeń
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## RELACJA Z MOD-WALIDACJA

MOD-FAKTY weryfikuje **fakty** przed złożeniem pisma.
MOD-WALIDACJA (Bloki H i I) weryfikuje **formę i spójność** po gotowym piśmie.

Kolejność obowiązkowa:
```
[1] MOD-FAKTY     — weryfikacja faktów podczas/zaraz po generowaniu treści
[2] MOD-WALIDACJA — walidacja całego gotowego pisma (w tym Bloki H i I)
```

Bloki H i I w MOD-WALIDACJA stanowią dodatkowe zabezpieczenie — nie zastępują MOD-FAKTY.
Jeśli MOD-FAKTY wyczyścił fikcje → Bloki H/I powinny przejść bez alertów krytycznych.
