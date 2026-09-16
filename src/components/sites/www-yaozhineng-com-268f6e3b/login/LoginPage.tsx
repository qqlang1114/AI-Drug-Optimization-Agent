"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { yznLogoSrc } from "@/components/sites/www-yaozhineng-com-268f6e3b/root-8a5edab2/assets";
import { AuthBootScreen, useAuth } from "@/lib/auth/AuthProvider";
import { resolvePostLoginRedirect } from "@/lib/auth/session";

type Mode = "login" | "register";

export function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, ready, login, register } = useAuth();
  const redirectTo = useMemo(
    () =>
      resolvePostLoginRedirect(
        searchParams.get("redirect"),
        searchParams.get("new"),
      ),
    [searchParams],
  );

  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  /** Hide login chrome immediately on success / existing session. */
  const [leaving, setLeaving] = useState(false);

  const canSubmit =
    username.trim().length >= 2 &&
    username.trim().length <= 50 &&
    password.length >= 4 &&
    !submitting;

  useEffect(() => {
    if (!ready) return;
    if (!user) return;
    setLeaving(true);
    router.replace(redirectTo);
  }, [ready, user, router, redirectTo]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const result =
      mode === "login"
        ? await login(username, password)
        : await register(username, password, displayName);
    if (!result.ok) {
      setSubmitting(false);
      setError(result.error);
      return;
    }
    // Do not paint the login form again — jump straight to boot → /chat.
    setLeaving(true);
    router.replace(redirectTo);
  }

  // Auth not ready, or navigating away after session exists / login success.
  if (!ready || leaving || user) {
    return <AuthBootScreen />;
  }

  return (
    <div className="auth-shell-viewport grid bg-transparent lg:grid-cols-[minmax(420px,44%)_1fr]">
      <div className="auth-shell-column flex flex-col bg-transparent px-6 md:px-10">
        <div className="mb-8 flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-sm text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e5e8f0] bg-white p-0 shadow-sm">
              <img
                src={yznLogoSrc}
                alt="成药性优化智能体"
                className="h-7 w-7 object-contain"
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
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[440px] rounded-[28px] border border-[#e8ebf2] bg-white/85 shadow-[0_14px_40px_rgba(34,35,43,0.08)] backdrop-blur-[20px]">
            <div className="space-y-4 px-8 pb-0 pt-8 text-center md:px-9 md:pt-10">
              <div className="space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center">
                  <img
                    src={yznLogoSrc}
                    alt="成药性优化智能体"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold tracking-[-0.03em] text-[#1a1f36]">
                    成药性优化智能体
                  </h3>
                  <p className="text-[13px] text-[#6e7890]">
                    AI-Powered Molecular Druggability Optimization
                  </p>
                </div>
              </div>
            </div>

            <div className="px-8 pb-8 pt-8 md:px-9 md:pb-10">
              <form className="space-y-5" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="text-[14px] leading-none text-[#1a1f36]"
                  >
                    用户名
                  </label>
                  <input
                    id="username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入用户名 (2-50字符)"
                    className="flex h-11 w-full rounded-xl border border-[#e2e8f0] bg-transparent px-3 py-1 text-base text-[#1a1f36] transition-colors placeholder:text-[#94a3b8] hover:border-[#4f6ef7] focus-visible:border-[#4f6ef7] focus-visible:outline-none md:text-[14px]"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-[14px] leading-none text-[#1a1f36]"
                  >
                    密码
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码 (至少4位)"
                    className="flex h-11 w-full rounded-xl border border-[#e2e8f0] bg-transparent px-3 py-1 text-base text-[#1a1f36] transition-colors placeholder:text-[#94a3b8] hover:border-[#4f6ef7] focus-visible:border-[#4f6ef7] focus-visible:outline-none md:text-[14px]"
                  />
                </div>

                {mode === "register" ? (
                  <div className="space-y-2">
                    <label
                      htmlFor="displayName"
                      className="text-[14px] leading-none text-[#1a1f36]"
                    >
                      显示名称 (可选)
                    </label>
                    <input
                      id="displayName"
                      autoComplete="nickname"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="请输入显示名称"
                      className="flex h-11 w-full rounded-xl border border-[#e2e8f0] bg-transparent px-3 py-1 text-base text-[#1a1f36] transition-colors placeholder:text-[#94a3b8] hover:border-[#4f6ef7] focus-visible:border-[#4f6ef7] focus-visible:outline-none md:text-[14px]"
                    />
                  </div>
                ) : null}

                {error ? (
                  <p className="text-center text-[13px] text-red-500">{error}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#4f6ef7] px-4 text-sm font-semibold text-white shadow transition-colors hover:bg-[#3f5de6] active:bg-[#2648DC] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? mode === "login"
                      ? "登录中…"
                      : "注册中…"
                    : mode === "login"
                      ? "登 录"
                      : "注 册"}
                </button>

                <div className="space-y-2 text-center text-[13px] text-[#6e7890]">
                  {mode === "login" ? (
                    <p>
                      还没有账号？
                      <button
                        type="button"
                        className="ml-1 h-auto px-1.5 py-0 text-[13px] font-semibold text-[#4f6ef7] hover:text-[#4f6ef7]/90"
                        onClick={() => {
                          setMode("register");
                          setError("");
                        }}
                      >
                        立即注册
                      </button>
                    </p>
                  ) : (
                    <p>
                      已有账号？
                      <button
                        type="button"
                        className="ml-1 h-auto px-1.5 py-0 text-[13px] font-semibold text-[#4f6ef7] hover:text-[#4f6ef7]/90"
                        onClick={() => {
                          setMode("login");
                          setError("");
                        }}
                      >
                        去登录
                      </button>
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="pt-3 text-center md:pt-4">
          <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-center text-[11px] leading-5 text-[#7d89a3] sm:text-xs">
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
      </div>

      <div className="relative hidden overflow-hidden bg-[#1a1f36] text-white lg:block">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(circle, black, transparent 85%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(118,140,255,0.28),transparent_45%)]" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">
          <h1 className="mb-3.5 bg-[linear-gradient(180deg,#ffffff,rgba(255,255,255,0.5))] bg-clip-text font-pangmen text-[clamp(48px,8vw,104px)] leading-none text-transparent">
            成药性优化智能体
          </h1>
          <p className="max-w-[640px] text-base leading-[1.8] text-white/70">
            围绕先导化合物成药性分析、结构优化与靶点研究，提供一体化智能辅助。
          </p>
        </div>
      </div>
    </div>
  );
}
