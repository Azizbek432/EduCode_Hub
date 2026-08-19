import { supabase } from '../lib/supabaseClient'

export async function getCourses() {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Kurslarni olishda xatolik:', err.message)
    return []
  }
}

export async function getCourseBySlug(slug) {
  try {
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single()

    if (courseError || !course) return null

    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', course.id)
      .order('order_index', { ascending: true })

    if (lessonsError) throw lessonsError

    return {
      ...course,
      lessons: lessons || []
    }
  } catch (err) {
    console.error('Kurs detalini olishda xatolik:', err.message)
    return null
  }
}

export async function getLessonById(lessonId) {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error('Darsni olishda xatolik:', err.message)
    return null
  }
}

export const getLeaderboard = async (limit = 10) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, xp_points")
    .order("xp_points", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }

  return data;
};