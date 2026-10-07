# REJESTR KORPUSU POMIAROWEGO — metryki bez treści

**Utworzony:** 2026-09-27f (F-167). **Nadrzędny:** `PLAN-POMIARU-BRAMEK-UNIWERSALNY.md` §4.

```
⛔ TEN PLIK NIE ZAWIERA TREŚCI KAZUSÓW — I NIE BĘDZIE JEJ ZAWIERAŁ.
```

Repozytorium jest czytane przez model wykonujący przebieg. Kazus i jego
rozwiązanie w jednym drzewie to skażenie, przez które F-166 straciła K-06,
a F-168 musiała przepisać trzy pliki bramek. Tu trzymamy wyłącznie metrykę
pozwalającą **zidentyfikować i zweryfikować** materiał, który użytkownik
dostarcza per przebieg z pliku spoza repozytorium.

**Źródło:** `Baza_kazusow_wieloaspektowych.docx` — materiał szkoleniowy
użytkownika, 14 kazusów. Przekazany do sesji audytowej 2026-09-27.
Plik pozostaje u użytkownika; w repozytorium nie ma go i mieć nie będzie.

---

## Część I — kazusy międzynarodowe (K-01…K-07)

Adaptacje dydaktyczne oficjalnych problemów konkursowych (ELMC 2026–2027,
Jessup 2026 i in.). ⚠️ **Status praw autorskich do adaptacji nierozstrzygnięty**
— kwalifikacja (art. 27/29 pr. aut. albo zgoda organizatora) należy do
użytkownika jako adwokata. Do czasu rozstrzygnięcia: materiał nie wchodzi do
repozytorium ani do żadnej paczki wydania — co i tak nakazuje reguła §4.

| Kod | Dziedzina rdzenia | Linie | SHA-256 |
|---|---|---:|---|
| K-01 | pomoc państwa, arbitraż inwestycyjny, Aarhus | 37 | `01d6c9c06f9df94b4e2429189976018c7c0c5fe37db5674f652f470b1277b7e6` |
| K-02 | atrybucja zachowania państwu, ludność rdzenna | 36 | `8af26768ff7cc5d7981234b81f0e49c3ea1fe53a950228754087b0a4cf788bde` |
| K-03 | inwigilacja cyfrowa, wolność prasy | 35 | `50528ddd83be0f94bd8e3c9dfe48a8256897d8967d81bf7e035970d6175df5a6` |
| K-04 | jurysdykcja MTK, immunitet głowy państwa | 36 | `891b4fad8388225fa87f5ddc274fc23b3fae5f5c0d4bfb3d831eb4c534e6e808` |
| K-05 | CISG, CITES, zmiana regulacyjna | 36 | `f756c89acc582555bc531eeb5828a0714bb36f6964ddfffb0fdc0b0d5f337ce3` |
| K-06 | własność obiektów kosmicznych, reżim odpowiedzialności | 36 | `7e37a844e7d0c893139ed778abaafa2520ce7f8fae4938f69832ee721eeb7a31` |
| K-07 | zasoby genetyczne, podział korzyści | 39 | `0525a57a6f17aafa595e4861f706cfb7f953dbe4b4816d5f74c9bdf584e07391` |

### ⛔ Status skażenia — CAŁA część I jest spalona dla CN-GATE i REM-GATE

| Kazus | Skażenie | Dowód |
|---|---|---|
| K-06 | ⛔ od 2026-09-05d | `MOD-CN-GATE.md` 1.0 §CN-3 cytował rozwiązanie wprost (art. II vs III) |
| K-02 | ⛔ od 2026-09-05e | `MOD-CN-GATE.md` 2.0 §CN-2 wylicza triadę „własność / obsada organów / wymóg zgody" i podaje wniosek („samo powiązanie nie przesądza; liczy się kierowanie TYM zachowaniem") — to jest rozstrzygnięcie K-02 w postaci abstrakcyjnej. Paradoks: skażenie powstało przy **naprawie** skażenia (F-168) |
| K-01, K-02, K-06 | ⛔ | `MIEDZYNARODOWE-GATES.md` §(a)(b)(c) — trzy punkty listy kontrolnej MG odpowiadają jeden-do-jednego ustaleniom K-01 (zlanie warstw jurysdykcja/prawo właściwe/wykonalność), K-02 (atrybucja per podmiot) i K-06 (założony reżim odpowiedzialności). Ten sam zestaw wymienia `dr-14/SKILL.md`. F-168 usunęła stamtąd nazwy traktatów, zostawiła mapowanie „wzorzec błędu → właściwe podejście" |
| K-03, K-04, K-05, K-07 | ⚠️ niesprawdzone | żadna bramka ich nie nazywa, ale nie wykonano systematycznego przeglądu pod kątem odwzorowania sedna |

