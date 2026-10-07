# KONTRAKT ROUTERA W PREFERENCJACH — kontrola zgodności (od audyt 6.125)

## Dlaczego nie ma już zapisu do pamięci trwałej

Wersje do 6.124 kazały dopisywać blok `LEX-MACHINA-ROUTER:START/END` do trwałej
pamięci hosta. Sesja produkcyjna wykazała, że klasyfikator pamięci odrzuca taki
blok, bo składa się z dyrektyw sterujących zachowaniem modelu. Procedura była
więc niewykonalna z założenia. Ponadto kopia z numerem wersji zawsze
dryfowała: blok „3.29” przy routerze 3.32, później router 3.5x.

Nośnikiem kontraktu są **preferencje użytkownika** (Ustawienia → Profil),
które host dołącza do każdej rozmowy, oraz sam router przy każdym wywołaniu.

## Trigger

Pozycja 13 menu albo polecenie „zsynchronizuj pamięć routera”.

## Procedura (tylko odczyt)

1. Odczytaj świeże UP-1…UP-6 z `prawny-router-v3/SKILL.md`.
2. Odczytaj preferencje użytkownika widoczne w kontekście rozmowy.
3. Porównaj **treść**, nie numery wersji. Rozbieżność = preferencja, która
   przeczy UP (np. „ISAP każdy przepis” przy UP-2 „ELI pierwszy”) albo UP
   krytyczna nieobecna w preferencjach.
4. Pokaż rozbieżności i tekst proponowany do wklejenia. Wzorzec (≤ 4 linie,
   bez numeru wersji, żeby nie dryfował):

```text
Prawo PL: router→v3 pierwszy, HYBRID-VAL przed .docx. Karne: +kwalifikator.
Przepisy: ELI → ISAP (link dla człowieka) → LEX/Legalis → ArsLege; nigdy z pamięci.
Orzeczenia tylko z odczytanego rekordu. Zablokowane? — inna droga. Błędy nazywam wprost.
```

5. Nie zapisuj niczego w pamięci hosta. Wynik: `ZGODNE`, `ROZBIEŻNE: [lista]`
   albo `PREFERENCJE NIEWIDOCZNE W KONTEKŚCIE`.
6. Odnotuj wynik w `AUDIT-JOURNAL.md`, jeżeli host pozwala na zapis.

## Antydryft

Preferencje nie niosą numeru wersji routera. Zmiana `version:` routera nie
wymaga żadnej akcji, dopóki nie zmienia treści UP-1…UP-6.
