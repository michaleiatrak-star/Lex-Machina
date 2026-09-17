import {
  useEffect,
  useMemo,
  useState
} from "react";
import {
  apiBase,
  archiveCase,
  createCase,
  deleteCase,
  listCases,
  renameCase,
  unarchiveCase,
  type AuthenticatedUser,
  type CaseListItem
} from "./api.js";
import {
  AUTO_CASE_TYPE,
  labelForSkill,
  setCaseTypeExecutionSkill,
  type PublicSkillDescriptor
} from "./chat-routing.js";
import "./case-controls.css";

const KNOWN_EXECUTION_SKILLS = new Set([
  "analiza-sadowa-v6",
  "analizator-dowodow-v3",
  "analizator-przepisow-v2",
  "analizator-umow-v1",
  "chronologia-sprawy-v1",
  "orzeczenia-sadowe-v2",
  "pisma-procesowe-v3",
  "pisma-proste-v2",
  "przesluchanie-swiadkow-v2-min90",
  "przewodnik-prawny-v2",
  "raport-klienta-v1",
  "raport-sytuacyjny-v2"
]);

function isExecutionSkill(skill: PublicSkillDescriptor): boolean {
  return (
    skill.category === "execution" ||
    skill.type?.toLowerCase().startsWith("executive-") === true ||
    KNOWN_EXECUTION_SKILLS.has(skill.name)
  );
}

