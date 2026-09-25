import {
  access
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  readCaseBlob,
  rekeyCaseBlob,
  writeCaseBlob,
  type CaseBlobIdentity
} from "./case-blob.js";

export type CaseScheduleKind =
  | "CLIENT_MEETING"
  | "COURT_HEARING"
  | "DEADLINE"
  | "OTHER";

export type CaseScheduleEvent = {
  eventId: string;
  kind: CaseScheduleKind;
  title: string;
  startsAt: string;
  location?: string;
  notes?: string;
  createdAt: string;
  createdByUserId: string;
};

export type CaseContactKind =
  | "PERSON"
  | "ORGANIZATION";

/** A person or organization of the case with contact details. */
export type CaseContact = {
  contactId: string;
  kind: CaseContactKind;
  name: string;
  role?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  createdByUserId: string;
};

// Contacts live in the case's encrypted schedule file: the same key, the
// same rotation and deletion. Files written before contacts have none.
type StoredCaseSchedule = {
  schemaVersion: 1;
  caseId: string;
  events: CaseScheduleEvent[];
  contacts?: CaseContact[];
};

const CONTACT_TEXT_FIELDS = ["role", "phone", "email", "address", "notes"] as const;

function validContact(value: unknown): value is CaseContact {
  if (!value || typeof value !== "object") return false;
  const contact = value as Record<string, unknown>;
  return (
    typeof contact.contactId === "string" &&
    /^casecontact_[a-f0-9]{32}$/.test(contact.contactId) &&
    (contact.kind === "PERSON" || contact.kind === "ORGANIZATION") &&
    typeof contact.name === "string" &&
    typeof contact.createdAt === "string" &&
    typeof contact.createdByUserId === "string" &&
    CONTACT_TEXT_FIELDS.every(
      (field) => contact[field] === undefined || typeof contact[field] === "string"
    )
  );
}

export type EncryptedCaseScheduleStoreOptions = {
  rootDir?: string;
  maxBytes?: number;
};

function defaultRootDir(): string {
  return path.resolve(
    process.env.LEX_DATA_DIR ??
      path.join(
        os.homedir(),
        ".lex-machina",
        "data"
      )
  );
}

function validCaseId(
  value: string
): boolean {
  return /^case_[a-f0-9]{32}$/
    .test(value);
}

function scheduleIdentity(
  caseId: string,
  keyVersion: number
): CaseBlobIdentity {
  if (!validCaseId(caseId)) {
    throw new Error(
      "INVALID_CASE_ID"
    );
  }
  return {
    caseId,
    objectId:
      "schedule_" +
      caseId.slice(
        "case_".length
      ),
    purpose:
      "case-schedule",
    keyVersion
  };
}

function validEvent(
  value: unknown
): value is CaseScheduleEvent {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }
  const event =
    value as Record<
      string,
      unknown
    >;
  return (
    typeof event.eventId ===
      "string" &&
    /^scheduleevent_[a-f0-9]{32}$/
      .test(event.eventId) &&
    [
      "CLIENT_MEETING",
      "COURT_HEARING",
      "DEADLINE",
      "OTHER"
    ].includes(
      String(event.kind)
    ) &&
    typeof event.title ===
      "string" &&
    typeof event.startsAt ===
      "string" &&
    typeof event.createdAt ===
      "string" &&
    typeof event.createdByUserId ===
      "string" &&
    (
      event.location ===
        undefined ||
      typeof event.location ===
        "string"
    ) &&
    (
      event.notes ===
        undefined ||
      typeof event.notes ===
        "string"
    )
  );
}

export class EncryptedCaseScheduleStore {
  readonly rootDir: string;
  private readonly maxBytes:
    number;

  constructor(
    options:
      EncryptedCaseScheduleStoreOptions =
        {}
  ) {
    this.rootDir =
      path.resolve(
        options.rootDir ??
          defaultRootDir()
      );
    this.maxBytes =
      options.maxBytes ??
      512 * 1024;
  }

  private schedulePath(
    caseId: string
  ): string {
    if (!validCaseId(caseId)) {
      throw new Error(
        "INVALID_CASE_ID"
      );
    }
    return path.join(
      this.rootDir,
      "cases",
      caseId,
      "secure",
      "schedule.lme"
    );
  }

