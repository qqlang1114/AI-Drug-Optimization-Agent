"use client";

import { useEffect } from "react";

export type ChatToastMessage = {
  id: string;
  title: string;
  description: string;
  variant?: "default" | "destructive";
};

type ChatToastProps = {
  toast: ChatToastMessage | null;
  onDismiss: () => void;
};

export function ChatToast({ toast, onDismiss }: ChatToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(onDismiss, 3200);
    return () => window.clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const destructive = toast.variant === "destructive";

  return (
    <ol className="pointer-events-none fixed bottom-0 right-0 z-[70] flex w-full max-w-[420px] flex-col gap-2 p-4">
      <li
        role="status"
        className={`chat-toast-enter pointer-events-auto overflow-hidden rounded-xl border bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.12)] ${
          destructive
            ? "border-red-200"
            : "border-[#e5e8f0]"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <div
              className={`text-[14px] font-semibold ${
                destructive ? "text-red-600" : "text-[#1a1f36]"
              }`}
            >
              {toast.title}
            </div>
            <p className="text-[13px] leading-5 text-[#6e7890]">
              {toast.description}
            </p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 rounded-md px-1.5 py-0.5 text-[12px] text-[#94a3b8] transition-colors hover:bg-[#f1f5f9] hover:text-[#64748b]"
          >
            关闭
          </button>
        </div>
      </li>
    </ol>
  );
}
