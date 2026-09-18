import fs from "node:fs";
import { LexSkillRegistry } from "./registry.js";

export const EXPECTED_DR_SKILLS = [
  "dr-01-ustroj-konstytucyjny-i-zrodla-prawa",
  "dr-02-prawo-cywilne-rodzinne-gospodarcze",
  "dr-03-prawo-karne-wykroczenia-egzekucja",
  "dr-04-prawo-pracy-zus-swiadczenia",
  "dr-05-prawo-administracyjne-sadowoadministracyjne",
  "dr-06-podatki-finanse-publiczne-aml",
  "dr-07-zamowienia-publiczne-fundusze-ue",
  "dr-08-samorzad-terytorialny-prawo-lokalne",
  "dr-09-budownictwo-srodowisko-energia-transport",
  "dr-10-zdrowie-farmacja-zywnosc-rolnictwo",
  "dr-11-cyfrowe-cyber-ai-dane-ip",
  "dr-12-sadownictwo-prokuratura-zawody-prawnicze",
  "dr-13-sluzby-bezpieczenstwo-informacje-niejawne",
  "dr-14-prawo-ue-miedzynarodowe-prawa-czlowieka",
  "dr-15-compliance-iso-governance-audyt",
  "dr-16-pisma-strategia-dowody-orzecznictwo"
] as const;

export const CORE_EXECUTION_SKILLS = [
  "analiza-sadowa-v6",
  "analizator-dowodow-v3",
  "analizator-przepisow-v2",
  "analizator-umow-v1",
  "chronologia-sprawy-v1",
  "orzeczenia-sadowe-v2",
  "pisma-procesowe-v3",
  "pisma-proste-v2",
  "przesluchanie-swiadkow-v2-min90",
  "przewodnik-prawny-v2",
  "raport-klienta-v1",
  "raport-sytuacyjny-v2"
] as const;

export type SkillContractCheck = {
  id: string;
  target: string;
  pass: boolean;
  detail?: string;
};

export type SkillContractMatrixReport = {
  gate: "G11_SKILL_CONTRACT_MATRIX";
  result: "PASS" | "BLOCKED";
  expectedDrCount: number;
  discoveredDrCount: number;
  expectedExecutionSkillCount: number;
  missingDrSkills: string[];
  unexpectedDrSkills: string[];
  missingExecutionSkills: string[];
  checks: SkillContractCheck[];
};

function textField(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function addSkillMetadataChecks(
  registry: LexSkillRegistry,
  name: string,
  checks: SkillContractCheck[]
): void {
  const skill = registry.get(name);
  if (!skill) return;

  checks.push({
    id: "frontmatter-version",
    target: name,
    pass: textField(skill.frontmatter.version),
    detail: textField(skill.frontmatter.version)
      ? String(skill.frontmatter.version)
      : "missing non-empty version"
  });
  checks.push({
    id: "frontmatter-description",
    target: name,
    pass: textField(skill.frontmatter.description),
    detail: textField(skill.frontmatter.description)
      ? "present"
      : "missing non-empty description"
  });
  checks.push({
    id: "skill-body",
    target: name,
    pass: skill.body.trim().length > 0,
    detail:
      skill.body.trim().length > 0
        ? `${skill.body.length} chars`
        : "empty SKILL.md body"
  });
}

export function validateSkillContractMatrix(
  registry: LexSkillRegistry
): SkillContractMatrixReport {
  const checks: SkillContractCheck[] = [];
  const discoveredDr = [...registry.skills.keys()]
    .filter((name) => /^dr-\d{2}-/.test(name))
    .sort();
  const expectedDr = [...EXPECTED_DR_SKILLS].sort();

  const missingDrSkills = expectedDr.filter(
    (name) => !registry.skills.has(name)
  );
  const unexpectedDrSkills = discoveredDr.filter(
    (name) => !EXPECTED_DR_SKILLS.includes(
      name as (typeof EXPECTED_DR_SKILLS)[number]
    )
  );
  const missingExecutionSkills = CORE_EXECUTION_SKILLS.filter(
    (name) => !registry.skills.has(name)
  );

  checks.push({
    id: "exact-dr-count",
    target: "DR",
    pass:
      discoveredDr.length === EXPECTED_DR_SKILLS.length &&
      missingDrSkills.length === 0 &&
      unexpectedDrSkills.length === 0,
    detail: `expected=${EXPECTED_DR_SKILLS.length};discovered=${discoveredDr.length}`
  });

  const routingMap = registry.resolveResource(
    "prawo-polskie-v2",
    "prawo-polskie-v2/ROUTING-MAP.md"
  );
  const routingMapText = routingMap
    ? fs.readFileSync(routingMap, "utf8")
    : "";

  checks.push({
    id: "routing-map-readable",
    target: "prawo-polskie-v2/ROUTING-MAP.md",
    pass: Boolean(routingMap),
    detail: routingMap ? "present" : "missing"
  });

  for (const name of EXPECTED_DR_SKILLS) {
    const exists = registry.skills.has(name);
    checks.push({
      id: "dr-present",
      target: name,
      pass: exists,
      detail: exists ? "present" : "missing"
    });
    if (!exists) continue;

    addSkillMetadataChecks(registry, name, checks);
    checks.push({
      id: "dr-listed-in-routing-map",
      target: name,
      pass: routingMapText.includes(name),
      detail: routingMapText.includes(name)
        ? "listed"
        : "not found in ROUTING-MAP.md"
    });
  }

  for (const name of CORE_EXECUTION_SKILLS) {
    const exists = registry.skills.has(name);
    checks.push({
      id: "execution-skill-present",
      target: name,
      pass: exists,
      detail: exists ? "present" : "missing"
    });
    if (!exists) continue;
    addSkillMetadataChecks(registry, name, checks);
  }

  return {
    gate: "G11_SKILL_CONTRACT_MATRIX",
    result:
      checks.every((check) => check.pass) &&
      missingDrSkills.length === 0 &&
      unexpectedDrSkills.length === 0 &&
      missingExecutionSkills.length === 0
        ? "PASS"
        : "BLOCKED",
    expectedDrCount: EXPECTED_DR_SKILLS.length,
    discoveredDrCount: discoveredDr.length,
    expectedExecutionSkillCount: CORE_EXECUTION_SKILLS.length,
    missingDrSkills,
    unexpectedDrSkills,
    missingExecutionSkills: [...missingExecutionSkills],
    checks
  };
}
