mod trust_boundary;

use std::{
    io,
    sync::Arc,
};
use tauri::Manager;
use trust_boundary::RuntimeBridge;

pub fn run() {
    let bridge = Arc::new(
        RuntimeBridge::new()
            .expect("failed to initialize desktop trust boundary")
    );
    let protocol_bridge = Arc::clone(&bridge);
    let setup_bridge = Arc::clone(&bridge);

    tauri::Builder::default()
        .register_asynchronous_uri_scheme_protocol(
            "lex-api",
            move |_context, request, responder| {
                let bridge = Arc::clone(&protocol_bridge);
                std::thread::spawn(move || {
                    responder.respond(
                        bridge.handle(request)
                    );
                });
            },
        )
        .setup(move |app| {
            let resource_dir =
                app.path().resource_dir()?;
            setup_bridge
                .start(&resource_dir)
                .map_err(io::Error::other)?;
            setup_bridge
                .ensure_managed_identity()
                .map_err(io::Error::other)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Lex Machina desktop");
}
