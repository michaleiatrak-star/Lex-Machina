import { describe, expect, it } from "vitest";
import { buildPickTree, filesIn, filterPickTree, folderState, pickKey, type PickFile } from "./file-pick-tree.js";

const folders = [
  { folderId: "f_pisma", parentId: null, name: "Pisma procesowe" },
  { folderId: "f_pozwy", parentId: "f_pisma", name: "Pozwy" },
  { folderId: "f_umowy", parentId: null, name: "Umowy" }
];

function file(itemId: string, name: string, folderId: string | null, pickable = true): PickFile {
  return {
    itemId,
    name,
    folderId,
    pick: pickable ? { kind: "template", templateId: `template_${itemId}` } : null,
    note: pickable ? "" : "nieprzetworzony"
  };
}

const tree = buildPickTree("Kancelaria", folders, [
  file("a", "Pozew o zapłatę.docx", "f_pozwy"),
  file("b", "Pozew o eksmisję.docx", "f_pozwy"),
  file("c", "Apelacja.docx", "f_pisma"),
  file("d", "Umowa najmu.docx", "f_umowy", false),
  file("e", "Regulamin.docx", "f_usuniety")
]);

describe("file pick tree", () => {
  it("nests folders and puts files of a missing folder in the root", () => {
    expect(tree.folders.map((folder) => folder.name)).toEqual(["Pisma procesowe", "Umowy"]);
    expect(tree.folders[0]!.folders[0]!.files.map((item) => item.name)).toEqual([
      "Pozew o eksmisję.docx",
      "Pozew o zapłatę.docx"
    ]);
    expect(tree.files.map((item) => item.name)).toEqual(["Regulamin.docx"]);
    expect(filesIn(tree)).toHaveLength(5);
  });

  it("marks a folder as all, some or none of its sendable files", () => {
    const pisma = tree.folders[0]!;
    expect(folderState(pisma, new Set())).toBe("none");
    expect(folderState(pisma, new Set(["template_a"]))).toBe("some");
    expect(folderState(pisma, new Set(["template_a", "template_b", "template_c"]))).toBe("all");
    // A folder with nothing sendable is never "all".
    expect(folderState(tree.folders[1]!, new Set())).toBe("none");
  });

  it("searches names without diacritics and keeps the path to a match", () => {
    const found = filterPickTree(tree, "zaplate")!;
    expect(found.folders).toHaveLength(1);
    expect(found.folders[0]!.folders[0]!.files.map((item) => item.name)).toEqual(["Pozew o zapłatę.docx"]);
    expect(filterPickTree(tree, "umowy")!.folders[0]!.files).toHaveLength(1);
    expect(filterPickTree(tree, "brak takiego")).toBeNull();
    expect(pickKey({ kind: "document", documentId: "doc_1", chunkIndices: [1] })).toBe("doc_1");
  });
});
