import {
  describe,
  expect,
  it
} from "vitest";
import type {
  CaseListItem,
  StoredUploadResponse
} from "./api.js";
import {
  filterMatterCases,
  filterWorkspaceItems
} from "./search-filters.js";
import type {
  WorkspaceResponse
} from "./workspace-client.js";

const cases: CaseListItem[] = [
  {
    caseId: "case-alpha",
    caseKind: "MATTER",
    displayName: "Alpha sp. z o.o.",
    createdByUserId: "u1",
    createdAt:
      "2026-09-01T10:00:00.000Z",
    updatedAt:
      "2026-09-20T10:00:00.000Z",
    keyVersion: 1,
    role: "OWNER",
    canReidentify: true
  },
  {
    caseId: "case-beta",
    caseKind: "MATTER",
    displayName: "Beta — archiwalna",
    createdByUserId: "u1",
    createdAt:
      "2026-08-01T10:00:00.000Z",
    updatedAt:
      "2026-09-10T10:00:00.000Z",
    keyVersion: 1,
    role: "VIEWER",
    canReidentify: false,
    archivedAt:
      "2026-09-11T10:00:00.000Z"
  },
  {
    caseId: "firm",
    caseKind:
      "FIRM_KNOWLEDGE",
    displayName: "Kancelaria",
    createdByUserId: "u1",
    createdAt:
      "2026-07-01T10:00:00.000Z",
    updatedAt:
      "2026-09-21T10:00:00.000Z",
    keyVersion: 1,
    role: "OWNER",
    canReidentify: true
  }
];

describe(
  "0.1.7 matter search filters",
  () => {
    it(
      "filters by text status and role without including firm knowledge",
      () => {
        const result =
          filterMatterCases(
            cases,
            {
              query: "alpha",
              status: "ACTIVE",
              role: "OWNER",
              sort:
                "UPDATED_DESC"
            }
          );

        expect(
          result.items.map(
            (item) =>
              item.caseId
          )
        ).toEqual([
          "case-alpha"
        ]);
        expect(
          result.matchCount
        ).toBe(1);
      }
    );

    it(
      "preserves the currently open matter when a filter excludes it",
      () => {
        const result =
          filterMatterCases(
            cases,
            {
              query: "",
              status: "ACTIVE",
              role: "ALL",
              sort:
                "UPDATED_DESC",
              currentCaseId:
                "case-beta"
            }
          );

        expect(
          result.currentPreserved
        ).toBe(true);
        expect(
          result.matchCount
        ).toBe(1);
        expect(
          result.items.map(
            (item) =>
              item.caseId
          )
        ).toEqual([
          "case-beta",
          "case-alpha"
        ]);
      }
    );
  }
);

const workspace:
  WorkspaceResponse = {
    caseId: "case-alpha",
    caseKind: "MATTER",
    caseDisplayName:
      "Alpha sp. z o.o.",
    folders: [
      {
        folderId: "f-1",
        name: "Umowy",
        parentId: null,
        createdAt:
          "2026-09-01T10:00:00.000Z"
      }
    ],
    itemLocations: {
      "upload-pdf": null,
      "upload-docx": "f-1",
      "template-1": null
    },
    items: [
      {
        kind: "UPLOAD",
        itemId:
          "upload-pdf",
        filename:
          "Faktura.pdf",
        mediaType:
          "application/pdf",
        bytes: 1024,
        createdAt:
          "2026-09-20T10:00:00.000Z",
        archive: false
      },
      {
        kind: "UPLOAD",
        itemId:
          "upload-docx",
        filename:
          "Umowa.docx",
        mediaType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        bytes: 2048,
        createdAt:
          "2026-09-21T10:00:00.000Z",
        archive: false
      },
      {
        kind: "TEMPLATE",
        itemId:
          "template-1",
        filename:
          "Wzor.odt",
        mediaType:
          "application/vnd.oasis.opendocument.text",
        bytes: 1024,
        createdAt:
          "2026-09-18T10:00:00.000Z",
        archive: false
      }
    ]
  };

const caseFiles:
  StoredUploadResponse[] = [
    {
      caseId: "case-alpha",
      uploadId:
        "upload-docx",
      filename:
        "Umowa.docx",
      mediaType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      sha256: "abc",
      bytes: 2048,
      storedAt:
        "2026-09-21T10:00:00.000Z",
      archive: false,
      extracted: [],
      processing: {
        documentId: "doc-2",
        complete: true,
        totalPages: 6,
        digitalPages: 6,
        ocrPages: 0,
        blankPages: 0,
        chunkIndices: [
          0,
          1
        ]
      }
    }
  ];

describe(
  "0.1.7 document search filters",
  () => {
    it(
      "uses case knowledge hits to match document contents across folders",
      () => {
        const result =
          filterWorkspaceItems(
            workspace,
            {
              query:
                "kara umowna",
              selectedFolder:
                null,
              scope:
                "ALL_CASE",
              type: "ALL",
              caseFiles,
              knowledgeHits: [
                {
                  documentId:
                    "doc-2",
                  chunkIndex: 1,
                  pageStart: 4,
                  pageEnd: 4,
                  score: 0.92,
                  text:
                    "Strony przewidziały karę umowną."
                }
              ]
            }
          );

        expect(
          result.map(
            ({ item }) =>
              item.itemId
          )
        ).toEqual([
          "upload-docx"
        ]);
        expect(
          result[0]
            ?.contentHit
            ?.pageStart
        ).toBe(4);
      }
    );

    it(
      "limits searched content to the current folder when requested",
      () => {
        const result =
          filterWorkspaceItems(
            workspace,
            {
              query:
                "kara umowna",
              selectedFolder:
                null,
              scope:
                "CURRENT_FOLDER",
              type: "ALL",
              caseFiles,
              knowledgeHits: [
                {
                  documentId:
                    "doc-2",
                  chunkIndex: 1,
                  pageStart: 4,
                  pageEnd: 4,
                  score: 0.92,
                  text:
                    "Kara umowna."
                }
              ]
            }
          );

        expect(result).toEqual(
          []
        );
      }
    );

    it(
      "filters document types while preserving ordinary folder browsing",
      () => {
        const pdfs =
          filterWorkspaceItems(
            workspace,
            {
              query: "",
              selectedFolder:
                null,
              scope:
                "ALL_CASE",
              type: "PDF",
              caseFiles,
              knowledgeHits: []
            }
          );

        expect(
          pdfs.map(
            ({ item }) =>
              item.itemId
          )
        ).toEqual([
          "upload-pdf"
        ]);

        const templates =
          filterWorkspaceItems(
            workspace,
            {
              query: "",
              selectedFolder:
                null,
              scope:
                "ALL_CASE",
              type:
                "TEMPLATE",
              caseFiles,
              knowledgeHits: []
            }
          );

        expect(
          templates.map(
            ({ item }) =>
              item.itemId
          )
        ).toEqual([
          "template-1"
        ]);
      }
    );
  }
);
