# mod-ustawa-monopole-panstwowe

**Akty:** Konstytucja RP — Dz.U. 1997 nr 78 poz. 483 | ustawa o grach hazardowych (UGH) — t.j. Dz.U. 2025 poz. 595 (zm. 2026/1040 [OD 2027-01-01: 2026/1040] — art. 88a; 2026/1206 [OD 2027-01-11: 2026/1206] — art. 63; 2026/176 [OD 2027-02-18: 2026/176] — art. 10, 42, 43; żadna nie zmienia art. 5) | Prawo pocztowe (PrPoczt) — t.j. Dz.U. 2026 poz. 558 | KPC — t.j. Dz.U. 2026 poz. 468 (zm. 2026/473, 830, 1003, 1046, 1296 — w mocy, żadna nie dotyczy art. 165) | ustawa o NBP — t.j. Dz.U. 2022 poz. 2025 (zm. 2026/340 — nie dotyczy art. 4; 2026/1098 [OD 2027-01-01: 2026/1098] — art. 38 ust. 2 pkt 6, nie dotyczy art. 4) | ustawa o dokumentach publicznych (UDP) — t.j. Dz.U. 2026 poz. 1208.
**Brzmienie:** przed powołaniem pobierz z ELI (RZĄD 1): `isap_tekst` albo `https://api.sejm.gov.pl/eli/acts/DU/<rok>/<poz>/text.pdf` dla aktu z listy (np. UGH `.../DU/2025/595/...`, UDP `.../DU/2026/1208/...`) kanałem hosta; zmiany po t.j. — ELI, „Akty zmieniające”.
**Moduł wskazuje przepis i jego funkcję (kwalifikator), nie zastępuje brzmienia.** Kwalifikatory sprawdzone z t.j. w ELI 2026-11-13.

Rozgraniczenie: monopol państwowy = wyłączność ustanowiona ustawą; pozycja dominująca i jej nadużycie = `mod-ustawa-UOKIK-antymonopolowe`.

---

## FAZA 0 — INTAKE

```
□ Jaka „wyłączność”: ustawowa (monopol), koncesja/zezwolenie, operator wyznaczony, umowa (kontrakt), faktyczna dominacja?
□ Jaki przepis ustawy ją ustanawia i kto ją wykonuje?
□ Czy spór dotyczy legalności działalności klienta w obszarze monopolu, skutku procesowego (nadanie pisma), czy zgodności z prawem UE?
□ Data stanu prawnego (monopole i wyłączności bywają zmieniane nowelizacjami).
```

---

## 1. PODSTAWA KONSTYTUCYJNA

| Przepis | Kwalifikator | Pułapki |
|---|---|---|
| Konstytucja art. 216 ust. 3 | ustanowienie monopolu następuje w drodze ustawy | nie rozporządzeniem ani aktem wewnętrznym |
| Konstytucja art. 22 | ograniczenie wolności działalności gospodarczej tylko ustawą i tylko ze względu na **ważny interes publiczny** | przesłanka brzmi „interes publiczny”, nie „społeczny” |
| Konstytucja art. 227 ust. 1 | NBP — wyłączne prawo emisji pieniądza oraz ustalania i realizowania polityki pieniężnej | |
| ustawa o NBP art. 4 | NBP — wyłączne prawo emitowania znaków pieniężnych RP | emisja (władztwo) ≠ fizyczna produkcja |

Wykładnia monopolu — ścisła (wyjątek od art. 22). Orzecznictwo TK (np. SK 35/08 z 19.01.2010 — według poprzedniej wersji modułu) — snapshot; sprawdź w otk.trybunal.gov.pl przed powołaniem.

---

## 2. GRY HAZARDOWE (UGH)

