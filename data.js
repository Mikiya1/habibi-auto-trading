/* ===== Habibi Auto Trading — shared data layer (Supabase-backed) =====
   Single source of truth for car & part inventory, and contact inquiries.
   Reads/writes go to Supabase Postgres so changes are visible to every visitor,
   not just the browser that made them.

   Public API used by the rest of the site:
     loadCars()            -> Promise<Car[]>
     loadParts()           -> Promise<Part[]>
     addCar(data)          -> Promise<Car>
     updateCar(id, data)   -> Promise<Car>
     deleteCar(id)         -> Promise<void>
     addPart(data)         -> Promise<Part>
     updatePart(id, data)  -> Promise<Part>
     deletePart(id)        -> Promise<void>
     resetCars()           -> Promise<Car[]>   (deletes all + reseeds)
     resetParts()          -> Promise<Part[]>  (deletes all + reseeds)
     addInquiry(data)      -> Promise<void>
     listInquiries()       -> Promise<Inquiry[]>
     updateInquiryStatus(id, status) -> Promise<void>
*/

const SUPABASE_URL = "https://rqviydnpzhbbtkebvajk.supabase.co";
const SUPABASE_KEY = "sb_publishable_5PGFBcCnobPJrf3U_PbrAw_Fuu8gmBT";

// window.supabase is provided by the Supabase JS CDN script, which must be
// included BEFORE this file: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
const _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ===== EmailJS (email notification on new inquiries) =====
   window.emailjs is provided by the EmailJS CDN script, which must be
   included BEFORE this file: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script> */
const EMAILJS_SERVICE_ID = "service_q4qo1jj";
const EMAILJS_TEMPLATE_ID = "template_jg6cfn8";
const EMAILJS_PUBLIC_KEY = "4nJvxT5HgbZYIfDKF";
if (window.emailjs) window.emailjs.init(EMAILJS_PUBLIC_KEY);

/* ===== camelCase <-> snake_case field mapping ===== */
const CAR_FIELD_MAP = {
  nameEn: 'name_en', gradeEn: 'grade_en', makerEn: 'maker_en', fuelEn: 'fuel_en',
  transEn: 'trans_en', driveEn: 'drive_en', colorEn: 'color_en', engineEn: 'engine_en',
  shakenEn: 'shaken_en', repairEn: 'repair_en', commentEn: 'comment_en',
  safetyEn: 'safety_en', comfortEn: 'comfort_en', naviEn: 'navi_en', otherEn: 'other_en',
};
const PART_FIELD_MAP = {
  nameEn: 'name_en', catLabel: 'cat_label', catLabelEn: 'cat_label_en',
  fitEn: 'fit_en', partNo: 'part_no', desc: 'description', descEn: 'description_en',
};

function _toSnakeCar(obj) {
  const out = {};
  for (const k in obj) out[CAR_FIELD_MAP[k] || k] = obj[k];
  return out;
}
function _toCamelCar(row) {
  if (!row) return row;
  const out = { ...row };
  for (const camel in CAR_FIELD_MAP) {
    const snake = CAR_FIELD_MAP[camel];
    out[camel] = row[snake];
  }
  return out;
}
function _toSnakePart(obj) {
  const out = {};
  for (const k in obj) out[PART_FIELD_MAP[k] || k] = obj[k];
  return out;
}
function _toCamelPart(row) {
  if (!row) return row;
  const out = { ...row };
  for (const camel in PART_FIELD_MAP) {
    const snake = PART_FIELD_MAP[camel];
    out[camel] = row[snake];
  }
  return out;
}

