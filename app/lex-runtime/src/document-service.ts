import type {
  PersonMorphology
} from "./privacy/person-morphology.js";
import {
  createHash
} from "node:crypto";
import type {
  CompleteDocumentIngestor,
  DocumentIngestionResult,
  IngestedPage
} from "./document-ingestion.js";
import {
  chunkDocumentPages
} from "./document-ingestion.js";
import type {
  CompleteImageIngestor,
  SupportedImageMediaType
} from "./image-ingestion.js";
import {
  LocalPolishPseudonymizer,
  PseudonymizationVault,
  type ManualPrivacyDirective,
  type NamedEntityRecognizer,
  type PiiKind
} from "./privacy/pseudonymizer.js";
import {
  privacyRecognizerFor
} from "./privacy/local-llm-ner.js";
import type {
  EncryptedPrivacyVaultStore
} from "./privacy/vault-store.js";
import type {
  SecureCaseDocumentStore
} from "./case-document-store.js";
import type { ProgressReporter } from "./processing-progress.js";
import { restoreWithReport } from "./privacy/restoration-report.js";
import {
  genderOf,
  placeholderGrammar,
  type PlaceholderGrammar
} from "./privacy/token-legend.js";
import {
  PERSON_CASES,
  type PersonCase,
  type PersonEntity
} from "./privacy/person-morphology.js";
import {
  DOCX_MEDIA_TYPE,
  ODT_MEDIA_TYPE,
  type OfficeDocumentTextExtractor,
  type OfficeDocumentMediaType
} from "./office-document-extractor.js";
import {
  XLSX_MEDIA_TYPE,
  XLSM_MEDIA_TYPE,
  CSV_MEDIA_TYPE,
  TSV_MEDIA_TYPE,
  type SpreadsheetTextExtractor,
  type SpreadsheetMediaType
} from "./spreadsheet-extractor.js";

export type DocumentSecurityContext = {
  caseId: string;
  caseDataKey?: Buffer;
  keyVersion?: number;
  // Stage and page counts for the case view's progress bar.
  onProgress?: ProgressReporter;
};

/** UTF-8 (BOM stripped), else Windows-1250 as used by older Polish files. */
export function decodePlainText(data: Uint8Array): string {
  try {
    return new TextDecoder("utf-8", { fatal: true, ignoreBOM: false }).decode(data);
  } catch {
    return new TextDecoder("windows-1250").decode(data);
  }
}

export type SupportedDocumentMediaType =
  | "application/pdf"
  | SupportedImageMediaType
  | "text/plain"
  | "text/markdown"
  | typeof DOCX_MEDIA_TYPE
  | typeof ODT_MEDIA_TYPE
  | typeof XLSX_MEDIA_TYPE
  | typeof XLSM_MEDIA_TYPE
  | typeof CSV_MEDIA_TYPE
  | typeof TSV_MEDIA_TYPE;

export type PublicDocumentChunk = {
  index: number;
  pageStart: number;
  pageEnd: number;
  text: string;
};

export type DocumentChunkSelection = {
  documentId: string;
  chunkIndices: number[];
};

export type ResolvedDocumentAttachment = {
  documentId: string;
  chunks: PublicDocumentChunk[];
  totalChars: number;
  // Kind and gender of the person/address placeholders in the chunks.
  grammar?: PlaceholderGrammar[];
  // Page count of the whole document, so a model knows where it is.
  totalPages?: number;
};

