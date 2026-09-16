"use client";

import type { SimilarMolecule } from "./types";

type SimilarMoleculesCardProps = {
  items: SimilarMolecule[];
};

export function SimilarMoleculesCard({ items }: SimilarMoleculesCardProps) {
  if (items.length === 0) return null;

  return (
    <div className="w-full max-w-[860px] rounded-2xl border border-[#e5e8f0] bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <h3 className="text-[16px] font-bold text-[#1a1f36]">
        🧬 检索到的相似分子
      </h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-[#e8edf5] bg-[#fbfcfe] p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <strong className="text-[14px] text-[#1a1f36]">
                相似分子 {item.index}
              </strong>
              <span className="rounded-full bg-[#eef4ff] px-2 py-0.5 text-[11px] font-semibold text-[#4f6ef7]">
                相似度 {item.similarity.toFixed(1)}%
              </span>
              <span className="rounded-full border border-[#e2e8f0] bg-white px-2 py-0.5 text-[11px] font-medium text-[#64748b]">
                {item.method}
              </span>
            </div>
            <code className="mt-2 block break-all rounded-lg bg-white px-3 py-2 text-[12px] text-[#334155]">
              {item.smiles}
            </code>
            <p className="mt-2 text-[13px] leading-6 text-[#6e7890]">
              {item.rationale}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
