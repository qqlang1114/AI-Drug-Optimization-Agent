"use client";

import type { LiteratureItem, OptimizationRoute, CandidateMolecule } from "./types";

type OptimizationRoutesCardProps = {
  routes: OptimizationRoute[];
};

export function OptimizationRoutesCard({ routes }: OptimizationRoutesCardProps) {
  if (routes.length === 0) return null;

  return (
    <div className="w-full max-w-[860px] rounded-2xl border border-[#e5e8f0] bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <h3 className="text-[16px] font-bold text-[#1a1f36]">🧪 优化路线</h3>
      <div className="mt-4 space-y-3">
        {routes.map((route) => (
          <article
            key={route.id}
            className="rounded-xl border border-[#dde6f5] bg-[linear-gradient(180deg,#ffffff,#f8fbff)] p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <strong className="text-[14px] text-[#1a1f36]">{route.title}</strong>
              <span className="rounded-full bg-[#eef4ff] px-2 py-0.5 text-[11px] font-semibold text-[#4f6ef7]">
                {route.strategy}
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-6 text-[#475569]">
              {route.modification}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {route.targetProperties.map((prop) => (
                <span
                  key={prop}
                  className="rounded-full border border-[#e2e8f0] bg-white px-2 py-0.5 text-[11px] text-[#64748b]"
                >
                  {prop}
                </span>
              ))}
            </div>
            <code className="mt-3 block break-all rounded-lg bg-white px-3 py-2 text-[12px] text-[#334155]">
              {route.proposedSmiles}
            </code>
            <p className="mt-2 text-[12px] text-[#6e7890]">{route.notes}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

type LiteratureCardsProps = {
  items: LiteratureItem[];
};

export function LiteratureCards({ items }: LiteratureCardsProps) {
  if (items.length === 0) return null;

  return (
    <div className="w-full max-w-[860px] rounded-2xl border border-[#e5e8f0] bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <h3 className="text-[16px] font-bold text-[#1a1f36]">📚 文献检索结果</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-[#e8edf5] bg-[#fbfcfe] p-4"
          >
            <strong className="block text-[14px] text-[#1a1f36]">
              {item.title}
            </strong>
            {(item.venue || item.year) && (
              <p className="mt-1 text-[12px] text-[#94a3b8]">
                {[item.venue, item.year].filter(Boolean).join(" · ")}
              </p>
            )}
            <p className="mt-2 text-[13px] leading-6 text-[#64748b]">
              {item.snippet}
            </p>
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex text-[12px] font-semibold text-[#4f6ef7] hover:underline"
              >
                查看来源
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

type CandidateMoleculesCardProps = {
  items: CandidateMolecule[];
};

export function CandidateMoleculesCard({ items }: CandidateMoleculesCardProps) {
  if (items.length === 0) return null;

  return (
    <div className="w-full max-w-[860px] rounded-2xl border border-[#e5e8f0] bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <h3 className="text-[16px] font-bold text-[#1a1f36]">✨ 候选分子</h3>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-[#dde6f5] bg-white p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <strong className="text-[14px] text-[#1a1f36]">
                候选分子 {item.index}
              </strong>
              <span className="text-[12px] font-semibold text-[#4f6ef7]">
                {item.scoreLabel} {(item.score * 100).toFixed(0)}
              </span>
            </div>
            <code className="mt-2 block break-all rounded-lg bg-[#f8fafc] px-3 py-2 text-[12px] text-[#334155]">
              {item.smiles}
            </code>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {item.highlights.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#eef4ff] px-2 py-0.5 text-[11px] font-medium text-[#4f6ef7]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
