import Link from "next/link";
import { Bi } from "../lib/lang";

export function Footer() {
  return (
    <footer className="siteFoot">
      <Link href="/" className="logo">
        <span className="mark"><span>H</span></span>
        <span><b>HABIBI</b><small>AUTO TRADING</small></span>
      </Link>
      <p><Bi ja="日本の車両を、世界の可能性へ。" en="Japanese vehicles. Global possibilities." /></p>
      <span className="num">© 2026 HABIBI AUTO TRADING LLC.</span>
    </footer>
  );
}
