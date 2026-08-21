import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../../services/courseService";
import { FiBookOpen, FiClock, FiPlayCircle } from "react-icons/fi";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        console.error("Kurslarni yuklashda xatolik:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "#fff" }}>
        <h2>Kurslar yuklanmoqda...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto", color: "#fff" }}>
      <h1 style={{ textAlign: "center", marginBottom: "10px" }}>Xush kelibsiz, Dasturchi! 🚀</h1>
      <p style={{ textAlign: "center", color: "#a3aed0", marginBottom: "40px" }}>
        Dasturlash tillarini amaliy video va darsliklar orqali o'rganing
      </p>

      {courses.length === 0 ? (
        <div style={{ textAlign: "center", color: "#a3aed0" }}>
          <p>Hozircha kurslar mavjud emas.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
          {courses.map((course) => (
            <div
              key={course.id}
              style={{
                background: "#111c44",
                borderRadius: "16px",
                padding: "20px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <div>
                <span style={{ fontSize: "12px", background: "rgba(108, 99, 255, 0.2)", color: "#6c63ff", padding: "4px 8px", borderRadius: "6px" }}>
                  {course.category || "Dasturlash"}
                </span>
                <h3 style={{ fontSize: "18px", margin: "14px 0 8px 0" }}>{course.title}</h3>
                <p style={{ fontSize: "13px", color: "#a3aed0", lineHeight: "1.5" }}>
                  {course.description || "Tavsif mavjud emas."}
                </p>
              </div>

              <div style={{ marginTop: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#a3aed0", fontSize: "12px", marginBottom: "16px" }}>
                  <span><FiBookOpen /> {course.lessonsCount || 0} ta dars</span>
                  <span><FiClock /> {course.level || "Boshlang'ich"}</span>
                </div>
                <Link
                  to={`/courses/${course.slug}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    background: "#6c63ff",
                    color: "#fff",
                    textDecoration: "none",
                    padding: "10px",
                    borderRadius: "8px",
                    fontWeight: "600"
                  }}
                >
                  <FiPlayCircle /> Kursni boshlash
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;