  private async readStored(
    args: {
      caseId: string;
      caseDataKey: Buffer;
      keyVersion: number;
    }
  ): Promise<{ events: CaseScheduleEvent[]; contacts: CaseContact[] }> {
    const target =
      this.schedulePath(
        args.caseId
      );
    try {
      await access(target);
    } catch {
      return { events: [], contacts: [] };
    }

    const raw =
      await readCaseBlob({
        targetFile:
          target,
        identity:
          scheduleIdentity(
            args.caseId,
            args.keyVersion
          ),
        caseDataKey:
          args.caseDataKey,
        maxBytes:
          this.maxBytes
      });

    let parsed:
      StoredCaseSchedule;
    try {
      parsed =
        JSON.parse(
          raw.toString(
            "utf8"
          )
        ) as StoredCaseSchedule;
    } finally {
      raw.fill(0);
    }

    if (
      parsed.schemaVersion !== 1 ||
      parsed.caseId !==
        args.caseId ||
      !Array.isArray(
        parsed.events
      ) ||
      !parsed.events.every(
        validEvent
      ) ||
      (
        parsed.contacts !== undefined &&
        (
          !Array.isArray(parsed.contacts) ||
          !parsed.contacts.every(validContact)
        )
      )
    ) {
      throw new Error(
        "CASE_SCHEDULE_INVALID"
      );
    }
    return {
      events: parsed.events,
      contacts: parsed.contacts ?? []
    };
  }

  private async writeStored(
    args: {
      caseId: string;
      caseDataKey: Buffer;
      keyVersion: number;
      events: CaseScheduleEvent[];
      contacts: CaseContact[];
    }
  ): Promise<void> {
    if (
      !args.events.every(validEvent) ||
      !args.contacts.every(validContact)
    ) {
      throw new Error(
        "CASE_SCHEDULE_INVALID"
      );
    }
    const payload =
      Buffer.from(
        JSON.stringify({
          schemaVersion: 1,
          caseId:
            args.caseId,
          events:
            args.events,
          contacts:
            args.contacts
        } satisfies StoredCaseSchedule),
        "utf8"
      );
    try {
      if (
        payload.byteLength >
          this.maxBytes
      ) {
        throw new Error(
          "CASE_SCHEDULE_TOO_LARGE"
        );
      }
      await writeCaseBlob({
        targetFile:
          this.schedulePath(
            args.caseId
          ),
        identity:
          scheduleIdentity(
            args.caseId,
            args.keyVersion
          ),
        caseDataKey:
          args.caseDataKey,
        data:
          payload
      });
    } finally {
      payload.fill(0);
    }
  }

  async list(
    args: {
      caseId: string;
      caseDataKey: Buffer;
      keyVersion: number;
    }
  ): Promise<CaseScheduleEvent[]> {
    const { events } =
      await this.readStored(args);
    return events
      .slice()
      .sort(
        (left, right) =>
          left.startsAt
            .localeCompare(
              right.startsAt
            ) ||
          left.createdAt
            .localeCompare(
              right.createdAt
            )
      );
  }

  async listContacts(
    args: {
      caseId: string;
      caseDataKey: Buffer;
      keyVersion: number;
    }
  ): Promise<CaseContact[]> {
    const { contacts } =
      await this.readStored(args);
    return contacts
      .slice()
      .sort((left, right) =>
        left.name.localeCompare(right.name, "pl")
      );
  }

  async saveContacts(
    args: {
      caseId: string;
      caseDataKey: Buffer;
      keyVersion: number;
      contacts: CaseContact[];
    }
  ): Promise<void> {
    const { events } =
      await this.readStored(args);
    await this.writeStored({
      ...args,
      events
    });
  }

  async save(
    args: {
      caseId: string;
      caseDataKey: Buffer;
      keyVersion: number;
      events:
        CaseScheduleEvent[];
    }
  ): Promise<void> {
    if (
      !args.events.every(
        validEvent
      )
    ) {
      throw new Error(
        "CASE_SCHEDULE_INVALID"
      );
    }
    const { contacts } =
      await this.readStored(args);
    await this.writeStored({
      ...args,
      contacts
    });
  }

  async rekeyCaseSchedule(
    args: {
      caseId: string;
      oldCaseDataKey: Buffer;
      oldKeyVersion: number;
      newCaseDataKey: Buffer;
      newKeyVersion: number;
    }
  ): Promise<boolean> {
    const target =
      this.schedulePath(
        args.caseId
      );
    try {
      await access(target);
    } catch {
      return false;
    }

    await rekeyCaseBlob({
      targetFile:
        target,
      oldIdentity:
        scheduleIdentity(
          args.caseId,
          args.oldKeyVersion
        ),
      newIdentity:
        scheduleIdentity(
          args.caseId,
          args.newKeyVersion
        ),
      oldCaseDataKey:
        args.oldCaseDataKey,
      newCaseDataKey:
        args.newCaseDataKey
    });
    return true;
  }
}
