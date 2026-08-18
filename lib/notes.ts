import { createClient } from "@supabase/supabase-js";

export type VisitorNote = {
  id: string;
  message: string;
  name: string;
  color: string;
  created_at: string;
  website?: string;
};

export const NOTE_COLORS = ["cream", "yellow", "coral", "lavender", "charcoal"] as const;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabase =
  supabaseUrl && supabaseAnon ? createClient(supabaseUrl, supabaseAnon) : null;

export async function getNotes(): Promise<VisitorNote[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("visitor_notes")
    .select("id, message, name, color, created_at, website")
    .order("created_at", { ascending: false })
    .limit(80);
  if (error) return [];
  return (data ?? []) as VisitorNote[];
}

export async function insertNote(input: {
  message: string;
  name: string;
  color: string;
  website?: string;
}): Promise<{ note?: VisitorNote; error?: string }> {
  if (!supabase) return { error: "storage unavailable" };
  const { data, error } = await supabase
    .from("visitor_notes")
    .insert({
      message: input.message,
      name: input.name,
      color: input.color,
      website: input.website || null,
    })
    .select("id, message, name, color, created_at, website")
    .single();
  if (error) return { error: error.message };
  return { note: data as VisitorNote };
}