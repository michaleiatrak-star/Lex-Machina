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

export type SupportedDocumentMediaType =
  | "application/pdf"
  | SupportedImageMediaType;

export type PublicDocumentChunk = {
  index: number;
  pageStart: number;
  pageEnd: number;
  text: string;
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
    data: Uint8Array
  ): Promise<PublicDocumentIngestion>;
  ingestImage(
    data: Uint8Array,
    mediaType: SupportedImageMediaType
  ): Promise<PublicDocumentIngestion>;
  review(
    data: Uint8Array,
    mediaType: SupportedDocumentMediaType
  ): Promise<PublicDocumentReview>;
  finalizeReview(
    documentId: string,
    directives: PagePrivacyDirective[]
  ): Promise<PublicDocumentIngestion>;
}

type PrivateDocumentRecord = {
  mediaType: SupportedDocumentMediaType;
  vault: PseudonymizationVault;
  source: DocumentIngestionResult;
};

export class LocalPrivateDocumentService
implements DocumentService {
  private readonly documents =
    new Map<string, PrivateDocumentRecord>();

  constructor(
    private readonly pdfIngestor: CompleteDocumentIngestor,
    private readonly namedEntities: NamedEntityRecognizer,
    private readonly maxChunkChars = 24_000,
    private readonly imageIngestor?: CompleteImageIngestor
  ) {}

  private async extract(
    data: Uint8Array,
    mediaType: SupportedDocumentMediaType
  ): Promise<DocumentIngestionResult> {
    if (mediaType === "application/pdf") {
      return this.pdfIngestor.ingest(data);
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
    mediaType: SupportedDocumentMediaType
  ): Promise<PublicDocumentReview> {
    const source = await this.extract(
      data,
      mediaType
    );
    const documentId =
      `doc_${source.sha256.slice(0, 24)}`;

    const vault = new PseudonymizationVault();
    this.documents.set(documentId, {
      mediaType,
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
    directives: PagePrivacyDirective[]
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

    return {
      documentId,
      mediaType: record.mediaType,
      complete: true,
      totalPages: record.source.totalPages,
      digitalPages: record.source.digitalPages,
      ocrPages: record.source.ocrPages,
      blankPages: record.source.blankPages,
      sourceChars: record.source.sourceChars,
      pseudonymizedChars,
      chunks: chunks.map((chunk) => ({
        index: chunk.index,
        pageStart: chunk.pageStart,
        pageEnd: chunk.pageEnd,
        text: chunk.text
      })),
      privacy: {
        findings,
        counts,
        manualPseudonymizations,
        keptRanges,
        annotations,
        reversibleLocally: true
      }
    };
  }

  async ingestPdf(
    data: Uint8Array
  ): Promise<PublicDocumentIngestion> {
    const review = await this.review(
      data,
      "application/pdf"
    );
    return this.finalizeReview(
      review.documentId,
      []
    );
  }

  async ingestImage(
    data: Uint8Array,
    mediaType: SupportedImageMediaType
  ): Promise<PublicDocumentIngestion> {
    const review = await this.review(
      data,
      mediaType
    );
    return this.finalizeReview(
      review.documentId,
      []
    );
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