export type AnonymizedVersion = {
  documentId: string;
  totalPages: number;
  chunks: PublicDocumentChunk[];
  highlighted: HighlightedChunk[];
  entries: PrivacyKeyEntry[];
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Replaces whole-word surfaces (longest first) outside existing tokens. */
export function replaceOutsideTokens(
  text: string,
  surfaces: string[],
  token: string
): { text: string; count: number } {
  const ordered = [...surfaces].sort((a, b) => b.length - a.length).map(escapeRegExp);
  if (!ordered.length) return { text, count: 0 };
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(?:${ordered.join("|")})(?![\\p{L}\\p{N}])`, "giu");
  let count = 0;
  const parts = text.split(/(\[(?:LMPII:D\d{2}|PII):[A-Z_]+:\d{4}(?:\|[A-Z]{2,4})?\])/);
  const out = parts.map((part, index) =>
    index % 2 === 1
      ? part
      : part.replace(pattern, () => {
          count += 1;
          return token;
        })
  );
  return { text: out.join(""), count };
}

export type HighlightedChunk = {
  index: number;
  pageStart: number;
  pageEnd: number;
  // The original wording, with every anonymized span marked.
  text: string;
  marks: Array<{ start: number; end: number; token: string; kind: string }>;
};

const PROTECTED_PART = /(\[PII:[A-Z_]+:\d{4}(?:\|[A-Z]{2,4})?\])/;
const PAGE_HEADER = /^\[STRONA [^\]\n]+\]\n?/gm;

/**
 * Lines the anonymized text up with the source to show the original words
 * (in their original case) where each token stands. A token takes the
 * longest of its known forms found at that point; otherwise the text up to
 * where the next literal part continues in the source.
 */
export function highlightProtected(
  protectedText: string,
  source: string,
  surfaces: (token: string) => string[],
  fallback: (token: string) => string
): { text: string; marks: HighlightedChunk["marks"] } {
  const parts = protectedText.split(PROTECTED_PART);
  const lower = source.toLocaleLowerCase("pl");
  let cursor = 0;
  let text = "";
  const marks: HighlightedChunk["marks"] = [];
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index]!;
    if (index % 2 === 0) {
      text += part;
      const literal = part.replace(PAGE_HEADER, "");
      if (literal) {
        const found = source.indexOf(literal, cursor);
        if (found >= 0 && found - cursor < 4000) cursor = found + literal.length;
      }
      continue;
    }
    const token = part.replace(/\|[A-Z]{2,4}\]$/, "]");
    const kind = /^\[PII:([A-Z_]+):/.exec(token)![1]!;
    let original = "";
    for (const surface of [...surfaces(token)].sort((a, b) => b.length - a.length)) {
      if (surface && lower.startsWith(surface.toLocaleLowerCase("pl"), cursor)) {
        original = source.slice(cursor, cursor + surface.length);
        break;
      }
    }
    if (!original) {
      const anchor = (parts[index + 1] ?? "").replace(PAGE_HEADER, "").slice(0, 24);
      const found = anchor ? source.indexOf(anchor, cursor) : -1;
      if (found > cursor && found - cursor <= 300) original = source.slice(cursor, found);
    }
    // Not found in the source (e.g. text changed since): the stored value.
    const shown = original || fallback(token);
    cursor += original.length;
    text += shown;
    marks.push({ start: text.length - shown.length, end: text.length, token, kind });
  }
  return { text, marks };
}

/** One row of a document's anonymization key, shown locally only. */
export type PrivacyKeyEntry = {
  token: string;
  kind: string;
  value: string;
  // Case forms used when restoring (persons and addresses).
  forms?: Array<{ case: string; text: string }>;
  gender?: "m" | "f" | "unknown";
  occurrences: number;
};

export type PagePrivacyDirective =
  ManualPrivacyDirective & {
    page: number;
  };

export type PublicPrivacySuggestion = {
  page: number;
  start: number;
  end: number;
  kind: PiiKind;
};

export type PublicPrivacyAnnotation = {
  page: number;
  start: number;
  end: number;
  label: string;
};

export type PublicDocumentReview = {
  documentId: string;
  mediaType: SupportedDocumentMediaType;
  complete: true;
  totalPages: number;
  pages: Array<{
    page: number;
    text: string;
    source: IngestedPage["source"];
    confidence?: number;
    engine?: string;
  }>;
  suggestions: PublicPrivacySuggestion[];
};

export type PublicDocumentIngestion = {
  documentId: string;
  mediaType: SupportedDocumentMediaType;
  complete: true;
  totalPages: number;
  digitalPages: number;
  ocrPages: number;
  blankPages: number;
  sourceChars: number;
  pseudonymizedChars: number;
  chunks: PublicDocumentChunk[];
  privacy: {
    findings: number;
    counts: Partial<Record<PiiKind, number>>;
    manualPseudonymizations: number;
    keptRanges: number;
    annotations: PublicPrivacyAnnotation[];
    reversibleLocally: true;
  };
};

export interface DocumentService {
  ingestPdf(
    data: Uint8Array,
    security?: DocumentSecurityContext
  ): Promise<PublicDocumentIngestion>;
  ingestImage(
    data: Uint8Array,
    mediaType: SupportedImageMediaType,
    security?: DocumentSecurityContext
  ): Promise<PublicDocumentIngestion>;
  review(
    data: Uint8Array,
    mediaType: SupportedDocumentMediaType,
    security?: DocumentSecurityContext
  ): Promise<PublicDocumentReview>;
  finalizeReview(
    documentId: string,
    directives: PagePrivacyDirective[],
    security?: DocumentSecurityContext
  ): Promise<PublicDocumentIngestion>;
  resolveProtectedChunks(
    selection: DocumentChunkSelection
  ): Promise<ResolvedDocumentAttachment>;
  restoreDocument?(args: {
    caseId: string;
    documentId: string;
    caseDataKey: Buffer;
    keyVersion: number;
  }): Promise<PublicDocumentIngestion>;
  deanonymize?(
    documentId: string,
    text: string
  ): string;
  privacyKey?(documentId: string): PrivacyKeyEntry[];
  restoreText?(documentId: string, text: string): { text: string; count: number; unresolved: string[] };
  anonymizedVersion?(documentId: string): AnonymizedVersion;
  addProtection?(
    documentId: string,
    text: string,
    kind: PiiKind,
    security: DocumentSecurityContext
  ): Promise<AnonymizedVersion & { token: string; replaced: number }>;
  removeProtection?(
    documentId: string,
    token: string,
    security: DocumentSecurityContext
  ): Promise<AnonymizedVersion & { restored: number }>;
  updateKeyForms?(
    documentId: string,
    token: string,
    forms: Partial<Record<PersonCase, string>>,
    security: DocumentSecurityContext
  ): Promise<AnonymizedVersion>;
}

type PrivateDocumentRecord = {
  mediaType: SupportedDocumentMediaType;
  caseId?: string;
  vault: PseudonymizationVault;
  source: DocumentIngestionResult;
  protectedChunks?: PublicDocumentChunk[];
  // The stored anonymized version, kept whole so edits can be saved back.
  protectedIngestion?: PublicDocumentIngestion;
};

export class LocalPrivateDocumentService
implements DocumentService {
  private readonly documents =
    new Map<string, PrivateDocumentRecord>();

  constructor(
    private readonly pdfIngestor: CompleteDocumentIngestor,
    private readonly namedEntities: NamedEntityRecognizer,
    private readonly maxChunkChars = 24_000,
    private readonly imageIngestor?: CompleteImageIngestor,
    private readonly privacyVaultStore?: Pick<
      EncryptedPrivacyVaultStore,
      "loadDocumentVault" |
      "saveDocumentVault"
    >,
    private readonly secureDocumentStore?: Pick<
      SecureCaseDocumentStore,
      | "saveSource"
      | "saveProtected"
      | "loadSource"
      | "loadProtected"
    >,
    private readonly officeExtractor?:
      OfficeDocumentTextExtractor,
    private readonly spreadsheetExtractor?:
      SpreadsheetTextExtractor,
    // One token per person and inflected restore ([PII:PERSON:0001|GEN]).
    private readonly personMorphology?:
      PersonMorphology
  ) {}

  private digitalTextResult(
    data: Uint8Array,
    text: string
  ): DocumentIngestionResult {
    if (
      data.byteLength >
        64 * 1024 * 1024 ||
      text.length >
        100_000_000
    ) {
      throw new Error(
        "DOCUMENT_TEXT_LIMIT_EXCEEDED"
      );
    }
    const page = {
      page: 1,
      text,
      source:
        text.trim()
          ? "DIGITAL" as const
          : "BLANK" as const
    };
    const pages:
      IngestedPage[] = [
        page
      ];
    return {
      complete: true,
      sha256:
        createHash("sha256")
          .update(data)
          .digest("hex"),
      bytes:
        data.byteLength,
      totalPages: 1,
      digitalPages:
        page.source ===
          "DIGITAL"
          ? 1
          : 0,
      ocrPages: 0,
      blankPages:
        page.source ===
          "BLANK"
          ? 1
          : 0,
      sourceChars:
        text.length,
      pages,
      chunks:
        chunkDocumentPages(
          pages,
          this.maxChunkChars
        )
    };
  }

  private async extract(
    data: Uint8Array,
    mediaType: SupportedDocumentMediaType,
    onProgress?: ProgressReporter
  ): Promise<DocumentIngestionResult> {
    if (mediaType === "application/pdf") {
      return this.pdfIngestor.ingest(data, onProgress);
    }
    if (
      mediaType ===
        "text/plain" ||
      mediaType ===
        "text/markdown"
    ) {
      return this.digitalTextResult(
        data,
        decodePlainText(data)
      );
    }
    if (
      mediaType ===
        XLSX_MEDIA_TYPE ||
      mediaType ===
        XLSM_MEDIA_TYPE ||
      mediaType ===
        CSV_MEDIA_TYPE ||
      mediaType ===
        TSV_MEDIA_TYPE
    ) {
      if (!this.spreadsheetExtractor) {
        throw new Error(
          "SPREADSHEET_EXTRACTOR_UNAVAILABLE"
        );
      }
      return this.digitalTextResult(
        data,
        await this.spreadsheetExtractor
          .extract(
            data,
            mediaType as
              SpreadsheetMediaType
          )
      );
    }
    if (
      mediaType ===
        DOCX_MEDIA_TYPE ||
      mediaType ===
        ODT_MEDIA_TYPE
    ) {
      if (!this.officeExtractor) {
        throw new Error(
          "OFFICE_DOCUMENT_EXTRACTOR_UNAVAILABLE"
        );
      }
      return this.digitalTextResult(
        data,
        await this.officeExtractor
          .extract(
            data,
            mediaType as
              OfficeDocumentMediaType
          )
      );
    }
    if (!this.imageIngestor) {
      throw new Error("IMAGE_OCR_UNAVAILABLE");
    }
    onProgress?.({ stage: "OCR", done: 0, total: 1 });
    const image = await this.imageIngestor.ingest(
      data,
      mediaType
    );
    onProgress?.({ stage: "OCR", done: 1, total: 1 });
    return image;
  }

  async review(
    data: Uint8Array,
    mediaType: SupportedDocumentMediaType,
    security?: DocumentSecurityContext
  ): Promise<PublicDocumentReview> {
    const onProgress = security?.onProgress;
    onProgress?.({ stage: "READING" });
    const source = await this.extract(
      data,
      mediaType,
      onProgress
    );
    const documentId =
      `doc_${source.sha256.slice(0, 24)}`;

    const persistentDocument =
      Boolean(
        this.secureDocumentStore &&
        security?.caseId
      );
    if (persistentDocument) {
      if (
        !security?.caseDataKey ||
        !Number.isInteger(
          security.keyVersion
        ) ||
        (security.keyVersion ?? 0) <
          1
      ) {
        throw new Error(
          "DOCUMENT_STORAGE_CONTEXT_REQUIRED"
        );
      }
      await this
        .secureDocumentStore!
        .saveSource({
          caseId:
            security.caseId,
          documentId,
          mediaType,
          source,
          caseDataKey:
            security.caseDataKey,
          keyVersion:
            security.keyVersion!
        });
    }

    const vault = new PseudonymizationVault();
    this.documents.set(documentId, {
      mediaType,
      ...(security?.caseId
        ? {
            caseId:
              security.caseId
          }
        : {}),
      vault,
      source
    });

    const suggestionVault =
      new PseudonymizationVault();
    const suggestions: PublicPrivacySuggestion[] = [];

    for (const [index, page] of source.pages.entries()) {
      onProgress?.({ stage: "DETECTING", done: index, total: source.pages.length });
      const preview =
        await new LocalPolishPseudonymizer(
          suggestionVault,
          privacyRecognizerFor(
            this.namedEntities,
            page.source === "OCR"
          ),
          this.personMorphology
        ).pseudonymize(
          page.text
        );
      for (const finding of preview.findings) {
        suggestions.push({
          page: page.page,
          start: finding.start,
          end: finding.end,
          kind: finding.kind
        });
      }
    }

    return {
      documentId,
      mediaType,
      complete: true,
      totalPages: source.totalPages,
      pages: source.pages.map((page) => ({
        page: page.page,
        text: page.text,
        source: page.source,
        ...(page.confidence !== undefined
          ? { confidence: page.confidence }
          : {}),
        ...(page.engine
          ? { engine: page.engine }
          : {})
      })),
      suggestions
    };
  }

  async finalizeReview(
    documentId: string,
    directives: PagePrivacyDirective[],
    security?: DocumentSecurityContext
  ): Promise<PublicDocumentIngestion> {
    const record = this.documents.get(documentId);
    if (!record) {
      throw new Error("UNKNOWN_LOCAL_DOCUMENT");
    }

    for (const directive of directives) {
      if (
        !Number.isInteger(directive.page) ||
        directive.page < 1 ||
        directive.page > record.source.totalPages
      ) {
        throw new Error("INVALID_PRIVACY_DIRECTIVE_PAGE");
      }
    }

    const persistentVault =
      Boolean(
        this.privacyVaultStore &&
        record.caseId
      );

    if (persistentVault) {
      if (
        !security ||
        security.caseId !==
          record.caseId ||
        !security.caseDataKey ||
        !Number.isInteger(
          security.keyVersion
        ) ||
        (security.keyVersion ?? 0) <
          1
      ) {
        throw new Error(
          "DOCUMENT_VAULT_CONTEXT_REQUIRED"
        );
      }
      record.vault =
        await this
          .privacyVaultStore!
          .loadDocumentVault({
            caseId:
              record.caseId!,
            documentId,
            caseDataKey:
              security.caseDataKey,
            keyVersion:
              security.keyVersion!
          });
    }

    const pages: IngestedPage[] = [];
    const counts: Partial<Record<PiiKind, number>> = {};
    const annotations: PublicPrivacyAnnotation[] = [];
    let findings = 0;
    let manualPseudonymizations = 0;
    let keptRanges = 0;

    const onProgress = security?.onProgress;
    for (const [pageIndex, page] of record.source.pages.entries()) {
      onProgress?.({ stage: "PSEUDONYMIZING", done: pageIndex, total: record.source.pages.length });
      const pageDirectives = directives
        .filter(
          (directive) =>
            directive.page === page.page
        )
        .map(({ page: _page, ...directive }) =>
          directive
        );

      const protectedPage =
        await new LocalPolishPseudonymizer(
          record.vault,
          privacyRecognizerFor(
            this.namedEntities,
            page.source === "OCR"
          ),
          this.personMorphology
        ).pseudonymize(
          page.text,
          pageDirectives
        );
      findings += protectedPage.findings.length;
      manualPseudonymizations +=
        protectedPage.findings.filter(
          (item) => item.source === "USER"
        ).length;
      keptRanges +=
        protectedPage.keptRanges.length;

      for (
        const [kind, count] of Object.entries(
          protectedPage.counts
        ) as Array<[PiiKind, number]>
      ) {
        counts[kind] = (counts[kind] ?? 0) + count;
      }
      for (
        const annotation of
          protectedPage.annotations
      ) {
        annotations.push({
          page: page.page,
          ...annotation
        });
      }

      pages.push({
        ...page,
        text: protectedPage.text
      });
    }

    const chunks = chunkDocumentPages(
      pages,
      this.maxChunkChars
    );
    const pseudonymizedChars = pages.reduce(
      (sum, page) => sum + page.text.length,
      0
    );
    const publicChunks = chunks.map((chunk) => ({
      index: chunk.index,
      pageStart: chunk.pageStart,
      pageEnd: chunk.pageEnd,
      text: chunk.text
    }));
    record.protectedChunks = publicChunks;

    onProgress?.({ stage: "SAVING" });
    if (
      persistentVault &&
      security?.caseDataKey &&
      security.keyVersion &&
      record.caseId
    ) {
      await this
        .privacyVaultStore!
        .saveDocumentVault({
          caseId:
            record.caseId,
          documentId,
          vault:
            record.vault,
          caseDataKey:
            security.caseDataKey,
          keyVersion:
            security.keyVersion
        });
    }

    const result:
      PublicDocumentIngestion = {
        documentId,
        mediaType:
          record.mediaType,
        complete: true,
        totalPages:
          record.source.totalPages,
        digitalPages:
          record.source.digitalPages,
        ocrPages:
          record.source.ocrPages,
        blankPages:
          record.source.blankPages,
        sourceChars:
          record.source.sourceChars,
        pseudonymizedChars,
        chunks:
          publicChunks.map(
            (chunk) => ({
              ...chunk
            })
          ),
        privacy: {
          findings,
          counts,
          manualPseudonymizations,
          keptRanges,
          annotations,
          reversibleLocally: true
        }
      };

    record.protectedIngestion = result;
    if (
      this.secureDocumentStore &&
      record.caseId
    ) {
      if (
        !security ||
        security.caseId !==
          record.caseId ||
        !security.caseDataKey ||
        !Number.isInteger(
          security.keyVersion
        ) ||
        (security.keyVersion ?? 0) <
          1
      ) {
        throw new Error(
          "DOCUMENT_STORAGE_CONTEXT_REQUIRED"
        );
      }
      await this
        .secureDocumentStore
        .saveProtected({
          caseId:
            record.caseId,
          documentId,
          ingestion:
            result,
          caseDataKey:
            security.caseDataKey,
          keyVersion:
            security.keyVersion!
        });
    }

    return result;
  }

  async ingestPdf(
    data: Uint8Array,
    security?: DocumentSecurityContext
  ): Promise<PublicDocumentIngestion> {
    const review = await this.review(
      data,
      "application/pdf",
      security
    );
    return this.finalizeReview(
      review.documentId,
      [],
      security
    );
  }

  async ingestImage(
    data: Uint8Array,
    mediaType: SupportedImageMediaType,
    security?: DocumentSecurityContext
  ): Promise<PublicDocumentIngestion> {
    const review = await this.review(
      data,
      mediaType,
      security
    );
    return this.finalizeReview(
      review.documentId,
      [],
      security
    );
  }

  async resolveProtectedChunks(
    selection: DocumentChunkSelection
  ): Promise<ResolvedDocumentAttachment> {
    const record =
      this.documents.get(selection.documentId);
    if (!record) {
      throw new Error("UNKNOWN_LOCAL_DOCUMENT");
    }
    if (!record.protectedChunks) {
      throw new Error("DOCUMENT_NOT_FINALIZED");
    }

    const unique = [
      ...new Set(selection.chunkIndices)
    ].sort((a, b) => a - b);

    if (
      unique.length === 0 ||
      unique.length > 32 ||
      unique.some(
        (index) =>
          !Number.isInteger(index) ||
          index < 1
      )
    ) {
      throw new Error(
        "INVALID_DOCUMENT_CHUNK_SELECTION"
      );
    }

    const byIndex = new Map(
      record.protectedChunks.map(
        (chunk) => [chunk.index, chunk]
      )
    );
    const chunks = unique.map((index) => {
      const chunk = byIndex.get(index);
      if (!chunk) {
        throw new Error(
          "UNKNOWN_DOCUMENT_CHUNK"
        );
      }
      return { ...chunk };
    });

    const totalChars = chunks.reduce(
      (sum, chunk) => sum + chunk.text.length,
      0
    );
    if (totalChars > 160_000) {
      throw new Error(
        "DOCUMENT_ATTACHMENT_CONTEXT_TOO_LARGE"
      );
    }

    return {
      documentId: selection.documentId,
      chunks,
      totalChars,
      grammar: placeholderGrammar(
        chunks.map((chunk) => chunk.text).join("\n"),
        record.vault
      ),
      totalPages: record.source.totalPages
    };
  }

  async restoreDocument(args: {
    caseId: string;
    documentId: string;
    caseDataKey: Buffer;
    keyVersion: number;
  }): Promise<
    PublicDocumentIngestion
  > {
    if (
      !this.secureDocumentStore
    ) {
      throw new Error(
        "DOCUMENT_STORAGE_UNAVAILABLE"
      );
    }

    const source =
      await this
        .secureDocumentStore
        .loadSource(args);
    const protectedResult =
      await this
        .secureDocumentStore
        .loadProtected(args);

    if (
      protectedResult.mediaType !==
        source.mediaType
    ) {
      throw new Error(
        "DOCUMENT_STORAGE_MEDIA_TYPE_MISMATCH"
      );
    }

    let vault =
      new PseudonymizationVault();
    if (
      this.privacyVaultStore
    ) {
      vault =
        await this
          .privacyVaultStore
          .loadDocumentVault({
            caseId:
              args.caseId,
            documentId:
              args.documentId,
            caseDataKey:
              args.caseDataKey,
            keyVersion:
              args.keyVersion
          });
    }

    this.documents.set(
      args.documentId,
      {
        mediaType:
          source.mediaType,
        caseId:
          args.caseId,
        vault,
        source:
          source.source,
        protectedIngestion:
          protectedResult,
        protectedChunks:
          protectedResult
            .chunks
            .map(
              (chunk) => ({
                ...chunk
              })
            )
      }
    );
    return protectedResult;
  }

  deanonymize(
    documentId: string,
    text: string
  ): string {
    const record = this.documents.get(documentId);
    if (!record) {
      throw new Error("Unknown local document.");
    }
    return record.vault.deanonymize(text);
  }

  /**
   * The document's anonymization key: every token, the value it hides and
   * its case forms, with how often it occurs in the protected text. Needs
   * the document restored (restoreDocument) with the case key first.
   */
  privacyKey(documentId: string): PrivacyKeyEntry[] {
    const record = this.documents.get(documentId);
    if (!record || !record.protectedChunks) {
      throw new Error("UNKNOWN_LOCAL_DOCUMENT");
    }
    const counts = new Map<string, number>();
    for (const chunk of record.protectedChunks) {
      for (const match of chunk.text.matchAll(/\[PII:([A-Z_]+):(\d{4})(?:\|[A-Z]{2,4})?\]/g)) {
        const token = `[PII:${match[1]}:${match[2]}]`;
        counts.set(token, (counts.get(token) ?? 0) + 1);
      }
    }
    return record.vault
      .snapshot()
      .tokens.sort((a, b) => a.token.localeCompare(b.token, "en"))
      .map((item) => {
        const entity = item.entity;
        const forms = entity
          ? PERSON_CASES.map((personCase) => ({ case: personCase, text: entity.forms[personCase].text }))
          : undefined;
        return {
          token: item.token,
          kind: item.kind,
          value: entity?.canonical ?? item.value,
          ...(forms ? { forms } : {}),
          ...(item.kind === "PERSON" ? { gender: genderOf(record.vault, item.token) } : {}),
          occurrences: counts.get(item.token) ?? 0
        };
      });
  }

  private editableRecord(documentId: string): PrivateDocumentRecord & {
    protectedIngestion: PublicDocumentIngestion;
  } {
    const record = this.documents.get(documentId);
    if (!record || !record.protectedIngestion) {
      throw new Error("UNKNOWN_LOCAL_DOCUMENT");
    }
    return record as PrivateDocumentRecord & { protectedIngestion: PublicDocumentIngestion };
  }

  /** Values of this document's key put back into any text (a file with its placeholders). */
  restoreText(documentId: string, text: string): { text: string; count: number; unresolved: string[] } {
    const record = this.documents.get(documentId);
    if (!record) throw new Error("UNKNOWN_LOCAL_DOCUMENT");
    const result = restoreWithReport(text, record.vault);
    return { text: result.text, count: result.restorations.length, unresolved: result.unresolved };
  }

  /** The anonymized version as stored: chunks with tokens, and its key. */
  anonymizedVersion(documentId: string): AnonymizedVersion {
    const record = this.editableRecord(documentId);
    const vault = record.vault;
    const surfaces = (token: string): string[] => {
      const entity = vault.entity(token);
      const value = vault.hasToken(token) ? vault.restore(token, null).text : "";
      return [
        ...new Set([
          value,
          ...(entity ? PERSON_CASES.map((personCase) => entity.forms[personCase].text) : [])
        ])
      ].filter(Boolean);
    };
    const fallback = (token: string): string =>
      vault.hasToken(token) ? vault.restore(token, "NOM").text : token;
    const chunks = record.protectedIngestion.chunks;
    return {
      documentId,
      totalPages: record.source.totalPages,
      chunks: chunks.map((chunk) => ({ ...chunk })),
      highlighted: chunks.map((chunk) => {
        const source = record.source.pages
          .filter((page) => page.page >= chunk.pageStart && page.page <= chunk.pageEnd)
          .map((page) => page.text)
          .join("\n");
        return {
          index: chunk.index,
          pageStart: chunk.pageStart,
          pageEnd: chunk.pageEnd,
          ...highlightProtected(chunk.text, source, surfaces, fallback)
        };
      }),
      entries: this.privacyKey(documentId)
    };
  }

  /**
   * Anonymizes one more value everywhere in the anonymized version: a person
   * or address in every case form, anything else verbatim. The version and
   * the key are saved together.
   */
  async addProtection(
    documentId: string,
    text: string,
    kind: PiiKind,
    security: DocumentSecurityContext
  ): Promise<AnonymizedVersion & { token: string; replaced: number }> {
    const record = this.editableRecord(documentId);
    const value = text.replace(/\s+/g, " ").trim();
    if (value.length < 2 || value.length > 300 || /\[|\]/.test(value)) {
      throw new Error("PRIVACY_EDIT_TEXT_INVALID");
    }
    let entity: PersonEntity | null | undefined;
    if (kind === "PERSON" && this.personMorphology) {
      [entity] = await this.personMorphology.analyze([value]);
    } else if (kind === "ADDRESS" && this.personMorphology?.analyzeAddresses) {
      [entity] = await this.personMorphology.analyzeAddresses([value]);
    }
    const known = new Set(record.vault.snapshot().tokens.map((item) => item.token));
    const token = record.vault.getOrCreate(kind, value, entity ?? undefined);
    const stored = record.vault.entity(token);
    const surfaces = [
      ...new Set([
        value,
        ...(stored ? PERSON_CASES.map((personCase) => stored.forms[personCase].text) : [])
      ])
    ].filter((surface) => surface.trim().length >= 2);
    let replaced = 0;
    const chunks = record.protectedIngestion.chunks.map((chunk) => {
      const result = replaceOutsideTokens(chunk.text, surfaces, token);
      replaced += result.count;
      return { ...chunk, text: result.text };
    });
    if (replaced === 0) {
      // Nothing matched: do not keep a new token that stands for nothing.
      if (!known.has(token)) record.vault.remove(token);
      throw new Error("PRIVACY_EDIT_TEXT_NOT_FOUND");
    }
    const privacy = record.protectedIngestion.privacy;
    this.replaceProtected(record, chunks, {
      ...privacy,
      findings: privacy.findings + replaced,
      manualPseudonymizations: privacy.manualPseudonymizations + replaced,
      counts: { ...privacy.counts, [kind]: (privacy.counts[kind] ?? 0) + replaced }
    });
    await this.persistEdit(documentId, record, security);
    return { ...this.anonymizedVersion(documentId), token, replaced };
  }

  /**
   * Takes a value out of the anonymization: every occurrence of the token
   * gets the value back (a person or address in the nominative, since the
   * stored text does not keep each occurrence's case) and the token leaves
   * the key.
   */
  async removeProtection(
    documentId: string,
    token: string,
    security: DocumentSecurityContext
  ): Promise<AnonymizedVersion & { restored: number }> {
    const record = this.editableRecord(documentId);
    if (!/^\[PII:[A-Z_]+:\d{4}\]$/.test(token) || !record.vault.hasToken(token)) {
      throw new Error("PRIVACY_KEY_TOKEN_NOT_FOUND");
    }
    const value = record.vault.restore(token, "NOM").text;
    const kind = /^\[PII:([A-Z_]+):/.exec(token)![1] as PiiKind;
    const pattern = new RegExp(escapeRegExp(token.slice(0, -1)) + "(?:\\|[A-Z]{2,4})?\\]", "g");
    let restored = 0;
    const chunks = record.protectedIngestion.chunks.map((chunk) => ({
      ...chunk,
      text: chunk.text.replace(pattern, () => {
        restored += 1;
        return value;
      })
    }));
    record.vault.remove(token);
    const privacy = record.protectedIngestion.privacy;
    this.replaceProtected(record, chunks, {
      ...privacy,
      findings: Math.max(0, privacy.findings - restored),
      counts: { ...privacy.counts, [kind]: Math.max(0, (privacy.counts[kind] ?? 0) - restored) }
    });
    await this.persistEdit(documentId, record, security);
    return { ...this.anonymizedVersion(documentId), restored };
  }

  /** Corrects case forms of a person or address in the key. */
  async updateKeyForms(
    documentId: string,
    token: string,
    forms: Partial<Record<PersonCase, string>>,
    security: DocumentSecurityContext
  ): Promise<AnonymizedVersion> {
    const record = this.editableRecord(documentId);
    for (const value of Object.values(forms)) {
      if (typeof value !== "string" || value.length > 300 || /\[|\]/.test(value)) {
        throw new Error("PRIVACY_EDIT_TEXT_INVALID");
      }
    }
    record.vault.updateForms(token, forms);
    await this.persistEdit(documentId, record, security);
    return this.anonymizedVersion(documentId);
  }

  private replaceProtected(
    record: PrivateDocumentRecord & { protectedIngestion: PublicDocumentIngestion },
    chunks: PublicDocumentChunk[],
    privacy: PublicDocumentIngestion["privacy"]
  ): void {
    record.protectedIngestion = {
      ...record.protectedIngestion,
      chunks,
      pseudonymizedChars: chunks.reduce((sum, chunk) => sum + chunk.text.length, 0),
      privacy
    };
    record.protectedChunks = chunks.map((chunk) => ({ ...chunk }));
  }

  private async persistEdit(
    documentId: string,
    record: PrivateDocumentRecord & { protectedIngestion: PublicDocumentIngestion },
    security: DocumentSecurityContext
  ): Promise<void> {
    if (!record.caseId) return;
    if (
      !this.secureDocumentStore ||
      !this.privacyVaultStore ||
      security.caseId !== record.caseId ||
      !security.caseDataKey ||
      !security.keyVersion
    ) {
      throw new Error("DOCUMENT_STORAGE_CONTEXT_REQUIRED");
    }
    const context = {
      caseId: record.caseId,
      documentId,
      caseDataKey: security.caseDataKey,
      keyVersion: security.keyVersion
    };
    // The key first: a version never refers to a token its key lacks.
    await this.privacyVaultStore.saveDocumentVault({ ...context, vault: record.vault });
    await this.secureDocumentStore.saveProtected({ ...context, ingestion: record.protectedIngestion });
  }

  forget(documentId: string): boolean {
    return this.documents.delete(documentId);
  }
}
