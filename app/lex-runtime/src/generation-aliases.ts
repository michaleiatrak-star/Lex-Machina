import {
  PERSON_CASES
} from "./privacy/person-morphology.js";
import { genderOf } from "./privacy/token-legend.js";
import type {
  GenerationAliasEntry
} from "./legal-document-ast.js";
import type {
  PiiKind,
  PseudonymizationVault
} from "./privacy/pseudonymizer.js";

export type GenerationAliasManifest = {
  schemaVersion: 1;
  entries:
    GenerationAliasEntry[];
};

export function buildGenerationAliases(
  documents:
    Array<{
      documentId: string;
      vault:
        PseudonymizationVault;
      // On the case's shared key: all such documents share prefix D00 and
      // one alias per token (one person, one alias).
      shared?: boolean;
    }>
): GenerationAliasManifest {
  let ownKeyIndex = 0;
  const sharedTokens = new Set<string>();
  if (
    documents.length > 99
  ) {
    throw new Error(
      "GENERATION_DOCUMENT_LIMIT"
    );
  }
  const entries:
    GenerationAliasEntry[] =
      [];
  const documentIds =
    new Set<string>();

  documents.forEach(
    (
      document,
      documentIndex
    ) => {
      if (
        !/^doc_[a-f0-9]{24}$/
          .test(
            document.documentId
          ) ||
        documentIds.has(
          document.documentId
        )
      ) {
        throw new Error(
          "GENERATION_DOCUMENT_INVALID"
        );
      }
      documentIds.add(
        document.documentId
      );
      void documentIndex;
      // Own-key documents are numbered in order, as the attachment context
      // namespaces them (session-executor namespaceDocumentAttachmentTokens).
      const prefix =
        document.shared
          ? "D00"
          : "D" +
            String(
              ++ownKeyIndex
            ).padStart(
              2,
              "0"
            );
      for (
        const item
        of document.vault
          .snapshot()
          .tokens
          .sort(
            (a, b) =>
              a.token.localeCompare(
                b.token,
                "en"
              )
          )
      ) {
        const match =
          /^\[PII:([A-Z_]+):(\d{4})\]$/
            .exec(
              item.token
            );
        if (!match) {
          throw new Error(
            "GENERATION_SOURCE_TOKEN_INVALID"
          );
        }
        if (document.shared) {
          if (sharedTokens.has(item.token)) continue;
          sharedTokens.add(item.token);
        }
        entries.push({
          alias:
            `[LMPII:${prefix}:${match[1]}:${match[2]}]`,
          documentId:
            document.documentId,
          sourceToken:
            item.token,
          kind:
            item.kind,
          ...(item.kind === "PERSON"
            ? { gender: genderOf(document.vault, item.token) }
            : {})
        });
      }
    }
  );

  return {
    schemaVersion: 1,
    entries
  };
}

export function resolveGenerationAliases(
  manifest:
    GenerationAliasManifest,
  vaults:
    Map<
      string,
      PseudonymizationVault
    >
): Map<string, string> {
  const result =
    new Map<string, string>();
  for (
    const entry
    of manifest.entries
  ) {
    const vault =
      vaults.get(
        entry.documentId
      );
    if (!vault) {
      throw new Error(
        "GENERATION_VAULT_MISSING"
      );
    }
    const value =
      vault.restore(
        entry.sourceToken,
        null
      ).text;
    if (
      result.has(
        entry.alias
      )
    ) {
      throw new Error(
        "GENERATION_ALIAS_DUPLICATE"
      );
    }
    result.set(
      entry.alias,
      value
    );
    // A person alias may be written with its case ([LMPII:D01:PERSON:0001|GEN]).
    if (vault.entity(entry.sourceToken)) {
      for (const personCase of PERSON_CASES) {
        result.set(
          entry.alias.slice(0, -1) + "|" + personCase + "]",
          vault.restore(
            entry.sourceToken,
            personCase
          ).text
        );
      }
    }
  }
  return result;
}

