import {
  useEffect,
  useState
} from "react";
import {
  listCaseFiles,
  listCaseTemplates,
  uploadSharedTemplate,
  type SharedTemplateManifest,
  type StoredUploadResponse
} from "./api.js";

export function CaseWorkspacePanel({
  caseId,
  isAdmin,
  refreshToken
}: {
  caseId: string;
  isAdmin: boolean;
  refreshToken: number;
}) {
  const [uploads, setUploads] =
    useState<StoredUploadResponse[]>([]);
  const [templates, setTemplates] =
    useState<SharedTemplateManifest[]>([]);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;
    if (!caseId) {
      setUploads([]);
      setTemplates([]);
      return;
    }

    setLoading(true);
    setError("");
    Promise.all([
      listCaseFiles(caseId),
      listCaseTemplates(caseId)
    ])
      .then(([files, library]) => {
        if (cancelled) return;
        setUploads(files.uploads);
        setTemplates(
          library.templates
        );
      })
      .catch((failure) => {
        if (cancelled) return;
        setError(
          failure instanceof Error
            ? failure.message
            : String(failure)
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [caseId, refreshToken]);

  async function addTemplate(
    file: File | undefined
  ): Promise<void> {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      await uploadSharedTemplate(
        file
      );
      const library =
        await listCaseTemplates(
          caseId
        );
      setTemplates(
        library.templates
      );
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : String(failure)
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="case-workspace-browser">
      <div className="case-workspace-column">
        <p className="eyebrow">
          Akta wybranej sprawy
        </p>
        <h3>Dokumenty sprawy</h3>
        <p className="field-help">
          Lista pochodzi wyłącznie z katalogu aktualnie wybranej sprawy.
        </p>

        {!caseId ? (
          <p className="workspace-empty">
            Najpierw wybierz sprawę.
          </p>
        ) : uploads.length === 0 ? (
          <p className="workspace-empty">
            Brak zapisanych dokumentów.
          </p>
        ) : (
          <ul className="workspace-file-list">
            {uploads.map((item) => (
              <li key={item.uploadId}>
                <strong>
                  {item.filename}
                </strong>
                <span>
                  {item.mediaType} ·{" "}
                  {item.bytes.toLocaleString(
                    "pl-PL"
                  )} B ·{" "}
                  {item.storedAt.slice(
                    0,
                    16
                  ).replace("T", " ")}
                </span>
                {item.archive &&
                  item.extracted.length >
                    0 && (
                    <small>
                      ZIP:{" "}
                      {item.extracted
                        .slice(0, 6)
                        .map(
                          (entry) =>
                            entry.relativePath
                        )
                        .join(", ")}
                      {item.extracted
                        .length > 6
                        ? "…"
                        : ""}
                    </small>
                  )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="case-workspace-column">
        <p className="eyebrow">
          Katalog wspólny
        </p>
        <h3>Wzory kancelarii</h3>
        <p className="field-help">
          Jeden wzór jest przechowywany raz i może być referencjonowany z każdej sprawy, do której użytkownik ma dostęp.
        </p>

        {isAdmin && caseId && (
          <label className="file-button workspace-template-upload">
            {loading
              ? "Zapisywanie…"
              : "Dodaj wzór DOCX/ODT"}
            <input
              type="file"
              accept=".docx,.odt,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text"
              disabled={loading}
              onChange={(event) => {
                void addTemplate(
                  event.target
                    .files?.[0]
                );
                event.currentTarget
                  .value = "";
              }}
            />
          </label>
        )}

        {templates.length === 0 ? (
          <p className="workspace-empty">
            Brak wspólnych wzorów.
          </p>
        ) : (
          <ul className="workspace-file-list">
            {templates.map(
              (template) => (
                <li
                  key={
                    template.templateId
                  }
                >
                  <strong>
                    {template.filename}
                  </strong>
                  <span>
                    WSPÓLNY ·{" "}
                    {template.bytes.toLocaleString(
                      "pl-PL"
                    )} B
                  </span>
                  <small>
                    {template.generationReady
                      ? "gotowy do generatora"
                      : "biblioteka gotowa; integracja z generatorem w G35C"}
                  </small>
                </li>
              )
            )}
          </ul>
        )}
      </div>

      {error && (
        <div className="alert alert-error case-workspace-error">
          {error}
        </div>
      )}
    </section>
  );
}
