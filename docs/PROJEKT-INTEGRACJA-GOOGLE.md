# Projekt: integracja z Google (Kalendarz, Gmail, Dysk, Dokumenty, Arkusze)

Status: projekt, nie wdrożone · 2026-09-25

**Zasady nadrzędne**
- Nic nie wychodzi do Google bez wyraźnego działania użytkownika; model może *zaproponować* termin, mail lub zapis, ale wykonuje je dopiero człowiek po podglądzie (wysłanego maila nie da się cofnąć).
- Najmniejsze możliwe uprawnienia (scopes), włączane stopniowo, osobno dla każdej funkcji.
- Tajemnica zawodowa: zalecany Google Workspace z umową powierzenia (DPA) i regionem danych UE; konto prywatne Gmail - tylko z ostrzeżeniem.
- Do Google trafia treść jawna (to magazyn kancelarii, nie model AI) - przy każdym eksporcie wybór: wersja jawna albo zanonimizowana.

---

## 1. Funkcje i kolejność wdrożenia

| Etap | Funkcja | Scope Google | Klasa scope* |
|---|---|---|---|
| 1 | Terminy sprawy → Kalendarz Google (osobny kalendarz „Lex Machina”, przypomnienia) | `calendar.events` (+ `calendar.app.created`, jeśli dostępny) | wrażliwy |
| 1 | Zapis pisma / pliku sprawy na Dysk (`Lex Machina/<sprawa>/`) | `drive.file` | zwykły |
| 2 | Powiadomienia e-mail (termin, dokument gotowy) i wysyłka pisma do klienta | `gmail.send` | wrażliwy |
| 2 | Udostępnienie pliku z Dysku (link / osoba, rola czytelnik/komentujący) | `drive.file` | zwykły |
| 3 | Edycja w Dokumentach i Arkuszach Google: DOCX/XLSX → Google Doc/Sheet (konwersja przy wysyłce), powrót jako nowa wersja w sprawie | `drive.file` (+ Docs/Sheets API na plikach aplikacji) | zwykły |
| 4 | Import maili i załączników do sprawy | `gmail.readonly` | ograniczony |

\* Klasyfikację każdego scope i wymogi weryfikacji aplikacji (w tym audyt bezpieczeństwa dla scope ograniczonych) trzeba potwierdzić w aktualnej dokumentacji Google przed wdrożeniem. Dla jednej kancelarii najprościej: projekt w Google Cloud typu **Internal** w domenie Workspace (bez publicznej weryfikacji).

Etap 4 celowo na końcu: odczyt całej skrzynki to najszersze uprawnienie i najwięcej danych osobowych.

---

## 2. Architektura

```
lex-web (UI)  ──HTTP 127.0.0.1──>  lex-runtime
                                     ├─ google/auth.ts      OAuth 2.0 (desktop: loopback + PKCE)
                                     ├─ google/tokens.ts    refresh token w keyringu systemu (jak klucze API)
                                     ├─ google/client.ts    REST (fetch), backoff 429/5xx, limity
                                     ├─ google/calendar.ts  terminy sprawy <-> wydarzenia
                                     ├─ google/drive.ts     foldery sprawy, upload, konwersja, udostępnianie
                                     ├─ google/gmail.ts     wysyłka (MIME, załączniki), szablony
                                     └─ google/outbox.ts    kolejka działań + audyt
```

- Wszystkie wywołania robi runtime (nie webview) - bez zmian CSP okna.
- Logowanie: przeglądarka systemowa → `http://127.0.0.1:<losowy port>/oauth/callback`; PKCE + `state`; tokeny nigdy do UI.
- Każde działanie wychodzące przechodzi przez **outbox**: podgląd → potwierdzenie → wykonanie → wpis audytu (kto, kiedy, co, identyfikator obiektu Google, bez treści). Nieudane - ponowienie z backoff; offline - kolejka.
- Mapowanie obiektów w magazynie sprawy (szyfrowane): `termin ↔ eventId`, `plik ↔ driveFileId (+ wersja)`, `folder sprawy ↔ driveFolderId`.

---

## 3. Szczegóły funkcji

