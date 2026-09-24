import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  new URL("./MatterChatApp.tsx", import.meta.url),
  "utf8"
);

describe("MatterChatApp case documents UI", () => {
  it("keeps case documents in the Sprawa tab without a duplicate Akta tab", () => {
    expect(source).toContain('["case", "Sprawa"]');
    expect(source).not.toContain('["files", "Akta"]');
    expect(source).not.toContain('activeTab === "files"');
    expect(source).not.toContain('| "files"');
  });

  it("renders exactly one case document WorkspaceManager", () => {
    const marker =
      'title={`Dokumenty sprawy — ${selectedCase.displayName || "Sprawa bez nazwy"}`}';
    expect(source.split(marker)).toHaveLength(2);
    expect(source).toContain("canWrite={canWriteCase(selectedCase)}");
  });

  it("keeps upload controls inside the merged Sprawa view", () => {
    expect(source).toContain('<p className="eyebrow">Dokumenty sprawy</p>');
    expect(source).toContain("w tej samej sekcji zarządzasz zapisanymi dokumentami i folderami.");
    // "Pliki" opens the checklist of case files to send; adding files is inside it.
    expect(source).toContain("Dodaj pliki do sprawy");
    expect(source).toContain("aria-expanded={\n                    caseFilePickerOpen\n                  }");
    expect(source).not.toContain("onClick={() => fileInputRef.current?.click()}\n                >\n                  📎 Pliki");
  });
});
