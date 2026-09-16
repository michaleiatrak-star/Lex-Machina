!macro NSIS_HOOK_POSTINSTALL
  DetailPrint "Instalacja wymaganego Microsoft Visual C++ Runtime..."
  nsExec::ExecToStack '"$INSTDIR\resources\runtime\prerequisites\vc_redist.x64.exe" /install /quiet /norestart'
  Pop $0
  Pop $1
  ${If} $0 != 0
  ${AndIf} $0 != 3010
  ${AndIf} $0 != 1638
    MessageBox MB_ICONSTOP|MB_OK "Lex Machina: instalacja Microsoft Visual C++ Runtime nie powiodła się (kod $0).$\r$\n$1"
    Abort
  ${EndIf}

  DetailPrint "Weryfikacja prywatnego runtime Lex Machina..."
  nsExec::ExecToStack '"$INSTDIR\resources\runtime\lex-runtime-sidecar.exe" --self-test'
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
