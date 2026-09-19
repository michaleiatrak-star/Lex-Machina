!define LEX_HOOK_FILE_DIR "${__FILEDIR__}"

!macro NSIS_HOOK_PREINSTALL
  SetOutPath "$PLUGINSDIR"
  File "/oname=lex-get-install-state.ps1" "${LEX_HOOK_FILE_DIR}\..\..\..\installer\get-install-state.ps1"
  File "/oname=lex-target-release-source.json" "${LEX_HOOK_FILE_DIR}\..\..\..\installer\windows-release-source.json"
  File "/oname=lex-profile-cleanup.exe" "${LEX_HOOK_FILE_DIR}\..\target\release\lex-profile-cleanup.exe"

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

  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "Czy chcesz rozpocząć od całkowicie czystego profilu administratora?$\r$\n$\r$\nTAK usuwa wszystkie lokalne profile, sprawy, ustawienia, Local AI oraz zapisane hasła i klucze API Lex Machina. Po instalacji zostanie utworzone nowe czyste konto administratora.$\r$\n$\r$\nNIE zachowuje istniejące dane (zalecane przy aktualizacji/naprawie)." /SD IDNO IDYES lex_clean_profile_yes IDNO lex_clean_profile_done

lex_clean_profile_yes:
  DetailPrint "Lex Machina: czyszczenie profili, danych i zapisanych sekretów..."
  nsExec::ExecToLog '"$SYSDIR\taskkill.exe" /IM "lex-machina.exe" /T /F'
  nsExec::ExecToStack '"$PLUGINSDIR\lex-profile-cleanup.exe" --purge-all'
  Pop $0
  Pop $1
  ${If} $0 != 0
    MessageBox MB_ICONSTOP|MB_OK "Lex Machina: nie udało się bezpiecznie usunąć całego poprzedniego profilu.$\r$\n$1$\r$\n$\r$\nInstalacja została przerwana, aby nie pozostawić częściowych danych lub haseł." /SD IDOK
    Abort
  ${EndIf}
  DetailPrint "Lex Machina: poprzedni profil został usunięty. Pierwsze uruchomienie utworzy nowe konto administratora."

lex_clean_profile_done:

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
  File "/oname=lex-profile-cleanup.exe" "${LEX_HOOK_FILE_DIR}\..\target\release\lex-profile-cleanup.exe"

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
  MessageBox MB_ICONEXCLAMATION|MB_YESNO|MB_DEFBUTTON2 "Pełna deinstalacja Lex Machina usunie WSZYSTKIE lokalne profile, sprawy, ustawienia, Local AI oraz zapisane hasła i klucze API. Tej operacji nie można cofnąć.$\r$\n$\r$\nKontynuować?" /SD IDYES IDYES lex_uninstall_purge_yes IDNO lex_uninstall_purge_cancel

lex_uninstall_purge_cancel:
  Abort

lex_uninstall_purge_yes:
  DetailPrint "Lex Machina: zamykanie procesów i pełne czyszczenie danych użytkownika..."
  nsExec::ExecToLog '"$SYSDIR\taskkill.exe" /IM "lex-machina.exe" /T /F'
  nsExec::ExecToStack '"$INSTDIR\lex-profile-cleanup.exe" --purge-all'
  Pop $0
  Pop $1
  ${If} $0 != 0
    MessageBox MB_ICONSTOP|MB_OK "Lex Machina: pełne czyszczenie profili i haseł nie powiodło się.$\r$\n$1$\r$\n$\r$\nDeinstalacja została zatrzymana, aby nie zgłaszać fałszywie pełnego usunięcia danych." /SD IDOK
    Abort
  ${EndIf}
  RMDir /r "$INSTDIR\runtime"
  Delete "$INSTDIR\lex-profile-cleanup.exe"
!macroend
