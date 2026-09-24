import { useState } from "react";
import type { PrivacyKeyEntry } from "./api.js";
import { caseLabel } from "./restoration-review.js";

const KIND_LABEL: Record<string, string> = {
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
 * case forms used to put it back. Hidden until asked for; local only.
 */
export function PrivacyKeyTable(props: {
  filename: string;
  entries: PrivacyKeyEntry[];
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <section className="workspace-preview privacy-key" aria-label="Klucz anonimizacji">
      <div className="workspace-preview-head">
        <div>
          <strong>Klucz anonimizacji: {props.filename}</strong>
          <small>
            {props.entries.length} symboli · widoczny tylko na tym komputerze, nigdy nie jest wysyłany do modeli
          </small>
        </div>
        <div>
          <button type="button" onClick={() => setVisible((value) => !value)}>
            {visible ? "Ukryj dane" : "Pokaż dane"}
          </button>
          <button type="button" onClick={props.onClose}>Zamknij</button>
        </div>
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
              </tr>
            </thead>
            <tbody>
              {props.entries.map((entry) => (
                <tr key={entry.token}>
                  <td><code>{entry.token}</code></td>
                  <td>
                    {KIND_LABEL[entry.kind] ?? entry.kind}
                    {entry.gender ? ` · ${GENDER_LABEL[entry.gender]}` : ""}
                  </td>
                  <td>{visible ? entry.value : "••••••"}</td>
                  <td>
                    {entry.forms
                      ? visible
                        ? entry.forms.map((form) => `${caseLabel(form.case)}: ${form.text}`).join(" · ")
                        : `${entry.forms.length} form`
                      : "-"}
                  </td>
                  <td>{entry.occurrences}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
