"use client";

import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "../shared/icons";
import { workflowDemoSrc } from "./assets";
import { useDemoModalControls } from "./demo-modal-store";

function pausePageVideos() {
  const videos = Array.from(document.querySelectorAll("video"));
  const playing: HTMLVideoElement[] = [];
  for (const video of videos) {
    if (!video.paused) {
      playing.push(video);
      video.pause();
    }
  }
  return () => {
    for (const video of playing) {
      void video.play().catch(() => {
        /* ignore autoplay rejection */
      });
    }
  };
}

/**
 * Debug findings → fixes:
 * 1) Parent re-render: open state lives in demo-modal-store; HeroSection does not setState.
 * 2) iframe blocking paint: shell paints empty; iframe mounts only after contentShow ends (~300ms).
 * 3) Animation waiting on content: placeholder is lightweight; heavy iframe is post-animation.
 */
function DemoModalImpl() {
  const { open, onOpenChange } = useDemoModalControls();
  const [portalReady, setPortalReady] = useState(false);
  /** Heavy iframe only after open animation finishes. */
  const [mountHeavy, setMountHeavy] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    const resumeVideos = pausePageVideos();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      resumeVideos();
    };
  }, [open, onOpenChange]);

  // Attach before paint so we never miss contentShow; mount iframe only after it ends.
  useLayoutEffect(() => {
    if (!open) {
      setMountHeavy(false);
      return;
    }

    const content = contentRef.current;
    let done = false;
    const enableHeavy = () => {
      if (done || !openRef.current) return;
      done = true;
      setMountHeavy(true);
    };

    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.target !== content) return;
      if (
        event.animationName &&
        !event.animationName.includes("contentShow")
      ) {
        return;
      }
      enableHeavy();
    };

    content?.addEventListener("animationend", onAnimationEnd);
    const fallback = window.setTimeout(enableHeavy, 320);

    return () => {
      done = true;
      window.clearTimeout(fallback);
      content?.removeEventListener("animationend", onAnimationEnd);
    };
  }, [open]);

  if (!portalReady || !open) return null;

  return createPortal(
    // Flex centering — no transform translate, so contentShow scale/opacity cannot un-center.
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-0">
      <div
        className="yzn-animate-overlay-show absolute inset-0 z-50 bg-[rgba(61,67,85,0.3)]"
        aria-hidden="true"
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="workflow-demo-title"
        aria-describedby="workflow-demo-desc"
        className="yzn-animate-content-show relative z-50 grid h-[min(92vh,860px)] w-full max-w-[min(1440px,calc(100vw-24px))] gap-3 overflow-hidden border border-white/40 bg-white/78 p-0 shadow-[0_24px_80px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:rounded-[16px]"
      >
        <h2
          id="workflow-demo-title"
          className="sr-only text-[20px] font-medium leading-none tracking-tight"
        >
          成药性优化智能体工作流演示
        </h2>
        <p id="workflow-demo-desc" className="sr-only text-[14px]">
          查看成药性优化智能体的完整工作流动画演示。
        </p>

        {mountHeavy ? (
          <iframe
            src={workflowDemoSrc}
            title="成药性优化智能体工作流演示"
            className="h-full w-full bg-[#f7f8fc]"
            loading="eager"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#f7f8fc] text-sm text-[#6e7890]">
            加载演示…
          </div>
        )}

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-[32px] top-[32px] rounded-sm text-slate-500 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <CloseIcon className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>,
    document.body,
  );
}

export const DemoModal = memo(DemoModalImpl);
