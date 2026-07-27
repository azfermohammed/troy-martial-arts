import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client.
 *
 * The publishable key is meant to be public — it identifies the project and
 * nothing more. Every table has row-level security, so what this key can
 * actually do is decided in Postgres, not here: an anonymous visitor may
 * insert a trial enquiry and can read nothing at all.
 *
 * The service-role key must never appear in this repo. It bypasses RLS.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** True when the app was built with credentials wired up. */
export const supabaseConfigured = Boolean(url && publishableKey);

let client: SupabaseClient | null = null;

/**
 * The shared client, or null when built without credentials. Callers must
 * handle null and fall back — the site has to keep working if the env vars
 * are missing rather than white-screening.
 */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  if (!client) {
    client = createClient(url, publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    });
  }
  return client;
}

/** Row shape of public.leads. */
export interface LeadRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  program: string;
  message: string;
  status: string;
  notes: string;
  created_at: string; // ISO timestamptz
}
