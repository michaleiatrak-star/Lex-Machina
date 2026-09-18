import {
  detectLegalReferences,
  type DetectedLegalReference
} from "./finalization-gate.js";
import type {
  NormalizedToolCall
} from "./providers/types.js";
import {
  VerificationLedger,
  type VerificationRecord
} from "./verification-ledger.js";

const ACT_ALIAS =
  /\b(KC|KPC|KK|KPK|KPA|KP|KRO|KSH|KW|KPW|PZP)\b/giu;
const SUPREME_COURT =
  /\b(?:SN|SĄD\s+NAJWYŻSZY|SĄDU\s+NAJWYŻSZEGO)\b/iu;
const CASE_SIGNATURE =
  /\bsygn\.?\s*(?:akt\s*)?([A-ZĄĆĘŁŃÓŚŹŻ0-9]{1,8}(?:\s+[A-ZĄĆĘŁŃÓŚŹŻ0-9]{1,12}){0,3}\s+\d+\/\d{2,4})\b/iu;

function normalizedClaim(
  value: string
): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("pl")
    .replace(/\s+/gu, " ")
    .trim();
}

function aliases(
  value: string
): string[] {
  return [
    ...new Set(
      [...value.matchAll(
        ACT_ALIAS
      )]
        .map(
          (match) =>
            match[1]
              ?.toLocaleUpperCase(
                "pl"
              )
        )
        .filter(
          (
            item
          ): item is string =>
            Boolean(item)
        )
    )
  ];
}

function uniqueActAlias(
  reference: DetectedLegalReference
): string | null {
  const claimAliases =
    aliases(
      reference.claim
    );
  if (
    claimAliases.length === 1
  ) {
    return claimAliases[0]!;
  }
  if (
    claimAliases.length > 1
  ) {
    return null;
  }

  const lineAliases =
    aliases(
      reference.lineText
    );
  return lineAliases.length === 1
    ? lineAliases[0]!
    : null;
}

function caseSignature(
  reference: DetectedLegalReference
): string | null {
  if (
    reference.kind !== "case" ||
    !SUPREME_COURT.test(
      reference.lineText
    )
  ) {
    return null;
  }
  return reference.claim
    .match(
      CASE_SIGNATURE
    )?.[1]
    ?.trim() ?? null;
}

export type GateIAutoVerificationPlan = {
  calls: NormalizedToolCall[];
  skipped: Array<{
    claim: string;
    reason:
      | "ALREADY_IN_LEDGER"
      | "ACT_ALIAS_AMBIGUOUS"
      | "COURT_FAMILY_AMBIGUOUS"
      | "CASE_SIGNATURE_INVALID"
      | "UNSUPPORTED_KIND";
  }>;
};

export function planAutomaticLegalVerification(
  text: string,
  ledger: VerificationLedger
): GateIAutoVerificationPlan {
  const references =
    detectLegalReferences(text);
  const calls:
    NormalizedToolCall[] = [];
  const skipped:
    GateIAutoVerificationPlan["skipped"] =
      [];
  const seen =
    new Set<string>();

  for (const reference of references) {
    const key =
      normalizedClaim(
        reference.claim
      );
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);

    if (
      ledger.latest(
        reference.claim
      )
    ) {
      skipped.push({
        claim:
          reference.claim,
        reason:
          "ALREADY_IN_LEDGER"
      });
      continue;
    }

    if (
      reference.kind ===
        "statute" ||
      reference.kind ===
        "journal"
    ) {
      const alias =
        uniqueActAlias(
          reference
        );
      if (!alias) {
        skipped.push({
          claim:
            reference.claim,
          reason:
            "ACT_ALIAS_AMBIGUOUS"
        });
        continue;
      }

      calls.push({
        id:
          `gate-i-auto-${calls.length + 1}`,
        name:
          "verify_legal_reference",
        input: {
          claim:
            reference.claim,
          kind:
            reference.kind,
          act:
            alias
        }
      });
      continue;
    }

    if (
      reference.kind ===
        "case"
    ) {
      if (
        !SUPREME_COURT.test(
          reference.lineText
        )
      ) {
        skipped.push({
          claim:
            reference.claim,
          reason:
            "COURT_FAMILY_AMBIGUOUS"
        });
        continue;
      }
      const signature =
        caseSignature(
          reference
        );
      if (!signature) {
        skipped.push({
          claim:
            reference.claim,
          reason:
            "CASE_SIGNATURE_INVALID"
        });
        continue;
      }
      calls.push({
        id:
          `gate-i-auto-${calls.length + 1}`,
        name:
          "verify_case_reference",
        input: {
          claim:
            reference.claim,
          signature,
          courtFamily:
            "SN"
        }
      });
      continue;
    }

    skipped.push({
      claim:
        reference.claim,
      reason:
        "UNSUPPORTED_KIND"
    });
  }

  return {
    calls,
    skipped
  };
}

function marker(
  record:
    VerificationRecord
): string | null {
  if (
    record.status ===
      "UNVERIFIED"
  ) {
    return "⚠️ [NIEWERYFIKOWANE]";
  }

  if (
    record.status !==
      "VERIFIED" ||
    !record.sourceUrl ||
    !record.fetchedAt
  ) {
    return null;
  }

  return [
    "✅ [VER: ",
    record.sourceUrl,
    ", ",
    record.fetchedAt
      .slice(0, 10),
    record.asOf
      ? `, STAN NA ${record.asOf}`
      : "",
    "]"
  ].join("");
}

export function applyAutomaticVerificationMarkers(
  text: string,
  ledger: VerificationLedger
): {
  text: string;
  inserted: number;
} {
  const references =
    detectLegalReferences(text);
  if (
    references.length === 0
  ) {
    return {
      text,
      inserted: 0
    };
  }

  const byLine =
    new Map<
      number,
      VerificationRecord[]
    >();

  for (const reference of references) {
    const record =
      ledger.latest(
        reference.claim
      );
    if (!record) {
      continue;
    }

    const current =
      byLine.get(
        reference.line
      ) ?? [];
    if (
      !current.some(
        (item) =>
          normalizedClaim(
            item.claim
          ) ===
          normalizedClaim(
            record.claim
          )
      )
    ) {
      current.push(record);
      byLine.set(
        reference.line,
        current
      );
    }
  }

  if (
    byLine.size === 0
  ) {
    return {
      text,
      inserted: 0
    };
  }

  let inserted = 0;
  const lines =
    text.split(/\r?\n/u)
      .map(
        (line, index) => {
          const records =
            byLine.get(
              index + 1
            );
          if (
            !records ||
            records.length === 0
          ) {
            return line;
          }

          const missingMarkers =
            records
              .map(marker)
              .filter(
                (
                  value
                ): value is string =>
                  Boolean(value)
              )
              .filter(
                (value) =>
                  !line.includes(
                    value
                  )
              );

          if (
            missingMarkers.length ===
              0
          ) {
            return line;
          }
          inserted +=
            missingMarkers.length;
          return [
            line.trimEnd(),
            ...missingMarkers
          ].join(" ");
        }
      );

  return {
    text:
      lines.join("\n"),
    inserted
  };
}
