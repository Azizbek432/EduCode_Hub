import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import './LessonView.css'

export default function LessonView() {
  const { slug, lessonId } = useParams()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLesson = async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single()

      if (!error) setLesson(data)
      setLoading(false)
    }
    fetchLesson()
  }, [lessonId])

  if (loading) return <div className="loading-spinner">Video yuklanmoqda...</div>
  if (!lesson) return <div className="no-courses">Dars topilmadi!</div>

  return (
    <div className="lesson-view-container">
      <Link to={`/courses/${slug}`} className="back-link">← Kurs sahifasiga qaytish</Link>
      <h1 className="lesson-title">{lesson.title}</h1>
      
      <div className="video-wrapper">
        <iframe
          src={`https://www.youtube.com/embed/${lesson.youtube_id}`}
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="lesson-description-box">
        <h3>Dars haqida:</h3>
        <p>{lesson.description || "Ushbu darsda berilgan topshiriqlarni mustaqil bajarib ko'ring."}</p>
      </div>
    </div>
  )
}