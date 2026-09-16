!macro NSIS_HOOK_POSTINSTALL
  DetailPrint "Instalacja wymaganego Microsoft Visual C++ Runtime..."
  ClearErrors
  ExecShellWait "runas" "$INSTDIR\runtime\prerequisites\vc_redist.x64.exe" "/install /quiet /norestart" SW_HIDE
  ${If} ${Errors}
    MessageBox MB_ICONSTOP|MB_OK "Lex Machina: nie udało się uruchomić instalacji Microsoft Visual C++ Runtime z wymaganymi uprawnieniami."
    Abort
  ${EndIf}

  DetailPrint "Weryfikacja prywatnego runtime Lex Machina..."
  nsExec::ExecToStack '"$INSTDIR\runtime\lex-runtime-sidecar.exe" --self-test'
  Pop $0
  Pop $1
  ${If} $0 != 0
    MessageBox MB_ICONSTOP|MB_OK "Lex Machina: lokalny self-test nie powiódł się.$\r$\n$1"
    Abort
  ${EndIf}
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  DetailPrint "Dane spraw pozostają zachowane poza katalogiem aplikacji."
!macroend