/* ===== CARS ===== */
async function loadCars() {
  const { data, error } = await _sb.from('cars').select('*').order('id', { ascending: true });
  if (error) { console.error('loadCars', error); return []; }
  return data.map(_toCamelCar);
}
async function addCar(carData) {
  const { data, error } = await _sb.from('cars').insert(_toSnakeCar(carData)).select().single();
  if (error) throw error;
  return _toCamelCar(data);
}
async function updateCar(id, carData) {
  const { data, error } = await _sb.from('cars').update(_toSnakeCar(carData)).eq('id', id).select().single();
  if (error) throw error;
  return _toCamelCar(data);
}
async function deleteCar(id) {
  const { error } = await _sb.from('cars').delete().eq('id', id);
  if (error) throw error;
}
async function resetCars() {
  await _sb.from('cars').delete().gte('id', 0);
  const rows = CARS_SEED.map(_toSnakeCar);
  const { error } = await _sb.from('cars').insert(rows);
  if (error) console.error('resetCars', error);
  return loadCars();
}

/* ===== PARTS ===== */
async function loadParts() {
  const { data, error } = await _sb.from('parts').select('*').order('id', { ascending: true });
  if (error) { console.error('loadParts', error); return []; }
  return data.map(_toCamelPart);
}
async function addPart(partData) {
  const { data, error } = await _sb.from('parts').insert(_toSnakePart(partData)).select().single();
  if (error) throw error;
  return _toCamelPart(data);
}
async function updatePart(id, partData) {
  const { data, error } = await _sb.from('parts').update(_toSnakePart(partData)).eq('id', id).select().single();
  if (error) throw error;
  return _toCamelPart(data);
}
async function deletePart(id) {
  const { error } = await _sb.from('parts').delete().eq('id', id);
  if (error) throw error;
}
async function resetParts() {
  await _sb.from('parts').delete().gte('id', 0);
  const rows = PARTS_SEED.map(_toSnakePart);
  const { error } = await _sb.from('parts').insert(rows);
  if (error) console.error('resetParts', error);
  return loadParts();
}

/* ===== INQUIRIES (contact form submissions) ===== */
async function addInquiry({ kind, refId, refLabel, name, email, phone, vin, inquiryType, message }) {
  const { error } = await _sb.from('inquiries').insert({
    kind: kind || 'general',
    ref_id: refId || null,
    ref_label: refLabel || null,
    name, email, phone: phone || null, vin: vin || null,
    inquiry_type: inquiryType || null,
    message: message || null,
  });
  if (error) throw error;

  // Best-effort email notification — failure here should not break the
  // contact form flow, since the inquiry is already safely saved above.
  if (window.emailjs) {
    try {
      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name || '(no name)',
        from_email: email || '(no email)',
        inquiry_type: inquiryType || kind || 'general',
        ref_label: refLabel || '—',
        message: message || '(no message)',
      });
    } catch (e) {
      console.error('EmailJS notification failed:', e);
    }
  }
}
async function listInquiries() {
  const { data, error } = await _sb.from('inquiries').select('*').order('created_at', { ascending: false });
  if (error) { console.error('listInquiries', error); return []; }
  return data;
}
async function updateInquiryStatus(id, status) {
  const { error } = await _sb.from('inquiries').update({ status }).eq('id', id);
  if (error) throw error;
}

