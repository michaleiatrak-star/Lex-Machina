# Audyt: czego kancelaria jeszcze potrzebuje

Stan: 2026-09-25 · podstawa: przegląd tras API runtime, zakładek UI i korpusu skilli

**Wniosek:** rdzeń prawny i prywatność są mocne (anonimizacja, weryfikacja przepisów, workflow pism). Największe braki to **ciągłość danych** (brak kopii zapasowych), **praca zespołowa** (runtime tylko na jednym komputerze), **terminy** (brak przypomnień i kalkulatora) oraz **obowiązki zawodowe** (konflikt interesów, AML, retencja akt).

---

## 1. Co już jest

| Obszar | Stan |
|---|---|
| Sprawy | szyfrowany magazyn, foldery, archiwum, przekazanie, dostęp per użytkownik, rotacja klucza |
| Dokumenty | OCR (tylko grafika), podgląd, edycja DOCX/ODT/XLSX, wersja zanonimizowana, deanonimizacja |
| Prywatność | SGJP + Stanza + identyfikatory + opcjonalnie lokalne AI; wspólny klucz sprawy; audyt 500 dok. bez wycieków |
| Prawo | router-v3 + DR-01...16, rdzeń aktów z ELI, SAOS/CBOSA/SN, źródła MCP, HYBRID-VAL przed .docx |
| Workflow | pismo procesowe, analiza sądowa, chronologia, analiza umów, pisma proste |
| Terminarz | wydarzenia sprawy: rozprawa, termin, spotkanie, inne |
| Kancelaria | biblioteka wzorów i know-how, użytkownicy i role, blokada, kod odzyskiwania |

---

## 2. Braki - priorytety

### P1 - ryzyko utraty danych lub naruszenia obowiązków

| # | Potrzeba | Stan | Propozycja | Nakład |
|---|---|---|---|---|
| 1 | **Kopie zapasowe** | brak (dane tylko w profilu Windows) | automatyczna, szyfrowana kopia magazynów i kluczy (dysk zewnętrzny / NAS / chmura), harmonogram, test odtworzenia, ostrzeżenie o braku kopii > 7 dni | 3-5 dni |
| 2 | **Przypomnienia o terminach** | terminarz bez powiadomień | powiadomienia systemowe Windows + e-mail (po integracji Google), eskalacja 7/3/1 dzień, widok „terminy w tym tygodniu” dla całej kancelarii | 2-3 dni |
| 3 | **Kalkulator terminów procesowych** | brak w aplikacji (jest w skillach DR-16) | od daty doręczenia: termin ustawowy, dni wolne, soboty (art. 115 KC, art. 165 KPC - weryfikacja przez ELI), wpis do terminarza jednym kliknięciem | 2-3 dni |
| 4 | **Konflikt interesów** | brak | przy zakładaniu sprawy: porównanie stron (nazwiska, PESEL/NIP, firmy) z bazą wszystkich spraw - lokalnie, na kluczach sprawy; raport „brak konfliktu / możliwy konflikt” zapisany w sprawie | 3-4 dni |
| 5 | **Retencja i usuwanie akt** | archiwizacja bez polityki | okres przechowywania per sprawa (np. 10 lat), przypomnienie o końcu okresu, trwałe usunięcie z protokołem (RODO art. 17 i 30) | 2 dni |

### P2 - praca zespołowa i codzienność

