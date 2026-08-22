---
name: dr-07-zamowienia-publiczne-fundusze-ue
version: 3.5
description: |
  DR-07: Zamówienia Publiczne, Fundusze UE, Pomoc Publiczna
  Jeden moduł = jeden akt prawny (Dz.U.) lub wydzielony rozdział aktu.
  Ładuj TYLKO moduł pasujący do sprawy — lazy loading.
  Wchodzi z: prawo-polskie-v2 → ROUTING-MAP → ten skill.
  Weryfikacja: isap.sejm.gov.pl | uzp.gov.pl | orzeczenia.uzp.gov.pl + shared/INTERPRETACJE-URZEDOWE.md (rejestr interpretacji urzędowych per dziedzina)
---

# DR-07 — Zamówienia Publiczne, Fundusze UE, Pomoc Publiczna

## ⛔ HARD GATE — ZAKAZ CYTOWANIA Z PAMIĘCI

**PRZED każdym powołaniem przepisu, artykułu, terminu lub sygnatury:**
1. Zweryfikuj brzmienie i Dz.U. w `isap.sejm.gov.pl`
2. Zweryfikuj orzeczenie w `orzeczenia.ms.gov.pl` / `nsa.gov.pl` / `sn.pl`
3. **NIGDY** nie podawaj artykułu, terminu, kary ani sygnatury wyłącznie z pamięci modelu.

> Procedura szczegółowa (warstwa strukturalna SAOS/MCP, kontrakt sygnatur,
> gradient weryfikacji cytatu): `view shared/PRAWO-HARDGATE.md` — wczytaj
> PRZED pierwszym przepisem w każdej odpowiedzi. Integruje się z
> `shared/ISAP-AUDIT-PROTOCOL.md`.

---

## Zasada architektoniczna
- Jeden moduł = jeden akt prawny (tekst jednolity Dz.U.)
- Wyjątek: wydzielone rozdziały jednej ustawy mogą mieć osobny moduł (z adnotacją)
- Ten sam akt NIE może pokrywać dwóch różnych DR-skills
- **Zakaz cytowania przepisów i kwot z pamięci — każde brzmienie weryfikuj w ISAP**
- **Terminy w KIO są absolutne i zawite — minuty decydują**

## ORKA-BAS — Definicje wspomagające (shared/ORKA-BAS-LEKSYKON.md)

Przy sprawach z tej dziedziny rozważ doładowanie (`view`) definicji:
- BAS-W17 Rażąco niska cena (PZP art. 224 — brak definicji legalnej, linia KIO)

## DEFINICJE — shared/definicje/ (nieobecne — adnotacja audytowa 2026-06-14)

Ta dziedzina nie ma dedykowanego pliku w `shared/definicje/`. Zamówienia publiczne, fundusze UE, pomoc publiczna — pojęcia (wykonawca, zamawiający, oferta, rażąco niska cena, kryteria oceny ofert) mają definicje ustawowe wprost w PZP (art. 7) i nie wymagają osobnego pliku w shared/definicje/. Żaden plik tematyczny nie obejmuje dziedziny PZP.
## Moduły (19 łącznie — ✓ 19 OK, ☐ 0 STUB)

**NAPRAWA 2026-08-22:** dodano `mod-PZP-dzial-IV-szczegolne-
instrumenty.md` — naprawa poz. #3 rekomendowanej kolejności raportu
pokrycia PZP: Dział IV (art. 311-361), dotąd 🔴 śladowo pokryty
(tylko wzmiankowane nazwy instrumentów bez treści proceduralnej).
Obejmuje umowę ramową (311-315, w tym okres obowiązywania max 4 lata
i relacja do Działu VII), dynamiczny system zakupów (316-324),
konkurs (325-358, w tym jedyny obligatoryjny przypadek — projektowanie
architektoniczne) i zamówienia na usługi społeczne (359-361, próg
750 000 EUR odrębny od progów standardowych). Rząd 1:
ekomentarzpzp.uzp.gov.pl (komentarz oficjalny UZP), portalzp.pl,
lexlege.pl.

**NAPRAWA 2026-08-14:** dodano `mod-PZP-dzial-II-kwalifikacja-kryteria-
uniewaznienie.md` — zamyka rdzeń F-71: Dział II PZP (183 art., >1/4
ustawy), sam rdzeń klasycznego przetargu generujący najwięcej sporów.

