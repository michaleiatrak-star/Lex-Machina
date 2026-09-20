use std::{
    fs,
    io::Cursor,
    path::PathBuf,
};

use png::{BitDepth, ColorType, Decoder, Encoder, Transformations};

const EXPECTED_SOURCE_ICON_BYTES: usize = 20_469;
const EXPECTED_ICON_COUNT: usize = 7;
const EXPECTED_ICON_SIZES: [u32; 7] = [16, 24, 32, 48, 64, 128, 256];
const PNG_SIGNATURE: [u8; 8] = [137, 80, 78, 71, 13, 10, 26, 10];

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

fn read_u16(data: &[u8], offset: usize) -> u16 {
    u16::from_le_bytes([data[offset], data[offset + 1]])
}

fn read_u32(data: &[u8], offset: usize) -> u32 {
    u32::from_le_bytes([
        data[offset],
        data[offset + 1],
        data[offset + 2],
        data[offset + 3],
    ])
}

fn encode_truecolor_png(frame: &[u8], expected_size: u32) -> Vec<u8> {
    assert!(
        frame.starts_with(&PNG_SIGNATURE),
        "pinned brand icon entry is not PNG"
    );

    let mut decoder = Decoder::new(Cursor::new(frame));
    decoder.set_transformations(Transformations::EXPAND | Transformations::STRIP_16);
    let mut reader = decoder
        .read_info()
        .expect("failed to initialize pinned brand PNG decoder");

    let mut decoded = vec![0_u8; reader.output_buffer_size()];
    let info = reader
        .next_frame(&mut decoded)
        .expect("failed to expand indexed brand PNG to truecolor");
    decoded.truncate(info.buffer_size());

    assert_eq!(
        (info.width, info.height),
        (expected_size, expected_size),
        "decoded brand PNG size does not match ICO directory"
    );
    assert_eq!(
        info.bit_depth,
        BitDepth::Eight,
        "brand PNG must decode to 8-bit channels"
    );
    assert!(
        matches!(
            info.color_type,
            ColorType::Rgb | ColorType::Rgba | ColorType::Grayscale | ColorType::GrayscaleAlpha
        ),
        "brand PNG did not expand to a Tauri-compatible color type"
    );

    let mut output = Vec::new();
    {
        let mut encoder = Encoder::new(&mut output, info.width, info.height);
        encoder.set_depth(BitDepth::Eight);
        encoder.set_color(info.color_type);
        let mut writer = encoder
            .write_header()
            .expect("failed to initialize truecolor brand PNG encoder");
        writer
            .write_image_data(&decoded)
            .expect("failed to encode truecolor brand PNG");
    }
    output
}

fn materialize_windows_icon() {
    let mut encoded = String::new();
    for part in ICON_PARTS {
        encoded.push_str(part.trim());
    }

    let source = decode_base64(&encoded);
    assert_eq!(
        source.len(),
        EXPECTED_SOURCE_ICON_BYTES,
        "pinned Lex Machina brand icon source size changed unexpectedly"
    );
    assert!(
        source.len() >= 6
            && read_u16(&source, 0) == 0
            && read_u16(&source, 2) == 1,
        "pinned Lex Machina brand source has an invalid ICO header"
    );

    let count = read_u16(&source, 4) as usize;
    assert_eq!(
        count,
        EXPECTED_ICON_COUNT,
        "pinned Lex Machina brand icon image count changed unexpectedly"
    );

    let mut frames: Vec<(u32, Vec<u8>)> = Vec::with_capacity(count);
    for index in 0..count {
        let directory_offset = 6 + index * 16;
        let width_byte = source[directory_offset];
        let height_byte = source[directory_offset + 1];
        let width = if width_byte == 0 { 256 } else { width_byte as u32 };
        let height = if height_byte == 0 { 256 } else { height_byte as u32 };
        let expected_size = EXPECTED_ICON_SIZES[index];

        assert_eq!(
            (width, height),
            (expected_size, expected_size),
            "pinned Lex Machina brand icon size order changed unexpectedly"
        );

        let frame_len = read_u32(&source, directory_offset + 8) as usize;
        let frame_offset = read_u32(&source, directory_offset + 12) as usize;
        let frame_end = frame_offset
            .checked_add(frame_len)
            .expect("brand icon frame bounds overflow");
        assert!(
            frame_offset >= 6 + count * 16 && frame_end <= source.len(),
            "pinned brand icon frame is out of bounds"
        );

        frames.push((
            expected_size,
            encode_truecolor_png(&source[frame_offset..frame_end], expected_size),
        ));
    }

    let directory_bytes = 6 + frames.len() * 16;
    let mut offset = directory_bytes as u32;
    let mut output = Vec::new();
    output.extend_from_slice(&0_u16.to_le_bytes());
    output.extend_from_slice(&1_u16.to_le_bytes());
    output.extend_from_slice(&(frames.len() as u16).to_le_bytes());

    for (size, frame) in &frames {
        let dimension = if *size == 256 { 0 } else { *size as u8 };
        output.push(dimension);
        output.push(dimension);
        output.push(0);
        output.push(0);
        output.extend_from_slice(&1_u16.to_le_bytes());
        output.extend_from_slice(&32_u16.to_le_bytes());
        output.extend_from_slice(&(frame.len() as u32).to_le_bytes());
        output.extend_from_slice(&offset.to_le_bytes());
        offset = offset
            .checked_add(frame.len() as u32)
            .expect("brand icon output size overflow");
    }

    for (_, frame) in frames {
        output.extend_from_slice(&frame);
    }

    let icon_dir = PathBuf::from("icons");
    let icon_path = icon_dir.join("icon.ico");
    fs::create_dir_all(&icon_dir).expect("failed to create Tauri icon directory");
    fs::write(&icon_path, output)
        .expect("failed to write Tauri-compatible Lex Machina brand icon");
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
