"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bi, useLang } from "../lib/lang";
import { loadCars, Car } from "../lib/data";

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
const PER_PAGE = 12;

export default function StockPage() {
  const { lang } = useLang();
  const [cars, setCars] = useState<Car[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);

  useEffect(() => { loadCars().then(setCars); }, []);

  const filtered = useMemo(() => {
    let list = [...cars];
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((c) => (c.name + c.nameEn + c.grade + c.gradeEn).toLowerCase().includes(q));
    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    if (sort === "km_asc") list.sort((a, b) => a.km - b.km);
    if (sort === "year_desc") list.sort((a, b) => b.year - a.year);
    return list;
  }, [cars, query, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <main>
      <section className="pageHead">
        <p className="eyebrow"><Bi ja="在庫車両" en="Inventory" /></p>
        <h1><Bi ja="車両在庫一覧" en="Vehicle Inventory" /></h1>
        <p className="desc"><Bi ja="輸出向け・国内向けともに随時更新中です。" en="Updated regularly with both export and domestic vehicles." /></p>
      </section>

      <div className="toolbar">
        <div className="toolbarRow">
          <span className="toolbarCount"><b className="num">{filtered.length}</b> <Bi ja="台の車両" en="vehicles" /></span>
          <input
            placeholder={lang === "ja" ? "車名・グレードで検索" : "Search by name or grade"}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          />
          <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
            <option value="new">{lang === "ja" ? "新着順" : "Newest"}</option>
            <option value="price_asc">{lang === "ja" ? "価格が安い順" : "Price: Low to High"}</option>
            <option value="price_desc">{lang === "ja" ? "価格が高い順" : "Price: High to Low"}</option>
            <option value="km_asc">{lang === "ja" ? "走行距離が少ない順" : "Mileage: Low to High"}</option>
            <option value="year_desc">{lang === "ja" ? "年式が新しい順" : "Year: Newest First"}</option>
          </select>
        </div>
      </div>

      <div className="pageWrap dark">
        <div className="vehicleGrid">
          {pageItems.map((c) => {
            const idx = cars.findIndex((x) => x.id === c.id);
            const carName = lang === "ja" ? c.name : c.nameEn;
            const grade = lang === "ja" ? c.grade : c.gradeEn;
            const fuel = lang === "ja" ? c.fuel : c.fuelEn;
            const status = STATUS_LABEL[c.status]?.[lang] || c.status;
            return (
              <Link className="vehicle" href={`/stock/${c.id}`} key={c.id}>
                <div className="vehiclePhoto">
                  <Image src={VEHICLE_PHOTOS[idx % VEHICLE_PHOTOS.length]} alt={carName} fill sizes="(max-width: 900px) 100vw, 33vw" style={{ objectFit: "cover" }} />
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
