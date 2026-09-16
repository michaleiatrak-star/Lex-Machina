use std::{
    fs,
    path::Path,
};

fn ensure_windows_icon() {
    let path =
        Path::new("icons")
            .join("icon.ico");
    if path.is_file() {
        return;
    }

    fs::create_dir_all(
        path.parent()
            .expect(
                "icon parent"
            )
    )
    .expect(
        "create icon directory"
    );

    // Deterministic 1x1 RGBA PNG wrapped as an ICO.
    // This is a build placeholder, not a security-sensitive asset.
    const PNG: &[u8] = &[
        0x89, 0x50, 0x4E, 0x47,
        0x0D, 0x0A, 0x1A, 0x0A,
        0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x00, 0x01,
        0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00,
        0x00, 0x1F, 0x15, 0xC4,
        0x89, 0x00, 0x00, 0x00,
        0x0D, 0x49, 0x44, 0x41,
        0x54, 0x08, 0xD7, 0x63,
        0xF8, 0xCF, 0xC0, 0xF0,
        0x1F, 0x00, 0x05, 0x00,
        0x01, 0xFF, 0x89, 0x99,
        0x3D, 0x1D, 0x00, 0x00,
        0x00, 0x00, 0x49, 0x45,
        0x4E, 0x44, 0xAE, 0x42,
        0x60, 0x82,
    ];

    let mut ico =
        Vec::with_capacity(
            22 + PNG.len()
        );

    // ICONDIR
    ico.extend_from_slice(
        &[0, 0, 1, 0, 1, 0]
    );
    // ICONDIRENTRY
    ico.push(1); // width
    ico.push(1); // height
    ico.push(0); // palette
    ico.push(0); // reserved
    ico.extend_from_slice(
        &1_u16.to_le_bytes()
    ); // planes
    ico.extend_from_slice(
        &32_u16.to_le_bytes()
    ); // bpp
    ico.extend_from_slice(
        &(PNG.len() as u32)
            .to_le_bytes()
    );
    ico.extend_from_slice(
        &22_u32.to_le_bytes()
    );
    ico.extend_from_slice(PNG);

    fs::write(
        path,
        ico
    )
    .expect(
        "write deterministic icon"
    );
}

fn main() {
    ensure_windows_icon();
    tauri_build::build()
}
