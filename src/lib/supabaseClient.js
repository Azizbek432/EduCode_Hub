import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kjscltkwioitbsecjtdw.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_9-0y8VztPAPhO1r52F_sCw_JTpucH9c'

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  console.error('Supabase URL noto\'g\'ri yoki kiritilmagan!')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)