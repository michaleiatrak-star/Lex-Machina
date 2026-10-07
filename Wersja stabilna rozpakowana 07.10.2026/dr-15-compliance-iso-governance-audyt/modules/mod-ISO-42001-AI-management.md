# mod-ISO-42001-AI-management.md — ISO 42001 / AI Act: Zarządzanie Systemami AI i Compliance

Status: moduł norm ISO i regulacji UE klasy wzorcowej. Stan metodyczny: 2026-06-07.
ISO 42001 jest normą dobrowolną — weryfikuj aktualność na iso.org lub PKN (pkn.pl).
AI Act (Rozp. UE 2024/1689) jest aktem obowiązkowym — stosowany etapami od 02.2025.
Weryfikuj aktualne wymagania AI Act w eur-lex.europa.eu oraz wytycznych EAIA (EU AI Office).

## 1. Akty i źródła do weryfikacji

- AI Act — Rozporządzenie (UE) 2024/1689 z 13.06.2024
  [VER: eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:32024R1689]
  Stosowanie etapami:
  → 02.02.2025: zakazy systemów AI o niedopuszczalnym ryzyku (Rozdz. II)
  → 08.08.2025: obowiązki dla GPAI (modeli ogólnego przeznaczenia) + organy nadzorcze
  → 02.08.2026: pełne stosowanie (systemy wysokiego ryzyka, pozostałe)
  [WYMAGA WERYFIKACJI: sprawdź aktualne daty wdrożenia — mogły nastąpić zmiany]
- ISO/IEC 42001:2023 — Artificial intelligence. Management system
  [VER: iso.org/standard/81230.html — norma obowiązująca od 18.12.2023]
  Certyfikacja przez jednostki akredytowane przy PCA (pca.gov.pl)
- ISO/IEC 23894:2023 — AI. Guidance on risk management (wytyczne niecertyfikowalne)
- ISO/IEC TR 24368 — AI. Overview of ethical and societal concerns
- Rozporządzenie RODO — Rozp. (UE) 2016/679 (systemy AI przetwarzające dane osobowe)
  [WYMAGA WERYFIKACJI: eur-lex.europa.eu]
- Dyrektywa o odpowiedzialności za AI (AI Liability Directive) — projekt UE
  [WERYFIKUJ stan legislacyjny: eur-lex.europa.eu — czy uchwalona?]
- Krajowa implementacja — organ nadzorczy ds. AI dla Polski:
  [WYMAGA WERYFIKACJI: sprawdź web_search — organ wyznaczony / w toku wyznaczania]

Nie cytuj literalnego brzmienia przepisu ani klauzuli normy bez aktualnego sprawdzenia źródła.
AI Act stosowany etapami — zawsze weryfikuj, które przepisy już obowiązują na dzień sprawy.

## 2. Zakres spraw

- Ocena zgodności z AI Act — klasyfikacja systemu AI wg poziomu ryzyka
- Zakazy systemów AI — weryfikacja czy system podlega zakazowi (od 02.02.2025)
- Systemy AI wysokiego ryzyka (Aneks III AI Act) — obowiązki dostawcy i deployera
- GPAI (General Purpose AI) — obowiązki dostawców modeli ogólnego przeznaczenia (od 08.2025)
- Rejestracja systemów AI wysokiego ryzyka w unijnej bazie danych (EU AI database)
- Budowanie AIMS (AI Management System) wg ISO 42001:2023
- Certyfikacja ISO 42001 — przygotowanie, audyt, nadzory
- Ocena wpływu na prawa podstawowe (Fundamental Rights Impact Assessment — FRIA)
- Ocena zgodności AI z RODO (Data Protection Impact Assessment — DPIA)
- Postępowania nadzorcze dot. naruszenia AI Act
- Odpowiedzialność za szkody wyrządzone przez systemy AI (AI Liability)
- Wdrożenie systemu AI wysokiego ryzyka przez deployers (użytkowników)
- Nadzór ludzki nad systemami AI (human oversight)

