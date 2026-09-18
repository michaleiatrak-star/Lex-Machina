import {
  createCipheriv,
  createDecipheriv,
  hkdfSync,
  randomBytes
} from "node:crypto";
import {
  mkdir,
  readFile,
  rename,
  rm,
  writeFile
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  validateProcessPleadingState,
  type ProcessPleadingState
} from "./process-pleading-state.js";
import {
  validateCourtAnalysisState,
  type CourtAnalysisState
} from "./court-analysis-state.js";
import {
  validateChronologyState,
  type ChronologyState
} from "./chronology-state.js";

export type WorkspaceFolder = {
  folderId: string;
  parentId: string | null;
  name: string;
  createdAt: string;
};

export type WorkspaceDocumentCitation = {
  citationId: string;
  marker: string;
  label: string;
  caseId?: string;
  documentId: string;
  chunkIndex: number;
  pageStart: number;
  pageEnd: number;
  contextText: string;
  quote?: string;
  highlightStart?: number;
  highlightEnd?: number;
};

export type WorkspaceThreadMessage = {
  messageId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  meta?: string;
  documentCitations?: WorkspaceDocumentCitation[];
};

export type CaseWorkspaceIndex = {
  schemaVersion: 1;
  caseId: string;
  updatedAt: string;
  folders: WorkspaceFolder[];
  itemLocations: Record<string, string | null>;
  thread: {
    messages: WorkspaceThreadMessage[];
  };
  workflows?: {
    processPleading?: ProcessPleadingState;
    courtAnalysis?: CourtAnalysisState;
    chronology?: ChronologyState;
  };
};

type EncryptedWorkspaceEnvelope = {
  schemaVersion: 1;
  keyVersion: number;
  nonce: string;
  tag: string;
  ciphertext: string;
};

export type CaseWorkspaceStoreOptions = {
  rootDir?: string;
  maxIndexBytes?: number;
  maxMessages?: number;
};

const CASE_ID = /^case_[a-f0-9]{32}$/;
const FOLDER_ID = /^folder_[a-f0-9]{32}$/;
const ITEM_ID = /^(?:upload|template)_[a-f0-9]{32}$/;
const DOCUMENT_ID = /^[a-z][a-z0-9-]*_[a-f0-9]{16,64}$/;
const MESSAGE_ID = /^[a-z][a-z0-9-]*_[a-f0-9]{16,64}$/;

function defaultRootDir(): string {
  return path.resolve(
    process.env.LEX_DATA_DIR ??
      path.join(os.homedir(), ".lex-machina", "data")
  );
}

function cleanFolderName(value: string): string {
  const name = value
    .normalize("NFKC")
    .replace(/[\x00-\x1f\x7f]/g, "")
    .trim();
  if (
    !name ||
    name === "." ||
    name === ".." ||
    name.includes("/") ||
    name.includes("\\") ||
    name.length > 120
  ) {
    throw new Error("WORKSPACE_FOLDER_NAME_INVALID");
  }
  return name;
}

function safeMessage(input: WorkspaceThreadMessage): WorkspaceThreadMessage {
  if (
    !MESSAGE_ID.test(input.messageId) ||
    !["user", "assistant", "system"].includes(input.role) ||
    typeof input.content !== "string" ||
    input.content.length > 80_000 ||
    !input.content.trim() ||
    typeof input.createdAt !== "string" ||
    input.createdAt.length > 64 ||
    (input.meta !== undefined &&
      (typeof input.meta !== "string" || input.meta.length > 8_000))
  ) {
    throw new Error("WORKSPACE_THREAD_MESSAGE_INVALID");
  }

  const citations = (input.documentCitations ?? []).slice(0, 64).map((citation) => {
    if (
      typeof citation.citationId !== "string" ||
      citation.citationId.length > 96 ||
      typeof citation.marker !== "string" ||
      citation.marker.length > 160 ||
      typeof citation.label !== "string" ||
      citation.label.length > 160 ||
      !DOCUMENT_ID.test(citation.documentId) ||
      !Number.isInteger(citation.chunkIndex) ||
      citation.chunkIndex < 0 ||
      !Number.isInteger(citation.pageStart) ||
      citation.pageStart < 1 ||
      !Number.isInteger(citation.pageEnd) ||
      citation.pageEnd < citation.pageStart ||
      typeof citation.contextText !== "string" ||
      citation.contextText.length > 40_000 ||
      (citation.caseId !== undefined && !CASE_ID.test(citation.caseId)) ||
      (citation.quote !== undefined && citation.quote.length > 4_000) ||
      (citation.highlightStart !== undefined &&
        (!Number.isInteger(citation.highlightStart) || citation.highlightStart < 0)) ||
      (citation.highlightEnd !== undefined &&
        (!Number.isInteger(citation.highlightEnd) ||
          citation.highlightEnd < 0 ||
          citation.highlightEnd > citation.contextText.length)) ||
      (citation.highlightStart !== undefined &&
        citation.highlightEnd !== undefined &&
        citation.highlightEnd < citation.highlightStart)
    ) {
      throw new Error("WORKSPACE_DOCUMENT_CITATION_INVALID");
    }
    return { ...citation };
  });

  return {
    ...input,
    ...(citations.length > 0 ? { documentCitations: citations } : {})
  };
}