/** One alias used in a generated document, as it will be restored. */
export type DocumentRestoration = {
  alias: string;
  kind: string;
  case?: string;
  text: string;
  source: string;
  confidence: number;
  status: "ok" | "invalid_case" | "no_forms" | "needs_review" | "gender_ambiguous" | "unresolved";
  canonical?: string;
  gender?: "m1" | "f";
  // The model gave no case for a person/address alias; NOM was assumed.
  caseMissing?: boolean;
  occurrences: number;
};

export type RestorationPreview = {
  text: string;
  restorations: DocumentRestoration[];
  marks: Array<{ start: number; end: number; alias: string }>;
};

const DOCUMENT_ALIAS =
  /\[LMPII:D\d{2}:[A-Z_]+:\d{4}(?:\|[A-Z]{2,4})?\]/g;

export function describeGenerationAliases(
  tokenizedText: string,
  manifest: GenerationAliasManifest,
  vaults: Map<string, PseudonymizationVault>
): DocumentRestoration[] {
  const counts = new Map<string, number>();
  for (const match of tokenizedText.matchAll(DOCUMENT_ALIAS)) {
    counts.set(match[0], (counts.get(match[0]) ?? 0) + 1);
  }
  return [...counts].map(([alias, occurrences]) => {
    const [, base, requestedCase] =
      /^(\[LMPII:D\d{2}:[A-Z_]+:\d{4})(?:\|([A-Z]{2,4}))?\]$/.exec(alias)!;
    const entry = manifest.entries.find((item) => item.alias === `${base}]`);
    const vault = entry ? vaults.get(entry.documentId) : undefined;
    if (!entry || !vault || !vault.hasToken(entry.sourceToken)) {
      return {
        alias,
        kind: /:([A-Z_]+):\d{4}/.exec(alias)![1]!,
        text: alias,
        source: "unresolved",
        confidence: 0,
        status: "unresolved" as const,
        occurrences
      };
    }
    const restored = vault.restore(entry.sourceToken, requestedCase ?? null);
    const entity = vault.entity(entry.sourceToken);
    return {
      alias,
      kind: entry.kind,
      ...(requestedCase ? { case: requestedCase } : entity ? { case: "NOM", caseMissing: true } : {}),
      text: restored.text,
      source: entity ? restored.source : "vault",
      confidence: restored.confidence,
      status:
        restored.status === "ok" && entity && entity.status !== "ok"
          ? entity.status
          : restored.status === "unknown_token"
            ? "unresolved"
            : restored.status === "ok" && entity && !requestedCase
              // The model gave no case: the nominative is a guess (hard gate).
              ? "needs_review"
              : restored.status,
      ...(entity ? { canonical: entity.canonical } : {}),
      // Gender matters for remembering a person's name form, not for addresses.
      ...(entity && (entity.gender === "m1" || entity.gender === "f") ? { gender: entity.gender } : {}),
      occurrences
    };
  });
}

export function renderRestorationPreview(
  tokenizedText: string,
  restorations: DocumentRestoration[]
): RestorationPreview {
  const byAlias = new Map(restorations.map((item) => [item.alias, item]));
  const marks: RestorationPreview["marks"] = [];
  let text = "";
  let cursor = 0;
  for (const match of tokenizedText.matchAll(DOCUMENT_ALIAS)) {
    text += tokenizedText.slice(cursor, match.index);
    cursor = match.index! + match[0].length;
    const value = byAlias.get(match[0])?.text ?? match[0];
    marks.push({ start: text.length, end: text.length + value.length, alias: match[0] });
    text += value;
  }
  text += tokenizedText.slice(cursor);
  return { text, restorations, marks };
}

const OVERRIDE_TEXT = /^[^\[\]\r\n]{1,300}$/u;

/** User corrections replace restored values, only for aliases the document uses. */
export function applyRestorationOverrides(
  replacements: Map<string, string>,
  restorations: DocumentRestoration[],
  overrides: Record<string, string> | undefined
): void {
  if (!overrides) return;
  const used = new Set(restorations.map((item) => item.alias));
  for (const [alias, value] of Object.entries(overrides)) {
    if (
      !used.has(alias) ||
      !replacements.has(alias) ||
      typeof value !== "string" ||
      !OVERRIDE_TEXT.test(value.trim())
    ) {
      throw new Error("DEANONYMIZATION_OVERRIDE_INVALID");
    }
    replacements.set(alias, value.trim());
  }
}
