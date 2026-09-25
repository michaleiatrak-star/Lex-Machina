import { useEffect, useState } from "react";
import {
  addCaseContact,
  deleteCaseContact,
  listCaseContacts,
  type CaseContact,
  type CaseContactKind
} from "./api.js";

const EMPTY_DRAFT = {
  kind: "PERSON" as CaseContactKind,
  name: "",
  role: "",
  phone: "",
  email: "",
  address: "",
  notes: ""
};

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Persons and organizations of one case, kept in its encrypted data. */
export function CaseContactsCard({
  caseId,
  canWrite
}: {
  caseId: string | null;
  canWrite: boolean;
}) {
  const [contacts, setContacts] = useState<CaseContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState(EMPTY_DRAFT);

  useEffect(() => {
    let cancelled = false;
    setError("");
    setContacts([]);
    if (!caseId) return;
    setLoading(true);
    void listCaseContacts(caseId)
      .then((result) => {
        if (!cancelled) setContacts(result.contacts);
      })
      .catch((failure) => {
        if (!cancelled) setError(errorText(failure));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [caseId]);

  async function save(): Promise<void> {
    if (!caseId || !canWrite || busy || !draft.name.trim()) return;
    setBusy(true);
    setError("");
    try {
      const optional = (value: string) => value.trim() || undefined;
      const created = await addCaseContact(caseId, {
        kind: draft.kind,
        name: draft.name.trim(),
        ...(optional(draft.role) ? { role: optional(draft.role) } : {}),
        ...(optional(draft.phone) ? { phone: optional(draft.phone) } : {}),
        ...(optional(draft.email) ? { email: optional(draft.email) } : {}),
        ...(optional(draft.address) ? { address: optional(draft.address) } : {}),
        ...(optional(draft.notes) ? { notes: optional(draft.notes) } : {})
      });
      setContacts((current) =>
        [...current, created].sort((left, right) => left.name.localeCompare(right.name, "pl"))
      );
      setDraft({ ...EMPTY_DRAFT, kind: draft.kind });
    } catch (failure) {
      setError(
        errorText(failure) === "INVALID_CASE_ACCESS_REQUEST"
          ? "Sprawdź nazwę, numer telefonu i adres e-mail."
          : errorText(failure)
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove(contactId: string): Promise<void> {
    if (!caseId || !canWrite || busy) return;
    setBusy(true);
    setError("");
    try {
      await deleteCaseContact(caseId, contactId);
      setContacts((current) => current.filter((item) => item.contactId !== contactId));
    } catch (failure) {
      setError(errorText(failure));
    } finally {
      setBusy(false);
    }
  }

  const disabled = !caseId || !canWrite || busy;
  const field = (key: keyof typeof EMPTY_DRAFT) => ({
    value: draft[key],
    disabled,
    onChange: (event: { target: { value: string } }) =>
      setDraft((current) => ({ ...current, [key]: event.target.value }))
  });

  return (
    <article className="chat-card matter-schedule-card">
      <p className="eyebrow">Osoby i organizacje</p>
      <h2>Kontakty w sprawie</h2>
      <p>
        Klient, strony, pełnomocnicy, sąd, biegli. Dane są przechowywane w zaszyfrowanych
        danych sprawy; OWNER i EDITOR mogą dopisywać oraz usuwać wpisy.
      </p>

      <div className="matter-schedule-form">
        <div className="chat-form-row">
          <select aria-label="Rodzaj kontaktu" {...field("kind")}>
            <option value="PERSON">Osoba</option>
            <option value="ORGANIZATION">Organizacja</option>
          </select>
          <input
            maxLength={180}
            placeholder={draft.kind === "PERSON" ? "Imię i nazwisko" : "Nazwa organizacji"}
            {...field("name")}
          />
        </div>
        <div className="chat-form-row">
          <input maxLength={120} placeholder="Rola, np. klient, pełnomocnik strony przeciwnej" {...field("role")} />
          <input maxLength={60} type="tel" placeholder="Telefon" {...field("phone")} />
          <input maxLength={180} type="email" placeholder="E-mail" {...field("email")} />
        </div>
        <div className="chat-form-row">
          <input maxLength={300} placeholder="Adres (opcjonalnie)" {...field("address")} />
          <button
            type="button"
            className="chat-primary-action"
            disabled={disabled || !draft.name.trim()}
            onClick={() => void save()}
          >
            Dodaj kontakt
          </button>
        </div>
        <textarea maxLength={2000} placeholder="Notatka (opcjonalnie)" {...field("notes")} />
      </div>

      {error ? <p className="chat-error">{error}</p> : null}

      <div className="matter-schedule-list">
        {!caseId ? (
          <p>Wybierz sprawę, aby zobaczyć kontakty.</p>
        ) : loading ? (
          <p>Ładuję kontakty…</p>
        ) : contacts.length === 0 ? (
          <p>Brak kontaktów w tej sprawie.</p>
        ) : (
          contacts.map((contact) => (
            <div className="matter-schedule-item" key={contact.contactId}>
              <div className="matter-schedule-item-main">
                <span className="matter-schedule-kind">
                  {contact.kind === "PERSON" ? "Osoba" : "Organizacja"}
                  {contact.role ? ` · ${contact.role}` : ""}
                </span>
                <strong>{contact.name}</strong>
                <small className="matter-contact-lines">
                  {contact.phone ? <a href={`tel:${contact.phone.replace(/\s+/g, "")}`}>{contact.phone}</a> : null}
                  {contact.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : null}
                  {contact.address ? <span>{contact.address}</span> : null}
                </small>
                {contact.notes ? <p>{contact.notes}</p> : null}
              </div>
              <button
                type="button"
                className="workspace-delete"
                disabled={disabled}
                onClick={() => void remove(contact.contactId)}
              >
                Usuń
              </button>
            </div>
          ))
        )}
      </div>
    </article>
  );
}
