"use client";

import { useEffect, useState } from "react";
import {
  loadCars, addCar, updateCar, deleteCar, Car,
  loadParts, addPart, updatePart, deletePart, Part,
  listInquiries, updateInquiryStatus, Inquiry,
} from "../lib/data";

const PASSCODE = "habibi2026";
const CAT_LABEL_JA: Record<string, string> = {
  engine: "エンジン関連", body: "外装・ボディ", interior: "内装", electrical: "電装品",
  wheel: "ホイール・タイヤ", suspension: "足回り", other: "その他",
};
const STATUS_LABEL_JA: Record<string, string> = { available: "在庫あり", reserved: "商談中", sold: "売約済み" };

type Tab = "cars" | "parts" | "inquiries";

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [gateErr, setGateErr] = useState(false);
  const [tab, setTab] = useState<Tab>("cars");

  const [cars, setCars] = useState<Car[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const [carModal, setCarModal] = useState<Partial<Car> | null>(null);
  const [partModal, setPartModal] = useState<Partial<Part> | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("habibi_admin_ok") === "1") setUnlocked(true);
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    loadCars().then(setCars);
    loadParts().then(setParts);
    listInquiries().then(setInquiries);
  }, [unlocked]);

  function showToast(m: string) {
    setToast(m);
    setTimeout(() => setToast(""), 2500);
  }

  function tryUnlock() {
    if (passInput === PASSCODE) {
      sessionStorage.setItem("habibi_admin_ok", "1");
      setUnlocked(true);
    } else {
      setGateErr(true);
    }
  }

  async function saveCarForm() {
    if (!carModal?.name) { showToast("車名を入力してください"); return; }
    try {
      if (carModal.id) await updateCar(carModal.id, carModal);
      else await addCar(carModal);
      setCars(await loadCars());
      setCarModal(null);
      showToast("車両を保存しました");
    } catch (e) { console.error(e); showToast("保存に失敗しました"); }
  }
  async function handleDeleteCar(id: number) {
    if (!confirm("この車両を削除しますか？")) return;
    await deleteCar(id);
    setCars(await loadCars());
    showToast("削除しました");
  }

  async function savePartForm() {
    if (!partModal?.name) { showToast("部品名を入力してください"); return; }
    try {
      const data = { ...partModal, catLabel: CAT_LABEL_JA[partModal.cat || "other"] };
      if (partModal.id) await updatePart(partModal.id, data);
      else await addPart(data);
      setParts(await loadParts());
      setPartModal(null);
      showToast("部品を保存しました");
    } catch (e) { console.error(e); showToast("保存に失敗しました"); }
  }
  async function handleDeletePart(id: number) {
    if (!confirm("この部品を削除しますか？")) return;
    await deletePart(id);
    setParts(await loadParts());
    showToast("削除しました");
  }

  async function handleInquiryStatus(id: number, status: string) {
    await updateInquiryStatus(id, status);
    setInquiries(await listInquiries());
  }

  if (!unlocked) {
    return (
      <div className="adminGate">
        <div className="adminGateBox">
          <h2 style={{ fontFamily: "Georgia", fontWeight: 400, marginBottom: 6 }}>管理画面</h2>
          <p style={{ fontSize: 12, color: "#999", marginBottom: 20 }}>Habibi Auto Trading — Admin</p>
          <input
            type="password"
            placeholder="パスコード"
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
          />
          <button onClick={tryUnlock}>ログイン</button>
          {gateErr && <p style={{ color: "var(--wine)", fontSize: 12, marginTop: 10 }}>パスコードが違います</p>}
        </div>
      </div>
    );
  }

  return (
    <main className="pageWrap" style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ background: "#f5f1e9", border: "1px solid var(--line)", padding: "14px 18px", fontSize: 12, color: "#777", marginBottom: 24 }}>
        この管理画面での変更はSupabaseに保存され、サイトを見ているすべての方に反映されます。
      </div>

      <div className="adminTabs">
        <button className={tab === "cars" ? "active" : ""} onClick={() => setTab("cars")}>車両管理</button>
        <button className={tab === "parts" ? "active" : ""} onClick={() => setTab("parts")}>部品管理</button>
        <button className={tab === "inquiries" ? "active" : ""} onClick={() => setTab("inquiries")}>
          お問い合わせ（{inquiries.filter((i) => i.status === "new").length}）
        </button>
      </div>

      {tab === "cars" && (
        <div>
          <div className="adminToolbar">
            <h2>車両在庫（{cars.length}台）</h2>
            <button className="adminBtn primary" onClick={() => setCarModal({ status: "available", export: false })}>＋ 車両を追加</button>
          </div>
          <table className="adminTable">
            <thead><tr><th>車両</th><th>年式/走行</th><th>価格</th><th>状態</th><th>輸出</th><th></th></tr></thead>
            <tbody>
              {cars.map((c) => (
                <tr key={c.id}>
                  <td><b style={{ fontFamily: "Georgia" }}>{c.name}</b><br /><small style={{ color: "#999" }}>{c.grade}</small></td>
                  <td>{c.year}年 / {c.km}万km</td>
                  <td>{c.price.toLocaleString()}万円</td>
                  <td>{STATUS_LABEL_JA[c.status]}</td>
                  <td>{c.export ? "✓" : "—"}</td>
                  <td>
                    <button className="adminBtn" onClick={() => setCarModal(c)}>編集</button>{" "}
                    <button className="adminBtn" onClick={() => handleDeleteCar(c.id)}>削除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "parts" && (
        <div>
          <div className="adminToolbar">
            <h2>部品在庫（{parts.length}点）</h2>
            <button className="adminBtn primary" onClick={() => setPartModal({ cat: "engine", condition: "used" })}>＋ 部品を追加</button>
          </div>
          <table className="adminTable">
            <thead><tr><th>部品名</th><th>カテゴリ</th><th>価格</th><th>在庫数</th><th></th></tr></thead>
            <tbody>
              {parts.map((p) => (
                <tr key={p.id}>
                  <td><b style={{ fontFamily: "Georgia" }}>{p.name}</b><br /><small style={{ color: "#999" }}>品番 {p.partNo}</small></td>
                  <td>{CAT_LABEL_JA[p.cat]}</td>
                  <td>¥{p.price.toLocaleString()}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button className="adminBtn" onClick={() => setPartModal(p)}>編集</button>{" "}
                    <button className="adminBtn" onClick={() => handleDeletePart(p.id)}>削除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "inquiries" && (
        <div>
          <div className="adminToolbar"><h2>お問い合わせ一覧</h2></div>
          <table className="adminTable">
            <thead><tr><th>受信日時</th><th>種別</th><th>対象</th><th>お名前</th><th>連絡先</th><th>メッセージ</th><th>状態</th></tr></thead>
            <tbody>
              {inquiries.map((i) => (
                <tr key={i.id}>
                  <td>{new Date(i.created_at).toLocaleString("ja-JP")}</td>
                  <td>{i.kind}</td>
                  <td>{i.ref_label || "—"}</td>
                  <td>{i.name}</td>
                  <td>{i.email}</td>
                  <td style={{ maxWidth: 240 }}>{(i.message || "").slice(0, 120)}</td>
                  <td>
                    <select value={i.status} onChange={(e) => handleInquiryStatus(i.id, e.target.value)}>
                      <option value="new">未対応</option>
                      <option value="read">確認済み</option>
                      <option value="replied">返信済み</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {carModal && (
        <div className="adminModal" onClick={() => setCarModal(null)}>
          <div className="adminModalBox" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: "Georgia", fontWeight: 400, marginBottom: 20 }}>{carModal.id ? "車両を編集" : "車両を追加"}</h3>
            <div className="adminFormGrid">
              <div><label>車名（日本語）</label><input value={carModal.name || ""} onChange={(e) => setCarModal({ ...carModal, name: e.target.value })} /></div>
              <div><label>車名（英語）</label><input value={carModal.nameEn || ""} onChange={(e) => setCarModal({ ...carModal, nameEn: e.target.value })} /></div>
              <div><label>グレード（日本語）</label><input value={carModal.grade || ""} onChange={(e) => setCarModal({ ...carModal, grade: e.target.value })} /></div>
              <div><label>グレード（英語）</label><input value={carModal.gradeEn || ""} onChange={(e) => setCarModal({ ...carModal, gradeEn: e.target.value })} /></div>
              <div><label>型式</label><input value={carModal.type || ""} onChange={(e) => setCarModal({ ...carModal, type: e.target.value })} /></div>
              <div><label>年式</label><input type="number" value={carModal.year || ""} onChange={(e) => setCarModal({ ...carModal, year: Number(e.target.value) })} /></div>
              <div><label>走行距離（万km）</label><input type="number" value={carModal.km || ""} onChange={(e) => setCarModal({ ...carModal, km: Number(e.target.value) })} /></div>
              <div><label>価格（万円）</label><input type="number" value={carModal.price || ""} onChange={(e) => setCarModal({ ...carModal, price: Number(e.target.value) })} /></div>
              <div><label>ステータス</label>
                <select value={carModal.status || "available"} onChange={(e) => setCarModal({ ...carModal, status: e.target.value as Car["status"] })}>
                  <option value="available">在庫あり</option>
                  <option value="reserved">商談中</option>
                  <option value="sold">売約済み</option>
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
                <input type="checkbox" checked={!!carModal.export} onChange={(e) => setCarModal({ ...carModal, export: e.target.checked })} style={{ width: "auto" }} />
                <label style={{ margin: 0 }}>輸出向け</label>
              </div>
              <div className="full"><label>担当者コメント（日本語）</label><textarea rows={3} value={carModal.comment || ""} onChange={(e) => setCarModal({ ...carModal, comment: e.target.value })} /></div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
              <button className="adminBtn" onClick={() => setCarModal(null)}>キャンセル</button>
              <button className="adminBtn primary" onClick={saveCarForm}>保存する</button>
            </div>
          </div>
        </div>
      )}

      {partModal && (
        <div className="adminModal" onClick={() => setPartModal(null)}>
          <div className="adminModalBox" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: "Georgia", fontWeight: 400, marginBottom: 20 }}>{partModal.id ? "部品を編集" : "部品を追加"}</h3>
            <div className="adminFormGrid">
              <div><label>部品名（日本語）</label><input value={partModal.name || ""} onChange={(e) => setPartModal({ ...partModal, name: e.target.value })} /></div>
              <div><label>部品名（英語）</label><input value={partModal.nameEn || ""} onChange={(e) => setPartModal({ ...partModal, nameEn: e.target.value })} /></div>
              <div><label>カテゴリ</label>
                <select value={partModal.cat || "engine"} onChange={(e) => setPartModal({ ...partModal, cat: e.target.value })}>
                  {Object.entries(CAT_LABEL_JA).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div><label>状態</label>
                <select value={partModal.condition || "used"} onChange={(e) => setPartModal({ ...partModal, condition: e.target.value as Part["condition"] })}>
                  <option value="new">新品</option>
                  <option value="used">中古（良品）</option>
                  <option value="refurb">リビルト品</option>
                </select>
              </div>
              <div><label>適合車種</label><input value={partModal.fit || ""} onChange={(e) => setPartModal({ ...partModal, fit: e.target.value })} /></div>
              <div><label>品番</label><input value={partModal.partNo || ""} onChange={(e) => setPartModal({ ...partModal, partNo: e.target.value })} /></div>
              <div><label>価格（円）</label><input type="number" value={partModal.price || ""} onChange={(e) => setPartModal({ ...partModal, price: Number(e.target.value) })} /></div>
              <div><label>在庫数</label><input type="number" value={partModal.stock || ""} onChange={(e) => setPartModal({ ...partModal, stock: Number(e.target.value) })} /></div>
              <div className="full"><label>商品説明</label><textarea rows={3} value={partModal.desc || ""} onChange={(e) => setPartModal({ ...partModal, desc: e.target.value })} /></div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
              <button className="adminBtn" onClick={() => setPartModal(null)}>キャンセル</button>
              <button className="adminBtn primary" onClick={savePartForm}>保存する</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#171817", color: "#fff", padding: "12px 24px", fontSize: 13, zIndex: 999 }}>
          {toast}
        </div>
      )}
    </main>
  );
}
