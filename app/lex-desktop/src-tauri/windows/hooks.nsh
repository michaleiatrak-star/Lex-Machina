!define LEX_HOOK_FILE_DIR "${__FILEDIR__}"

!macro NSIS_HOOK_PREINSTALL
  SetOutPath "$PLUGINSDIR"
  File "/oname=lex-get-install-state.ps1" "${LEX_HOOK_FILE_DIR}\..\..\..\installer\get-install-state.ps1"
  File "/oname=lex-target-release-source.json" "${LEX_HOOK_FILE_DIR}\..\..\..\installer\windows-release-source.json"

  DetailPrint "Lex Machina: rozpoznawanie stanu istniejącej instalacji..."
  nsExec::ExecToStack '"$SYSDIR\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "$PLUGINSDIR\lex-get-install-state.ps1" -RuntimeRoot "$INSTDIR\runtime" -TargetManifestPath "$PLUGINSDIR\lex-target-release-source.json" -OutputPath "$PLUGINSDIR\lex-install-state.json" -ProductName "Lex Machina" -DiscoverRegisteredInstall -FailOnInstallRootMismatch -FailOnDowngrade'
  Pop $0
  Pop $1
  ${If} $0 == 24
    DetailPrint "Lex Machina: wykryto zmianę katalogu istniejącej instalacji."
    MessageBox MB_ICONSTOP|MB_OK "Lex Machina: wykryto istniejącą instalację w innym katalogu niż wybrany cel.$\r$\n$\r$\nW trybie aktualizacji/naprawy zachowaj wykrytą lokalizację programu. Jeżeli chcesz przenieść program, najpierw odinstaluj poprzednią instalację." /SD IDOK
    Abort
  ${ElseIf} $0 != 0
    DetailPrint "Lex Machina: preinstall state gate zablokował instalację (exit=$0)."
    MessageBox MB_ICONSTOP|MB_OK "Lex Machina: instalacja została zatrzymana przez kontrolę stanu.$\r$\n$1$\r$\n$\r$\nJeżeli zainstalowana wersja jest nowsza, użyj nowszego instalatora zamiast wykonywać downgrade." /SD IDOK
    Abort
  ${EndIf}
  DetailPrint "Lex Machina: stan instalacji $1"

  ; Tauri copies the main executable immediately after PREINSTALL.
  ; Restore the installer output directory after embedding probe files in
  ; $PLUGINSDIR, otherwise the main EXE would be emitted into the temporary
  ; plugin directory and disappear at installer shutdown.
  SetOutPath "$INSTDIR"
!macroend

!macro NSIS_HOOK_POSTINSTALL
  ; NSIS is the single owner of the thin runtime payload. The desktop trust
  ; boundary requires an exact $INSTDIR\runtime layout, so do not rely on a
  ; second Tauri resource-mapping layer for these files.
  ;
  ; Preserve heavy bootstrap components (node/python/models) across
  ; update/repair so they can be reused after version/hash checks. Replace
  ; only the app-owned thin payload deterministically.
  RMDir /r "$INSTDIR\runtime\app"
  RMDir /r "$INSTDIR\runtime\corpus"
  RMDir /r "$INSTDIR\runtime\ocr"
  RMDir /r "$INSTDIR\runtime\privacy"
  RMDir /r "$INSTDIR\runtime\storage"
  RMDir /r "$INSTDIR\runtime\bootstrap"
  Delete "$INSTDIR\runtime\lex-runtime-sidecar.exe"
  Delete "$INSTDIR\runtime\release-source.json"
  Delete "$INSTDIR\runtime\release-requirements.txt"
  Delete "$INSTDIR\runtime\npm-dependency-tree.json"
  Delete "$INSTDIR\runtime\component-lock.json"

  CreateDirectory "$INSTDIR\runtime"
  SetOutPath "$INSTDIR\runtime"
  File /r "${LEX_HOOK_FILE_DIR}\..\runtime\*"
  SetOutPath "$INSTDIR"

  ; Fail before downloading large components if the embedded thin payload is
  ; structurally incomplete.
  IfFileExists "$INSTDIR\runtime\app\dist\http\server.js" +3 0
    MessageBox MB_ICONSTOP|MB_OK "Lex Machina: instalator nie zawiera kompletnego runtime aplikacji (brak app\dist\http\server.js)." /SD IDOK
    Abort
  IfFileExists "$INSTDIR\runtime\corpus\*" +3 0
    MessageBox MB_ICONSTOP|MB_OK "Lex Machina: instalator nie zawiera korpusu skilli." /SD IDOK
    Abort
  IfFileExists "$INSTDIR\runtime\lex-runtime-sidecar.exe" +3 0
    MessageBox MB_ICONSTOP|MB_OK "Lex Machina: instalator nie zawiera natywnego sidecara runtime." /SD IDOK
    Abort

  ; Every interactive installation offers an explicit clean-profile path.
  ; Silent CI/update installs default to preserving current user data.
  MessageBox MB_ICONQUESTION|MB_YESNO "Czy chcesz rozpocząć z całkowicie czystym profilem administratora?$\r$\n$\r$\nTAK usunie wszystkie dotychczasowe profile Lex Machina, sprawy, hasła lokalne, zapisane klucze API, Local AI i ustawienia bieżącego użytkownika. Po instalacji zostanie utworzone nowe czyste konto administratora.$\r$\n$\r$\nNIE zachowa istniejący profil (aktualizacja/naprawa)." /SD IDNO IDNO lex_clean_profile_done
  DetailPrint "Lex Machina: czyszczenie profilu przed utworzeniem nowego administratora..."
  nsExec::ExecToStack '"$INSTDIR\runtime\lex-runtime-sidecar.exe" --purge-user-state'
  Pop $0
  Pop $1
  ${If} $0 != 0
    MessageBox MB_ICONSTOP|MB_OK "Lex Machina: nie udało się bezpiecznie usunąć starego profilu.$\r$\n$1$\r$\n$\r$\nInstalacja została zatrzymana, aby nie pozostawić mieszanego stanu kont." /SD IDOK
    Abort
  ${EndIf}
  DetailPrint "Lex Machina: czysty profil gotowy; pierwsze uruchomienie utworzy nowe konto administratora."
