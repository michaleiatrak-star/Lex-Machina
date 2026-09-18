export type PiiKind =
  | "PESEL"
  | "NIP"
  | "REGON"
  | "IBAN"
  | "EMAIL"
  | "PHONE"
  | "PERSON"
  | "ADDRESS"
  | "CUSTOM";

export type PiiSpan = {
  start: number;
  end: number;
  kind: PiiKind;
  value: string;
  confidence?: number;
  source?: "AUTO" | "USER";
  label?: string;
};

export type PrivacyDirectiveAction =
  | "PSEUDONYMIZE"
  | "KEEP"
  | "LABEL";

export type ManualPrivacyDirective = {
  start: number;
  end: number;
  action: PrivacyDirectiveAction;
  kind?: PiiKind;
  label?: string;
};

export interface NamedEntityRecognizer {
  recognize(text: string): Promise<PiiSpan[]>;
}

export type PseudonymizationFinding = {
  token: string;
  kind: PiiKind;
  start: number;
  end: number;
  source: "AUTO" | "USER";
  label?: string;
};

export type PrivacyAnnotation = {
  start: number;
  end: number;
  label: string;
};

export type PseudonymizationVaultToken = {
  token: string;
  kind: PiiKind;
  value: string;
  createdAt: string;
};

export type PseudonymizationVaultSnapshot = {
  counters:
    Partial<Record<PiiKind, number>>;
  tokens:
    PseudonymizationVaultToken[];
};

export type PseudonymizationResult = {
  text: string;
  findings: PseudonymizationFinding[];
  annotations: PrivacyAnnotation[];
  keptRanges: Array<{
    start: number;
    end: number;
  }>;
  counts: Partial<Record<PiiKind, number>>;
};

function digits(value: string): string {
  return value.replace(/\D/g, "");
}

function validPesel(value: string): boolean {
  const raw = digits(value);
  if (!/^\d{11}$/.test(raw)) return false;
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  const sum = weights.reduce(
    (acc, weight, index) =>
      acc + weight * Number(raw[index]),
    0
  );
  return (10 - (sum % 10)) % 10 === Number(raw[10]);
}

function validNip(value: string): boolean {
  const raw = digits(value);
  if (!/^\d{10}$/.test(raw)) return false;
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  const sum = weights.reduce(
    (acc, weight, index) =>
      acc + weight * Number(raw[index]),
    0
  );
  return sum % 11 === Number(raw[9]);
}

function collectRegex(
  text: string,
  regex: RegExp,
  kind: PiiKind,
  validate?: (value: string) => boolean
): PiiSpan[] {
  const spans: PiiSpan[] = [];
  for (const match of text.matchAll(regex)) {
    const value = match[0];
    const start = match.index;
    if (
      typeof start !== "number" ||
      !value ||
      (validate && !validate(value))
    ) {
      continue;
    }
    spans.push({
      start,
      end: start + value.length,
      kind,
      value,
      confidence: 1,
      source: "AUTO"
    });
  }
  return spans;
}

const PRIORITY: Record<PiiKind, number> = {
  PESEL: 100,
  NIP: 95,
  REGON: 90,
  IBAN: 85,
  EMAIL: 80,
  PHONE: 70,
  PERSON: 60,
  ADDRESS: 55,
  CUSTOM: 50
};

function overlaps(
  a: { start: number; end: number },
  b: { start: number; end: number }
): boolean {
  return a.start < b.end && a.end > b.start;
}

function nonOverlapping(spans: PiiSpan[]): PiiSpan[] {
  const sorted = [...spans].sort((a, b) =>
    a.start - b.start ||
    (a.source === "USER" ? -1 : 1) -
      (b.source === "USER" ? -1 : 1) ||
    PRIORITY[b.kind] - PRIORITY[a.kind] ||
    (b.end - b.start) - (a.end - a.start)
  );
  const accepted: PiiSpan[] = [];

  for (const candidate of sorted) {
    if (
      candidate.start < 0 ||
      candidate.end <= candidate.start
    ) {
      continue;
    }
    if (!accepted.some((current) => overlaps(candidate, current))) {
      accepted.push(candidate);
    }
  }

  return accepted.sort((a, b) => a.start - b.start);
}

