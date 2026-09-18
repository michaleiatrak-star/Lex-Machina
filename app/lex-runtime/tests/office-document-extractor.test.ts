import {
  describe,
  expect,
  it
} from "vitest";
import {
  DOCX_MEDIA_TYPE,
  ODT_MEDIA_TYPE,
  LocalOfficeDocumentTextExtractor
} from "../src/office-document-extractor.js";

const DOCX =
  "UEsDBBQAAAAIAGlpMF0Bi44Z2AAAADwBAAARAAAAd29yZC9kb2N1bWVudC54bWxtj0FOxDAMRfecwsp+mjILhKq2s5sFs4UDmCZMoyZ25GQmDDfhPhyMtIIVbJ6+Zfv7uz+8Bw9XK8kxDeq+aRVYmtg4Og/q5fm4e1SQMpJBz2QHdbNJHca7vnSGp0uwlKE6UOrKoOacY6d1mmYbMDUcLdXeG0vAXEs568JiovBkU6oHgtf7tn3QAR2pzfOVzW0TcayQFXk8EZfdzAUWpMl6FOe6qgXhErgQgoPgUBYuSM42vV6XVsrG+MfwCQlOddqnxUGNU9B8OEhRsHx9/ruvf6Kt4vfv8RtQSwECFAMUAAAACABpaTBdAYuOGdgAAAA8AQAAEQAAAAAAAAAAAAAAgAEAAAAAd29yZC9kb2N1bWVudC54bWxQSwUGAAAAAAEAAQA/AAAABwEAAAAA";

const ODT =
  "UEsDBBQAAAAIAGlpMF365AwI1AAAAHgBAAALAAAAY29udGVudC54bWyNkD2OwkAMhfs9xWh6YLdDo2QokKi3gAOYGbMYEjuamfBXco29yra514YQfkRFZdnfe36Ws8mhLNQOQyThXH8NP7VCduKJf3K9mM8GYz2xH5msVuTQeHF1iZwGTji1VbVujuZKc10HNgKRomEoMZrkjFTIN5d5Vpsu6zpJeEjvui/azvu4ain+aG/Nhbeok63tdxCHvg6gtsAOCwhE2aiHvaqyU4wbUHvCcDomLFiaX0eK1An2BF5KQiZUvjnXzR/TFob9iqpdMXrOvXfdSQ/4+jf7D1BLAQIUAxQAAAAIAGlpMF365AwI1AAAAHgBAAALAAAAAAAAAAAAAACAAQAAAABjb250ZW50LnhtbFBLBQYAAAAAAQABADkAAAD9AAAAAAA=";

describe("local office document extractor", () => {
  it("extracts DOCX paragraph text without executing document content", async () => {
    const extractor =
      new LocalOfficeDocumentTextExtractor({
        timeoutMs: 10_000
      });

    await expect(
      extractor.extract(
        Buffer.from(
          DOCX,
          "base64"
        ),
        DOCX_MEDIA_TYPE
      )
    ).resolves.toContain(
      "Know-how kancelarii: kara umowna i miarkowanie."
    );
  });

  it("extracts ODT headings and paragraphs locally", async () => {
    const extractor =
      new LocalOfficeDocumentTextExtractor({
        timeoutMs: 10_000
      });

    const text =
      await extractor.extract(
        Buffer.from(
          ODT,
          "base64"
        ),
        ODT_MEDIA_TYPE
      );
    expect(text).toContain(
      "Procedura kancelarii"
    );
    expect(text).toContain(
      "Cesja wierzytelności i zawiadomienie dłużnika."
    );
  });

  it("rejects malformed office containers", async () => {
    const extractor =
      new LocalOfficeDocumentTextExtractor({
        timeoutMs: 10_000
      });

    await expect(
      extractor.extract(
        Buffer.from(
          "not-a-zip",
          "utf8"
        ),
        DOCX_MEDIA_TYPE
      )
    ).rejects.toThrow(
      "OFFICE_DOCUMENT_ARCHIVE_INVALID"
    );
  });
});
