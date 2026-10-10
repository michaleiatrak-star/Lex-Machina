#!/usr/bin/env python3
"""_lex_common.py — wspólne narzędzia skryptów audytu (nie jest testem; importowany).

Powstał 2026-10-10 (audyt mutacyjny zestawu). Zawiera:
  * graf odwołań między plikami skilli — jedna implementacja dla T43 (check_sieroty.py)
    i T44 (check_osiagalnosc_shared.py); wcześniej ~70 linii skopiowanych 1:1 i O(N^2)
    wywołań `refers` (ok. 1,2 mln) w każdym z nich. Tu indeks odwrotny: nazwa pliku ->
    pliki-źródła;
  * inwentarz plików modułów skilla (T1, T2, T13): `modules/**`, także podkatalogi
    i pliki bez prefiksu `mod-`.

Reguła „rdzeń nazwy jako słowo” (nazwa unikalna, rdzeń >= 8 znaków) od 2026-10-10:
rdzeń-identyfikator (z `-`, `_` albo cyfrą, np. `mod-KC-spadki`) liczy się jako zwykłe
słowo; rdzeń będący zwykłym słowem (np. `WERYFIKACJA`) — tylko po `/` albo w backtickach.
Wcześniej każde wystąpienie słowa w prozie rejestrowało plik (mutacja `shared/WERYFIKACJA.md`
przechodziła T43 i T44).
"""
import collections
import os
import re

HIST = re.compile(r'(CHECKSUMS\.sha256|CHANGELOG\.md|HISTORIA-ZMIAN-PLIKOW\.md|AUDIT-JOURNAL\.md|mapa_dzu_[^/]*\.md'
                  r'|WARN-OTWARTE\.md|DEDUPLICATION-POLICY\.md|CHECKLIST-DEDUP\.md)$')
SKIP = ('/mcp-servers/', '/node_modules/', '/__pycache__/', '/.git/')
TXT = ('.md', '.py', '.sh', '.json', '.yaml', '.yml', '.txt', '.mjs', '.js', '.jsx', '.html')
INFRA = re.compile(r'(^SKILL\.md$|^CHECKSUMS\.sha256$|^\.claude-plugin/plugin\.json$|^agents/openai\.yaml$|'
                   r'^assets/icon\.svg$|^README\.md$|^PORTABILITY-MANIFEST\.md$|^MANIFEST\.md$|^\.mcp\.json$|^NOTICE$'
                   r'|^LICENSE$|^(references/)?CHANGELOG\.md$|^references/HISTORIA-ZMIAN-PLIKOW\.md$|__init__\.py$)')

_PL = 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ'
TOK = re.compile(r'[A-Za-z0-9_\-\.' + _PL + r'/]+\.(?:md|py|sh|json|yaml|yml|mjs|js|jsx|html|svg|txt)')
WORD = re.compile(r'[A-Za-z0-9_\-' + _PL + r']+')
# Słowo stojące po „/” albo po backticku — zapis ścieżki/nazwy pliku bez rozszerzenia.
STEMREF = re.compile(r'(?:/|`)([A-Za-z0-9_\-' + _PL + r']+)')
DIRTOK = re.compile(r'[A-Za-z0-9_\-\./]+/')
IDENT = re.compile(r'[-_0-9]')


def skills(root):
    return sorted(d for d in os.listdir(root) if os.path.isfile(os.path.join(root, d, 'SKILL.md')))


def aliases(s):
    a = {s}
    m = re.match(r'(dr-\d\d)', s)
    if m:
        a.add(m.group(1))
    return a


class RefGraph:
    """Pliki wszystkich skilli i odwołania między nimi (ścieżkowe, jak w T43/T44)."""

    def __init__(self, root):
        self.root = root
        self.skills = skills(root)
        self.files, self.texts = {}, {}
        for s in self.skills:
            base = os.path.join(root, s)
            for dp, dn, fn in os.walk(base):
                if any(x in dp + '/' for x in SKIP):
                    continue
                for f in fn:
                    ap = os.path.join(dp, f)
                    rel = os.path.relpath(ap, base)
                    self.files[(s, rel)] = ap
                    if f.endswith(TXT):
                        with open(ap, encoding='utf-8', errors='replace') as h:
                            self.texts[(s, rel)] = h.read()
        self.toks = {k: set(TOK.findall(t)) for k, t in self.texts.items()}
        self.words = {k: set(WORD.findall(t)) for k, t in self.texts.items()}
        self.stemrefs = {k: set(STEMREF.findall(t)) for k, t in self.texts.items()}
        self.dirtoks = {k: set(DIRTOK.findall(t)) for k, t in self.texts.items()}
        self.bn_count = collections.Counter(os.path.basename(r) for (_, r) in self.files)
        self.by_bn = collections.defaultdict(list)
        for src, ts in self.toks.items():
            for t in ts:
                self.by_bn[os.path.basename(t)].append((src, t))
        self._stem_srcs = None

    def _stem_index(self):
        if self._stem_srcs is None:
            stems = {os.path.splitext(bn)[0] for bn, c in self.bn_count.items() if c == 1}
            stems = {st for st in stems if len(st) >= 8}
            ident = {st for st in stems if IDENT.search(st)}
            plain = stems - ident
            idx = collections.defaultdict(set)
            for src in self.texts:
                for st in self.words[src] & ident:
                    idx[st].add(src)
                for st in self.stemrefs[src] & plain:
                    idx[st].add(src)
            self._stem_srcs = idx
        return self._stem_srcs

    def referrers(self, s, rel):
        """Pliki (skill, rel), które odwołują się do pliku `s/rel` (bez niego samego)."""
        bn = os.path.basename(rel)
        stem = os.path.splitext(bn)[0]
        out = set()
        if self.bn_count[bn] == 1:
            out.update(src for src, _ in self.by_bn.get(bn, ()))
            if len(stem) >= 8:
                out |= self._stem_index().get(stem, set())
        else:
            al = aliases(s)
            for src, t in self.by_bn.get(bn, ()):
                t2 = t.lstrip('./')
                if src[0] == s and (t2 == rel or t2.endswith('/' + rel)
                                    and t2[:-len(rel)].rstrip('/').split('/')[-1] in al):
                    out.add(src)
                    continue
                if any(t2.endswith(a + '/' + rel) for a in al):
                    out.add(src)
        out.discard((s, rel))
        return out


# ---------------------------------------------------------------------------
# Inwentarz modułów (T1, T2, T13)
# ---------------------------------------------------------------------------
# Pliki w modules/, które nie są modułami treści (rejestry, opisy katalogu).
NIE_MODUL = re.compile(r'(^|/)(README|INDEX|CHANGELOG|HISTORIA-ZMIAN-PLIKOW)\.md$', re.I)


def module_files(skill_dir, prefix_only=False):
    """Pliki .md modułów skilla: `modules/**` (rekurencyjnie), posortowane.

    prefix_only=True zawęża do `mod-*` (zachowanie sprzed 2026-10-10, gdy potrzebne).
    """
    mdir = os.path.join(str(skill_dir), 'modules')
    out = []
    for dp, dn, fn in os.walk(mdir):
        dn[:] = sorted(d for d in dn if d not in ('__pycache__',))
        for f in fn:
            if not f.endswith('.md'):
                continue
            rel = os.path.relpath(os.path.join(dp, f), mdir).replace(os.sep, '/')
            if NIE_MODUL.search(rel):
                continue
            if prefix_only and not f.startswith('mod-'):
                continue
            out.append(rel)
    return sorted(out)
