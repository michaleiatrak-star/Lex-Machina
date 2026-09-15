import type {
  CompleteDocumentIngestor,
  DocumentIngestionResult,
  IngestedPage
} from "./document-ingestion.js";
import {
  chunkDocumentPages
} from "./document-ingestion.js";
import {
  LocalPolishPseudonymizer,
  PseudonymizationVault,
  type NamedEntityRecognizer,
  type PiiKind
} from "./privacy/pseudonymizer.js";

export type PublicDocumentChunk = {
  index: number;
  pageStart: number;
  pageEnd: number;
  text: string;
};

export type PublicDocumentIngestion = {
  documentId: string;
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
    reversibleLocally: true;
  };
};

export interface DocumentService {
  ingestPdf(data: Uint8Array): Promise<PublicDocumentIngestion>;
}

type PrivateDocumentRecord = {
  vault: PseudonymizationVault;
  source: DocumentIngestionResult;
};

export class LocalPrivateDocumentService
implements DocumentService {
  private readonly documents =
    new Map<string, PrivateDocumentRecord>();

  constructor(
    private readonly ingestor: CompleteDocumentIngestor,
    private readonly namedEntities: NamedEntityRecognizer,
    private readonly maxChunkChars = 24_000
  ) {}

  async ingestPdf(
    data: Uint8Array
  ): Promise<PublicDocumentIngestion> {
    const source = await this.ingestor.ingest(data);
    const vault = new PseudonymizationVault();
    const pseudonymizer =
      new LocalPolishPseudonymizer(
        vault,
        this.namedEntities
      );

    const pages: IngestedPage[] = [];
    const counts: Partial<Record<PiiKind, number>> = {};
    let findings = 0;

    for (const page of source.pages) {
      const protectedPage =
        await pseudonymizer.pseudonymize(page.text);
      findings += protectedPage.findings.length;
      for (
        const [kind, count] of Object.entries(
          protectedPage.counts
        ) as Array<[PiiKind, number]>
      ) {
        counts[kind] = (counts[kind] ?? 0) + count;
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
    const documentId =
      `doc_${source.sha256.slice(0, 24)}`;

    this.documents.set(documentId, {
      vault,
      source
    });

    return {
      documentId,
      complete: true,
      totalPages: source.totalPages,
      digitalPages: source.digitalPages,
      ocrPages: source.ocrPages,
      blankPages: source.blankPages,
      sourceChars: source.sourceChars,
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
        reversibleLocally: true
      }
    };
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
