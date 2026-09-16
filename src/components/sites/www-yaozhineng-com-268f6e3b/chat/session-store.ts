import type { MockConversation, MockMessage } from "./mock-data";

export type PersistedChatState = {
  conversations: MockConversation[];
  messagesBySession: Record<string, MockMessage[]>;
  currentId: string | null;
};

const EMPTY_STATE: PersistedChatState = {
  conversations: [],
  messagesBySession: {},
  currentId: null,
};

function storageKey(username: string) {
  return `yzn_chat_mock_v1:${username.trim().toLowerCase()}`;
}

function newSessionClaimKey(username: string) {
  return `yzn_chat_new_claim_v1:${username.trim().toLowerCase()}`;
}

export function loadUserChatState(username: string): PersistedChatState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = localStorage.getItem(storageKey(username));
    if (!raw) return { ...EMPTY_STATE };
    const parsed = JSON.parse(raw) as Partial<PersistedChatState>;
    const conversations = Array.isArray(parsed.conversations)
      ? parsed.conversations
      : [];
    const messagesBySession =
      parsed.messagesBySession &&
      typeof parsed.messagesBySession === "object" &&
      !Array.isArray(parsed.messagesBySession)
        ? (parsed.messagesBySession as Record<string, MockMessage[]>)
        : {};
    const currentId =
      typeof parsed.currentId === "string" &&
      conversations.some((item) => item.id === parsed.currentId)
        ? parsed.currentId
        : null;
    return { conversations, messagesBySession, currentId };
  } catch {
    return { ...EMPTY_STATE };
  }
}

export function saveUserChatState(
  username: string,
  state: PersistedChatState,
) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(username), JSON.stringify(state));
}

/**
 * One-shot claim for homepage `?new=1` entry.
 * Survives React StrictMode double-mount and URL replace re-entry so only one
 * blank session is created per navigation.
 */
export function claimHomepageNewSessionId(
  username: string,
  createId: () => string,
): { id: string; isNew: boolean } {
  if (typeof window === "undefined") {
    return { id: createId(), isNew: true };
  }
  const key = newSessionClaimKey(username);
  const existing = sessionStorage.getItem(key);
  if (existing) return { id: existing, isNew: false };
  const id = createId();
  sessionStorage.setItem(key, id);
  return { id, isNew: true };
}

export function clearHomepageNewSessionClaim(username: string) {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(newSessionClaimKey(username));
}
