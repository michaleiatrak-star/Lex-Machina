import fs from "node:fs";
import path from "node:path";
import {
  describe,
  expect,
  it
} from "vitest";
import {
  createDeterministicWorkflowPlan
} from "./deterministic-workflow.js";
import {
  PROCESS_PLEADING_CHECKPOINTS
} from "./process-pleading-state.js";
import {
  COURT_ANALYSIS_CHECKPOINTS
} from "./court-analysis-state.js";
import {
  CHRONOLOGY_CHECKPOINTS
} from "./chronology-state.js";
import {
  CONTRACT_CHECKPOINTS
} from "./contract-analysis-state.js";
import {
  LexSkillRegistry
} from "./registry.js";

function corpusRoot(): string {
  const candidates = [
    path.resolve(
      process.cwd(),
      "../../Wersja rozwojowa rozpakowana"
    ),
    path.resolve(
      process.cwd(),
      "Wersja rozwojowa rozpakowana"
    )
  ];
  const root =
    candidates.find(
      (candidate) =>
        fs.existsSync(
          path.join(
            candidate,
            "prawny-router-v3",
            "SKILL.md"
          )
        )
    );
  if (!root) {
    throw new Error(
      "WORKFLOW_PARITY_CORPUS_MISSING"
    );
  }
  return root;
}

function registryForCorpus(
  root: string
): LexSkillRegistry {
  const registry =
    new LexSkillRegistry(root);
  registry.scan();
  return registry;
}

function read(
  root: string,
  relative: string
): string {
  return fs.readFileSync(
    path.join(
      root,
      ...relative.split("/")
    ),
    "utf8"
  );
}

function sourceContract(
  root: string,
  skill: string,
  resources: readonly string[]
): string {
  return [
    read(
      root,
      `${skill}/SKILL.md`
    ),
    ...resources.map(
      (resource) =>
        read(root, resource)
    )
  ].join("\n\n");
}

function sourceReferenceNeedle(
  skill: string,
  resource: string
): string {
  const ownPrefix =
    `${skill}/`;
  return resource.startsWith(
    ownPrefix
  )
    ? resource.slice(
        ownPrefix.length
      )
    : resource;
}