export default function CaseControls({
  user,
  onCasesChanged
}: {
  user: AuthenticatedUser;
  onCasesChanged: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [caseType, setCaseType] = useState(AUTO_CASE_TYPE);
  const [skills, setSkills] = useState<PublicSkillDescriptor[]>([]);
  const [cases, setCases] = useState<CaseListItem[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [newCaseName, setNewCaseName] = useState("");
  const [renameValue, setRenameValue] = useState("");
  const [deletePhrase, setDeletePhrase] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const matterCases = useMemo(
    () => cases.filter((item) => item.caseKind !== "FIRM_KNOWLEDGE"),
    [cases]
  );
  const selectedCase = useMemo(
    () => matterCases.find((item) => item.caseId === selectedCaseId),
    [matterCases, selectedCaseId]
  );
  const executionSkills = useMemo(
    () => skills
      .filter(isExecutionSkill)
      .sort((left, right) =>
        labelForSkill(left.name).localeCompare(
          labelForSkill(right.name),
          "pl"
        )
      ),
    [skills]
  );

  async function refreshCases(preferred?: string): Promise<void> {
    const response = await listCases();
    setCases(response.cases);
    const matters = response.cases.filter(
      (item) => item.caseKind !== "FIRM_KNOWLEDGE"
    );
    const next =
      matters.find((item) => item.caseId === preferred) ??
      matters.find((item) => !item.archivedAt) ??
      matters[0];
    setSelectedCaseId(next?.caseId ?? "");
    setRenameValue(next?.displayName ?? "");
  }

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      listCases(),
      fetch(`${apiBase()}/api/skills`, {
        headers: { Accept: "application/json" }
      }).then(async (response) => {
        if (!response.ok) throw new Error(`HTTP_${response.status}`);
        return await response.json() as { skills?: PublicSkillDescriptor[] };
      })
    ])
      .then(([caseResponse, skillResponse]) => {
        if (cancelled) return;
        setCases(caseResponse.cases);
        const matters = caseResponse.cases.filter(
          (item) => item.caseKind !== "FIRM_KNOWLEDGE"
        );
        const next =
          matters.find((item) => !item.archivedAt) ?? matters[0];
        setSelectedCaseId(next?.caseId ?? "");
        setRenameValue(next?.displayName ?? "");
        if (Array.isArray(skillResponse.skills)) {
          setSkills(skillResponse.skills);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : String(error));
        }
      });
    return () => {
      cancelled = true;
      setCaseTypeExecutionSkill("");
    };
  }, []);

  useEffect(() => {
    setCaseTypeExecutionSkill(
      caseType === AUTO_CASE_TYPE ? "" : caseType
    );
  }, [caseType]);

  useEffect(() => {
    setRenameValue(selectedCase?.displayName ?? "");
    setDeletePhrase("");
    setDeletePassword("");
  }, [selectedCase?.caseId, selectedCase?.displayName]);

  async function runCaseAction(action: () => Promise<unknown>, success: string): Promise<void> {
    setBusy(true);
    setMessage("");
    try {
      await action();
      await refreshCases(selectedCaseId);
      onCasesChanged();
      setMessage(success);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="case-controls" aria-label="Typ i sterowanie sprawą">
      <div className="case-controls-primary">
        <label>
          <span>Typ sprawy</span>
          <select
            value={caseType}
            onChange={(event) => setCaseType(event.target.value)}
            aria-label="Typ sprawy według skilla wykonawczego"
          >
            <option value={AUTO_CASE_TYPE}>
              Automatyczny — dobierz skill wykonawczy
            </option>
            {executionSkills.map((skill) => (
              <option key={skill.name} value={skill.name}>
                {labelForSkill(skill.name)}
              </option>
            ))}
          </select>
        </label>
        <small>
          {caseType === AUTO_CASE_TYPE
            ? "System analizuje wiadomość i sam wybiera właściwy skill wykonawczy."
            : `Wymuszony skill: ${labelForSkill(caseType)}.`}
        </small>
      </div>

      <button
        type="button"
        className="case-controls-toggle"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
      >
        {expanded ? "Ukryj sterowanie sprawą" : "Sterowanie sprawą"}
      </button>

      {expanded ? (
        <div className="case-controls-panel">
          <div className="case-controls-row">
            <label>
              Wybierz sprawę
              <select
                value={selectedCaseId}
                onChange={(event) => setSelectedCaseId(event.target.value)}
              >
                <option value="">— Wybierz sprawę —</option>
                {matterCases.map((item) => (
                  <option key={item.caseId} value={item.caseId}>
                    {item.displayName || item.caseId}
                    {item.archivedAt ? " · ARCHIWALNA (tylko odczyt)" : ""}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Nowa sprawa
              <input
                value={newCaseName}
                maxLength={160}
                placeholder="Nazwa sprawy"
                onChange={(event) => setNewCaseName(event.target.value)}
              />
            </label>
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                void runCaseAction(
                  async () => {
                    const created = await createCase(newCaseName.trim() || undefined);
                    setNewCaseName("");
                    setSelectedCaseId(created.caseId);
                  },
                  "Utworzono sprawę."
                )
              }
            >
              Utwórz sprawę
            </button>
          </div>

          {selectedCase ? (
            <>
              <div className="case-controls-row">
                <label>
                  Nazwa sprawy
                  <input
                    value={renameValue}
                    maxLength={160}
                    disabled={busy || Boolean(selectedCase.archivedAt)}
                    onChange={(event) => setRenameValue(event.target.value)}
                  />
                </label>
                <button
                  type="button"
                  disabled={
                    busy ||
                    Boolean(selectedCase.archivedAt) ||
                    !renameValue.trim()
                  }
                  onClick={() =>
                    void runCaseAction(
                      () => renameCase(selectedCase.caseId, renameValue.trim()),
                      "Zmieniono nazwę sprawy."
                    )
                  }
                >
                  Zmień nazwę
                </button>
                {selectedCase.archivedAt ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      void runCaseAction(
                        () => unarchiveCase(selectedCase.caseId),
                        "Przywrócono sprawę z archiwum."
                      )
                    }
                  >
                    Przywróć z archiwum
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      void runCaseAction(
                        () => archiveCase(selectedCase.caseId),
                        "Zarchiwizowano sprawę."
                      )
                    }
                  >
                    Archiwizuj sprawę
                  </button>
                )}
              </div>

              {selectedCase.role === "OWNER" && user.appRole === "ADMIN" ? (
                <details className="case-controls-danger">
                  <summary>Trwałe usunięcie sprawy</summary>
                  <p>
                    Wpisz USUŃ i podaj aktualne hasło, aby odblokować operację.
                  </p>
                  <div className="case-controls-row">
                    <input
                      value={deletePhrase}
                      placeholder="Wpisz USUŃ"
                      onChange={(event) => setDeletePhrase(event.target.value)}
                    />
                    <input
                      type="password"
                      value={deletePassword}
                      placeholder="Aktualne hasło"
                      autoComplete="current-password"
                      onChange={(event) => setDeletePassword(event.target.value)}
                    />
                    <button
                      type="button"
                      className="case-controls-delete"
                      disabled={
                        busy ||
                        deletePhrase !== "USUŃ" ||
                        !deletePassword
                      }
                      onClick={() =>
                        void runCaseAction(
                          () => deleteCase(selectedCase.caseId, deletePassword),
                          "Usunięto sprawę trwale."
                        )
                      }
                    >
                      Usuń sprawę trwale
                    </button>
                  </div>
                </details>
              ) : null}
            </>
          ) : null}

          {message ? <small className="case-controls-message">{message}</small> : null}
        </div>
      ) : null}
    </section>
  );
}
