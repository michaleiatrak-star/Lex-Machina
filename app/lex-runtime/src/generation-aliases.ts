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
    }>
): GenerationAliasManifest {
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
      const prefix =
        "D" +
        String(
          documentIndex + 1
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
        entries.push({
          alias:
            `[LMPII:${prefix}:${match[1]}:${match[2]}]`,
          documentId:
            document.documentId,
          sourceToken:
            item.token,
          kind:
            item.kind
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
      vault.resolveToken(
        entry.sourceToken
      );
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
  }
  return result;
}