describe(
  "skill-only vs engine-controlled parity",
  () => {
    it.each([
      [
        "pisma-procesowe-v3",
        "PROCESS_PLEADING_V1"
      ],
      [
        "analiza-sadowa-v6",
        "COURT_ANALYSIS_V1"
      ],
      [
        "chronologia-sprawy-v1",
        "CHRONOLOGY_V1"
      ],
      [
        "analizator-umow-v1",
        "CONTRACT_ANALYSIS_V1"
      ]
    ] as const)(
      "keeps deterministic fresh-read resources declared by %s",
      (skill, workflowId) => {
        const root =
          corpusRoot();
        const registry =
          registryForCorpus(root);
        const plan =
          createDeterministicWorkflowPlan(
            registry,
            skill
          );
        expect(plan.id)
          .toBe(workflowId);

        const skillBody =
          read(
            root,
            `${skill}/SKILL.md`
          );
        for (
          const resource
          of plan.requiredFreshResources
        ) {
          expect(
            skillBody.includes(
              sourceReferenceNeedle(
                skill,
                resource
              )
            ),
            `${skill} no longer declares runtime-enforced resource ${resource}`
          ).toBe(true);
        }
      }
    );

    it(
      "keeps every process checkpoint grounded in the process skill contract",
      () => {
        const root =
          corpusRoot();
        const registry =
          registryForCorpus(root);
        const plan =
          createDeterministicWorkflowPlan(
            registry,
            "pisma-procesowe-v3"
          );
        const contract =
          sourceContract(
            root,
            "pisma-procesowe-v3",
            plan.requiredFreshResources
          );

        for (
          const checkpoint
          of PROCESS_PLEADING_CHECKPOINTS
        ) {
          expect(
            contract.includes(
              checkpoint
            ),
            `runtime process checkpoint ${checkpoint} is absent from skill/reference contract`
          ).toBe(true);
        }

        for (
          const stageNeedle
          of [
            "CG-GATE",
            "W1",
            "PRE-W2",
            "W2",
            "W3"
          ]
        ) {
          expect(
            contract.includes(
              stageNeedle
            )
          ).toBe(true);
        }
      }
    );

    it(
      "keeps court-analysis runtime checkpoints semantically grounded in the four-pass skill",
      () => {
        const root =
          corpusRoot();
        const registry =
          registryForCorpus(root);
        const plan =
          createDeterministicWorkflowPlan(
            registry,
            "analiza-sadowa-v6"
          );
        const contract =
          sourceContract(
            root,
            "analiza-sadowa-v6",
            plan.requiredFreshResources
          );

        const grounding:
          Record<
            typeof COURT_ANALYSIS_CHECKPOINTS[number],
            string
          > = {
            SD_VER_COMPLETE:
              "SKAN KOMPLETNOŚCI PLIKÓW",
            PASS_I_ISOLATION_CLEAN:
              "PRZEJŚCIE I",
            PASS_II_SOURCES_VERIFIED:
              "PRZEJŚCIE II",
            FIRST_VERIFICATION_COMPLETE:
              "WERYFIKACJA PIERWSZA",
            FINAL_VERIFICATION_COMPLETE:
              "WERYFIKACJA OSTATECZNA",
            FINAL_GATE_APPROVED:
              "GATE: RAPORT KOŃCOWY ZATWIERDZONY",
            FINAL_REPORT_PRESENTED:
              "Raport końcowy §1-§11",
            SITUATIONAL_REPORT_PRESENTED:
              "RAPORTU SYTUACYJNEGO",
            PROCESS_PLEADING_OFFER_PRESENTED:
              "pismo procesowe"
          };

        for (
          const checkpoint
          of COURT_ANALYSIS_CHECKPOINTS
        ) {
          expect(
            contract
              .toLocaleLowerCase(
                "pl"
              )
              .includes(
                grounding[
                  checkpoint
                ].toLocaleLowerCase(
                  "pl"
                )
              ),
            `runtime court checkpoint ${checkpoint} lost its skill-level semantic anchor`
          ).toBe(true);
        }
      }
    );

    it(
      "keeps chronology stages grounded in extraction, temporal and contradiction instructions",
      () => {
        const root =
          corpusRoot();
        const registry =
          registryForCorpus(root);
        const plan =
          createDeterministicWorkflowPlan(
            registry,
            "chronologia-sprawy-v1"
          );
        const contract =
          sourceContract(
            root,
            "chronologia-sprawy-v1",
            plan.requiredFreshResources
          ).toLocaleLowerCase(
            "pl"
          );

        expect(
          CHRONOLOGY_CHECKPOINTS
        ).toHaveLength(6);
        for (
          const needle
          of [
            "dokument",
            "wątk",
            "ekstrakc",
            "temporal",
            "sprzeczno",
            "raport"
          ]
        ) {
          expect(
            contract.includes(
              needle
            )
          ).toBe(true);
        }
      }
    );

    it(
      "keeps every contract checkpoint named in the contract skill contract",
      () => {
        const root =
          corpusRoot();
        const registry =
          registryForCorpus(root);
        const plan =
          createDeterministicWorkflowPlan(
            registry,
            "analizator-umow-v1"
          );
        const contract =
          sourceContract(
            root,
            "analizator-umow-v1",
            plan.requiredFreshResources
          );

        for (
          const checkpoint
          of CONTRACT_CHECKPOINTS
        ) {
          expect(
            contract.includes(
              checkpoint
            ),
            `runtime contract checkpoint ${checkpoint} is absent from skill/reference contract`
          ).toBe(true);
        }
      }
    );
  }
);
