import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startLocalServer } from "./http/server.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(here, "../../..");
process.env.LEX_SKILLS_PATH = path.join(
  repositoryRoot,
  "Wersja rozwojowa rozpakowana"
);

const dataRoot = fs.mkdtempSync(
  path.join(
    os.tmpdir(),
    "lex-g13-data-"
  )
);
process.env.LEX_DATA_DIR = dataRoot;

const server = await startLocalServer({
  host: "127.0.0.1",
  port: 0
});

let health: unknown;
let skills: unknown;
let routes: unknown;
let authStatus: unknown;

try {
  const base =
    `http://127.0.0.1:${server.port}`;

  const healthResponse =
    await fetch(`${base}/health`);
  const statusResponse =
    await fetch(
      `${base}/api/auth/status`
    );

  if (
    !healthResponse.ok ||
    !statusResponse.ok
  ) {
    throw new Error(
      "G13 public health/auth probes failed."
    );
  }

  health =
    await healthResponse.json();
  authStatus =
    await statusResponse.json();

  const bootstrapResponse =
    await fetch(
      `${base}/api/auth/bootstrap`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          loginName:
            "g13-validator",
          displayName:
            "G13 Validator",
          password:
            "G13 walidacyjne bardzo dlugie haslo 2026"
        })
      }
    );

  if (!bootstrapResponse.ok) {
    throw new Error(
      "G13 auth bootstrap failed."
    );
  }

  const bootstrap =
    (await bootstrapResponse.json())
      as {
        sessionToken?: string;
      };
  if (!bootstrap.sessionToken) {
    throw new Error(
      "G13 auth bootstrap returned no session."
    );
  }

  const authorization =
    `Bearer ${bootstrap.sessionToken}`;
  const [
    skillsResponse,
    routesResponse
  ] = await Promise.all([
    fetch(
      `${base}/api/skills`,
      {
        headers: {
          Authorization:
            authorization
        }
      }
    ),
    fetch(
      `${base}/api/routes`,
      {
        headers: {
          Authorization:
            authorization
        }
      }
    )
  ]);

  if (
    !skillsResponse.ok ||
    !routesResponse.ok
  ) {
    throw new Error(
      "One or more authenticated G13 HTTP probes failed."
    );
  }

  skills =
    await skillsResponse.json();
  routes =
    await routesResponse.json();
} finally {
  await server.close();
  fs.rmSync(
    dataRoot,
    {
      recursive: true,
      force: true
    }
  );
}

const skillRecord =
  typeof skills === "object" &&
  skills !== null
    ? skills as Record<
        string,
        unknown
      >
    : {};
const routeRecord =
  typeof routes === "object" &&
  routes !== null
    ? routes as Record<
        string,
        unknown
      >
    : {};
const healthRecord =
  typeof health === "object" &&
  health !== null
    ? health as Record<
        string,
        unknown
      >
    : {};
const authRecord =
  typeof authStatus === "object" &&
  authStatus !== null
    ? authStatus as Record<
        string,
        unknown
      >
    : {};

const skillList =
  Array.isArray(
    skillRecord.skills
  )
    ? skillRecord.skills
    : [];
const primarySkills =
  Array.isArray(
    routeRecord.primarySkills
  )
    ? routeRecord.primarySkills
    : [];

const serializedSkills =
  JSON.stringify(skills);
const pass =
  healthRecord.status === "ok" &&
  healthRecord.localOnly === true &&
  authRecord.initialized === false &&
  authRecord.requiresBootstrap ===
    true &&
  skillList.length >= 28 &&
  primarySkills.length === 16 &&
  !serializedSkills.includes(
    "# SKILL"
  ) &&
  !serializedSkills.includes(
    "PRAWO-HARDGATE"
  );

process.stdout.write(
  JSON.stringify(
    {
      gate:
        "G13_LOCAL_HTTP_API",
      result:
        pass
          ? "PASS"
          : "BLOCKED",
      host: server.host,
      ephemeralPort: true,
      health:
        healthRecord.status,
      authBoundaryPresent: true,
      publicSkillCount:
        skillList.length,
      drRouteCount:
        primarySkills.length,
      promptBodiesExposed: false
    },
    null,
    2
  ) + "\n"
);

if (!pass) {
  process.exitCode = 1;
}
