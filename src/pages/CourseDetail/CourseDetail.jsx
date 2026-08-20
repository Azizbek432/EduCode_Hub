import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourseBySlug } from "../../services/courseService";
import "./CourseDetail.css";

function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const courseData = await getCourseBySlug(slug);
        
        if (isMounted && courseData) {
          setCourse(courseData);
          const courseLessons = courseData.lessons || [];
          setLessons(courseLessons);
          
          if (courseLessons.length > 0) {
            setActiveLesson(courseLessons[0]);
          }
        }
      } catch (error) {
        console.error("Darslarni yuklashda xatolik:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCourseData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // YouTube URL hosil qiluvchi yordamchi funksiya
  const getEmbedUrl = (lesson) => {
    if (!lesson) return null;
    
    // 1. Agar youtube_id berilgan bo'lsa (Masalan: "videoId123")
    if (lesson.youtube_id) {
      return `https://www.youtube.com/embed/${lesson.youtube_id}`;
    }
    
    // 2. Agar video_url yoki videoUrl berilgan bo'lsa
    const rawUrl = lesson.video_url || lesson.videoUrl;
    if (rawUrl) {
      if (rawUrl.includes("embed/")) return rawUrl;
      if (rawUrl.includes("watch?v=")) return rawUrl.replace("watch?v=", "embed/");
      if (rawUrl.includes("youtu.be/")) return rawUrl.replace("youtu.be/", "www.youtube.com/embed/");
      return `https://www.youtube.com/embed/${rawUrl}`;
    }

    return null;
  };

  if (loading) {
    return (
      <div className="course-detail-loading">
        <div className="spinner"></div>
        <p>Darslar yuklanmoqda...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-not-found">
        <h2>Kurs topilmadi 😕</h2>
        <Link to="/courses" className="back-btn">← Kurslarga qaytish</Link>
      </div>
    );
  }

  const embedVideoUrl = getEmbedUrl(activeLesson);

  return (
    <div className="course-detail-page">
      <aside className="lessons-sidebar">
        <div className="sidebar-header">
          <Link to="/courses" className="back-link">← Barcha kurslar</Link>
          <h2>{course.title}</h2>
          <span className="lessons-count">Darslar: {lessons.length} ta</span>
        </div>

        <ul className="lessons-list">
          {lessons.map((lesson, index) => (
            <li
              key={lesson.id || index}
              className={`lesson-item ${activeLesson?.id === lesson.id ? "active" : ""}`}
              onClick={() => setActiveLesson(lesson)}
            >
              <span className="lesson-number">{index + 1}</span>
              <div className="lesson-info">
                <h4>{lesson.title}</h4>
                <span className="lesson-duration">⏱ {lesson.duration || "10 min"}</span>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <main className="lesson-content-area">
        {activeLesson ? (
          <div className="active-lesson-container">
            <div className="video-wrapper">
              {embedVideoUrl ? (
                <iframe
                  src={embedVideoUrl}
                  title={activeLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="no-video">
                  <span>🎥 Ushbu dars uchun video yuklanmagan</span>
                </div>
              )}
            </div>

            <div className="lesson-details">
              <h1>{activeLesson.title}</h1>
              <div className="lesson-body-text">
                <p>{activeLesson.content || activeLesson.description || "Dars bo'yicha qo'shimcha izoh mavjud emas."}</p>
              </div>

              <div className="lesson-actions">
                <Link to="/editor" className="practice-btn">
                  ⚡️ Kod redaktorida amalda sinash
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-active-lesson">
            <p>Darsni ko'rish uchun ro'yxatdan birortasini tanlang.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default CourseDetail;