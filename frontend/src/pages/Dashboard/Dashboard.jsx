import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard({ user }) {
  const userXP = user?.xp || 0;
  const currentLevel =
    userXP >= 2000 ? "Senior" : userXP >= 800 ? "Middle" : "Junior";

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar-container">
        <Link to="/" className="sidebar-logo-link">
          <span className="sidebar-logo">
            EduCode<span>Hub</span>
          </span>
        </Link>

        <nav className="sidebar-menu">
          <Link to="/dashboard" className="menu-item active">
            <span className="menu-icon">🏠</span> <span>Boshqaruv</span>
          </Link>
          <Link to="/courses" className="menu-item">
            <span className="menu-icon">📚</span> <span>Kurslar</span>
          </Link>
          <Link to="/editor" className="menu-item">
            <span className="menu-icon">💻</span> <span>Editor</span>
          </Link>
          <Link to="/leaderboard" className="menu-item">
            <span className="menu-icon">🏆</span> <span>Reyting</span>
          </Link>
        </nav>
      </aside>

      {/* ASOSIY KONTENT */}
      <main className="main-content">
        <header className="top-banner">
          <div className="welcome-text">
            <h1>Salom, {user?.name || "O'quvchi"}! 👋</h1>
            <p>Bugun qaysi texnologiyani zabt etamiz?</p>
          </div>
          <div className="user-avatar-circle">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        </header>

        <section className="stats-container">
          <div className="info-card">
            <span className="info-icon">✅</span>
            <div className="info-data">
              <span className="info-value">
                {user?.completedLessons?.length || 0}
              </span>
              <span className="info-label">Tugatildi</span>
            </div>
          </div>
          <div className="info-card">
            <span className="info-icon">⚡</span>
            <div className="info-data">
              <span className="info-value">{userXP}</span>
              <span className="info-label">Jami XP</span>
            </div>
          </div>
          <div className="info-card">
            <span className="info-icon">👑</span>
            <div className="info-data">
              <span className="info-value">{currentLevel}</span>
              <span className="info-label">Daraja</span>
            </div>
          </div>
        </section>

        <section className="course-section">
          <h2 className="section-title">Siz uchun tavsiyalar</h2>
          <div className="dashboard-courses-grid">
            <div className="custom-course-card">
              <span className="tag-badge tag-beginner">Boshlang'ich</span>
              <h3>Python Dasturlash</h3>
              <p>AI va Backend olamiga eng yaxshi kirish tili.</p>
              <Link to="/course/2" className="btn-start-now">
                Boshlash
              </Link>
            </div>

            <div className="custom-course-card">
              <span className="tag-badge tag-middle">O'rta</span>
              <h3>TypeScript Master</h3>
              <p>JS loyihalaringizni xatosiz va professional yozing.</p>
              <Link to="/course/4" className="btn-start-now">
                Boshlash
              </Link>
            </div>

            <div className="custom-course-card">
              <span className="tag-badge tag-professional">Professional</span>
              <h3>SQL Ma'lumotlar Bazasi</h3>
              <p>
                Ma'lumotlar bilan ishlashni professional darajada o'rganing.
              </p>
              <Link to="/course/5" className="btn-start-now">
                Boshlash
              </Link>
            </div>

            <div className="custom-course-card">
              <span className="tag-badge tag-speed">Yuqori tezlik</span>
              <h3>Go (Golang) tili</h3>
              <p>Google yaratgan eng tezkor backend tili bilan tanishing.</p>
              <Link to="/course/6" className="btn-start-now">
                Boshlash
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
