import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // <a> o'rniga Link ishlashimiz kerak
import "./Home.css";

function Home() {
  const [code, setCode] = useState("print('Salom, Yosh Muhandis!')");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    setIsLoading(true);
    setIsError(false);
    setOutput("");
    try {
      const response = await axios.post("http://127.0.0.1:8000/code/run", {
        code: code,
      });
      setOutput(response.data.output);
      setIsError(response.data.error);
    } catch (error) {
      console.error(error);
      setOutput("Xatolik: Backend bilan aloqa yo'q!");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* KERAKLI JOYI: Fragment (<>) o'rniga 'home-page' klassli div qo'shdik */
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
            {/* Link ishlatish sahifa yangilanmasligini ta'minlaydi */}
            <Link to="/register" className="hero-btn-primary">
              Bepul boshlash →
            </Link>
            <a href="#editor" className="hero-btn-secondary">
              Editorni ko'rish
            </a>
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

      <section className="editor-section-wrapper" id="editor">
        <div className="container">
          <h2 className="section-title">Online Python Editor</h2>
          <p className="section-subtitle">
            Hech narsa o'rnatmasdan brauzerda kod yozing
          </p>
          <div className="editor-section">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              disabled={isLoading}
            />
            <button className="run-btn" onClick={runCode} disabled={isLoading}>
              {isLoading ? "Ishlamoqda..." : "Kodni ishga tushirish ▶"}
            </button>
          </div>
          {output && (
            <div className={`output-box ${isError ? "output-error" : ""}`}>
              <strong>{isError ? "Xatolik:" : "Natija:"}</strong>
              <pre>{output}</pre>
            </div>
          )}
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
    </div> /* home-page div yopildi */
  );
}

export default Home;
