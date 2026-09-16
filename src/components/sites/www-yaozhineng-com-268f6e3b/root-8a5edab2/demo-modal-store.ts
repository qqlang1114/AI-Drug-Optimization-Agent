"use client";

import { useCallback, useSyncExternalStore } from "react";

type Listener = () => void;

let demoOpen = false;
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
  return demoOpen;
}

function getServerSnapshot() {
  return false;
}

/** Open demo without touching HeroSection state (avoids parent re-render). */
export function openDemoModal() {
  if (demoOpen) return;
  demoOpen = true;
  emit();
}

export function closeDemoModal() {
  if (!demoOpen) return;
  demoOpen = false;
  emit();
}

export function useDemoModalOpen() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useDemoModalControls() {
  const open = useDemoModalOpen();
  const onOpenChange = useCallback((next: boolean) => {
    if (next) openDemoModal();
    else closeDemoModal();
  }, []);
  return { open, onOpenChange };
}
