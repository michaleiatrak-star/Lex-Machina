#!/usr/bin/env python3
"""check_mapy_aktow.py — TEST T45: mapy aktów czytelne maszynowo i kompletne wobec modułów.

Dodany 2026-10-04e (AUDYT-2026-10-04e, F-229). Przesłanka: zgłoszenie z aplikacji korzystającej
ze skilli — w DR-09 27 modułów i w DR-03 2 moduły „nie występowały w MAPA-AKTOW.md”. Na dysku
występowały, ale parser Markdown (GFM) ich nie widział:
  * DR-09: wiersze po wtrąconym cytacie (`> …`) tworzyły tabelę BEZ nagłówka i separatora —
    dla parsera to zwykły tekst, nie tabela;
  * DR-03: dwa wiersze 4-kolumnowe w tabeli 3-kolumnowej — GFM odrzuca nadmiarowe komórki,
    więc kolumna „Moduł” wskazywała podstawę prawną, a nazwa modułu przepadała.
T43 (sieroty) tego nie widział: moduły są wymienione w SKILL.md i w tekście mapy.

Kontrole (dla każdego `dr-*/MAPA-AKTOW.md`; dla `prawo-polskie-v2/ROUTING-MAP.md` — tylko A):
  A. STRUKTURA — każdy wiersz `|…|` należy do tabeli z nagłówkiem i separatorem; liczba
     komórek wiersza = liczba komórek nagłówka (`\\|` i `|` wewnątrz `…` nie dzielą komórek).
  B. POKRYCIE — każdy plik `modules/*.md` danego DR występuje w kolumnie „Moduł” tabeli mapy.
  C. ROZWIĄZYWALNOŚĆ — każdy `mod-…` w kolumnie „Moduł” istnieje w `modules/` tego DR albo
     w innym skillu (odesłanie międzydziedzinowe — raportowane informacyjnie, nie FAIL).
Offline, deterministyczny. Kod wyjścia 1 przy błędzie A, B lub C.
"""
import argparse, glob, os, re, sys

def cells(line):
    s = line.strip()
    if s.startswith('|'): s = s[1:]
    if s.endswith('|') and not s.endswith('\\|'): s = s[:-1]
    out, cur, tick, i = [], '', False, 0
    while i < len(s):
        c = s[i]
        if c == '\\' and i + 1 < len(s):
            cur += s[i:i + 2]; i += 2; continue
        if c == '`': tick = not tick
        if c == '|' and not tick: out.append(cur); cur = ''
        else: cur += c
        i += 1
    out.append(cur)
    return [x.strip() for x in out]

SEP = re.compile(r'^\|\s*:?-{3,}')

def tables(path):
    L = open(path, encoding='utf-8').read().split('\n')
    tabs, orphan, i = [], [], 0
    while i < len(L):
        if L[i].startswith('|'):
            j = i
            while j < len(L) and L[j].startswith('|'): j += 1
            b = L[i:j]
            if len(b) >= 2 and SEP.match(b[1]):
                tabs.append((i + 1, cells(b[0]), [(i + k + 1, cells(b[k])) for k in range(2, len(b))]))
            else:
                orphan += [(i + k + 1, l) for k, l in enumerate(b)]
            i = j
        else:
            i += 1
    return tabs, orphan

MOD = re.compile(r'mod-[A-Za-z0-9_][A-Za-z0-9_-]*[A-Za-z0-9_]')

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--repo-root', default=os.environ.get('LEX_MACHINA_ROOT') or os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
    root = ap.parse_args().repo_root
    allmods = {}
    for p in glob.glob(os.path.join(root, '*', 'modules', '**', 'mod-*.md'), recursive=True) + glob.glob(os.path.join(root, 'shared', 'mod-*.md')):
        allmods.setdefault(os.path.basename(p)[:-3], set()).add(os.path.relpath(p, root).split(os.sep)[0])
    err = 0; cross_total = 0
    print('TEST T45 — MAPY AKTÓW: STRUKTURA, POKRYCIE MODUŁÓW, ROZWIĄZYWALNOŚĆ')
    print(f'Katalog: {root}')
    files = sorted(glob.glob(os.path.join(root, 'dr-*', 'MAPA-AKTOW.md')))
    rm = os.path.join(root, 'prawo-polskie-v2', 'ROUTING-MAP.md')
    for path in files + ([rm] if os.path.exists(rm) else []):
        skill = os.path.relpath(path, root).split(os.sep)[0]
        tabs, orphan = tables(path)
        bad = [(n, len(h), len(c)) for _, h, rows in tabs for n, c in rows if len(c) != len(h)]
        msgs = [f'  ⛔ A: L{n} — wiersz poza tabelą (brak nagłówka/separatora): {l[:80]}' for n, l in orphan[:5]]
        msgs += [f'  ⛔ A: L{n} — {c} komórek przy nagłówku {h}' for n, h, c in bad[:5]]
        e = len(orphan) + len(bad)
        if path != rm:
            in_col = {}
            for _, h, rows in tabs:
                idx = [k for k, x in enumerate(h) if 'moduł' in x.lower()]
                for n, c in rows:
                    for k in idx:
                        if k < len(c):
                            for m in MOD.findall(c[k]): in_col.setdefault(m, n)
            have = sorted(os.path.basename(p)[:-3] for p in glob.glob(os.path.join(root, skill, 'modules', 'mod-*.md')))
            miss = [m for m in have if m not in in_col]
            msgs += [f'  ⛔ B: moduł bez wiersza w kolumnie „Moduł”: {m}' for m in miss]
            e += len(miss)
            cross = []
            for m, n in sorted(in_col.items()):
                if m in have: continue
                if m in allmods: cross.append(f'{m} → {",".join(sorted(allmods[m]))}')
                else:
                    msgs.append(f'  ⛔ C: L{n} — `{m}` nie istnieje w żadnym skillu'); e += 1
            cross_total += len(cross)
            for x in cross: msgs.append(f'  ℹ️  odesłanie międzydziedzinowe: {x}')
        err += e
        tag = '✅' if e == 0 else '⛔'
        print(f'{tag} {os.path.relpath(path, root)}: tabel {len(tabs)}, błędów {e}')
        for m in msgs: print(m)
    print(f'Odesłania międzydziedzinowe (informacyjnie): {cross_total}')
    print('WYNIK T45: ' + ('✅ PASS' if err == 0 else f'❌ FAIL — {err} błędów (mapa nieczytelna dla parsera albo niekompletna)'))
    return 1 if err else 0

if __name__ == '__main__':
    sys.exit(main())
