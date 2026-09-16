"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { ChevronDownIcon } from "../shared/icons";
import { buildLoginChatHref } from "@/lib/auth/session";
import { aiBadgeSrc } from "./assets";
import { openDemoModal } from "./demo-modal-store";

const pingFang = '"PingFang SC", PingFangSC-Regular, sans-serif';
const loginHref = buildLoginChatHref({ newSession: true });

function scrollToFeatures(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  const target = document.getElementById("features");
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  history.pushState(null, "", "#features");
}

/** Presentational hero — no modal open state (avoids re-rendering this tree). */
export function HeroSection() {
  return (
    <>
      <section className="relative z-10 hidden min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-6 pb-12 pt-6 text-center lg:flex">
        <div className="pointer-events-none absolute -right-[200px] -top-[200px] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(79,110,247,0.08)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-[100px] -left-[100px] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(8,145,178,0.06)_0%,transparent_70%)]" />
        <div className="home-fade-up relative z-10 mb-7 inline-flex items-center gap-2 rounded-[20px] bg-[#eef1fe] px-[18px] py-1.5 text-[13px] font-semibold text-[#4f6ef7]">
          <img
            src={aiBadgeSrc}
            alt=""
            aria-hidden="true"
            className="h-4 w-4 shrink-0 object-contain"
          />
          AI驱动的成药性优化
        </div>
        <h1
          className="home-fade-up relative z-10 w-full max-w-[1076px] px-4 text-center"
          aria-label="成药性优化智能体"
          style={{ animationDelay: "0.1s" }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[240px] w-[min(72vw,760px)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(105,173,255,0.22)_0%,rgba(105,173,255,0)_72%)] blur-3xl"
          />
          <span className="relative inline-flex max-w-full items-baseline justify-center whitespace-nowrap">
            <span className="font-pangmen text-[clamp(68px,8vw,126px)] leading-[0.92] tracking-[0.08em] text-[#191D3F] [text-shadow:0_18px_38px_rgba(68,89,153,0.16)]">
              成药性优化
            </span>
            <span className="bg-[linear-gradient(90deg,#73c2ff_0%,#4d87ff_34%,#295fff_68%,#67c9ff_100%)] bg-clip-text font-pangmen text-[clamp(68px,8vw,126px)] leading-[0.92] tracking-[0.08em] text-transparent [filter:drop-shadow(0_16px_34px_rgba(53,117,255,0.24))]">
              智能体
            </span>
          </span>
        </h1>
        <p
          className="home-fade-up relative z-10 mt-5 max-w-[860px] px-4 text-center"
          style={{
            animationDelay: "0.2s",
            opacity: 0.5,
            fontFamily: pingFang,
            fontSize: 20,
            color: "rgb(25, 29, 63)",
            letterSpacing: "0.5px",
            lineHeight: "30px",
            fontWeight: 400,
          }}
        >
          构建成药性优化知识库，以智能体一体化模式赋能先导化合物高效优化
        </p>
        <div
          className="home-fade-up relative z-10 mt-10 flex flex-wrap justify-center gap-4"
          style={{ animationDelay: "0.3s" }}
        >
          <Link
            href={loginHref}
            className="inline-flex h-[60px] w-[166px] items-center justify-center rounded-[30px] bg-[#295FFF] bg-[linear-gradient(105deg,#5793FF_0%,#0C41FF_50%,#3258FF_100%)] text-[20px] font-normal tracking-[1.43px] text-white shadow-[inset_0_0_16px_4px_rgba(58,177,255,0.07)] transition-all duration-200 hover:bg-none hover:shadow-[0_1px_2px_0_rgba(69,98,255,0.5),0_8px_16px_-2px_rgba(0,115,255,0.44)]"
            style={{ fontFamily: pingFang, lineHeight: 1 }}
          >
            立即开始
          </Link>
          <a
            href="#features"
            onClick={scrollToFeatures}
            className="inline-flex h-[60px] w-[166px] items-center justify-center rounded-[30px] border border-white/50 bg-white/30 text-[20px] font-normal tracking-[1.43px] text-[#31426F] shadow-[inset_0_0_16px_4px_rgba(255,255,255,0.5)] transition-all duration-200 hover:border-transparent hover:bg-white hover:shadow-[0_1px_2px_0_rgba(181,186,214,0.5),0_8px_16px_-2px_rgba(167,179,203,0.44)]"
            style={{ fontFamily: pingFang, lineHeight: 1 }}
          >
            探索功能
          </a>
          <button
            type="button"
            onClick={openDemoModal}
            className="inline-flex h-[60px] w-[166px] items-center justify-center rounded-[30px] border border-white/50 bg-white/30 text-[20px] font-normal tracking-[1.43px] text-[#31426F] shadow-[inset_0_0_16px_4px_rgba(255,255,255,0.5)] transition-all duration-200 hover:border-transparent hover:bg-white hover:shadow-[0_1px_2px_0_rgba(181,186,214,0.5),0_8px_16px_-2px_rgba(167,179,203,0.44)]"
            style={{ fontFamily: pingFang, lineHeight: 1 }}
          >
            查看演示
          </button>
        </div>
        <div
          className="home-fade-up relative z-10 mt-12 flex flex-col items-center"
          style={{ animationDelay: "0.5s" }}
        >
          <span className="mb-2 text-xs font-medium tracking-widest text-[#8b93a7]">
            向下探索
          </span>
          <div className="home-bounce-down flex h-7 w-7 items-center justify-center">
            <ChevronDownIcon className="h-5 w-5 fill-none stroke-[#8b93a7]" />
          </div>
        </div>
      </section>

      <section
        className="relative z-10 overflow-hidden px-5 pb-0 pt-2 text-center lg:hidden"
        style={{
          minHeight: "100svh",
          paddingTop: "calc(env(safe-area-inset-top) + 8px)",
        }}
      >
        <div className="pointer-events-none absolute -left-[180px] bottom-[90px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(79,110,247,0.08)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute -right-[180px] top-[140px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(8,145,178,0.06)_0%,transparent_70%)]" />
        <div className="relative z-10 flex min-h-[inherit] flex-col items-center">
          <div className="flex w-full flex-1 flex-col items-center pt-[8vh]">
            <div className="home-fade-up inline-flex items-center gap-3 rounded-full border border-white/45 bg-white/24 px-4 py-2 text-[12px] font-medium text-[#6d758f] shadow-[inset_0_0_20px_rgba(255,255,255,0.32)] backdrop-blur-md">
              <img
                src={aiBadgeSrc}
                alt=""
                aria-hidden="true"
                className="h-[18px] w-[18px] shrink-0 object-contain"
              />
              AI驱动的成药性优化
            </div>
            <h1
              className="home-fade-up mt-10 w-full max-w-[360px] text-center"
              aria-label="成药性优化智能体"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="inline-flex max-w-full items-baseline justify-center whitespace-nowrap">
                <span className="font-pangmen text-[clamp(26px,8.6vw,32px)] leading-[1.05] tracking-[0.08em] text-[#191D3F] [text-shadow:0_10px_22px_rgba(68,89,153,0.14)]">
                  成药性优化
                </span>
                <span className="bg-[linear-gradient(90deg,#73c2ff_0%,#4d87ff_34%,#295fff_68%,#67c9ff_100%)] bg-clip-text font-pangmen text-[clamp(26px,8.6vw,32px)] leading-[1.05] tracking-[0.08em] text-transparent [filter:drop-shadow(0_10px_20px_rgba(53,117,255,0.2))]">
                  智能体
                </span>
              </span>
            </h1>
            <p
              className="home-fade-up mt-8 max-w-[340px] text-center text-[16px] leading-[1.7] text-[#7d8299]"
              style={{ animationDelay: "0.2s" }}
            >
              构建成药性优化知识库，以智能体一体化模式赋能先导化合物高效优化
            </p>
          </div>
          <div
            className="home-fade-up relative z-10 mt-auto w-full max-w-[360px] pb-[calc(env(safe-area-inset-bottom)+18px)] pt-10"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href={loginHref}
              className="inline-flex h-10 w-full items-center justify-center rounded-[20px] bg-[linear-gradient(95deg,#5793FF_0%,#0C41FF_50%,#3258FF_100%)] text-[14px] font-normal tracking-normal text-white shadow-[inset_0_0_16px_4px_rgba(58,177,255,0.07)]"
              style={{ fontFamily: pingFang, lineHeight: 1 }}
            >
              立即开始
            </Link>
            <div className="mt-4 flex gap-4">
              <a
                href="#features"
                onClick={scrollToFeatures}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-[20px] border border-white/50 bg-[rgba(255,255,255,0.40)] text-[14px] font-normal tracking-normal text-[#31426F] shadow-[inset_0_0_16px_4px_rgba(255,255,255,0.50)] backdrop-blur-md"
                style={{ fontFamily: pingFang, lineHeight: 1 }}
              >
                探索功能
              </a>
              <button
                type="button"
                onClick={openDemoModal}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-[20px] border border-white/50 bg-[rgba(255,255,255,0.40)] text-[14px] font-normal tracking-normal text-[#31426F] shadow-[inset_0_0_16px_4px_rgba(255,255,255,0.50)] backdrop-blur-md"
                style={{ fontFamily: pingFang, lineHeight: 1 }}
              >
                查看演示
              </button>
            </div>
            <div
              className="home-fade-up mt-16 flex flex-col items-center"
              style={{ animationDelay: "0.5s" }}
            >
              <span className="mb-3 text-[12px] font-medium tracking-[0.28em] text-[#8b93a7]">
                向下探索
              </span>
              <div className="home-bounce-down flex h-7 w-7 items-center justify-center">
                <ChevronDownIcon className="h-5 w-5 fill-none stroke-[#8b93a7]" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
