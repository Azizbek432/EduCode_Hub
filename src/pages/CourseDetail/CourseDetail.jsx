import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { coursesData } from "../../data/courses";
import "./CourseDetail.css";

function CourseDetail({ onComplete }) {
  const { id } = useParams();
  const course = coursesData[id];

  // Faqat darsning ID-sini saqlaymiz (masalan: "js1")
  const [activeLessonId, setActiveLessonId] = useState("");

  // Kurs yuklanganda birinchi darsning ID-sini o'rnatish
  useEffect(() => {
    if (course && course.lessons.length > 0) {
      // Mana bu yerda state yangilanishi shart:
      setActiveLessonId(course.lessons[0].id);
    }
  }, [id, course]);

  // Hozirgi dars ob'ektini topamiz
  const currentLesson = course?.lessons.find((l) => l.id === activeLessonId);

  const handleCompleteLesson = () => {
    if (onComplete && currentLesson) {
      onComplete(50, currentLesson.id);
      console.log(`${currentLesson.title} yakunlandi.`);
    }
  };

  if (!course) {
    return (
      <div className="not-found-container">
        <h2>Kurs topilmadi! 🧐</h2>
        <Link to="/courses" className="back-home-btn">
          Kurslarga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div className="course-detail-page">
      <div className="detail-container">
        <div className="main-content-area">
          <div className="video-player-box">
            {/* currentLesson mavjud bo'lsagina iframe'ni chiqaramiz */}
            {currentLesson ? (
              <iframe
                src={`https://www.youtube.com/embed/${currentLesson.videoId}?rel=0`}
                title={currentLesson.title}
                allowFullScreen
              ></iframe>
            ) : (
              <div className="video-placeholder">Video yuklanmoqda...</div>
            )}
          </div>

          <div className="course-info-card">
            <h1>{currentLesson?.title || course.title}</h1>
            <p>{course.description}</p>
            <div className="action-footer">
              <button
                className="complete-lesson-btn"
                onClick={handleCompleteLesson}
              >
                Darsni tugatdim ✅
              </button>
            </div>
          </div>
        </div>

        <div className="sidebar-lessons">
          <div className="sidebar-header">
            <h3>Kurs Mundarijasi</h3>
            <span>{course.lessons.length} ta dars</span>
          </div>
          <div className="lessons-navigation">
            {course.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`lesson-card ${activeLessonId === lesson.id ? "active-lesson" : ""}`}
                onClick={() => setActiveLessonId(lesson.id)}
              >
                <div className="lesson-index">{index + 1}</div>
                <div className="lesson-text">
                  <h4>{lesson.title}</h4>
                  <span className="lesson-type">Video dars</span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/courses" className="return-link">
            ⬅ Barcha kurslar
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
