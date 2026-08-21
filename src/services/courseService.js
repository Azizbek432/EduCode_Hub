import { supabase } from "../lib/supabaseClient";

export async function getCourses() {
  try {
    const { data: courses, error: coursesError } = await supabase
      .from("courses")
      .select("*");

    if (coursesError) {
      console.error("getCourses kurslarni olishda xatolik:", coursesError);
      return [];
    }

    if (!courses || courses.length === 0) {
      return [];
    }

    const { data: lessons, error: lessonsError } = await supabase
      .from("lessons")
      .select("id, course_id");

    if (lessonsError) {
      console.error("getCourses darslarni olishda xatolik:", lessonsError);
    }

    const publishedCourses = courses.filter(
      (course) => course.is_published === true || course.is_published === null
    );

    return publishedCourses.map((course) => {
      const courseLessons = lessons ? lessons.filter((l) => l.course_id === course.id) : [];
      return {
        ...course,
        lessonsCount: courseLessons.length,
      };
    });
  } catch (err) {
    console.error("getCourses kutilmagan xatolik:", err);
    return [];
  }
}

export async function getCourseBySlug(slug) {
  try {
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (courseError || !course) {
      console.error("getCourseBySlug xatolik:", courseError);
      return null;
    }

    const { data: lessons, error: lessonsError } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", course.id)
      .order("order_index", { ascending: true });

    if (lessonsError) {
      console.error("getCourseBySlug darslarda xatolik:", lessonsError);
    }

    return {
      ...course,
      lessons: lessons || [],
      lessonsCount: lessons ? lessons.length : 0,
    };
  } catch (err) {
    console.error("getCourseBySlug kutilmagan xatolik:", err);
    return null;
  }
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

  return data || [];
}

export async function getLessonById(lessonId) {
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

  return data || [];
};