## 3. Intake — ustal obowiązkowo

1. Jaki system AI jest przedmiotem sprawy? Opisz funkcję i zastosowanie.
2. Kto jest dostawcą (provider) a kto deployerem (użytkownikiem) systemu AI?
3. Jaka jest klasyfikacja ryzyka: niedopuszczalne / wysokie / ograniczone / minimalne?
4. Czy system jest GPAI (model ogólnego przeznaczenia, np. LLM)?
5. Czy system wchodzi w zakres zakazów AI (art. 5 AI Act) — czy zakaz już obowiązuje?
6. Czy system jest wymieniony w Aneksie III AI Act (systemy wysokiego ryzyka)?
7. Jakie dane osobowe przetwarza system — czy wymagane DPIA (RODO)?
8. Czy toczy się lub grozi postępowanie nadzorcze krajowego organu ds. AI / KE?
9. Jaki jest cel: compliance gap analysis / certyfikacja ISO 42001 / obrona w postępowaniu
   / ocena przed wdrożeniem / spór o szkody AI?

## 4. Klasyfikacja ryzyka AI Act

### Poziom 1 — Ryzyko niedopuszczalne (ZAKAZ od 02.02.2025)
```
⛔ ZAKAZANE bezwzględnie:
- Social scoring przez organy publiczne lub w ich imieniu
- Biometryczne rozpoznawanie emocji w miejscu pracy i edukacji (z wyjątkami)
- Kategoryzacja biometryczna na podstawie cech chronionych
- Targetowanie reklam na dzieci (profilowanie)
- Manipulacja podprogowa lub techniki eksploatujące podatności
- Biometria zdalna w czasie rzeczywistym w przestrzeni publicznej
  (z wyjątkami: terroryzm, zaginięcie dziecka, ściganie karne art. 5 ust. 1 lit. h)

[WYMAGA WERYFIKACJI AI Act art. 5 — pełna lista zakazów]
Kara: do 35 mln EUR lub 7% rocznego obrotu globalnego
```

### Poziom 2 — Wysokie ryzyko (Aneks III — obowiązki od 02.08.2026)
```
Sektory wysokiego ryzyka (Aneks III AI Act):
1. Infrastruktura krytyczna
2. Edukacja i kształcenie zawodowe
3. Zatrudnienie, zarządzanie pracownikami, dostęp do samozatrudnienia
4. Dostęp do usług prywatnych i publicznych (scoring kredytowy, ubezpieczenia)
5. Egzekwowanie prawa
6. Zarządzanie migracją, azylem, kontrola graniczna
7. Wymiar sprawiedliwości i procesy demokratyczne
8. Urządzenia medyczne (Aneks I — nakłada się z prawem medycznym)

Obowiązki DOSTAWCY (Provider) — art. 16 AI Act:
→ System zarządzania ryzykiem (art. 9)
→ Zarządzanie danymi treningowymi (art. 10)
→ Dokumentacja techniczna (art. 11, Aneks IV)
→ Rejestrowanie zdarzeń (logi) — art. 12
→ Transparentność i informacje dla deployerów (art. 13)
→ Nadzór ludzki (art. 14)
→ Dokładność, solidność, cyberbezpieczeństwo (art. 15)
→ Ocena zgodności przed wprowadzeniem na rynek (art. 43)
→ Rejestracja w EU AI database (art. 71)

Obowiązki DEPLOYERA (Deployer/User) — art. 26 AI Act:
→ Środki techniczne i organizacyjne dla nadzoru ludzkiego
→ Monitorowanie działania systemu
→ FRIA (Fundamental Rights Impact Assessment) — dla organów publicznych
→ Informowanie pracowników i osób dotkniętych systemem
```

### Poziom 3 — Ograniczone ryzyko (obowiązki transparentności)
```
Chatboty: obowiązek informowania, że użytkownik rozmawia z AI
Deepfake: oznaczanie treści generowanych przez AI
Systemy emocji: obowiązek informowania
```

