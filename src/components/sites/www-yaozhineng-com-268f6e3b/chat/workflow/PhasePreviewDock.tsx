"use client";

import { formatElapsed } from "./runMockWorkflow";
import type { WorkflowCounts } from "./types";

type PhasePreviewDockProps = {
  label: string;
  elapsedSec: number;
  counts: WorkflowCounts;
  active: boolean;
};

export function PhasePreviewDock({
  label,
  elapsedSec,
  counts,
  active,
}: PhasePreviewDockProps) {
  return (
    <div className="w-full max-w-[860px] rounded-2xl border border-[#e5e8f0] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-[#f3e8ff] px-2.5 py-1 text-[11px] font-semibold text-[#7c3aed]">
          阶段成果预览
        </span>
        <span className="rounded-full border border-[#fde68a] bg-[#fffbeb] px-2.5 py-1 text-[11px] font-semibold text-[#b45309]">
          已耗时 {formatElapsed(elapsedSec)}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2.5">
        {active ? (
          <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-[#4f6ef7] border-t-transparent" />
        ) : (
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#e8f9ef] text-[11px] font-bold text-[#16a34a]">
            ✓
          </span>
        )}
        <span className="text-[15px] font-semibold text-[#1a1f36]">{label}</span>
      </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#eef2ff]">
        <div
          className={`h-full rounded-full bg-[linear-gradient(90deg,#73c2ff,#4d87ff,#7c5cff)] ${
            active ? "w-[68%] animate-pulse" : "w-full"
          }`}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1 text-[12px] font-semibold text-[#2563eb]">
          相似分子 {counts.similar}
        </span>
        <span className="rounded-full border border-[#e2e8f0] bg-[#f8fafc] px-3 py-1 text-[12px] font-semibold text-[#64748b]">
          优化路线 {counts.routes}
        </span>
        <span className="rounded-full border border-[#e2e8f0] bg-[#f8fafc] px-3 py-1 text-[12px] font-semibold text-[#64748b]">
          候选分子 {counts.candidates}
        </span>
      </div>
    </div>
  );
}