export class EncryptedCaseWorkspaceStore {
  readonly rootDir: string;
  private readonly maxIndexBytes: number;
  private readonly maxMessages: number;

  constructor(options: CaseWorkspaceStoreOptions = {}) {
    this.rootDir = path.resolve(options.rootDir ?? defaultRootDir());
    this.maxIndexBytes = options.maxIndexBytes ?? 12 * 1024 * 1024;
    this.maxMessages = options.maxMessages ?? 250;
  }

  private workspaceFile(caseId: string): string {
    if (!CASE_ID.test(caseId)) {
      throw new Error("INVALID_CASE_ID");
    }
    const target = path.resolve(
      this.rootDir,
      "cases",
      caseId,
      "secure",
      "workspace",
      "index.lmw1"
    );
    const base = path.resolve(this.rootDir, "cases", caseId) + path.sep;
    if (!target.startsWith(base)) {
      throw new Error("CASE_PATH_ESCAPE");
    }
    return target;
  }

  private deriveKey(caseDataKey: Buffer, caseId: string): Buffer {
    if (caseDataKey.byteLength !== 32 || !CASE_ID.test(caseId)) {
      throw new Error("INVALID_CASE_DATA_KEY");
    }
    return Buffer.from(
      hkdfSync(
        "sha256",
        caseDataKey,
        Buffer.from(caseId, "utf8"),
        Buffer.from("lex/case-workspace-index/v1", "utf8"),
        32
      )
    );
  }

  private empty(caseId: string): CaseWorkspaceIndex {
    return {
      schemaVersion: 1,
      caseId,
      updatedAt: new Date().toISOString(),
      folders: [],
      itemLocations: {},
      thread: { messages: [] },
      workflows: {}
    };
  }

  private validateIndex(index: CaseWorkspaceIndex, caseId: string): void {
    if (
      index.schemaVersion !== 1 ||
      index.caseId !== caseId ||
      !Array.isArray(index.folders) ||
      !index.itemLocations ||
      typeof index.itemLocations !== "object" ||
      !Array.isArray(index.thread?.messages)
    ) {
      throw new Error("WORKSPACE_INDEX_INVALID");
    }

    const folders = new Set<string>();
    for (const folder of index.folders) {
      if (
        !FOLDER_ID.test(folder.folderId) ||
        folders.has(folder.folderId) ||
        (folder.parentId !== null && !FOLDER_ID.test(folder.parentId))
      ) {
        throw new Error("WORKSPACE_INDEX_INVALID");
      }
      cleanFolderName(folder.name);
      folders.add(folder.folderId);
    }
    for (const folder of index.folders) {
      if (folder.parentId !== null && !folders.has(folder.parentId)) {
        throw new Error("WORKSPACE_INDEX_INVALID");
      }
    }
    for (const [itemId, folderId] of Object.entries(index.itemLocations)) {
      if (
        !ITEM_ID.test(itemId) ||
        (folderId !== null && !folders.has(folderId))
      ) {
        throw new Error("WORKSPACE_INDEX_INVALID");
      }
    }
    if (index.thread.messages.length > this.maxMessages) {
      throw new Error("WORKSPACE_INDEX_INVALID");
    }
    index.thread.messages.forEach(safeMessage);

    if (index.workflows !== undefined) {
      if (
        !index.workflows ||
        typeof index.workflows !== "object" ||
        Array.isArray(index.workflows)
      ) {
        throw new Error("WORKSPACE_INDEX_INVALID");
      }
      if (index.workflows.processPleading) {
        const workflow =
          validateProcessPleadingState(
            index.workflows.processPleading
          );
        if (workflow.caseId !== caseId) {
          throw new Error("WORKSPACE_INDEX_INVALID");
        }
      }
      if (index.workflows.courtAnalysis) {
        const workflow =
          validateCourtAnalysisState(
            index.workflows.courtAnalysis
          );
        if (workflow.caseId !== caseId) {
          throw new Error("WORKSPACE_INDEX_INVALID");
        }
      }
      if (index.workflows.chronology) {
        const workflow =
          validateChronologyState(
            index.workflows.chronology
          );
        if (workflow.caseId !== caseId) {
          throw new Error("WORKSPACE_INDEX_INVALID");
        }
      }
    }
  }

