export type LegalSourceTier =
  | "R1"
  | "R2A"
  | "R2B"
  | "R3";

export type LegalSourceAccessMode =
  | "DIRECT_LIVE"
  | "CRAWLED_OR_INDEXED"
  | "DIRECT_UNAVAILABLE"
  | "POLICY_BLOCKED"
  | "EXTERNAL_MCP"
  | "LOCAL_DERIVED_CORPUS"
  | "UNKNOWN";

export type LegalSourceTransport =
  | "LEX_NATIVE"
  | "FEDERATED_MCP"
  | "WEB_RESEARCH"
  | "LOCAL_CORPUS"
  | "UNKNOWN";

export type LegalSourceCrossCheckStatus =
  | "NOT_REQUIRED"
  | "PENDING"
  | "CONFIRMED_R1_R2A"
  | "CONFLICT"
  | "UNAVAILABLE";

export type LegalSourceProvenance = {
  sourceUrl?: string;
  sourceId?: string;
  publisher?: string;
  retrievedVia:
    LegalSourceTransport;
  accessMode:
    LegalSourceAccessMode;
  classificationBasis:
    string;
  publishedAt?: string;
  updatedAt?: string;
};

export type LegalSourceCandidate = {
  claim?: string;
  title?: string;
  url?: string;
  tier: LegalSourceTier;
  provenance:
    LegalSourceProvenance;
  crossCheckStatus:
    LegalSourceCrossCheckStatus;
  crossCheckUrl?: string;
  crossCheckTier?:
    | "R1"
    | "R2A";
};

export type LegalSourcePolicyAssessment = {
  tier: LegalSourceTier;
  auxiliaryOnly: boolean;
  canBeSoleLegalBasis: boolean;
  canCreateVerifiedMarker: boolean;
  requiresHigherTierCrossCheck: boolean;
  higherTierCrossCheckSatisfied: boolean;
  staleOrUndatedWarning: boolean;
  conflict: boolean;
  instruction: string;
};

export type FederatedSourcePolicy = {
  sourceTier:
    LegalSourceTier;
  provenance:
    LegalSourceAccessMode;
  transport:
    "FEDERATED_MCP";
  verificationAuthority:
    "LEX_NATIVE_ONLY";
  verificationEligible:
    false;
  requiresDocumentTierClassification?:
    boolean;
  crossCheckRequired:
    boolean;
  note: string;
};

const R1_HOSTS =
  new Set([
    "isap.sejm.gov.pl",
    "eli.gov.pl",
    "api.sejm.gov.pl",
    "sejm.gov.pl",
    "www.sejm.gov.pl",
    "eur-lex.europa.eu",
    "uodo.gov.pl",
    "www.uodo.gov.pl",
    "monitorpolski.gov.pl",
    "dziennikustaw.gov.pl",
    "dziennikiurzedowe.gov.pl"
  ]);

const R2A_HOSTS =
  new Set([
    "sn.pl",
    "www.sn.pl",
    "orzeczenia.ms.gov.pl",
    "www.orzeczenia.ms.gov.pl",
    "orzeczenia.nsa.gov.pl",
    "nsa.gov.pl",
    "saos.org.pl",
    "www.saos.org.pl",
    "trybunal.gov.pl",
    "ipo.trybunal.gov.pl",
    "orzeczenia.uodo.gov.pl",
    "orzeczenia.uzp.gov.pl",
    "bip.uke.gov.pl",
    "decyzje.uokik.gov.pl",
    "eureka.mf.gov.pl",
    "api-krs.ms.gov.pl",
    "wyszukiwarka-krs.ms.gov.pl",
    "krz.ms.gov.pl",
    "ekw.ms.gov.pl",
    "dane.biznes.gov.pl",
    "api.stat.gov.pl",
    "sudop.uokik.gov.pl",
    "ezamowienia.gov.pl",
    "bzp.uzp.gov.pl",
    "legislacja.rcl.gov.pl"
  ]);

const R2B_HOSTS =
  new Set([
    "prawo.pl",
    "www.prawo.pl",
    "lex.pl",
    "www.lex.pl",
    "sip.lex.pl",
    "legalis.pl",
    "www.legalis.pl",
    "sip.legalis.pl",
    "rp.pl",
    "www.rp.pl",
    "infor.pl",
    "www.infor.pl",
    "lexlege.pl",
    "www.lexlege.pl",
    "arslege.pl",
    "www.arslege.pl",
    "gazetaprawna.pl",
    "www.gazetaprawna.pl",
    "kadry.infor.pl",
    "poradnikprzedsiebiorcy.pl",
    "www.poradnikprzedsiebiorcy.pl",
    "money.pl",
    "www.money.pl",
    "gofin.pl",
    "www.gofin.pl",
    "przepisy.gofin.pl",
    "standardyprawa.pl",
    "www.standardyprawa.pl",
    "biznes.gov.pl",
    "www.biznes.gov.pl"
  ]);