| Przepis | Kwalifikator | Pułapki |
|---|---|---|
| UGH art. 5 ust. 1 | monopol państwa: gry liczbowe, loterie pieniężne, telebingo, gry na automatach poza kasynem gry | |
| art. 5 ust. 1a | gry multijurysdykcyjne (liczbowe, loterie) | |
| art. 5 ust. 1b | **urządzanie gier hazardowych przez Internet** objęte monopolem — z wyjątkiem zakładów wzajemnych i loterii promocyjnych | np. kasyno internetowe = monopol, nie koncesja |
| art. 5 ust. 1c | automaty poza kasynem — wyłącznie w salonach gier na automatach | |
| art. 5 ust. 2 | wykonywanie monopolu należy do **ministra właściwego do spraw aktywów państwowych**, który tworzy jednoosobowe spółki Skarbu Państwa (w porozumieniu z ministrem finansów) | nie Prezes Rady Ministrów; podmiot wykonujący w praktyce — sprawdź aktualny stan (np. KRS) |
| art. 5 ust. 3 | do działalności monopolowej nie stosuje się przepisów o ochronie konkurencji | |
| art. 6 ust. 1–3 | poza monopolem: kasyno (koncesja), bingo pieniężne (zezwolenie), zakłady wzajemne (zezwolenie, także online) | ust. 5: tylko S.A. lub sp. z o.o. z siedzibą w RP; ust. 6: wymogi co do udziałowców (UE/EFTA) |

Zgodność monopolu z prawem UE (swoboda usług) — sprawdź orzecznictwo TSUE przy sprawie transgranicznej (`orzeczenia-sadowe-v2`, DR-14).

---

## 3. POCZTA — OPERATOR WYZNACZONY (nie monopol)

| Przepis | Kwalifikator | Pułapki |
|---|---|---|
| PrPoczt art. 3 pkt 13 | operator wyznaczony — operator obowiązany do świadczenia usług powszechnych | |
| PrPoczt art. 71 ust. 1 | wybór na 10 lat przez Prezesa UKE, decyzją, spośród operatorów wyłonionych w konkursie | art. 73 ust. 3–4 — konkurs nierozstrzygnięty → obowiązki wykonuje dotychczasowy operator wyznaczony; Prezes UKE przedłuża je decyzją na 3–10 lat |

Obowiązujące Prawo pocztowe nie przewiduje obszaru zastrzeżonego (wyłączności) dla operatora wyznaczonego; „obszar zastrzeżony” występuje w t.j. 2026/558 tylko w przepisach o rachunkowości regulacyjnej. Status Poczty Polskiej jako operatora wyznaczonego i okres wyznaczenia — sprawdź w decyzji Prezesa UKE (stan faktyczny, nie norma).

### Nadanie pisma procesowego (KPC art. 165 § 2)

| Przepis | Kwalifikator | Pułapki |
|---|---|---|
| KPC art. 165 § 2 | oddanie pisma w polskiej placówce **operatora świadczącego pocztowe usługi powszechne** w RP albo w placówce operatora świadczącego takie usługi w innym państwie UE = wniesienie do sądu | brzmienie nie odsyła do „operatora wyznaczonego”; ustal, czy dany operator świadczy usługi powszechne |
| KPC art. 165 § 3 | żołnierz — dowództwo jednostki; osoba pozbawiona wolności — administracja zakładu; załoga statku — kapitan | |
| KPC art. 165 § 4 | system teleinformatyczny / portal informacyjny — z chwilą wskazaną w elektronicznym potwierdzeniu, gdy przepis szczególny przewiduje taki sposób | |
| KRO art. 8 § 3 (dla porównania) | zaświadczenie duchownego: nadanie przesyłką poleconą w placówce **operatora wyznaczonego** | różne kryteria w różnych ustawach — sprawdzaj każdą osobno |

Pułapka praktyczna: termin zawity + wątpliwość co do statusu operatora → nadaj u operatora wyznaczonego albo wnieś elektronicznie (jeśli dopuszczalne) — jedyna opcja bez ryzyka sporu. Odpowiedniki w KPA, Ordynacji podatkowej, KPK, PPSA — brzmienie z ELI, kryteria mogą się różnić. TSUE C-545/17 (27.03.2019) — snapshot dot. dawnego brzmienia; sprawdź przed powołaniem. Powiązanie: `prawo-polskie-v2/krajowe/pisma-procesowe-v3/modules/MOD-OPLATY.md`.

---

## 4. ZNAKI PIENIĘŻNE I DOKUMENTY PUBLICZNE

