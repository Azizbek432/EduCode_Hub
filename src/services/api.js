import { supabase } from '../lib/supabaseClient'

// --- AUTH SERVICES ---

// 1. Ro'yxatdan o'tish (Register)
export const registerUser = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw error

  if (data?.user) {
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: data.user.id,
      full_name: fullName,
      xp_points: 0,
    })
    if (profileError) console.error('Profil yaratishda xatolik:', profileError.message)
  }

  return data
}

export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) return null
  return user
}