```
  [✓] NOWY  mod-PZP-dzial-IV-szczegolne-instrumenty
              (dodany 2026-08-22, naprawa poz. #3 rekomendowanej
               kolejności raportu pokrycia PZP. ⭐⭐⭐ Trzy rdzenie:
               [1] umowa ramowa — NIE jest samodzielnym zamówieniem,
               nie kreuje wzajemnego zobowiązania stron, max 4 lata
               [wyjątki: przedmiot/interes zamawiającego, obronność
               >7 lat], dwa warianty przy jednym wykonawcy [313 §1
               pełna konsumpcja / §2 uzupełnienie oferty]; [2] konkurs
               — JEDYNY obligatoryjny przypadek to projektowanie
               architektoniczne/architektoniczno-budowlane powyżej
               progów unijnych [325 §2], katalog dziedzin otwarty
               z nowością projektowania informatycznego i zamierzenia
               innowacyjnego; [3] usługi społeczne — próg 750 000 EUR
               ODRĘBNY od progów standardowych, brak własnej procedury,
               tylko fakultatywne uproszczenia [360]. Ponadto:
               dynamiczny system zakupów [316-324, wyłącznie usługi/
               dostawy/roboty OGÓLNIE DOSTĘPNE, pełna elektronizacja
               komunikacji])
  [✓] OK    mod-PZP-zamowienia-publiczne-KIO
  [✓] NOWY  mod-PZP-dzial-II-kwalifikacja-kryteria-uniewaznienie
              (dodany 2026-08-14 — naprawa F-71: warunki udziału [112,
               4 kategorie zamknięte, zasada ciągłości spełniania],
               JEDZ i mechanizm dwuetapowy [125/126 — pełne dokumenty
               żąda się TYLKO od zwycięzcy rankingu], kryteria oceny
               ofert [239-243, wymóg jednoznaczności art. 240 —
               najczęściej naruszany przepis], unieważnienie [255 —
               katalog zamknięty obligatoryjny, 256 — fakultatywne,
               NIE wytrych, z przykładem orzeczniczym])
              (2026-07-18: naprawiono martwy odnośnik "Zamówienia obronne
               → DR-13" oraz rozbudowano przetarg nieograniczony/ograniczony)
  [✓] NOWY  mod-PZP-otwarcie-badanie-ofert-przebieg-KIO
              (dodany 2026-08-20 — naprawa F-71, pozostała część flagi:
               otwarcie ofert [art. 222, transparentność nazw/siedzib],
               badanie i ocena ofert [art. 223, zakaz negocjacji i
               zmiany treści oferty], uzupełnienie przesłanek odrzucenia
               [art. 226]; szczegółowy przebieg rozprawy przed KIO —
               dowody [art. 536/539/541, ⚡ PREKLUZJA DOWODOWA od
               12.06.2026, nowelizacja deregulacyjna art. 28 ustawy
               21.05.2025], odroczenie i otwarcie rozprawy na nowo
               [art. 550-551], rodzaje orzeczeń wyrok/postanowienie
               [art. 552-555, zakaz orzekania ponad zarzuty — kluczowe
               dla redakcji odwołania]. ⚠️ [NIEWERYFIKOWANE RZĄD 1]
               większość treści. F-71 ZAMKNIĘTA W CAŁOŚCI tym modułem)
  [✓] OK    mod-PZP-dzial-I-podstawy-wylaczenia-szacowanie
              (dodany 2026-07-18: próg podstawowy 170 000 zł, wyłączenia
               stosowania ustawy art. 9-15 (usługi prawne, nieruchomości
               z zastrzeżeniem SN, badania naukowe), zasady art. 16-20,
               zakaz dzielenia zamówienia art. 29-30. Najwyższy priorytet
               z audytu pokrycia PZP)
  [✓] OK    mod-PZP-dzial-V-VI-sektorowe-obronne-infrastruktura-krytyczna
              (dodany 2026-07-18: 7 sektorów działalności, "przedsiębiorstwa
               publiczne" = korporacje pod dominującym wpływem publicznym,
               mechanizm art. 131a ust. 1a — infrastruktura krytyczna +
               niejawny wykaz RCB → surowszy reżim obronny)
  [✓] OK    mod-PZP-dzial-XI-XII-kontrola-kary-UZP
              (dodany 2026-07-18: kontrola doraźna/uprzednia Prezesa UZP
               [odrębna od NIK/RIO — bada TYLKO zgodność z PZP, nie
               gospodarność], kary pieniężne 3000-150000 zł, termin 4 lat
               na unieważnienie umowy)
  [✓] OK    mod-PZP-fundusze-UE-podwojny-rezim
              (dodany 2026-07-18: podwójny reżim PZP + Wytyczne
               kwalifikowalności, zasada konkurencyjności poniżej progu
               PZP, taryfikator korekt finansowych 3 kategorie)
  [✓] OK    mod-PZP-opis-przedmiotu-zakaz-znakow-towarowych
              (dodany 2026-07-18: art. 99 ust. 4-6 — zakaz wskazywania
               znaków towarowych/producenta, NARUSZENIE POŚREDNIE przez
               dobór parametrów "szytych pod" jednego producenta, test
               obiektywnego uzasadnienia vs sam skutek)
              (progi UE 2026-2027, tryby, wykluczenie, odrzucenie, RNC,
               środki ochrony, zmiana umowy, predykcja, strategia)
  [✓] OK    mod-PZP-wykonanie-umowy-compliance
              (wydzielony 2026-06-14 z mod-PZP >400 linii: compliance SWZ/OPZ
               art. 99 PZP, podwykonawstwo art. 462-475, zabezpieczenie
               art. 449-453, certyfikacja wykonawców)
  [✓] OK    mod-ustawa-arbitraz-mediacja
  [✓] OK    mod-PrNotariat-notariat-rejestry
  [✓] OK    mod-ustawa-fundusze-UE-pomoc-publiczna
              (fundusze UE 2021-2027 + polityka rozwoju + pomoc publiczna)
  [✓] OK    mod-ustawa-PPP-i-koncesja
              (partnerstwo publiczno-prywatne + koncesja)
  [✓] OK    mod-ustawa-NIK
  [✓] OK    mod-ustawa-RIO-regionalne-izby
  [✓] OK    mod-ustawa-dyscyplina-finansow-publicznych
  [✓] OK    mod-ustawa-Prokuratorii-Generalnej
  [✓] OK    mod-ustawa-PZP-certyfikacja-wykonawcow
              (certyfikacja od 12.07.2026 — nowa ustawa Dz.U. 2025 poz. 1235)
```

