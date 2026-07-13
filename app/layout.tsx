import type { Metadata } from "next";
import Script from "next/script";
import { LangProvider } from "./lib/lang";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Habibi Auto Trading — 日本から世界へ",
  description: "日本の中古車・部品を、透明な情報と確かな物流で。国内販売から海外輸出までワンストップで支援します。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js" strategy="beforeInteractive" />
        <LangProvider>
          <Header />
          {children}
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
