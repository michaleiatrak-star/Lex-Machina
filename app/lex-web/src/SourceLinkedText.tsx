import type { ReactNode } from "react";

type SourceLinkedTextProps = {
  content: string;
  onOpenUrl?: (url: string) => Promise<void> | void;
};

function safeHttpsUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      !url.username &&
      !url.password
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function normalizeLinkMarkup(value: string): string {
  return value
    // Repair the malformed pattern occasionally emitted by account CLIs:
    // [label]\([https://source](https://source))
    .replace(
      /\[([^\]\n]+)\]\\?\(\[(https:\/\/[^\]\s]+)\]\((https:\/\/[^)\s]+)\)\\?\)/giu,
      (_match, label: string, _shown: string, target: string) =>
        `[${label}](${target})`
    )
    .replace(/\\\(/gu, "(")
    .replace(/\\\)/gu, ")");
}

export function SourceLinkedText({
  content,
  onOpenUrl
}: SourceLinkedTextProps) {
  const normalized = normalizeLinkMarkup(content);
  const pattern =
    /\[([^\]\n]+)\]\((https:\/\/[^)\s]+)\)|(https:\/\/[^\s<>\[\]{}()]+)/giu;
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(normalized)) !== null) {
    if (match.index > cursor) {
      nodes.push(normalized.slice(cursor, match.index));
    }

    const label = match[1];
    const rawUrl = match[2] ?? match[3] ?? "";
    const trailing = !match[2]
      ? rawUrl.match(/[.,;:!?]+$/u)?.[0] ?? ""
      : "";
    const candidate = trailing
      ? rawUrl.slice(0, -trailing.length)
      : rawUrl;
    const url = safeHttpsUrl(candidate);

    if (!url) {
      nodes.push(match[0]);
    } else {
      nodes.push(
        <a
          key={`source-link-${match.index}`}
          className="source-inline-link"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={
            onOpenUrl
              ? (event) => {
                  event.preventDefault();
                  void onOpenUrl(url);
                }
              : undefined
          }
        >
          {label ?? candidate}
        </a>
      );
      if (trailing) {
        nodes.push(trailing);
      }
    }

    cursor = pattern.lastIndex;
  }

  if (cursor < normalized.length) {
    nodes.push(normalized.slice(cursor));
  }

  return <>{nodes}</>;
}
