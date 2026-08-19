import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCourseBySlug } from '../../services/courseService'
import './CourseDetail.css'

export default function CourseDetail() {
  const { slug } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      const data = await getCourseBySlug(slug)
      setCourse(data)
      setLoading(false)
    }
    fetchCourse()
  }, [slug])

  if (loading) return <div className="loading-spinner">Darslar yuklanmoqda...</div>
  if (!course) return <div className="no-courses">Kurs topilmadi!</div>

  return (
    <div className="course-detail-container">
      <div className="course-detail-header">
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <span className="author-tag">Muallif: {course.author}</span>
      </div>

      <div className="lessons-list-section">
        <h2>Darslar ro'yxati ({course.lessons?.length || 0})</h2>
        <div className="lessons-grid">
          {course.lessons && course.lessons.length > 0 ? (
            course.lessons.map((lesson, index) => (
              <div key={lesson.id} className="lesson-item-card">
                <div className="lesson-number">{index + 1}</div>
                <div className="lesson-info">
                  <h4>{lesson.title}</h4>
                  <p>{lesson.description || "Amaliy topshiriqlar va video darslik."}</p>
                </div>
                <Link to={`/courses/${course.slug}/lessons/${lesson.id}`} className="watch-btn">
                  Tomosha qilish ▶
                </Link>
              </div>
            ))
          ) : (
            <p>Ushbu kursga hali darslar qo'shilmagan.</p>
          )}
        </div>
      </div>
    </div>
  )
}