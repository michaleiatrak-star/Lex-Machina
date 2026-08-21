# MOD-TRESC-MERYTORYCZNA — Weryfikacja treści merytorycznej modułów DR po zmianie przepisu

## Cel

FAZA 3 (A–D) oraz `SYNC-DZU-AUTOMATYCZNY.md` odpowiadają na pytanie:
**"czy numer Dz.U. przypisany do aktu w mapie jest wciąż aktualny?"**

Ten moduł odpowiada na inne pytanie, dotąd nieobsługiwane systemowo:
**"skoro numer/tekst aktu się zmienił — czy to, co moduł `dr-XX/modules/mod-*.md`
faktycznie TWIERDZI o treści przepisu (progi, terminy, definicje, tryby,
stawki, przesłanki) nadal jest zgodne z aktualnym stanem prawnym?"**

To rozróżnienie jest celowe i krytyczne: aktualizacja numeru t.j. w
`mapa_dzu`/`MAPA-AKTOW.md` **nie gwarantuje**, że opisowa treść merytoryczna
modułu DR (często pisana jako podsumowanie przesłanek, a nie jako cytat)
została sprawdzona pod kątem tego, co konkretnie zmieniła nowelizacja.
Dotychczas FAZA 3 kończyła się na przesunięciu wiersza `OK` → `PREV` w
tabeli — bez kroku "czy treść modułu wymaga edycji".

---

## Kiedy się uruchamia

Automatycznie, jako **FAZA 3E**, zawsze gdy FAZA 3 (dowolny podtryb: 3A–3D
lub `TRYB DZU`) zakończyła się z co najmniej jednym z:

- nowym wpisem `TJ` (nowy tekst jednolity) w `mapa_dzu` (efekt 3A/3B),
- pozycją przeniesioną z MONITORING do tabeli głównej ze statusem `✅ WSZEDŁ` (efekt 3D),
- pozycją zamkniętą z tabeli "do weryfikacji" (3C) jako "TAK, jest nowszy akt".

Jeśli FAZA 3 nie wykryła żadnej zmiany — FAZA 3E jest pomijana (nie ma
niczego do skonfrontowania z treścią modułów), co należy odnotować:
`FAZA 3E: pominięta — brak zmian Dz.U. w tej sesji`.

Można też wywołać punktowo: **"sprawdź czy moduł X wymaga aktualizacji po
zmianie Y"** → pomija 3A–3D, wchodzi wprost w procedurę poniżej dla
wskazanego aktu/modułu.

---

## Procedura

### Krok 1 — Zidentyfikuj dotknięty moduł

Dla każdej zmiany wykrytej w FAZA 3 (nowy t.j. / WSZEDŁ / nowszy akt w 3C):

```bash
grep -rl "<nazwa aktu lub skrót>" /mnt/skills/user/dr-*/modules/*.md /mnt/skills/user/dr-*/MAPA-AKTOW.md
```

Skorzystaj z kolumny `Moduł` w `MAPA-AKTOW.md` danej dziedziny (jeśli
wypełniona) zamiast zgadywać po nazwie — to pole istnieje właśnie po to,
by mapować akt → plik modułu.

Jeśli żaden moduł DR nie opisuje tego aktu merytorycznie (np. akt
katalogowany tylko dla kompletności mapy, poza aktywnym zakresem
skilli) — odnotuj `BRAK MODUŁU DOTKNIĘTEGO` i zamknij ten wiersz bez
dalszych kroków.

### Krok 2 — Ustal zakres zmiany (co konkretnie się zmieniło)

⛔ **PRAWO-HARDGATE stosuje się i tutaj**: nie wolno zgadywać ani odtwarzać
z pamięci, co zmieniła nowelizacja. Źródła w kolejności pierwszeństwa:

1. ISAP → zakładka "Akty uchylone/zmieniające" lub "Historia aktu" dla
   danej pozycji — sekcja pokazuje które artykuły zostały zmienione/dodane/uchylone.
2. Dla nowego t.j.: ISAP zwykle publikuje obwieszczenie z listą zmian od
   poprzedniego t.j. — sprawdź nagłówek obwieszczenia.
3. Jeśli ISAP nie podaje zwięzłej listy zmienionych artykułów — porównaj
   ręcznie tylko te fragmenty tekstu jednolitego, które odpowiadają
   artykułom faktycznie cytowanym/opisywanym w module (nie cały akt —
   patrz "Zakres" niżej).

Zapisz wynik jako listę: `art. X — [dodany/zmieniony/uchylony] — treść zmiany w 1 zdaniu`.

### Krok 3 — Zakres konfrontacji (tylko to, co moduł faktycznie opisuje)

Nie porównuj całego aktu z całym modułem — to niewykonalne i niepotrzebne.
Wczytaj moduł i wypisz wyłącznie te elementy, które są **twierdzeniami o
treści prawa** (nie metadanymi):