function normalizeDirectives(
  text: string,
  directives: ManualPrivacyDirective[]
): ManualPrivacyDirective[] {
  const normalized = directives.map((directive) => {
    if (
      !Number.isInteger(directive.start) ||
      !Number.isInteger(directive.end) ||
      directive.start < 0 ||
      directive.end <= directive.start ||
      directive.end > text.length
    ) {
      throw new Error("INVALID_PRIVACY_DIRECTIVE_RANGE");
    }

    const label = directive.label?.trim();
    if (
      directive.action === "LABEL" &&
      (!label || label.length > 120)
    ) {
      throw new Error("INVALID_PRIVACY_DIRECTIVE_LABEL");
    }

    return {
      ...directive,
      ...(label ? { label } : {})
    };
  }).sort((a, b) => a.start - b.start || a.end - b.end);

  for (let index = 1; index < normalized.length; index += 1) {
    if (overlaps(normalized[index - 1]!, normalized[index]!)) {
      throw new Error("OVERLAPPING_PRIVACY_DIRECTIVES");
    }
  }

  return normalized;
}

export class PseudonymizationVault {
  private readonly tokenToValue =
    new Map<string, string>();
  private readonly keyToToken =
    new Map<string, string>();
  private readonly counters =
    new Map<PiiKind, number>();
  private readonly tokenMetadata =
    new Map<
      string,
      {
        kind: PiiKind;
        createdAt: string;
      }
    >();

  constructor(
    snapshot?:
      PseudonymizationVaultSnapshot
  ) {
    if (snapshot) {
      this.hydrate(snapshot);
    }
  }

  private hydrate(
    snapshot:
      PseudonymizationVaultSnapshot
  ): void {
    for (
      const [
        kind,
        rawCount
      ] of Object.entries(
        snapshot.counters
      ) as Array<
        [PiiKind, number]
      >
    ) {
      if (
        !Number.isInteger(
          rawCount
        ) ||
        rawCount < 0
      ) {
        throw new Error(
          "INVALID_PRIVACY_VAULT_COUNTER"
        );
      }
      this.counters.set(
        kind,
        rawCount
      );
    }

    for (
      const item
      of snapshot.tokens
    ) {
      const match =
        /^\[PII:([A-Z_]+):(\d{4})\]$/
          .exec(item.token);
      if (
        !match ||
        match[1] !== item.kind ||
        typeof item.value !==
          "string" ||
        typeof item.createdAt !==
          "string" ||
        !Number.isFinite(
          Date.parse(
            item.createdAt
          )
        ) ||
        this.tokenToValue.has(
          item.token
        )
      ) {
        throw new Error(
          "INVALID_PRIVACY_VAULT_TOKEN"
        );
      }

      const key =
        `${item.kind}\u0000${item.value}`;
      if (
        this.keyToToken.has(key)
      ) {
        throw new Error(
          "DUPLICATE_PRIVACY_VAULT_VALUE"
        );
      }

      const sequence =
        Number(match[2]);
      const counter =
        this.counters.get(
          item.kind
        ) ?? 0;
      if (
        sequence > counter
      ) {
        this.counters.set(
          item.kind,
          sequence
        );
      }

      this.keyToToken.set(
        key,
        item.token
      );
      this.tokenToValue.set(
        item.token,
        item.value
      );
      this.tokenMetadata.set(
        item.token,
        {
          kind: item.kind,
          createdAt:
            item.createdAt
        }
      );
    }
  }

  getOrCreate(
    kind: PiiKind,
    value: string
  ): string {
    const key =
      `${kind}\u0000${value}`;
    const existing =
      this.keyToToken.get(key);
    if (existing) {
      return existing;
    }

    const next =
      (
        this.counters.get(
          kind
        ) ?? 0
      ) + 1;
    this.counters.set(
      kind,
      next
    );
    const token =
      `[PII:${kind}:${String(
        next
      ).padStart(4, "0")}]`;
    this.keyToToken.set(
      key,
      token
    );
    this.tokenToValue.set(
      token,
      value
    );
    this.tokenMetadata.set(
      token,
      {
        kind,
        createdAt:
          new Date()
            .toISOString()
      }
    );
    return token;
  }

  hasToken(
    token: string
  ): boolean {
    return this.tokenToValue
      .has(token);
  }

  resolveToken(
    token: string
  ): string {
    const value =
      this.tokenToValue.get(
        token
      );
    if (value === undefined) {
      throw new Error(
        `Unknown pseudonymization token: ${token}`
      );
    }
    return value;
  }

