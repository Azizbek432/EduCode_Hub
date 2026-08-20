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

    const getMeta = (title = "", category = "") => {
      const t = title.toLowerCase();
      const c = category.toLowerCase();

      if (t.includes("javascript") || c.includes("js"))
        return { icon: "🟨", badgeClass: "beginner" };
      if (t.includes("python") || c.includes("python"))
        return { icon: "🟦", badgeClass: "middle" };
      if (t.includes("react") || c.includes("react"))
        return { icon: "⚛️", badgeClass: "professional" };
      if (t.includes("sql") || c.includes("database"))
        return { icon: "🛢️", badgeClass: "beginner" };
      if (t.includes("go") || c.includes("backend"))
        return { icon: "🐹", badgeClass: "middle" };

      return { icon: "📚", badgeClass: "beginner" };
    };

    return (
      <div className="courses-page">
        <div className="courses-container">
          <header className="courses-header">
            <h1>Xush kelibsiz, {user?.user_metadata?.full_name || "Dasturchi"}! 🚀</h1>
            <p>Dasturlash tillarini amaliy video va darsliklar orqali o'rganing</p>
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
                          {course.level || "Boshlang'ich"}
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