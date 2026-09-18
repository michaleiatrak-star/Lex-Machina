import {
  describe,
  expect,
  it
} from "vitest";
import type {
  StoredUpload
} from "./case-file-store.js";
import {
  applyDeterministicProcessApplicability,
  evidenceInventoryFromUploads
} from "./process-pleading-applicability.js";
import {
  acceptProcessPleadingStart,
  confirmProcessCheckpoint,
  createProcessPleadingState,
  markProcessCheckpointNotApplicable,
  markProcessCheckpointReady,
  type ProcessPleadingCheckpoint,
  type ProcessPleadingState
} from "./process-pleading-state.js";

const CASE_ID =
  "case_0123456789abcdef0123456789abcdef";

function closeCheckpoint(
  state: ProcessPleadingState,
  checkpoint:
    ProcessPleadingCheckpoint
): ProcessPleadingState {
  const ready =
    markProcessCheckpointReady(
      state,
      checkpoint,
      "2026-09-18T00:00:00.000Z"
    );
  return ready.mode ===
    "CHECKPOINT"
    ? confirmProcessCheckpoint(
        ready,
        checkpoint,
        "2026-09-18T00:00:01.000Z"
      )
    : ready;
}

function baseW1(): ProcessPleadingState {
  let state =
    createProcessPleadingState(
      CASE_ID,
      "CHECKPOINT",
      "2026-09-18T00:00:00.000Z"
    );
  state =
    acceptProcessPleadingStart(
      state,
      "2026-09-18T00:00:01.000Z"
    );
  state =
    closeCheckpoint(
      state,
      "CP-1a"
    );
  state =
    markProcessCheckpointNotApplicable(
      state,
      "CP-1b",
      "N/A — test fixture: no second legal path and no subject anomaly.",
      "2026-09-18T00:00:02.000Z"
    );
  return state;
}

function upload(
  overrides:
    Partial<StoredUpload> = {}
): StoredUpload {
  return {
    caseId: CASE_ID,
    uploadId:
      "upload_0123456789abcdef0123456789abcdef",
    filename: "evidence.pdf",
    mediaType:
      "application/pdf",
    sha256: "a".repeat(64),
    bytes: 100,
    storedAt:
      "2026-09-18T00:00:00.000Z",
    archive: false,
    extracted: [],
    ...overrides
  };
}

