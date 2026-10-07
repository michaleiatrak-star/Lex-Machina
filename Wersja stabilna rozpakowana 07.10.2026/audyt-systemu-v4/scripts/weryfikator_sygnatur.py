#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
weryfikator_sygnatur.py — odtworzeniowa implementacja V-SYG-0
(shared/SYGNATURY.md v1.2, shared/DOSTEP-MASZYNOWY-API.md v1.1 §3).

Zakres: binarna kontrola istnienia sygnatury sądowej w kanale maszynowym,
w czterech warstwach — NORMALIZUJ → ROUTUJ → OKNO POKRYCIA → POST-CHECK.

⛔ Ten skrypt NIE rozstrzyga o mocy źródła ani o dopuszczalności powołania.
   Robi to shared/HIERARCHIA-ZRODEL.md i shared/PRAWO-HARDGATE.md.

⛔ Statusy okna pokrycia STARZEJĄ SIĘ. Nie przepisuj ich z dokumentacji —
   uruchom `--okno` i zapisz datę pomiaru.

Użycie:
    python3 weryfikator_sygnatur.py --sygnatura "III CZP 25/11"
    python3 weryfikator_sygnatur.py --okno
    python3 weryfikator_sygnatur.py --kanaly
    python3 weryfikator_sygnatur.py --selftest      # offline, bez sieci

