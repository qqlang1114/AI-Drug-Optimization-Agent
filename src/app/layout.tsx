import type { Metadata } from "next";
import localFont from "next/font/local";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import "./globals.css";

const pangmen = localFont({
  src: "../../public/sites/www-yaozhineng-com-268f6e3b/shared/PangMenZhengDaoBiaoTiTi-1.ttf",
  variable: "--font-pangmen",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "FD-Agent Molecular UI",
  description: "AI驱动的成药性优化 — 成药性优化智能体",
  icons: {
    icon: "/sites/www-yaozhineng-com-268f6e3b/shared/yzn_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${pangmen.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#f8f9fc] text-[#1a1f36]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
