export type ReportPolicyResult =
  | "PASS"
  | "BLOCKED";

export type ClientReportProfile =
  | "IND"
  | "BIZ";

export type ClientReportMode =
  | "standard"
  | "zle_wiadomosci"
  | "ograniczenie_szkod"
  | "brak_nowosci";

export type ClientReportBlueprintPolicy = {
  result: ReportPolicyResult;
  profile?: ClientReportProfile;
  mode?: ClientReportMode;
  errors: string[];
  warnings: string[];
};

export type SituationReportCompleteness =
  | "GOTOWY"
  | "CZESCIOWY"
  | "ROBOCZY";

export type SituationReportBlueprintPolicy = {
  result: ReportPolicyResult;
  completeness: SituationReportCompleteness;
  missingRequired: string[];
  warnings: string[];
  hardGateErrors: string[];
};

function objectRecord(
  value: unknown
): Record<string, unknown> | null {
  return value &&
    typeof value === "object" &&
    !Array.isArray(value)
    ? value as
        Record<string, unknown>
    : null;
}

function presentString(
  value: unknown
): boolean {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

function nullOrString(
  value: unknown
): boolean {
  return (
    value === null ||
    presentString(value)
  );
}

function arrayValue(
  value: unknown
): unknown[] | null {
  return Array.isArray(value)
    ? value
    : null;
}

function hasMeaningfulField(
  record: Record<
    string,
    unknown
  >,
  key: string
): boolean {
  return (
    key in record &&
    record[key] !== null &&
    record[key] !==
      undefined
  );
}

const CLIENT_BIZ_ONLY = [
  "kwoty",
  "risk_table",
  "harmonogram",
  "wplyw_na_dzialalnosc",
  "luki_kontraktowe",
  "dzialania_klienta",
  "rekomendacje_zarzad",
  "klauzula_nda"
] as const;

export function validateClientReportBlueprint(
  value: unknown
): ClientReportBlueprintPolicy {
  const errors: string[] = [];
  const warnings: string[] = [];
  const root =
    objectRecord(value);

  if (!root) {
    return {
      result: "BLOCKED",
      errors: [
        "CLIENT_REPORT_BLUEPRINT_NOT_OBJECT"
      ],
      warnings
    };
  }

  const profile =
    root.profile === "IND" ||
    root.profile === "BIZ"
      ? root.profile
      : undefined;
  const mode =
    root.tryb === "standard" ||
    root.tryb ===
      "zle_wiadomosci" ||
    root.tryb ===
      "ograniczenie_szkod" ||
    root.tryb ===
      "brak_nowosci"
      ? root.tryb
      : undefined;

  if (!profile) {
    errors.push(
      "CLIENT_REPORT_PROFILE_INVALID"
    );
  }
  if (!mode) {
    errors.push(
      "CLIENT_REPORT_MODE_INVALID"
    );
  }

  for (
    const key
    of [
      "kancelaria",
      "klient",
      "prawnik",
      "sprawa",
      "etap",
      "kontekst"
    ]
  ) {
    if (
      key in root &&
      !nullOrString(root[key])
    ) {
      errors.push(
        `CLIENT_REPORT_FIELD_INVALID:${key}`
      );
    }
  }

  const assessment =
    objectRecord(
      root.assessment
    );
  const level =
    assessment?.level;
  if (
    !assessment ||
    ![
      "good",
      "neutral",
      "bad",
      "lost"
    ].includes(
      String(level)
    )
  ) {
    errors.push(
      "CLIENT_REPORT_ASSESSMENT_INVALID"
    );
  } else if (mode) {
    if (
      mode ===
        "zle_wiadomosci" &&
      level !== "bad"
    ) {
      errors.push(
        "CLIENT_REPORT_ASSESSMENT_MODE_MISMATCH"
      );
    }
    if (
      mode ===
        "ograniczenie_szkod" &&
      level !== "lost"
    ) {
      errors.push(
        "CLIENT_REPORT_ASSESSMENT_MODE_MISMATCH"
      );
    }
    if (
      mode === "standard" &&
      ![
        "good",
        "neutral",
        "bad"
      ].includes(
        String(level)
      )
    ) {
      errors.push(
        "CLIENT_REPORT_ASSESSMENT_MODE_MISMATCH"
      );
    }
  }

  const evaluation =
    objectRecord(root.ocena);
  if (!evaluation) {
    errors.push(
      "CLIENT_REPORT_EVALUATION_INVALID"
    );
  } else if (profile === "IND") {
    if (
      !nullOrString(
        evaluation.opis
      ) ||
      !nullOrString(
        evaluation.podstawa
      )
    ) {
      errors.push(
        "CLIENT_REPORT_IND_EVALUATION_INVALID"
      );
    }
    for (
      const forbidden
      of [
        "wynik_korzystny_proc",
        "wariant_alternatywny_proc",
        "przedzial_ufnosci",
        "liczba_czynnikow"
      ]
    ) {
      if (
        hasMeaningfulField(
          evaluation,
          forbidden
        )
      ) {
        errors.push(
          `CLIENT_REPORT_IND_PERCENTAGE_FORBIDDEN:${forbidden}`
        );
      }
    }
  } else if (profile === "BIZ") {
    const favorable =
      evaluation
        .wynik_korzystny_proc;
    const alternate =
      evaluation
        .wariant_alternatywny_proc;
    const factors =
      evaluation
        .liczba_czynnikow;
    if (
      typeof favorable !==
        "number" ||
      !Number.isFinite(
        favorable
      ) ||
      favorable < 0 ||
      favorable > 100 ||
      typeof alternate !==
        "number" ||
      !Number.isFinite(
        alternate
      ) ||
      alternate < 0 ||
      alternate > 100 ||
      ![
        "niski",
        "sredni",
        "wysoki"
      ].includes(
        String(
          evaluation
            .przedzial_ufnosci
        )
      ) ||
      !Number.isSafeInteger(
        factors
      ) ||
      Number(factors) < 0
    ) {
      errors.push(
        "CLIENT_REPORT_BIZ_EVALUATION_INVALID"
      );
    }
    if (
      typeof favorable ===
        "number" &&
      typeof alternate ===
        "number" &&
      Math.abs(
        favorable +
          alternate -
          100
      ) > 0.001
    ) {
      warnings.push(
        "CLIENT_REPORT_BIZ_PERCENTAGES_NOT_COMPLEMENTARY_REQUIRE_EXPLANATION"
      );
    }
  }

  if (profile === "IND") {
    for (
      const field
      of CLIENT_BIZ_ONLY
    ) {
      if (
        hasMeaningfulField(
          root,
          field
        )
      ) {
        errors.push(
          `CLIENT_REPORT_BIZ_FIELD_FORBIDDEN_FOR_IND:${field}`
        );
      }
    }
    if (
      "potwierdzenie_odbioru" in
        root &&
      root.potwierdzenie_odbioru !==
        null &&
      typeof root.potwierdzenie_odbioru !==
        "boolean"
    ) {
      errors.push(
        "CLIENT_REPORT_RECEIPT_CONFIRMATION_INVALID"
      );
    }
  }

  if (
    profile === "BIZ" &&
    hasMeaningfulField(
      root,
      "potwierdzenie_odbioru"
    )
  ) {
    errors.push(
      "CLIENT_REPORT_IND_FIELD_FORBIDDEN_FOR_BIZ:potwierdzenie_odbioru"
    );
  }

  const limited = (
    key: string,
    max: number
  ) => {
    if (
      root[key] === null ||
      root[key] === undefined
    ) {
      return;
    }
    const list =
      arrayValue(
        root[key]
      );
    if (!list) {
      errors.push(
        `CLIENT_REPORT_LIST_INVALID:${key}`
      );
      return;
    }
    if (
      list.length > max
    ) {
      errors.push(
        `CLIENT_REPORT_LIST_LIMIT_EXCEEDED:${key}`
      );
    }
  };
  if (profile === "BIZ") {
    limited(
      "luki_kontraktowe",
      3
    );
    limited(
      "dzialania_klienta",
      5
    );
    limited(
      "rekomendacje_zarzad",
      3
    );
  }

  if (
    mode ===
      "zle_wiadomosci"
  ) {
    const badNews =
      objectRecord(
        root.zle_wiadomosci
      );
    const next =
      objectRecord(
        badNews?.co_dalej
      );
    if (
      !badNews ||
      !presentString(
        badNews.fakt
      ) ||
      !presentString(
        badNews.znaczenie
      ) ||
      !next ||
      !presentString(
        next.srodek
      ) ||
      !presentString(
        next.termin
      )
    ) {
      errors.push(
        "CLIENT_REPORT_BAD_NEWS_FIELDS_REQUIRED"
      );
    }
  } else if (
    hasMeaningfulField(
      root,
      "zle_wiadomosci"
    )
  ) {
    errors.push(
      "CLIENT_REPORT_BAD_NEWS_FIELDS_FORBIDDEN"
    );
  }

  if (
    mode ===
      "ograniczenie_szkod"
  ) {
    const damage =
      objectRecord(
        root.ograniczenie_szkod
      );
    const settlements =
      arrayValue(
        damage?.do_rozliczenia
      );
    if (
      !damage ||
      !settlements
    ) {
      errors.push(
        "CLIENT_REPORT_DAMAGE_CONTROL_FIELDS_REQUIRED"
      );
    } else {
      for (
        const item
        of settlements
      ) {
        const record =
          objectRecord(item);
        if (
          !record ||
          !presentString(
            record.termin
          ) ||
          !presentString(
            record.odpowiedzialny
          )
        ) {
          errors.push(
            "CLIENT_REPORT_DAMAGE_CONTROL_SETTLEMENT_INVALID"
          );
          break;
        }
      }
    }
  } else if (
    hasMeaningfulField(
      root,
      "ograniczenie_szkod"
    )
  ) {
    errors.push(
      "CLIENT_REPORT_DAMAGE_CONTROL_FIELDS_FORBIDDEN"
    );
  }

  return {
    result:
      errors.length === 0
        ? "PASS"
        : "BLOCKED",
    ...(profile
      ? { profile }
      : {}),
    ...(mode
      ? { mode }
      : {}),
    errors: [
      ...new Set(errors)
    ],
    warnings: [
      ...new Set(warnings)
    ]
  };
}

function missingText(
  root: Record<
    string,
    unknown
  >,
  key: string
): boolean {
  return (
    !presentString(
      root[key]
    )
  );
}

export function validateSituationReportBlueprint(
  value: unknown,
  runtimeEvidence: {
    hasUnverifiedLegalClaims?: boolean;
    factSourceStatusConflict?: boolean;
  } = {}
): SituationReportBlueprintPolicy {
  const root =
    objectRecord(value);
  if (!root) {
    return {
      result: "BLOCKED",
      completeness:
        "ROBOCZY",
      missingRequired: [
        "BLUEPRINT"
      ],
      warnings: [],
      hardGateErrors: [
        "SITUATION_REPORT_BLUEPRINT_NOT_OBJECT"
      ]
    };
  }

  const missingRequired:
    string[] = [];
  for (
    const key
    of [
      "dziedzina",
      "etap",
      "s1rola",
      "s1opis",
      "s2rola",
      "s2opis",
      "zdarzenie",
      "p1lbl"
    ]
  ) {
    if (
      missingText(
        root,
        key
      )
    ) {
      missingRequired.push(
        key
      );
    }
  }

  if (
    typeof root.p1pct !==
      "number" ||
    !Number.isFinite(
      root.p1pct
    ) ||
    root.p1pct < 0 ||
    root.p1pct > 100
  ) {
    missingRequired.push(
      "p1pct"
    );
  }

  const warnings: string[] =
    [];
  const sources =
    arrayValue(
      root.sources
    );
  const risks =
    arrayValue(
      root.risk_map
    );
  const chronology =
    arrayValue(
      root.chronologia
    );

  if (
    !sources ||
    sources.length === 0
  ) {
    warnings.push(
      "SITUATION_REPORT_SOURCE_REGISTER_EMPTY"
    );
  }
  if (
    !risks ||
    risks.length === 0
  ) {
    warnings.push(
      "SITUATION_REPORT_RISK_MAP_EMPTY"
    );
  }
  if (
    !chronology ||
    chronology.length === 0
  ) {
    warnings.push(
      "SITUATION_REPORT_CHRONOLOGY_EMPTY"
    );
  }

  const confidence =
    root.poziomPewnosciRaportu ??
    root.confidence;
  const hardGateErrors:
    string[] = [];

  if (
    typeof confidence !==
      "number" ||
    !Number.isFinite(
      confidence
    ) ||
    confidence < 0 ||
    confidence > 10
  ) {
    hardGateErrors.push(
      "SITUATION_REPORT_CONFIDENCE_INVALID"
    );
  }
  if (
    typeof confidence ===
      "number" &&
    confidence >= 9 &&
    (
      !sources ||
      sources.length === 0
    )
  ) {
    hardGateErrors.push(
      "SITUATION_REPORT_HIGH_CONFIDENCE_WITHOUT_SOURCES"
    );
  }
  if (
    runtimeEvidence
      .hasUnverifiedLegalClaims
  ) {
    hardGateErrors.push(
      "SITUATION_REPORT_UNVERIFIED_LEGAL_CLAIM"
    );
  }
  if (
    runtimeEvidence
      .factSourceStatusConflict
  ) {
    hardGateErrors.push(
      "SITUATION_REPORT_FACT_SOURCE_STATUS_CONFLICT"
    );
  }

  const baseCompleteness:
    SituationReportCompleteness =
      missingRequired.length === 0
        ? "GOTOWY"
        : missingRequired.length <=
            2
          ? "CZESCIOWY"
          : "ROBOCZY";
  const completeness =
    hardGateErrors.length > 0
      ? "ROBOCZY"
      : baseCompleteness;

  return {
    result:
      hardGateErrors.length ===
        0
        ? "PASS"
        : "BLOCKED",
    completeness,
    missingRequired: [
      ...new Set(
        missingRequired
      )
    ],
    warnings: [
      ...new Set(warnings)
    ],
    hardGateErrors: [
      ...new Set(
        hardGateErrors
      )
    ]
  };
}
