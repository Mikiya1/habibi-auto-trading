"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang, Bi } from "../lib/lang";

export function Header() {
  const { lang, toggle } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <header>
      <Link href="/" className="logo">
        <span className="mark"><span>H</span></span>
        <span><b>HABIBI</b><small>AUTO TRADING</small></span>
      </Link>
      <nav className={`mainnav${open ? " open" : ""}`}>
        <Link href="/#home"><Bi ja="ホーム" en="Home" /></Link>
        <Link href="/stock"><Bi ja="車両在庫" en="Vehicles" /></Link>
        <Link href="/parts"><Bi ja="パーツ" en="Parts" /></Link>
        <Link href="/about"><Bi ja="会社情報" en="Company" /></Link>
        <Link href="/#cases"><Bi ja="取引実績" en="Track Record" /></Link>
        <Link href="/#journal"><Bi ja="ニュース" en="Journal" /></Link>
        <button className="lang-btn" onClick={toggle}>{lang === "ja" ? "EN" : "JA"}</button>
        <Link href="/#contact" className="navCta"><Bi ja="お問い合わせ" en="Contact" /></Link>
      </nav>
      <button className="hamb" onClick={() => setOpen(!open)}>☰</button>
    </header>
  );
}
