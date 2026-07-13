"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bi, useLang } from "../lib/lang";
import { loadParts, Part } from "../lib/data";

const PART_ICONS: Record<string, string> = {
  engine: "◉", body: "▤", interior: "▣", electrical: "✦", wheel: "◎", suspension: "◐", other: "▢",
};
const CAT_OPTIONS = [
  ["", "すべてのカテゴリ", "All Categories"],
  ["engine", "エンジン関連", "Engine"],
  ["body", "外装・ボディ", "Body/Exterior"],
  ["interior", "内装", "Interior"],
  ["electrical", "電装品", "Electrical"],
  ["wheel", "ホイール・タイヤ", "Wheels/Tires"],
  ["suspension", "足回り", "Suspension"],
  ["other", "その他", "Other"],
];
const PER_PAGE = 12;

export default function PartsPage() {
  const { lang } = useLang();
  const [parts, setParts] = useState<Part[]>([]);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("");
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);

  useEffect(() => { loadParts().then(setParts); }, []);

  const filtered = useMemo(() => {
    let list = [...parts];
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((p) => (p.name + p.nameEn + p.fit + p.fitEn + p.partNo).toLowerCase().includes(q));
    if (cat) list = list.filter((p) => p.cat === cat);
    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [parts, query, cat, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <main>
      <section className="pageHead">
        <p className="eyebrow"><Bi ja="部品在庫" en="Parts Inventory" /></p>
        <h1><Bi ja="部品在庫一覧" en="Parts Inventory" /></h1>
        <p className="desc"><Bi ja="解体車両からのリユースパーツ・新品パーツを取り扱っています。" en="We carry reused and new parts from dismantled vehicles." /></p>
      </section>

      <div className="toolbar">
        <div className="toolbarRow">
          <span className="toolbarCount"><b className="num">{filtered.length}</b> <Bi ja="点の部品" en="parts" /></span>
          <input
            placeholder={lang === "ja" ? "部品名・型式・適合車種で検索" : "Search by name, part no., or model"}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          />
          <select value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }}>
            {CAT_OPTIONS.map(([v, ja, en]) => <option key={v} value={v}>{lang === "ja" ? ja : en}</option>)}
          </select>
          <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
            <option value="new">{lang === "ja" ? "新着順" : "Newest"}</option>
            <option value="price_asc">{lang === "ja" ? "価格が安い順" : "Price: Low to High"}</option>
            <option value="price_desc">{lang === "ja" ? "価格が高い順" : "Price: High to Low"}</option>
          </select>
        </div>
      </div>

      <div className="pageWrap">
        <div className="partGrid">
          {pageItems.map((p) => (
            <Link href={`/parts/${p.id}`} key={p.id} style={{ display: "block", color: "inherit" }}>
              <article>
                <div className="partVisual">{PART_ICONS[p.cat] || "▢"}</div>
                <small>{lang === "ja" ? p.catLabel : p.catLabelEn}</small>
                <h3>{lang === "ja" ? p.name : p.nameEn}</h3>
                <p>{lang === "ja" ? p.fit : p.fitEn}</p>
                <div className="partFoot">
                  <b className="num">¥{p.price.toLocaleString()}</b>
                  <span className="num">{p.stock > 0 ? `${lang === "ja" ? "在庫 " : "Stock: "}${p.stock}` : (lang === "ja" ? "在庫切れ" : "Out of Stock")}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>←</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} className={n === page ? "active" : ""} onClick={() => setPage(n)}>{n}</button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>→</button>
          </div>
        )}
      </div>
    </main>
  );
}