function parseHost(
  value: string
): string | null {
  try {
    const url =
      new URL(value);
    if (
      url.protocol !==
        "https:" &&
      url.protocol !==
        "http:"
    ) {
      return null;
    }
    return url.hostname
      .toLocaleLowerCase(
        "en"
      );
  } catch {
    return null;
  }
}

export function classifyKnownLegalSourceUrl(
  value: string
): LegalSourceTier | null {
  const host =
    parseHost(value);
  if (!host) {
    return null;
  }
  if (R1_HOSTS.has(host)) {
    return "R1";
  }
  if (R2A_HOSTS.has(host)) {
    return "R2A";
  }
  if (R2B_HOSTS.has(host)) {
    return "R2B";
  }
  return null;
}

function sourceDate(
  candidate:
    LegalSourceCandidate
): string | undefined {
  return (
    candidate.provenance
      .updatedAt ??
    candidate.provenance
      .publishedAt
  );
}

function olderThanMonths(
  value: string,
  months: number,
  now: Date
): boolean {
  const parsed =
    new Date(value);
  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return true;
  }
  const threshold =
    new Date(
      now.getTime()
    );
  threshold.setUTCMonth(
    threshold.getUTCMonth() -
      months
  );
  return (
    parsed.getTime() <
    threshold.getTime()
  );
}

export function assessLegalSourceCandidate(
  candidate:
    LegalSourceCandidate,
  now: Date =
    new Date()
): LegalSourcePolicyAssessment {
  const auxiliaryOnly =
    candidate.tier ===
      "R2B" ||
    candidate.tier ===
      "R3";
  const requiresHigherTierCrossCheck =
    auxiliaryOnly;
  const higherTierCrossCheckSatisfied =
    candidate.crossCheckStatus ===
      "CONFIRMED_R1_R2A" &&
    (
      candidate.crossCheckTier ===
        "R1" ||
      candidate.crossCheckTier ===
        "R2A"
    ) &&
    Boolean(
      candidate.crossCheckUrl
    );
  const conflict =
    candidate.crossCheckStatus ===
      "CONFLICT";
  const date =
    sourceDate(candidate);
  const staleOrUndatedWarning =
    candidate.tier ===
      "R3" &&
    (
      !date ||
      olderThanMonths(
        date,
        24,
        now
      )
    );

  if (auxiliaryOnly) {
    return {
      tier:
        candidate.tier,
      auxiliaryOnly: true,
      canBeSoleLegalBasis:
        false,
      canCreateVerifiedMarker:
        false,
      requiresHigherTierCrossCheck:
        true,
      higherTierCrossCheckSatisfied,
      staleOrUndatedWarning,
      conflict,
      instruction:
        conflict
          ? "Auxiliary source conflicts with an R1/R2A source. Prefer the higher-tier source and do not build the conclusion on the auxiliary source."
          : higherTierCrossCheckSatisfied
            ? "Use only as auxiliary context, separately labelled from normative/case-law sources. The R1/R2A cross-check remains the legal basis."
            : "Do not use as a legal basis until the proposition is cross-checked against R1 or R2A. Never create a VERIFIED marker from this source."
    };
  }

  return {
    tier:
      candidate.tier,
    auxiliaryOnly: false,
    canBeSoleLegalBasis:
      true,
    canCreateVerifiedMarker:
      candidate.provenance
        .retrievedVia ===
        "LEX_NATIVE" &&
      candidate.provenance
        .accessMode ===
        "DIRECT_LIVE",
    requiresHigherTierCrossCheck:
      false,
    higherTierCrossCheckSatisfied:
      true,
    staleOrUndatedWarning:
      false,
    conflict,
    instruction:
      "R1/R2A material may participate in the native verification path. A source tier alone never creates VERIFIED; the applicable Lex native verifier must still succeed."
  };
}

export function assertVerificationTierPolicy(
  input: {
    status:
      | "VERIFIED"
      | "SUPPORTED"
      | "UNVERIFIED";
    sourceTier?:
      LegalSourceTier;
  }
): void {
  if (
    (
      input.status ===
        "VERIFIED" ||
      input.status ===
        "SUPPORTED"
    ) &&
    (
      input.sourceTier ===
        "R2B" ||
      input.sourceTier ===
        "R3"
    )
  ) {
    throw new Error(
      "AUXILIARY_SOURCE_CANNOT_CREATE_VERIFIED_OR_SUPPORTED_STATUS"
    );
  }
}

