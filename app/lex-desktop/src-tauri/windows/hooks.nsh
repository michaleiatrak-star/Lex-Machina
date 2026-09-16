!macro NSIS_HOOK_POSTINSTALL
  SetRegView 64
  ClearErrors
  ReadRegDWord $0 HKLM "SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x64" "Installed"
  ${IfNot} ${Errors}
  ${AndIf} $0 == 1
    DetailPrint "Microsoft Visual C++ Runtime jest już zainstalowany."
    Goto lex_vcredist_ready
  ${EndIf}

  DetailPrint "Instalacja wymaganego Microsoft Visual C++ Runtime..."
  ClearErrors
  ExecShellWait "runas" "$INSTDIR\runtime\prerequisites\vc_redist.x64.exe" "/install /quiet /norestart" SW_HIDE
  ${If} ${Errors}
    MessageBox MB_ICONSTOP|MB_OK "Lex Machina: nie udało się uruchomić instalacji Microsoft Visual C++ Runtime z wymaganymi uprawnieniami."
    Abort
  ${EndIf}

  SetRegView 64
  ClearErrors
  ReadRegDWord $0 HKLM "SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x64" "Installed"
  ${If} ${Errors}
    MessageBox MB_ICONSTOP|MB_OK "Lex Machina: nie udało się potwierdzić instalacji Microsoft Visual C++ Runtime."
    Abort
  ${EndIf}
  ${If} $0 != 1
    MessageBox MB_ICONSTOP|MB_OK "Lex Machina: Microsoft Visual C++ Runtime nie jest zainstalowany poprawnie."
    Abort
  ${EndIf}

lex_vcredist_ready:
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
