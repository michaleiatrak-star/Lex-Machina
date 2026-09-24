import { useState } from "react";
import type { PrivacyKeyEntry } from "./api.js";
import { caseLabel } from "./restoration-review.js";

export const KIND_LABEL: Record<string, string> = {
  PERSON: "Osoba",
  ADDRESS: "Adres",
  PESEL: "PESEL",
  NIP: "NIP",
  REGON: "REGON",
  IBAN: "Rachunek / IBAN",
  EMAIL: "E-mail",
  PHONE: "Telefon",
  ID_CARD: "Dowód osobisty",
  PASSPORT: "Paszport",
  BIRTH_DATE: "Data urodzenia",
  LAND_REGISTRY: "Księga wieczysta",
  KRS: "KRS",
  VEHICLE_PLATE: "Nr rejestracyjny",
  PAYMENT_CARD: "Karta płatnicza",
  CUSTOM: "Inne"
};

const GENDER_LABEL = { m: "mężczyzna", f: "kobieta", unknown: "nieustalona" } as const;

/**
 * A document's anonymization key: what each placeholder stands for and the
 * case forms used to put it back. Values stay hidden until asked for; with
 * edit callbacks the user corrects forms or takes a value out of the
 * anonymization, and the anonymized version changes with it.
 */
export function PrivacyKeyTable(props: {
  entries: PrivacyKeyEntry[];
  highlight?: string | null;
  busy?: boolean;
  onRemove?: (entry: PrivacyKeyEntry) => void;
  onSaveForms?: (entry: PrivacyKeyEntry, forms: Record<string, string>) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const editable = Boolean(props.onRemove || props.onSaveForms);

  return (
    <div className="privacy-key">
      <div className="privacy-key-bar">
        <small>
          {props.entries.length} symboli · klucz widoczny tylko na tym komputerze, nigdy nie jest wysyłany do modeli
        </small>
        <button type="button" onClick={() => setVisible((value) => !value)}>
          {visible ? "Ukryj dane" : "Pokaż dane"}
        </button>
      </div>
      {props.entries.length === 0 ? (
        <p className="privacy-key-empty">W tym dokumencie nie zanonimizowano żadnych danych.</p>
      ) : (
        <div className="privacy-key-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Symbol wysyłany do modelu</th>
                <th scope="col">Rodzaj</th>
                <th scope="col">Zastępuje</th>
                <th scope="col">Odmiana (przypadek: forma)</th>
                <th scope="col">Wystąpienia</th>
                {editable ? <th scope="col">Zmiany</th> : null}
              </tr>
            </thead>
            <tbody>
              {props.entries.map((entry) => (
                <tr key={entry.token} className={props.highlight === entry.token ? "privacy-key-highlight" : ""}>
                  <td><code>{entry.token}</code></td>
                  <td>
                    {KIND_LABEL[entry.kind] ?? entry.kind}
                    {entry.gender ? ` · ${GENDER_LABEL[entry.gender]}` : ""}
                  </td>
                  <td>{visible ? entry.value : "••••••"}</td>
                  <td>
                    {editing === entry.token && entry.forms ? (
                      <div className="privacy-key-forms">
                        {entry.forms.map((form) => (
                          <label key={form.case}>
                            {caseLabel(form.case)}
                            <input
                              value={draft[form.case] ?? form.text}
                              onChange={(event) => setDraft({ ...draft, [form.case]: event.target.value })}
                            />
                          </label>
                        ))}
                      </div>
                    ) : entry.forms ? (
                      visible
                        ? entry.forms.map((form) => `${caseLabel(form.case)}: ${form.text}`).join(" · ")
                        : `${entry.forms.length} form`
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{entry.occurrences}</td>
                  {editable ? (
                    <td className="privacy-key-actions">
                      {editing === entry.token ? (
                        <>
                          <button
                            type="button"
                            disabled={props.busy}
                            onClick={() => {
                              props.onSaveForms?.(entry, draft);
                              setEditing(null);
                            }}
                          >
                            Zapisz formy
                          </button>
                          <button type="button" onClick={() => setEditing(null)}>Anuluj</button>
                        </>
                      ) : (
                        <>
                          {entry.forms && props.onSaveForms ? (
                            <button
                              type="button"
                              disabled={props.busy}
                              onClick={() => {
                                setVisible(true);
                                setDraft({});
                                setEditing(entry.token);
                              }}
                            >
                              Popraw formy
                            </button>
                          ) : null}
                          {props.onRemove ? (
                            <button
                              type="button"
                              disabled={props.busy}
                              title="Przywraca wartość w tekście (osoba i adres w mianowniku) i usuwa symbol z klucza"
                              onClick={() => props.onRemove?.(entry)}
                            >
                              Usuń z anonimizacji
                            </button>
                          ) : null}
                        </>
                      )}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