const FEDERATED_POLICIES:
  Record<
    string,
    FederatedSourcePolicy
  > = {
    isap: {
      sourceTier: "R1",
      provenance:
        "EXTERNAL_MCP",
      transport:
        "FEDERATED_MCP",
      verificationAuthority:
        "LEX_NATIVE_ONLY",
      verificationEligible:
        false,
      crossCheckRequired:
        true,
      note:
        "R1 source material via MCP is discovery/retrieval only. Current wording must be reverified through the native legal-act path."
    },
    saos: {
      sourceTier: "R2A",
      provenance:
        "EXTERNAL_MCP",
      transport:
        "FEDERATED_MCP",
      verificationAuthority:
        "LEX_NATIVE_ONLY",
      verificationEligible:
        false,
      crossCheckRequired:
        true,
      note:
        "SAOS is discovery/cross-check material. It does not replace the court-family authoritative verifier."
    },
    nsa: {
      sourceTier: "R2A",
      provenance:
        "EXTERNAL_MCP",
      transport:
        "FEDERATED_MCP",
      verificationAuthority:
        "LEX_NATIVE_ONLY",
      verificationEligible:
        false,
      crossCheckRequired:
        true,
      note:
        "CBOSA material remains subject to exact-match and channel provenance rules before any verified use."
    },
    krs: {
      sourceTier: "R2A",
      provenance:
        "EXTERNAL_MCP",
      transport:
        "FEDERATED_MCP",
      verificationAuthority:
        "LEX_NATIVE_ONLY",
      verificationEligible:
        false,
      crossCheckRequired:
        true,
      note:
        "Official registry material may establish registry facts, not statutory wording."
    },
    eureka: {
      sourceTier: "R2A",
      provenance:
        "EXTERNAL_MCP",
      transport:
        "FEDERATED_MCP",
      verificationAuthority:
        "LEX_NATIVE_ONLY",
      verificationEligible:
        false,
      crossCheckRequired:
        true,
      note:
        "Interpretations establish the authority's position; statutory propositions still require R1 verification."
    },
    kio: {
      sourceTier: "R2A",
      provenance:
        "EXTERNAL_MCP",
      transport:
        "FEDERATED_MCP",
      verificationAuthority:
        "LEX_NATIVE_ONLY",
      verificationEligible:
        false,
      crossCheckRequired:
        true,
      note:
        "KIO decisions are R2A decisional material and are not statutory text."
    },
    uodo: {
      sourceTier: "R2A",
      provenance:
        "EXTERNAL_MCP",
      transport:
        "FEDERATED_MCP",
      verificationAuthority:
        "LEX_NATIVE_ONLY",
      verificationEligible:
        false,
      crossCheckRequired:
        true,
      note:
        "UODO decisions are R2A decisional material and are not statutory text."
    },
    "eu-sparql": {
      sourceTier: "R2A",
      provenance:
        "EXTERNAL_MCP",
      transport:
        "FEDERATED_MCP",
      verificationAuthority:
        "LEX_NATIVE_ONLY",
      verificationEligible:
        false,
      requiresDocumentTierClassification:
        true,
      crossCheckRequired:
        true,
      note:
        "This mixed EUR-Lex/CJEU connector is conservatively labelled R2A at transport level. Individual legislative documents may be R1 and must be classified by their official URL/type before final use."
    },
    "eu-compliance": {
      sourceTier: "R1",
      provenance:
        "LOCAL_DERIVED_CORPUS",
      transport:
        "FEDERATED_MCP",
      verificationAuthority:
        "LEX_NATIVE_ONLY",
      verificationEligible:
        false,
      crossCheckRequired:
        true,
      note:
        "Derived EUR-Lex corpus inherits R1 subject matter but cannot prove current official wording; live EUR-Lex verification takes precedence."
    },
    legalize: {
      sourceTier: "R3",
      provenance:
        "EXTERNAL_MCP",
      transport:
        "FEDERATED_MCP",
      verificationAuthority:
        "LEX_NATIVE_ONLY",
      verificationEligible:
        false,
      crossCheckRequired:
        true,
      note:
        "Third-party law-as-git corpus is research-only R3 material. It requires current official-source cross-check before use."
    }
  };

export function federatedSourcePolicy(
  sourceId: string
): FederatedSourcePolicy {
  return (
    FEDERATED_POLICIES[
      sourceId
    ] ?? {
      sourceTier: "R3",
      provenance:
        "UNKNOWN",
      transport:
        "FEDERATED_MCP",
      verificationAuthority:
        "LEX_NATIVE_ONLY",
      verificationEligible:
        false,
      crossCheckRequired:
        true,
      note:
        "Unknown federated source is treated conservatively as R3 research-only material until explicitly classified."
    }
  );
}
