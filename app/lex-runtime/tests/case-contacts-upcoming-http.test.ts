import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createLexHttpApp } from "../src/http/app.js";
import { LexSkillRegistry } from "../src/registry.js";
import { LocalAuthStore } from "../src/auth/store.js";
import { LocalAuthService } from "../src/auth/service.js";
import { AuthSessionManager } from "../src/auth/session-manager.js";
import { LocalCaseFileStore } from "../src/case-file-store.js";
import { LocalCaseAccessService } from "../src/case-access.js";
import { EncryptedCaseScheduleStore } from "../src/case-schedule-store.js";

const roots: string[] = [];

function tempDir(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  roots.push(root);
  return root;
}

function fixture() {
  const skills = tempDir("lex-contacts-skills-");
  fs.mkdirSync(path.join(skills, "prawo-polskie-v2"), { recursive: true });
  fs.writeFileSync(
    path.join(skills, "prawo-polskie-v2", "SKILL.md"),
    "---\nname: prawo-polskie-v2\n---\n# test\n"
  );
  const registry = new LexSkillRegistry(skills);
  registry.scan();
  const root = tempDir("lex-contacts-data-");
  const store = new LocalAuthStore({ rootDir: root });
  const auth = new LocalAuthService(store, {
    sessionManager: new AuthSessionManager({ scheduleExpiryTimers: false }),
    kdf: { memoryKiB: 1024, iterations: 1, parallelism: 1, keyLength: 32, version: 1 }
  });
  const files = new LocalCaseFileStore({ rootDir: root });
  const cases = new LocalCaseAccessService(
    store,
    auth,
    files,
    undefined,
    new EncryptedCaseScheduleStore({ rootDir: root })
  );
  const app = createLexHttpApp({
    registry,
    modelCatalog: { list: vi.fn(async () => []) },
    authService: auth,
    caseFileStore: files,
    caseAccessService: cases,
    caseScheduleService: cases
  });
  return { app, auth };
}

afterEach(() => {
  while (roots.length) {
    fs.rmSync(roots.pop()!, { recursive: true, force: true });
  }
});

describe("case contacts and upcoming events", () => {
  it("lists upcoming events across cases and stores case contacts", async () => {
    const current = fixture();
    const bootstrap = await request(current.app)
      .post("/api/auth/bootstrap")
      .send({
        loginName: "owner",
        displayName: "Owner",
        password: "Owner http bezpieczne haslo 2026"
      })
      .expect(201);
    const auth = { Authorization: `Bearer ${String(bootstrap.body.sessionToken)}` };

    const first = await request(current.app)
      .post("/api/cases").set(auth).send({ displayName: "Sprawa A" }).expect(201);
    const second = await request(current.app)
      .post("/api/cases").set(auth).send({ displayName: "Sprawa B" }).expect(201);
    const firstId = String(first.body.caseId);
    const secondId = String(second.body.caseId);

    const add = (caseId: string, title: string, startsAt: string) =>
      request(current.app)
        .post(`/api/cases/${caseId}/schedule`)
        .set(auth)
        .send({ kind: "DEADLINE", title, startsAt })
        .expect(201);
    await add(firstId, "Przeszle", "2020-01-01T10:00");
    await add(firstId, "Pozniej", "2099-02-01T10:00");
    await add(secondId, "Wczesniej", "2099-01-01T10:00");

    const upcoming = await request(current.app)
      .get("/api/schedule/upcoming").set(auth).expect(200);
    expect(
      upcoming.body.events.map((event: { title: string; caseDisplayName?: string }) =>
        [event.title, event.caseDisplayName])
    ).toEqual([
      ["Wczesniej", "Sprawa B"],
      ["Pozniej", "Sprawa A"]
    ]);

    const limited = await request(current.app)
      .get("/api/schedule/upcoming?limit=1").set(auth).expect(200);
    expect(limited.body.events).toHaveLength(1);

    await request(current.app)
      .post(`/api/cases/${firstId}/contacts`)
      .set(auth)
      .send({ kind: "PERSON", name: "Jan", email: "nie-email" })
      .expect(400);
    const contact = await request(current.app)
      .post(`/api/cases/${firstId}/contacts`)
      .set(auth)
      .send({
        kind: "ORGANIZATION",
        name: "Biegly rewident",
        role: "biegly",
        phone: "+48 600 100 200",
        email: "biuro@example.pl"
      })
      .expect(201);
    expect(contact.body.contactId).toMatch(/^casecontact_[a-f0-9]{32}$/);

    const listed = await request(current.app)
      .get(`/api/cases/${firstId}/contacts`).set(auth).expect(200);
    expect(listed.body.contacts).toEqual([contact.body]);

    // Contacts do not disturb the schedule of the same case.
    const schedule = await request(current.app)
      .get(`/api/cases/${firstId}/schedule`).set(auth).expect(200);
    expect(schedule.body.events).toHaveLength(2);

    await request(current.app)
      .delete(`/api/cases/${firstId}/contacts/${String(contact.body.contactId)}`)
      .set(auth)
      .expect(200);
    await request(current.app)
      .delete(`/api/cases/${firstId}/contacts/${String(contact.body.contactId)}`)
      .set(auth)
      .expect(404, { error: "CASE_CONTACT_NOT_FOUND" });

    current.auth.close();
  });
});