  snapshot():
    PseudonymizationVaultSnapshot {
    const counters:
      Partial<
        Record<PiiKind, number>
      > = {};
    for (
      const [kind, count]
      of this.counters
    ) {
      counters[kind] = count;
    }

    const tokens =
      [...this.tokenToValue
        .entries()]
        .map(
          ([token, value]) => {
            const metadata =
              this.tokenMetadata
                .get(token);
            if (!metadata) {
              throw new Error(
                "PRIVACY_VAULT_METADATA_MISSING"
              );
            }
            return {
              token,
              kind:
                metadata.kind,
              value,
              createdAt:
                metadata.createdAt
            };
          }
        )
        .sort((a, b) =>
          a.token.localeCompare(
            b.token,
            "en"
          )
        );

    return {
      counters,
      tokens
    };
  }

  deanonymize(
    text: string
  ): string {
    return text.replace(
      /\[PII:[A-Z_]+:\d{4}\]/g,
      (token) =>
        this.resolveToken(
          token
        )
    );
  }

  get size(): number {
    return this.tokenToValue
      .size;
  }
}

export class LocalPolishPseudonymizer {
  constructor(
    private readonly vault: PseudonymizationVault,
    private readonly namedEntities?: NamedEntityRecognizer
  ) {}

  async pseudonymize(
    text: string,
    directives: ManualPrivacyDirective[] = []
  ): Promise<PseudonymizationResult> {
    const manual = normalizeDirectives(text, directives);
    const keep = manual.filter(
      (item) => item.action === "KEEP"
    );
    const labelDirectives = manual.filter(
      (item) => item.action === "LABEL"
    );
    const annotations: PrivacyAnnotation[] =
      labelDirectives.map((item) => ({
        start: item.start,
        end: item.end,
        label: item.label!
      }));

    const manualPseudonyms: PiiSpan[] = manual
      .filter(
        (item) => item.action === "PSEUDONYMIZE"
      )
      .map((item) => ({
        start: item.start,
        end: item.end,
        kind: item.kind ?? "CUSTOM",
        value: text.slice(item.start, item.end),
        source: "USER" as const,
        ...(item.label ? { label: item.label } : {})
      }));

    const autoSpans: PiiSpan[] = [
      ...collectRegex(
        text,
        /\b\d{11}\b/g,
        "PESEL",
        validPesel
      ),
      ...collectRegex(
        text,
        /\b\d{10}\b/g,
        "NIP",
        validNip
      ),
      ...collectRegex(
        text,
        /\b(?:\d{9}|\d{14})\b/g,
        "REGON"
      ),
      ...collectRegex(
        text,
        /\bPL(?:[\s-]?\d){26}\b/gi,
        "IBAN"
      ),
      ...collectRegex(
        text,
        /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
        "EMAIL"
      ),
      ...collectRegex(
        text,
        /(?:\+48[\s-]?)?\d{3}[\s-]\d{3}[\s-]\d{3}\b/g,
        "PHONE"
      )
    ];

    if (this.namedEntities) {
      const named =
        await this.namedEntities.recognize(text);
      for (const span of named) {
        if (
          span.kind === "PERSON" &&
          text.slice(span.start, span.end) === span.value
        ) {
          autoSpans.push({
            ...span,
            source: "AUTO"
          });
        }
      }
    }

    const autoAllowed = autoSpans.filter(
      (span) =>
        !keep.some((item) => overlaps(span, item)) &&
        !labelDirectives.some(
          (item) => overlaps(span, item)
        ) &&
        !manualPseudonyms.some(
          (item) => overlaps(span, item)
        )
    );

    const findings = nonOverlapping([
      ...manualPseudonyms,
      ...autoAllowed
    ]);
    let output = text;
    const publicFindings: PseudonymizationFinding[] = [];

    for (
      let index = findings.length - 1;
      index >= 0;
      index -= 1
    ) {
      const finding = findings[index]!;
      const token = this.vault.getOrCreate(
        finding.kind,
        finding.value
      );
      output =
        output.slice(0, finding.start) +
        token +
        output.slice(finding.end);
      publicFindings.push({
        token,
        kind: finding.kind,
        start: finding.start,
        end: finding.end,
        source: finding.source ?? "AUTO",
        ...(finding.label
          ? { label: finding.label }
          : {})
      });
    }

    publicFindings.reverse();
    const counts: Partial<Record<PiiKind, number>> = {};
    for (const finding of publicFindings) {
      counts[finding.kind] =
        (counts[finding.kind] ?? 0) + 1;
    }

    return {
      text: output,
      findings: publicFindings,
      annotations,
      keptRanges: keep.map((item) => ({
        start: item.start,
        end: item.end
      })),
      counts
    };
  }

  deanonymize(text: string): string {
    return this.vault.deanonymize(text);
  }
}
