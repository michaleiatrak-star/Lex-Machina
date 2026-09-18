import {
  describe,
  expect,
  it
} from "vitest";
import {
  applyAutomaticVerificationMarkers,
  planAutomaticLegalVerification
} from "./gate-i-auto-verification.js";
import {
  VerificationLedger
} from "./verification-ledger.js";

describe(
  "Gate I automatic statutory verification",
  () => {
    it(
      "plans unambiguous code citations without asking the model for source URLs",
      () => {
        const ledger =
          new VerificationLedger();
        const plan =
          planAutomaticLegalVerification(
            "Podstawą jest art. 5 KC oraz art. 233 KPC.",
            ledger
          );

        expect(plan.calls)
          .toHaveLength(2);
        expect(
          plan.calls.map(
            (call) =>
              call.input.act
          )
        ).toEqual([
          "KC",
          "KPC"
        ]);
        expect(
          plan.calls.every(
            (call) =>
              call.name ===
                "verify_legal_reference"
          )
        ).toBe(true);
      }
    );

    it(
      "does not guess the act for an ambiguous bare article reference",
      () => {
        const plan =
          planAutomaticLegalVerification(
            "Zastosowanie może mieć art. 5.",
            new VerificationLedger()
          );

        expect(plan.calls)
          .toHaveLength(0);
        expect(
          plan.skipped[0]
            ?.reason
        ).toBe(
          "ACT_ALIAS_AMBIGUOUS"
        );
      }
    );

    it(
      "adds runtime verification markers from the ledger to every verified statutory line",
      () => {
        const ledger =
          new VerificationLedger();
        ledger.add({
          claim:
            "art. 5 KC",
          kind:
            "statute",
          status:
            "VERIFIED",
          sourceUrl:
            "https://eli.gov.pl/eli/DU/1964/93/555/ogl",
          sourceTier:
            "R1",
          fetchedAt:
            "2026-09-18T12:00:00.000Z",
          verificationMethod:
            "web_fetch"
        });

        const result =
          applyAutomaticVerificationMarkers(
            "Pierwsza teza: art. 5 KC.\nDruga teza: art. 5 KC.",
            ledger
          );

        expect(result.inserted)
          .toBe(2);
        expect(
          result.text.match(
            /✅ \[VER:/gu
          )
        ).toHaveLength(2);
      }
    );

    it(
      "automatically plans explicit Supreme Court signatures without asking the model for a source URL",
      () => {
        const plan =
          planAutomaticLegalVerification(
            "Sąd Najwyższy, sygn. III CZP 25/11.",
            new VerificationLedger()
          );

        expect(plan.calls)
          .toHaveLength(1);
        expect(plan.calls[0]?.name)
          .toBe(
            "verify_case_reference"
          );
        expect(
          plan.calls[0]?.input
        ).toEqual({
          claim:
            "sygn. III CZP 25/11",
          signature:
            "III CZP 25/11",
          courtFamily: "SN"
        });
      }
    );

    it(
      "does not guess a court family for a bare signature",
      () => {
        const plan =
          planAutomaticLegalVerification(
            "Zob. sygn. III CZP 25/11.",
            new VerificationLedger()
          );

        expect(plan.calls)
          .toHaveLength(0);
        expect(
          plan.skipped[0]?.reason
        ).toBe(
          "COURT_FAMILY_AMBIGUOUS"
        );
      }
    );

    it(
      "inserts an unverified marker when runtime verification failed",
      () => {
        const ledger =
          new VerificationLedger();
        ledger.add({
          claim:
            "art. 5 KC",
          kind: "statute",
          status:
            "UNVERIFIED",
          fetchedAt:
            "2026-09-18T12:00:00.000Z"
        });

        const result =
          applyAutomaticVerificationMarkers(
            "Podstawa: art. 5 KC.",
            ledger
          );

        expect(result.inserted)
          .toBe(1);
        expect(result.text)
          .toContain(
            "⚠️ [NIEWERYFIKOWANE]"
          );
      }
    );

    it(
      "does not plan a duplicate verification already present in the ledger",
      () => {
        const ledger =
          new VerificationLedger();
        ledger.add({
          claim:
            "art. 5 KC",
          kind:
            "statute",
          status:
            "UNVERIFIED",
          fetchedAt:
            "2026-09-18T12:00:00.000Z"
        });

        const plan =
          planAutomaticLegalVerification(
            "art. 5 KC",
            ledger
          );

        expect(plan.calls)
          .toHaveLength(0);
        expect(
          plan.skipped[0]
            ?.reason
        ).toBe(
          "ALREADY_IN_LEDGER"
        );
      }
    );
  }
);