describe(
  "deterministic process checkpoint applicability",
  () => {
    it(
      "auto-marks only file-count N/A checkpoints for an empty persisted case",
      () => {
        let state =
          baseW1();

        let result =
          applyDeterministicProcessApplicability(
            state,
            {
              fileCount: 0,
              complete: true,
              source:
                "ENCRYPTED_CASE_UPLOADS"
            },
            "2026-09-18T00:00:03.000Z"
          );

        expect(
          result.state.checkpoints[
            "CP-1c-skan"
          ]
        ).toBe("NA");
        expect(
          result.state.checkpoints[
            "CP-PD"
          ]
        ).toBe("NA");
        expect(
          result.nextCheckpoint
        ).toBe("CP-FSL-D");

        state =
          markProcessCheckpointNotApplicable(
            result.state,
            "CP-FSL-D",
            "N/A — test fixture: no evidence thesis exists.",
            "2026-09-18T00:00:04.000Z"
          );

        result =
          applyDeterministicProcessApplicability(
            state,
            {
              fileCount: 0,
              complete: true,
              source:
                "ENCRYPTED_CASE_UPLOADS"
            },
            "2026-09-18T00:00:05.000Z"
          );
        expect(
          result.state.checkpoints[
            "CP-1c-macierz"
          ]
        ).toBe("NA");
        expect(
          result.nextCheckpoint
        ).toBe("CP-1c-lancuch");

        state =
          markProcessCheckpointNotApplicable(
            result.state,
            "CP-1c-lancuch",
            "N/A — test fixture: no main thesis exists.",
            "2026-09-18T00:00:06.000Z"
          );
        state =
          markProcessCheckpointNotApplicable(
            state,
            "CP-1d-anomalie",
            "N/A — test fixture: no opposing-party documents exist.",
            "2026-09-18T00:00:07.000Z"
          );

        result =
          applyDeterministicProcessApplicability(
            state,
            {
              fileCount: 0,
              complete: true,
              source:
                "ENCRYPTED_CASE_UPLOADS"
            },
            "2026-09-18T00:00:08.000Z"
          );
        expect(
          result.state.checkpoints[
            "CP-1d"
          ]
        ).toBe("NA");
        expect(
          result.nextCheckpoint
        ).toBe("CP-W1");
      }
    );

    it(
      "does not auto-close checkpoints whose file-count condition is met",
      () => {
        let state =
          baseW1();
        let result =
          applyDeterministicProcessApplicability(
            state,
            {
              fileCount: 1,
              complete: true,
              source:
                "LEGACY_CASE_UPLOADS"
            }
          );

        expect(
          result.nextCheckpoint
        ).toBe("CP-1c-skan");
        expect(
          result.applied
        ).toHaveLength(0);

        state =
          closeCheckpoint(
            result.state,
            "CP-1c-skan"
          );
        result =
          applyDeterministicProcessApplicability(
            state,
            {
              fileCount: 1,
              complete: true,
              source:
                "LEGACY_CASE_UPLOADS"
            }
          );

        expect(
          result.state.checkpoints[
            "CP-PD"
          ]
        ).toBe("NA");
        expect(
          result.nextCheckpoint
        ).toBe("CP-FSL-D");
      }
    );

    it(
      "requires CP-PD when the persisted inventory reaches 30 files",
      () => {
        let state =
          baseW1();
        state =
          closeCheckpoint(
            state,
            "CP-1c-skan"
          );

        const result =
          applyDeterministicProcessApplicability(
            state,
            {
              fileCount: 30,
              complete: true,
              source:
                "ENCRYPTED_CASE_UPLOADS"
            }
          );

        expect(
          result.nextCheckpoint
        ).toBe("CP-PD");
        expect(
          result.state.checkpoints[
            "CP-PD"
          ]
        ).toBe("OPEN");
      }
    );

    it(
      "treats ZIP members as files and stays fail-closed when extraction is deferred",
      () => {
        const complete =
          evidenceInventoryFromUploads(
            [
              upload({
                archive: true,
                archiveExtractionStatus:
                  "COMPLETE",
                extracted: [
                  {
                    relativePath:
                      "a.pdf",
                    compressedBytes: 1,
                    uncompressedBytes: 2,
                    sha256:
                      "b".repeat(64),
                    mediaType:
                      "application/pdf",
                    processable: true
                  },
                  {
                    relativePath:
                      "b.txt",
                    compressedBytes: 1,
                    uncompressedBytes: 2,
                    sha256:
                      "c".repeat(64),
                    mediaType:
                      "text/plain",
                    processable: true
                  }
                ]
              })
            ],
            "ENCRYPTED_CASE_UPLOADS"
          );

        expect(
          complete.fileCount
        ).toBe(2);
        expect(
          complete.complete
        ).toBe(true);

        const deferred =
          evidenceInventoryFromUploads(
            [
              upload({
                archive: true,
                archiveExtractionStatus:
                  "DEFERRED_G34H2",
                extracted: []
              })
            ],
            "ENCRYPTED_CASE_UPLOADS"
          );

        expect(
          deferred.fileCount
        ).toBeNull();
        expect(
          deferred.complete
        ).toBe(false);

        const result =
          applyDeterministicProcessApplicability(
            baseW1(),
            deferred
          );
        expect(
          result.applied
        ).toHaveLength(0);
        expect(
          result.nextCheckpoint
        ).toBe("CP-1c-skan");
      }
    );
  }
);
