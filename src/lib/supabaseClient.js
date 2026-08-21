import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://kjscltkwioitbsecjtdw.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqc2NsdGt3aW9pdGJzZWNqdGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3Nzk1ODAsImV4cCI6MjEwMjM1NTU4MH0.3i6k68NMJ1kZ8MVHtC1S_sgNa3EdWRcgFJGG9_ZyxIM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);