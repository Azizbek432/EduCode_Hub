import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../../services/courseService";
import "./Courses.css";

function Courses({ user }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await getCourses();
      setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  // Kurs nomi va kategoriyasiga qarab ikonka, daraja va davomiylikni aniqlash
  const getMeta = (title = "", category = "") => {
    const t = title.toLowerCase();
    const c = category.toLowerCase();

    if (t.includes("javascript") || c.includes("js"))
      return { icon: "🟨", level: "Boshlang'ich", badgeClass: "beginner" };
    if (t.includes("python") || c.includes("python"))
      return { icon: "🟦", level: "O'rta", badgeClass: "middle" };
    if (t.includes("react") || c.includes("react"))
      return { icon: "⚛️", level: "Professional", badgeClass: "professional" };
    if (t.includes("c++") || t.includes("game"))
      return { icon: "🎮", level: "O'rta", badgeClass: "middle" };

    return { icon: "📚", level: "Boshlang'ich", badgeClass: "beginner" };
  };

  return (
    <div className="courses-page">
      <div className="courses-container">
        <header className="courses-header">
          <h1>Xush kelibsiz, {user?.name || "Dasturchi"}! 🚀</h1>
          <p>Dasturlash tillarini amaliy topshiriqlar orqali o'rganing</p>
        </header>

        {loading ? (
          <div className="loading-spinner">Kurslar yuklanmoqda...</div>
        ) : (
          <div className="courses-grid">
            {courses.length > 0 ? (
              courses.map((course) => {
                const meta = getMeta(course.title, course.category);
                return (
                  <div key={course.id} className="course-card">
                    <div className="course-icon">{meta.icon}</div>
                    <div className="course-content">
                      <span className={`course-badge ${meta.badgeClass}`}>
                        {meta.level}
                      </span>
                      <h3>{course.title}</h3>
                      <p>{course.description}</p>
                      <div className="course-footer">
                        <span>📚 {course.category || "Dasturlash"}</span>
                        <Link to={`/courses/${course.slug}`} className="start-btn">
                          Boshlash →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="no-courses">Hozircha kurslar mavjud emas.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;