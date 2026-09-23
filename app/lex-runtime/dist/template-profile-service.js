import { DOCX_MEDIA_TYPE, ODT_MEDIA_TYPE } from "./shared-template-store.js";
import { LocalLegalDocumentRenderer } from "./legal-document-renderer.js";
export class LocalTemplateProfileService {
    templates;
    renderer;
    constructor(templates, renderer = new LocalLegalDocumentRenderer()) {
        this.templates = templates;
        this.renderer = renderer;
    }
    async resolve(templateId) {
        const template = await this.templates.readTemplate(templateId);
        const format = template.manifest.mediaType === DOCX_MEDIA_TYPE
            ? "docx"
            : template.manifest.mediaType === ODT_MEDIA_TYPE
                ? "odt"
                : (() => { throw new Error("TEMPLATE_FORMAT_UNSUPPORTED"); })();
        try {
            const profile = await this.renderer.extractStyleProfile(format, template.data);
            return {
                templateId,
                sourceFormat: profile.sourceFormat,
                styleProfile: profile.styleProfile,
                sourceSha256: template.manifest.sha256
            };
        }
        finally {
            template.data.fill(0);
        }
    }
}
