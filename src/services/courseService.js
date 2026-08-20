import { coursesData } from "../data/courses";

export async function getCourses() {
  return coursesData.map((course) => ({
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    category: course.category || course.title.split(" ")[0],
    level: "Boshlang'ich",
    image: course.image,
    lessonsCount: course.lessons ? course.lessons.length : 0,
  }));
}

export async function getCourseBySlug(slug) {
  const course = coursesData.find((c) => c.slug === slug);
  if (!course) return null;

  return {
    ...course,
    lessonsCount: course.lessons ? course.lessons.length : 0,
  };
}

export async function getLessonsByCourseId(courseId) {
  const course = coursesData.find((c) => c.id === courseId);
  return course ? course.lessons : [];
}

export async function getLessonById(lessonId) {
  for (const course of coursesData) {
    const lesson = course.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson;
  }
  return null;
}

export const getLeaderboard = async () => {
  return [];
};