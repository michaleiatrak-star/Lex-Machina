#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""T25 — check_domeny_allowlist.py

Mierzy OSIĄGALNOŚĆ źródeł z `references/PORTALE-ORZECZNICZE-API.md` z kanału
kodu (curl/urllib) i wypisuje wynik faktyczny zamiast statusu przepisanego.

Powód powstania (F-152 / F-157, 2026-09-04): plik PORTALE-ORZECZNICZE-API.md
sam sobie nakazuje w §5 i §6 pkt 2 „po zmianie listy domen zmierzyć, nie
przepisać". Do 2026-09-04 nie istniało narzędzie, które to wykonuje — status
`⬛ host` przetrwał w tabeli po tym, jak domeny FAKTYCZNIE zostały dopisane do
listy dozwolonych. Ten sam wzorzec co F-156: liczba wpisana ręcznie starzeje
się, licznik uruchamiany w momencie użycia — nie.

⛔ TRZY PUŁAPKI, KTÓRE TEN SKRYPT ŁAPIE, A GOŁY `curl -I` NIE:

1. PUŁAPKA USER-AGENT (F-157). Podszywanie się pod przeglądarkę z adresu
   centrum danych jest sygnaturą bota dla WAF-ów kilku polskich serwisów.
   Zmierzone 2026-09-04, 5/5 powtórzeń każdy wariant:
       orzeczenia.ms.gov.pl  UA="curl/8.5.0"          -> HTTP 200 (197 kB)
       orzeczenia.ms.gov.pl  UA=Chrome/120 (pełny)    -> HTTP 502
       www.saos.org.pl/api/search  UA=curl            -> HTTP 200 (JSON)
       www.saos.org.pl/api/search  UA=Chrome          -> HTTP 200 „Przerwa techniczna"
   Drugi przypadek jest groźniejszy: HTTP 200 ze stroną przerwy technicznej
   przechodzi każdą kontrolę opartą na kodzie odpowiedzi. Dlatego skrypt
   sprawdza TREŚĆ, nie tylko kod — patrz `must_contain`.

2. PUŁAPKA PRZEKIEROWANIA POZA LISTĘ. Domena bywa na liście dozwolonych, a i
   tak nie działa, bo przekierowuje na host, którego na liście NIE MA
   (`gov.pl` -> `www.gov.pl`, `decyzje.uokik.gov.pl` -> `uokik.gov.pl`).
   Proxy zwraca wtedy 403 z `host_not_allowed` i wygląda to jak awaria
   serwisu. Skrypt raportuje URL końcowy i osobno klasyfikuje ten przypadek.

3. PUŁAPKA ROOTA. Kod dla `/` nie mówi nic o użytecznej ścieżce: root
   `decyzje.uokik.gov.pl` to 302 poza listę, a `/bp/dec_prez.nsf` to HTTP 200.
   Dlatego manifest trzyma ŚCIEŻKI ROBOCZE, nie same domeny.

Użycie:
    python3 check_domeny_allowlist.py            # pełny pomiar sieciowy
    python3 check_domeny_allowlist.py --grupa akty
    python3 check_domeny_allowlist.py --json wynik.json
    python3 check_domeny_allowlist.py --selftest # offline, bez sieci

Kody wyjścia: 0 = brak regresji względem stanu odniesienia; 1 = regresja
(pozycja OK w odniesieniu, a dziś nie); 2 = błąd wywołania.

⛔ OGRANICZENIE WŁASNE, NAZWANE WPROST: przy ciasnym przebiegu ten test
POTRAFI WYWOŁAĆ awarię, którą następnie zaraportuje. Zmierzone 2026-09-04 na
CBOSA (`orzeczenia.nsa.gov.pl`): po serii żądań 503 ×3, po 60 s pauzy
200/200/200. Stąd pole `pauza` i trzy ponowienia. Pojedynczy przebieg
z jednego adresu jest bezpieczny; pętla po manifeście w kółko — nie.

