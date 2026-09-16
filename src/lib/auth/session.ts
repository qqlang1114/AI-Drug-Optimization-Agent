export type MockUser = {
  id: number;
  username: string;
  display_name: string;
  role: "user";
};

export type MockSession = {
  token: string;
  user: MockUser;
};

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function readMockSession(): MockSession | null {
  if (typeof window === "undefined") return null;
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    if (!token || !raw) return null;
    const user = JSON.parse(raw) as MockUser;
    if (!user?.username) return null;
    return { token, user };
  } catch {
    return null;
  }
}

export function writeMockSession(session: MockSession) {
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function clearMockSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function createMockSession(
  username: string,
  displayName?: string,
): MockSession {
  const trimmed = username.trim();
  return {
    token: `mock-token-${Date.now()}`,
    user: {
      id: Date.now(),
      username: trimmed,
      display_name: (displayName?.trim() || trimmed) || "本地演示用户",
      role: "user",
    },
  };
}

/** Only allow same-origin relative paths. */
export function safeRedirectPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/chat";
  }
  return value;
}

/** Homepage / marketing CTAs: login then open a blank chat session. */
export function buildLoginChatHref(options?: { newSession?: boolean }): string {
  const params = new URLSearchParams({ redirect: "/chat" });
  if (options?.newSession) params.set("new", "1");
  return `/login?${params.toString()}`;
}

/**
 * Resolve post-login destination. When `new=1` is present on the login URL,
 * forward it onto `/chat` so ChatPageShell can open a fresh empty session.
 */
export function resolvePostLoginRedirect(
  redirect: string | null | undefined,
  newFlag: string | null | undefined,
): string {
  const base = safeRedirectPath(redirect);
  if (newFlag !== "1") return base;

  const url = new URL(base, "http://local.invalid");
  url.searchParams.set("new", "1");
  return `${url.pathname}${url.search}${url.hash}`;
}
