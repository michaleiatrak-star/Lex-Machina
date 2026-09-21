import {
  useEffect,
  useMemo,
  useState
} from "react";
import {
  createDeanonymizationIntent,
  downloadSensitiveArtifact,
  finalizeDeanonymization,
  generateLegalDocument,
  listCaseTemplates,
  reauthorizeDeanonymization,
  isDesktopShell,
  type CaseListItem,
  type DocumentAttachmentSelection,
  type GeneratedDocumentResponse,
  type LegalDocumentFormat,
  type LegalDocumentType,
  type LegalStyleProfile,
  type ProviderId,
  type SharedTemplateManifest
} from "./api.js";

export function DocumentAuthoringPanel({
  currentCase,
  provider,
  providerConfigured,
  model,
  primarySkill,
  routeValid,
  query,
  attachments
}: {
  currentCase?:
    CaseListItem;
  provider:
    ProviderId;
  providerConfigured:
    boolean;
  model: string;
  primarySkill: string;
  routeValid: boolean;
  query: string;
  attachments:
    DocumentAttachmentSelection[];
}) {
  const [format, setFormat] =
    useState<
      LegalDocumentFormat
    >("docx");
  const [
    documentType,
    setDocumentType
  ] = useState<
    LegalDocumentType
  >("letter");
  const [
    styleProfile,
    setStyleProfile
  ] = useState<
    LegalStyleProfile
  >(
    "lex-classic-clean-v1"
  );
  const [
    templates,
    setTemplates
  ] = useState<
    SharedTemplateManifest[]
  >([]);
  const [
    templateId,
    setTemplateId
  ] = useState("");
  const [
    generated,
    setGenerated
  ] = useState<
    GeneratedDocumentResponse | null
  >(null);
  const [password, setPassword] =
    useState("");
  const [busy, setBusy] =
    useState(false);
  const [error, setError] =
    useState("");
  const [message, setMessage] =
    useState("");

  useEffect(() => {
    let cancelled = false;
    setTemplates([]);
    setTemplateId("");
    setGenerated(null);
    setPassword("");
    setError("");
    setMessage("");

    if (!currentCase) {
      return () => {
        cancelled = true;
      };
    }

    void listCaseTemplates(
      currentCase.caseId
    )
      .then((result) => {
        if (!cancelled) {
          setTemplates(
            result.templates
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTemplates([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentCase?.caseId]);

  const mayGenerate =
    Boolean(
      currentCase &&
      !currentCase.archivedAt &&
      (
        currentCase.role ===
          "OWNER" ||
        currentCase.role ===
          "EDITOR"
      )
    );

  const generationReady =
    mayGenerate &&
    providerConfigured &&
    Boolean(model) &&
    routeValid &&
    Boolean(
      query.trim()
    ) &&
    attachments.length > 0;

  const finalizationReady =
    Boolean(
      generated &&
      currentCase
        ?.canReidentify &&
      (
        isDesktopShell() ||
        password
      )
    );

  const selectedTemplate =
    useMemo(
      () =>
        templates.find(
          (item) =>
            item.templateId ===
              templateId
        ),
      [
        templates,
        templateId
      ]
    );

  async function generate():
    Promise<void> {
    if (
      !currentCase ||
      !generationReady ||
      busy
    ) {
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    setGenerated(null);
    setPassword("");

    try {
      const result =
        await generateLegalDocument(
          currentCase.caseId,
          {
            query:
              query.trim(),
            provider,
            model,
            primarySkill,
            mode: "PRAWNIK",
            format,
            documentType,
            ...(templateId
              ? {
                  templateId
                }
              : {
                  styleProfile
                }),
            attachments,
            filename:
              "lex-machina-tokenized." +
              format
          }
        );
      setGenerated(
        result
      );
      setMessage(
        "Tokenizowany dokument przeszedł lokalny renderer i został zapisany w zaszyfrowanym magazynie sprawy."
      );
    } catch (value) {
      setError(
        value instanceof Error
          ? value.message
          : String(value)
      );
    } finally {
      setBusy(false);
    }
  }

  async function finalizeAndDownload():
    Promise<void> {
    if (
      !currentCase ||
      !generated ||
      !finalizationReady ||
      busy
    ) {
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");
    try {
      const intent =
        await createDeanonymizationIntent(
          currentCase.caseId,
          generated.artifact
            .artifactId
        );
      const authorized =
        await reauthorizeDeanonymization(
          intent.intent
            .intentId,
          password
        );
      setPassword("");

      const final =
        await finalizeDeanonymization(
          authorized.grant
            .grantId,
          "LexMachina-final." +
            generated.format
        );

      if (
        !final.downloadTicket
      ) {
        throw new Error(
          "SENSITIVE_DOWNLOAD_TICKET_MISSING"
        );
      }

      const blob =
        await downloadSensitiveArtifact(
          final.downloadTicket
            .ticketId
        );
      const url =
        URL.createObjectURL(
          blob
        );
      try {
        const anchor =
          document.createElement(
            "a"
          );
        anchor.href = url;
        anchor.download =
          final.artifact
            .filename;
        anchor.rel =
          "noreferrer";
        document.body.appendChild(
          anchor
        );
        anchor.click();
        anchor.remove();
      } finally {
        URL.revokeObjectURL(
          url
        );
      }

      setGenerated(null);
      setMessage(
        "Finalny dokument przeszedł HYBRID, G8 i G10. Jednorazowy ticket pobrania został zużyty."
      );
    } catch (value) {
      setPassword("");
      setError(
        value instanceof Error
          ? value.message
          : String(value)
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="authoring-panel">
      <div className="authoring-heading">
        <div>
          <p className="eyebrow">
            Dokument końcowy
          </p>
          <h3>
            DOCX / ODT z lokalną deanonymizacją
          </h3>
          <p>
            Model zwraca wyłącznie semantyczny AST i aliasy PII. Pakiet Office powstaje lokalnie, a jawne dane są przywracane dopiero po ponownym podaniu hasła.
          </p>
        </div>
        <span className="security-pill">
          G31 + G34F
        </span>
      </div>

      {!mayGenerate && (
        <p className="field-help">
          Generowanie wymaga aktywnej sprawy i roli OWNER lub EDITOR.
        </p>
      )}

      <div className="authoring-grid">
        <label>
          Format
          <select
            value={format}
            disabled={
              busy ||
              !mayGenerate
            }
            onChange={(event) =>
              setFormat(
                event.target
                  .value as
                  LegalDocumentFormat
              )
            }
          >
            <option value="docx">
              DOCX
            </option>
            <option value="odt">
              ODT
            </option>
          </select>
        </label>

        <label>
          Typ dokumentu
          <select
            value={
              documentType
            }
            disabled={
              busy ||
              !mayGenerate
            }
            onChange={(event) =>
              setDocumentType(
                event.target
                  .value as
                  LegalDocumentType
              )
            }
          >
            <option value="pleading">
              Pismo procesowe
            </option>
            <option value="contract">
              Umowa
            </option>
            <option value="opinion">
              Opinia
            </option>
            <option value="letter">
              Pismo / list
            </option>
            <option value="report">
              Raport
            </option>
            <option value="other">
              Inny
            </option>
          </select>
        </label>

        <label>
          Wzór kancelarii
          <select
            value={
              templateId
            }
            disabled={
              busy ||
              !mayGenerate
            }
            onChange={(event) =>
              setTemplateId(
                event.target
                  .value
              )
            }
          >
            <option value="">
              — bez wzoru —
            </option>
            {templates.map(
              (template) => (
                <option
                  key={
                    template
                      .templateId
                  }
                  value={
                    template
                      .templateId
                  }
                >
                  {
                    template
                      .filename
                  }
                </option>
              )
            )}
          </select>
        </label>

        <label>
          Profil stylu
          <select
            value={
              styleProfile
            }
            disabled={
              busy ||
              !mayGenerate ||
              Boolean(
                templateId
              )
            }
            onChange={(event) =>
              setStyleProfile(
                event.target
                  .value as
                  LegalStyleProfile
              )
            }
          >
            <option value="lex-classic-clean-v1">
              Lex Classic Clean
            </option>
            <option value="lex-light-legal-design-v1">
              Lex Light Legal Design
            </option>
            <option value="lex-classic-tnr-v1">
              Lex Classic TNR
            </option>
          </select>
        </label>
      </div>

      {selectedTemplate && (
        <p className="field-help">
          Wybrano wzór: {
            selectedTemplate
              .filename
          }. Backend użyje wyłącznie lokalnie wyekstrahowanego, zatwierdzonego profilu stylu; treść i XML wzoru nie są wysyłane do providera.
        </p>
      )}

      <p className="field-help">
        Źródła: {
          attachments.length
        } dokument(ów), maksymalnie 32 wybrane chunki na dokument. Generowanie używa aktualnego providera, modelu i zweryfikowanego routingu.
      </p>

      <button
        type="button"
        className="primary-button"
        disabled={
          busy ||
          !generationReady
        }
        onClick={() => {
          void generate();
        }}
      >
        {busy
          ? "Przetwarzanie…"
          : "Wygeneruj tokenizowany dokument"}
      </button>

      {generated && (
        <div className="authoring-finalize">
          <p>
            Tokenizowany {
              generated.format
                .toUpperCase()
            } jest gotowy. Hash: {
              (
                generated.tokenizedSha256 ??
                generated.sha256 ??
                generated.artifact.sha256
              ).slice(0, 16)
            }…
          </p>
          {currentCase
            ?.canReidentify ? (
            <>
              {isDesktopShell() ? (
                <p className="auth-copy">
                  Jednorazowa reautoryzacja zostanie wykonana natywnie przez magazyn poświadczeń Windows. Hasło nie trafia do Reacta.
                </p>
              ) : (
                <label>
                  Bieżące hasło — jednorazowa reautoryzacja
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={
                      password
                    }
                    disabled={
                      busy
                    }
                    onChange={(event) =>
                      setPassword(
                        event.target
                          .value
                      )
                    }
                  />
                </label>
              )}
              <button
                type="button"
                className="primary-button"
                disabled={
                  busy ||
                  !finalizationReady
                }
                onClick={() => {
                  void finalizeAndDownload();
                }}
              >
                Przywróć dane i pobierz finalny plik
              </button>
            </>
          ) : (
            <p className="field-error">
              Twoje ACL nie zezwala na reidentyfikację i eksport dokumentu z jawnymi danymi.
            </p>
          )}
        </div>
      )}

      {message && (
        <p className="field-help">
          {message}
        </p>
      )}
      {error && (
        <p className="field-error">
          {error}
        </p>
      )}
    </section>
  );
}
