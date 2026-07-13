"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Bi, useLang } from "../../lib/lang";
import { loadCars, addInquiry, Car } from "../../lib/data";

const VEHICLE_PHOTOS = [
  "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=85",
];
const STATUS_LABEL: Record<string, { ja: string; en: string }> = {
  available: { ja: "在庫あり", en: "In Stock" },
  reserved: { ja: "商談中", en: "Reserved" },
  sold: { ja: "売約済み", en: "Sold" },
};

export default function StockDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { lang } = useLang();
  const [cars, setCars] = useState<Car[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => { loadCars().then(setCars); }, []);

  const car = cars.find((c) => c.id === id);
  const idx = cars.findIndex((c) => c.id === id);
  const similar = cars.filter((c) => c.id !== id && car && (c.name === car.name || (c.export && car.export))).slice(0, 4);

  function showToast(m: string) {
    setToast(m);
    setTimeout(() => setToast(""), 2500);
  }

  async function submitForm() {
    if (!car) return;
    if (!name.trim() || !email.trim()) {
      showToast(lang === "ja" ? "お名前とメールアドレスは必須です" : "Name and email are required");
      return;
    }
    try {
      await addInquiry({ kind: "car", refId: car.id, refLabel: `${car.name} ${car.grade}`, name, email, message: msg });
      setSent(true);
      showToast(lang === "ja" ? "お問い合わせを送信しました" : "Message sent!");
    } catch (e) {
      console.error(e);
      showToast(lang === "ja" ? "送信に失敗しました" : "Failed to send");
    }
  }

  function openWhatsApp() {
    if (!car) return;
    const text = encodeURIComponent(`【在庫問い合わせ】${car.name} ${car.grade}（${car.year}年 走行${car.km}万km ${car.price}万円）について詳細をお聞きしたいです。`);
    window.open(`https://wa.me/818012345678?text=${text}`, "_blank");
  }

  if (!car) {
    return (
      <main className="pageWrap">
        <p><Bi ja="読み込み中..." en="Loading..." /></p>
      </main>
    );
  }

  const carName = lang === "ja" ? car.name : car.nameEn;
  const grade = lang === "ja" ? car.grade : car.gradeEn;
  const status = STATUS_LABEL[car.status]?.[lang] || car.status;
  const fobUsd = Math.round((car.price * 10000) / 159);

  const specs: [string, string][] = lang === "ja" ? [
    ["メーカー", car.maker], ["車名", car.name], ["グレード", car.grade],
    ["型式", car.type], ["年式", `${car.year}年`], ["走行距離", `${(car.km * 10000).toLocaleString()} km`],
    ["車体色", car.color], ["エンジン", car.engine], ["燃料", car.fuel],
    ["ミッション", car.trans], ["駆動方式", car.drive], ["乗車定員", `${car.seats}名`],
    ["車検", car.shaken], ["修復歴", car.repair], ["評価点", car.score],
  ] : [
    ["Make", car.makerEn], ["Model", car.nameEn], ["Grade", car.gradeEn],
    ["Model Code", car.type], ["Year", String(car.year)], ["Mileage", `${(car.km * 10000).toLocaleString()} km`],
    ["Color", car.colorEn], ["Engine", car.engineEn], ["Fuel", car.fuelEn],
    ["Transmission", car.transEn], ["Drivetrain", car.driveEn], ["Seats", String(car.seats)],
    ["Shaken", car.shakenEn], ["Accident History", car.repairEn], ["Auction Grade", car.score],
  ];

  return (
    <main>
      <div className="toolbar" style={{ position: "static" }}>
        <Link href="/stock" style={{ fontSize: 13, color: "var(--wine)" }}><Bi ja="← 在庫一覧へ戻る" en="← Back to Inventory" /></Link>
      </div>

      <div className="pageWrap">
        <div className="detailLayout">
          <div>
            <div className="detailFlags">
              <span className={`flag ${car.status}`}>{status}</span>
              {car.export && <span className="flag wine"><Bi ja="輸出向け" en="Export" /></span>}
            </div>
            <h1 className="detailTitle">{carName}</h1>
            <p className="detailSub">{grade}（{car.type}）</p>
            <p className="detailCode num">HAB-{String(car.id).padStart(4, "0")}</p>

            <div className="detailPhoto">
              <Image src={VEHICLE_PHOTOS[idx % VEHICLE_PHOTOS.length]} alt={carName} fill sizes="60vw" style={{ objectFit: "cover" }} />
            </div>

            <h2 className="sectionSubtitle"><Bi ja="車両スペック" en="Vehicle Specifications" /></h2>
            <table className="specTable">
              <tbody>
                {specs.map(([k, v]) => (
                  <tr key={k}><th>{k}</th><td className="num">{v}</td></tr>
                ))}
              </tbody>
            </table>

            <h2 className="sectionSubtitle"><Bi ja="装備・オプション" en="Equipment & Options" /></h2>
            <table className="specTable">
              <tbody>
                <tr><th><Bi ja="安全装備" en="Safety" /></th><td>{lang === "ja" ? car.safety : car.safetyEn}</td></tr>
                <tr><th><Bi ja="快適装備" en="Comfort" /></th><td>{lang === "ja" ? car.comfort : car.comfortEn}</td></tr>
                <tr><th><Bi ja="ナビ / AV" en="Navigation / AV" /></th><td>{lang === "ja" ? car.navi : car.naviEn}</td></tr>
                <tr><th><Bi ja="その他" en="Other" /></th><td>{lang === "ja" ? car.other : car.otherEn}</td></tr>
              </tbody>
            </table>

            <h2 className="sectionSubtitle"><Bi ja="担当者コメント" en="Staff Comment" /></h2>
            <p style={{ color: "var(--mid)", lineHeight: 1.9, fontSize: 14 }}>{lang === "ja" ? car.comment : car.commentEn}</p>
          </div>

          <aside>
            <div className="priceBox">
              <div className="label"><Bi ja="販売価格（税込）" en="Price (tax included)" /></div>
              <div className="amount num">¥{(car.price * 10000).toLocaleString()}</div>
              <div className="fobRow">
                <span><Bi ja="FOB概算" en="Est. FOB" /></span>
                <span className="num">${fobUsd.toLocaleString()}</span>
              </div>
            </div>
            <div className="inqBox">
              <h3><Bi ja="この車両について問い合わせる" en="Inquire About This Vehicle" /></h3>
              <label><Bi ja="お名前" en="Name" /> *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
              <label>Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <label><Bi ja="メッセージ" en="Message" /></label>
              <textarea rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} />
              <button className="submit" onClick={submitForm}><Bi ja="送信する" en="Send Message" /></button>
              <button className="wa" onClick={openWhatsApp}>WhatsApp<Bi ja="で問い合わせ" en="" /></button>
              {sent && <div className="inqSuccess"><Bi ja="お問い合わせを受け付けました。" en="Message received." /></div>}
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <>
            <h2 className="sectionSubtitle" style={{ marginTop: 60, maxWidth: 1200, marginLeft: "auto", marginRight: "auto" }}>
              <Bi ja="類似車両" en="Similar Vehicles" />
            </h2>
            <div className="simGrid">
              {similar.map((c) => {
                const sIdx = cars.findIndex((x) => x.id === c.id);
                return (
                  <Link href={`/stock/${c.id}`} key={c.id} style={{ display: "block", color: "inherit" }}>
                    <div style={{ aspectRatio: "4/3", position: "relative", overflow: "hidden", marginBottom: 10 }}>
                      <Image src={VEHICLE_PHOTOS[sIdx % VEHICLE_PHOTOS.length]} alt={c.name} fill sizes="25vw" style={{ objectFit: "cover" }} />
                    </div>
                    <div style={{ fontSize: 15, fontFamily: "Georgia", marginBottom: 4 }}>{lang === "ja" ? c.name : c.nameEn}</div>
                    <div style={{ fontSize: 16, color: "var(--wine)", fontFamily: "Georgia" }} className="num">¥{(c.price * 10000).toLocaleString()}</div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#171817", color: "#fff", padding: "12px 24px", fontSize: 13, zIndex: 999 }}>
          {toast}
        </div>
      )}
    </main>
  );
}