**Kalendarz**
- Źródło prawdy: terminarz sprawy w Lex (już istnieje: `/api/cases/:caseId/schedule`).
- Synchronizacja jednokierunkowa Lex → Google na start (tworzenie, zmiana, usunięcie); w opisie wydarzenia tylko nazwa sprawy i rodzaj terminu, bez danych osobowych stron (ustawienie).
- Przypomnienia: domyślnie 7 dni, 1 dzień, 2 godziny (konfigurowalne); terminy procesowe oznaczone kolorem.
- Później: import zmian z Google (wykrywanie konfliktu po `etag`).

**Dysk**
- Struktura: `Lex Machina/<nazwa sprawy>/` (+ podfoldery jak w sprawie).
- „Zapisz na Dysku” przy pliku i przy wygenerowanym piśmie; wybór wersji: jawna / zanonimizowana.
- Udostępnianie: adres e-mail + rola; podsumowanie przed zatwierdzeniem („plik X będzie widoczny dla Y”).

**Gmail**
- Szablony: przypomnienie o terminie, dokument gotowy, wysyłka pisma (załącznik z Dysku lub bezpośrednio).
- Zawsze podgląd adresatów, tematu, treści i załączników przed wysyłką; brak automatycznej wysyłki przez model.
- Powiadomienia automatyczne (np. termin za 7 dni) tylko do samego użytkownika, po włączeniu w ustawieniach.

**Dokumenty i Arkusze**
- „Otwórz w Google” → upload z konwersją do formatu Google, link w przeglądarce.
- „Pobierz zmiany” → eksport do DOCX/XLSX i zapis jako nowa wersja w sprawie (oryginał zostaje); nowa wersja przechodzi normalne przetwarzanie (OCR/anonimizacja) przed wysłaniem do modelu.

**Model AI a Google**
- Narzędzia dla modelu tylko w trybie *propozycji*: `propose_calendar_event`, `propose_email`, `propose_drive_save` - tworzą wpis w outboxie do zatwierdzenia; model nigdy nie dostaje tokenów ani odczytu skrzynki.
- Dane z symbolami są deanonimizowane lokalnie przed zatwierdzeniem (jak dziś w pismach).

---

## 4. UI

- Ustawienia → **Google**: połącz / rozłącz konto, lista włączonych funkcji (każda włącza własny scope), region i ostrzeżenie o koncie prywatnym.
- Sprawa: przyciski „Zapisz na Dysku”, „Udostępnij”, „Wyślij e-mailem”, „Otwórz w Dokumentach Google”; przy terminach „Dodaj do Kalendarza”.
- Panel **Do wysłania** (outbox): oczekujące, wysłane, błędy z możliwością ponowienia.

---

## 5. Bezpieczeństwo i zgodność

- Refresh token w keyringu systemu; odwołanie dostępu = `revoke` + usunięcie tokenu.
- Minimalne scope, dodawane dopiero przy pierwszym użyciu funkcji (incremental authorization).
- Audyt każdej operacji wychodzącej (bez treści maila i dokumentu).
- Rejestr czynności przetwarzania (RODO): Google jako podmiot przetwarzający - wymagana umowa (Workspace DPA).
- Blokada: plik z tekstem jawnym zawierającym dane wrażliwe - wymagane dodatkowe potwierdzenie.

---

## 6. Plan i szacunek

| Etap | Zakres | Szacunek |
|---|---|---|
| 0 | projekt Google Cloud (Internal), OAuth desktop, keyring, outbox, audyt | 3-4 dni |
| 1 | Kalendarz (jednokierunkowo) + Dysk (zapis, foldery) | 4-5 dni |
| 2 | Gmail (wysyłka, szablony, powiadomienia) + udostępnianie | 3-4 dni |
| 3 | Dokumenty/Arkusze (konwersja, powrót wersji) | 3-4 dni |
| 4 | Import maili (po decyzji o scope ograniczonym) | 4-6 dni |

Testy: atrapy API Google w testach runtime (bez sieci), test E2E na koncie testowym Workspace.

**Decyzje do podjęcia**: konto Workspace czy prywatne; czy etap 4 w ogóle; czy opis terminów w kalendarzu może zawierać nazwiska stron.
