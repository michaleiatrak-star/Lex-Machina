# CHANGELOG — dr-08-samorzad-terytorialny-prawo-lokalne

- 3.17 (2026-10-06): nowelizacje po t.j. (ELI 2026-10-06): PRD/u.k.p./drogi publiczne/transport drogowy — Dz.U. 2025 poz. 1676, 1734, 1843; Dz.U. 2026 poz. 180, 982; nowa ustawa o zdrowiu zwierząt Dz.U. 2025 poz. 1795

- 3.16 (2026-10-05l, AUDYT-2026-10-05l): mod-MPZP-WZ-planowanie-przestrzenne: linia „Hasła spraw”. Treść prawna bez zmian.

- 3.15 (2026-10-04c, AUDYT-2026-10-04c): **F-227 (zamknięta).** SKILL.md nie wczytywał `MAPA-POKRYCIA.md`, choć `prawny-router-v3/references/pokrycie-dziedzinowe.md` nazywa lokalną mapę jedynym bieżącym źródłem statusu pokrycia — dodana sekcja „Mapa pokrycia treściowego” z `view`, wzorem DR-02…DR-06 i DR-16. Treść prawa bez zmian. Pełny opis: `audyt-systemu-v4/references/AUDIT-JOURNAL.md`, AUDYT-2026-10-04c.

- 3.14 (2026-09-27e, AUDYT-2026-09-27e): claude.ai po dodaniu marketplace instalował wyłącznie 4 z 32 pluginów (shared, prawny-router-v3, analizator-dowodow-v3, przesluchanie-swiadkow-v2-min90); jedyna cecha wspólna tych 4, nieobecna w żadnym z 28 pozostałych, to klucz `dependencies` we frontmatterze SKILL.md. Dodano go (`requires: [shared]` — zgodnie ze stanem faktycznym) oraz jawny manifest pluginu (name, description = description z SKILL.md, author, repository, license) — host nie musi niczego wnioskować z SKILL.md. `version` w manifeście = `version:` z SKILL.md (pilnuje T38 w audyt-systemu-v4) — host rozpoznaje aktualizację po podbiciu wersji. Treść skilla bez zmian.
- 3.13 (2026-09-23, AUDYT-2026-09-23b): kanon E-1…E-5 (`shared/HIERARCHIA-ZRODEL.md` 1.10): instrukcje weryfikacji „w ISAP” / „isap.sejm.gov.pl →” zamienione na „w ELI (RZĄD 1)” (11 plików); ISAP pozostaje adresem dla człowieka; wpisy historyczne („zweryfikowano w ISAP …”) bez zmian.
- 3.12 (2026-09-10o, F-181): dochody JST: stara ustawa uchylona, jej t.j. 2024/356 tez uchylony - podstawa jest NOWA ustawa z 1.10.2024, Dz.U. 2024 poz. 1572 (zm. 2025/1659), bez tekstu jednolitego
- 3.11 (2026-09-10d, F-148a/F-135/F-141): mod-ustawa-zarzadzanie-kryzysowe: BŁĄD PODMIANY AKTU skorygowany (2024/1194 = t.j. ustawy o dozorze technicznym → 2026/574) + KROK 2C dla Dz.U. 2026 poz. 815 (F-148a)
- 3.10 (2026-09-01k, flaga F-156): **cofnięte oznaczanie nowelizacji po t.j. w mapie.**
  Wersja 3.9 wpisywała przy pozycjach liczbę nowelizacji — w ciągu doby trzy się
  rozjechały. Kolejna wersja zostawiła sam znacznik ⚠️ bez liczby; to też cofnięto,
  z mocniejszego powodu: **znacznik przy jednych pozycjach twierdzi coś o pozostałych**
  — wiersz bez ⚠️ czyta się jako „tu t.j. wystarczy", czyli jako zdanie o stanie
  rejestru na dzień oznaczania, nie na dzień użycia mapy. Zamiast oznaczeń nowa sekcja
  **„Gdzie sprawdzić nowelizacje po tekście jednolitym"**: sekcja ELI w `/references`,
  kontrola uzupełniająca aktami zmieniającymi aktu bazowego, KROK 2C HARD GATE,
  bramka F-153 i test T24. Zachowana dotychczasowa sekcja „Weryfikacja w źródle
  urzędowym" (21/21, 17/17, 17/17) — to datowany POMIAR, nie bieżące zapewnienie.
- 3.9 (2026-09-01h): **pełna weryfikacja MAPA-AKTOW w żywym ELI — 21 pozycji.**
  Numer i status `obowiązujący`: 21/21. Tytuł aktu zgodny z zakresem (kontrola podmiany,
  klasa F-149): 17/17 obwieszczeń. Wskazany t.j. jest najnowszym obowiązującym dla
  swojego aktu: 17/17. **Nie znaleziono błędu numeru ani podmiany aktu.**
  Znalezione ryzyko innego rodzaju: **11 z 17 aktów ma nowelizacje ogłoszone PO dacie
  t.j.** (transport zbiorowy 4, zabytki 3, planowanie przestrzenne i samorząd powiatowy
  po 2, sześć kolejnych po 1), a mapa oznaczała je jako 🟢 bez żadnego sygnału.
  Tekst jednolity ich nie zawiera, więc odczyt samego t.j. daje wynik niepełny
  w sposób niewidoczny. Wiersze oznaczone ⚠️ z liczbą nowelizacji; dwie pozycje
  bez t.j. (dochody JST, ochrona ludności) opisane jako ustawy z 3 aktami zmieniającymi
  każda. Dodano sekcję „Weryfikacja w źródle urzędowym" z metodą i wynikiem oraz
  zastrzeżenie, że akt prawa miejscowego z założenia nie ma numeru Dz.U. i idzie
  ŚCIEŻKĄ B-L.
- 3.8 (2026-09-01g, flaga F-154): **poprawiony adres publikatora aktów prawa
  miejscowego.** W sześciu plikach (SKILL.md + `mod-dzienniki-urzedowe-BIP-publikacja`,
  `mod-MPZP-WZ-planowanie-przestrzenne`, `mod-lokalne-podatki-oplaty-taryfy`,
  `mod-nadzor-wojewody-RIO-legalnosc-uchwal`, `mod-procedury-JST-statuty-regulaminy`),
  12 wystąpień, wskazywano `dzienniki.gov.pl`. Portalem prowadzonym przez RCL jest
  `dziennikiurzedowe.gov.pl` (dawniej `dziennikiurzedowe.rcl.gov.pl`). Dodatkowo:
  ⛔ zakaz budowania adresu serwisu wojewódzkiego z szablonu — formy różnią się
  między województwami (`edziennik.malopolska.uw.gov.pl`,
  `e-dziennik.szczecin.uw.gov.pl`, mazowieckie przez `gov.pl/web/uw-mazowiecki`);
  wejście wyłącznie przez portal zbiorczy. SKILL.md odsyła do nowej ŚCIEŻKI B-L
  w `shared/PRAWO-HARDGATE.md`.
- 3.7 (2026-08-27): F-108 P3/27 i P3/28 — wydzielono ustawy o samorządzie powiatowym i województwa do odrębnych modułów B+ opartych na ELI.

- 3.6 (2026-08-26): ujednolicono metryki tekstów jednolitych w mapie i
  modułach ustrojowych, planistycznych, nadzorczych oraz komunalnych.
