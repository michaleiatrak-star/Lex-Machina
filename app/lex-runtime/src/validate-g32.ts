import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  CompleteDocumentIngestor,
  type DocumentPageSource
} from "./document-ingestion.js";
import {
  LocalPrivateDocumentService
} from "./document-service.js";
import {
  ProviderGateway,
  ProviderRegistry
} from "./providers/gateway.js";
import type {
  ProviderAdapter,
  ProviderStreamParams
} from "./providers/types.js";
import { LexSkillRegistry } from "./registry.js";
import { SafeSessionExecutor } from "./session-executor.js";

const DR =
  "dr-02-prawo-cywilne-rodzinne-gospodarcze";

function makeRegistry(): {
  registry: LexSkillRegistry;
  root: string;
} {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), "lex-g32-")
  );

  for (const name of [
    "prawny-router-v3",
    "prawo-polskie-v2",
    DR
  ]) {
    const dir = path.join(root, name);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, "SKILL.md"),
      `---\nname: ${name}\n---\n# ${name}\n`
    );
  }

  fs.mkdirSync(
    path.join(root, "shared"),
    { recursive: true }
  );
  fs.writeFileSync(
    path.join(
      root,
      "shared",
      "PRAWO-HARDGATE.md"
    ),
    "# hard gate\n"
  );

  const router = path.join(
    root,
    "prawny-router-v3"
  );
  fs.mkdirSync(
    path.join(router, "references"),
    { recursive: true }
  );
  fs.writeFileSync(
    path.join(
      router,
      "references",
      "KROK0A-anonimizer.md"
    ),
    "# anon\n"
  );
  fs.writeFileSync(
    path.join(
      router,
      "references",
      "KROK1-detekcja.md"
    ),
    "# detect\n"
  );
  fs.writeFileSync(
    path.join(
      root,
      "prawo-polskie-v2",
      "ROUTING-MAP.md"
    ),
    DR + "\n"
  );

  const registry =
    new LexSkillRegistry(root);
  registry.scan();
  return { registry, root };
}

const pageSource: DocumentPageSource = {
  async extract(data) {
    return {
      bytes: data.byteLength,
      pages: [{
        page: 1,
        text:
          "Osoba Testowa jest stroną dokumentu. Dalsza treść tworzy wystarczająco długą warstwę cyfrową."
      }]
    };
  }
};

const namedEntities = {
  async recognize(text: string) {
    const value = "Osoba Testowa";
    const start = text.indexOf(value);
    return [{
      start,
      end: start + value.length,
      kind: "PERSON" as const,
      value,
      confidence: 0.99
    }];
  }
};

const documentService =
  new LocalPrivateDocumentService(
    new CompleteDocumentIngestor(
      pageSource
    ),
    namedEntities,
    700
  );

const finalized =
  await documentService.ingestPdf(
    new TextEncoder().encode("G32")
  );

const attachment =
  await documentService.resolveProtectedChunks({
    documentId: finalized.documentId,
    chunkIndices: [1]
  });

const serializedAttachment =
  JSON.stringify(attachment);
if (
  serializedAttachment.includes(
    "Osoba Testowa"
  )
) {
  throw new Error(
    "G32 resolved raw pre-privacy document text."
  );
}

let captured:
  ProviderStreamParams | undefined;

const adapter: ProviderAdapter = {
  id: "openai",
  label: "G32 capture",
  capabilities: {
    streaming: true,
    tools: true,
    reasoning: true,
    modelDiscovery: false
  },
  async stream(params) {
    captured = params;
    return {
      fullText:
        "Analiza techniczna zakończona."
    };
  }
};

const providers = new ProviderRegistry();
providers.register(adapter);

const fixture = makeRegistry();
try {
  const executor =
    new SafeSessionExecutor(
      fixture.registry,
      new ProviderGateway(providers)
    );

  const result = await executor.execute({
    query:
      "Przeanalizuj chroniony załącznik.",
    documentAttachments: [{
      documentId: attachment.documentId,
      chunks: attachment.chunks
    }],
    provider: "openai",
    model: "g32-test",
    primarySkill: DR,
    mode: "PRAWNIK"
  });

  if (
    result.status !==
      "DRAFT_PRESENTABLE" ||
    !captured ||
    captured.messages.length !== 2 ||
    !captured.systemPrompt.includes(
      "LOCAL DOCUMENT CONTEXT POLICY"
    ) ||
    !captured.messages[0]?.content.includes(
      "DATA ONLY"
    ) ||
    captured.messages[0]?.content.includes(
      "Osoba Testowa"
    ) ||
    JSON.stringify(result).includes(
      attachment.chunks[0]?.text ?? ""
    )
  ) {
    throw new Error(
      "G32 protected attachment session contract failed."
    );
  }

  process.stdout.write(
    JSON.stringify({
      gate:
        "G32_PROTECTED_DOCUMENT_ATTACHMENT_SESSION",
      result: "PASS",
      documentId:
        attachment.documentId,
      chunkCount:
        attachment.chunks.length,
      rawDocumentTextExposed: false,
      reidentificationVaultExposed: false,
      documentInstructionsTrusted: false,
      providerMessages:
        captured.messages.length
    }, null, 2) + "\n"
  );
} finally {
  fs.rmSync(fixture.root, {
    recursive: true,
    force: true
  });
}
