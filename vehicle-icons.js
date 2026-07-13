/* ===== Habibi Auto Trading — vehicle & part line-art icons =====
   Lightweight SVG icons used in place of photos on card thumbnails.
   Keeps the site free of stock-photo licensing concerns while still
   looking far more finished than a plain "Photo" placeholder. */

const VEHICLE_ICONS = {
  van: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 85 L15 50 Q15 40 25 38 L120 34 Q130 33 138 42 L165 68 Q172 75 172 85 L172 90 L15 90 Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M120 34 L120 68 L172 68" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    <path d="M62 42 L62 68 M92 42 L92 68" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
    <circle cx="52" cy="90" r="13" stroke="currentColor" stroke-width="2.5"/>
    <circle cx="142" cy="90" r="13" stroke="currentColor" stroke-width="2.5"/>
    <line x1="15" y1="90" x2="172" y2="90" stroke="currentColor" stroke-width="2.5"/>
  </svg>`,
  suv: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 88 L14 60 Q16 52 26 50 L48 46 L68 30 L142 30 L158 46 L176 50 Q186 52 186 62 L186 88" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M68 30 L74 46 M142 30 L134 46" stroke="currentColor" stroke-width="1.8"/>
    <path d="M48 46 L158 46" stroke="currentColor" stroke-width="1.8"/>
    <line x1="12" y1="88" x2="186" y2="88" stroke="currentColor" stroke-width="2.5"/>
    <circle cx="52" cy="88" r="14" stroke="currentColor" stroke-width="2.5"/>
    <circle cx="150" cy="88" r="14" stroke="currentColor" stroke-width="2.5"/>
    <rect x="14" y="66" width="10" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6"/>
  </svg>`,
  minivan: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 86 L16 55 Q18 44 30 42 L54 40 L70 26 L150 26 L162 42 L176 44 Q186 46 186 58 L186 86" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M70 26 L76 42 M150 26 L144 42" stroke="currentColor" stroke-width="1.8"/>
    <path d="M54 42 L162 42" stroke="currentColor" stroke-width="1.8"/>
    <path d="M100 26 L100 42" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
    <line x1="14" y1="86" x2="186" y2="86" stroke="currentColor" stroke-width="2.5"/>
    <circle cx="54" cy="86" r="13" stroke="currentColor" stroke-width="2.5"/>
    <circle cx="150" cy="86" r="13" stroke="currentColor" stroke-width="2.5"/>
  </svg>`,
  sedan: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 82 Q10 68 24 66 L48 64 L66 42 L128 42 L150 64 L178 66 Q190 68 190 78 L190 82" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M66 42 L72 64 M128 42 L122 64" stroke="currentColor" stroke-width="1.8"/>
    <path d="M48 64 L150 64" stroke="currentColor" stroke-width="1.8"/>
    <line x1="10" y1="82" x2="190" y2="82" stroke="currentColor" stroke-width="2.5"/>
    <circle cx="52" cy="82" r="13" stroke="currentColor" stroke-width="2.5"/>
    <circle cx="148" cy="82" r="13" stroke="currentColor" stroke-width="2.5"/>
  </svg>`,
  hatch: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 84 Q20 70 32 68 L54 66 L72 46 L124 46 L146 68 L166 70 Q178 72 178 82" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M72 46 L78 66 M124 46 L118 66" stroke="currentColor" stroke-width="1.8"/>
    <path d="M54 66 L146 66" stroke="currentColor" stroke-width="1.8"/>
    <line x1="20" y1="84" x2="178" y2="84" stroke="currentColor" stroke-width="2.5"/>
    <circle cx="56" cy="84" r="13" stroke="currentColor" stroke-width="2.5"/>
    <circle cx="140" cy="84" r="13" stroke="currentColor" stroke-width="2.5"/>
  </svg>`,
  wagon: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 84 Q14 70 26 68 L50 66 L68 46 L128 46 L150 66 L174 68 Q186 70 186 80 L186 84" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M68 46 L74 66 M128 46 L122 66" stroke="currentColor" stroke-width="1.8"/>
    <path d="M50 66 L150 66" stroke="currentColor" stroke-width="1.8"/>
    <line x1="14" y1="84" x2="186" y2="84" stroke="currentColor" stroke-width="2.5"/>
    <circle cx="54" cy="84" r="13" stroke="currentColor" stroke-width="2.5"/>
    <circle cx="146" cy="84" r="13" stroke="currentColor" stroke-width="2.5"/>
  </svg>`,
};

const PART_ICONS = {
  engine: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="35" width="45" height="35" rx="3" stroke="currentColor" stroke-width="2.5"/><rect x="65" y="42" width="15" height="20" rx="2" stroke="currentColor" stroke-width="2.2"/><path d="M28 35 L28 25 M40 35 L40 25 M52 35 L52 25" stroke="currentColor" stroke-width="2.2"/><circle cx="34" cy="52" r="6" stroke="currentColor" stroke-width="2"/><circle cx="52" cy="52" r="6" stroke="currentColor" stroke-width="2"/></svg>`,
  body: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 55 Q20 40 35 38 L65 38 Q80 40 80 55 L80 62 L20 62 Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M35 38 L38 55 M65 38 L62 55" stroke="currentColor" stroke-width="2"/></svg>`,
  interior: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28 65 L28 45 Q28 38 35 38 L60 38 Q67 38 67 45 L67 65" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M22 65 L73 65 L73 72 Q73 76 69 76 L26 76 Q22 76 22 72 Z" stroke="currentColor" stroke-width="2.3"/></svg>`,
  electrical: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M52 22 L30 55 L46 55 L40 78 L68 45 L50 45 Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/></svg>`,
  wheel: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="26" stroke="currentColor" stroke-width="2.5"/><circle cx="50" cy="50" r="7" stroke="currentColor" stroke-width="2.2"/><path d="M50 24 L50 34 M50 66 L50 76 M24 50 L34 50 M66 50 L76 50 M32 32 L39 39 M61 61 L68 68 M68 32 L61 39 M39 61 L32 68" stroke="currentColor" stroke-width="1.8"/></svg>`,
  suspension: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 20 L50 32 M50 32 Q40 36 50 42 Q60 48 50 54 Q40 60 50 66 Q60 72 50 78 L50 80" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><rect x="42" y="16" width="16" height="8" rx="1.5" stroke="currentColor" stroke-width="2"/><rect x="42" y="76" width="16" height="8" rx="1.5" stroke="currentColor" stroke-width="2"/></svg>`,
  other: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="26" y="26" width="48" height="48" rx="6" stroke="currentColor" stroke-width="2.5"/><path d="M38 50 L46 58 L64 40" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

/* Map a Japanese vehicle name to an icon category (best-effort keyword match). */
function vehicleIconFor(name) {
  const n = name || '';
  if (n.includes('ハイエース')) return VEHICLE_ICONS.van;
  if (n.includes('プラド') || n.includes('ランドクルーザー') || n.includes('ランクル')) return VEHICLE_ICONS.suv;
  if (n.includes('アルファード') || n.includes('ノア') || n.includes('ヴォクシー')) return VEHICLE_ICONS.minivan;
  if (n.includes('プリウス')) return VEHICLE_ICONS.sedan;
  if (n.includes('ヴィッツ')) return VEHICLE_ICONS.hatch;
  if (n.includes('プロボックス')) return VEHICLE_ICONS.wagon;
  return VEHICLE_ICONS.sedan;
}

function partIconFor(cat) {
  return PART_ICONS[cat] || PART_ICONS.other;
}
