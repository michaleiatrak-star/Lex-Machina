use std::{
    fs,
    path::PathBuf,
};

const BACKGROUND: [u8; 4] = [0x13, 0x24, 0x1b, 0xff];
const FOREGROUND: [u8; 4] = [0xf6, 0xf5, 0xed, 0xff];
const BORDER: [u8; 4] = [0x6e, 0x80, 0x6f, 0xff];
const TRANSPARENT: [u8; 4] = [0, 0, 0, 0];

const GLYPH_L: [&str; 7] = [
    "10000",
    "10000",
    "10000",
    "10000",
    "10000",
    "10000",
    "11111",
];

const GLYPH_M: [&str; 7] = [
    "10001",
    "11011",
    "10101",
    "10101",
    "10001",
    "10001",
    "10001",
];

fn rounded_square_contains(
    x: usize,
    y: usize,
    size: usize,
    radius: usize,
) -> bool {
    if x >= radius && x < size - radius {
        return true;
    }
    if y >= radius && y < size - radius {
        return true;
    }

    let cx = if x < radius {
        radius
    } else {
        size - radius - 1
    };
    let cy = if y < radius {
        radius
    } else {
        size - radius - 1
    };

    let dx = x as isize - cx as isize;
    let dy = y as isize - cy as isize;
    dx * dx + dy * dy
        <= (radius as isize) * (radius as isize)
}

fn glyph_pixel(
    x: usize,
    y: usize,
    size: usize,
) -> bool {
    let cell = ((size * 64 / 100) / 11).max(1);
    let width = 11 * cell;
    let height = 7 * cell;
    let start_x = size.saturating_sub(width) / 2;
    let start_y = size.saturating_sub(height) / 2;

    if x < start_x
        || y < start_y
        || x >= start_x + width
        || y >= start_y + height
    {
        return false;
    }

    let gx = (x - start_x) / cell;
    let gy = (y - start_y) / cell;

    let value = if gx < 5 {
        GLYPH_L[gy]
            .as_bytes()
            .get(gx)
            .copied()
    } else if gx == 5 {
        None
    } else {
        GLYPH_M[gy]
            .as_bytes()
            .get(gx - 6)
            .copied()
    };

    value == Some(b'1')
}

fn pixel_rgba(
    x: usize,
    y: usize,
    size: usize,
) -> [u8; 4] {
    let radius = (size / 5).max(2);
    if !rounded_square_contains(
        x,
        y,
        size,
        radius,
    ) {
        return TRANSPARENT;
    }

    let border_width = (size / 32).max(1);
    let inner_radius =
        radius.saturating_sub(border_width);
    let inside_inner = x >= border_width
        && y >= border_width
        && x + border_width < size
        && y + border_width < size
        && rounded_square_contains(
            x - border_width,
            y - border_width,
            size - border_width * 2,
            inner_radius,
        );

    if !inside_inner {
        return BORDER;
    }

    if glyph_pixel(x, y, size) {
        FOREGROUND
    } else {
        BACKGROUND
    }
}

fn dib_image(size: usize) -> Vec<u8> {
    let mask_stride = ((size + 31) / 32) * 4;
    let xor_bytes = size * size * 4;
    let mask_bytes = mask_stride * size;
    let image_bytes = 40 + xor_bytes + mask_bytes;

    let mut bytes =
        Vec::with_capacity(image_bytes);

    bytes.extend_from_slice(
        &40_u32.to_le_bytes(),
    );
    bytes.extend_from_slice(
        &(size as i32).to_le_bytes(),
    );
    bytes.extend_from_slice(
        &((size * 2) as i32).to_le_bytes(),
    );
    bytes.extend_from_slice(
        &1_u16.to_le_bytes(),
    );
    bytes.extend_from_slice(
        &32_u16.to_le_bytes(),
    );
    bytes.extend_from_slice(
        &0_u32.to_le_bytes(),
    );
    bytes.extend_from_slice(
        &(xor_bytes as u32).to_le_bytes(),
    );
    bytes.extend_from_slice(
        &0_i32.to_le_bytes(),
    );
    bytes.extend_from_slice(
        &0_i32.to_le_bytes(),
    );
    bytes.extend_from_slice(
        &0_u32.to_le_bytes(),
    );
    bytes.extend_from_slice(
        &0_u32.to_le_bytes(),
    );

    for row in 0..size {
        let y = size - 1 - row;
        for x in 0..size {
            let [r, g, b, a] =
                pixel_rgba(x, y, size);
            bytes.extend_from_slice(
                &[b, g, r, a],
            );
        }
    }

    for row in 0..size {
        let y = size - 1 - row;
        let mut mask =
            vec![0_u8; mask_stride];
        for x in 0..size {
            if pixel_rgba(x, y, size)[3]
                == 0
            {
                let byte = x / 8;
                let bit = 7 - (x % 8);
                mask[byte] |= 1 << bit;
            }
        }
        bytes.extend_from_slice(&mask);
    }

    bytes
}

fn ensure_windows_icon() {
    let icon_dir =
        PathBuf::from("icons");
    let icon_path =
        icon_dir.join("icon.ico");

    let sizes: [usize; 7] =
        [16, 24, 32, 48, 64, 128, 256];
    let images: Vec<(usize, Vec<u8>)> =
        sizes
            .into_iter()
            .map(|size| {
                (size, dib_image(size))
            })
            .collect();

    let header_bytes =
        6 + images.len() * 16;
    let mut offset =
        header_bytes as u32;
    let mut bytes:
        Vec<u8> = Vec::new();

    bytes.extend_from_slice(
        &0_u16.to_le_bytes(),
    );
    bytes.extend_from_slice(
        &1_u16.to_le_bytes(),
    );
    bytes.extend_from_slice(
        &(images.len() as u16)
            .to_le_bytes(),
    );

    for (size, image) in &images {
        bytes.push(
            if *size == 256 {
                0
            } else {
                *size as u8
            },
        );
        bytes.push(
            if *size == 256 {
                0
            } else {
                *size as u8
            },
        );
        bytes.push(0);
        bytes.push(0);
        bytes.extend_from_slice(
            &1_u16.to_le_bytes(),
        );
        bytes.extend_from_slice(
            &32_u16.to_le_bytes(),
        );
        bytes.extend_from_slice(
            &(image.len() as u32)
                .to_le_bytes(),
        );
        bytes.extend_from_slice(
            &offset.to_le_bytes(),
        );
        offset += image.len() as u32;
    }

    for (_, image) in images {
        bytes.extend_from_slice(
            &image,
        );
    }

    fs::create_dir_all(&icon_dir)
        .expect(
            "failed to create Tauri icon directory",
        );
    fs::write(&icon_path, bytes)
        .expect(
            "failed to write deterministic Lex Machina icon",
        );
}

fn main() {
    ensure_windows_icon();
    println!(
        "cargo:rerun-if-changed=build.rs"
    );
    tauri_build::build()
}
