"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { buildLoginChatHref } from "@/lib/auth/session";

const TAG_COLORS = ["rgb(79, 110, 247)", "rgb(8, 145, 178)", "rgb(0, 185, 107)"];

/** Homepage feature CTAs → blank new chat (no mode / auto-workflow). */
const chatLoginHref = buildLoginChatHref({ newSession: true });

const TABS = [
  {
    emoji: "🧬",
    tabLabel: "成药性分析与 ADMET 预测",
    titleBefore: "成药性分析 ",
    titleAccent: "与ADMET预测",
    body: "支持上传分子结构或输入 SMILES 串，一键完成多维度成药性评估，精准预测 ADMET 性质，为后续优化提供可靠依据。",
    tags: ["分子结构解析", "多维度成药性评估", "ADMET 性质预测"],
    cta: "开始生成",
  },
  {
    emoji: "💊",
    tabLabel: "成药性智能优化与路径推荐",
    titleBefore: "成药性 ",
    titleAccent: "智能优化与路径推荐",
    body: "针对现有分子，智能识别代谢稳定性、肝毒性等关键成药性缺陷，提出针对性的优化策略与改造路径，实现多指标协同优化。",
    tags: ["细粒度解析 ", "可解释优化策略 ", "多指标协同优化"],
    cta: "开始优化",
  },
  {
    emoji: "🔬",
    tabLabel: "面向靶点 / 先导化合物的智能分子生成",
    titleBefore: "面向靶点 / 先导化合物的 ",
    titleAccent: "智能分子生成",
    body: "支持基于现有分子的衍生物生成，也可直接输入靶点 ID/PDB结构，输出兼具高亲和力与成药性的全新候选分子。",
    tags: ["先导物衍生生成", "靶点驱动设计", "成药性优先筛选"],
    cta: "开始分析",
  },
] as const;

export function FeaturesSection() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setActive((current) => (current + 1) % TABS.length);
    }, 4000);
    return () => window.clearTimeout(id);
  }, [active]);

  const tab = TABS[active];

  return (
    <section
      className="relative z-10 bg-transparent px-6 py-[60px] md:px-12 md:py-[100px]"
      id="features"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-[60px] text-center">
          <h2 className="mb-4 text-[clamp(28px,4vw,42px)] font-extrabold leading-[1.3]">
            三大核心能力
          </h2>
          <p className="mx-auto max-w-[560px] text-base leading-[1.8] text-[#5a6178]">
            覆盖从分子生成到成药性评估的全链路，让药物研发更快、更准、更智能
          </p>
        </div>
        <div
          ref={cardRef}
          className={`overflow-hidden rounded-[20px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-[600ms] ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div className="flex gap-1 overflow-x-auto border-b border-[#e5e8f0] p-2 sm:gap-2">
            {TABS.map((item, index) => {
              const isActive = index === active;
              return (
                <button
                  key={item.tabLabel}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`relative flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 transition-all duration-300 hover:bg-[#f1f3f9] sm:gap-3 sm:px-5 sm:py-4 max-sm:flex-col max-sm:gap-1 max-sm:px-2 max-sm:py-2.5 ${
                    isActive ? "bg-[#eef1fe]" : ""
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-lg transition-all duration-300 ${
                      isActive
                        ? "bg-[#4f6ef7] text-white shadow-[0_4px_12px_rgba(79,110,247,0.3)]"
                        : "bg-[#f1f3f9]"
                    }`}
                  >
                    {item.emoji}
                  </div>
                  <div className="min-w-0">
                    <h4
                      className={`text-sm font-bold transition-colors duration-300 max-sm:text-center max-sm:text-xs ${
                        isActive ? "text-[#4f6ef7]" : ""
                      }`}
                    >
                      {item.tabLabel}
                    </h4>
                  </div>
                  {isActive ? (
                    <span
                      key={`progress-${index}-${active}`}
                      className="absolute bottom-0 left-3 right-3 h-[3px] rounded-sm bg-[#4f6ef7]"
                      style={{
                        animation:
                          "4s linear 0s 1 normal forwards running homeTabProgress",
                        transformOrigin: "left center",
                      }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
          <div className="relative min-h-[400px] overflow-hidden px-6 py-10 sm:px-14 sm:py-12">
            <div key={active} className="home-tab-fade-in">
              <div className="mb-5 text-5xl">{tab.emoji}</div>
              <h3 className="mb-3 text-[28px] font-extrabold leading-[1.3]">
                {tab.titleBefore}
                <span className="bg-gradient-to-br from-[#4f6ef7] to-[#0891b2] bg-clip-text text-transparent">
                  {tab.titleAccent}
                </span>
              </h3>
              <p className="mb-7 max-w-[480px] text-[15px] leading-8 text-[#5a6178]">
                {tab.body}
              </p>
              <div className="mb-8 flex flex-wrap gap-2.5">
                {tab.tags.map((label, index) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#f1f3f9] px-3.5 py-1.5 text-xs font-medium text-[#5a6178]"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: TAG_COLORS[index] }}
                    />
                    {label}
                  </span>
                ))}
              </div>
              <Link
                href={chatLoginHref}
                className="group inline-flex items-center gap-2 rounded-[24px] bg-[#4f6ef7] px-7 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(79,110,247,0.25)]"
              >
                {tab.cta}
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
