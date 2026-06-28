# MOD-INTERLINIE — Usuwanie pustych interlini

## Cel
Wykrywa i usuwa zbędne puste linie w plikach SKILL.md — czyli linie, które nie wnoszą żadnej treści ani struktury (nie są separatorami sekcji, nie są częścią bloku kodu, nie oddzielają nagłówka od treści).

---

## Definicja "zbędnej interlini"

Zbędna interlinia to:
- ≥ 2 kolejne puste linie w dowolnym miejscu poza blokiem kodu
- Pusta linia na początku lub końcu pliku
- Pusta linia bezpośrednio po nagłówku `#`, `##`, `###` (przed treścią sekcji)
- Pusta linia bezpośrednio przed zamknięciem bloku kodu ` ``` `

**NIE usuwaj:**
- Pojedynczej pustej linii między akapitami (normalny Markdown)
- Pustych linii wewnątrz bloków kodu (` ```bash ... ``` `)
- Linii `---` (separatory sekcji)

---

## Procedura wykrycia

```bash
# Znajdź pliki z ≥2 kolejnymi pustymi liniami
for f in $(find /mnt/skills/user/ -name "*.md" | grep -v archive); do
  count=$(grep -c "^$" "$f" || true)
  doubles=$(awk '/^$/{c++; if(c>=2) print NR": "$0} /^./{c=0}' "$f" | wc -l)
  if [ "$doubles" -gt 0 ]; then
    echo "ZBĘDNE: $doubles interlinie → $f"
  fi
done
```

```bash
# Szczegóły konkretnego pliku (numery linii)
awk '/^$/{c++; if(c>=2) print NR": [PUSTA]"} /^./{c=0}' /mnt/skills/user/SKILL_PATH/SKILL.md
```

---

## Procedura naprawy

Dla każdego pliku z wykrytymi zbędnymi interlinimi:

1. **Skopiuj** plik do `/home/claude/` (read-only mount)
2. **Usuń** wielokrotne puste linie narzędziem `sed`:

```bash
# Zamień ≥2 puste linie na jedną
sed '/^$/N;/^\n$/d' plik.md > plik_clean.md
# lub bardziej agresywnie (usuwa wszystkie wielokrotne):
cat -s plik.md > plik_clean.md
```

3. **Zweryfikuj** diff:
```bash
diff plik.md plik_clean.md
```

4. **Zastosuj** `str_replace` na oryginalnym pliku (każdy blok zbędnych interlini osobno).

---

## Raport

Po naprawie generuj tabelę:

| Plik | Interlinie usunięte | Status |
|------|--------------------:|--------|
| skill/SKILL.md | 5 | ✅ naprawiono |

Wpisz wynik do sekcji `## NAPRAWY WYKONANE` w raporcie audytu.
