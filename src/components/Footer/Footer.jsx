import React from "react";
import { Link } from "react-router-dom";
import { FiGithub, FiSend, FiGlobe, FiHeart } from "react-icons/fi";
import "./Footer.css";

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="logo-icon">{"</>"}</span>
            <span className="logo-text">
              EduCode<span className="logo-accent">Hub</span>
            </span>
          </Link>
          <p className="footer-description">
            Dasturlashni interaktiv va amaliy tarzda o'rganing. Onlayn editor,
            sifatli kurslar va faol dasturchilar hamjamiyati.
          </p>
          <div className="footer-socials">
            <a
              href="https://t.me/azizbek_it_dev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
            >
              <FiSend size={18} />
            </a>
            <a
              href="https://github.com/Azizbek432"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FiGithub size={18} />
            </a>
            <a
              href="https://educodehub.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website"
            >
              <FiGlobe size={18} />
            </a>
          </div>
        </div>

        <div className="footer-links-group">
          <div className="footer-column">
            <h4>Platforma</h4>
            <Link to="/courses">Kurslar</Link>
            <Link to="/editor">Onlayn Editor</Link>
            <Link to="/leaderboard">Reyting</Link>
          </div>

          <div className="footer-column">
            <h4>Resurslar</h4>
            <a href="https://t.me/azizbek_it_dev" target="_blank" rel="noreferrer">
              Telegram Channel
            </a>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>© {new Date().getFullYear()} EduCode Hub. Barcha huquqlar himoyalangan.</p>
          <p className="footer-created-by">
            Mehr bilan yaratilgan <FiHeart color="#e11d48" size={14} style={{ margin: "0 4px" }} /> Azizbek tomonidan
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;