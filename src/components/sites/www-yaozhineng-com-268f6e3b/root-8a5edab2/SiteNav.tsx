"use client";

import Link from "next/link";
import { navButtonBgSrc, startIconSrc, yznLogoSrc } from "./assets";

import { buildLoginChatHref } from "@/lib/auth/session";

const loginHref = buildLoginChatHref({ newSession: true });

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-[100] hidden h-16 items-center border-b border-white/25 bg-[rgba(248,249,252,0.36)] px-6 backdrop-blur-[24px] lg:flex md:px-12">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={yznLogoSrc}
          alt="成药性优化智能体"
          className="h-8 w-auto shrink-0 md:h-10"
          decoding="async"
        />
        <strong className="block truncate text-[14px] font-bold leading-none text-[#12396b] md:text-[16px]">
          药智能
        </strong>
      </div>
      <div className="ml-auto flex items-center gap-8">
        <a
          href="#features"
          onClick={(event) => {
            event.preventDefault();
            document
              .getElementById("features")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
            history.pushState(null, "", "#features");
          }}
          className="hidden text-sm font-medium text-[#5a6178] transition-colors hover:text-[#4f6ef7] sm:block"
        >
          核心功能
        </a>
        <Link
          href={loginHref}
          className="inline-flex h-10 w-[108px] items-center justify-center gap-1.5 bg-center bg-no-repeat text-sm font-medium text-white transition-transform hover:-translate-y-px"
          style={{
            backgroundImage: `url("${navButtonBgSrc}")`,
            backgroundSize: "100% 100%",
          }}
        >
          <img
            src={startIconSrc}
            alt=""
            aria-hidden="true"
            className="h-4 w-4"
          />
          开始使用
        </Link>
      </div>
    </nav>
  );
}
