import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import {
  afterEach,
  describe,
  expect,
  it
} from "vitest";
import {
  LocalAuthStore
} from "../src/auth/store.js";
import {
  LocalAuthService
} from "../src/auth/service.js";
import {
  AuthSessionManager
} from "../src/auth/session-manager.js";
import {
  LocalCaseFileStore
} from "../src/case-file-store.js";
import {
  SecureCaseUploadStore
} from "../src/case-secure-store.js";
import {
  LocalCaseAccessService
} from "../src/case-access.js";
import {
  createLexHttpApp
} from "../src/http/app.js";
import {
  LexSkillRegistry
} from "../src/registry.js";
import type {
  DocumentService,
  PublicDocumentReview,
  SupportedDocumentMediaType
} from "../src/document-service.js";

const roots: string[] = [];
const PASSWORD =
  "G31B2 owner bezpieczne haslo 2026";
const DR =
  "dr-02-prawo-cywilne-rodzinne-gospodarcze";

function crc32(data: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (
      let bit = 0;
      bit < 8;
      bit += 1
    ) {
      crc =
        (crc >>> 1) ^
        (
          (crc & 1)
            ? 0xedb88320
            : 0
        );
    }
  }
  return (
    crc ^ 0xffffffff
  ) >>> 0;
}

function storedZip(
  name: string,
  data: Buffer
): Buffer {
  const encoded =
    Buffer.from(name, "utf8");
  const checksum = crc32(data);
  const local = Buffer.alloc(30);
  local.writeUInt32LE(
    0x04034b50,
    0
  );
  local.writeUInt16LE(20, 4);
  local.writeUInt32LE(
    checksum,
    14
  );
  local.writeUInt32LE(
    data.length,
    18
  );
  local.writeUInt32LE(
    data.length,
    22
  );
  local.writeUInt16LE(
    encoded.length,
    26
  );

  const central =
    Buffer.alloc(46);
  central.writeUInt32LE(
    0x02014b50,
    0
  );
  central.writeUInt16LE(20, 4);
  central.writeUInt16LE(20, 6);
  central.writeUInt32LE(
    checksum,
    16
  );
  central.writeUInt32LE(
    data.length,
    20
  );
  central.writeUInt32LE(
    data.length,
    24
  );
  central.writeUInt16LE(
    encoded.length,
    28
  );
  central.writeUInt32LE(0, 42);

  const localBytes =
    Buffer.concat([
      local,
      encoded,
      data
    ]);
  const centralBytes =
    Buffer.concat([
      central,
      encoded
    ]);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(
    0x06054b50,
    0
  );
  end.writeUInt16LE(1, 8);
  end.writeUInt16LE(1, 10);
  end.writeUInt32LE(
    centralBytes.length,
    12
  );
  end.writeUInt32LE(
    localBytes.length,
    16
  );

  return Buffer.concat([
    localBytes,
    centralBytes,
    end
  ]);
}

function registry():
  LexSkillRegistry {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-g31b2-skills-"
      )
    );
  roots.push(root);
  for (
    const name
    of ["prawo-polskie-v2", DR]
  ) {
    const dir =
      path.join(root, name);
    fs.mkdirSync(
      dir,
      { recursive: true }
    );
    fs.writeFileSync(
      path.join(
        dir,
        "SKILL.md"
      ),
      `---\nname: ${name}\n---\n# test\n`
    );
  }
  fs.writeFileSync(
    path.join(
      root,
      "prawo-polskie-v2",
      "ROUTING-MAP.md"
    ),
    DR + "\n"
  );
  const value =
    new LexSkillRegistry(root);
  value.scan();
  return value;
}

class CaptureDocumentService
implements DocumentService {
  readonly reviewed:
    Array<{
      mediaType:
        SupportedDocumentMediaType;
      bytes: Buffer;
      caseId?: string;
    }> = [];

  async review(
    data: Uint8Array,
    mediaType:
      SupportedDocumentMediaType,
    security?: {
      caseId: string;
      caseDataKey?: Buffer;
      keyVersion?: number;
    }
  ): Promise<PublicDocumentReview> {
    this.reviewed.push({
      mediaType,
      bytes:
        Buffer.from(data),
      ...(security?.caseId
        ? {
            caseId:
              security.caseId
          }
        : {})
    });
    const index =
      this.reviewed.length;
    return {
      documentId:
        "doc_" +
        index
          .toString(16)
          .padStart(24, "0"),
      mediaType,
      complete: true,
      totalPages: 1,
      pages: [
        {
          page: 1,
          text:
            "Tekst testowy",
          source:
            "DIGITAL"
        }
      ],
      suggestions: []
    };
  }

  async ingestPdf(): Promise<never> {
    throw new Error(
      "NOT_USED"
    );
  }

  async ingestImage(): Promise<never> {
    throw new Error(
      "NOT_USED"
    );
  }

  async finalizeReview():
    Promise<never> {
    throw new Error(
      "NOT_USED"
    );
  }

  async resolveProtectedChunks():
    Promise<never> {
    throw new Error(
      "NOT_USED"
    );
  }
}

