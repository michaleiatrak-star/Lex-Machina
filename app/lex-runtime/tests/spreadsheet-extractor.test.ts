import {
  describe,
  expect,
  it
} from "vitest";
import {
  CSV_MEDIA_TYPE,
  XLSM_MEDIA_TYPE,
  XLSX_MEDIA_TYPE,
  LocalSpreadsheetTextExtractor
} from "../src/spreadsheet-extractor.js";

const XLSX =
  "UEsDBBQAAAAIADpqMF0TnNQztQAAAA0BAAAPAAAAeGwvd29ya2Jvb2sueG1sjY/BbsMwCIbveQqLe+N0h2qKHPdSTeq9fQA3IY3VGCJwuz1+rWS77wT8wAe/O/6k2bxQNDJ1sK8bMEg9D5HuHVwvX7tPOPrKfbM8bswPU8ZJO5hyXlprtZ8wBa15QSqdkSWFXEq5W10Ew6ATYk6z/Wiag00hEmyEVv7D4HGMPZ64fyakvEEE55DLszrFRcFXxrj1iPotGgoJOzgFQjCrch6KMTDSxpLIediD9c7+LlXO/nnzb1BLAwQUAAAACAA6ajBdp6Trqa0AAAAcAQAAGgAAAHhsL19yZWxzL3dvcmtib29rLnhtbC5yZWxzjY/NCoMwEITvPkXYe13toZRi9FIKXot9gBBXE9QkJOnf2zf0UCr00NMyO7PfMlXzWGZ2Ix+0NRzKvABGRtpem5HDpTtt9tDUWXWmWcQUCUq7wNKNCRxUjO6AGKSiRYTcOjLJGaxfREzSj+iEnMRIuC2KHfpvBtQZYyssa3sOvu1LYN3T0T94Owxa0tHK60Im/viCd+unoIhiggo/UuTwWQV8jzJPVMBUElct6xdQSwMEFAAAAAgAOmowXTMtO7zjAAAAyQEAABgAAAB4bC93b3Jrc2hlZXRzL3NoZWV0MS54bWx9Uc1OwzAMvu8pIh+RmNMcEEJuJgbiwhF4gKhL12hNUiVWy+OTDGlim8bx+7M/2bT59qOYbcouhhaatQRhQxd3Luxb+Pp8u3+EjV7REtMhD9ayKP6QWxiYpyfE3A3Wm7yOkw1F6WPyhgtMe8xTsmZ3DPkRlZQP6I0LoFdC0JF+NWwqKjjFRaSyH35xYbqKnxsQ3IILowv2gxNoclkT6/fR2cCErAkrg915cHszuEQ21znC0uC8i7rsom6NjIsZ88H906bMolk3UhLO1/JLlXu9VXeKsK9OdeE81SP8cznC01v0D1BLAQIUAxQAAAAIADpqMF0TnNQztQAAAA0BAAAPAAAAAAAAAAAAAACAAQAAAAB4bC93b3JrYm9vay54bWxQSwECFAMUAAAACAA6ajBdp6Trqa0AAAAcAQAAGgAAAAAAAAAAAAAAgAHiAAAAeGwvX3JlbHMvd29ya2Jvb2sueG1sLnJlbHNQSwECFAMUAAAACAA6ajBdMy07vOMAAADJAQAAGAAAAAAAAAAAAAAAgAHHAQAAeGwvd29ya3NoZWV0cy9zaGVldDEueG1sUEsFBgAAAAADAAMAywAAAOACAAAAAA==";

describe("local spreadsheet extractor", () => {
  it("extracts XLSX cells and preserves formulas without executing them", async () => {
    const extractor =
      new LocalSpreadsheetTextExtractor({
        timeoutMs: 10_000
      });

    const text =
      await extractor.extract(
        Buffer.from(
          XLSX,
          "base64"
        ),
        XLSX_MEDIA_TYPE
      );

    expect(text).toContain(
      "[ARKUSZ: Dane]"
    );
    expect(text).toContain(
      "A2=Kowalski"
    );
    expect(text).toContain(
      "B2=100"
    );
    expect(text).toContain(
      "C2=FORMULA =B2*2 | CACHED 200"
    );
  });

  it("reads XLSM worksheet XML while ignoring macro payloads", async () => {
    const extractor =
      new LocalSpreadsheetTextExtractor({
        timeoutMs: 10_000
      });

    await expect(
      extractor.extract(
        Buffer.from(
          XLSX,
          "base64"
        ),
        XLSM_MEDIA_TYPE
      )
    ).resolves.toContain(
      "Klient"
    );
  });

  it("extracts CSV rows locally", async () => {
    const extractor =
      new LocalSpreadsheetTextExtractor({
        timeoutMs: 10_000
      });

    const text =
      await extractor.extract(
        Buffer.from(
          "klient,kwota\nKowalski,100\n",
          "utf8"
        ),
        CSV_MEDIA_TYPE
      );

    expect(text).toContain(
      "ROW 2"
    );
    expect(text).toContain(
      "C1=Kowalski"
    );
    expect(text).toContain(
      "C2=100"
    );
  });
});
