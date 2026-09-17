!define LEX_HOOK_FILE_DIR "${__FILEDIR__}"

!macro NSIS_HOOK_PREINSTALL
  SetOutPath "$PLUGINSDIR"
  File "/oname=lex-get-install-state.ps1" "${LEX_HOOK_FILE_DIR}\..\..\..\installer\get-install-state.ps1"
  File "/oname=lex-target-release-source.json" "${LEX_HOOK_FILE_DIR}\..\..\..\installer\windows-release-source.json"

  DetailPrint "Lex Machina: rozpoznawanie stanu istniejącej instalacji..."
  nsExec::ExecToStack '"$SYSDIR\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "$PLUGINSDIR\lex-get-install-state.ps1" -RuntimeRoot "$INSTDIR\runtime" -TargetManifestPath "$PLUGINSDIR\lex-target-release-source.json" -OutputPath "$PLUGINSDIR\lex-install-state.json" -FailOnDowngrade'
  Pop $0
  Pop $1
  ${If} $0 != 0
    DetailPrint "Lex Machina: preinstall state gate zablokował instalację (exit=$0)."
    MessageBox MB_ICONSTOP|MB_OK "Lex Machina: instalacja została zatrzymana przez kontrolę stanu.$\r$\n$1$\r$\n$\r$\nJeżeli zainstalowana wersja jest nowsza, użyj nowszego instalatora zamiast wykonywać downgrade." /SD IDOK
    Abort
  ${EndIf}
  DetailPrint "Lex Machina: stan instalacji $1"
!macroend

!macro NSIS_HOOK_POSTINSTALL
  ; Installer-critical bootstrap files are embedded explicitly instead of
  ; relying on the ordinary Tauri resource copy layout. This keeps online,
  ; offline and repair paths deterministic and available before bootstrap.
  SetOutPath "$PLUGINSDIR\lex-bootstrap"
  File "/oname=windows-online-bootstrap.ps1" "${LEX_HOOK_FILE_DIR}\..\..\..\installer\windows-online-bootstrap.ps1"
  File "/oname=windows-offline-bundle-install.ps1" "${LEX_HOOK_FILE_DIR}\..\..\..\installer\windows-offline-bundle-install.ps1"
  File "/oname=generate-component-lock.ps1" "${LEX_HOOK_FILE_DIR}\..\..\..\installer\generate-component-lock.ps1"
  File "/oname=windows-payload-selftest.ps1" "${LEX_HOOK_FILE_DIR}\..\..\..\installer\windows-payload-selftest.ps1"
  File "/oname=windows-payload-python-selftest.py" "${LEX_HOOK_FILE_DIR}\..\..\..\installer\windows-payload-python-selftest.py"
  File "/oname=verify-python-package-set.py" "${LEX_HOOK_FILE_DIR}\..\..\..\installer\verify-python-package-set.py"
  File "/oname=release-source.json" "${LEX_HOOK_FILE_DIR}\..\..\..\installer\windows-release-source.json"
  File "/oname=release-requirements.txt" "${LEX_HOOK_FILE_DIR}\..\..\..\installer\windows-release-requirements.txt"

  CreateDirectory "$INSTDIR\runtime"
  CreateDirectory "$INSTDIR\runtime\bootstrap"
  CopyFiles /SILENT "$PLUGINSDIR\lex-bootstrap\windows-online-bootstrap.ps1" "$INSTDIR\runtime\bootstrap\windows-online-bootstrap.ps1"
  CopyFiles /SILENT "$PLUGINSDIR\lex-bootstrap\windows-offline-bundle-install.ps1" "$INSTDIR\runtime\bootstrap\windows-offline-bundle-install.ps1"
  CopyFiles /SILENT "$PLUGINSDIR\lex-bootstrap\generate-component-lock.ps1" "$INSTDIR\runtime\bootstrap\generate-component-lock.ps1"
  CopyFiles /SILENT "$PLUGINSDIR\lex-bootstrap\windows-payload-selftest.ps1" "$INSTDIR\runtime\bootstrap\windows-payload-selftest.ps1"
  CopyFiles /SILENT "$PLUGINSDIR\lex-bootstrap\windows-payload-python-selftest.py" "$INSTDIR\runtime\bootstrap\windows-payload-python-selftest.py"
  CopyFiles /SILENT "$PLUGINSDIR\lex-bootstrap\verify-python-package-set.py" "$INSTDIR\runtime\bootstrap\verify-python-package-set.py"
  CopyFiles /SILENT "$PLUGINSDIR\lex-bootstrap\release-source.json" "$INSTDIR\runtime\release-source.json"
  CopyFiles /SILENT "$PLUGINSDIR\lex-bootstrap\release-requirements.txt" "$INSTDIR\runtime\release-requirements.txt"
  SetOutPath "$INSTDIR"

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
  DetailPrint "Dane spraw pozostają zachowane poza katalogiem aplikacji."
!macroend
