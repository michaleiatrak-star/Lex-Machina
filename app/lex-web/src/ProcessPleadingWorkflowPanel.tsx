import {
  useEffect,
  useMemo,
  useState
} from "react";
import {
  acceptProcessPleadingWorkflowStart,
  confirmProcessPleadingCheckpoint,
  getProcessPleadingWorkflow,
  initializeProcessPleadingWorkflow,
  type ProcessPleadingCheckpoint,
  type ProcessPleadingWorkflowState
} from "./api.js";
import "./process-workflow.css";

const CHECKPOINT_ORDER: readonly ProcessPleadingCheckpoint[] = [
  "CP-1a",
  "CP-1b",
  "CP-1c-skan",
  "CP-PD",
  "CP-FSL-D",
  "CP-1c-macierz",
  "CP-1c-lancuch",
  "CP-1d-anomalie",
  "CP-1d",
  "CP-W1",
  "CP-PRE-W2",
  "CP-ATAK",
  "CP-PODMIOT",
  "CP-QUALITY",
  "CP-AUDYT",
  "CP-PEER"
];

const STAGE_LABELS: Record<
  ProcessPleadingWorkflowState["stage"],
  string
> = {
  CG_ACCEPTANCE: "Akceptacja startu",
  W1: "W1 · rama i strategia",
  PRE_W2: "PRE-W2 · weryfikacja",
  W2: "W2 · projekt i red-team",
  W3: "W3 · walidacja końcowa",
  FINAL: "FINAL"
};

function checkpointStats(
  state: ProcessPleadingWorkflowState
) {
  let closed = 0;
  let na = 0;
  let open = 0;
  for (const checkpoint of CHECKPOINT_ORDER) {
    const status =
      state.checkpoints[checkpoint];
    if (status === "CLOSED") closed += 1;
    else if (status === "NA") na += 1;
    else open += 1;
  }
  return { closed, na, open };
}

export function ProcessPleadingWorkflowPanel({
  caseId,
  forceVisible,
  refreshToken,
  canWrite,
  busy,
  onContinue
}: {
  caseId: string;
  forceVisible: boolean;
  refreshToken: number;
  canWrite: boolean;
  busy: boolean;
  onContinue: () => void;
}) {
  const [state, setState] =
    useState<ProcessPleadingWorkflowState | null>(null);
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState(false);
  const [error, setError] = useState("");

  async function refresh(): Promise<void> {
    if (!caseId) {
      setState(null);
      return;
    }
    setLoading(true);
    try {
      const result =
        await getProcessPleadingWorkflow(caseId);
      setState(result.state);
      setError("");
    } catch (problem) {
      setError(
        problem instanceof Error
          ? problem.message
          : String(problem)
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, [caseId, refreshToken]);

  const stats = useMemo(
    () => state
      ? checkpointStats(state)
      : null,
    [state]
  );

  if (!caseId) return null;
  if (!forceVisible && !state && !loading) {
    return null;
  }

  async function run(
    operationFn: () => Promise<{
      state: ProcessPleadingWorkflowState;
    }>
  ): Promise<void> {
    if (operation || !canWrite) return;
    setOperation(true);
    setError("");
    try {
      const result =
        await operationFn();
      setState(result.state);
    } catch (problem) {
      setError(
        problem instanceof Error
          ? problem.message
          : String(problem)
      );
    } finally {
      setOperation(false);
    }
  }

  const locked =
    operation ||
    busy ||
    !canWrite;

  return (
    <section className="process-workflow-panel">
      <div className="process-workflow-heading">
        <div>
          <p className="eyebrow">
            Deterministyczny pipeline pisma
          </p>
          <h3>
            {state
              ? STAGE_LABELS[state.stage]
              : "Pisma procesowe v3"}
          </h3>
        </div>
        <span
          className={
            state?.documentStatus === "FINAL"
              ? "process-workflow-status final"
              : "process-workflow-status"
          }
        >
          {state?.documentStatus ?? "NIEAKTYWNY"}
        </span>
      </div>

      {!state ? (
        <>
          <p>
            To zadanie wymaga wieloturowego pipeline W1 → PRE-W2 → W2 → W3.
            Runtime zapisuje checkpointy w zaszyfrowanym stanie tej sprawy i
            nie pozwala przejść dalej bez wymaganych potwierdzeń.
          </p>
          <button
            type="button"
            disabled={locked}
            onClick={() =>
              void run(() =>
                initializeProcessPleadingWorkflow(
                  caseId,
                  "CHECKPOINT"
                )
              )
            }
          >
            Uruchom pipeline w trybie checkpoint
          </button>
        </>
      ) : state.stage === "CG_ACCEPTANCE" ? (
        <>
          <p>
            Pipeline ma wiele etapów kontroli jakości. Dokument pozostaje
            DRAFT, dopóki cały wymagany rejestr CP nie zostanie rozwiązany.
            Każde przejście jest zapisywane w zaszyfrowanym workspace sprawy.
          </p>
          <button
            type="button"
            disabled={locked}
            onClick={() =>
              void run(() =>
                acceptProcessPleadingWorkflowStart(
                  caseId
                )
              )
            }
          >
            Akceptuję warunki i rozpoczynam W1
          </button>
        </>
      ) : (
        <>
          <div className="process-workflow-stats">
            <span>
              Zamknięte: {stats?.closed ?? 0}
            </span>
            <span>
              N/A: {stats?.na ?? 0}
            </span>
            <span>
              Otwarte / oczekujące: {stats?.open ?? 0}
            </span>
            <span>
              Rewizja: {state.revision}
            </span>
          </div>

          {state.pendingCheckpoint ? (
            <div className="process-workflow-checkpoint">
              <strong>
                Oczekuje na potwierdzenie: {state.pendingCheckpoint}
              </strong>
              <p>
                Runtime nie uruchomi następnego checkpointu, dopóki nie
                potwierdzisz wyniku bieżącego kroku.
              </p>
              <button
                type="button"
                disabled={locked}
                onClick={() =>
                  void run(() =>
                    confirmProcessPleadingCheckpoint(
                      caseId,
                      state.pendingCheckpoint!
                    )
                  )
                }
              >
                Potwierdź checkpoint i odblokuj kolejny krok
              </button>
            </div>
          ) : state.stage === "FINAL" ? (
            <p className="process-workflow-final">
              Wszystkie wymagane checkpointy są rozwiązane. Status procesu:
              FINAL.
            </p>
          ) : (
            <div className="process-workflow-checkpoint">
              <strong>
                Etap gotowy do następnego checkpointu
              </strong>
              <p>
                Kolejne wykonanie zostanie związane przez runtime z pierwszym
                nierozwiązanym CP w kanonicznej kolejności. Model nie może
                przeskoczyć do późniejszego etapu.
              </p>
              <button
                type="button"
                disabled={locked}
                onClick={onContinue}
              >
                Kontynuuj pipeline
              </button>
            </div>
          )}
        </>
      )}

      {!canWrite ? (
        <small>
          Sprawa jest tylko do odczytu albo Twoja rola nie pozwala zmieniać
          stanu pipeline.
        </small>
      ) : null}
      {loading ? (
        <small>Odświeżam stan procesu…</small>
      ) : null}
      {error ? (
        <p className="process-workflow-error">
          {error}
        </p>
      ) : null}
    </section>
  );
}
