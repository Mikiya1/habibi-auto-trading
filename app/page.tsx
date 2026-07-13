"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bi, useLang } from "./lib/lang";
import { loadCars, loadParts, addInquiry, Car, Part } from "./lib/data";

const VEHICLE_PHOTOS = [
  "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=85",
];
const PART_ICONS = ["◉", "▤", "▣", "✦"];
const STATUS_LABEL: Record<string, { ja: string; en: string }> = {
  available: { ja: "在庫あり", en: "In Stock" },
  reserved: { ja: "商談中", en: "Reserved" },
  sold: { ja: "売約済み", en: "Sold" },
};

export default function Home() {
  const { lang } = useLang();
  const [cars, setCars] = useState<Car[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    loadCars().then(setCars);
    loadParts().then(setParts);
  }, []);

  function showToast(m: string) {
    setToast(m);
    setTimeout(() => setToast(""), 2500);
  }

  async function submitContact() {
    if (!name.trim() || !email.trim() || !msg.trim()) {
      showToast(lang === "ja" ? "必須項目を入力してください" : "Please fill in required fields");
      return;
    }
    try {
      await addInquiry({ kind: "general", name, email, message: msg });
      setSent(true);
      showToast(lang === "ja" ? "送信しました" : "Message sent!");
    } catch (e) {
      console.error(e);
      showToast(lang === "ja" ? "送信に失敗しました" : "Failed to send");
    }
  }

  const previewCars = cars.filter((c) => c.status !== "sold").slice(0, 6);
  const previewParts = parts.slice(0, 4);

  return (
    <main>
      <section className="hero" id="home">
        <div className="heroShade" />
        <div className="heroContent">
          <p className="eyebrow"><Bi ja="日本から、世界の道へ。" en="FROM JAPAN, TO THE WORLD." /></p>
          <h1><Bi
            ja={<>日本の品質を、<br /><em>世界の道へ。</em></>}
            en={<>Japanese Quality,<br /><em>On Every Road.</em></>}
          /></h1>
          <p className="lead"><Bi
            ja="厳選した日本の中古車・部品を、透明な情報と確かな物流で。国内販売から海外輸出まで、ワンストップで支援します。"
            en="Carefully selected Japanese used cars and parts, backed by transparent information and reliable logistics — from domestic sales to overseas export, all in one place."
          /></p>
          <div className="actions">
            <Link href="/stock" className="primary"><Bi ja="在庫車両を見る" en="Browse Inventory" /> <span>→</span></Link>
            <Link href="/#contact" className="ghost"><Bi ja="仕入れを相談する" en="Talk to Us" /></Link>
          </div>
          <div className="heroStats num">
            <span><b>30+</b> <Bi ja="項目のインスペクション" en="inspected points" /></span>
            <span><b>3</b> <Bi ja="つの販売チャネル" en="sales channels" /></span>
            <span><b>JP / EN</b> <Bi ja="バイリンガル対応" en="bilingual support" /></span>
          </div>
        </div>
        <div className="scroll"><Bi ja="スクロール" en="SCROLL" /><i /></div>
      </section>

      <section className="intro">
        <p className="eyebrow wine"><Bi ja="私たちの仕事" en="WHAT WE DO" /></p>
        <h2><Bi ja={<>クルマを売るだけではなく、<br />次のオーナーまで責任を持つ。</>} en={<>More than a sale —<br />we stand behind every next owner.</>} /></h2>
        <p className="desc"><Bi
          ja="オークション仕入れ、状態確認、販売、輸出手配。車両ごとのストーリーと情報を丁寧に繋ぎます。"
          en="From auction sourcing to condition checks, sales, and export handling — we carefully carry each vehicle's story and information forward."
        /></p>
        <div className="serviceGrid">
          <article>
            <b className="num">01</b>
            <h3><Bi ja="厳選された車両" en="Selected Vehicles" /></h3>
            <p><Bi ja="相場と状態を見極め、価値のある一台だけを厳選。" en="We judge market value and condition to select only vehicles truly worth owning." /></p>
          </article>
          <article>
            <b className="num">02</b>
            <h3><Bi ja="グローバル物流" en="Global Logistics" /></h3>
            <p><Bi ja="港への搬入から輸出まで、状況をわかりやすく共有。" en="From port arrival to export, we keep you clearly informed at every step." /></p>
          </article>
          <article>
            <b className="num">03</b>
            <h3><Bi ja="信頼できるサポート" en="Trusted Support" /></h3>
            <p><Bi ja="日本語・英語で、購入前後の疑問に素早く対応。" en="Fast, bilingual support for any question before or after your purchase." /></p>
          </article>
        </div>
      </section>

      <section className="stock" id="stock">
        <div className="sectionHead">
          <div>
            <p className="eyebrow"><Bi ja="在庫車両" en="CURRENT INVENTORY" /></p>
            <h2><Bi ja="車両在庫" en="Vehicle Inventory" /></h2>
          </div>
          <p className="desc"><Bi
            ja="掲載情報はデータ層から取得する構造です。将来の在庫管理API連携時にも画面を作り直さず拡張できます。"
            en="Listings are served from a shared data layer, so future inventory/API integrations can extend this screen without a rebuild."
          /></p>
        </div>
        <div className="vehicleGrid">
          {previewCars.map((c, i) => {
            const carName = lang === "ja" ? c.name : c.nameEn;
            const grade = lang === "ja" ? c.grade : c.gradeEn;
            const fuel = lang === "ja" ? c.fuel : c.fuelEn;
            const status = STATUS_LABEL[c.status]?.[lang] || c.status;
            return (
              <Link className="vehicle" href={`/stock/${c.id}`} key={c.id}>
                <div className="vehiclePhoto">
                  <Image src={VEHICLE_PHOTOS[i % VEHICLE_PHOTOS.length]} alt={carName} fill sizes="(max-width: 900px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                  <span className={`vstatus ${c.status}`}>{status}</span>
                  <span className="vcode">HAB-{String(c.id).padStart(4, "0")}</span>
                </div>
                <div className="vehicleBody">
                  <p className="meta num">{c.year} · {carName}</p>
                  <h3>{grade}</h3>
                  <div className="vspecs num">
                    <span>{(c.km * 10000).toLocaleString()} km</span>
                    <span>{fuel}</span>
                    <span>{c.trans}</span>
                  </div>
                  <div className="vprice">
                    <b className="num">¥{(c.price * 10000).toLocaleString()}</b>
                    <span className="vlink"><Bi ja="詳細を見る →" en="View Details →" /></span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link href="/stock" className="ghost" style={{ borderColor: "#555", color: "#fff" }}><Bi ja="在庫一覧をすべて見る →" en="View All Inventory →" /></Link>
        </div>
      </section>

      <section className="parts" id="parts-preview">
        <div className="sectionHead">
          <div>
            <p className="eyebrow wine"><Bi ja="厳選純正部品" en="GENUINE & SELECTED" /></p>
            <h2><Bi ja="自動車部品" en="Auto Parts" /></h2>
          </div>
          <p className="desc"><Bi
            ja="純正中古部品を中心に、品番・適合確認を行ったうえで国内外へ販売します。"
            en="Mainly genuine used parts, verified by part number and fitment before sale, domestic and overseas."
          /></p>
        </div>
        <div className="partGrid">
          {previewParts.map((p, i) => (
            <Link href={`/parts/${p.id}`} key={p.id} style={{ display: "block", color: "inherit" }}>
              <article>
                <div className="partVisual">{PART_ICONS[i % PART_ICONS.length]}</div>
                <small>{lang === "ja" ? p.catLabel : p.catLabelEn}</small>
                <h3>{lang === "ja" ? p.name : p.nameEn}</h3>
                <p>{lang === "ja" ? p.fit : p.fitEn}</p>
                <div className="partFoot">
                  <b className="num">¥{p.price.toLocaleString()}</b>
                  <span><Bi ja="問い合わせ →" en="Inquire →" /></span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <section className="about" id="about-preview">
        <div className="aboutImage">
          <div className="stamp">EST.<br /><b className="num">2026</b><br />CHIBA</div>
        </div>
        <div className="aboutBody">
          <p className="eyebrow wine"><Bi ja="私たちの会社" en="OUR COMPANY" /></p>
          <h2><Bi ja={<>日本と世界をつなぐ、<br />小さく強いチーム。</>} en={<>A small, strong team<br />connecting Japan to the world.</>} /></h2>
          <p className="desc"><Bi
            ja="Habibi Auto Trading合同会社は、中古車の国内販売を足がかりに、世界市場への輸出を目指して設立しました。車両知識・相場分析・プロジェクト推進・英語交渉、それぞれの専門性を掛け合わせます。"
            en="Habibi Auto Trading LLC was founded on domestic used-car sales, aiming to export into global markets. We combine vehicle expertise, market analysis, project execution, and English negotiation."
          /></p>
          <div className="founders">
            <article>
              <span>MK</span>
              <div>
                <small><Bi ja="代表社員" en="CO-FOUNDER / CEO" /></small>
                <h4>Mikiya Nakagawa</h4>
                <p><Bi ja="仕入判断・車両評価・海外取引" en="Sourcing decisions, vehicle assessment, overseas dealings" /></p>
              </div>
            </article>
            <article>
              <span>KV</span>
              <div>
                <small><Bi ja="業務執行社員" en="CO-FOUNDER / MANAGING PARTNER" /></small>
                <h4>Kevin</h4>
                <p><Bi ja="事業戦略・顧客対応・オペレーション" en="Business strategy, client relations, operations" /></p>
              </div>
            </article>
          </div>
          <dl className="aboutDl">
            <div><dt><Bi ja="会社名" en="Company" /></dt><dd>Habibi Auto Trading合同会社</dd></div>
            <div><dt><Bi ja="事業内容" en="Business" /></dt><dd><Bi ja="中古車・部品の販売、輸出入、購入相談" en="Used car & parts sales, import/export, purchase advisory" /></dd></div>
            <div><dt><Bi ja="拠点" en="Location" /></dt><dd>Chiba, Japan</dd></div>
          </dl>
          <Link href="/about" className="ghost" style={{ display: "inline-block", marginTop: 10 }}><Bi ja="会社概要をもっと見る →" en="More About Us →" /></Link>
        </div>
      </section>

      <section className="cases" id="cases">
        <p className="eyebrow"><Bi ja="取引実績" en="TRACK RECORD" /></p>
        <h2><Bi ja="数字ではなく、一台ずつの実例で。" en="Told through real transactions." /></h2>
        <div className="caseGrid">
          <article>
            <b><Bi ja="国内販売" en="DOMESTIC SALE" /></b>
            <h3>Toyota Prius S Touring</h3>
            <p><Bi ja="低走行ハイブリッドの状態確認から価格設計、個人のお客様への販売支援まで実施。" en="From condition checks to pricing and sales support for a low-mileage hybrid, sold to a private buyer." /></p>
            <span><Bi ja="走行 11.3万km ｜ 国内個人販売" en="11,300 km · Domestic private sale" /></span>
          </article>
          <article>
            <b><Bi ja="仕入れ" en="SOURCING" /></b>
            <h3>Land Cruiser Prado TZ-G</h3>
            <p><Bi ja="装備・オークション評価・市場価格を精査し、輸出利益を確保できる仕入れを実現。" en="Careful review of equipment, auction grade, and pricing secured strong export margins." /></p>
            <span><Bi ja="JUオークション仕入れ ｜ 車両評価" en="JU auction sourcing · Assessment" /></span>
          </article>
          <article>
            <b><Bi ja="部品販売" en="PARTS" /></b>
            <h3>Front Bumper — Prado 150</h3>
            <p><Bi ja="適合する中古部品を特定し、品番照合から海外バイヤーへの販売まで調査・対応。" en="Identified a compatible used part, verified fitment, and supported sale to an overseas buyer." /></p>
            <span><Bi ja="品番照合 ｜ 部品販売" en="Part verification · Parts sale" /></span>
          </article>
        </div>
      </section>

      <section className="journal" id="journal">
        <div className="sectionHead">
          <div>
            <p className="eyebrow wine"><Bi ja="ニュース・コラム" en="JOURNAL" /></p>
            <h2><Bi ja="お知らせと、役立つ情報を。" en="Company News & Insights" /></h2>
          </div>
          <p className="desc"><Bi
            ja="会社のお知らせ、市況、クルマ選びと輸出に役立つ情報を発信します。"
            en="Company updates, market notes, and practical tips on choosing and exporting vehicles."
          /></p>
        </div>
        <div className="journal-list">
          <Link href="/about">
            <time className="num">2026.05</time>
            <span className="jcat"><Bi ja="会社情報" en="Company" /></span>
            <h3><Bi ja="Habibi Auto Trading合同会社を設立しました" en="We founded Habibi Auto Trading LLC" /></h3>
            <span className="jlink"><Bi ja="読む →" en="Read →" /></span>
          </Link>
          <Link href="/#stock">
            <time className="num">2026.06</time>
            <span className="jcat"><Bi ja="ガイド" en="Guide" /></span>
            <h3><Bi ja="中古車輸出の流れ：仕入れから現地到着まで" en="How Export Works: Sourcing to Arrival" /></h3>
            <span className="jlink"><Bi ja="読む →" en="Read →" /></span>
          </Link>
          <Link href="/stock">
            <time className="num">2026.07</time>
            <span className="jcat"><Bi ja="マーケット" en="Market" /></span>
            <h3><Bi ja="日本の中古車を海外で選ぶメリットとは" en="Why Buyers Choose Japanese Used Cars" /></h3>
            <span className="jlink"><Bi ja="読む →" en="Read →" /></span>
          </Link>
        </div>
      </section>

      <section className="contact" id="contact">
        <p className="eyebrow"><Bi ja="お問い合わせ" en="START A CONVERSATION" /></p>
        <h2><Bi ja={<>探している一台を、<br />聞かせてください。</>} en={<>Tell us about<br />the car you&apos;re looking for.</>} /></h2>
        <p className="desc"><Bi
          ja="在庫車両、部品、販売・輸出のご相談まで。ご都合の良い方法でお気軽にお問い合わせください。"
          en="Inventory, parts, sales, or export — reach out however is easiest for you."
        /></p>
        <div className="contactBtns">
          <a href="https://wa.me/818012345678" target="_blank" rel="noreferrer">WhatsApp <span>↗</span></a>
          <a href="mailto:habibicars.tokyo@gmail.com">Email <span>↗</span></a>
        </div>
        <small><Bi ja="通常1営業日以内に返信します / 日本語・英語対応" en="We typically reply within 1 business day / Japanese & English" /></small>

        <div style={{ maxWidth: 520, margin: "50px auto 0", textAlign: "left" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#999", display: "block", marginBottom: 6 }}>
              <Bi ja="お名前" en="Name" />
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", background: "#242524", border: "1px solid #3a3a3a", color: "#fff", padding: 12, fontSize: 13 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#999", display: "block", marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", background: "#242524", border: "1px solid #3a3a3a", color: "#fff", padding: 12, fontSize: 13 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#999", display: "block", marginBottom: 6 }}>
              <Bi ja="メッセージ" en="Message" />
            </label>
            <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} style={{ width: "100%", background: "#242524", border: "1px solid #3a3a3a", color: "#fff", padding: 12, fontSize: 13, fontFamily: "inherit" }} />
          </div>
          <button onClick={submitContact} style={{ width: "100%", background: "var(--wine)", color: "#fff", border: "1px solid var(--wine)", padding: 15, fontSize: 13, fontWeight: 700 }}>
            <Bi ja="送信する" en="Send Message" />
          </button>
          {sent && (
            <div style={{ marginTop: 14, padding: 12, border: "1px solid #3a3a3a", color: "#bbb", fontSize: 12, textAlign: "center" }}>
              <Bi ja="お問い合わせを受け付けました。" en="Message received." />
            </div>
          )}
        </div>
      </section>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#171817", color: "#fff", padding: "12px 24px", fontSize: 13, zIndex: 999 }}>
          {toast}
        </div>
      )}
    </main>
  );
}
