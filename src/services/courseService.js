import { supabase } from '../lib/supabaseClient'

export const getAllCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Kurslarni olishda xatolik:', error.message)
    return []
  }
  return data
}

export const getCourseById = async (courseId) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId) 
    .single()

  if (error) {
    console.error(`ID=${courseId} bo'lgan kursni olishda xatolik:`, error.message)
    return null
  }
  return data
}

export const getLeaderboard = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, xp_points')
    .order('xp_points', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Leaderboard yuklashda xatolik:', error.message)
    return []
  }
  return data
}