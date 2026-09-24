export const MAX_FIRM_TEMPLATES = 8;
const MAX_TEMPLATE_CHARS = 60_000;
const CHUNK_CHARS = 6_000;
function runsText(runs) {
    return runs.map((run) => run.text).join("").trim();
}
/**
 * Plain text of a firm template with its structure kept visible to a model:
 * headings as "#", list items as "-" / "1.", table rows as "a | b".
 */
export function templateText(model) {
    const lines = [];
    if (model.kind === "sheet") {
        for (const sheet of model.sheets) {
            lines.push(`# Arkusz: ${sheet.name}`);
            for (const row of sheet.rows)
                lines.push(row.join(" | "));
            lines.push("");
        }
    }
    else {
        for (const block of model.blocks) {
            switch (block.type) {
                case "heading":
                    lines.push(`${"#".repeat(Math.max(1, Math.min(block.level, 3)))} ${runsText(block.runs)}`, "");
                    break;
                case "paragraph": {
                    const text = runsText(block.runs);
                    if (text)
                        lines.push(text, "");
                    break;
                }
                case "list":
                    block.items.forEach((item, index) => lines.push(`${block.ordered ? `${index + 1}.` : "-"} ${runsText(item)}`));
                    lines.push("");
                    break;
                case "table":
                    for (const row of block.rows)
                        lines.push(`| ${row.join(" | ")} |`);
                    lines.push("");
                    break;
            }
        }
    }
    const text = lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
    return text.length > MAX_TEMPLATE_CHARS
        ? `${text.slice(0, MAX_TEMPLATE_CHARS)}\n\n[WZÓR SKRÓCONY: pominięto dalszą część]`
        : text;
}
/** Chunks on paragraph boundaries, numbered from 1 like stored documents. */
export function templateChunks(text) {
    const chunks = [];
    let current = "";
    for (const paragraph of text.split(/\n{2,}/)) {
        if (current && current.length + paragraph.length + 2 > CHUNK_CHARS) {
            chunks.push(current);
            current = "";
        }
        current = current ? `${current}\n\n${paragraph}` : paragraph;
        while (current.length > CHUNK_CHARS) {
            chunks.push(current.slice(0, CHUNK_CHARS));
            current = current.slice(CHUNK_CHARS);
        }
    }
    if (current)
        chunks.push(current);
    return chunks.map((chunk, index) => ({ index: index + 1, pageStart: 1, pageEnd: 1, text: chunk }));
}