  private async read(
    caseId: string,
    caseDataKey: Buffer,
    keyVersion: number
  ): Promise<CaseWorkspaceIndex> {
    const target = this.workspaceFile(caseId);
    let encoded: string;
    try {
      encoded = await readFile(target, "utf8");
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") {
        return this.empty(caseId);
      }
      throw error;
    }
    if (Buffer.byteLength(encoded, "utf8") > this.maxIndexBytes * 2) {
      throw new Error("WORKSPACE_INDEX_TOO_LARGE");
    }

    const envelope = JSON.parse(encoded) as EncryptedWorkspaceEnvelope;
    if (
      envelope.schemaVersion !== 1 ||
      envelope.keyVersion !== keyVersion ||
      typeof envelope.nonce !== "string" ||
      typeof envelope.tag !== "string" ||
      typeof envelope.ciphertext !== "string"
    ) {
      throw new Error("WORKSPACE_ENVELOPE_INVALID");
    }

    const nonce = Buffer.from(envelope.nonce, "base64url");
    const tag = Buffer.from(envelope.tag, "base64url");
    const ciphertext = Buffer.from(envelope.ciphertext, "base64url");
    if (nonce.length !== 12 || tag.length !== 16 || ciphertext.length > this.maxIndexBytes) {
      throw new Error("WORKSPACE_ENVELOPE_INVALID");
    }

