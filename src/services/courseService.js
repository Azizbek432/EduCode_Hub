import { supabase } from '../lib/supabaseClient'

export const getAllCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')

  if (error) {
    console.error('Kurslarni yuklashda xatolik:', error.message)
    return []
  }

  return data
}

export const getCourseBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*, lessons(*)')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Kursni slug bo\'yicha olishda xatolik:', error.message)
    return null
  }

  return data
}

export const getCourseById = async (id) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*, lessons(*)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Kursni ID bo\'yicha olishda xatolik:', error.message)
    return null
  }

  return data
}