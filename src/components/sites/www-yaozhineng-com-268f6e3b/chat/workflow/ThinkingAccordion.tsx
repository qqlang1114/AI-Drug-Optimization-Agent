"use client";

import type { WorkflowStep } from "./types";

type ThinkingAccordionProps = {
  open: boolean;
  active: boolean;
  title: string;
  steps: WorkflowStep[];
  onToggle: () => void;
};

export function ThinkingAccordion({
  open,
  active,
  title,
  steps,
  onToggle,
}: ThinkingAccordionProps) {
  if (steps.length === 0) return null;

  return (
    <div className="w-full max-w-[860px] overflow-hidden rounded-2xl border border-[#e5e8f0] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[#f8fafc]"
      >
        <div className="flex min-w-0 items-center gap-2">
          {active ? (
            <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-[#4f6ef7] border-t-transparent" />
          ) : (
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#e8f9ef] text-[10px] font-bold text-[#16a34a]">
              ✓
            </span>
          )}
          <strong className="truncate text-[14px] font-semibold text-[#1a1f36]">
            {title}
          </strong>
        </div>
        <span className="shrink-0 text-[12px] font-medium text-[#4f6ef7]">
          {open ? "收起" : "展开"}
        </span>
      </button>
      {open ? (
        <div className="space-y-2 border-t border-[#eef2f7] px-4 py-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex items-start gap-2 text-[13px] leading-6 text-[#334155]"
            >
              <span
                className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  step.done
                    ? "bg-[#e8f9ef] text-[#16a34a]"
                    : "border border-[#c7d7ff] text-[#4f6ef7]"
                }`}
              >
                {step.done ? "✓" : "·"}
              </span>
              <span className={step.done ? "text-[#475569]" : "font-medium"}>
                {step.text}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
