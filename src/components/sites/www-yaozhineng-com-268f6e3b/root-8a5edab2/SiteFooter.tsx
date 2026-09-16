export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-white/20 bg-transparent px-6 py-6 sm:px-12">
      <div className="mx-auto flex max-w-max flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center md:gap-x-8">
        <strong className="text-sm font-bold text-[#2d75f4] sm:text-base">
          药智能
        </strong>
        <p className="text-[13px] text-[#6e7890]">
          © 2026 药智能. 成药性优化智能体. 暨南大学生物活性分子与成药性优化全国重点实验室
          All rights reserved.
        </p>
        <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-center text-[11px] leading-5 text-[#7d89a3] sm:flex-nowrap sm:text-xs">
          <a
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noreferrer"
            aria-label="打开工业和信息化部备案管理系统，查看备案号 粤ICP备2026026873号-2"
            className="inline-flex items-center gap-1 font-normal text-[#5f76b3] transition-colors hover:text-[#2f5bff]"
          >
            <span className="break-all sm:break-normal">
              粤ICP备2026026873号-2
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