### Poziom 4 — Minimalne ryzyko
```
Brak szczególnych obowiązków AI Act
(np. filtry antyspamowe, gry AI)
```

## 5. ISO 42001:2023 — Struktura AIMS

```
Kontekst organizacji (kl. 4):
  → Analiza interesariuszy AI
  → Identyfikacja systemów AI w organizacji
  → Zakres AIMS

Przywództwo (kl. 5):
  → Polityka AI — zatwierdzona przez zarząd
  → Role: AI Officer / AI Ethics Board

Planowanie (kl. 6):
  → Ocena ryzyka AI (ISO 23894)
  → Cele AI i plany działania

Wsparcie (kl. 7):
  → Zasoby, kompetencje, szkolenia z AI
  → Świadomość etyki AI

Działania operacyjne (kl. 8):
  → Cykl życia AI: projektowanie, dane treningowe, testowanie, wdrożenie, monitoring
  → Zarządzanie dostawcami AI
  → Zarządzanie incydentami AI

Ocena i doskonalenie (kl. 9–10):
  → Audyty AIMS
  → Działania korygujące
```

## 6. Mapa proceduralna

### Ścieżka — ocena zgodności przed wdrożeniem systemu AI
```
Identyfikacja systemu AI →
→ Klasyfikacja ryzyka (AI Act + czy zakaz?) →
→ [wysokie ryzyko] Ocena zgodności: dokumentacja techniczna + system zarządzania ryzykiem →
→ [GPAI] Weryfikacja obowiązków dla modeli GPAI →
→ DPIA (jeśli przetwarzanie danych osobowych) →
→ FRIA (jeśli organ publiczny lub zatrudnienie) →
→ Rejestracja w EU AI database (systemy wysokiego ryzyka) →
→ Wdrożenie + monitoring + logi
```

### Ścieżka — postępowanie nadzorcze za naruszenie AI Act
```
Wszczęcie przez krajowy organ ds. AI / KE →
→ Żądanie informacji i dokumentacji →
→ Prawo do bycia wysłuchanym →
→ Decyzja + sankcja finansowa →
→ Odwołanie (krajowa ścieżka / TSUE dla decyzji KE)
```

### Ścieżka — szkoda wyrządzona przez system AI
```
Szkoda → Identyfikacja dostawcy i deployera →
→ Ocena odpowiedzialności (AI Liability Directive / krajowe prawo deliktowe) →
→ Roszczenie cywilne →
→ [jeśli dane osobowe] Równoległa ścieżka RODO / UODO
```

## 7. Matryca dowodowa

| Fakt | Dowód | Źródło | Siła | Luka | Ryzyko |
|---|---|---|---|---|---|
| System AI wysokiego ryzyka wdrożony bez oceny zgodności | Brak dokumentacji technicznej (Aneks IV) | Własna kontrola | Wysoka | — | Naruszenie AI Act art. 43 |
| Zakaz AI naruszony | Opis funkcji systemu vs. art. 5 AI Act | Dokumentacja techniczna | Wysoka | Sporna klasyfikacja | Kara do 35 mln EUR |
| Nadzór ludzki wdrożony | Procedura nadzoru + logi interwencji | System AI + dokumentacja | Średnia | Brak logów | Kwestionowanie przez organ |
| DPIA przeprowadzona | Raport DPIA z datą | Compliance / DPO | Wysoka | Brak DPIA dla danych wrażliwych | Naruszenie RODO |
| Certyfikat ISO 42001 | Certyfikat z datą ważności | Jednostka certyfikująca | Wysoka | Brak certyfikatu | Brak dowodu zarządzania |

## 8. Typowe zarzuty i kontrargumenty

| Zarzut | Kontrargument |
|---|---|
| System objęty zakazem AI Act | Weryfikuj: czy zakaz już obowiązuje (02.02.2025); czy wyjątek z art. 5 |
| Brak oceny zgodności (Aneks IV) | Wykazać dokumentację techniczną — jeśli brak, natychmiast opracować |
| GPAI bez wymaganych dokumentacji | Od 08.2025: wykazać compliance lub plan naprawczy |
| Brak rejestracji w EU AI database | Pilna rejestracja; wykazać dobrą wiarę i działania naprawcze |
| System AI wyrządził szkodę | Ocena łańcucha odpowiedzialności: dostawca / deployer / użytkownik |

