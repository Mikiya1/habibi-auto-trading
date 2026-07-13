import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://rqviydnpzhbbtkebvajk.supabase.co";
const SUPABASE_KEY = "sb_publishable_5PGFBcCnobPJrf3U_PbrAw_Fuu8gmBT";

let client: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (!client) {
    client = createSupabaseClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return client;
}
