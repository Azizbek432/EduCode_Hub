import { supabase } from "../lib/supabaseClient";

export async function getCourses() {
  try {
    const { data: courses, error: coursesError } = await supabase
      .from("courses")
      .select("*, lessons(id)")
      .order("created_at", { ascending: true });

    if (coursesError) {
      console.error("getCourses kurslarni olishda xatolik:", coursesError);
      return [];
    }

    if (!courses || courses.length === 0) {
      return [];
    }

    const publishedCourses = courses.filter(
      (course) => course.is_published === true || course.is_published === null
    );

    return publishedCourses.map((course) => ({
      ...course,
      lessonsCount: course.lessons ? course.lessons.length : 0,
    }));
  } catch (err) {
    console.error("getCourses kutilmagan xatolik:", err);
    return [];
  }
}

export async function getCourseBySlug(slug) {
  try {
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("*, lessons(*)")
      .eq("slug", slug)
      .maybeSingle();

    if (courseError || !course) {
      console.error("getCourseBySlug xatolik:", courseError);
      return null;
    }

    const sortedLessons = course.lessons
      ? course.lessons.sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
      : [];

    return {
      ...course,
      lessons: sortedLessons,
      lessonsCount: sortedLessons.length,
    };
  } catch (err) {
    console.error("getCourseBySlug kutilmagan xatolik:", err);
    return null;
  }
}

export async function getLessonsByCourseId(courseId) {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });

    if (error) {
      console.error("getLessonsByCourseId xatolik:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("getLessonsByCourseId kutilmagan xatolik:", err);
    return [];
  }
}

export async function getLessonById(lessonId) {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", lessonId)
      .maybeSingle();

    if (error) {
      console.error("getLessonById xatolik:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("getLessonById kutilmagan xatolik:", err);
    return null;
  }
}

export const getLeaderboard = async () => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, username, avatar_url, xp_points")
      .order("xp_points", { ascending: false })
      .limit(10);

    if (error) {
      console.error("getLeaderboard xatolik:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("getLeaderboard kutilmagan xatolik:", err);
    return [];
  }
};