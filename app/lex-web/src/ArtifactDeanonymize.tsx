import { useState } from "react";
import {
  createDeanonymizationIntent,
  downloadSensitiveArtifact,
  finalizeDeanonymization,
  previewDeanonymization,
  reauthorizeDeanonymization,
  saveNameForm,
  type CaseArtifact,
  type DeanonymizationPreview
} from "./api.js";
import { DeanonymizationReview, applyAliasCorrection } from "./DeanonymizationReview.js";

function finalName(filename: string): string {
  const dot = filename.lastIndexOf(".");
  const stem = (dot > 0 ? filename.slice(0, dot) : filename).replace(/[-_ ]?tokenized$/i, "");
  return `${stem} (deanonimizowany)${dot > 0 ? filename.slice(dot) : ""}`;
}

function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

/**
 * Deanonymizes a model-made document with placeholders, the same way as in
 * chat: the password confirms that personal data may be put back, then the
 * values come from the case key automatically. The preview is optional.
 */
export function ArtifactDeanonymize(props: {
  caseId: string;
  artifact: CaseArtifact;
  onDone: (message: string) => void;
  onCancel: () => void;
}) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [review, setReview] = useState<{
    grantId: string;
    preview: DeanonymizationPreview;
    overrides: Record<string, string>;
  } | null>(null);
  const [ticket, setTicket] = useState<{ ticketId: string; filename: string } | null>(null);

  async function authorize(): Promise<string> {
    const intent = await createDeanonymizationIntent(props.caseId, props.artifact.artifactId);
    const authorized = await reauthorizeDeanonymization(intent.intent.intentId, password);
    setPassword("");
    return authorized.grant.grantId;
  }

  async function finalize(grantId: string, overrides: Record<string, string>): Promise<void> {
    const final = await finalizeDeanonymization(grantId, finalName(props.artifact.filename), overrides);
    const unresolved = (final.restorations ?? []).filter((item) => item.status === "unresolved").length;
    const toCheck = (final.restorations ?? []).filter(
      (item) => item.status !== "ok" && item.status !== "unresolved"
    ).length;
    if (final.downloadTicket) setTicket({ ticketId: final.downloadTicket.ticketId, filename: final.artifact.filename });
    props.onDone(
      `Utworzono „${final.artifact.filename}” (${final.replacements} podstawień) i zapisano w aktach sprawy.` +
        (toCheck ? ` Formy do sprawdzenia: ${toCheck} - użyj podglądu.` : "") +
        (unresolved ? ` Symbole spoza klucza: ${unresolved}.` : "")
    );
  }

  async function run(action: () => Promise<void>): Promise<void> {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (failure) {
      const code = failure instanceof Error ? failure.message : String(failure);
      setError(
        /REAUTH|PASSWORD|INVALID_CREDENTIALS/.test(code)
          ? `Nie potwierdzono hasła (${code}).`
          : `Nie udało się deanonimizować: ${code}`
      );
      if (/REAUTH_GRANT_(EXPIRED|ALREADY_USED)/.test(code)) setReview(null);
    } finally {
      setBusy(false);
    }
  }

  if (ticket) {
    return (
      <div className="artifact-deanonymize">
        <p>Plik z przywróconymi danymi jest w aktach sprawy.</p>
        <button
          type="button"
          onClick={() =>
            void run(async () => {
              saveBlob(await downloadSensitiveArtifact(ticket.ticketId), ticket.filename);
              setTicket(null);
              props.onCancel();
            })
          }
        >
          Pobierz teraz (jednorazowo)
        </button>
        <button type="button" onClick={props.onCancel}>Zamknij</button>
        {error ? <p className="chat-inline-error">{error}</p> : null}
      </div>
    );
  }

  if (review) {
    return (
      <div className="artifact-deanonymize">
        <DeanonymizationReview
          preview={review.preview}
          busy={busy}
          onCorrect={async (restoration, text, remember) => {
            if (remember && restoration.canonical && restoration.gender && restoration.case) {
              await saveNameForm({
                canonical: restoration.canonical,
                gender: restoration.gender,
                case: restoration.case,
                text: text.trim()
              });
            }
            setReview((current) =>
              current
                ? {
                    ...current,
                    preview: applyAliasCorrection(current.preview, restoration.alias, text),
                    overrides: { ...current.overrides, [restoration.alias]: text.trim() }
                  }
                : current
            );
          }}
          onConfirm={() => void run(() => finalize(review.grantId, review.overrides))}
          onCancel={() => setReview(null)}
        />
        {error ? <p className="chat-inline-error">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="artifact-deanonymize">
      <p>
        Dane wrócą z klucza tej sprawy automatycznie, w przypadkach podanych przez model. Hasło potwierdza
        odtworzenie danych osobowych; plik z symbolami zostaje bez zmian.
      </p>
      <div className="chat-form-row compact">
        <input
          type="password"
          aria-label="Hasło do deanonimizacji"
          placeholder="Hasło"
          value={password}
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && password) void run(async () => finalize(await authorize(), {}));
          }}
        />
        <button
          type="button"
          className="chat-primary-action"
          disabled={busy || !password}
          onClick={() => void run(async () => finalize(await authorize(), {}))}
        >
          {busy ? "Deanonimizuję…" : "Deanonimizuj"}
        </button>
        <button
          type="button"
          disabled={busy || !password}
          onClick={() =>
            void run(async () => {
              const grantId = await authorize();
              setReview({ grantId, preview: await previewDeanonymization(grantId), overrides: {} });
            })
          }
        >
          Podgląd przed deanonimizacją
        </button>
        <button type="button" disabled={busy} onClick={props.onCancel}>Anuluj</button>
      </div>
      {error ? <p className="chat-inline-error">{error}</p> : null}
    </div>
  );
}