## Jak wywołać

```
view /mnt/skills/user/dr-07-zamowienia-publiczne-fundusze-ue/modules/[nazwa-modulu].md
```

## Lokalna mapa aktów prawnych

```
view /mnt/skills/user/dr-07-zamowienia-publiczne-fundusze-ue/MAPA-AKTOW.md
```

## Mapa pokrycia treściowego (planowanie rozwoju skilla)

Rejestr informacyjny — NIE krok obowiązkowy przy obsłudze konkretnej sprawy.
Przydatny przy planowaniu, które luki uzupełnić w pierwszej kolejności, oraz
przy nowelizacjach — pokazuje od razu czy dotknięty fragment ma treść do
zaktualizowania. (F-83, zasilony 2026-08-22; obejmuje na razie wyłącznie
PZP — drugi najlepiej pokryty akt w całym audycie źródłowym):

```
view /mnt/skills/user/dr-07-zamowienia-publiczne-fundusze-ue/MAPA-POKRYCIA.md
```

## Powiązania zewnętrzne
- Wchodzi z: `prawo-polskie-v2` → `ROUTING-MAP.md` → ten skill
- Finanse publiczne (UFP, NIK, RIO): patrz też `dr-06` → `mod-UFP-finanse-publiczne-NIK-RIO`
- Samorząd terytorialny: `dr-08`
- Zamówienia obronne: `dr-13`
- Wychodzi do: `pisma-procesowe-v3` / `analiza-sadowa-v6` / `orzeczenia-sadowe-v2`
- Weryfikacja prawa: isap.sejm.gov.pl
- Orzecznictwo KIO: orzeczenia.uzp.gov.pl (Faza 1-K, orzeczenia-sadowe-v2) | UZP: uzp.gov.pl

## ⚖️ DISCLAIMER (obowiązkowy)

Po zakończeniu analizy lub przed oddaniem odpowiedzi zawierającej ocenę prawną:

```text
view /mnt/skills/user/shared/DISCLAIMER.md
```

Wybierz wariant odpowiedni do trybu:
- **PRAWNIK / kancelaria** → wariant techniczny (art. 4 Prawa o adwokaturze / art. 6 u.r.p.)
- **LAIK / pro se** → wariant uproszczony (informacja ≠ porada prawna)

Disclaimer musi być **ostatnim elementem** każdej odpowiedzi zawierającej analizę prawną,
ocenę szans, kwalifikację prawną lub interpretację przepisu.
