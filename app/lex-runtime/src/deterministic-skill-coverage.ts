export type DeterministicMigrationStatus =
  | "ENFORCED"
  | "PARTIAL"
  | "CODE_FIRST"
  | "POLICY_TARGET"
  | "POLICY_CODE";

export type DeterministicMigrationClass =
  | "STATE_MACHINE_HYBRID"
  | "DETERMINISTIC_ROUTER_HYBRID"
  | "STRUCTURED_OUTPUT_HYBRID"
  | "CODE_AUDIT"
  | "DOMAIN_POLICY_HYBRID"
  | "SHARED_POLICY_AS_CODE";

export type DeterministicSkillCoverageEntry = {
  skill: string;
  status: DeterministicMigrationStatus;
  migrationClass: DeterministicMigrationClass;
  deterministicOwner: string;
  semanticOwner: string;
};

export const DETERMINISTIC_SKILL_COVERAGE:
  readonly DeterministicSkillCoverageEntry[] = [
  {
    skill: "prawny-router-v3",
    status: "PARTIAL",
    migrationClass: "DETERMINISTIC_ROUTER_HYBRID",
    deterministicOwner:
      "router-first bootstrap, core gates, route/dependency validation, source/citation/finalization invariants",
    semanticOwner:
      "ambiguous intent/jurisdiction/domain classification and legal explanation"
  },
  {
    skill: "prawo-polskie-v2",
    status: "PARTIAL",
    migrationClass: "DETERMINISTIC_ROUTER_HYBRID",
    deterministicOwner:
      "DR allowlist, routing-map integrity, module/dependency resolution and route validation",
    semanticOwner:
      "ambiguous multi-domain classification"
  },
  {
    skill: "pisma-proste-v2",
    status: "ENFORCED",
    migrationClass: "STRUCTURED_OUTPUT_HYBRID",
    deterministicOwner:
      "resource reads, intake/output contract, escalation and final validation",
    semanticOwner:
      "fact narration and legal argument wording"
  },
  {
    skill: "pisma-procesowe-v3",
    status: "ENFORCED",
    migrationClass: "STATE_MACHINE_HYBRID",
    deterministicOwner:
      "durable per-case state, checkpoints, optimistic revision, permits, final status and validation",
    semanticOwner:
      "strategy, argumentation, counterargument and drafting"
  },
  {
    skill: "analiza-sadowa-v6",
    status: "ENFORCED",
    migrationClass: "STATE_MACHINE_HYBRID",
    deterministicOwner:
      "ordered passes/checkpoints, completeness, required reads and final report contract",
    semanticOwner:
      "legal qualification, adversarial interpretation and significance"
  },
  {
    skill: "analizator-dowodow-v3",
    status: "ENFORCED",
    migrationClass: "STATE_MACHINE_HYBRID",
    deterministicOwner:
      "required gates/resources, evidence inventory/provenance invariants and final output contract",
    semanticOwner:
      "evidentiary significance, hypotheses and conflict interpretation"
  },
  {
    skill: "analizator-przepisow-v2",
    status: "ENFORCED",
    migrationClass: "STRUCTURED_OUTPUT_HYBRID",
    deterministicOwner:
      "fresh source/resource gates, status/citation invariants and full-report structure",
    semanticOwner:
      "interpretation, conflicts of norms and practical meaning"
  },
  {
    skill: "analizator-umow-v1",
    status: "ENFORCED",
    migrationClass: "STATE_MACHINE_HYBRID",
    deterministicOwner:
      "mode/stage/checkpoint state, clause/checklist gates, report variants and finalization",
    semanticOwner:
      "semantic contract risk, negotiation strategy and clause wording"
  },
  {
    skill: "chronologia-sprawy-v1",
    status: "ENFORCED",
    migrationClass: "STATE_MACHINE_HYBRID",
    deterministicOwner:
      "ordered chronology state, provenance/date/conflict schema and temporal gates",
    semanticOwner:
      "meaning of events and legal consequences"
  },
  {
    skill: "orzeczenia-sadowe-v2",
    status: "ENFORCED",
    migrationClass: "STRUCTURED_OUTPUT_HYBRID",
    deterministicOwner:
      "source/status/citation gates, dedupe/provenance fields and full-report contract",
    semanticOwner:
      "similarity, ratio decidendi relevance and argumentative use"
  },
  {
    skill: "przesluchanie-swiadkow-v2-min90",
    status: "ENFORCED",
    migrationClass: "STATE_MACHINE_HYBRID",
    deterministicOwner:
      "ordered stages, required resources, admissibility/coverage invariants and output gates",
    semanticOwner:
      "question generation, adaptation and examination strategy"
  },
  {
    skill: "raport-klienta-v1",
    status: "ENFORCED",
    migrationClass: "STRUCTURED_OUTPUT_HYBRID",
    deterministicOwner:
      "required reads, structured report blueprint, source/numeric fields and finalization",
    semanticOwner:
      "plain-language explanation and option framing"
  },
  {
    skill: "raport-sytuacyjny-v2",
    status: "ENFORCED",
    migrationClass: "STRUCTURED_OUTPUT_HYBRID",
    deterministicOwner:
      "structured report blueprint, source/status fields, IO schema and finalization",
    semanticOwner:
      "narrative synthesis, risk explanation and prioritization"
  },
  {
    skill: "przewodnik-prawny-v2",
    status: "PARTIAL",
    migrationClass: "DETERMINISTIC_ROUTER_HYBRID",
    deterministicOwner:
      "target: session mode, one-question policy, intake state, irreversible-action warnings and route handoff",
    semanticOwner:
      "dialogue, intent interpretation and lay-language transformation"
  },
  {
    skill: "audyt-systemu-v4",
    status: "CODE_FIRST",
    migrationClass: "CODE_AUDIT",
    deterministicOwner:
      "structural/version/dependency/checksum/map/static checks and release gates",
    semanticOwner:
      "interpretation of substantive legal/methodological findings"
  },

  {
    skill: "dr-01-ustroj-konstytucyjny-i-zrodla-prawa",
    status: "POLICY_TARGET",
    migrationClass: "DOMAIN_POLICY_HYBRID",
    deterministicOwner: "shared source/status/module-resolution policy",
    semanticOwner: "constitutional/domain interpretation"
  },
  {
    skill: "dr-02-prawo-cywilne-rodzinne-gospodarcze",
    status: "POLICY_TARGET",
    migrationClass: "DOMAIN_POLICY_HYBRID",
    deterministicOwner: "shared source/status/module-resolution policy",
    semanticOwner: "civil/family/commercial interpretation"
  },
  {
    skill: "dr-03-prawo-karne-wykroczenia-egzekucja",
    status: "POLICY_TARGET",
    migrationClass: "DOMAIN_POLICY_HYBRID",
    deterministicOwner: "shared source policy plus structured criminal-qualification decision graph",
    semanticOwner: "criminal-law qualification on ambiguous facts"
  },
  {
    skill: "dr-04-prawo-pracy-zus-swiadczenia",
    status: "POLICY_TARGET",
    migrationClass: "DOMAIN_POLICY_HYBRID",
    deterministicOwner: "shared source/status/module-resolution policy",
    semanticOwner: "labour/social-security interpretation"
  },
  {
    skill: "dr-05-prawo-administracyjne-sadowoadministracyjne",
    status: "POLICY_TARGET",
    migrationClass: "DOMAIN_POLICY_HYBRID",
    deterministicOwner: "shared source/status/module-resolution policy",
    semanticOwner: "administrative-law interpretation"
  },
  {
    skill: "dr-06-podatki-finanse-publiczne-aml",
    status: "POLICY_TARGET",
    migrationClass: "DOMAIN_POLICY_HYBRID",
    deterministicOwner: "shared source/status policy plus versioned rate/threshold datasets",
    semanticOwner: "tax/AML qualification and interpretation"
  },
  {
    skill: "dr-07-zamowienia-publiczne-fundusze-ue",
    status: "POLICY_TARGET",
    migrationClass: "DOMAIN_POLICY_HYBRID",
    deterministicOwner: "shared source/status/module-resolution policy",
    semanticOwner: "procurement/EU-funds interpretation"
  },
  {
    skill: "dr-08-samorzad-terytorialny-prawo-lokalne",
    status: "POLICY_TARGET",
    migrationClass: "DOMAIN_POLICY_HYBRID",
    deterministicOwner: "shared source/status/module-resolution policy",
    semanticOwner: "local-government interpretation"
  },
  {
    skill: "dr-09-budownictwo-srodowisko-energia-transport",
    status: "POLICY_TARGET",
    migrationClass: "DOMAIN_POLICY_HYBRID",
    deterministicOwner: "shared source/status/module-resolution policy",
    semanticOwner: "construction/environment/energy/transport interpretation"
  },
  {
    skill: "dr-10-zdrowie-farmacja-zywnosc-rolnictwo",
    status: "POLICY_TARGET",
    migrationClass: "DOMAIN_POLICY_HYBRID",
    deterministicOwner: "shared source/status policy plus current-data freshness gates",
    semanticOwner: "health/pharma/food/agriculture interpretation"
  },
  {
    skill: "dr-11-cyfrowe-cyber-ai-dane-ip",
    status: "POLICY_TARGET",
    migrationClass: "DOMAIN_POLICY_HYBRID",
    deterministicOwner: "shared source/status policy plus staged-application date gates",
    semanticOwner: "digital/cyber/AI/data/IP interpretation"
  },
  {
    skill: "dr-12-sadownictwo-prokuratura-zawody-prawnicze",
    status: "POLICY_TARGET",
    migrationClass: "DOMAIN_POLICY_HYBRID",
    deterministicOwner: "shared source/status policy plus versioned fee datasets",
    semanticOwner: "judiciary/professions interpretation"
  },
  {
    skill: "dr-13-sluzby-bezpieczenstwo-informacje-niejawne",
    status: "POLICY_TARGET",
    migrationClass: "DOMAIN_POLICY_HYBRID",
    deterministicOwner: "shared source/status/module-resolution policy",
    semanticOwner: "security-services/classified-information interpretation"
  },
  {
    skill: "dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka",
    status: "POLICY_TARGET",
    migrationClass: "DOMAIN_POLICY_HYBRID",
    deterministicOwner: "international source hierarchy, jurisdiction/applicable-law/remedy gates",
    semanticOwner: "EU/international/human-rights interpretation"
  },
  {
    skill: "dr-15-compliance-iso-governance-audyt",
    status: "POLICY_TARGET",
    migrationClass: "DOMAIN_POLICY_HYBRID",
    deterministicOwner: "shared source/status policy plus standards/version freshness",
    semanticOwner: "compliance/governance interpretation"
  },
  {
    skill: "dr-16-pisma-strategia-dowody-orzecznictwo",
    status: "POLICY_TARGET",
    migrationClass: "DOMAIN_POLICY_HYBRID",
    deterministicOwner: "tool/calculator routing, formal calculations and shared process/source gates",
    semanticOwner: "strategy and cross-tool legal synthesis"
  },
  {
    skill: "shared",
    status: "POLICY_CODE",
    migrationClass: "SHARED_POLICY_AS_CODE",
    deterministicOwner:
      "source hierarchy, citation ledger, attachment completeness, step tracker, domain/rate locks, provenance and fail-closed invariants",
    semanticOwner:
      "only policy explanations that cannot be expressed as executable predicates"
  }
] as const;

