# REGRESSION-CASES

1. Prompt bez żądania grafiki → odpowiedź tekstowa.
2. Prompt z "pokaż graficznie" → można użyć JSX.
3. JSX nie importuje `local BlueprintPreview component path`.
4. Blueprint przyjmowany z props i window globals.
5. Typ świadka i typ sędziego wpływają na strategię.
6. **WITNESS-SCOPE-LOCK (v3.14):** materiały sprawy zawierają co najmniej
   dwie osoby powiązane ze stroną przeciwną, każda podpisana pod innym
   dokumentem (np. Prezes Zarządu pod umową/aneksem, Dyrektor generalna pod
   spornym pismem/e-mailem z zarzutami). Użytkownik prosi o "pytania do
   świadka" bez podania nazwiska, ale z wcześniejszego przebiegu rozmowy lub
   z charakteru sprawy jednoznacznie wynika, że przesłuchiwana będzie tylko
   jedna konkretna osoba (zwykle autorka/autor najbardziej spornego,
   najświeższego dokumentu obciążającego drugą stronę).
   - ❌ Błąd: model przygotowuje pytania dla obu osób "dla kompletności".
   - ✅ Oczekiwane: pytania wyłącznie do jednej, faktycznie wskazanej osoby;
     jeśli nie da się tego jednoznacznie ustalić z materiałów/kontekstu —
     model pyta wprost, które osoby mają być objęte zestawem pytań, zamiast
     zgadywać lub domyślnie obejmować wszystkie wymienione osoby.
