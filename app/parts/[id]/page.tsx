"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Bi, useLang } from "../../lib/lang";
import { loadParts, addInquiry, Part } from "../../lib/data";

const PART_ICONS: Record<string, string> = {
  engine: "◉", body: "▤", interior: "▣", electrical: "✦", wheel: "◎", suspension: "◐", other: "▢",
};
const COND_LABEL: Record<string, { ja: string; en: string }> = {
  new: { ja: "新品", en: "New" },
  used: { ja: "中古（良品）", en: "Used (Good)" },
  refurb: { ja: "リビルト品", en: "Refurbished" },
};

export default function PartDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { lang } = useLang();
  const [parts, setParts] = useState<Part[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [vin, setVin] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => { loadParts().then(setParts); }, []);

  const part = parts.find((p) => p.id === id);

  function showToast(m: string) {
    setToast(m);
    setTimeout(() => setToast(""), 2500);
  }

  async function submitForm() {
    if (!part) return;
    if (!name.trim() || !email.trim()) {
      showToast(lang === "ja" ? "お名前とメールアドレスは必須です" : "Name and email are required");
      return;
    }
    try {
      await addInquiry({ kind: "part", refId: part.id, refLabel: part.name, name, email, vin, message: msg });
      setSent(true);
      showToast(lang === "ja" ? "お問い合わせを送信しました" : "Message sent!");
    } catch (e) {
      console.error(e);
      showToast(lang === "ja" ? "送信に失敗しました" : "Failed to send");
    }
  }

  function openWhatsApp() {
    if (!part) return;
    const text = encodeURIComponent(`【部品問い合わせ】${part.name}（品番: ${part.partNo}）について詳細をお聞きしたいです。`);
    window.open(`https://wa.me/818012345678?text=${text}`, "_blank");
  }

  if (!part) {
    return (
      <main className="pageWrap">
        <p><Bi ja="読み込み中..." en="Loading..." /></p>
      </main>
    );
  }

  const partName = lang === "ja" ? part.name : part.nameEn;
  const fit = lang === "ja" ? part.fit : part.fitEn;
  const catLabel = lang === "ja" ? part.catLabel : part.catLabelEn;
  const cond = COND_LABEL[part.condition]?.[lang] || part.condition;

  return (
    <main>
      <div className="toolbar" style={{ position: "static" }}>
        <Link href="/parts" style={{ fontSize: 13, color: "var(--wine)" }}><Bi ja="← 部品在庫一覧へ戻る" en="← Back to Parts" /></Link>
      </div>

      <div className="pageWrap">
        <div className="detailLayout">
          <div>
            <div className="detailFlags">
              <span className="flag wine">{cond}</span>
              <span className="flag">{catLabel}</span>
            </div>
            <h1 className="detailTitle">{partName}</h1>
            <p className="detailSub"><Bi ja="適合: " en="Fits: " />{fit}</p>
            <p className="detailCode num"><Bi ja="品番 " en="P/N " />{part.partNo}</p>

            <div className="detailPhoto" style={{ background: "#e7e3db", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 90, color: "#999" }}>
              {PART_ICONS[part.cat] || "▢"}
            </div>

            <h2 className="sectionSubtitle"><Bi ja="部品情報" en="Part Information" /></h2>
            <table className="specTable">
              <tbody>
                <tr><th><Bi ja="カテゴリ" en="Category" /></th><td>{catLabel}</td></tr>
                <tr><th><Bi ja="適合車種" en="Fits" /></th><td>{fit}</td></tr>
                <tr><th><Bi ja="品番" en="Part No." /></th><td className="num">{part.partNo}</td></tr>
                <tr><th><Bi ja="状態" en="Condition" /></th><td>{cond}</td></tr>
                <tr><th><Bi ja="在庫数" en="Stock" /></th><td className="num">{part.stock}</td></tr>
              </tbody>
            </table>

            <h2 className="sectionSubtitle"><Bi ja="商品説明" en="Description" /></h2>
            <p style={{ color: "var(--mid)", lineHeight: 1.9, fontSize: 14 }}>{lang === "ja" ? part.desc : part.descEn}</p>
          </div>

          <aside>
            <div className="priceBox">
              <div className="label"><Bi ja="販売価格（税込）" en="Price (tax included)" /></div>
              <div className="amount num">¥{part.price.toLocaleString()}</div>
              <div className="fobRow">
                <span><Bi ja="在庫数" en="Stock" /></span>
                <span className="num">{part.stock > 0 ? part.stock : (lang === "ja" ? "在庫切れ" : "Out of Stock")}</span>
              </div>
            </div>
            <div className="inqBox">
              <h3><Bi ja="この部品について問い合わせる" en="Inquire About This Part" /></h3>
              <label><Bi ja="お名前" en="Name" /> *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
              <label>Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <label><Bi ja="車台番号・型式（適合確認用）" en="VIN / Model Code" /></label>
              <input value={vin} onChange={(e) => setVin(e.target.value)} />
              <label><Bi ja="メッセージ" en="Message" /></label>
              <textarea rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} />
              <button className="submit" onClick={submitForm}><Bi ja="送信する" en="Send Message" /></button>
              <button className="wa" onClick={openWhatsApp}>WhatsApp<Bi ja="で問い合わせ" en="" /></button>
              {sent && <div className="inqSuccess"><Bi ja="お問い合わせを受け付けました。" en="Message received." /></div>}
            </div>
          </aside>
        </div>
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#171817", color: "#fff", padding: "12px 24px", fontSize: 13, zIndex: 999 }}>
          {toast}
        </div>
      )}
    </main>
  );
}
