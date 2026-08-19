import React from 'react'
import { Link } from 'react-router-dom'
import './CourseCard.css'

export default function CourseCard({ course }) {
  return (
    <div className="course-card">
      <div className="card-badge">{course.category || 'Dasturlash'}</div>
      <h3 className="card-title">{course.title}</h3>
      <p className="card-desc">{course.description}</p>
      <div className="card-footer">
        <span className="card-author">Muallif: {course.author}</span>
        <Link to={`/courses/${course.slug}`} className="card-btn">
          Darslarni ko'rish →
        </Link>
      </div>
    </div>
  )
}