| Przepis | Kwalifikator | Pułapki |
|---|---|---|
| UDP art. 16a ust. 1 | Polskiej Wytwórni Papierów Wartościowych S.A. („wytwórca wyłączny”) powierza się prawo wyłączne z art. 17 dla niektórych dokumentów z art. 5 ust. 2 — ze względu na bezpieczeństwo państwa i porządek publiczny | dodany ustawą z 4.12.2025 (Dz.U. 2025 poz. 1881), w życie od 31.12.2025 — nie jest już projektem |
| UDP art. 16a ust. 2 | wykaz dokumentów objętych prawem wyłącznym — rozporządzenie Rady Ministrów | sprawdź aktualne rozporządzenie w ELI |
| UDP art. 17 ust. 1 | prawo wyłączne: wytwarzanie blankietów dokumentów z art. 5 ust. 2 pkt 16, 17, 19 i 32 lit. a–e, g, h, m oraz z rozporządzenia; może obejmować indywidualizację i personalizację w procesie wytwarzania | ust. 2–3: certyfikat ISO 14298, świadectwo bezpieczeństwa przemysłowego („tajne”); ust. 4–5: odpłatnie, cena w umowie z emitentem; ust. 6: niektóre dokumenty z pkt 32 może wytwarzać ABW |
| UDP art. 18 | dokumenty z art. 5 ust. 3 i 4 — wytwórca wyłączny **albo** inne podmioty spełniające wymogi bezpieczeństwa | tu brak wyłączności |

Fizyczna produkcja monet i banknotów dla NBP nie jest monopolem ustawowym w rozumieniu art. 216 ust. 3 — wynika z umów NBP z wykonawcami (stan faktyczny — sprawdź aktualne umowy i komunikaty NBP). Status właścicielski spółek (Mennica Polska, PWPW) — KRS, nie moduł.

Zgodność wyłączności PWPW z prawem UE (zamówienia publiczne) — wcześniejsze postępowania TSUE dotyczyły stanu sprzed art. 16a; sprawdź aktualny status (curia.europa.eu) przed opinią.

Monopole historyczne (spirytusowy, tytoniowy, solny) — nie obowiązują; dziś reglamentacja koncesyjno-akcyzowa (DR-06).

---

## WORKFLOW

1. Ustal podstawę wyłączności (konstytucja / ustawa / decyzja / umowa / rynek).
2. Pobierz z ELI brzmienie przepisu ustanawiającego wyłączność i ustal, kto ją wykonuje.
3. Sprawdź zmiany po t.j. (Akty zmieniające) i orzecznictwo TK/TSUE — tylko po weryfikacji.
4. Przy terminach procesowych — przepis o nadaniu pisma w danej procedurze, nie ogólna wiedza o „monopolu poczty”.

## QUALITY GATE

- [ ] Brzmienie każdego powołanego przepisu pobrane z ELI (nie z kwalifikatora)?
- [ ] Odróżniono monopol ustawowy od koncesji, operatora wyznaczonego i wyłączności umownej?
- [ ] Przy nadaniu pisma ustalono kryterium z właściwej procedury (np. KPC art. 165 § 2)?
- [ ] Stan faktyczny (kto wykonuje monopol, kto jest operatorem) potwierdzony w KRS / decyzji, nie z modułu?

## OUTPUT

1. Kwalifikacja wyłączności (przepis + brzmienie z ELI); 2. Podmiot wykonujący; 3. Skutki dla klienta (legalność działalności, termin, zamówienie);
4. Ryzyka (prawo UE, zmiany ustawowe); 5. Rekomendacja.

## ŁĄCZ Z

| Sytuacja | Skill / Moduł |
|---|---|
| Pozycja dominująca, praktyki ograniczające konkurencję | `mod-ustawa-UOKIK-antymonopolowe` |
| Terminy i opłaty w piśmie procesowym | `prawo-polskie-v2/krajowe/pisma-procesowe-v3/modules/MOD-OPLATY.md` |
| Akcyza, koncesje alkoholowe i tytoniowe | DR-06 |
| Prawo UE (swobody, zamówienia) | DR-14 |
| Orzecznictwo TK / TSUE | `orzeczenia-sadowe-v2` |
