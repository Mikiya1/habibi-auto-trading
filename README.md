# Habibi Auto Trading

Next.js site for Habibi Auto Trading, backed by Supabase (inventory & inquiries) and EmailJS (contact notifications).

## Development
```
npm install
npm run dev
```

## Structure
- `app/page.tsx` — Home
- `app/stock` — Vehicle inventory list & detail
- `app/parts` — Parts inventory list & detail
- `app/about` — Company page
- `app/admin` — Admin panel (passcode: see app/admin/page.tsx)
- `app/lib/data.ts` — Supabase data layer (cars, parts, inquiries)
- `app/lib/lang.tsx` — Bilingual (JA/EN) toggle context
