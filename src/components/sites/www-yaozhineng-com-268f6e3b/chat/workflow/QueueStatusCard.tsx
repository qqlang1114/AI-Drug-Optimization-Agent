"use client";

type QueueStatusCardProps = {
  queueAhead: number;
};

export function QueueStatusCard({ queueAhead }: QueueStatusCardProps) {
  return (
    <div className="w-full max-w-[860px] rounded-2xl border border-[#dce6f8] bg-white/90 p-5 shadow-[0_8px_28px_rgba(64,88,151,0.08)] backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-[#22c55e] border-t-transparent" />
          <strong className="text-[15px] font-semibold text-[#1a1f36]">
            正在分析请求
          </strong>
          <span className="rounded-full bg-[#e8f9ef] px-2 py-0.5 text-[11px] font-semibold text-[#16a34a]">
            intake
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-[#dbe7ff] bg-[#f3f7ff] px-3 py-1 text-[12px] font-medium text-[#3b6ef5]">
            前方 {queueAhead} 个任务
          </span>
          <span className="rounded-full border border-[#dbe7ff] bg-[#f3f7ff] px-3 py-1 text-[12px] font-medium text-[#3b6ef5]">
            即将开始处理
          </span>
        </div>
      </div>
      <h3 className="mt-4 text-[20px] font-bold tracking-tight text-[#1a1f36]">
        正在分析您的请求类型...
      </h3>
      <p className="mt-1 text-[14px] text-[#6e7890]">正在同步排队位置</p>
      <div className="mt-4 rounded-xl border border-[#e8edf5] bg-[#f8fafc] px-4 py-3 text-[13px] leading-6 text-[#64748b]">
        请求已进入队列，位置会自动刷新。
      </div>
    </div>
  );
}
