import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction
} from "react";
import type {
  AuxiliarySourceItem,
  EvidenceItem
} from "./api.js";
import {
  appendCaseThreadMessage,
  getCaseThread,
  type RestorationMark,
  type WorkspaceDocumentCitation,
  type WorkspaceThreadMessage
} from "./workspace-client.js";

export type CaseChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  evidence?: EvidenceItem[];
  auxiliarySources?:
    AuxiliarySourceItem[];
  meta?: string;
  documentCitations?: WorkspaceDocumentCitation[];
  restorations?: RestorationMark[];
};

function persistedMessageId(id: string): string {
  if (/^message_[a-f0-9]{16,64}$/.test(id)) return id;
  const random = globalThis.crypto?.randomUUID?.().replaceAll("-", "") ??
    `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`
      .replace(/[^a-f0-9]/g, "")
      .padEnd(32, "0")
      .slice(0, 32);
  return `message_${random}`;
}

function fromStored(message: WorkspaceThreadMessage): CaseChatMessage {
  return {
    id: message.messageId,
    role: message.role,
    content: message.content,
    ...(message.meta ? { meta: message.meta } : {}),
    ...(message.documentCitations?.length
      ? { documentCitations: message.documentCitations }
      : {}),
    ...(message.restorations?.length
      ? { restorations: message.restorations }
      : {})
  };
}

function toStored(message: CaseChatMessage): WorkspaceThreadMessage {
  return {
    messageId: persistedMessageId(message.id),
    role: message.role,
    content: message.content,
    createdAt: new Date().toISOString(),
    ...(message.meta ? { meta: message.meta } : {}),
    ...(message.documentCitations?.length
      ? { documentCitations: message.documentCitations }
      : {}),
    ...(message.restorations?.length
      ? { restorations: message.restorations }
      : {})
  };
}

export function useCaseThread(
  caseId: string,
  welcome: CaseChatMessage
): {
  messages: CaseChatMessage[];
  setMessages: Dispatch<SetStateAction<CaseChatMessage[]>>;
  // Replaces a stored message in place (e.g. a corrected restored name).
  updateMessage: (message: CaseChatMessage) => Promise<void>;
  loading: boolean;
  loadedCaseId: string;
  error: string;
} {
  const [messages, setLocalMessages] = useState<CaseChatMessage[]>([welcome]);
  const [loading, setLoading] = useState(false);
  const [loadedCaseId, setLoadedCaseId] = useState("");
  const [error, setError] = useState("");
  const caseRef = useRef(caseId);
  const messagesRef = useRef<CaseChatMessage[]>([welcome]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    caseRef.current = caseId;
    let cancelled = false;
    setError("");
    setLoadedCaseId("");
    if (!caseId) {
      setLocalMessages([welcome]);
      messagesRef.current = [welcome];
      setLoading(false);
      return;
    }
    setLoading(true);
    void getCaseThread(caseId)
      .then((result) => {
        if (cancelled || caseRef.current !== caseId) return;
        const loaded = result.messages.map(fromStored);
        const hydrated = loaded.length > 0 ? loaded : [welcome];
        messagesRef.current = hydrated;
        setLocalMessages(hydrated);
        setLoadedCaseId(caseId);
      })
      .catch((failure) => {
        if (!cancelled && caseRef.current === caseId) {
          setError(failure instanceof Error ? failure.message : String(failure));
          messagesRef.current = [welcome];
          setLocalMessages([welcome]);
        }
      })
      .finally(() => {
        if (!cancelled && caseRef.current === caseId) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [caseId, welcome.id, welcome.content]);

  const setMessages: Dispatch<SetStateAction<CaseChatMessage[]>> = useCallback(
    (value) => {
      const previous = messagesRef.current;
      const next = typeof value === "function"
        ? value(previous)
        : value;
      messagesRef.current = next;
      setLocalMessages(next);

      if (!caseId || loadedCaseId !== caseId) return;
      const previousIds = new Set(previous.map((item) => item.id));
      const added = next.filter(
        (item) => !previousIds.has(item.id) && item.content.trim()
      );
      for (const item of added) {
        const stored = toStored(item);
        void appendCaseThreadMessage(caseId, stored)
          .catch((failure) => {
            setError(failure instanceof Error ? failure.message : String(failure));
          });
      }
    },
    [caseId, loadedCaseId]
  );

  const updateMessage = useCallback(
    async (message: CaseChatMessage) => {
      const next = messagesRef.current.map((item) =>
        item.id === message.id ? message : item
      );
      messagesRef.current = next;
      setLocalMessages(next);
      if (!caseId || loadedCaseId !== caseId || !/^message_[a-f0-9]{16,64}$/.test(message.id)) return;
      await appendCaseThreadMessage(caseId, toStored(message));
    },
    [caseId, loadedCaseId]
  );

  return {
    messages,
    setMessages,
    updateMessage,
    loading: Boolean(caseId && loadedCaseId !== caseId) || loading,
    loadedCaseId,
    error
  };
}
