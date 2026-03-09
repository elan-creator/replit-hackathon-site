import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "바이브코딩 워크샵",
  description: "AI 에이전트 & 바이브코딩 워크샵 문서",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
