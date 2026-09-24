// pdf.js loads image decoders, CMaps and the 14 standard fonts at runtime from
// dist/pdfjs/. Everything ships in the app; nothing is fetched from a CDN.
import fs from "node:fs";
import path from "node:path";

const source = path.resolve("node_modules/pdfjs-dist");
const target = path.resolve("dist/pdfjs");

fs.rmSync(target, { recursive: true, force: true });
for (const directory of ["cmaps", "standard_fonts", "iccs"]) {
  fs.cpSync(path.join(source, directory), path.join(target, directory), { recursive: true });
}
fs.mkdirSync(path.join(target, "wasm"), { recursive: true });
for (const file of fs.readdirSync(path.join(source, "wasm"))) {
  // quickjs-eval backs PDF JavaScript, which the preview never runs.
  if (file.startsWith("quickjs")) continue;
  fs.copyFileSync(path.join(source, "wasm", file), path.join(target, "wasm", file));
}
fs.copyFileSync(path.join(source, "LICENSE"), path.join(target, "LICENSE"));
