import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar({ darkMode, toggleDark }) {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      const savedUser = localStorage.getItem("username");
      if (savedUser !== username) {
        setUsername(savedUser);
      }
    };

    checkUser();
    const interval = setInterval(checkUser, 1000);
    return () => clearInterval(interval);
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">{"</>"}</span>
          <span className="logo-text">
            EduCode<span className="logo-accent">Hub</span>
          </span>
        </Link>

        <ul className="navbar-links">
          <li>
            <Link to="/courses">Kurslar</Link>
          </li>
          <li>
            <Link to="/">Editor</Link>
          </li>
          <li>
            <Link to="/leaderboard">Leaderboard</Link>
          </li>
          {username && (
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          )}
        </ul>

        <div className="navbar-right">
          <button className="theme-toggle" onClick={toggleDark}>
            {darkMode ? "☀️" : "🌙"}
          </button>

          {username ? (
            <div className="user-menu">
              <span className="welcome-msg">Salom, {username}!</span>
              <button onClick={handleLogout} className="btn-logout">
                Chiqish
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-login">
                Kirish
              </Link>
              <Link to="/register" className="btn-register">
                Ro'yxatdan o'tish
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