## 9. Strategia

Priorytety:

1. Zawsze zaczynaj od klasyfikacji ryzyka — determinuje cały zakres obowiązków,
2. Zakazy AI (art. 5) obowiązują od 02.02.2025 — wszelkie wdrożenia z tym ryzykiem: natychmiast audytuj,
3. Systemy wysokiego ryzyka: pełne obowiązki od 02.08.2026 — przygotuj się wcześniej,
4. GPAI (LLM, modele fundamentalne): obowiązki od 08.2025 — monitruj wytyczne EU AI Office,
5. Dla deployerów: FRIA i monitoring są tak samo ważne jak obowiązki dostawcy,
6. ISO 42001 jako rama zarządcza — uzupełnia AI Act, nie zastępuje go,
7. Sprawdź kumulację: AI Act + RODO + ewentualnie DORA (sektor finansowy) + KSC.

## 10. Orzecznictwo i praktyka nadzorcza

AI Act stosowany od 02.2025 — orzecznictwo sądowe w toku kształtowania się.
Szukaj w:
- Wytycznych EU AI Office (ai-office.ec.europa.eu),
- Stanowiskach EAIA (European AI Agency),
- Decyzjach krajowych organów ds. AI (Polska — weryfikuj wyznaczony organ),
- Opiniach UODO dot. AI i RODO,
- TSUE — przy sporach o stosowanie rozporządzenia UE.

**NIGDY nie cytuj sygnatur bez uprzedniej weryfikacji w oficjalnej bazie.**

## 11. Ryzyka

| Ryzyko | Opis | Mitygacja |
|---|---|---|
| System AI zakwalifikowany jako zakazany | Natychmiastowe zaprzestanie + sankcja do 35 mln EUR | Audyt klasyfikacji PRZED wdrożeniem |
| Brak oceny zgodności systemu wysokiego ryzyka | Naruszenie AI Act; blokada rynkowa | Gap analysis + plan naprawczy |
| GPAI bez wymagań od 08.2025 | Naruszenie AI Act; kara do 15 mln EUR lub 3% obrotu | Monitorować wytyczne EU AI Office |
| Biometryczne naruszenie zakazu | Najsurowsza kategoria kar | Zero tolerancji dla systemów z Aneksu I |
| Brak DPIA dla systemu AI przetwarzającego dane os. | Naruszenie RODO | DPIA jako element standardowej oceny AI |
| Odpowiedzialność za szkody AI niejasna | Łańcuch: dostawca → deployer → użytkownik | Klauzule umowne regulujące odpowiedzialność |

## 12. Quality gate

Przed odpowiedzią lub dokumentem stosuj:
- `shared/HYBRID-VALIDATION.md`
- `shared/TEMPORAL-LAW-CHECK.md` — AI Act stosowany etapami; daty obowiązywania krytyczne
- `shared/RISK-ASSESSMENT.md`
- `shared/FORMAL-CHECK.md` jeśli sporządzane pismo lub raport compliance

## Weryfikacja online

```
web_search: "AI Act Rozp. UE 2024/1689 daty stosowania zakazy wysokie ryzyko GPAI 2025 2026"
web_search: "AI Act systemy wysokiego ryzyka Aneks III obowiązki dostawca deployer"
web_search: "EU AI Office wytyczne GPAI obowiązki 2025"
web_search: "ISO 42001 2023 AI management system certyfikacja Polska PCA"
web_search: "AI Act organ nadzorczy Polska wyznaczenie 2025"
web_search: "AI Act zakazy systemy AI art. 5 social scoring biometria 2025"
web_search: "AI Act odpowiedzialność za AI szkody dyrektywa UE stan legislacyjny 2025 2026"
```
