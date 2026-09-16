use std::{
    fs,
    path::PathBuf,
};

fn ensure_windows_icon() {
    let icon_dir =
        PathBuf::from("icons");
    let icon_path =
        icon_dir.join("icon.ico");

    let mut bytes:
        Vec<u8> = Vec::new();

    // ICONDIR
    bytes.extend_from_slice(&0_u16.to_le_bytes());
    bytes.extend_from_slice(&1_u16.to_le_bytes());
    bytes.extend_from_slice(&1_u16.to_le_bytes());

    // ICONDIRENTRY — one 1x1, 32-bit DIB image.
    bytes.push(1);
    bytes.push(1);
    bytes.push(0);
    bytes.push(0);
    bytes.extend_from_slice(&1_u16.to_le_bytes());
    bytes.extend_from_slice(&32_u16.to_le_bytes());
    bytes.extend_from_slice(&48_u32.to_le_bytes());
    bytes.extend_from_slice(&22_u32.to_le_bytes());

    // BITMAPINFOHEADER. ICO DIB height includes XOR + AND masks.
    bytes.extend_from_slice(&40_u32.to_le_bytes());
    bytes.extend_from_slice(&1_i32.to_le_bytes());
    bytes.extend_from_slice(&2_i32.to_le_bytes());
    bytes.extend_from_slice(&1_u16.to_le_bytes());
    bytes.extend_from_slice(&32_u16.to_le_bytes());
    bytes.extend_from_slice(&0_u32.to_le_bytes());
    bytes.extend_from_slice(&4_u32.to_le_bytes());
    bytes.extend_from_slice(&0_i32.to_le_bytes());
    bytes.extend_from_slice(&0_i32.to_le_bytes());
    bytes.extend_from_slice(&0_u32.to_le_bytes());
    bytes.extend_from_slice(&0_u32.to_le_bytes());

    // BGRA pixel + 32-bit aligned AND mask row.
    bytes.extend_from_slice(&[0x28, 0x58, 0xB8, 0xFF]);
    bytes.extend_from_slice(&[0, 0, 0, 0]);

    fs::create_dir_all(&icon_dir)
        .expect("failed to create Tauri icon directory");
    fs::write(&icon_path, bytes)
        .expect("failed to write deterministic Tauri icon");
}

fn main() {
    ensure_windows_icon();
    println!("cargo:rerun-if-changed=build.rs");
    tauri_build::build()
}
