import { describe, expect, it } from "vitest";
import {
  createDocumentStagingState,
  stageDocuments,
  takeStagedDocuments,
  updateStagedDocument
} from "./document-staging.js";

const file = (name: string, size = 10) => ({ name, size, type: "", lastModified: 1 }) as File;

describe("document staging", () => {
  it("holds files for a decision instead of processing them", () => {
    let state = stageDocuments(createDocumentStagingState(), [file("a.pdf"), file("empty.pdf", 0), file("b.pdf")]);
    expect(state.items.map((item) => item.file.name)).toEqual(["a.pdf", "b.pdf"]);
    expect(state.items.every((item) => item.status === "PENDING")).toBe(true);
    expect(state.rejected).toBe(1);

    const first = state.items[0]!.id;
    const taken = takeStagedDocuments(state, [first]);
    expect(taken.files.map((item) => item.name)).toEqual(["a.pdf"]);
    state = taken.state;
    expect(state.items.map((item) => item.file.name)).toEqual(["b.pdf"]);
  });

  it("does not take a file that is being saved and respects the limit", () => {
    let state = stageDocuments(createDocumentStagingState(), [file("a.pdf"), file("b.pdf"), file("c.pdf")], 2);
    expect(state.items).toHaveLength(2);
    expect(state.rejected).toBe(1);
    state = updateStagedDocument(state, state.items[0]!.id, { status: "SAVING" });
    const all = takeStagedDocuments(state);
    expect(all.files.map((item) => item.name)).toEqual(["b.pdf"]);
    expect(all.state.items.map((item) => item.status)).toEqual(["SAVING"]);
    const failed = updateStagedDocument(all.state, all.state.items[0]!.id, { status: "FAILED", error: "X" });
    expect(failed.items[0]).toMatchObject({ status: "FAILED", error: "X" });
  });
});
