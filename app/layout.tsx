import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "밀 2%의 경고 | 식량안보 전략 연구소",
  description: "쌀과 밀로 탐구하는 기후변화, 식량안보, 지속 가능한 경제·경영 진로",
  openGraph: {
    title: "밀 2%의 경고 | 식량안보 전략 연구소",
    description: "쌀 99.1%와 밀 2.0%가 보여주는 기후위기 시대의 식량안보",
    type: "website",
    locale: "ko_KR",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "밀 2%의 경고, 쌀 99.1%의 기반" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "밀 2%의 경고 | 식량안보 전략 연구소",
    description: "기후변화·글로벌 공급망·지속 가능한 진로를 잇는 식량안보 탐구",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
