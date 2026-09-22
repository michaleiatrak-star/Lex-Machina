import type {
  CaseKnowledgeHit,
  CaseListItem,
  CaseRole,
  StoredUploadResponse
} from "./api.js";
import type {
  WorkspaceItem,
  WorkspaceResponse
} from "./workspace-client.js";

export type MatterStatusFilter =
  | "ALL"
  | "ACTIVE"
  | "ARCHIVED";

export type MatterRoleFilter =
  | "ALL"
  | CaseRole;

export type MatterSort =
  | "UPDATED_DESC"
  | "NAME_ASC"
  | "CREATED_DESC";

export type DocumentScopeFilter =
  | "ALL_CASE"
  | "CURRENT_FOLDER";

export type DocumentTypeFilter =
  | "ALL"
  | "PDF"
  | "OFFICE"
  | "IMAGE"
  | "TEXT"
  | "ARCHIVE"
  | "TEMPLATE";

function normalized(
  value: string | undefined
): string {
  return (value ?? "")
    .trim()
    .toLocaleLowerCase("pl");
}

function matterMatches(
  item: CaseListItem,
  query: string,
  status: MatterStatusFilter,
  role: MatterRoleFilter
): boolean {
  const queryMatch =
    !query ||
    normalized(
      item.displayName ||
        "Sprawa bez nazwy"
    ).includes(query) ||
    normalized(
      item.caseId
    ).includes(query);

  const statusMatch =
    status === "ALL" ||
    (
      status === "ARCHIVED"
        ? Boolean(item.archivedAt)
        : !item.archivedAt
    );

  const roleMatch =
    role === "ALL" ||
    item.role === role;

  return (
    queryMatch &&
    statusMatch &&
    roleMatch
  );
}

function compareMatters(
  a: CaseListItem,
  b: CaseListItem,
  sort: MatterSort
): number {
  if (sort === "NAME_ASC") {
    return (
      a.displayName ||
      "Sprawa bez nazwy"
    ).localeCompare(
      b.displayName ||
        "Sprawa bez nazwy",
      "pl"
    );
  }

  const left =
    Date.parse(
      sort === "CREATED_DESC"
        ? a.createdAt
        : a.updatedAt
    );
  const right =
    Date.parse(
      sort === "CREATED_DESC"
        ? b.createdAt
        : b.updatedAt
    );

  return (
    (Number.isFinite(right)
      ? right
      : 0) -
    (Number.isFinite(left)
      ? left
      : 0)
  );
}

export function filterMatterCases(
  cases: CaseListItem[],
  options: {
    query: string;
    status: MatterStatusFilter;
    role: MatterRoleFilter;
    sort: MatterSort;
    currentCaseId?: string;
  }
): {
  items: CaseListItem[];
  matchCount: number;
  currentPreserved: boolean;
} {
  const query =
    normalized(options.query);

  const matches =
    cases
      .filter(
        (item) =>
          item.caseKind ===
            "MATTER" &&
          matterMatches(
            item,
            query,
            options.status,
            options.role
          )
      )
      .sort(
        (a, b) =>
          compareMatters(
            a,
            b,
            options.sort
          )
      );

  const current =
    options.currentCaseId
      ? cases.find(
          (item) =>
            item.caseKind ===
              "MATTER" &&
            item.caseId ===
              options.currentCaseId
        )
      : undefined;

  const currentPreserved =
    Boolean(
      current &&
      !matches.some(
        (item) =>
          item.caseId ===
          current.caseId
      )
    );

  return {
    items:
      currentPreserved &&
      current
        ? [
            current,
            ...matches
          ]
        : matches,
    matchCount:
      matches.length,
    currentPreserved
  };
}

function documentMatchesType(
  item: WorkspaceItem,
  type: DocumentTypeFilter
): boolean {
  if (type === "ALL") {
    return true;
  }
  if (type === "TEMPLATE") {
    return (
      item.kind ===
      "TEMPLATE"
    );
  }
  if (type === "ARCHIVE") {
    return item.archive;
  }
  if (type === "PDF") {
    return (
      item.mediaType ===
      "application/pdf"
    );
  }
  if (type === "IMAGE") {
    return item.mediaType
      .startsWith("image/");
  }
  if (type === "TEXT") {
    return (
      item.mediaType
        .startsWith("text/") ||
      item.mediaType ===
        "application/json"
    );
  }
  return (
    item.mediaType.includes(
      "wordprocessing"
    ) ||
    item.mediaType.includes(
      "spreadsheet"
    ) ||
    item.mediaType.includes(
      "opendocument"
    ) ||
    item.mediaType.includes(
      "ms-excel"
    ) ||
    item.mediaType.includes(
      "msword"
    )
  );
}

function contentHitFor(
  item: WorkspaceItem,
  caseFiles:
    StoredUploadResponse[],
  hits:
    CaseKnowledgeHit[]
):
  | CaseKnowledgeHit
  | undefined {
  const documentId =
    caseFiles.find(
      (file) =>
        file.uploadId ===
        item.itemId
    )?.processing
      ?.documentId;

  if (!documentId) {
    return undefined;
  }

  return hits.find(
    (hit) =>
      hit.documentId ===
      documentId
  );
}

export function filterWorkspaceItems(
  workspace: WorkspaceResponse,
  options: {
    query: string;
    selectedFolder: string | null;
    scope: DocumentScopeFilter;
    type: DocumentTypeFilter;
    caseFiles: StoredUploadResponse[];
    knowledgeHits: CaseKnowledgeHit[];
  }
): Array<{
  item: WorkspaceItem;
  contentHit?:
    CaseKnowledgeHit;
}> {
  const query =
    normalized(options.query);

  return workspace.items
    .map((item) => ({
      item,
      contentHit:
        contentHitFor(
          item,
          options.caseFiles,
          options.knowledgeHits
        )
    }))
    .filter(
      ({ item, contentHit }) => {
        const folderId =
          workspace.itemLocations[
            item.itemId
          ] ?? null;

        const scopeMatch =
          !query ||
          options.scope ===
            "ALL_CASE" ||
          folderId ===
            options.selectedFolder;

        const textMatch =
          !query ||
          normalized(
            item.filename
          ).includes(query) ||
          normalized(
            item.mediaType
          ).includes(query) ||
          normalized(
            item.itemId
          ).includes(query) ||
          Boolean(contentHit);

        return (
          scopeMatch &&
          textMatch &&
          documentMatchesType(
            item,
            options.type
          ) &&
          (
            query
              ? true
              : folderId ===
                options.selectedFolder
          )
        );
      }
    )
    .sort((a, b) => {
      if (
        query &&
        a.contentHit &&
        !b.contentHit
      ) {
        return -1;
      }
      if (
        query &&
        !a.contentHit &&
        b.contentHit
      ) {
        return 1;
      }
      if (
        query &&
        a.contentHit &&
        b.contentHit &&
        a.contentHit.score !==
          b.contentHit.score
      ) {
        return (
          b.contentHit.score -
          a.contentHit.score
        );
      }
      return a.item.filename
        .localeCompare(
          b.item.filename,
          "pl"
        );
    });
}
