# W3-PODMIOT-GATE — Weryfikacja danych podmiotów (W3.0)

> Wydzielono z pisma-procesowe-v3/SKILL.md (v5.5) — redukcja NOTA-4
> Wywołanie: `view /mnt/skills/user/pisma-procesowe-v3/references/W3-PODMIOT-GATE.md`
> Zawiera: W3.0 PODMIOT-GATE (kroki P1–P4, formaty raportu, ZAKAZ-7).

---

### W3.0 — PODMIOT-GATE (weryfikacja danych podmiotów przed W3.1)

> ⛔ OBOWIĄZKOWE — wykonaj jako pierwsze w W3, przed weryfikacją przepisów.
> Dotyczy każdego podmiotu będącego stroną lub uczestnikiem pisma:
> powoda, pozwanego, wnioskodawcy, uczestnika, interwenienta — ORAZ
> sądu/organu z nagłówka pisma (adresata). Dane podmiotu z pamięci lub
> od użytkownika = ⚠️POD do weryfikacji. Sąd/organ z W2.2 = ⚠️POD zawsze,
> niezależnie od tego, czy użytkownik podał nazwę czy system ją dobrał.

```
DLA KAŻDEGO PODMIOTU OZNACZONEGO ⚠️POD:

KROK P1 — IDENTYFIKACJA REJESTRU:
  Podmiot prowadzący działalność:
    → spółka (sp. z o.o., S.A., sp.k., sp.j., SKA, P.SA, sp. cyw.) → KRS
    → osoba fizyczna prowadząca działalność → CEIDG
    → fundacja / stowarzyszenie → KRS
    → osoba fizyczna (konsument / pracownik) → brak rejestru → dane z akt/umów
    → organ publiczny (urząd, sąd, prokuratura) → BIP / oficjalna strona

KROK P2 — WERYFIKACJA ONLINE:
  KRS:   web_fetch → https://ekrs.ms.gov.pl/rdf/pd/search_df?
                     lub web_search: "[nazwa spółki] KRS NIP REGON"
         Potwierdzić: nazwa pełna (firma), forma prawna, KRS, NIP, REGON,
                      adres siedziby, aktualny skład zarządu/reprezentacja,
                      sposób reprezentacji (jednoosobowo / łącznie)
  CEIDG: web_fetch → https://aplikacja.ceidg.gov.pl/
         lub web_search: "[imię nazwisko] NIP CEIDG działalność gospodarcza"
         Potwierdzić: imię, nazwisko, NIP, adres do doręczeń,
                      status (aktywna/zawieszona/wykreślona)
  SĄD/ORGAN: web_search: "[nazwa sądu/organu] adres właściwość wydział"
         lub web_fetch → https://bip.ms.gov.pl (wyszukiwarka sądów)
         lub https://www.gov.pl (wykaz urzędów/organów administracji)
         Potwierdzić: pełna aktualna nazwa (sądy łączą się/zmieniają
                      nazwy), adres do doręczeń, właściwy WYDZIAŁ dla
                      danego typu sprawy (cywilny/pracy/gospodarczy/
                      karny/rodzinny), oraz że to faktycznie sąd
                      WŁAŚCIWY MIEJSCOWO i RZECZOWO dla sprawy (nie tylko
                      że istnieje) — błędny wydział lub sąd niewłaściwy
                      to wada formalna pisma, nie tylko błąd adresowy.
         Dla prokuratury: https://www.gov.pl/web/pk — analogicznie
                      (jednostka właściwa + adres).

KROK P3 — KLASYFIKACJA:
  ✅ PODMIOT-OK:    dane potwierdzone online — wstaw do pisma
  ⚠️ PODMIOT-WARN: dane częściowo potwierdzone (np. adres zmieniony) —
                    wstaw potwierdzone, oznacz rozbieżność
  ⛔ PODMIOT-CRIT: dane niezgodne lub podmiot nieznaleziony —
                    BLOKADA generowania pisma; poinformuj użytkownika

KROK P4 — UPRASZCZANIE NAGŁÓWKA (po potwierdzeniu):
  Reguła: w nagłówku pisma i miejscach oznaczenia stron stosuj WYŁĄCZNIE:
    → pełna firma (nazwa rejestrowa) z rejestru
    → forma prawna zgodna z rejestrem (nie skróty nieformalne)
    → NIP (zawsze) + KRS (dla spółek) + REGON (gdy wymagany)
    → aktualny adres siedziby z rejestru (nie adres kancelarii)
  Reguła upraszczania: jeśli pełna nazwa jest długa, stosuj skrót TYLKO
    gdy jest zarejestrowany (np. "HPG sp. z o.o." tylko gdy taki skrót
    figuruje w KRS). W przeciwnym razie: pełna nazwa przy pierwszym
    wystąpieniu, następnie: "pozwany" / "spółka".

FORMAT RAPORTU bloku POD:
  ✅ POD-1: [nazwa] — KRS: [nr] | NIP: [nr] | REGON: [nr]
             adres: [ulica, kod, miasto] — ✅ zgodny z rejestrem [data]
             reprezentacja: [sposób] przez [imię nazwisko, funkcja]
  ⚠️ POD-2: [nazwa] — NIP: [nr] ✅ | adres: ⚠️ ZMIANA — w rejestrze:
             [nowy adres]; w aktach sprawy: [stary adres]
  ⛔ POD-3: [nazwa] — NIE ZNALEZIONO w KRS/CEIDG
             → BLOKADA; użytkownik musi potwierdzić dane ręcznie
  ✅ POD-S1: [Sąd/Organ] — adres: [...] | wydział: [...] | właściwość:
             ✅ potwierdzona miejscowo i rzeczowo [data weryfikacji]
  ⛔ POD-S2: [Sąd/Organ] — ⛔ NIEWŁAŚCIWY dla sprawy (np. zły wydział
             lub zła właściwość miejscowa) → BLOKADA, wskaż właściwy sąd
```

⛔ ZAKAZ-7: Nie wpisuj do pisma danych podmiotu (NIP, KRS, REGON, adres,
forma prawna, skład zarządu) bez weryfikacji w KRS lub CEIDG. Nie wpisuj
nazwy/adresu/wydziału sądu lub organu bez weryfikacji jego aktualności
i właściwości miejscowej/rzeczowej dla sprawy.
Dane podane przez użytkownika lub przejęte z dokumentów = ⚠️POD do weryfikacji.
Wyjątek: osoba fizyczna nieprowadząca działalności — dane z akt sprawy
lub oświadczenia strony, oznacz jako [DANE Z AKT — nieweryfikowane w rejestrze].
