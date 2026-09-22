import {
  describe,
  expect,
  it
} from "vitest";
import {
  assessLegalSourceCandidate,
  classifyKnownLegalSourceUrl,
  federatedSourcePolicy
} from "../src/legal-source-policy.js";
import {
  VerificationLedger
} from "../src/verification-ledger.js";

describe(
  "0.1.7 legal source tier policy",
  () => {
    it(
      "classifies canonical known source families without upgrading unknown domains",
      () => {
        expect(
          classifyKnownLegalSourceUrl(
            "https://eli.gov.pl/eli/DU/2026/1"
          )
        ).toBe("R1");
        expect(
          classifyKnownLegalSourceUrl(
            "https://orzeczenia.nsa.gov.pl/doc/ABC"
          )
        ).toBe("R2A");
        expect(
          classifyKnownLegalSourceUrl(
            "https://prawo.pl/prawo/komentarz"
          )
        ).toBe("R2B");
        expect(
          classifyKnownLegalSourceUrl(
            "https://example-law-blog.test/post"
          )
        ).toBeNull();
      }
    );

    it(
      "blocks VERIFIED and SUPPORTED status for R2B/R3 even if a caller tries to add it directly",
      () => {
        const ledger =
          new VerificationLedger();

        expect(() =>
          ledger.add({
            claim:
              "Komentarz do przepisu",
            kind: "statute",
            status:
              "VERIFIED",
            sourceUrl:
              "https://prawo.pl/example",
            sourceTier:
              "R2B",
            fetchedAt:
              "2026-09-22T06:00:00.000Z"
          })
        ).toThrow(
          "AUXILIARY_SOURCE_CANNOT_CREATE_VERIFIED_OR_SUPPORTED_STATUS"
        );

        expect(() =>
          ledger.add({
            claim:
              "Teza z bloga",
            kind: "case",
            status:
              "SUPPORTED",
            sourceUrl:
              "https://example.test/post",
            sourceTier:
              "R3",
            fetchedAt:
              "2026-09-22T06:00:00.000Z",
            caseScope:
              "PROPOSITION_SUPPORT",
            caseSignature:
              "III CZP 1/26",
            evidenceHash:
              "evidence",
            supportQuoteHash:
              "quote",
            supportQuote:
              "Treść"
          })
        ).toThrow(
          "AUXILIARY_SOURCE_CANNOT_CREATE_VERIFIED_OR_SUPPORTED_STATUS"
        );
      }
    );

    it(
      "keeps auxiliary sources auxiliary after a successful higher-tier cross-check",
      () => {
        const assessment =
          assessLegalSourceCandidate(
            {
              tier: "R2B",
              url:
                "https://prawo.pl/example",
              provenance: {
                sourceUrl:
                  "https://prawo.pl/example",
                retrievedVia:
                  "WEB_RESEARCH",
                accessMode:
                  "DIRECT_LIVE",
                classificationBasis:
                  "Known professional editorial portal",
                updatedAt:
                  "2026-09-01"
              },
              crossCheckStatus:
                "CONFIRMED_R1_R2A",
              crossCheckTier:
                "R1",
              crossCheckUrl:
                "https://eli.gov.pl/eli/DU/2026/1"
            },
            new Date(
              "2026-09-22T06:00:00.000Z"
            )
          );

        expect(
          assessment
            .higherTierCrossCheckSatisfied
        ).toBe(true);
        expect(
          assessment
            .canBeSoleLegalBasis
        ).toBe(false);
        expect(
          assessment
            .canCreateVerifiedMarker
        ).toBe(false);
      }
    );

    it(
      "warns when R3 research is undated or older than 24 months",
      () => {
        const old =
          assessLegalSourceCandidate(
            {
              tier: "R3",
              provenance: {
                retrievedVia:
                  "WEB_RESEARCH",
                accessMode:
                  "DIRECT_LIVE",
                classificationBasis:
                  "Individual legal blog",
                publishedAt:
                  "2023-01-01"
              },
              crossCheckStatus:
                "PENDING"
            },
            new Date(
              "2026-09-22T06:00:00.000Z"
            )
          );
        expect(
          old.staleOrUndatedWarning
        ).toBe(true);
        expect(
          old
            .requiresHigherTierCrossCheck
        ).toBe(true);
      }
    );

    it(
      "marks current federation sources with conservative tier and native-only verification authority",
      () => {
        expect(
          federatedSourcePolicy(
            "isap"
          )
        ).toMatchObject({
          sourceTier: "R1",
          verificationAuthority:
            "LEX_NATIVE_ONLY",
          verificationEligible:
            false
        });
        expect(
          federatedSourcePolicy(
            "legalize"
          )
        ).toMatchObject({
          sourceTier: "R3",
          crossCheckRequired:
            true,
          verificationEligible:
            false
        });
        expect(
          federatedSourcePolicy(
            "eu-sparql"
          )
            .requiresDocumentTierClassification
        ).toBe(true);
      }
    );
  }
);
