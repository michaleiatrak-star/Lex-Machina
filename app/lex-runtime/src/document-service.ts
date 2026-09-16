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
import type {
  EncryptedPrivacyVaultStore
} from "./privacy/vault-store.js";
import type {
  SecureCaseDocumentStore
} from "./case-document-store.js";
import {
  DOCX_MEDIA_TYPE,
  ODT_MEDIA_TYPE,
  type OfficeDocumentTextExtractor,
  type OfficeDocumentMediaType
} from "./office-document-extractor.js";

export type DocumentSecurityContext = {
  caseId: string;
  caseDataKey?: Buffer;
  keyVersion?: number;
};

export type SupportedDocumentMediaType =
  | "application/pdf"
  | SupportedImageMediaType
  | "text/plain"
  | "text/markdown"
  | typeof DOCX_MEDIA_TYPE
  | typeof ODT_MEDIA_TYPE;

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
}

type PrivateDocumentRecord = {
  mediaType: SupportedDocumentMediaType;
  caseId?: string;
  vault: PseudonymizationVault;
  source: DocumentIngestionResult;
  protectedChunks?: PublicDocumentChunk[];
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
      OfficeDocumentTextExtractor
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
    mediaType: SupportedDocumentMediaType
  ): Promise<DocumentIngestionResult> {
    if (mediaType === "application/pdf") {
      return this.pdfIngestor.ingest(data);
    }
    if (
      mediaType ===
        "text/plain" ||
      mediaType ===
        "text/markdown"
    ) {
      return this.digitalTextResult(
        data,
        new TextDecoder(
          "utf-8",
          {
            fatal: false
          }
        ).decode(data)
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
    return this.imageIngestor.ingest(
      data,
      mediaType
    );
  }

  async review(
    data: Uint8Array,
    mediaType: SupportedDocumentMediaType,
    security?: DocumentSecurityContext
  ): Promise<PublicDocumentReview> {
    const source = await this.extract(
      data,
      mediaType
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
    const suggestionEngine =
      new LocalPolishPseudonymizer(
        suggestionVault,
        this.namedEntities
      );
    const suggestions: PublicPrivacySuggestion[] = [];

    for (const page of source.pages) {
      const preview =
        await suggestionEngine.pseudonymize(
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

    const pseudonymizer =
      new LocalPolishPseudonymizer(
        record.vault,
        this.namedEntities
      );
    const pages: IngestedPage[] = [];
    const counts: Partial<Record<PiiKind, number>> = {};
    const annotations: PublicPrivacyAnnotation[] = [];
    let findings = 0;
    let manualPseudonymizations = 0;
    let keptRanges = 0;

    for (const page of record.source.pages) {
      const pageDirectives = directives
        .filter(
          (directive) =>
            directive.page === page.page
        )
        .map(({ page: _page, ...directive }) =>
          directive
        );

      const protectedPage =
        await pseudonymizer.pseudonymize(
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
      totalChars
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

  forget(documentId: string): boolean {
    return this.documents.delete(documentId);
  }
}
