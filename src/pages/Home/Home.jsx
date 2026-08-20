import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🚀 Dasturlashni o'rgan</div>
          <h1 className="hero-title">
            Kod yoz. O'rgan. <span className="hero-accent">Rivojlan.</span>
          </h1>
          <p className="hero-subtitle">
            EduCode Hub — dasturlashni interaktiv tarzda o'rganish uchun eng
            qulay platforma. Hoziroq kod yozishni boshlang!
          </p>
          <div className="hero-btns">
            <Link to="/register" className="hero-btn-primary">
              Bepul boshlash →
            </Link>
            <Link to="/editor" className="hero-btn-secondary">
              Editorni sinab ko'rish
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">500+</span>
              <span className="stat-label">Darslar</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">10K+</span>
              <span className="stat-label">O'quvchilar</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">5+</span>
              <span className="stat-label">Tillar</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="code-preview">
            <div className="code-preview-header">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
              <span className="code-preview-title">main.py</span>
            </div>
            <pre className="code-preview-body">{`# EduCode Hub ga xush kelibsiz!
def salom(ism):
    return f"Salom, {ism}!"

print(salom("Yosh Muhandis"))
# → Salom, Yosh Muhandis!`}</pre>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Nima uchun EduCode Hub?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">⚡</span>
              <h3>Tezkor Editor</h3>
              <p>
                Brauzerda to'g'ridan-to'g'ri kod yozing va natijani darhol
                ko'ring
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📚</span>
              <h3>Interaktiv Kurslar</h3>
              <p>
                Python, JavaScript va boshqa tillarni bosqichma-bosqich
                o'rganing
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🏆</span>
              <h3>Leaderboard</h3>
              <p>
                Do'stlaringiz bilan raqobatlashing va reytingda yuqoriga chiqing
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🎯</span>
              <h3>Vazifalar</h3>
              <p>Amaliy vazifalar orqali bilimingizni mustahkamlang</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;