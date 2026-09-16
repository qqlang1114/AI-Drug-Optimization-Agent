"use client";

import { useCallback, useSyncExternalStore } from "react";

type Listener = () => void;

let pendingDeleteId: string | null = null;
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return pendingDeleteId;
}

function getServerSnapshot(): string | null {
  return null;
}

/**
 * Opens delete confirm without setState in ChatPageShell —
 * only DeleteConversationDialog (store subscriber) re-renders.
 */
export function requestDeleteConversation(id: string) {
  if (pendingDeleteId === id) return;
  pendingDeleteId = id;
  emit();
}

export function cancelDeleteConversation() {
  if (pendingDeleteId === null) return;
  pendingDeleteId = null;
  emit();
}

export function usePendingDeleteId() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useDeleteConversationControls() {
  const pendingId = usePendingDeleteId();
  const cancel = useCallback(() => {
    cancelDeleteConversation();
  }, []);
  return { pendingId, cancel };
}