⛔ **Wniosek operacyjny:** kryterium zamknięcia F-167 („pełny przebieg na K-02
i K-07") jest **niewykonalne w sposób czysty** — K-02 jest spalony, a dla K-07
brak przeglądu. Zmiana kryterium wymaga decyzji użytkownika (ryzyko „uznaniowego
zamknięcia", punkt 5 listy niespójności rejestru).

---

## Część II — kazusy prawa polskiego (PL-01…PL-07)

W pełni autorskie, fikcyjne stany faktyczne użytkownika. **Brak obciążeń
autorskich.** Żadna bramka ich nie nazywa i żaden nie brał udziału w powstaniu
bramek — to jedyny nieskażony materiał w korpusie.

| Kod | Dziedzina rdzenia | Linie | SHA-256 | Skażenie |
|---|---|---:|---|---|
| PL-01 | prawo pracy, sygnaliści, RODO, AI Act | 36 | `c0c3441b7145d627013c773fd7fdc1a603f0db3b529000beb013ca112628ddbc` | ✅ czysty |
| PL-02 | planowanie, budowlane, OOŚ, wody | 36 | `b1de7fbd9b9bb504213e312bcb882ae7853c56656ffe8c14014a82db66b148e0` | ✅ czysty |
| PL-03 | sukcesja, zachowek, upadłość, podatki | 36 | `6e727f82b4ba0108ea8225771d082928df9e5a73e831ec8e506f1be01cbc8ed0` | ✅ czysty |
| PL-04 | prawa pacjenta, wyrób medyczny, AI, wielopodmiotowość | 36 | `b4361863c91566bb020a3401bc4ca4dcc6aacddfd87081d1b326b10b6ae35d65` | 🟨 **użyty 2026-09-27f** |
| PL-05 | PZP, cyberbezpieczeństwo, RODO, ciągłość usług | 35 | `92004dea59343e0ee403fc48ec13011976635c0a4de863595761727cea886fa5` | ✅ czysty |
| PL-06 | VAT, KKS, AML, odpowiedzialność organów | 36 | `673a727faf30b475705f4744659979f9633c1a694682584775e8f90c750a3fcf` | 🟨 **użyty 2026-09-27f** |
| PL-07 | tryb wyborczy, dobra osobiste, DSA, dowody cyfrowe | 41 | `e6ebda4b629529958814f47aac0485d661eb9db194614d684e94e66ec05b645b` | ✅ czysty |

🟨 = użyty w pomiarze; wynik zapisany w dzienniku. Ponowne użycie tego samego
kazusu do tej samej bramki nie jest niezależnym przebiegiem — traktować jak
powtórzenie, nie jak nowy punkt pomiarowy.

**Zbiór odłożony (held-out) na pomiar zamykający:** PL-01, PL-02, PL-03, PL-05, PL-07.
Nie używać ich do strojenia niczego ani do ilustracji w żadnym module systemu —
pierwsze takie użycie je spala, dokładnie jak K-06.

---

## Jak użyć korpusu w przebiegu

```
1. użytkownik udostępnia plik źródłowy (poza repozytorium)
2. wyciąć blok jednego kazusu do osobnego pliku roboczego
3. policzyć SHA-256 i porównać z tabelą wyżej
   ⛔ niezgodność = materiał się zmienił; nie wolno zestawiać wyniku
      z wcześniejszymi przebiegami bez odnotowania zmiany
4. wpisać KAZUS-ID + SHA-256 do karty przebiegu
5. po przebiegu: plik roboczy kasuje się razem z katalogiem tymczasowym
```
