import { describe, expect, it } from "vitest";
import { parseLocalAiProgressLine } from "./local-model-runtime.js";
describe("Local AI provisioning progress parser", () => {
    it("accepts a bounded byte progress record", () => {
        const parsed = parseLocalAiProgressLine('LEX_LOCAL_AI_PROGRESS:{"phase":"DOWNLOAD","label":"model:local/test","bytesDownloaded":1048576,"bytesTotal":4194304,"percent":25}');
        expect(parsed).not.toBeNull();
        expect(parsed?.phase)
            .toBe("DOWNLOAD");
        expect(parsed?.bytesDownloaded).toBe(1_048_576);
        expect(parsed?.bytesTotal)
            .toBe(4_194_304);
        expect(parsed?.percent)
            .toBe(25);
    });
    it("accepts unknown total size without inventing a percentage", () => {
        const parsed = parseLocalAiProgressLine('LEX_LOCAL_AI_PROGRESS:{"phase":"DOWNLOAD","label":"model:local/test","bytesDownloaded":67108864,"bytesTotal":null,"percent":null}');
        expect(parsed?.bytesTotal)
            .toBeNull();
        expect(parsed?.percent)
            .toBeNull();
    });
    it("rejects malformed, unsupported and overrun progress records", () => {
        expect(parseLocalAiProgressLine("ordinary stdout")).toBeNull();
        expect(parseLocalAiProgressLine("LEX_LOCAL_AI_PROGRESS:not-json")).toBeNull();
        expect(parseLocalAiProgressLine('LEX_LOCAL_AI_PROGRESS:{"phase":"DELETE","label":"x","bytesDownloaded":0,"bytesTotal":1,"percent":0}')).toBeNull();
        expect(parseLocalAiProgressLine('LEX_LOCAL_AI_PROGRESS:{"phase":"DOWNLOAD","label":"x","bytesDownloaded":2,"bytesTotal":1,"percent":100}')).toBeNull();
        expect(parseLocalAiProgressLine('LEX_LOCAL_AI_PROGRESS:{"phase":"DOWNLOAD","label":"x","bytesDownloaded":1,"bytesTotal":1,"percent":101}')).toBeNull();
    });
});
