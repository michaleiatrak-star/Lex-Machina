import { describe, expect, it } from "vitest";
import {
  hasStoredDocumentSignature,
  storedDocumentMediaType
} from "../src/stored-document-source.js";

const DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

describe("stored document processing media", () => {
  it("accepts office documents, sheets and text next to PDF and images", () => {
    for (const type of [
      DOCX,
      "application/vnd.oasis.opendocument.text",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel.sheet.macroenabled.12",
      "text/csv",
      "text/tab-separated-values",
      "text/plain",
      "text/markdown",
      "application/pdf",
      "image/png"
    ]) {
      expect(storedDocumentMediaType(type)).toBe(type);
    }
    expect(storedDocumentMediaType("text/plain; charset=utf-8")).toBe("text/plain");
    expect(storedDocumentMediaType("application/msword")).toBeNull();
  });

  it("checks the ZIP signature of office files and rejects binary text", () => {
    expect(hasStoredDocumentSignature(Buffer.from("PK\u0003\u0004rest"), DOCX)).toBe(true);
    expect(hasStoredDocumentSignature(Buffer.from("%PDF-1.7"), DOCX)).toBe(false);
    expect(hasStoredDocumentSignature(Buffer.from("Zażółć;10\n"), "text/csv")).toBe(true);
    expect(hasStoredDocumentSignature(Buffer.from([0x41, 0x00, 0x42]), "text/plain")).toBe(false);
  });
});