AUDYT-2026-09-13, flagi F-182…F-186.
"""
import argparse
import datetime
import json
import re
import sys
import time

try:
    import requests
except ImportError:  # pragma: no cover
    requests = None

# --- Kształt żądania: shared/DOSTEP-MASZYNOWY-API.md §1 --------------------
UA_NEUTRALNY = {"User-Agent": "curl/8.5.0", "Accept": "*/*"}
# ⚠️ WYJĄTEK zmierzony 2026-09-13: sn.pl oddaje 403 pod UA neutralnym.
UA_PRZEGLADARKA = {
    "User-Agent": ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                   "(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"),
    "Accept": "*/*",
}
TIMEOUT = 60

SAOS = "https://www.saos.org.pl/api/search/judgments"
SN = "https://sn.pl/index.php"          # 301 -> /pl/ ; requests podąża i sam
                                        # trzyma ciasteczka Imperva. UWAGA: curl
                                        # BEZ -L dostanie puste 301, nie awarię API.
                                        # (2026-09-13d, F-187: "www.sn.pl poza listą
                                        #  domen" już NIE obowiązuje — obie formy 200)
MS = "https://orzeczenia.ms.gov.pl"

# --- OKNO POKRYCIA — pomiar 2026-09-13, do odtworzenia przez --okno --------
OKNO_POMIAR_Z_DNIA = "2026-09-13"
OKNO = {
    "COMMON":                  {"total": 471591, "do": "2026-09-09", "zywa": True},
    "SUPREME":                 {"total": 38081,  "do": "2016-06-22", "zywa": False},
    "ADMINISTRATIVE":          {"total": 0,      "do": None,         "zywa": False},
    "CONSTITUTIONAL_TRIBUNAL": {"total": 9503,   "do": "2015-12-09", "zywa": False},
    "NATIONAL_APPEAL_CHAMBER": {"total": 22168,  "do": "2018-09-06", "zywa": False},
}

# --- ROUTING BAZ po repertorium -------------------------------------------
REP_SN = {"CSK", "CSKP", "KK", "NKK", "UK", "NSNc", "NSNu", "NKN", "CNP", "CNPP",
          "SDI", "ZK", "CZP", "KZP", "UZP", "PZP", "NSNZP", "SNO", "DSI", "DSP",
          "CZ", "KO", "KSP", "NSW"}
REP_POWSZECHNE = {"C", "Ns", "Nc", "Co", "K", "Ko", "Kp", "W", "Wo", "GC", "GU",
                  "GRp", "Cps", "RC", "Nmo", "U", "P", "ACa", "ACz", "AKa", "AKz",
                  "AKzw", "AKo", "APa", "APz", "AUa", "AUz", "AGa", "AGz"}
REP_TK = {"K", "P", "SK", "Kpt", "Kp", "U"}
REP_KIO = {"KIO"}

STATUSY = ("FOUND", "NOT_FOUND", "AMBIGUOUS", "OUT_OF_SCOPE", "BLAD_FORMATU")


# ==========================================================================
# V-SYG-0.1 — NORMALIZACJA
# ==========================================================================
def normalizuj(syg: str) -> str:
    """Zwija białe znaki do pojedynczej spacji i usuwa kropki w repertorium.

    ⛔ NIE zmienia wielkości liter na potrzeby zapytania (SAOS i sn.pl są
       case-insensitive — zmierzone), ale zwija spacje, bo podwójna spacja
       daje na sn.pl FAŁSZYWY brak trafień.
    ⛔ NIE uzupełnia brakującej izby ani rocznika — to błąd formatu.
    """
    s = syg.replace(".", "")
    s = re.sub(r"\s+", " ", s).strip()
    return s


def rozbierz(syg: str):
    """Zwraca (izba, repertorium, numer, rok) albo None przy błędzie formatu."""
    # repertorium NSA/WSA zawiera ukośnik siedziby (SA/Bk, SAB/Wa) — dopuszczony
    m = re.match(r"^(?:([IVXL]+)\s+)?([A-Za-z][A-Za-z\-]*(?:/[A-Za-z]+)?)\s+(\d+)/(\d{2,4})$",
                 normalizuj(syg))
    if not m:
        return None
    izba, rep, nr, rok = m.groups()
    rok = int(rok)
    if rok < 100:
        rok += 1900 if rok > 50 else 2000
    return izba, rep, int(nr), rok


# ==========================================================================
# V-SYG-0.2 — ROUTING
# ==========================================================================
def routuj(rep: str) -> str:
    if rep in REP_SN:
        return "SN"
    if rep in REP_KIO:
        return "KIO"
    if rep.upper().startswith("SA/") or rep.upper() in {"FSK", "OSK", "GSK", "FSN"}:
        return "CBOSA"
    if rep in REP_POWSZECHNE:
        return "POWSZECHNE"
    if rep in REP_TK:
        return "TK"
    return "NIEZNANE"


# ==========================================================================
# V-SYG-0.3 — OKNO POKRYCIA
# ==========================================================================
def w_oknie(court_type: str, rok: int) -> bool:
    o = OKNO.get(court_type)
    if not o or o["do"] is None:
        return False
    return rok <= int(o["do"][:4])


# ==========================================================================
# V-SYG-0.4 — POST-CHECK TOŻSAMOŚCI
# ==========================================================================
def tozsame(pytana: str, zwrocona: str) -> bool:
    return normalizuj(pytana).upper() == normalizuj(zwrocona).upper()


# ==========================================================================
# KANAŁY
# ==========================================================================
def saos_case_number(syg: str):
    r = requests.get(SAOS, params={"caseNumber": normalizuj(syg), "pageSize": 10},
                     headers=UA_NEUTRALNY, timeout=TIMEOUT)
    r.raise_for_status()
    j = r.json()
    return j.get("info", {}).get("totalResults", 0), j.get("items", [])


def sn_search(syg: str):
    """⚠️ Wymaga UA przeglądarkowego (wyjątek §1) i hosta bez 'www.'."""
    r = requests.get(SN, params={"option": "com_ajax", "plugin": "snproxy",
                                 "format": "json", "task": "searchOrzeczenia",
                                 "sygnatura": normalizuj(syg), "strona": 1,
                                 "rozmiar_strony": 25},
                     headers=UA_PRZEGLADARKA, timeout=TIMEOUT)
    r.raise_for_status()
    try:
        return r.json()["data"][0]["data"]
    except (KeyError, IndexError, ValueError):
        return []


def ms_search(syg: str):
    """Portal Orzeczeń — kodowanie kontekstu Tapestry: ' '->$0020, '/'->$002f."""
    enc = normalizuj(syg).replace(" ", "$0020").replace("/", "$002f")
    url = f"{MS}/search/advanced/$N/{enc}" + "/$N" * 15 + "/1"
    r = requests.get(url, headers=UA_NEUTRALNY, timeout=TIMEOUT)
    r.raise_for_status()
    if "Nie znaleziono" in r.text:
        return 0, url
    m = re.search(r'big_number[^>]*>([^<]+)<', r.text)
    return (int(m.group(1).strip().replace("\xa0", "")) if m else 0), url


# ==========================================================================
# ORKIESTRACJA V-SYG-0
# ==========================================================================
def v_syg_0(syg: str) -> dict:
    wynik = {"pytana": syg, "znormalizowana": normalizuj(syg),
             "data_pomiaru": datetime.date.today().isoformat()}
    czesci = rozbierz(syg)
    if not czesci:
        wynik.update(status="BLAD_FORMATU",
                     uzasadnienie="sygnatura nie pasuje do wzorca "
                                  "[izba] repertorium numer/rok (V-SYG-2)")
        return wynik
    izba, rep, nr, rok = czesci
    baza = routuj(rep)
    wynik.update(repertorium=rep, rok=rok, baza=baza)
    if rep in REP_TK and rep in REP_POWSZECHNE:
        wynik["uwaga"] = (f"repertorium {rep!r} jest wieloznaczne (SR/SO vs TK) — "
                          "rozstrzyga kontekst sprawy; przy wątpliwości odpytaj obie bazy")

    if baza == "CBOSA":
        # ⛔ Ten skrypt nie ma kanału retrieval ani gwarantowanego direct CBOSA.
        #    Nie orzeka więc o globalnej niedostępności źródła; deleguje do
        #    kanonicznego V-SYG-0.5 / V-SYG-0.7.
        wynik.update(status="OUT_OF_SCOPE",
                     zakres_potwierdzenia=None,
                     uzasadnienie="ten runtime skryptu nie potwierdził direct CBOSA; "
                                  "SAOS ADMINISTRATIVE nie jest zamiennikiem — "
                                  "wymagana procedura host-aware (F-183a)",
                     wymagane_dalsze_dzialanie={
                         "procedura": "fresh-probe V-SYG-0.7; przy braku direct → V-SYG-0.5 RETRIEVAL/SNAPSHOT",
                         "zapytanie_discovery": f'site:orzeczenia.nsa.gov.pl "{normalizuj(syg)}"',
                         "post_check_hosta": "https + hostname == orzeczenia.nsa.gov.pl + path /doc/{10x A-Z0-9}",
                         "post_check_sygnatury": "exact-match po normalizacji; near-match odrzuć",
                         "provenance": "CRAWLED_OR_INDEXED dla snapshotu; content_scope wg faktycznie odczytanej treści",
                         "dopuszczalne_wyniki": ["FOUND w retrieval + content_scope", "OUT_OF_SCOPE"],
                         "zakaz": "NOT_FOUND — brak w retrieval != brak w bazie; snapshot != DIRECT_LIVE",
                     })
        return wynik
    if baza in ("TK", "KIO", "NIEZNANE"):
        if not w_oknie({"TK": "CONSTITUTIONAL_TRIBUNAL",
                        "KIO": "NATIONAL_APPEAL_CHAMBER"}.get(baza, ""), rok):
            wynik.update(status="OUT_OF_SCOPE",
                         uzasadnienie=f"brak filtra po sygnaturze dla {baza} "
                                      "i rocznik poza oknem SAOS (F-184/F-185)")
            return wynik

    trafienia = []
    if baza == "SN":
        for it in sn_search(syg):
            trafienia.append({"sygnatura": it.get("sygnatura_sprawy", ""),
                              "data": it.get("data_wydania"),
                              "zrodlo": "sn.pl"})
    elif baza == "POWSZECHNE":
        n, url = ms_search(syg)
        trafienia = [{"sygnatura": normalizuj(syg), "zrodlo": url}] * n
    else:
        ct = {"TK": "CONSTITUTIONAL_TRIBUNAL", "KIO": "NATIONAL_APPEAL_CHAMBER"}.get(baza)
        if ct and w_oknie(ct, rok):
            total, items = saos_case_number(syg)
            trafienia = [{"sygnatura": i.get("caseNumbers", [""])[0] if i.get("caseNumbers") else "",
                          "zrodlo": "saos"} for i in items]

    # V-SYG-0.4 — post-check tożsamości
    if baza == "SN":
        zgodne = [t for t in trafienia if tozsame(syg, t["sygnatura"])]
        odrzucone = [t["sygnatura"] for t in trafienia if t not in zgodne]
        wynik["odrzucone_post_checkiem"] = odrzucone
        trafienia = zgodne

    if len(trafienia) == 1:
        wynik.update(status="FOUND", trafienie=trafienia[0],
                     zakres_potwierdzenia="ISTNIENIE+TRESC" if baza == "SN" else "ISTNIENIE")
    elif len(trafienia) > 1:
        wynik.update(status="AMBIGUOUS", liczba=len(trafienia))
    else:
        if wynik.get("uwaga"):
            # K-SYG-1: gałąź TK nie została odpytana, więc zero nie jest
            # zerem w bazie pokrywającej — to OUT_OF_SCOPE, nie NOT_FOUND
            wynik.update(status="OUT_OF_SCOPE",
                         uzasadnienie="repertorium wieloznaczne, odpytano wyłącznie "
                                      "bazę sądów powszechnych; gałąź TK bez kanału "
                                      "kontroli po sygnaturze (F-184)")
        elif baza == "SN" and rok > int(OKNO["SUPREME"]["do"][:4]):
            wynik.update(status="NOT_FOUND",
                         uzasadnienie="sn.pl jest bazą bieżącą — zero trafień "
                                      "w niej jest rozstrzygające")
        else:
            wynik.update(status="NOT_FOUND")
    return wynik


# ==========================================================================
def cmd_okno():
    print(f"# Okno pokrycia SAOS — pomiar {datetime.date.today().isoformat()}")
    for ct in OKNO:
        r = requests.get(SAOS, params={"courtType": ct, "pageSize": 10},
                         headers=UA_NEUTRALNY, timeout=TIMEOUT)
        total = r.json().get("info", {}).get("totalResults", 0)
        najnowsza = None
        # ⛔ nie z sortowania — baza zawiera daty 3013-12-04 i 0208-03-14
        for rok in range(datetime.date.today().year, 1985, -1):
            rr = requests.get(SAOS, params={"courtType": ct, "pageSize": 10,
                                            "judgmentDateFrom": f"{rok}-01-01",
                                            "judgmentDateTo": f"{rok}-12-31",
                                            "sortingField": "JUDGMENT_DATE",
                                            "sortingDirection": "DESC"},
                              headers=UA_NEUTRALNY, timeout=TIMEOUT)
            it = rr.json().get("items", [])
            if it:
                najnowsza = it[0].get("judgmentDate")
                break
            time.sleep(0.5)
        print(f"  {ct:26} total={total:>8}  najnowsze={najnowsza}")
        time.sleep(1)


def cmd_kanaly():
    print(f"# Kanały orzecznicze — pomiar {datetime.date.today().isoformat()}")
    probki = [
        ("SAOS", SAOS + "?caseNumber=III+CZP+25/11&pageSize=10", UA_NEUTRALNY),
        ("sn.pl (UA przegl.)", SN + "?option=com_ajax&plugin=snproxy&format=json"
                                    "&task=searchOrzeczenia&sygnatura=III+CZP+25/11"
                                    "&strona=1&rozmiar_strony=25", UA_PRZEGLADARKA),
        ("sn.pl (UA neutralny)", SN + "?option=com_ajax&plugin=snproxy&format=json"
                                      "&task=searchOrzeczenia&sygnatura=III+CZP+25/11"
                                      "&strona=1&rozmiar_strony=25", UA_NEUTRALNY),
        ("orzeczenia.ms.gov.pl", MS + "/search/advanced/$N/I$0020C$0020100$002f15"
                                      + "/$N" * 15 + "/1", UA_NEUTRALNY),
        ("CBOSA", "https://orzeczenia.nsa.gov.pl/cbo/query", UA_NEUTRALNY),
        ("ipo.trybunal.gov.pl", "https://ipo.trybunal.gov.pl/ipo/Szukaj", UA_NEUTRALNY),
        ("orzeczenia.uzp.gov.pl", "https://orzeczenia.uzp.gov.pl/Home/Search?Sign=KIO+827/18",
         UA_NEUTRALNY),
    ]
    for nazwa, url, h in probki:
        try:
            r = requests.get(url, headers=h, timeout=TIMEOUT)
            deny = r.headers.get("x-deny-reason")
            nota = f" ⛔ ODMOWA PROXY ({deny})" if deny else ""
            print(f"  {nazwa:24} http={r.status_code} len={len(r.content)}{nota}")
        except Exception as e:  # noqa: BLE001
            print(f"  {nazwa:24} WYJATEK {type(e).__name__}: {str(e)[:80]}")
        time.sleep(2)


def cmd_selftest():
    """Offline — sprawdza warstwy 0.1, 0.2, 0.3, 0.4 bez sieci."""
    ok = True

    def spr(opis, got, exp):
        nonlocal ok
        stan = "OK " if got == exp else "BLAD"
        if got != exp:
            ok = False
        print(f"  [{stan}] {opis}: {got!r} (oczekiwano {exp!r})")

    spr("0.1 podwójna spacja", normalizuj("III  CZP  25/11"), "III CZP 25/11")
    spr("0.1 kropki w repertorium", normalizuj("II C.S.K. 750/15"), "II CSK 750/15")
    spr("0.1 spacje brzegowe", normalizuj("  I C 100/15 "), "I C 100/15")
    spr("0.2 routing SN", routuj("CSK"), "SN")
    spr("0.2 routing sądy powszechne", routuj("ACa"), "POWSZECHNE")
    spr("0.2 routing KIO", routuj("KIO"), "KIO")
    spr("0.3 SUPREME 2015 w oknie", w_oknie("SUPREME", 2015), True)
    spr("0.3 SUPREME 2024 poza oknem", w_oknie("SUPREME", 2024), False)
    spr("0.3 ADMINISTRATIVE zawsze poza", w_oknie("ADMINISTRATIVE", 2010), False)
    spr("0.4 tożsamość mimo kapitalików", tozsame("iii czp 25/11", "III CZP 25/11"), True)
    spr("0.4 I NSNc 10/24 != II NSNc 10/24",
        tozsame("I NSNc 10/24", "II NSNc 10/24"), False)
    spr("format: brak rocznika", rozbierz("III CZP 25"), None)
    spr("format: brak izby dopuszczalny", rozbierz("KIO 827/18") is not None, True)
    spr("0.2 routing NSA po ukośniku", routuj("SA/Bk"), "CBOSA")
    spr("0.2 routing NSA (OSK)", routuj("OSK"), "CBOSA")
    spr("0.5 post-check tytułu: fabrykat", tozsame("I FSK 999999/23", "I FSK 919/23"), False)
    spr("0.5 post-check tytułu: trafienie", tozsame("i fsk 229/20", "I FSK 229/20"), True)
    print("\nSELFTEST:", "PASS" if ok else "FAIL")
    return 0 if ok else 1


def main():
    ap = argparse.ArgumentParser(description="V-SYG-0 — weryfikator sygnatur")
    ap.add_argument("--sygnatura")
    ap.add_argument("--okno", action="store_true")
    ap.add_argument("--kanaly", action="store_true")
    ap.add_argument("--selftest", action="store_true")
    a = ap.parse_args()
    if a.selftest:
        return cmd_selftest()
    if requests is None:
        print("BLAD: brak modułu requests", file=sys.stderr)
        return 2
    if a.okno:
        return cmd_okno()
    if a.kanaly:
        return cmd_kanaly()
    if a.sygnatura:
        print(json.dumps(v_syg_0(a.sygnatura), ensure_ascii=False, indent=2))
        return 0
    ap.print_help()
    return 1


if __name__ == "__main__":
    sys.exit(main() or 0)
