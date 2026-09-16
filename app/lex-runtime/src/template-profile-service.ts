import {
  DOCX_MEDIA_TYPE,
  ODT_MEDIA_TYPE,
  type LocalSharedTemplateStore
} from "./shared-template-store.js";
import {
  LocalLegalDocumentRenderer,
  type LegalDocumentFormat
} from "./legal-document-renderer.js";
import type { LegalStyleProfile } from "./legal-document-ast.js";

export type SafeTemplateProfile = {
  templateId: string;
  sourceFormat: LegalDocumentFormat;
  styleProfile: LegalStyleProfile;
  sourceSha256: string;
};

export class LocalTemplateProfileService {
  constructor(
    private readonly templates: Pick<LocalSharedTemplateStore, "readTemplate">,
    private readonly renderer = new LocalLegalDocumentRenderer()
  ) {}

  async resolve(templateId: string): Promise<SafeTemplateProfile> {
    const template = await this.templates.readTemplate(templateId);
    const format: LegalDocumentFormat =
      template.manifest.mediaType === DOCX_MEDIA_TYPE
        ? "docx"
        : template.manifest.mediaType === ODT_MEDIA_TYPE
          ? "odt"
          : (() => { throw new Error("TEMPLATE_FORMAT_UNSUPPORTED"); })();
    try {
      const profile = await this.renderer.extractStyleProfile(
        format,
        template.data
      );
      return {
        templateId,
        sourceFormat: profile.sourceFormat,
        styleProfile: profile.styleProfile,
        sourceSha256: template.manifest.sha256
      };
    } finally {
      template.data.fill(0);
    }
  }
}