⛔ Skrypt NIE rozstrzyga, czy z danego źródła wolno cytować — to nadal
`shared/HIERARCHIA-ZRODEL.md`. Mierzy wyłącznie, czy da się je odczytać.
"""

from __future__ import annotations

import argparse
import json
import ssl
import sys
import time
import urllib.error
import urllib.request
from dataclasses import dataclass, field, asdict

# ⛔ NIE ZMIENIAJ na łańcuch przeglądarkowy — patrz PUŁAPKA 1 w docstringu.
# Neutralny UA jest wymogiem funkcjonalnym, nie kosmetyką.
UA_NEUTRALNY = "curl/8.5.0"

# ⛔ NAGŁÓWEK OBOWIĄZKOWY. SAOS odrzuca żądanie bez `Accept` kodem 406
# (zmierzone 2026-09-04: brak nagłówka -> HTTP 406; `*/*` oraz
# `application/json` -> HTTP 200). curl wysyła `*/*` domyślnie, urllib NIE —
# dlatego ten sam adres „działa w curlu i nie działa w skrypcie".
ACCEPT_DOMYSLNY = "*/*"

# Indeks pełnotekstowy SAOS potrafi odpowiadać kilkadziesiąt sekund —
# przy 30 s test produkował fałszywą regresję na `/api/search`.
TIMEOUT = 60

# Jedno ponowienie przy 5xx/timeout: pomiar 2026-09-04 złapał pojedynczy,
# niepowtarzalny 503 na `rejestr.uokik.gov.pl`, który przy 4 kolejnych
# próbach dawał 200. Bez ponowienia test produkuje fałszywe regresje
# (ta sama klasa błędu co F-150).
PONOWIENIA = 2


@dataclass
class Sonda:
    """Jedna mierzalna pozycja inwentarza."""
    zrodlo: str
    grupa: str          # akty | orzecznictwo | rejestry | zamowienia | dane | miedzynarodowe
    url: str
    odniesienie: str    # oczekiwany stan wg pomiaru 2026-09-04: OK | BLOKADA | NIEOSIAGALNE
    must_contain: str = ""   # fragment, który MUSI wystąpić w treści (pułapka 1)
    uwaga: str = ""
    # ⛔ Host o udokumentowanym niedeterminizmie: ponawiaj przy KAŻDYM wyniku
    # innym niż OK, nie tylko przy 5xx. Ustawiaj wyłącznie tam, gdzie zmierzono
    # rozrzut — nie jako sposób na uciszenie niewygodnego wyniku.
    flaky: bool = False
    # Pauza [s] PRZED sondą. ⛔ Nie kosmetyka: CBOSA limituje tempo i przy
    # ciasnym przebiegu zwraca 503, czyli TEST SAM WYWOŁUJE awarię, którą
    # potem raportuje. Zmierzone 2026-09-04: po serii prób 503 ×3, po 60 s
    # pauzy 200/200/200. Ustawiaj tam, gdzie portal zapowiada limity.
    pauza: float = 0


MANIFEST: list[Sonda] = [
    # --- AKTY (RZĄD 1) -----------------------------------------------------
    Sonda("api.sejm.gov.pl/eli", "akty",
          "https://api.sejm.gov.pl/eli/acts/DU/1997/553",
          "OK", '"publisher"', "kanał kanoniczny brzmienia przepisu"),
    Sonda("eli.gov.pl", "akty",
          "https://eli.gov.pl/api/acts/DU/1997/553",
          "OK", '"publisher"', "ten sam korpus co api.sejm.gov.pl"),
    Sonda("isap.sejm.gov.pl", "akty",
          "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19970880553",
          "BLOKADA", "", "Imperva: 302 na samego siebie + strona challenge"),

    # --- ORZECZNICTWO ------------------------------------------------------
    Sonda("SAOS /api/search", "orzecznictwo",
          "https://www.saos.org.pl/api/search/judgments?pageSize=10&pageNumber=0"
          "&sortingField=JUDGMENT_DATE&sortingDirection=DESC",
          "OK", '"items"', "pageSize >= 10 wymagane; bez nagłówka Accept -> HTTP 406; indeks bywa wolny — nie skracaj TIMEOUT"),
    Sonda("SAOS /api/dump", "orzecznictwo",
          "https://www.saos.org.pl/api/dump/judgments?pageSize=10",
          "OK", '"items"', "kanał hurtowy"),
    Sonda("SAOS /api/judgments/{id}", "orzecznictwo",
          "https://www.saos.org.pl/api/judgments/1",
          "OK", '"courtCases"', "pojedyncze orzeczenie"),
    Sonda("orzeczenia.ms.gov.pl", "orzecznictwo",
          "https://orzeczenia.ms.gov.pl/",
          "OK", "Portal Orze", "⛔ 502 pod UA przeglądarkowym — patrz PUŁAPKA 1"),
    Sonda("orzeczenia.nsa.gov.pl (CBOSA)", "orzecznictwo",
          "https://orzeczenia.nsa.gov.pl/cbo/query",
          "OK", "",
          "⛔ LIMITUJE TEMPO — zmierzone, nie tylko zapowiadane: przy ciasnym "
          "przebiegu 503 ×3, po 60 s pauzy 200/200/200. Sonda ma pauzę 15 s; "
          "przy własnych zapytaniach seryjnych limituj tempo albo zablokujesz adres",
          pauza=15),
    Sonda("sn.pl", "orzecznictwo",
          "https://sn.pl/orzecznictwo/SitePages/Baza_orzeczen.aspx",
          "OK", "", "wybrane orzecznictwo, nie całość"),
    Sonda("ipo.trybunal.gov.pl", "orzecznictwo",
          "https://ipo.trybunal.gov.pl/", "OK", "", ""),
    Sonda("otkzu.trybunal.gov.pl", "orzecznictwo",
          "https://otkzu.trybunal.gov.pl/", "OK", "", ""),
    Sonda("trybunal.gov.pl", "orzecznictwo",
          "https://trybunal.gov.pl/", "NIEOSIAGALNE", "",
          "503 z warstwy proxy, 3/3; ipo+otkzu pokrywają orzecznictwo TK"),
    Sonda("orzeczenia.uodo.gov.pl", "orzecznictwo",
          "https://orzeczenia.uodo.gov.pl/", "OK", "",
          "do potwierdzenia: /api-doc/ renderowane JS"),
    Sonda("orzeczenia.uzp.gov.pl (KIO)", "orzecznictwo",
          "https://orzeczenia.uzp.gov.pl/", "OK", "", "brak REST; HTML scraping"),
    Sonda("decyzje.uokik.gov.pl", "orzecznictwo",
          "https://decyzje.uokik.gov.pl/bp/dec_prez.nsf", "OK", "",
          "⛔ root robi 302 na uokik.gov.pl (poza listą) — patrz PUŁAPKA 2"),
    Sonda("bip.uke.gov.pl", "orzecznictwo",
          "https://bip.uke.gov.pl/", "OK", "", "nie ma statusu zbioru urzędowego"),
    Sonda("hudoc.echr.coe.int", "orzecznictwo",
          "https://hudoc.echr.coe.int/app/query/results?query=%28contentsitename%3DECHR%29"
          "&select=itemid&sort=&start=0&length=1",
          "OK", '"resultcount"', "API nieudokumentowane, ale stabilne"),
    Sonda("UODO — spec OpenAPI", "orzecznictwo",
          "https://orzeczenia.uodo.gov.pl/api-doc/schemas/openapi.yml",
          "OK", "openapi:", "F-158: spec znaleziona w bloku SwaggerUIBundle, nie zgadnięta"),
    Sonda("UODO — /api/documents/search", "orzecznictwo",
          "https://orzeczenia.uodo.gov.pl/api/documents/search/PublicDocument/1Y,"
          "/publicator_subtype:eq:uodo?order=-id&fields=id,refid,refname",
          "OK", '"refname"',
          "⚠️ okno 1M zwraca [] przy HTTP 200 — pusty wynik to NIE błąd; użyj 1Y"),
    Sonda("eureka.mf.gov.pl (SPA)", "orzecznictwo",
          "https://eureka.mf.gov.pl/informacje/podglad/1", "TRESC_NIEZGODNA", "interpretacj",
          "SPA — HTTP 200 zwraca pustą skorupę (2,9 kB); treść renderowana w JS"),
    Sonda("EUREKA — /informacje/{id}", "orzecznictwo",
          "https://eureka.mf.gov.pl/api/public/v1/informacje/100000",
          "OK", '"dokument"',
          "F-158: baza /api/public/v1 odczytana z bundle main.*.js, nie zgadnięta. "
          "⛔ ID 1 nie istnieje — 404 z komunikatem dziedzinowym to dowód, że "
          "endpoint ŻYJE, nie że go nie ma"),
    Sonda("EUREKA — /parametry-wyszukiwarki", "orzecznictwo",
          "https://eureka.mf.gov.pl/api/public/v1/parametry-wyszukiwarki",
          "OK", '"etykieta"', "katalog 40 metadanych wyszukiwania"),

    # --- REJESTRY ----------------------------------------------------------
    Sonda("api-krs.ms.gov.pl", "rejestry",
          "https://api-krs.ms.gov.pl/api/krs/OdpisAktualny/0000028860?rejestr=P&format=json",
          "OK", '"odpis"', "bez klucza; JSON zanonimizowany względem PDF"),
    Sonda("dane.biznes.gov.pl (CEIDG v3)", "rejestry",
          "https://dane.biznes.gov.pl/api/ceidg/v3/firmy?nip=1234567890",
          "BLOKADA", "", "HTTP 401 — API działa, brak tokenu Bearer; patrz §7"),
    Sonda("prs.ms.gov.pl", "rejestry",
          "https://prs.ms.gov.pl/", "OK", "", "kanał składania, nie odczytu masowego"),
    Sonda("ekw.ms.gov.pl", "rejestry",
          "https://ekw.ms.gov.pl/eukw_ogol/menu.do", "OK", "",
          "⛔ root pętli przekierowaniem — używaj /eukw_ogol/menu.do"),
    Sonda("krz.ms.gov.pl", "rejestry",
          "https://krz.ms.gov.pl/", "BLOKADA", "", "403 Imperva, także pod UA neutralnym"),
    Sonda("wyszukiwarka-krs.ms.gov.pl", "rejestry",
          "https://wyszukiwarka-krs.ms.gov.pl/", "BLOKADA", "",
          "403 Imperva; odczyt i tak przez api-krs.ms.gov.pl"),
    Sonda("ekrs.ms.gov.pl (RDF)", "rejestry",
          "https://ekrs.ms.gov.pl/", "OK", "",
          "⛔ /rdf/pd/search_df przekierowuje na rdf-przegladarka.ms.gov.pl (poza listą)"),
    Sonda("isws.ms.gov.pl", "rejestry",
          "https://isws.ms.gov.pl/pl/baza-statystyczna/opracowania-wieloletnie/",
          "OK", "", "statystyka MS, nie treść orzeczeń"),
    Sonda("sudop.uokik.gov.pl", "rejestry",
          "https://sudop.uokik.gov.pl/search/aidBeneficiary", "OK", "",
          "pomoc publiczna, NIE decyzje Prezesa UOKiK"),
    Sonda("rejestr.uokik.gov.pl", "rejestry",
          "https://rejestr.uokik.gov.pl/", "OK", "", "klauzule niedozwolone; brak API"),

    # --- ZAMÓWIENIA --------------------------------------------------------
    Sonda("ezamowienia.gov.pl (mo-board)", "zamowienia",
          "https://ezamowienia.gov.pl/mo-board/api/v1/Board/Search?NoticeType=ContractNotice"
          "&SortingColumnName=PublicationDate&SortingDirection=DESC&PageNumber=1&PageSize=1",
          "OK", '"noticeType"', "REST, bez klucza"),
    Sonda("bzp.uzp.gov.pl", "zamowienia",
          "https://bzp.uzp.gov.pl/Default.aspx", "OK", "",
          "⛔ CAŁY HOST NIEDETERMINISTYCZNY, nie tylko root: 404 w ~20% żądań "
          "(root 2/8, Default.aspx 2/10 — pomiar 2026-09-04). Pierwszy pomiar "
          "Default.aspx dał 8/8 i został BŁĘDNIE opisany jako stabilny; "
          "artefakt małej próby. Farma, w której część węzłów nie obsługuje "
          "żądania. ⛔ Nie mylić z awarią i nie orzekać z jednej próby",
          flaky=True),
    Sonda("websrv.bzp.uzp.gov.pl", "zamowienia",
          "https://websrv.bzp.uzp.gov.pl/", "NIEOSIAGALNE", "",
          "SOAP starego BZP; 503 3/3 — usługa wygaszona po migracji"),

    # --- DANE I LEGISLACJA -------------------------------------------------
    Sonda("dane.gov.pl", "dane",
          "https://dane.gov.pl/", "OK", "",
          "⛔ SPA; API mieszka na api.dane.gov.pl — POZA LISTĄ"),
    Sonda("podatki.gov.pl", "dane",
          "https://podatki.gov.pl/", "OK", "",
          "⛔ wariant www.podatki.gov.pl poza listą"),
    Sonda("legislacja.rcl.gov.pl", "dane",
          "https://legislacja.rcl.gov.pl/", "NIEOSIAGALNE", "",
          "503 3/3, także pod UA neutralnym; brak zamiennika dla przebiegu prac RCL"),

    # --- KANDYDACI (F-157) — hosty POZA listą dozwolonych ------------------
    # ⛔ Te sondy mają odniesienie POZA_LISTA celowo. Nie są usterką: po
    # dopisaniu hosta przez dewelopera zmienią status na OK/BLOKADA i test
    # od razu pokaże, co faktycznie się odblokowało. Bez nich weryfikacja
    # zmiany konfiguracji wymagałaby ręcznego przypominania sobie listy.
    Sonda("api.dane.gov.pl", "kandydaci",
          "https://api.dane.gov.pl/1.4/datasets?per_page=1", "POZA_LISTA", "",
          "jedyny host API katalogu danych; dane.gov.pl to sama SPA"),
    Sonda("wl-api.mf.gov.pl", "kandydaci",
          "https://wl-api.mf.gov.pl/api/search/nip/0000000000?date=2026-09-04",
          "POZA_LISTA", "",
          "⛔ biała lista VAT — jedyna maszynowa weryfikacja rachunku kontrahenta"),
    Sonda("rdf-przegladarka.ms.gov.pl", "kandydaci",
          "https://rdf-przegladarka.ms.gov.pl/", "POZA_LISTA", "",
          "cel przekierowania z ekrs.ms.gov.pl — sprawozdania finansowe KRS"),
    Sonda("op.europa.eu", "kandydaci",
          "https://op.europa.eu/", "POZA_LISTA", "",
          "cel przekierowania z publications.europa.eu"),
    Sonda("www.gov.pl", "kandydaci",
          "https://www.gov.pl/web/pip", "POZA_LISTA", "",
          "⛔ bez tego BIP GIP (interpretacje z art. 14b, F-153) jest nieosiągalny"),
    Sonda("www.pip.gov.pl", "kandydaci",
          "https://www.pip.gov.pl/", "POZA_LISTA", "", "cel przekierowania z pip.gov.pl"),
    Sonda("api.stat.gov.pl (REGON/BIR)", "kandydaci",
          "https://api.stat.gov.pl/Home/RegonApi", "POZA_LISTA", "",
          "F-158c: wymogu klucza i sesji NIE zweryfikowano — host poza listą"),
    Sonda("orzeczenia.warszawa.so.gov.pl", "kandydaci",
          "https://orzeczenia.warszawa.so.gov.pl/", "POZA_LISTA", "",
          "portal orzeczeń pojedynczego sądu — osiągalny niezależnie od agregatu, ma RSS"),

    # --- MIĘDZYNARODOWE ----------------------------------------------------
    Sonda("publications.europa.eu (SPARQL)", "miedzynarodowe",
          "https://publications.europa.eu/webapi/rdf/sparql?query="
          "SELECT%20*%20WHERE%20%7B%3Fs%20%3Fp%20%3Fo%7D%20LIMIT%201"
          "&format=application%2Fsparql-results%2Bjson",
          "OK", '"results"',
          "⛔ root robi 301 na op.europa.eu (poza listą) — używaj ścieżki /webapi/"),
    Sonda("eur-lex.europa.eu", "miedzynarodowe",
          "https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:32016R0679",
          "OK", "", "HTML"),
    Sonda("legal.un.org", "miedzynarodowe", "https://legal.un.org/ilc/", "OK", "", ""),
    Sonda("treaties.un.org", "miedzynarodowe", "https://treaties.un.org/Pages/Home.aspx",
          "OK", "", ""),
    Sonda("www.hcch.net", "miedzynarodowe",
          "https://www.hcch.net/en/instruments/conventions", "OK", "", ""),
    Sonda("rm.coe.int", "miedzynarodowe", "https://rm.coe.int/1680a2512d", "BLOKADA", "",
          "401/403 na dokumentach zależnie od kanału"),
]


@dataclass
class Wynik:
    zrodlo: str
    grupa: str
    url: str
    kod: int | None
    url_koncowy: str
    rozmiar: int
    status: str                 # OK | BLOKADA | NIEOSIAGALNE | POZA_LISTA | TRESC_NIEZGODNA
    odniesienie: str
    regresja: bool = False
    detal: str = ""
    uwaga: str = field(default="")


def _pobierz(url: str, opener) -> tuple[int | None, str, bytes, str]:
    """Zwraca (kod, url_koncowy, tresc, detal)."""
    req = urllib.request.Request(url, headers={
        "User-Agent": UA_NEUTRALNY,
        "Accept": ACCEPT_DOMYSLNY,
    })
    try:
        with opener.open(req, timeout=TIMEOUT) as r:
            return r.getcode(), r.geturl(), r.read(200_000), ""
    except urllib.error.HTTPError as e:
        try:
            body = e.read(200_000)
        except Exception:
            body = b""
        return e.code, url, body, ""
    except Exception as e:  # timeout, DNS, TLS, pętla przekierowań
        return None, url, b"", f"{type(e).__name__}: {e}"


def _klasyfikuj(sonda: Sonda, kod, url_koncowy, tresc: bytes, detal: str) -> tuple[str, str]:
    txt = tresc.decode("utf-8", "replace")

    # PUŁAPKA 2 — przekierowanie poza listę dozwolonych.
    if kod == 403 and "not in allowlist" in txt or "host_not_allowed" in txt:
        return "POZA_LISTA", "proxy odrzuciło host docelowy przekierowania"

    if kod is None:
        return "NIEOSIAGALNE", detal or "brak odpowiedzi"

    if kod in (502, 503, 504):
        return "NIEOSIAGALNE", f"HTTP {kod} z warstwy proxy/serwera"

    if kod == 401:
        return "BLOKADA", "HTTP 401 — wymaga uwierzytelnienia (API istnieje)"

    if kod == 403:
        return "BLOKADA", "HTTP 403 — odrzucone przez warstwę ochronną"

    # PUŁAPKA 1 — HTTP 200 nie dowodzi treści.
    if "Pardon Our Interruption" in txt or "Przerwa techniczna" in txt:
        return "BLOKADA", "HTTP 200 ze stroną zastępczą (challenge / przerwa techniczna)"

    # ⛔ FAŁSZYWY POZYTYW WYKRYTY 2026-09-04: bez tej gałęzi `isap.sejm.gov.pl`
    # raportował się jako OK. Imperva odbija tam żądanie pętlą 302 na TEN SAM
    # adres; urllib wyczerpuje limit przekierowań i oddaje kod 302, który przy
    # regule „mniej niż 400 = OK" przechodził jako sukces. Kod 3xx po
    # wyczerpaniu przekierowań NIE jest odpowiedzią treściową.
    if 300 <= kod < 400:
        return "BLOKADA", f"HTTP {kod} — nierozwiązane przekierowanie (pętla)"

    if kod >= 400:
        return "BLOKADA", f"HTTP {kod}"

    if sonda.must_contain and sonda.must_contain not in txt:
        return "TRESC_NIEZGODNA", f"brak markera {sonda.must_contain!r} przy HTTP {kod}"

    return "OK", f"HTTP {kod}"


def zmierz(sondy: list[Sonda], opener=None) -> list[Wynik]:
    if opener is None:
        ctx = ssl.create_default_context()
        opener = urllib.request.build_opener(
            urllib.request.HTTPSHandler(context=ctx),
            urllib.request.HTTPRedirectHandler(),
        )
    wyniki = []
    for s in sondy:
        if s.pauza:
            time.sleep(s.pauza)
        for proba in range(PONOWIENIA + 1):
            kod, koncowy, tresc, detal = _pobierz(s.url, opener)
            status, opis = _klasyfikuj(s, kod, koncowy, tresc, detal)
            koniec = (status == "OK") if s.flaky else (status != "NIEOSIAGALNE")
            if koniec or proba == PONOWIENIA:
                break
            time.sleep(3)
        if proba:
            opis = f"{opis} (po {proba+1} próbach)"
        # Regresja = było OK w odniesieniu, dziś nie jest.
        # ⛔ Pozycja POZA_LISTA, która przestała nią być, NIE jest regresją —
        # to zmiana konfiguracji na lepsze; raport oznacza ją osobno.
        regresja = (s.odniesienie == "OK" and status != "OK")
        wyniki.append(Wynik(
            zrodlo=s.zrodlo, grupa=s.grupa, url=s.url, kod=kod, url_koncowy=koncowy,
            rozmiar=len(tresc), status=status, odniesienie=s.odniesienie,
            regresja=regresja, detal=opis, uwaga=s.uwaga,
        ))
    return wyniki


def raport(wyniki: list[Wynik]) -> int:
    szer = max(len(w.zrodlo) for w in wyniki) + 2
    grupa = None
    for w in wyniki:
        if w.grupa != grupa:
            grupa = w.grupa
            print(f"\n--- {grupa.upper()} ---")
        znak = "!!" if w.regresja else ("OK" if w.status == "OK" else "  ")
        print(f" {znak} {w.zrodlo:<{szer}} {w.status:<16} {w.detal}")
        if w.uwaga:
            print(f"    {' ' * szer}   {w.uwaga}")

    odblokowane = [w for w in wyniki
                   if w.odniesienie == "POZA_LISTA" and w.status != "POZA_LISTA"]
    if odblokowane:
        print("\nODBLOKOWANE od pomiaru odniesienia (F-157 — dopisz do inwentarza):")
        for w in odblokowane:
            print(f"  + {w.zrodlo}: {w.status} — {w.detal}")

    regresje = [w for w in wyniki if w.regresja]
    zgodne = sum(1 for w in wyniki if w.status == w.odniesienie)
    print(f"\n=== PODSUMOWANIE: {len(wyniki)} sond, {zgodne} zgodnych ze stanem "
          f"odniesienia (2026-09-04), {len(regresje)} regresji ===")
    if regresje:
        print("REGRESJE (były OK, dziś nie):")
        for w in regresje:
            print(f"  - {w.zrodlo}: {w.status} — {w.detal}")
        return 1
    print("Brak regresji.")
    return 0


# --------------------------------------------------------------------------
# SELFTEST — offline, bez sieci. Sprawdza KLASYFIKATOR, nie świat zewnętrzny.
# Mutacja negatywna: każdy przypadek ma parę, która MUSI dać inny wynik.
# --------------------------------------------------------------------------
def selftest() -> int:
    S = Sonda("x", "test", "https://example.invalid/", "OK", "")
    S_marker = Sonda("x", "test", "https://example.invalid/", "OK", '"items"')

    przypadki = [
        # (sonda, kod, tresc, detal, oczekiwany_status)
        (S, 200, b"cokolwiek", "", "OK"),
        (S_marker, 200, b'{"items":[]}', "", "OK"),
        # mutacja negatywna do poprzedniego: ten sam kod 200, brak markera
        (S_marker, 200, b"<html>strona logowania</html>", "", "TRESC_NIEZGODNA"),
        # PUŁAPKA 1 — 200 ze stroną zastępczą
        (S, 200, b"<title>Pardon Our Interruption</title>", "", "BLOKADA"),
        (S, 200, b"<title>Przerwa techniczna</title>", "", "BLOKADA"),
        # PUŁAPKA 2 — przekierowanie poza listę
        (S, 403, b"Host not in allowlist: uokik.gov.pl.", "", "POZA_LISTA"),
        # mutacja negatywna: 403 bez sygnatury proxy to zwykła blokada portalu
        (S, 403, b"<html>Forbidden</html>", "", "BLOKADA"),
        (S, 401, b"{}", "", "BLOKADA"),
        (S, 502, b"upstream connect error", "", "NIEOSIAGALNE"),
        (S, 503, b"upstream connect error", "", "NIEOSIAGALNE"),
        (S, None, b"", "timeout", "NIEOSIAGALNE"),
        (S, 404, b"nie ma", "", "BLOKADA"),
        # pętla przekierowań (ISAP) — bez tego przypadku 302 przechodziło jako OK
        (S, 302, b"", "", "BLOKADA"),
        # mutacja negatywna do poprzedniego: 200 bez markera nadal jest OK
        (S, 200, b"", "", "OK"),
    ]

    ok = 0
    for i, (sonda, kod, tresc, detal, oczek) in enumerate(przypadki, 1):
        status, opis = _klasyfikuj(sonda, kod, sonda.url, tresc, detal)
        if status == oczek:
            ok += 1
            print(f"  [{i:2}] PASS  {oczek:<16} {opis}")
        else:
            print(f"  [{i:2}] FAIL  oczekiwano {oczek}, otrzymano {status} ({opis})")

    # Kontrola dodatkowa: manifest nie może zawierać UA przeglądarkowego.
    if "Mozilla" in UA_NEUTRALNY:
        print("  [!!] FAIL  UA_NEUTRALNY podszywa się pod przeglądarkę — patrz PUŁAPKA 1")
    else:
        ok += 1
        print(f"  [{len(przypadki)+1:2}] PASS  UA neutralny, bez podszywania się")

    # Kontrola: `flaky` wolno ustawić tylko tam, gdzie uwaga dokumentuje pomiar
    # rozrzutu — inaczej flaga staje się sposobem na uciszanie wyników.
    zle = [x.zrodlo for x in MANIFEST
           if x.flaky and "pomiar" not in x.uwaga.lower()]
    if zle:
        print(f"  [!!] FAIL  flaky bez udokumentowanego pomiaru: {zle}")
    else:
        ok += 1
        print(f"  [{len(przypadki)+2:2}] PASS  każda sonda flaky ma udokumentowany rozrzut")

    zle_p = [x.zrodlo for x in MANIFEST
             if x.pauza and "tempo" not in x.uwaga.lower()]
    if zle_p:
        print(f"  [!!] FAIL  pauza bez uzasadnienia limitem tempa: {zle_p}")
    else:
        ok += 1
        print(f"  [{len(przypadki)+3:2}] PASS  każda pauza uzasadniona limitem tempa")

    razem = len(przypadki) + 3
    print(f"\nSELFTEST: {ok}/{razem}")
    return 0 if ok == razem else 1


def main() -> int:
    p = argparse.ArgumentParser(description="T25 — pomiar osiągalności źródeł prawnych")
    p.add_argument("--grupa", help="ogranicz do jednej grupy (akty, orzecznictwo, "
                                   "rejestry, zamowienia, dane, kandydaci, miedzynarodowe)")
    p.add_argument("--json", metavar="PLIK", help="zapisz surowy wynik do JSON")
    p.add_argument("--selftest", action="store_true", help="offline, bez sieci")
    a = p.parse_args()

    if a.selftest:
        return selftest()

    sondy = MANIFEST
    if a.grupa:
        sondy = [s for s in MANIFEST if s.grupa == a.grupa]
        if not sondy:
            print(f"Nieznana grupa: {a.grupa}", file=sys.stderr)
            return 2

    wyniki = zmierz(sondy)
    kod = raport(wyniki)

    if a.json:
        with open(a.json, "w", encoding="utf-8") as f:
            json.dump([asdict(w) for w in wyniki], f, ensure_ascii=False, indent=2)
        print(f"Zapisano: {a.json}")

    return kod


if __name__ == "__main__":
    sys.exit(main())
