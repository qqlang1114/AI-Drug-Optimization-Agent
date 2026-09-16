"use client";

import type { AdmetCategory, InputMolecule } from "./types";

const TONE_DOT: Record<AdmetCategory["tone"], string> = {
  absorption: "bg-[#3b82f6]",
  distribution: "bg-[#6366f1]",
  metabolism: "bg-[#f59e0b]",
  excretion: "bg-[#22c55e]",
  toxicity: "bg-[#ef4444]",
};

const TONE_BG: Record<AdmetCategory["tone"], string> = {
  absorption: "bg-[#eff6ff]/70",
  distribution: "bg-[#eef2ff]/70",
  metabolism: "bg-[#fffbeb]/80",
  excretion: "bg-[#f0fdf4]/80",
  toxicity: "bg-[#fef2f2]/80",
};

type InputMoleculeCardProps = {
  molecule: InputMolecule;
};

export function InputMoleculeCard({ molecule }: InputMoleculeCardProps) {
  return (
    <div className="w-full max-w-[860px] space-y-4">
      <div className="rounded-2xl border border-[#e5e8f0] bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
        <h3 className="text-[16px] font-bold text-[#1a1f36]">
          🧬 {molecule.label}
        </h3>
        <code className="mt-3 block break-all rounded-xl bg-[#f8fafc] px-3 py-2 text-[13px] text-[#1a2233]">
          {molecule.smiles}
        </code>
      </div>

      <div className="rounded-2xl border border-[#e5e8f0] bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
        <h3 className="text-[16px] font-bold text-[#1a1f36]">
          ⚗️ 初始分子基础性质
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {molecule.properties.map((prop) => (
            <div
              key={prop.key}
              className="flex items-center justify-between gap-3 rounded-xl border border-[#eef2f7] bg-[#fbfcfe] px-3 py-2.5"
            >
              <span className="text-[13px] text-[#64748b]">{prop.label}</span>
              <strong className="text-[14px] text-[#1a1f36]">{prop.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type AdmetResultCardProps = {
  categories: AdmetCategory[];
};

export function AdmetResultCard({ categories }: AdmetResultCardProps) {
  if (categories.length === 0) return null;

  return (
    <div className="w-full max-w-[860px] rounded-2xl border border-[#e5e8f0] bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <h3 className="text-[16px] font-bold text-[#1a1f36]">
        🧬 初始分子 ADMET 预测
      </h3>
      <div className="mt-4 space-y-4">
        {categories.map((category) => (
          <section key={category.id} className="overflow-hidden rounded-xl border border-[#eef2f7]">
            <div
              className={`flex items-center gap-2 px-3 py-2 ${TONE_BG[category.tone]}`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${TONE_DOT[category.tone]}`}
              />
              <strong className="text-[13px] font-semibold text-[#1a1f36]">
                {category.title}
              </strong>
            </div>
            <div className="grid grid-cols-1 gap-px bg-[#eef2f7] sm:grid-cols-2 lg:grid-cols-3">
              {category.metrics.map((metric) => (
                <div
                  key={metric.key}
                  className="flex items-start justify-between gap-3 bg-white px-3 py-3"
                >
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-[#1a1f36]">
                      {metric.label}
                    </div>
                    <div className="mt-0.5 text-[11px] text-[#94a3b8]">
                      {metric.reference}
                    </div>
                  </div>
                  <strong className="shrink-0 text-[15px] text-[#0f172a]">
                    {metric.value}
                  </strong>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