| # | Potrzeba | Stan | Propozycja | Nakład |
|---|---|---|---|---|
| 6 | **Praca wielostanowiskowa** | runtime tylko 127.0.0.1, jeden komputer | tryb serwera kancelarii (runtime na jednym komputerze/serwerze w LAN, TLS + logowanie) albo synchronizacja szyfrowanych magazynów; blokady edycji | 2-3 tyg. |
| 7 | **Rejestr klientów** | klient tylko w treści spraw | karta klienta (dane, kontakt, sprawy, pełnomocnictwa, zgody), wyszukiwanie; dane w szyfrowanym magazynie | 4-5 dni |
| 8 | **Czas pracy i rozliczenia** | brak | ewidencja czasu per sprawa (stoper / ręcznie), stawki, raport dla klienta (PDF/XLSX), eksport do faktury; później KSeF | 1-2 tyg. |
| 9 | **Integracja Google** | projekt (`docs/PROJEKT-INTEGRACJA-GOOGLE.md`) | Kalendarz, Dysk, Gmail (wysyłka), Dokumenty/Arkusze | 3-4 tyg. |
| 10 | **Wyszukiwanie we wszystkich sprawach** | wyszukiwanie w obrębie sprawy / kancelarii | jedno pole: sprawy, dokumenty, strony, terminy (z uprawnieniami) | 3 dni |
| 11 | **Szablony z polami** | wzory DOCX jako tekst dla modelu | pola scalane (`{{klient.nazwa}}`, `{{sygnatura}}`) wypełniane z karty klienta i sprawy bez modelu AI | 3-4 dni |
| 12 | **Sygnatury i dane sprawy** | nazwa sprawy | pola: sygnatura, sąd/organ, wydział, wartość przedmiotu sporu, strona przeciwna, pełnomocnik przeciwny | 2 dni |

### P3 - rozszerzenia

| # | Potrzeba | Propozycja | Uwagi |
|---|---|---|---|
| 13 | **AML** (gdy kancelaria jest instytucją obowiązaną) | ankieta ryzyka klienta, weryfikacja beneficjenta (CRBR), rejestr | skill DR-06 zawiera metodykę |
| 14 | **e-Doręczenia / ePUAP** | odbiór i nadawanie z wpisem do sprawy | wymaga zbadania dostępnych API i uwierzytelnienia |
| 15 | **Portal Informacyjny Sądów** | pobieranie doręczeń i terminów do sprawy | zbadać dostęp dla profesjonalnych pełnomocników |
| 16 | **Podpis kwalifikowany** | podpis PAdES/XAdES pisma przed wysłaniem (karta/podpis w chmurze) | zależny od dostawcy podpisu |
| 17 | **KRS / CEIDG / REGON** | pobranie danych strony po NIP/KRS do karty klienta | część dostępna przez źródła MCP |
| 18 | **Import poczty i skanera** | przeciągnij maila (.eml/.msg) do sprawy; skanowanie wprost do sprawy z OCR | .msg wymaga parsera |
| 19 | **Dyktowanie** | mowa → tekst lokalnie (Whisper) do notatek i pism | działa offline |
| 20 | **Pulpit kancelarii** | terminy, sprawy bez aktywności, dokumenty do przejrzenia, wykorzystanie modeli | |

---

## 3. Jakość i utrzymanie (znalezione przy audycie)

- **Instalator niepodpisany** (online): Windows SmartScreen ostrzega; podpis Authenticode działa w innych workflow - użyć go w wydaniach.
- **Instalator offline** wstrzymany - potrzebny dla stanowisk bez internetu.
- **Brak testu E2E z prawdziwym modelem** (konto Claude, Bielik) w CI - dodać ręczną listę kontrolną przed wydaniem albo osobny runner.
- **Morfologia nazwisk-rzeczowników**: „pani Rada” daje formę bazową „Rado” (wniosek z płci męskiej) - do poprawy przy nazwiskach żeńskich równych rzeczownikom.
- **Workflow w repozytorium**: 38 plików jednorazowych wydań (`release-*`, `publish-*`, `hotfix-*`) - uporządkować przy przenosinach do nowego repozytorium.

---

## 4. Rekomendowana kolejność

1. Kopie zapasowe (P1-1) - przed jakimkolwiek wdrożeniem produkcyjnym.
2. Terminy: przypomnienia + kalkulator (P1-2, P1-3).
3. Konflikt interesów + retencja (P1-4, P1-5).
4. Dane sprawy i karta klienta (P2-12, P2-7) - baza dla szablonów, rozliczeń i Google.
5. Integracja Google (P2-9) i szablony z polami (P2-11).
6. Praca wielostanowiskowa (P2-6) - gdy w kancelarii pracuje więcej niż jedna osoba na osobnych komputerach.
