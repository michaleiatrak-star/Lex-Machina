import {
  describe,
  expect,
  it
} from "vitest";
import {
  MAX_DOCUMENT_DROP_QUEUE,
  consumeDocumentDropFile,
  createDocumentDropQueueState,
  describeDocumentFile,
  enqueueDocumentDropFiles
} from "./document-drop-queue.js";

function file(
  name: string,
  size = 1024,
  type = ""
): File {
  return {
    name,
    size,
    type,
    lastModified: 1
  } as File;
}

describe("document drop queue", () => {
  it("processes multiple files sequentially and resets the next completed batch", () => {
    let state =
      enqueueDocumentDropFiles(
        createDocumentDropQueueState(),
        [
          file("a.pdf", 2048, "application/pdf"),
          file("b.docx", 4096)
        ]
      );

    expect(state.files.map((item) => item.name))
      .toEqual(["a.pdf", "b.docx"]);
    expect(state.total).toBe(2);
    expect(state.completed).toBe(0);

    state =
      consumeDocumentDropFile(state);
    expect(state.files.map((item) => item.name))
      .toEqual(["b.docx"]);
    expect(state.completed).toBe(1);

    state =
      consumeDocumentDropFile(state);
    expect(state.files).toEqual([]);
    expect(state.completed).toBe(2);

    state =
      enqueueDocumentDropFiles(
        state,
        [file("next.txt", 10, "text/plain")]
      );
    expect(state.total).toBe(1);
    expect(state.completed).toBe(0);
    expect(state.files[0]?.name)
      .toBe("next.txt");
  });

  it("caps pending files and reports empty or over-limit entries as rejected", () => {
    const input =
      Array.from(
        {
          length:
            MAX_DOCUMENT_DROP_QUEUE + 2
        },
        (_, index) =>
          file(
            `file-${index}.pdf`,
            index === 0
              ? 0
              : 512,
            "application/pdf"
          )
      );

    const state =
      enqueueDocumentDropFiles(
        createDocumentDropQueueState(),
        input
      );

    expect(state.files).toHaveLength(
      MAX_DOCUMENT_DROP_QUEUE
    );
    expect(state.rejected).toBe(2);
  });

  it("exposes per-file size and type metadata", () => {
    expect(
      describeDocumentFile(
        file(
          "opinia.pdf",
          2 * 1024 * 1024,
          "application/pdf"
        )
      )
    ).toBe(
      "2.0 MB · application/pdf"
    );
    expect(
      describeDocumentFile(
        file(
          "notatka.md",
          512
        )
      )
    ).toBe(
      "512 B · .md"
    );
  });
});
