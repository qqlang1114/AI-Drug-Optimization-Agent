import { Suspense } from "react";
import { LoginPage } from "@/components/sites/www-yaozhineng-com-268f6e3b/login/LoginPage";

export default function LoginRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc] text-sm text-[#6e7890]">
          加载中…
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  );
}
