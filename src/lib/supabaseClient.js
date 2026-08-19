import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kkhhkhscbymklkzwzwac.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_W022gez1E51cmptIX0QREG_lRcsz...'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)