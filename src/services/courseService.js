import { supabase } from '../lib/supabaseClient'

export const getAllCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('id', { ascending: true })

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
    .eq('id', Number(courseId))
    .single()

  if (error) {
    console.error(`ID=${courseId} bo'lgan kursni olishda xatolik:`, error.message)
    return null
  }
  return data
}