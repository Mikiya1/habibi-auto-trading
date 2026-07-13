"use client";

import { createClient } from "./supabaseClient";

/* ===== Types ===== */
export type Car = {
  id: number;
  name: string;
  nameEn: string;
  grade: string;
  gradeEn: string;
  type: string;
  maker: string;
  makerEn: string;
  year: number;
  km: number;
  price: number;
  fuel: string;
  fuelEn: string;
  trans: string;
  transEn: string;
  drive: string;
  driveEn: string;
  seats: number;
  color: string;
  colorEn: string;
  engine: string;
  engineEn: string;
  shaken: string;
  shakenEn: string;
  repair: string;
  repairEn: string;
  score: string;
  status: "available" | "reserved" | "sold";
  export: boolean;
  comment: string;
  commentEn: string;
  safety: string;
  safetyEn: string;
  comfort: string;
  comfortEn: string;
  navi: string;
  naviEn: string;
  other: string;
  otherEn: string;
};

export type Part = {
  id: number;
  name: string;
  nameEn: string;
  cat: string;
  catLabel: string;
  catLabelEn: string;
  fit: string;
  fitEn: string;
  partNo: string;
  price: number;
  condition: "new" | "used" | "refurb";
  stock: number;
  desc: string;
  descEn: string;
};

export type Inquiry = {
  id: number;
  kind: string;
  ref_id: number | null;
  ref_label: string | null;
  name: string;
  email: string;
  phone: string | null;
  vin: string | null;
  inquiry_type: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

/* ===== camelCase <-> snake_case mapping ===== */
const CAR_FIELD_MAP: Record<string, string> = {
  nameEn: "name_en", gradeEn: "grade_en", makerEn: "maker_en", fuelEn: "fuel_en",
  transEn: "trans_en", driveEn: "drive_en", colorEn: "color_en", engineEn: "engine_en",
  shakenEn: "shaken_en", repairEn: "repair_en", commentEn: "comment_en",
  safetyEn: "safety_en", comfortEn: "comfort_en", naviEn: "navi_en", otherEn: "other_en",
};
const PART_FIELD_MAP: Record<string, string> = {
  nameEn: "name_en", catLabel: "cat_label", catLabelEn: "cat_label_en",
  fitEn: "fit_en", partNo: "part_no", desc: "description", descEn: "description_en",
};

function toSnake(obj: Record<string, unknown>, map: Record<string, string>) {
  const out: Record<string, unknown> = {};
  for (const k in obj) out[map[k] || k] = obj[k];
  return out;
}
function toCamelCar(row: Record<string, unknown>): Car {
  const out: Record<string, unknown> = { ...row };
  for (const camel in CAR_FIELD_MAP) out[camel] = row[CAR_FIELD_MAP[camel]];
  return out as Car;
}
function toCamelPart(row: Record<string, unknown>): Part {
  const out: Record<string, unknown> = { ...row };
  for (const camel in PART_FIELD_MAP) out[camel] = row[PART_FIELD_MAP[camel]];
  return out as Part;
}

/* ===== CARS ===== */
export async function loadCars(): Promise<Car[]> {
  const sb = createClient();
  const { data, error } = await sb.from("cars").select("*").order("id", { ascending: true });
  if (error) { console.error("loadCars", error); return []; }
  return (data || []).map(toCamelCar);
}
export async function addCar(carData: Partial<Car>): Promise<Car> {
  const sb = createClient();
  const { data, error } = await sb.from("cars").insert(toSnake(carData, CAR_FIELD_MAP) as never).select().single();
  if (error) throw error;
  return toCamelCar(data);
}
export async function updateCar(id: number, carData: Partial<Car>): Promise<Car> {
  const sb = createClient();
  const { data, error } = await sb.from("cars").update(toSnake(carData, CAR_FIELD_MAP) as never).eq("id", id).select().single();
  if (error) throw error;
  return toCamelCar(data);
}
export async function deleteCar(id: number): Promise<void> {
  const sb = createClient();
  const { error } = await sb.from("cars").delete().eq("id", id);
  if (error) throw error;
}

/* ===== PARTS ===== */
export async function loadParts(): Promise<Part[]> {
  const sb = createClient();
  const { data, error } = await sb.from("parts").select("*").order("id", { ascending: true });
  if (error) { console.error("loadParts", error); return []; }
  return (data || []).map(toCamelPart);
}
export async function addPart(partData: Partial<Part>): Promise<Part> {
  const sb = createClient();
  const { data, error } = await sb.from("parts").insert(toSnake(partData, PART_FIELD_MAP) as never).select().single();
  if (error) throw error;
  return toCamelPart(data);
}
export async function updatePart(id: number, partData: Partial<Part>): Promise<Part> {
  const sb = createClient();
  const { data, error } = await sb.from("parts").update(toSnake(partData, PART_FIELD_MAP) as never).eq("id", id).select().single();
  if (error) throw error;
  return toCamelPart(data);
}
export async function deletePart(id: number): Promise<void> {
  const sb = createClient();
  const { error } = await sb.from("parts").delete().eq("id", id);
  if (error) throw error;
}

/* ===== INQUIRIES ===== */
export async function addInquiry(input: {
  kind?: string; refId?: number; refLabel?: string;
  name: string; email: string; phone?: string; vin?: string;
  inquiryType?: string; message?: string;
}): Promise<void> {
  const sb = createClient();
  const { error } = await sb.from("inquiries").insert({
    kind: input.kind || "general",
    ref_id: input.refId || null,
    ref_label: input.refLabel || null,
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    vin: input.vin || null,
    inquiry_type: input.inquiryType || null,
    message: input.message || null,
  } as never);
  if (error) throw error;

  // Best-effort email notification via EmailJS (loaded globally in layout.tsx)
  const w = window as unknown as { emailjs?: { send: (s: string, t: string, params: Record<string, string>) => Promise<unknown> } };
  if (w.emailjs) {
    try {
      await w.emailjs.send(
        "service_q4qo1jj",
        "template_i8qks6n",
        {
          from_name: input.name || "(no name)",
          from_email: input.email || "(no email)",
          inquiry_type: input.inquiryType || input.kind || "general",
          ref_label: input.refLabel || "—",
          message: input.message || "(no message)",
        }
      );
    } catch (e) {
      console.error("EmailJS notification failed:", e);
    }
  }
}
export async function listInquiries(): Promise<Inquiry[]> {
  const sb = createClient();
  const { data, error } = await sb.from("inquiries").select("*").order("created_at", { ascending: false });
  if (error) { console.error("listInquiries", error); return []; }
  return data || [];
}
export async function updateInquiryStatus(id: number, status: string): Promise<void> {
  const sb = createClient();
  const { error } = await sb.from("inquiries").update({ status } as never).eq("id", id);
  if (error) throw error;
}
