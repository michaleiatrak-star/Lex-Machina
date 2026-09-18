fn main() {
    if std::env::args()
        .skip(1)
        .any(|arg| arg == "--purge-user-state")
    {
        match lex_machina_desktop_lib::purge_user_state() {
            Ok(()) => {
                println!("LEX_USER_STATE_PURGE_PASS");
                std::process::exit(0);
            }
            Err(error) => {
                eprintln!("{error}");
                std::process::exit(1);
            }
        }
    }

    lex_machina_desktop_lib::run();
}
