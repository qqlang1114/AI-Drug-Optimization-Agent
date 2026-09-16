"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  clearMockSession,
  createMockSession,
  readMockSession,
  writeMockSession,
  type MockSession,
  type MockUser,
} from "./session";

type AuthContextValue = {
  user: MockUser | null;
  token: string | null;
  /** False only during SSR / before client store attaches. */
  ready: boolean;
  login: (
    username: string,
    password: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  register: (
    username: string,
    password: string,
    displayName?: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthListener = () => void;

let sessionSnapshot: MockSession | null = null;
let sessionHydrated = false;
const listeners = new Set<AuthListener>();

function emit() {
  for (const listener of listeners) listener();
}

function hydrateFromStorage() {
  if (sessionHydrated || typeof window === "undefined") return;
  sessionSnapshot = readMockSession();
  sessionHydrated = true;
}

function subscribe(listener: AuthListener) {
  hydrateFromStorage();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSessionSnapshot() {
  hydrateFromStorage();
  return sessionSnapshot;
}

function getServerSessionSnapshot(): MockSession | null {
  return null;
}

function getReadySnapshot() {
  hydrateFromStorage();
  return true;
}

function getServerReadySnapshot() {
  return false;
}

function setSessionSnapshot(next: MockSession | null) {
  sessionSnapshot = next;
  sessionHydrated = true;
  emit();
}

function validateCredentials(username: string, password: string) {
  const u = username.trim();
  if (u.length < 2 || u.length > 50) {
    return "请输入用户名 (2-50字符)";
  }
  if (password.length < 4) {
    return "请输入密码 (至少4位)";
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSyncExternalStore(
    subscribe,
    getSessionSnapshot,
    getServerSessionSnapshot,
  );
  const ready = useSyncExternalStore(
    subscribe,
    getReadySnapshot,
    getServerReadySnapshot,
  );

  const login = useCallback(async (username: string, password: string) => {
    const error = validateCredentials(username, password);
    if (error) return { ok: false as const, error };
    await new Promise((r) => setTimeout(r, 250));
    const next = createMockSession(username);
    writeMockSession(next);
    setSessionSnapshot(next);
    return { ok: true as const };
  }, []);

  const register = useCallback(
    async (username: string, password: string, displayName?: string) => {
      const error = validateCredentials(username, password);
      if (error) return { ok: false as const, error };
      await new Promise((r) => setTimeout(r, 250));
      const next = createMockSession(username, displayName);
      writeMockSession(next);
      setSessionSnapshot(next);
      return { ok: true as const };
    },
    [],
  );

  const logout = useCallback(() => {
    clearMockSession();
    setSessionSnapshot(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      ready,
      login,
      register,
      logout,
    }),
    [session, ready, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/** Shared boot screen — no login/chat chrome before auth is known. */
export function AuthBootScreen({ label = "加载中…" }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] text-sm text-[#6e7890]">
      {label}
    </div>
  );
}