- konkretne liczby: progi kwotowe, terminy, stawki, procenty,
- nazwane przesłanki/warunki ("wymaga się", "nie dotyczy gdy", "próg wynosi"),
- numery artykułów przywołane wprost jako podstawa twierdzenia,
- definicje pojęć przypisane danej ustawie.

Dla każdego takiego elementu sprawdź, czy dotyczy artykułu z listy z Kroku 2.
Jeśli TAK → **CRIT-TREŚĆ** (potencjalna nieaktualność merytoryczna, nie tylko numeru).
Jeśli element modułu dotyczy artykułu spoza listy zmian → pomiń (nie
dotyczy tej nowelizacji).

### Krok 4 — Klasyfikacja wyniku

| Wynik | Znaczenie | Akcja |
|---|---|---|
| ✅ ZGODNE | Zmienione artykuły nie pokrywają się z żadnym twierdzeniem modułu | Brak akcji, odnotuj w raporcie jako sprawdzone |
| ⚠️ WARN-TREŚĆ | Zmiana dotyczy artykułu przywołanego w module, ale nie zmienia sensu twierdzenia (np. zmiana redakcyjna/numeracji bez zmiany normy) | Odnotuj w `WARN-OTWARTE.md`, zaktualizuj przy najbliższej edycji modułu |
| ❌ CRIT-TREŚĆ | Zmiana dotyczy artykułu, a moduł opisuje go w sposób sprzeczny z nowym brzmieniem (stara liczba/przesłanka/termin) | Obowiązkowa naprawa treści modułu w tej samej sesji — patrz Krok 5 |

### Krok 5 — Naprawa treści (tylko dla CRIT-TREŚĆ)

1. Skopiuj moduł do edycji (nigdy `sed -i` na `/mnt/skills/user/` — read-only mount, patrz zasada w FAZA 2D).
2. `str_replace` na dokładnie tym fragmencie, którego dotyczy nieaktualność — nie przepisuj całego modułu.
3. Zachowaj styl i strukturę reszty modułu (ten sam poziom szczegółowości, ten sam format list/tabel).
4. Dodaj przy zmienionym fragmencie adnotację źródła: `(wg [nazwa aktu], stan na DD.MM.RRRR — zweryfikowano ISAP)` — zgodnie z FACT-SOURCE-LOCK ze `shared/`.
5. **ZASADA 7 (OUTPUT-COMPLETENESS) stosuje się wprost**: naprawiony moduł
   dostarczany jest jako część **całego skilla DR-XX** (wszystkie pliki),
   nie jako pojedynczy plik `mod-*.md` wyrwany z kontekstu — patrz sekcja
   "Dostarczanie" w SKILL.md nadrzędnym oraz `scripts/dostarcz_skill.sh`.

---

## Raport (sekcja do FAZA 6, jako `### 4C. TREŚĆ MERYTORYCZNA MODUŁÓW`)

```
### 4C. TREŚĆ MERYTORYCZNA MODUŁÓW (FAZA 3E)

| Akt (zmiana) | Moduł dotknięty | Art. zmienione | Wynik | Akcja |
|---|---|---|---|---|
| Ordynacja podatkowa Dz.U. 2026.622 | dr-06/mod-OP-ordynacja-podatkowa.md | art. 70 §1 (termin) | ❌ CRIT-TREŚĆ | naprawiono str_replace, patrz wpis journal |
| KC Dz.U. 2025.1071 (nowy t.j.) | dr-02/mod-*.md | brak zmian normatywnych (t.j. redakcyjny) | ✅ ZGODNE | brak akcji |
```

Jeśli FAZA 3E była pominięta (brak zmian w tej sesji) — sekcja zawiera
tylko: `FAZA 3E: pominięta — brak zmian Dz.U. w tej sesji`.

---

## Ograniczenia (świadome, nie do obejścia)

- Ten moduł **nie zastępuje** merytorycznej sesji dedykowanej dla zmian
  systemowych/strukturalnych (patrz np. wpisy 4.16/4.12 w AUDIT-JOURNAL,
  gdzie audyt świadomie zostawiał flagę otwartą "wymaga sesji dedykowanej").
  FAZA 3E obsługuje zmiany **punktowe, jednoznacznie mapowalne** na
  konkretny fragment konkretnego modułu. Zmiany o szerokim, niejasnym
  zakresie → flaga PILNA + sesja dedykowana, tak jak dotychczas.
- FAZA 3E nie uruchamia się dla WARN z sekcji 3C dopóki WARN nie zostanie
  faktycznie zamknięty jako "TAK, jest nowszy akt" — nie analizuje treści
  na podstawie samego podejrzenia.
- Klasyfikacja WARN-TREŚĆ / CRIT-TREŚĆ wymaga **zrozumienia sensu zmiany**,
  nie tylko faktu że numer artykułu się pojawił na liście — redakcyjna
  zmiana numeracji bez zmiany normy to WARN, nie CRIT (patrz historyczne
  fałszywe alarmy 4.16/4.15 — ta sama ostrożność dotyczy tutaj treści, nie
  tylko numerów Dz.U.).
