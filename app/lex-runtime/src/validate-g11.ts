import path from "node:path";
import { fileURLToPath } from "node:url";
import { LexExecutionEngine } from "./execution-engine.js";
import { LexSkillRegistry } from "./registry.js";
import {
  EXPECTED_DR_SKILLS,
  validateSkillContractMatrix
} from "./skill-contract-matrix.js";
import { ProviderGateway, ProviderRegistry } from "./providers/gateway.js";
import { ScriptedProviderAdapter } from "./providers/scripted-provider.js";
import {
  parseSkillSelectionEnvelope,
  resolveAdditionalSkills
} from "./skill-selection.js";
import {
  createDeterministicWorkflowPlan
} from "./deterministic-workflow.js";
import {
  acceptProcessPleadingStart,
  createProcessPleadingState
} from "./process-pleading-state.js";
import {
  requireProcessExecutionPermit
} from "./process-pleading-execution-gate.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(here, "../../..");
const lexRoot = path.resolve(
  process.env.LEX_SKILLS_PATH ??
    path.join(repositoryRoot, "Wersja rozwojowa rozpakowana")
);

const registry = new LexSkillRegistry(lexRoot);
const declarationIssues = [...registry.scan(), ...registry.validateDeclarations()];
const matrix = validateSkillContractMatrix(registry);

const routeResults: Array<{
  skill: string;
  pass: boolean;
  finalGate?: string;
  error?: string;
}> = [];

if (declarationIssues.length === 0 && matrix.result === "PASS") {
  const providers = new ProviderRegistry();
  providers.register(new ScriptedProviderAdapter({ id: "openai" }));
  const engine = new LexExecutionEngine(
    registry,
    new ProviderGateway(providers)
  );

  for (const skill of EXPECTED_DR_SKILLS) {
    try {
      const query =
        `G11 technical routing contract for ${skill}; no legal analysis.`;
      const envelope =
        parseSkillSelectionEnvelope(query);
      const selection =
        resolveAdditionalSkills(
          registry,
          envelope.query.trim(),
          skill,
          envelope.automatic,
          envelope.manualSkills
        );
      const workflow =
        createDeterministicWorkflowPlan(
          registry,
          selection.workflowExecutionSkill
        );

      let processWorkflowContext:
        | {
            stage:
              "W1" |
              "PRE_W2" |
              "W2" |
              "W3";
            checkpoint:
              import("./process-pleading-state.js")
                .ProcessPleadingCheckpoint;
            mode:
              import("./process-pleading-state.js")
                .ProcessPleadingMode;
          }
        | undefined;

      if (
        workflow.id ===
          "PROCESS_PLEADING_V1"
      ) {
        const state =
          acceptProcessPleadingStart(
            createProcessPleadingState(
              "case_" + "0".repeat(32),
              "CHECKPOINT",
              "2026-01-01T00:00:00.000Z"
            ),
            "2026-01-01T00:00:01.000Z"
          );
        const permit =
          requireProcessExecutionPermit(
            state
          );
        processWorkflowContext = {
          stage: permit.stage,
          checkpoint:
            permit.checkpoint,
          mode: permit.mode
        };
      }

      const result = await engine.executePolishLegalQuery({
        query,
        provider: "openai",
        model: "g11-contract-model",
        route: {
          jurisdiction: "PL",
          primarySkill: skill,
          mode: "PRAWNIK"
        },
        ...(processWorkflowContext
          ? {
              processWorkflowContext
            }
          : {})
      });
      const finalGate = result.events.at(-1)?.target;
      routeResults.push({
        skill,
        pass:
          result.primarySkill === skill &&
          finalGate === "G7_VERTICAL_SLICE",
        ...(finalGate ? { finalGate } : {})
      });
    } catch (error) {
      routeResults.push({
        skill,
        pass: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
}

const pass =
  declarationIssues.length === 0 &&
  matrix.result === "PASS" &&
  routeResults.length === EXPECTED_DR_SKILLS.length &&
  routeResults.every((entry) => entry.pass);

process.stdout.write(
  JSON.stringify(
    {
      gate: "G11_SKILL_CONTRACT_MATRIX",
      result: pass ? "PASS" : "BLOCKED",
      matrix,
      declarationIssues,
      routedDrSkills: routeResults
    },
    null,
    2
  ) + "\n"
);

if (!pass) process.exitCode = 1;
