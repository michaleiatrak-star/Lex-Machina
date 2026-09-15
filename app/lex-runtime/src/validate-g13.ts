import path from "node:path";
import { fileURLToPath } from "node:url";
import { startLocalServer } from "./http/server.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(here, "../../..");
process.env.LEX_SKILLS_PATH = path.join(
  repositoryRoot,
  "Wersja rozwojowa rozpakowana"
);

const server = await startLocalServer({
  host: "127.0.0.1",
  port: 0
});

let health: unknown;
let skills: unknown;
let routes: unknown;

try {
  const base = `http://127.0.0.1:${server.port}`;
  const [healthResponse, skillsResponse, routesResponse] =
    await Promise.all([
      fetch(`${base}/health`),
      fetch(`${base}/api/skills`),
      fetch(`${base}/api/routes`)
    ]);

  if (
    !healthResponse.ok ||
    !skillsResponse.ok ||
    !routesResponse.ok
  ) {
    throw new Error("One or more G13 HTTP probes failed.");
  }

  health = await healthResponse.json();
  skills = await skillsResponse.json();
  routes = await routesResponse.json();
} finally {
  await server.close();
}

const skillRecord =
  typeof skills === "object" && skills !== null
    ? (skills as Record<string, unknown>)
    : {};
const routeRecord =
  typeof routes === "object" && routes !== null
    ? (routes as Record<string, unknown>)
    : {};
const healthRecord =
  typeof health === "object" && health !== null
    ? (health as Record<string, unknown>)
    : {};

const skillList = Array.isArray(skillRecord.skills)
  ? skillRecord.skills
  : [];
const primarySkills = Array.isArray(routeRecord.primarySkills)
  ? routeRecord.primarySkills
  : [];

const serializedSkills = JSON.stringify(skills);
const pass =
  healthRecord.status === "ok" &&
  healthRecord.localOnly === true &&
  skillList.length >= 28 &&
  primarySkills.length === 16 &&
  !serializedSkills.includes("# SKILL") &&
  !serializedSkills.includes("PRAWO-HARDGATE");

process.stdout.write(
  JSON.stringify(
    {
      gate: "G13_LOCAL_HTTP_API",
      result: pass ? "PASS" : "BLOCKED",
      host: server.host,
      ephemeralPort: true,
      health: healthRecord.status,
      publicSkillCount: skillList.length,
      drRouteCount: primarySkills.length,
      promptBodiesExposed: false
    },
    null,
    2
  ) + "\n"
);

if (!pass) process.exitCode = 1;
