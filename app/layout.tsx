import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "午餐大转盘",
  description: "用 Next.js 做的午餐选择转盘。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
