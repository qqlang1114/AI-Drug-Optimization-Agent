"use client";

import { heroVideoDesktopSrc, heroVideoMobileSrc } from "./assets";

/** Background videos — metadata preload reduces contention when opening the demo modal. */
export function HeroBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <video
        className="hidden h-full w-full object-cover [filter:saturate(1.15)_contrast(1.08)] lg:block"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src={heroVideoDesktopSrc} type="video/mp4" />
      </video>
      <video
        className="h-full w-full object-cover [filter:saturate(1.15)_contrast(1.08)] lg:hidden"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src={heroVideoMobileSrc} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,251,255,0.72)_0%,rgba(243,247,255,0.56)_38%,rgba(228,236,255,0.26)_100%)] lg:hidden" />
    </div>
  );
}
