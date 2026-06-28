# MOD-WSTAWKI — Usuwanie wstawek opisowych

## Cel
Wykrywa i usuwa wstawki opisowe (narracyjne komentarze, meta-opisy, frazy wyjaśniające przeznaczenie skilla), które nie wnoszą wartości operacyjnej — tzn. nie są instrukcją, regułą, przykładem kodu ani definicją.

---

## Definicja "wstawki opisowej"

Wstawka opisowa to fragment tekstu, który:
- Opisuje **co skill robi**, zamiast **jak go używać**
- Zawiera frazy: *"Ten skill służy do..."*, *"Celem tego modułu jest..."*, *"Poniżej znajdziesz..."*, *"W tej sekcji omówiono..."*
- Jest tautologiczny wobec nagłówka sekcji (nagłówek już mówi to samo)
- Zawiera powitania, intro-paragrafy, outro-paragrafy bez treści normatywnej

**Przykład wstawki do usunięcia:**
```
## Cel
Ten moduł ma na celu zapewnienie użytkownikowi możliwości przeprowadzenia
kompleksowej analizy prawnej w oparciu o obowiązujące przepisy prawa polskiego.
```
→ Jeśli poniżej jest lista kroków — akapit intro jest zbędny.

**Przykład tekstu, który ZOSTAJE:**
```
## Cel
Audyt jakości, spójności i bezpieczeństwa systemu prawniczych skilli AI.
Po zakończeniu audytu: **obowiązkowa aktualizacja plików references**.
```
→ Zwięzłe, operacyjne, nie powtarza nagłówka.

---

## Wzorce do wykrycia (regex)

```bash
# Frazy meta-opisowe
grep -rn \
  -e "Ten skill\|Ten moduł\|Celem tego\|Poniżej znajdziesz\|W tej sekcji\|Niniejszy\|służy do\|ma na celu\|pozwala na\|umożliwia użytkownikowi\|został stworzony\|jest przeznaczony" \
  /mnt/skills/user/ --include="*.md" | grep -v archive | grep -v "MOD-WSTAWKI"
```

```bash
# Outro-akapity (ostatnie linie sekcji przed ---)
awk '/^---$/{if(prev~/Zapraszamy|Powodzenia|Mamy nadzieję|W razie pytań/) print NR-1": "prev} {prev=$0}' \
  /mnt/skills/user/SKILL_PATH/SKILL.md
```

---

## Procedura kwalifikacji

Dla każdego trafienia oceń:

| Pytanie | TAK → | NIE → |
|---------|-------|-------|
| Czy ten tekst zawiera instrukcję lub regułę? | ZOSTAW | kandydat do usunięcia |
| Czy nagłówek sekcji już to mówi? | USUŃ | ZOSTAW |
| Czy bez tego tekstu sekcja traci znaczenie? | ZOSTAW | USUŃ |

**Zasada**: w razie wątpliwości — ZOSTAW. Usuń tylko to, co jednoznacznie opisowe.

---

## Procedura naprawy

1. Skopiuj plik do `/home/claude/`
2. Zidentyfikuj konkretne linie do usunięcia (numery)
3. Użyj `str_replace` — dla każdej wstawki osobne wywołanie:
   - `old_str`: dokładna treść wstawki (z otaczającymi pustymi liniami jeśli trzeba)
   - `new_str`: `""` (usuń) lub skrócona wersja jeśli wymaga korekty, nie usunięcia

---

## Raport

| Plik | Wstawki usunięte | Wstawki skrócone | Status |
|------|:----------------:|:----------------:|--------|
| skill/SKILL.md | 2 | 1 | ✅ naprawiono |

Wpisz wynik do sekcji `## NAPRAWY WYKONANE` w raporcie audytu.
