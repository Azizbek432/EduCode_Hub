import { supabase } from "../lib/supabaseClient";

export async function getCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select(`
      *,
      lessons (id)
    `)
    .eq("is_published", true);

  if (error) {
    console.error("getCourses xatolik:", error);
    return [];
  }

  return data.map((course) => ({
    ...course,
    lessonsCount: course.lessons ? course.lessons.length : 0,
  }));
}

export async function getCourseBySlug(slug) {
  const { data, error } = await supabase
    .from("courses")
    .select(`
      *,
      lessons (*)
    `)
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("getCourseBySlug xatolik:", error);
    return null;
  }

  if (data && data.lessons) {
    data.lessons.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  }

  return {
    ...data,
    lessonsCount: data.lessons ? data.lessons.length : 0,
  };
}

export async function getLessonsByCourseId(courseId) {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("getLessonsByCourseId xatolik:", error);
    return [];
  }

  return data;
}

export async function getLessonById(lessonId) {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (error) {
    console.error("getLessonById xatolik:", error);
    return null;
  }

  return data;
}

export const getLeaderboard = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, username, avatar_url, xp_points")
    .order("xp_points", { ascending: false })
    .limit(10);

  if (error) {
    console.error("getLeaderboard xatolik:", error);
    return [];
  }

  return data;
};