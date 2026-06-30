# MOD-DESCRIPTION — Walidacja długości description

## Cel
Weryfikuje, czy pole `description:` w każdym `SKILL.md` nie przekracza **1024 znaków** (limit techniczny systemu skilli). Przekroczenie powoduje obcięcie description w UI bez ostrzeżenia.

---

## Limit

**HARD LIMIT: 1024 znaki** (licząc wyłącznie treść description, bez wcięć YAML ani cudzysłowów).

- ≤ 900 znaków → ✅ OK
- 901–1024 znaki → ⚠️ WARN (blisko limitu — zalecane skrócenie)
- > 1024 znaki → ❌ CRIT (przekroczenie limitu — obowiązkowa naprawa)

---

## Wykrycie

```bash
# Skrypt zliczający znaki description dla każdego SKILL.md
for f in $(find /mnt/skills/user/ -name "SKILL.md" | grep -v archive | sort); do
  # Wyciągnij treść description (blok YAML między description: a następnym kluczem)
  desc=$(python3 -c "
import sys, re
content = open('$f').read()
m = re.search(r'^description:\s*\|?\n((?:[ \t]+.*\n?)*)', content, re.MULTILINE)
if m:
    text = re.sub(r'^[ \t]+', '', m.group(1), flags=re.MULTILINE).strip()
    print(len(text))
else:
    # inline description
    m2 = re.search(r'^description:\s*[\"\'"]?(.+?)[\"\'"]?\s*$', content, re.MULTILINE)
    print(len(m2.group(1).strip()) if m2 else 0)
" 2>/dev/null || echo "0")
  skill=$(echo "$f" | sed 's|/mnt/skills/user/||;s|/SKILL.md||')
  if [ "$desc" -gt 1024 ]; then
    echo "❌ CRIT $desc znaków → $skill"
  elif [ "$desc" -gt 900 ]; then
    echo "⚠️  WARN $desc znaków → $skill"
  else
    echo "✅ OK   $desc znaków → $skill"
  fi
done
```

---

## Skrócony wynik (tylko problemy)

```bash
# Tylko CRIT i WARN
for f in $(find /mnt/skills/user/ -name "SKILL.md" | grep -v archive | sort); do
  desc=$(python3 -c "
import sys, re
content = open('$f').read()
m = re.search(r'^description:\s*\|?\n((?:[ \t]+.*\n?)*)', content, re.MULTILINE)
if m:
    text = re.sub(r'^[ \t]+', '', m.group(1), flags=re.MULTILINE).strip()
    print(len(text))
else:
    m2 = re.search(r'^description:\s*[\"\'"]?(.+?)[\"\'"]?\s*$', content, re.MULTILINE)
    print(len(m2.group(1).strip()) if m2 else 0)
" 2>/dev/null || echo "0")
  if [ "$desc" -gt 900 ]; then
    skill=$(echo "$f" | sed 's|/mnt/skills/user/||;s|/SKILL.md||')
    echo "$desc $skill"
  fi
done | sort -rn
```

---

## Procedura naprawy (CRIT)

Gdy description przekracza 1024 znaki:

1. Wyświetl aktualną treść:
```bash
python3 -c "
import re
content = open('/mnt/skills/user/SKILL/SKILL.md').read()
m = re.search(r'description:.*', content, re.DOTALL)
print(content[m.start():m.start()+1200] if m else 'brak')
"
```

2. Skróć description zachowując:
   - Główne triggery wywołania (słowa kluczowe)
   - Wersję skilla (v2, v3 itd.)
   - Kluczowe ograniczenia (czego NIE robić)

3. Usuń:
   - Powtórzenia tych samych triggerów innymi słowami
   - Rozbudowane opisy techniczne (te należą do treści SKILL.md, nie do description)
   - Listy wyczerpujące (zastąp "m.in." + 3 przykłady)

4. Zastosuj `str_replace` na oryginalnym pliku.

5. Zweryfikuj wynik ponownie skryptem.

---

## Raport

| Skill | Przed (znaki) | Po (znaki) | Status |
|-------|:-------------:|:----------:|--------|
| analizator-umow-v1 | 1287 | 980 | ✅ naprawiono |

Wpisz wynik do sekcji `## NAPRAWY WYKONANE` lub `## OSTRZEŻENIA` w raporcie audytu.
