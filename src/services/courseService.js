import { supabase } from "../lib/supabaseClient";
import { coursesData } from "../data/courses"; 

export async function getCourses() {
  try {
    return coursesData.map((course) => ({
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
    const course = coursesData.find((c) => c.slug === slug || c.id === slug);

    if (!course) {
      console.error("getCourseBySlug: Kurs topilmadi:", slug);
      return null;
    }

    return {
      ...course,
      lessonsCount: course.lessons ? course.lessons.length : 0,
    };
  } catch (err) {
    console.error("getCourseBySlug kutilmagan xatolik:", err);
    return null;
  }
}

export async function getLessonsByCourseId(courseId) {
  try {
    const course = coursesData.find((c) => c.id === courseId || c.slug === courseId);
    return course ? course.lessons || [] : [];
  } catch (err) {
    console.error("getLessonsByCourseId kutilmagan xatolik:", err);
    return [];
  }
}

export async function getLessonById(lessonId) {
  try {
    for (const course of coursesData) {
      const lesson = course.lessons.find((l) => l.id === lessonId);
      if (lesson) return lesson;
    }
    return null;
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