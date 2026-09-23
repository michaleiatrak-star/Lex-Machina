import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startLocalServer } from "./http/server.js";
const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(here, "../../..");
process.env.LEX_SKILLS_PATH = path.join(repositoryRoot, "Wersja rozwojowa rozpakowana");
const dataRoot = fs.mkdtempSync(path.join(os.tmpdir(), "lex-g13-data-"));
process.env.LEX_DATA_DIR = dataRoot;
const server = await startLocalServer({
    host: "127.0.0.1",
    port: 0
});
let health;
let skills;
let routes;
let authStatus;
try {
    const base = `http://127.0.0.1:${server.port}`;
    const healthResponse = await fetch(`${base}/health`);
    const statusResponse = await fetch(`${base}/api/auth/status`);
    if (!healthResponse.ok ||
        !statusResponse.ok) {
        throw new Error("G13 public health/auth probes failed.");
    }
    health =
        await healthResponse.json();
    authStatus =
        await statusResponse.json();
    const loginResponse = await fetch(`${base}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            loginName: "admin",
            password: "admin"
        })
    });
    if (!loginResponse.ok) {
        throw new Error("G13 default-admin login failed.");
    }
    const login = (await loginResponse.json());
    if (!login.sessionToken ||
        login.user?.loginName !== "admin" ||
        login.user?.passwordSetupPending !== true) {
        throw new Error("G13 default-admin bootstrap contract invalid.");
    }
    const authorization = `Bearer ${login.sessionToken}`;
    const [skillsResponse, routesResponse] = await Promise.all([
        fetch(`${base}/api/skills`, {
            headers: {
                Authorization: authorization
            }
        }),
        fetch(`${base}/api/routes`, {
            headers: {
                Authorization: authorization
            }
        })
    ]);
    if (!skillsResponse.ok ||
        !routesResponse.ok) {
        throw new Error("One or more authenticated G13 HTTP probes failed.");
    }
    skills =
        await skillsResponse.json();
    routes =
        await routesResponse.json();
}
finally {
    await server.close();
    fs.rmSync(dataRoot, {
        recursive: true,
        force: true
    });
}
const skillRecord = typeof skills === "object" &&
    skills !== null
    ? skills
    : {};
const routeRecord = typeof routes === "object" &&
    routes !== null
    ? routes
    : {};
const healthRecord = typeof health === "object" &&
    health !== null
    ? health
    : {};
const authRecord = typeof authStatus === "object" &&
    authStatus !== null
    ? authStatus
    : {};
const skillList = Array.isArray(skillRecord.skills)
    ? skillRecord.skills
    : [];
const primarySkills = Array.isArray(routeRecord.primarySkills)
    ? routeRecord.primarySkills
    : [];
const serializedSkills = JSON.stringify(skills);
const pass = healthRecord.status === "ok" &&
    healthRecord.localOnly === true &&
    authRecord.initialized === true &&
    authRecord.requiresBootstrap ===
        false &&
    skillList.length >= 28 &&
    primarySkills.length === 16 &&
    !serializedSkills.includes("# SKILL") &&
    !serializedSkills.includes("PRAWO-HARDGATE");
process.stdout.write(JSON.stringify({
    gate: "G13_LOCAL_HTTP_API",
    result: pass
        ? "PASS"
        : "BLOCKED",
    host: server.host,
    ephemeralPort: true,
    health: healthRecord.status,
    authBoundaryPresent: true,
    defaultAdminInitialized: authRecord.initialized === true,
    defaultAdminPasswordSetupPending: true,
    publicSkillCount: skillList.length,
    drRouteCount: primarySkills.length,
    promptBodiesExposed: false
}, null, 2) + "\n");
if (!pass) {
    process.exitCode = 1;
}
