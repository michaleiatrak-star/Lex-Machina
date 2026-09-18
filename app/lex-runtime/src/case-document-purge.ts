import { rm } from "node:fs/promises";
import path from "node:path";

const CASE_ID = /^case_[a-f0-9]{32}$/;
const DOCUMENT_ID = /^doc_[a-f0-9]{24}$/;

export function documentIdFromSha256(
  sha256: string
): string {
  if (!/^[a-f0-9]{64}$/.test(sha256)) {
    throw new Error("DOCUMENT_SOURCE_SHA256_INVALID");
  }
  return `doc_${sha256.slice(0, 24)}`;
}

export async function purgeSecureCaseDocument(args: {
  rootDir: string;
  caseId: string;
  documentId: string;
}): Promise<void> {
  if (!CASE_ID.test(args.caseId)) {
    throw new Error("INVALID_CASE_ID");
  }
  if (!DOCUMENT_ID.test(args.documentId)) {
    throw new Error("INVALID_DOCUMENT_ID");
  }

  const caseRoot = path.resolve(
    args.rootDir,
    "cases",
    args.caseId
  );
  const documentsRoot = path.resolve(
    caseRoot,
    "secure",
    "documents"
  );
  const target = path.resolve(
    documentsRoot,
    args.documentId
  );
  if (!target.startsWith(documentsRoot + path.sep)) {
    throw new Error("DOCUMENT_PATH_ESCAPE");
  }

  await rm(target, {
    recursive: true,
    force: true
  });
}
