import { coursesData } from "../data/courses";

export async function getCourses() {
  return Object.keys(coursesData).map((id) => {
    const course = coursesData[id];
    const slug = course.title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-");

    return {
      id,
      title: course.title,
      slug: slug,
      description: course.description,
      category: course.title.split(" ")[0],
      level: "Boshlang'ich",
      lessonsCount: course.lessons ? course.lessons.length : 0,
    };
  });
}

export async function getCourseBySlug(slug) {
  const courses = await getCourses();
  const matched = courses.find((c) => c.slug === slug);

  if (!matched) return null;

  const fullData = coursesData[matched.id];
  return {
    ...matched,
    lessons: fullData.lessons || [],
  };
}

export async function getLessonsByCourseId(courseId) {
  const course = coursesData[courseId];
  return course ? course.lessons : [];
}

export async function getLessonById(lessonId) {
  for (const key in coursesData) {
    const lesson = coursesData[key].lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson;
  }
  return null;
}

export const getLeaderboard = async () => {
  return [];
};