/* ===== Seed data (used only by resetCars()/resetParts() above) ===== */
const CARS_SEED = [
  { name: "ハイエース バン", nameEn: "Hiace Van", grade: "DX GL パッケージ 標準ボディ", gradeEn: "DX GL Package, Standard Body", type: "KDH201V", maker: "トヨタ", makerEn: "Toyota", year: 2019, km: 8.2,  price: 189, fuel: "ディーゼル", fuelEn: "Diesel", trans: "6速AT", transEn: "6-speed AT", drive: "FR（後輪駆動）", driveEn: "FR (Rear-wheel drive)", seats: 3, color: "ホワイトパールクリスタルシャイン", colorEn: "White Pearl Crystal Shine", engine: "2KD-FTV（2,500cc ディーゼルターボ）", engineEn: "2KD-FTV (2,500cc Diesel Turbo)", shaken: "2026年3月", shakenEn: "March 2026", repair: "なし", repairEn: "None", score: "4（JU）", status: "available", export: true, comment: "走行距離少なめの高年式ハイエースです。ディーゼルエンジンで輸出先でも燃料調達が容易。車検残あり、修復歴なし。内外装ともにコンディション良好です。輸出向けとして強くお勧めできる一台です。", commentEn: "A recent-model Hiace with low mileage. The diesel engine makes fuel easy to source at export destinations. Shaken remaining, no accident history. Excellent condition inside and out — highly recommended for export.", safety: "VSC / ABS / エアバッグ×2", safetyEn: "VSC / ABS / 2 Airbags", comfort: "エアコン / パワーウィンドウ / キーレス", comfortEn: "A/C / Power Windows / Keyless Entry", navi: "純正SDナビ / バックカメラ", naviEn: "OEM SD Navigation / Rear Camera", other: "ETC / フロアマット / ドアバイザー", otherEn: "ETC / Floor Mats / Door Visors" },
  { name: "ランドクルーザー プラド", nameEn: "Land Cruiser Prado", grade: "TX Lパッケージ 4WD", gradeEn: "TX L Package, 4WD", type: "GRJ150W", maker: "トヨタ", makerEn: "Toyota", year: 2018, km: 6.1,  price: 348, fuel: "ガソリン", fuelEn: "Gasoline", trans: "6速AT", transEn: "6-speed AT", drive: "4WD", driveEn: "4WD", seats: 8, color: "パールホワイト", colorEn: "Pearl White", engine: "1GR-FE（4,000cc V6）", engineEn: "1GR-FE (4,000cc V6)", shaken: "2026年8月", shakenEn: "August 2026", repair: "なし", repairEn: "None", score: "4.5（JU）", status: "available", export: true, comment: "人気のGRJ150系プラドです。1GR-FEエンジン搭載の4.0L V6モデル。走行少なく状態良好。アフリカ・中東市場向けに強い一台です。", commentEn: "A popular GRJ150-series Prado with the 4.0L V6 1GR-FE engine. Low mileage, good condition. A strong choice for African and Middle Eastern markets.", safety: "VSC / ABS / エアバッグ×6 / クルーズコントロール", safetyEn: "VSC / ABS / 6 Airbags / Cruise Control", comfort: "本革シート / ムーンルーフ / パワーシート", comfortEn: "Leather Seats / Moonroof / Power Seats", navi: "純正大型ナビ / バックカメラ / ETC", naviEn: "OEM Large Navigation / Rear Camera / ETC", other: "ルーフレール / サンシェード / フロアマット", otherEn: "Roof Rails / Sunshade / Floor Mats" },
  { name: "ランドクルーザー プラド", nameEn: "Land Cruiser Prado", grade: "TX 4WD 走行22万km", gradeEn: "TX 4WD, 224,000km", type: "GRJ150W", maker: "トヨタ", makerEn: "Toyota", year: 2014, km: 22.4, price: 138, fuel: "ガソリン", fuelEn: "Gasoline", trans: "5速AT", transEn: "5-speed AT", drive: "4WD", driveEn: "4WD", seats: 7, color: "シルバーメタリック", colorEn: "Silver Metallic", engine: "1GR-FE（4,000cc V6）", engineEn: "1GR-FE (4,000cc V6)", shaken: "2025年11月", shakenEn: "November 2025", repair: "なし", repairEn: "None", score: "3.5（JU）", status: "available", export: true, comment: "走行22万kmですが修復歴なし。アフリカ市場では高走行の本機種でも需要があります。価格帯が手頃でコストパフォーマンスに優れます。", commentEn: "224,000km on the odometer but no accident history. High-mileage units of this model remain in demand in African markets. Great value for the price.", safety: "VSC / ABS / エアバッグ×6", safetyEn: "VSC / ABS / 6 Airbags", comfort: "エアコン / パワーウィンドウ", comfortEn: "A/C / Power Windows", navi: "社外ナビ / バックカメラ", naviEn: "Aftermarket Navigation / Rear Camera", other: "ETC / フロアマット", otherEn: "ETC / Floor Mats" },
  { name: "アルファード", nameEn: "Alphard", grade: "2.5S Cパッケージ", gradeEn: "2.5S C Package", type: "AGH30W", maker: "トヨタ", makerEn: "Toyota", year: 2020, km: 4.5,  price: 420, fuel: "ガソリン", fuelEn: "Gasoline", trans: "CVT", transEn: "CVT", drive: "2WD", driveEn: "2WD", seats: 7, color: "プレシャスホワイトパール", colorEn: "Precious White Pearl", engine: "2AR-FE（2,500cc）", engineEn: "2AR-FE (2,500cc)", shaken: "2026年5月", shakenEn: "May 2026", repair: "なし", repairEn: "None", score: "4.5（JU）", status: "reserved", export: false, comment: "現在商談中です。キャンセル待ちのご登録も承ります。", commentEn: "Currently under negotiation. We can add you to a waiting list in case the deal falls through.", safety: "プリクラッシュセーフティ / LTA / ABS", safetyEn: "Pre-Collision Safety / LTA / ABS", comfort: "本革シート / 電動スライドドア / 後席モニター", comfortEn: "Leather Seats / Power Sliding Doors / Rear Monitor", navi: "T-Connect SDナビ / JBLサウンド / ETC2.0", naviEn: "T-Connect SD Navigation / JBL Sound / ETC 2.0", other: "サンルーフ / デジタルインナーミラー", otherEn: "Sunroof / Digital Rearview Mirror" },
  { name: "プリウス", nameEn: "Prius", grade: "S 1.8L ハイブリッド", gradeEn: "S 1.8L Hybrid", type: "ZVW30", maker: "トヨタ", makerEn: "Toyota", year: 2017, km: 11.3, price: 98,  fuel: "ハイブリッド", fuelEn: "Hybrid", trans: "CVT", transEn: "CVT", drive: "2WD", driveEn: "2WD", seats: 5, color: "ブルーメタリック", colorEn: "Blue Metallic", engine: "2ZR-FXE（1,800cc HV）", engineEn: "2ZR-FXE (1,800cc Hybrid)", shaken: "2025年10月", shakenEn: "October 2025", repair: "なし", repairEn: "None", score: "3.5（JU）", status: "available", export: false, comment: "低燃費ハイブリッド。国内向け。燃費 26.4km/L（JC08）。", commentEn: "Fuel-efficient hybrid, for domestic sale. Fuel economy 26.4km/L (JC08 mode).", safety: "ABS / エアバッグ×8", safetyEn: "ABS / 8 Airbags", comfort: "オートエアコン / パワーウィンドウ", comfortEn: "Auto A/C / Power Windows", navi: "純正ナビ / バックカメラ", naviEn: "OEM Navigation / Rear Camera", other: "ETC / フロアマット", otherEn: "ETC / Floor Mats" },
  { name: "ノア", nameEn: "Noah", grade: "Si W×B III 7人乗り", gradeEn: "Si W×B III, 7-Seater", type: "ZRR80W", maker: "トヨタ", makerEn: "Toyota", year: 2021, km: 3.8,  price: 265, fuel: "ガソリン", fuelEn: "Gasoline", trans: "CVT", transEn: "CVT", drive: "2WD", driveEn: "2WD", seats: 7, color: "ホワイトパールクリスタルシャイン", colorEn: "White Pearl Crystal Shine", engine: "3ZR-FAE（2,000cc）", engineEn: "3ZR-FAE (2,000cc)", shaken: "2026年10月", shakenEn: "October 2026", repair: "なし", repairEn: "None", score: "4.5（JU）", status: "available", export: false, comment: "最終型ノア。走行少なく状態極めて良好。車検たっぷり残。国内で高い人気を誇る一台です。", commentEn: "Final-generation Noah. Low mileage and excellent condition, with plenty of shaken remaining. Highly popular in the domestic market.", safety: "トヨタセーフティセンス / ABS", safetyEn: "Toyota Safety Sense / ABS", comfort: "両側電動スライドドア / 本革調シート", comfortEn: "Dual Power Sliding Doors / Leather-style Seats", navi: "純正SDナビ / バックカメラ / ETC2.0", naviEn: "OEM SD Navigation / Rear Camera / ETC 2.0", other: "スポーツフロントフェイス / 専用18インチアルミ", otherEn: "Sport Front Fascia / Dedicated 18\" Alloys" },
  { name: "ハイエース バン", nameEn: "Hiace Van", grade: "スーパーGL ダークプライム", gradeEn: "Super GL Dark Prime", type: "GDH201V", maker: "トヨタ", makerEn: "Toyota", year: 2022, km: 2.1,  price: 368, fuel: "ディーゼル", fuelEn: "Diesel", trans: "6速AT", transEn: "6-speed AT", drive: "2WD", driveEn: "2WD", seats: 2, color: "ブラックマイカ", colorEn: "Black Mica", engine: "1GD-FTV（2,800cc ディーゼルターボ）", engineEn: "1GD-FTV (2,800cc Diesel Turbo)", shaken: "2027年1月", shakenEn: "January 2027", repair: "なし", repairEn: "None", score: "5（JU）", status: "available", export: true, comment: "新型GDH系ハイエース。走行2万kmの極上個体。1GD-FTVエンジン搭載でパワーも燃費も向上。車検2年以上残。輸出最高評価の一台です。", commentEn: "Latest-generation GDH-series Hiace in superb condition with just 20,000km. The 1GD-FTV engine improves both power and fuel economy. Over two years of shaken remaining — our top-rated export vehicle.", safety: "プリクラッシュセーフティ / LDA / ABS", safetyEn: "Pre-Collision Safety / LDA / ABS", comfort: "本革調シート / オートエアコン / スマートキー", comfortEn: "Leather-style Seats / Auto A/C / Smart Key", navi: "純正ディスプレイオーディオ / バックカメラ / ETC2.0", naviEn: "OEM Display Audio / Rear Camera / ETC 2.0", other: "専用フロントスポイラー / アルミホイール", otherEn: "Dedicated Front Spoiler / Alloy Wheels" },
  { name: "プロボックス", nameEn: "Probox", grade: "DX 1.5L", gradeEn: "DX 1.5L", type: "NCP51V", maker: "トヨタ", makerEn: "Toyota", year: 2016, km: 18.7, price: 55,  fuel: "ガソリン", fuelEn: "Gasoline", trans: "4速AT", transEn: "4-speed AT", drive: "2WD", driveEn: "2WD", seats: 5, color: "ホワイト", colorEn: "White", engine: "1NZ-FE（1,500cc）", engineEn: "1NZ-FE (1,500cc)", shaken: "—", shakenEn: "—", repair: "なし", repairEn: "None", score: "3（JU）", status: "sold", export: false, comment: "売約済みです。", commentEn: "This vehicle has been sold.", safety: "ABS", safetyEn: "ABS", comfort: "エアコン / パワーウィンドウ", comfortEn: "A/C / Power Windows", navi: "社外ナビ", naviEn: "Aftermarket Navigation", other: "フロアマット", otherEn: "Floor Mats" },
  { name: "ランドクルーザー 200", nameEn: "Land Cruiser 200", grade: "ZX 4WD フルオプション", gradeEn: "ZX 4WD, Fully Loaded", type: "URJ202W", maker: "トヨタ", makerEn: "Toyota", year: 2019, km: 5.5,  price: 680, fuel: "ディーゼル", fuelEn: "Diesel", trans: "6速AT", transEn: "6-speed AT", drive: "4WD", driveEn: "4WD", seats: 8, color: "プレシャスホワイトパール", colorEn: "Precious White Pearl", engine: "1VD-FTV（4,500cc V8 ディーゼル）", engineEn: "1VD-FTV (4,500cc V8 Diesel)", shaken: "2026年6月", shakenEn: "June 2026", repair: "なし", repairEn: "None", score: "4.5（JU）", status: "available", export: true, comment: "希少な1VD-FTV搭載のランクル200。フルオプション仕様。アフリカ・中東市場で高い評価が期待できます。修復歴なし、状態極上。", commentEn: "A rare Land Cruiser 200 with the 1VD-FTV engine, fully loaded. Expected to command strong value in African and Middle Eastern markets. No accident history, superb condition.", safety: "全方位プリクラッシュ / LDA / RSA / ABS", safetyEn: "360° Pre-Collision / LDA / RSA / ABS", comfort: "本革シート / 後席エンタメ / クールボックス", comfortEn: "Leather Seats / Rear Entertainment / Cool Box", navi: "純正大型ナビ / 全周囲カメラ / ETC2.0", naviEn: "OEM Large Navigation / 360° Camera / ETC 2.0", other: "KDSS / Multi-Terrain Select / デフロック", otherEn: "KDSS / Multi-Terrain Select / Diff Lock" },
  { name: "ヴィッツ", nameEn: "Vitz", grade: "F 1.0L", gradeEn: "F 1.0L", type: "KSP90", maker: "トヨタ", makerEn: "Toyota", year: 2018, km: 7.2,  price: 68,  fuel: "ガソリン", fuelEn: "Gasoline", trans: "CVT", transEn: "CVT", drive: "2WD", driveEn: "2WD", seats: 5, color: "レッドマイカメタリック", colorEn: "Red Mica Metallic", engine: "1KR-FE（1,000cc）", engineEn: "1KR-FE (1,000cc)", shaken: "2026年2月", shakenEn: "February 2026", repair: "なし", repairEn: "None", score: "3.5（JU）", status: "available", export: false, comment: "低走行の1オーナー車。日常使いに最適。燃費良好です。", commentEn: "Low-mileage, one-owner vehicle. Ideal for daily use with good fuel economy.", safety: "ABS / エアバッグ×4", safetyEn: "ABS / 4 Airbags", comfort: "オートエアコン / パワーウィンドウ", comfortEn: "Auto A/C / Power Windows", navi: "社外ナビ", naviEn: "Aftermarket Navigation", other: "フロアマット / ドアバイザー", otherEn: "Floor Mats / Door Visors" },
  { name: "ノア ハイブリッド", nameEn: "Noah Hybrid", grade: "G 1.8HV 8人乗り", gradeEn: "G 1.8HV, 8-Seater", type: "ZWR80G", maker: "トヨタ", makerEn: "Toyota", year: 2020, km: 6.4,  price: 248, fuel: "ハイブリッド", fuelEn: "Hybrid", trans: "CVT", transEn: "CVT", drive: "2WD", driveEn: "2WD", seats: 8, color: "パールホワイト", colorEn: "Pearl White", engine: "2ZR-FXE（1,800cc HV）", engineEn: "2ZR-FXE (1,800cc Hybrid)", shaken: "2026年4月", shakenEn: "April 2026", repair: "なし", repairEn: "None", score: "4（JU）", status: "available", export: false, comment: "ハイブリッド8人乗りのノア。低燃費で維持費も安く、ファミリーユースに最適。走行少なく状態良好です。", commentEn: "An 8-seater hybrid Noah. Low running costs and great fuel economy, ideal for family use. Low mileage and good condition.", safety: "トヨタセーフティセンス / ABS", safetyEn: "Toyota Safety Sense / ABS", comfort: "両側電動スライドドア / オートエアコン", comfortEn: "Dual Power Sliding Doors / Auto A/C", navi: "純正ナビ / バックカメラ / ETC", naviEn: "OEM Navigation / Rear Camera / ETC", other: "フリップダウンモニター / フロアマット", otherEn: "Flip-down Monitor / Floor Mats" },
  { name: "ランクル プラド", nameEn: "Land Cruiser Prado", grade: "TZ-G ディーゼル 4WD", gradeEn: "TZ-G Diesel 4WD", type: "GDJ150W", maker: "トヨタ", makerEn: "Toyota", year: 2022, km: 1.8,  price: 498, fuel: "ディーゼル", fuelEn: "Diesel", trans: "6速AT", transEn: "6-speed AT", drive: "4WD", driveEn: "4WD", seats: 7, color: "アティチュードブラックマイカ", colorEn: "Attitude Black Mica", engine: "1GD-FTV（2,800cc ディーゼルターボ）", engineEn: "1GD-FTV (2,800cc Diesel Turbo)", shaken: "2027年3月", shakenEn: "March 2027", repair: "なし", repairEn: "None", score: "5（JU）", status: "available", export: true, comment: "新型GDJ150系ディーゼルプラドの最高グレードTZ-G。走行1.8万kmの極上個体。世界中で需要の高い組み合わせで、今後入庫が難しくなるモデルです。", commentEn: "The top-grade TZ-G of the latest GDJ150-series diesel Prado. Superb condition with just 18,000km. A highly sought-after combination worldwide, and increasingly hard to source going forward.", safety: "全方位プリクラッシュ / LDA / BSM / ABS", safetyEn: "360° Pre-Collision / LDA / BSM / ABS", comfort: "本革シート / ベンチレーション / ムーンルーフ", comfortEn: "Leather Seats / Ventilated Seats / Moonroof", navi: "大型ディスプレイナビ / 全周囲カメラ / ETC2.0", naviEn: "Large Display Navigation / 360° Camera / ETC 2.0", other: "KDSS / Multi-Terrain Select / ルーフレール", otherEn: "KDSS / Multi-Terrain Select / Roof Rails" },
];