export const DETERMINISTIC_EXECUTION_SKILLS =
  DETERMINISTIC_SKILL_COVERAGE
    .filter((entry) =>
      [
        "ENFORCED",
        "PARTIAL",
        "CODE_FIRST"
      ].includes(entry.status)
    )
    .map((entry) => entry.skill);

export function validateDeterministicSkillCoverage(
  installedSkillNames: readonly string[]
): {
  result: "PASS" | "BLOCKED";
  missingClassifications: string[];
  staleClassifications: string[];
  duplicateClassifications: string[];
} {
  const installed =
    new Set(installedSkillNames);
  const classified =
    new Set<string>();
  const duplicateClassifications:
    string[] = [];

  for (const entry of DETERMINISTIC_SKILL_COVERAGE) {
    if (classified.has(entry.skill)) {
      duplicateClassifications.push(entry.skill);
    }
    classified.add(entry.skill);
  }

  const missingClassifications =
    [...installed]
      .filter((name) => !classified.has(name))
      .sort();

  const staleClassifications =
    [...classified]
      .filter((name) => !installed.has(name))
      .sort();

  return {
    result:
      missingClassifications.length === 0 &&
      staleClassifications.length === 0 &&
      duplicateClassifications.length === 0
        ? "PASS"
        : "BLOCKED",
    missingClassifications,
    staleClassifications,
    duplicateClassifications:
      [...new Set(duplicateClassifications)].sort()
  };
}
