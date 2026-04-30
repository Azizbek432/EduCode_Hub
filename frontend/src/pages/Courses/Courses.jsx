import React from "react";
import { Link } from "react-router-dom";
import { coursesData } from "../../data/courses"; // Markaziy bazadan olamiz
import "./Courses.css";

function Courses({ user }) {
  // Obyektni arrayga aylantiramiz, shunda .map() ishlaydi
  const coursesArray = Object.keys(coursesData).map((key) => ({
    id: key,
    ...coursesData[key],
  }));

  // Har bir kurs uchun ikonka va darajani aniqlab olamiz (bazada yo'qlari uchun)
  const getMeta = (title) => {
    if (title.includes("JavaScript"))
      return { icon: "🟨", level: "Boshlang'ich", dur: "24 dars" };
    if (title.includes("Python"))
      return { icon: "🟦", level: "O'rta", dur: "30 dars" };
    if (title.includes("React"))
      return { icon: "⚛️", level: "Professional", dur: "18 dars" };
    return { icon: "📚", level: "Boshlang'ich", dur: "10 dars" };
  };

  return (
    <div className="courses-page">
      <div className="courses-container">
        <header className="courses-header">
          <h1>Xush kelibsiz, {user?.name || "Dasturchi"}! 🚀</h1>
          <p>Dasturlash tillarini amaliy topshiriqlar orqali o'rganing</p>
        </header>

        <div className="courses-grid">
          {coursesArray.map((course) => {
            const meta = getMeta(course.title);
            return (
              <div key={course.id} className="course-card">
                <div className="course-icon">{meta.icon}</div>
                <div className="course-content">
                  <span
                    className={`course-badge ${meta.level.toLowerCase() === "professional" ? "professional" : meta.level.toLowerCase() === "o'rta" ? "middle" : "beginner"}`}
                  >
                    {meta.level}
                  </span>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="course-footer">
                    <span>⏱ {course.lessons.length} ta dars</span>
                    <Link to={`/course/${course.id}`} className="start-btn">
                      Boshlash
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Courses;
