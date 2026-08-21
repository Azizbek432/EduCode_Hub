import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiList, FiCode, FiX, FiClock, FiCheckCircle } from "react-icons/fi";
import { getCourseBySlug } from "../../services/courseService";
import { supabase } from "../../lib/supabaseClient";
import "./CourseDetail.css";

function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);
  const [completedLessons, setCompletedLessons] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const getEmbedUrl = (lesson) => {
    if (!lesson) return null;

    const rawIdOrUrl = 
      lesson.youtube_id || 
      lesson.youtubeId || 
      lesson.video_id || 
      lesson.videoId || 
      lesson.video_url || 
      lesson.videoUrl;

    if (!rawIdOrUrl) return null;

    if (typeof rawIdOrUrl === "string" && rawIdOrUrl.includes("embed/")) {
      return rawIdOrUrl;
    }

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = String(rawIdOrUrl).match(regExp);

    const videoId = (match && match[2].length === 11) ? match[2] : rawIdOrUrl;

    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleCompleteLesson = async () => {
    if (!activeLesson || completedLessons[activeLesson.id] || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("xp_points")
          .eq("id", user.id)
          .single();

        const currentXP = profile?.xp_points || 0;
        const updatedXP = currentXP + 50;

        await supabase
          .from("profiles")
          .update({ xp_points: updatedXP })
          .eq("id", user.id);

        setCompletedLessons((prev) => ({ ...prev, [activeLesson.id]: true }));
        alert("Barakalla! Dars tugatildi: +50 EXP 🚀");
      } else {
        alert("EXP to'plash uchun tizimga kiring!");
      }
    } catch (err) {
      console.error("EXP berishda xatolik:", err);
    } finally {
      setIsSubmitting(false);
    }
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
        <Link to="/courses" className="back-btn"><FiArrowLeft /> Kurslarga qaytish</Link>
      </div>
    );
  }

  const embedVideoUrl = getEmbedUrl(activeLesson);
  const isCurrentLessonCompleted = activeLesson && completedLessons[activeLesson.id];

  return (
    <div className="course-detail-page">
      <div className="mobile-header">
        <Link to="/courses" className="mobile-back-btn">
          <FiArrowLeft size={20} />
        </Link>
        <h3 className="mobile-course-title">{course.title}</h3>
        <button className="mobile-list-trigger" onClick={() => setIsMobileListOpen(!isMobileListOpen)}>
          <FiList size={20} />
        </button>
      </div>

      <aside className={`lessons-sidebar ${isMobileListOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <Link to="/courses" className="back-link"><FiArrowLeft /> Barcha kurslar</Link>
          <div className="sidebar-title-wrapper">
            <h2>{course.title}</h2>
            <button className="close-drawer-btn" onClick={() => setIsMobileListOpen(false)}>
              <FiX size={20} />
            </button>
          </div>
          <span className="lessons-count">Darslar: {lessons.length} ta</span>
        </div>

        <ul className="lessons-list">
          {lessons.map((lesson, index) => {
            const isCompleted = completedLessons[lesson.id];
            return (
              <li
                key={lesson.id || index}
                className={`lesson-item ${activeLesson?.id === lesson.id ? "active" : ""}`}
                onClick={() => {
                  setActiveLesson(lesson);
                  setIsMobileListOpen(false);
                }}
              >
                <span className={`lesson-number ${isCompleted ? "completed" : ""}`}>
                  {isCompleted ? "✓" : index + 1}
                </span>
                <div className="lesson-info">
                  <h4>{lesson.title}</h4>
                  <span className="lesson-duration"><FiClock size={12} /> {lesson.duration || "10 min"}</span>
                </div>
              </li>
            );
          })}
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
                  <FiCode size={18} /> Kod muharririda amalda sinash
                </Link>

                <button
                  className={`complete-lesson-btn ${isCurrentLessonCompleted ? "completed" : ""}`}
                  onClick={handleCompleteLesson}
                  disabled={isCurrentLessonCompleted || isSubmitting}
                >
                  <FiCheckCircle size={18} />
                  {isCurrentLessonCompleted ? "Dars tugatildi (+50 EXP)" : "Darsni tugatish"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-active-lesson">
            <p>Darsni ko'rish uchun ro'yxatdan birortasini tanlang.</p>
          </div>
        )}
      </main>

      {isMobileListOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileListOpen(false)}></div>
      )}
    </div>
  );
}

export default CourseDetail;