    const key = this.deriveKey(caseDataKey, caseId);
    try {
      const decipher = createDecipheriv("aes-256-gcm", key, nonce);
      decipher.setAAD(
        Buffer.from(`LMW1:${caseId}:${keyVersion}`, "utf8")
      );
      decipher.setAuthTag(tag);
      const plain = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final()
      ]);
      if (plain.length > this.maxIndexBytes) {
        plain.fill(0);
        throw new Error("WORKSPACE_INDEX_TOO_LARGE");
      }
      try {
        const index = JSON.parse(plain.toString("utf8")) as CaseWorkspaceIndex;
        this.validateIndex(index, caseId);
        return index;
      } finally {
        plain.fill(0);
      }
    } catch (error) {
      if (
        error instanceof Error &&
        ["WORKSPACE_INDEX_INVALID", "WORKSPACE_INDEX_TOO_LARGE"].includes(error.message)
      ) {
        throw error;
      }
      throw new Error("WORKSPACE_DECRYPT_FAILED");
    } finally {
      key.fill(0);
      nonce.fill(0);
      tag.fill(0);
      ciphertext.fill(0);
    }
  }

  private async write(
    index: CaseWorkspaceIndex,
    caseDataKey: Buffer,
    keyVersion: number
  ): Promise<void> {
    this.validateIndex(index, index.caseId);
    index.updatedAt = new Date().toISOString();
    const plain = Buffer.from(JSON.stringify(index), "utf8");
    if (plain.length > this.maxIndexBytes) {
      plain.fill(0);
      throw new Error("WORKSPACE_INDEX_TOO_LARGE");
    }
    const nonce = randomBytes(12);
    const key = this.deriveKey(caseDataKey, index.caseId);
    try {
      const cipher = createCipheriv("aes-256-gcm", key, nonce);
      cipher.setAAD(
        Buffer.from(`LMW1:${index.caseId}:${keyVersion}`, "utf8")
      );
      const ciphertext = Buffer.concat([
        cipher.update(plain),
        cipher.final()
      ]);
      const envelope: EncryptedWorkspaceEnvelope = {
        schemaVersion: 1,
        keyVersion,
        nonce: nonce.toString("base64url"),
        tag: cipher.getAuthTag().toString("base64url"),
        ciphertext: ciphertext.toString("base64url")
      };
      const target = this.workspaceFile(index.caseId);
      await mkdir(path.dirname(target), { recursive: true, mode: 0o700 });
      const partial = target + ".partial";
      await rm(partial, { force: true });
      await writeFile(partial, JSON.stringify(envelope), {
        encoding: "utf8",
        flag: "wx",
        mode: 0o600
      });
      await rename(partial, target);
      ciphertext.fill(0);
    } finally {
      plain.fill(0);
      nonce.fill(0);
      key.fill(0);
    }
  }

  async listWorkspace(args: {
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
    itemIds: readonly string[];
  }): Promise<CaseWorkspaceIndex> {
    const index = await this.read(args.caseId, args.caseDataKey, args.keyVersion);
    const validItems = new Set(args.itemIds.filter((item) => ITEM_ID.test(item)));
    let changed = false;

    for (const itemId of validItems) {
      if (!(itemId in index.itemLocations)) {
        index.itemLocations[itemId] = null;
        changed = true;
      }
    }
    for (const itemId of Object.keys(index.itemLocations)) {
      if (!validItems.has(itemId)) {
        delete index.itemLocations[itemId];
        changed = true;
      }
    }
    if (changed) {
      await this.write(index, args.caseDataKey, args.keyVersion);
    }
    return index;
  }

  async createFolder(args: {
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
    name: string;
    parentId?: string | null;
  }): Promise<WorkspaceFolder> {
    const index = await this.read(args.caseId, args.caseDataKey, args.keyVersion);
    const parentId = args.parentId ?? null;
    if (parentId !== null && !index.folders.some((item) => item.folderId === parentId)) {
      throw new Error("WORKSPACE_PARENT_FOLDER_NOT_FOUND");
    }
    const folder: WorkspaceFolder = {
      folderId: "folder_" + randomBytes(16).toString("hex"),
      parentId,
      name: cleanFolderName(args.name),
      createdAt: new Date().toISOString()
    };
    index.folders.push(folder);
    await this.write(index, args.caseDataKey, args.keyVersion);
    return folder;
  }

  async deleteFolder(args: {
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
    folderId: string;
  }): Promise<void> {
    if (!FOLDER_ID.test(args.folderId)) {
      throw new Error("WORKSPACE_FOLDER_ID_INVALID");
    }
    const index = await this.read(args.caseId, args.caseDataKey, args.keyVersion);
    if (!index.folders.some((item) => item.folderId === args.folderId)) {
      throw new Error("WORKSPACE_FOLDER_NOT_FOUND");
    }
    if (
      index.folders.some((item) => item.parentId === args.folderId) ||
      Object.values(index.itemLocations).some((folderId) => folderId === args.folderId)
    ) {
      throw new Error("WORKSPACE_FOLDER_NOT_EMPTY");
    }
    index.folders = index.folders.filter((item) => item.folderId !== args.folderId);
    await this.write(index, args.caseDataKey, args.keyVersion);
  }

  async moveItem(args: {
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
    itemId: string;
    folderId: string | null;
    knownItemIds: readonly string[];
  }): Promise<void> {
    if (!ITEM_ID.test(args.itemId) || !args.knownItemIds.includes(args.itemId)) {
      throw new Error("WORKSPACE_ITEM_NOT_FOUND");
    }
    const index = await this.read(args.caseId, args.caseDataKey, args.keyVersion);
    if (
      args.folderId !== null &&
      !index.folders.some((item) => item.folderId === args.folderId)
    ) {
      throw new Error("WORKSPACE_FOLDER_NOT_FOUND");
    }
    index.itemLocations[args.itemId] = args.folderId;
    await this.write(index, args.caseDataKey, args.keyVersion);
  }

  async forgetItem(args: {
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
    itemId: string;
  }): Promise<void> {
    const index = await this.read(args.caseId, args.caseDataKey, args.keyVersion);
    if (args.itemId in index.itemLocations) {
      delete index.itemLocations[args.itemId];
      await this.write(index, args.caseDataKey, args.keyVersion);
    }
  }

  async loadThread(args: {
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
  }): Promise<WorkspaceThreadMessage[]> {
    const index = await this.read(args.caseId, args.caseDataKey, args.keyVersion);
    return index.thread.messages.map((item) => ({
      ...item,
      ...(item.documentCitations
        ? { documentCitations: item.documentCitations.map((citation) => ({ ...citation })) }
        : {})
    }));
  }

  async appendThreadMessage(args: {
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
    message: WorkspaceThreadMessage;
  }): Promise<WorkspaceThreadMessage> {
    const index = await this.read(args.caseId, args.caseDataKey, args.keyVersion);
    const message = safeMessage(args.message);
    const withoutDuplicate = index.thread.messages.filter(
      (item) => item.messageId !== message.messageId
    );
    index.thread.messages = [...withoutDuplicate, message].slice(-this.maxMessages);
    await this.write(index, args.caseDataKey, args.keyVersion);
    return message;
  }

  async getProcessPleadingState(args: {
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
  }): Promise<ProcessPleadingState | null> {
    const index = await this.read(
      args.caseId,
      args.caseDataKey,
      args.keyVersion
    );
    const state =
      index.workflows?.processPleading;
    return state
      ? validateProcessPleadingState(state)
      : null;
  }

  async saveProcessPleadingState(args: {
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
    state: ProcessPleadingState;
    expectedRevision?: number;
  }): Promise<ProcessPleadingState> {
    const state =
      validateProcessPleadingState(
        args.state
      );
    if (state.caseId !== args.caseId) {
      throw new Error(
        "PROCESS_PLEADING_CASE_ID_MISMATCH"
      );
    }
    const index = await this.read(
      args.caseId,
      args.caseDataKey,
      args.keyVersion
    );
    const current =
      index.workflows?.processPleading;
    if (
      args.expectedRevision !==
        undefined &&
      (
        !current ||
        current.revision !==
          args.expectedRevision
      )
    ) {
      throw new Error(
        "PROCESS_PLEADING_STATE_CONFLICT"
      );
    }
    index.workflows ??= {};
    index.workflows.processPleading =
      state;
    await this.write(
      index,
      args.caseDataKey,
      args.keyVersion
    );
    return validateProcessPleadingState(
      state
    );
  }

  async clearProcessPleadingState(args: {
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
    expectedRevision?: number;
  }): Promise<boolean> {
    const index = await this.read(
      args.caseId,
      args.caseDataKey,
      args.keyVersion
    );
    const workflows =
      index.workflows;
    const current =
      workflows?.processPleading;
    if (!workflows || !current) {
      return false;
    }
    if (
      args.expectedRevision !==
        undefined &&
      current.revision !==
        args.expectedRevision
    ) {
      throw new Error(
        "PROCESS_PLEADING_STATE_CONFLICT"
      );
    }
    delete workflows.processPleading;
    await this.write(
      index,
      args.caseDataKey,
      args.keyVersion
    );
    return true;
  }

  async getCourtAnalysisState(args: {
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
  }): Promise<CourtAnalysisState | null> {
    const index = await this.read(
      args.caseId,
      args.caseDataKey,
      args.keyVersion
    );
    const state =
      index.workflows?.courtAnalysis;
    return state
      ? validateCourtAnalysisState(
          state
        )
      : null;
  }

  async saveCourtAnalysisState(args: {
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
    state: CourtAnalysisState;
    expectedRevision?: number;
  }): Promise<CourtAnalysisState> {
    const state =
      validateCourtAnalysisState(
        args.state
      );
    if (
      state.caseId !==
        args.caseId
    ) {
      throw new Error(
        "COURT_ANALYSIS_CASE_ID_MISMATCH"
      );
    }

    const index =
      await this.read(
        args.caseId,
        args.caseDataKey,
        args.keyVersion
      );
    const current =
      index.workflows?.courtAnalysis;
    if (
      args.expectedRevision !==
        undefined &&
      (
        !current ||
        current.revision !==
          args.expectedRevision
      )
    ) {
      throw new Error(
        "COURT_ANALYSIS_STATE_CONFLICT"
      );
    }

    index.workflows ??= {};
    index.workflows.courtAnalysis =
      state;
    await this.write(
      index,
      args.caseDataKey,
      args.keyVersion
    );
    return validateCourtAnalysisState(
      state
    );
  }

  async clearCourtAnalysisState(args: {
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
    expectedRevision?: number;
  }): Promise<boolean> {
    const index =
      await this.read(
        args.caseId,
        args.caseDataKey,
        args.keyVersion
      );
    const workflows =
      index.workflows;
    const current =
      workflows?.courtAnalysis;
    if (!workflows || !current) {
      return false;
    }
    if (
      args.expectedRevision !==
        undefined &&
      current.revision !==
        args.expectedRevision
    ) {
      throw new Error(
        "COURT_ANALYSIS_STATE_CONFLICT"
      );
    }

    delete workflows.courtAnalysis;
    await this.write(
      index,
      args.caseDataKey,
      args.keyVersion
    );
    return true;
  }

  async getChronologyState(args: {
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
  }): Promise<ChronologyState | null> {
    const index = await this.read(
      args.caseId,
      args.caseDataKey,
      args.keyVersion
    );
    const state =
      index.workflows?.chronology;
    return state
      ? validateChronologyState(state)
      : null;
  }

  async saveChronologyState(args: {
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
    state: ChronologyState;
    expectedRevision?: number;
  }): Promise<ChronologyState> {
    const state =
      validateChronologyState(
        args.state
      );
    if (state.caseId !== args.caseId) {
      throw new Error(
        "CHRONOLOGY_CASE_ID_MISMATCH"
      );
    }

    const index = await this.read(
      args.caseId,
      args.caseDataKey,
      args.keyVersion
    );
    const current =
      index.workflows?.chronology;
    if (
      args.expectedRevision !== undefined &&
      (
        !current ||
        current.revision !==
          args.expectedRevision
      )
    ) {
      throw new Error(
        "CHRONOLOGY_STATE_CONFLICT"
      );
    }

    index.workflows ??= {};
    index.workflows.chronology =
      state;
    await this.write(
      index,
      args.caseDataKey,
      args.keyVersion
    );
    return validateChronologyState(
      state
    );
  }

  async clearChronologyState(args: {
    caseId: string;
    caseDataKey: Buffer;
    keyVersion: number;
    expectedRevision?: number;
  }): Promise<boolean> {
    const index = await this.read(
      args.caseId,
      args.caseDataKey,
      args.keyVersion
    );
    const workflows =
      index.workflows;
    const current =
      workflows?.chronology;
    if (!workflows || !current) {
      return false;
    }
    if (
      args.expectedRevision !== undefined &&
      current.revision !==
        args.expectedRevision
    ) {
      throw new Error(
        "CHRONOLOGY_STATE_CONFLICT"
      );
    }

    delete workflows.chronology;
    await this.write(
      index,
      args.caseDataKey,
      args.keyVersion
    );
    return true;
  }

  async rekeyCaseWorkspace(args: {
    caseId: string;
    oldCaseDataKey: Buffer;
    oldKeyVersion: number;
    newCaseDataKey: Buffer;
    newKeyVersion: number;
  }): Promise<boolean> {
    const target = this.workspaceFile(args.caseId);
    try {
      await readFile(target);
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") {
        return false;
      }
      throw error;
    }
    const index = await this.read(
      args.caseId,
      args.oldCaseDataKey,
      args.oldKeyVersion
    );
    await this.write(index, args.newCaseDataKey, args.newKeyVersion);
    return true;
  }
}
