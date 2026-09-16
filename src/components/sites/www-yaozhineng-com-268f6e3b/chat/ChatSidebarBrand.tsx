import { chatLogoSrc } from "./assets";

/** Top-left product branding for the chat sidebar (not an avatar). */
export function ChatSidebarBrand() {
  return (
    <div className="px-5 pb-4 pt-5">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-[#e5e8f0] bg-white p-0 shadow-sm">
          <img
            src={chatLogoSrc}
            alt="药智能"
            width={28}
            height={28}
            className="pointer-events-none h-7 w-7 object-contain select-none"
            decoding="async"
            draggable={false}
          />
        </div>
        <span className="min-w-0">
          <strong className="block truncate text-[15px] font-bold text-[#1a1f36]">
            成药性优化智能体
          </strong>
          <span className="mt-0.5 block text-xs text-[#6e7890]">
            成药性分析与优化
          </span>
        </span>
      </div>
    </div>
  );
}