lex_clean_profile_done:

  IfFileExists "$EXEDIR\LexMachina-Offline-Runtime.zip" lex_offline_bundle lex_online_bootstrap

lex_offline_bundle:
  DetailPrint "Lex Machina: weryfikacja i instalacja lokalnego pakietu offline..."
  nsExec::ExecToStack '"$SYSDIR\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "$INSTDIR\runtime\bootstrap\windows-offline-bundle-install.ps1" -RuntimeRoot "$INSTDIR\runtime" -BundlePath "$EXEDIR\LexMachina-Offline-Runtime.zip"'
  Pop $0
  Pop $1
  ${If} $0 != 0
    FileOpen $2 "$INSTDIR\runtime\bootstrap-install-error.log" w
    FileWrite $2 "stage=offline-bundle$\r$\nexit=$0$\r$\noutput=$1$\r$\n"
    FileClose $2
    MessageBox MB_ICONSTOP|MB_OK "Lex Machina: instalacja lokalnego runtime offline nie powiodła się.$\r$\n$1" /SD IDOK
    Abort
  ${EndIf}
  Goto lex_runtime_selftest

lex_online_bootstrap:
  DetailPrint "Lex Machina: sprawdzanie i pobieranie brakujących składników runtime..."
  nsExec::ExecToStack '"$SYSDIR\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "$INSTDIR\runtime\bootstrap\windows-online-bootstrap.ps1" -RuntimeRoot "$INSTDIR\runtime"'
  Pop $0
  Pop $1
  ${If} $0 != 0
    FileOpen $2 "$INSTDIR\runtime\bootstrap-install-error.log" w
    FileWrite $2 "stage=online-bootstrap$\r$\nexit=$0$\r$\noutput=$1$\r$\n"
    FileClose $2
    MessageBox MB_ICONSTOP|MB_OK "Lex Machina: przygotowanie składników nie powiodło się.$\r$\n$1" /SD IDOK
    Abort
  ${EndIf}

lex_runtime_selftest:
  DetailPrint "Lex Machina: końcowa weryfikacja prywatnego runtime..."
  nsExec::ExecToStack '"$INSTDIR\runtime\lex-runtime-sidecar.exe" --self-test'
  Pop $0
  Pop $1
  ${If} $0 != 0
    FileOpen $2 "$INSTDIR\runtime\bootstrap-install-error.log" w
    FileWrite $2 "stage=runtime-selftest$\r$\nexit=$0$\r$\noutput=$1$\r$\n"
    FileClose $2
    MessageBox MB_ICONSTOP|MB_OK "Lex Machina: lokalny self-test nie powiódł się.$\r$\n$1" /SD IDOK
    Abort
  ${EndIf}
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  MessageBox MB_ICONEXCLAMATION|MB_YESNO "Pełna deinstalacja Lex Machina usunie program oraz wszystkie dane bieżącego użytkownika: profile i konta, sprawy i dokumenty, lokalne hasła i recovery, zapisane klucze API, Local AI, ustawienia i dane tymczasowe.$\r$\n$\r$\nTej operacji nie można cofnąć. Kontynuować?" /SD IDYES IDYES lex_full_uninstall_confirmed
  Abort

lex_full_uninstall_confirmed:
  IfFileExists "$INSTDIR\runtime\lex-runtime-sidecar.exe" +3 0
    MessageBox MB_ICONSTOP|MB_OK "Lex Machina: brak narzędzia bezpiecznego czyszczenia profilu. Deinstalacja została zatrzymana, aby nie pozostawić profili lub haseł." /SD IDOK
    Abort

  DetailPrint "Lex Machina: usuwanie profili, spraw, haseł, kluczy API, Local AI i ustawień..."
  nsExec::ExecToStack '"$INSTDIR\runtime\lex-runtime-sidecar.exe" --purge-user-state'
  Pop $0
  Pop $1
  ${If} $0 != 0
    MessageBox MB_ICONSTOP|MB_OK "Lex Machina: pełne czyszczenie danych nie powiodło się.$\r$\n$1$\r$\n$\r$\nDeinstalacja została zatrzymana, aby nie zgłosić sukcesu przy pozostawionych profilach lub hasłach." /SD IDOK
    Abort
  ${EndIf}

  DetailPrint "Lex Machina: dane użytkownika usunięte. Usuwanie prywatnego runtime programu."
  RMDir /r "$INSTDIR\runtime"
!macroend