async function fixture() {
  const root =
    fs.mkdtempSync(
      path.join(
        os.tmpdir(),
        "lex-g31b2-data-"
      )
    );
  roots.push(root);
  const authStore =
    new LocalAuthStore({
      rootDir: root
    });
  const auth =
    new LocalAuthService(
      authStore,
      {
        sessionManager:
          new AuthSessionManager({
            scheduleExpiryTimers:
              false
          }),
        kdf: {
          memoryKiB: 1024,
          iterations: 1,
          parallelism: 1,
          keyLength: 32,
          version: 1
        }
      }
    );
  const files =
    new LocalCaseFileStore({
      rootDir: root
    });
  const cases =
    new LocalCaseAccessService(
      authStore,
      auth,
      files
    );
  const secure =
    new SecureCaseUploadStore({
      rootDir: root
    });
  const documents =
    new CaptureDocumentService();
  const login =
    await auth.bootstrap({
      loginName:
        "owner",
      displayName:
        "Owner",
      password:
        PASSWORD
    });
  const context = {
    user: login.user,
    session: login.session
  };
  const localCase =
    await cases.createCase(
      context,
      "G31B2"
    );
  const app =
    createLexHttpApp({
      registry: registry(),
      modelCatalog: {
        list:
          async () => []
      },
      authService: auth,
      caseFileStore: files,
      secureCaseUploadStore:
        secure,
      caseAccessService: cases,
      documentService:
        documents
    });
  return {
    root,
    authStore,
    auth,
    cases,
    secure,
    documents,
    context,
    localCase,
    token:
      login.sessionToken,
    app
  };
}

afterEach(() => {
  while (roots.length) {
    fs.rmSync(
      roots.pop()!,
      {
        recursive: true,
        force: true
      }
    );
  }
});

describe(
  "G31B2 stored file processing HTTP",
  () => {
    it(
      "processes an encrypted direct PDF without browser re-upload",
      async () => {
        const current =
          await fixture();
        const clear =
          Buffer.from(
            "%PDF-1.7\nG31B2 direct"
          );
        const stored =
          await current.cases
            .withCaseDataKey(
              current.context,
              current.localCase
                .caseId,
              "WRITE",
              async (caseDataKey) =>
                await current.secure
                  .saveUpload({
                    caseId:
                      current.localCase
                        .caseId,
                    filename:
                      "akta.pdf",
                    mediaType:
                      "application/pdf",
                    data: clear,
                    caseDataKey,
                    keyVersion:
                      current.localCase
                        .keyVersion
                  })
            );

        const response =
          await request(
            current.app
          )
            .post(
              `/api/cases/${current.localCase.caseId}/files/${stored.uploadId}/process`
            )
            .set(
              "Authorization",
              `Bearer ${current.token}`
            )
            .send({})
            .expect(201);

        expect(
          response.body
            .uploadId
        ).toBe(
          stored.uploadId
        );
        expect(
          response.body
            .documentId
        ).toMatch(
          /^doc_[a-f0-9]{24}$/
        );
        expect(
          current.documents
            .reviewed
        ).toHaveLength(1);
        expect(
          current.documents
            .reviewed[0]
            ?.bytes
            .equals(clear)
        ).toBe(true);
        expect(
          JSON.stringify(
            response.body
          )
        ).not.toContain(
          "G31B2 direct"
        );

        current.auth.close();
        clear.fill(0);
      }
    );

    it(
      "processes a ZIP member by opaque fileId and rejects a mismatched signature",
      async () => {
        const current =
          await fixture();
        const member =
          Buffer.from(
            "%PDF-1.7\nG31B2 member"
          );
        const zip =
          storedZip(
            "dowody/czesc.pdf",
            member
          );
        const storedZipUpload =
          await current.cases
            .withCaseDataKey(
              current.context,
              current.localCase
                .caseId,
              "WRITE",
              async (caseDataKey) =>
                await current.secure
                  .saveUpload({
                    caseId:
                      current.localCase
                        .caseId,
                    filename:
                      "dowody.zip",
                    mediaType:
                      "application/zip",
                    data: zip,
                    caseDataKey,
                    keyVersion:
                      current.localCase
                        .keyVersion
                  })
            );
        const fileId =
          storedZipUpload
            .extracted[0]
            ?.fileId;
        expect(fileId).toMatch(
          /^file_[a-f0-9]{32}$/
        );

        const response =
          await request(
            current.app
          )
            .post(
              `/api/cases/${current.localCase.caseId}/files/${storedZipUpload.uploadId}/members/${fileId}/process`
            )
            .set(
              "Authorization",
              `Bearer ${current.token}`
            )
            .send({})
            .expect(201);

        expect(
          response.body.fileId
        ).toBe(fileId);
        expect(
          current.documents
            .reviewed.at(-1)
            ?.bytes
            .equals(member)
        ).toBe(true);

        const fakePdf =
          Buffer.from(
            "NOT-A-PDF"
          );
        const bad =
          await current.cases
            .withCaseDataKey(
              current.context,
              current.localCase
                .caseId,
              "WRITE",
              async (caseDataKey) =>
                await current.secure
                  .saveUpload({
                    caseId:
                      current.localCase
                        .caseId,
                    filename:
                      "zly.pdf",
                    mediaType:
                      "application/pdf",
                    data:
                      fakePdf,
                    caseDataKey,
                    keyVersion:
                      current.localCase
                        .keyVersion
                  })
            );

        await request(
          current.app
        )
          .post(
            `/api/cases/${current.localCase.caseId}/files/${bad.uploadId}/process`
          )
          .set(
            "Authorization",
            `Bearer ${current.token}`
          )
          .send({})
          .expect(422);

        expect(
          current.documents
            .reviewed
        ).toHaveLength(1);

        current.auth.close();
        zip.fill(0);
        member.fill(0);
        fakePdf.fill(0);
      }
    );
  }
);
