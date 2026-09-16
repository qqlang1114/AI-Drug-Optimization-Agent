"use client";

import { memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  cancelDeleteConversation,
  usePendingDeleteId,
} from "./delete-dialog-store";

type DeleteConversationDialogProps = {
  /** Called with the pending id; store is cleared by the dialog. */
  onConfirm: (id: string) => void;
};

/**
 * Subscribes to delete-dialog-store only — opening does not re-render ChatPageShell.
 */
function DeleteConversationDialogImpl({
  onConfirm,
}: DeleteConversationDialogProps) {
  const pendingId = usePendingDeleteId();
  const open = pendingId !== null;
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") cancelDeleteConversation();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!portalReady || !open || !pendingId) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="关闭对话框"
        className="yzn-animate-overlay-show absolute inset-0 bg-[rgba(61,67,85,0.3)]"
        onClick={cancelDeleteConversation}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-conversation-title"
        aria-describedby="delete-conversation-desc"
        className="yzn-animate-content-show relative z-[61] w-full max-w-[420px] rounded-2xl border border-[#e5e8f0] bg-white p-6 shadow-[0_24px_64px_rgba(15,23,42,0.16)]"
      >
        <h2
          id="delete-conversation-title"
          className="text-[18px] font-semibold tracking-tight text-[#1a1f36]"
        >
          删除当前对话？
        </h2>
        <div
          id="delete-conversation-desc"
          className="mt-3 space-y-1 text-[14px] leading-6 text-[#6e7890]"
        >
          <p>删除后将无法恢复该会话的消息记录和分析结果。</p>
          <p>此操作只会影响当前选中的一条对话。</p>
        </div>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={cancelDeleteConversation}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white px-4 text-[14px] font-medium text-[#1a1f36] transition-colors hover:bg-[#f8fafc]"
          >
            取消
          </button>
          <button
            type="button"
            onClick={() => {
              const id = pendingId;
              cancelDeleteConversation();
              onConfirm(id);
            }}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#ef4444] px-4 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-[#dc2626]"
          >
            删除
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export const DeleteConversationDialog = memo(DeleteConversationDialogImpl);
