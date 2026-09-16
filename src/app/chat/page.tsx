import { Suspense } from "react";
import { ChatPageShell } from "@/components/sites/www-yaozhineng-com-268f6e3b/chat/ChatPageShell";

export default function ChatRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] text-sm text-[#6e7890]">
          加载中…
        </div>
      }
    >
      <ChatPageShell />
    </Suspense>
  );
}
