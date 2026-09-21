import type {
  CaseChatMessage
} from "./case-thread.js";

export function conversationForProvider(
  messages: CaseChatMessage[],
  next: string
): string {
  const history = messages
    .filter(
      (item) =>
        item.role !== "system"
    )
    .map(
      (item) =>
        `${item.role === "user" ? "Użytkownik" : "Asystent"}: ${item.content}`
    )
    .join("\n\n");
  const combined =
    history
      ? `${history}\n\nUżytkownik: ${next}`
      : next;

  // Runtime accepts at most 30k query characters. Reserve space for the
  // internal skill-selection envelope while preserving the newest context.
  return combined.length > 28_000
    ? combined.slice(-28_000)
    : combined;
}