const PARTS_SEED = [
  { name: "エンジンASSY 2KD-FTV", nameEn: "Engine Assembly 2KD-FTV", cat: "engine", catLabel: "エンジン関連", catLabelEn: "Engine", fit: "ハイエース 200系（2013-2019）", fitEn: "Hiace 200 Series (2013-2019)", partNo: "19000-30D50", price: 185000, condition: "used", stock: 2, desc: "走行8万km時取り外し。始動良好、圧縮圧力正常。実働確認済みです。取り外し時の写真もご用意可能です。", descEn: "Removed at 80,000km. Starts well, normal compression, tested running. Removal photos available on request." },
  { name: "オルタネーター", nameEn: "Alternator", cat: "electrical", catLabel: "電装品", catLabelEn: "Electrical", fit: "プリウス ZVW30系", fitEn: "Prius ZVW30 Series", partNo: "27060-37160", price: 12000, condition: "refurb", stock: 5, desc: "リビルト品。6ヶ月保証付き。発電量テスト済みです。", descEn: "Refurbished. 6-month warranty. Output tested." },
  { name: "フロントバンパー", nameEn: "Front Bumper", cat: "body", catLabel: "外装・ボディ", catLabelEn: "Body/Exterior", fit: "ランドクルーザー プラド 150系（前期）", fitEn: "Land Cruiser Prado 150 Series (early)", partNo: "52119-60934", price: 28000, condition: "used", stock: 1, desc: "小傷ありだが割れ・歪みなし。色：ホワイトパールクリスタルシャイン。", descEn: "Minor scratches, no cracks or warping. Color: White Pearl Crystal Shine." },
  { name: "純正アルミホイール 18インチ 4本セット", nameEn: "OEM Alloy Wheels 18\" (Set of 4)", cat: "wheel", catLabel: "ホイール・タイヤ", catLabelEn: "Wheels/Tires", fit: "ランドクルーザー 200系", fitEn: "Land Cruiser 200 Series", partNo: "—", price: 68000, condition: "used", stock: 1, desc: "4本セット。タイヤ溝残り約60%。センターキャップ付属。", descEn: "Set of 4. Tire tread approx. 60% remaining. Center caps included." },
  { name: "ヘッドライト（左右セット）", nameEn: "Headlights (Left & Right Set)", cat: "electrical", catLabel: "電装品", catLabelEn: "Electrical", fit: "アルファード AGH30系", fitEn: "Alphard AGH30 Series", partNo: "81145-58560", price: 42000, condition: "used", stock: 2, desc: "LEDタイプ。点灯確認済み、レンズクラックなし。左右セット価格です。", descEn: "LED type. Tested working, no lens cracks. Price is for the set." },
  { name: "ショックアブソーバー（フロント）", nameEn: "Shock Absorber (Front)", cat: "suspension", catLabel: "足回り", catLabelEn: "Suspension", fit: "ハイエース 200系 全般", fitEn: "Hiace 200 Series (all)", partNo: "48510-29835", price: 9800, condition: "new", stock: 8, desc: "新品社外品。左右1本ずつの価格です。", descEn: "New aftermarket. Price is per single unit." },
  { name: "リアシート一式", nameEn: "Rear Seat Set", cat: "interior", catLabel: "内装", catLabelEn: "Interior", fit: "ノア ZRR80系", fitEn: "Noah ZRR80 Series", partNo: "—", price: 35000, condition: "used", stock: 1, desc: "ファブリック地、破れ・シミなし。7人乗り3列目含みます。", descEn: "Fabric upholstery, no tears or stains. Includes 3rd row (7-seater)." },
  { name: "ラジエーター", nameEn: "Radiator", cat: "engine", catLabel: "エンジン関連", catLabelEn: "Engine", fit: "ヴィッツ KSP90系", fitEn: "Vitz KSP90 Series", partNo: "16400-21200", price: 8500, condition: "refurb", stock: 4, desc: "リビルト品。圧力テスト済み、水漏れなしです。", descEn: "Refurbished. Pressure tested, no leaks." },
  { name: "ドアミラー（右）", nameEn: "Door Mirror (Right)", cat: "electrical", catLabel: "電装品", catLabelEn: "Electrical", fit: "プロボックス NCP51系", fitEn: "Probox NCP51 Series", partNo: "87910-52660", price: 4500, condition: "used", stock: 3, desc: "電動格納式。ウィンカー内蔵、動作確認済みです。", descEn: "Power-folding type. Built-in turn signal, tested working." },
  { name: "マフラー（純正）", nameEn: "Muffler (OEM)", cat: "engine", catLabel: "エンジン関連", catLabelEn: "Engine", fit: "ランクル プラド 150系（ディーゼル）", fitEn: "Land Cruiser Prado 150 Series (Diesel)", partNo: "17410-30E10", price: 22000, condition: "used", stock: 1, desc: "腐食少なめ。取り付け金具付属です。", descEn: "Minimal corrosion. Mounting brackets included." },
  { name: "テールランプ（左右セット）", nameEn: "Tail Lights (Left & Right Set)", cat: "body", catLabel: "外装・ボディ", catLabelEn: "Body/Exterior", fit: "ハイエース 200系（後期）", fitEn: "Hiace 200 Series (late)", partNo: "81551-26580", price: 15000, condition: "new", stock: 6, desc: "社外新品LEDテール。左右セット。防水パッキン付属です。", descEn: "New aftermarket LED tail lights. Set of 2. Waterproof gasket included." },
  { name: "バッテリー 80D26L", nameEn: "Battery 80D26L", cat: "electrical", catLabel: "電装品", catLabelEn: "Electrical", fit: "汎用（多くのトヨタ車に適合）", fitEn: "Universal (fits many Toyota models)", partNo: "80D26L", price: 9800, condition: "new", stock: 12, desc: "新品バッテリー。1年保証付きです。", descEn: "New battery. 1-year warranty included." },
];

function nextCarId(list) { return list.length ? Math.max(...list.map(c => c.id)) + 1 : 1; }
function nextPartId(list) { return list.length ? Math.max(...list.map(p => p.id)) + 1 : 101; }
