# MOD-DESCRIPTION — Walidacja pola description (OBECNOŚĆ + długość)

## Cel
Weryfikuje dwie rzeczy:
1. czy pole `description:` w `SKILL.md` istnieje i nie jest puste;
2. czy jego treść mieści się w profilu wspólnym dla jednego ZIP-a używanego
   zarówno w Claude, jak i w ChatGPT.

## Progi profilu uniwersalnego

**HARD LIMIT: 200 znaków** dla `description`.

- brak pola / pole puste → ❌ CRIT
- 1–180 znaków → ✅ OK
- 181–200 znaków → ⚠️ WARN (mały zapas na przyszłe doprecyzowanie)
- >200 znaków → ❌ CRIT

Ten próg jest świadomie bardziej konserwatywny niż limity części implementacji
Agent Skills. Celem Lex-Machina jest ten sam kompletny ZIP na obu hostach, więc
walidacja stosuje wspólny mianownik zamiast dwóch forków skilla.

⚠️ Nie myl „0 znaków” z „OK”. Brak pola i puste pole są osobnymi błędami.
Kanoniczne narzędzie: `scripts/check_description.py` (T14).

## Wykrycie

Uruchom:

```bash
python3 scripts/check_description.py /sciezka/do/katalogu-ze-skillami
```

Jeżeli środowisko ma ustawione `LEX_MACHINA_ROOT` lub `REPO_ROOT`, albo skrypt
znajduje się w standardowym drzewie Lex-Machina, argument katalogu można pominąć.

## Procedura naprawy

Gdy description przekracza 200 znaków:

1. Odczytaj aktualny frontmatter `SKILL.md`.
2. Skróć description zachowując przede wszystkim:
   - główne triggery wywołania,
   - rzeczywisty zakres skilla,
   - najważniejsze ograniczenie odróżniające go od sąsiednich skilli.
3. Usuń szczegóły techniczne, historię zmian i wyczerpujące listy — należą do
   korpusu `SKILL.md` albo `references/`, nie do description.
4. Nie zmieniaj treści tylko po to, aby użyć innego stylu. Jeżeli instrukcja jest
   jednoznaczna i działa na obu hostach, pozostaw ją bez zmian.
5. Uruchom T14 ponownie.

## Raport

Raportuj co najmniej: skill, długość przed, długość po i status T14.
