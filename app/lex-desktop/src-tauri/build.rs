use std::{fs, path::PathBuf};

const EXPECTED_ICON_BYTES: usize = 20_469;
const EXPECTED_ICON_COUNT: u16 = 7;

const ICON_PARTS: [&str; 7] = [
    include_str!("icons/generated-branding/icon.b64.part01"),
    include_str!("icons/generated-branding/icon.b64.part02"),
    include_str!("icons/generated-branding/icon.b64.part03"),
    include_str!("icons/generated-branding/icon.b64.part04"),
    include_str!("icons/generated-branding/icon.b64.part05"),
    include_str!("icons/generated-branding/icon.b64.part06"),
    include_str!("icons/generated-branding/icon.b64.part07"),
];

fn base64_value(byte: u8) -> Option<u8> {
    match byte {
        b'A'..=b'Z' => Some(byte - b'A'),
        b'a'..=b'z' => Some(byte - b'a' + 26),
        b'0'..=b'9' => Some(byte - b'0' + 52),
        b'+' => Some(62),
        b'/' => Some(63),
        _ => None,
    }
}

fn decode_base64(input: &str) -> Vec<u8> {
    let mut output = Vec::with_capacity(input.len() * 3 / 4);
    let mut quartet = [0_u8; 4];
    let mut quartet_len = 0_usize;
    let mut padding = 0_usize;

    for byte in input.bytes().filter(|byte| !byte.is_ascii_whitespace()) {
        if byte == b'=' {
            quartet[quartet_len] = 0;
            padding += 1;
        } else {
            quartet[quartet_len] =
                base64_value(byte).expect("invalid base64 byte in pinned brand icon");
        }

        quartet_len += 1;
        if quartet_len == 4 {
            output.push((quartet[0] << 2) | (quartet[1] >> 4));
            if padding < 2 {
                output.push((quartet[1] << 4) | (quartet[2] >> 2));
            }
            if padding == 0 {
                output.push((quartet[2] << 6) | quartet[3]);
            }
            quartet_len = 0;
            padding = 0;
        }
    }

    assert_eq!(quartet_len, 0, "truncated base64 in pinned brand icon");
    output
}

fn materialize_windows_icon() {
    let mut encoded = String::new();
    for part in ICON_PARTS {
        encoded.push_str(part.trim());
    }

    let bytes = decode_base64(&encoded);
    assert_eq!(
        bytes.len(),
        EXPECTED_ICON_BYTES,
        "pinned Lex Machina brand icon size changed unexpectedly"
    );
    assert!(
        bytes.len() >= 6
            && bytes[0] == 0
            && bytes[1] == 0
            && bytes[2] == 1
            && bytes[3] == 0,
        "pinned Lex Machina brand icon has an invalid ICO header"
    );
    let count = u16::from_le_bytes([bytes[4], bytes[5]]);
    assert_eq!(
        count,
        EXPECTED_ICON_COUNT,
        "pinned Lex Machina brand icon image count changed unexpectedly"
    );

    let icon_dir = PathBuf::from("icons");
    let icon_path = icon_dir.join("icon.ico");
    fs::create_dir_all(&icon_dir).expect("failed to create Tauri icon directory");
    fs::write(&icon_path, bytes).expect("failed to materialize pinned Lex Machina brand icon");
}

fn main() {
    materialize_windows_icon();

    for part in [
        "icons/generated-branding/icon.b64.part01",
        "icons/generated-branding/icon.b64.part02",
        "icons/generated-branding/icon.b64.part03",
        "icons/generated-branding/icon.b64.part04",
        "icons/generated-branding/icon.b64.part05",
        "icons/generated-branding/icon.b64.part06",
        "icons/generated-branding/icon.b64.part07",
    ] {
        println!("cargo:rerun-if-changed={part}");
    }

    tauri_build::build()
}
