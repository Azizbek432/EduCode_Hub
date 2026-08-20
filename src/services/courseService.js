import { supabase } from '../lib/supabaseClient';

export async function getCourses() {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase kurslarni olishda xatolik:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Kurslarni olishda kutilmagan xatolik:', err);
    return [];
  }
}

export async function getCourseBySlug(slug) {
  try {
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single();

    if (courseError || !course) return null;

    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', course.id)
      .order('order_index', { ascending: true });

    if (lessonsError) {
      console.error('Darslarni olishda xatolik:', lessonsError.message);
    }

    return {
      ...course,
      lessons: lessons || []
    };
  } catch (err) {
    console.error('Kurs detalini olishda xatolik:', err.message);
    return null;
  }
}

export async function getLessonsByCourseId(courseId) {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Darslarni olishda xatolik:', err.message);
    return [];
  }
}

export async function getLessonById(lessonId) {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Darsni olishda xatolik:', err.message);
    return null;
  }
}

export const getLeaderboard = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, xp_points")
      .order("xp_points", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching leaderboard:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Leaderboard xatoligi:", err);
    return [];
  }
};